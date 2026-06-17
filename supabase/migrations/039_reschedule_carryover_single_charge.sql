-- 039: 日程変更の課金モデルを「一回課金の引き継ぎ」に統一
--
-- 方針（ふうか確定 2026-06-17）：送客料 ¥5,000 は1リードにつき一度だけ。
-- 日程変更は同じリードなので追加課金・返金はしない。元予約の決済を新予約へ引き継ぐ。
--
-- 変更点：
-- 1) request_reschedule_rpc：申請時の billing void（旧「申請時即時返金」設計）を廃止。
--    決済・請求はそのまま保持し、了承時に新予約へ引き継ぐ。
-- 2) approve_reschedule_rpc：
--    - 新予約に paid_at / stripe_payment_intent_id / stripe_refund_id / user_info_visible を引き継ぐ。
--    - 元予約が支払い済み（未返金）なら新 billing_events を confirmed+paid に更新。
--    - 元 billing_events は voided（void_reason='rescheduled'）にして台帳を新予約1件へ集約。
--    - Stripe 参照（payment_intent / refund）は新予約へ一本化（元予約からは外す）。
--    ※ billing_events 行自体の生成は trg_billing_events_create（INSERT トリガー）に一本化済み（038）。

CREATE OR REPLACE FUNCTION public.request_reschedule_rpc(p_reservation_id uuid, p_requested_by text, p_proposed_start timestamp with time zone, p_proposed_end timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_res  reservations%ROWTYPE;
BEGIN
  IF p_requested_by NOT IN ('user', 'counselor') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_requested_by');
  END IF;

  SELECT * INTO v_res
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_found');
  END IF;

  IF v_res.status != 'active' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_active');
  END IF;

  IF v_res.reschedule_status IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'reschedule_already_pending');
  END IF;

  IF p_requested_by = 'user' AND v_res.user_id IS DISTINCT FROM auth.uid() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
  END IF;
  IF p_requested_by = 'counselor' THEN
    IF NOT EXISTS (
      SELECT 1 FROM counselors
      WHERE id = v_res.counselor_id AND owner_user_id = auth.uid()
    ) THEN
      RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
    END IF;
  END IF;

  -- 日程変更申請を記録（決済・billing はそのまま保持＝了承時に新予約へ引き継ぐ）
  UPDATE reservations
  SET
    reschedule_status        = 'requested',
    reschedule_requested_by  = p_requested_by,
    reschedule_requested_at  = now(),
    reschedule_expires_at    = now() + interval '7 days',
    reschedule_proposed_start = p_proposed_start,
    reschedule_proposed_end   = p_proposed_end,
    updated_at               = now()
  WHERE id = p_reservation_id;

  RETURN jsonb_build_object(
    'ok',        true,
    'expires_at', (now() + interval '7 days')::text
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.approve_reschedule_rpc(p_reservation_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_res        reservations%ROWTYPE;
  v_new_res_id uuid;
BEGIN
  SELECT * INTO v_res
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_found');
  END IF;

  IF v_res.reschedule_status != 'requested' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_in_requested_state');
  END IF;

  IF v_res.reschedule_expires_at < now() THEN
    UPDATE reservations
    SET reschedule_status = 'expired', updated_at = now()
    WHERE id = p_reservation_id;
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;

  IF v_res.reschedule_requested_by = 'counselor' THEN
    IF v_res.user_id IS DISTINCT FROM auth.uid() THEN
      RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
    END IF;
  ELSIF v_res.reschedule_requested_by = 'user' THEN
    IF NOT EXISTS (
      SELECT 1 FROM counselors
      WHERE id = v_res.counselor_id AND owner_user_id = auth.uid()
    ) THEN
      RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
    END IF;
  END IF;

  -- 元予約に approved を記録（status は active のまま。一覧側で approved を除外して二重表示を防ぐ）
  UPDATE reservations
  SET
    reschedule_status      = 'approved',
    reschedule_approved_at = now(),
    updated_at             = now()
  WHERE id = p_reservation_id;

  -- 新予約を作成（提案日時で）。決済情報を引き継ぐ（追加課金なし）。
  INSERT INTO reservations (
    user_id, counselor_id, counselor_name,
    agency_id, agency_name, user_name, user_email, user_phone,
    notes, start_at, end_at, meeting_type, status,
    original_reservation_id,
    paid_at, stripe_payment_intent_id, stripe_refund_id, user_info_visible
  )
  VALUES (
    v_res.user_id, v_res.counselor_id, v_res.counselor_name,
    v_res.agency_id, v_res.agency_name, v_res.user_name, v_res.user_email, v_res.user_phone,
    v_res.notes,
    v_res.reschedule_proposed_start,
    v_res.reschedule_proposed_end,
    v_res.meeting_type, 'active',
    p_reservation_id,
    v_res.paid_at, v_res.stripe_payment_intent_id, v_res.stripe_refund_id, v_res.user_info_visible
  )
  RETURNING id INTO v_new_res_id;

  -- 元予約が支払い済み（未返金）なら、新 billing を confirmed+paid に引き継ぐ
  IF v_res.paid_at IS NOT NULL AND v_res.refunded_at IS NULL THEN
    UPDATE billing_events
    SET status = 'confirmed', paid_at = v_res.paid_at, updated_at = now()
    WHERE reservation_id = v_new_res_id;
  END IF;

  -- 元 billing は superseded（無効化）。請求台帳は新予約の1件に集約。
  UPDATE billing_events
  SET status = 'voided', voided_at = now(), void_reason = 'rescheduled', updated_at = now()
  WHERE reservation_id = p_reservation_id AND status IN ('pending', 'confirmed');

  -- Stripe 参照は新予約に一本化（返金時の予約特定が重複しないように元から外す）
  UPDATE reservations
  SET stripe_payment_intent_id = NULL, stripe_refund_id = NULL, updated_at = now()
  WHERE id = p_reservation_id;

  RETURN jsonb_build_object(
    'ok',                 true,
    'new_reservation_id', v_new_res_id
  );
END;
$function$;
