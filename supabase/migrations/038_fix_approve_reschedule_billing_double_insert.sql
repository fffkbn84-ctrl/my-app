-- 038: approve_reschedule_rpc の billing_events 二重 INSERT を解消
--
-- 症状: 日程変更の「了承」で
--   duplicate key value violates unique constraint "billing_events_reservation_id_key"
--
-- 原因: 新予約 INSERT 時に trg_billing_events_create
--   (billing_events_create_from_reservation) が billing_events を自動生成する。
--   一方 approve_reschedule_rpc も手動で同じ billing_events を INSERT していたため
--   reservation_id が重複し unique 制約に違反していた（トリガーは Stripe 期に
--   後から追加されたため RPC の手動 INSERT が冗長化していた）。
--
-- 修正: RPC 内の手動 billing_events INSERT を削除し、生成はトリガーに一本化する。
--   トリガー関数は同一パラメータ（amount 5000 / status pending / grace_until now+24h /
--   reservation_at = start_at）で冪等ガード付きのため等価。

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

  -- 期限切れチェック
  IF v_res.reschedule_expires_at < now() THEN
    UPDATE reservations
    SET reschedule_status = 'expired', updated_at = now()
    WHERE id = p_reservation_id;
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;

  -- 認証チェック（承認するのは申請した側の「相手」）
  IF v_res.reschedule_requested_by = 'counselor' THEN
    -- ユーザーが承認
    IF v_res.user_id IS DISTINCT FROM auth.uid() THEN
      RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
    END IF;
  ELSIF v_res.reschedule_requested_by = 'user' THEN
    -- カウンセラーが承認
    IF NOT EXISTS (
      SELECT 1 FROM counselors
      WHERE id = v_res.counselor_id AND owner_user_id = auth.uid()
    ) THEN
      RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
    END IF;
  END IF;

  -- 元予約に approved を記録
  UPDATE reservations
  SET
    reschedule_status      = 'approved',
    reschedule_approved_at = now(),
    updated_at             = now()
  WHERE id = p_reservation_id;

  -- 新予約を作成（提案日時で）。status='active' のため
  -- trg_billing_events_create が billing_events を自動生成する。
  INSERT INTO reservations (
    user_id, counselor_id, counselor_name,
    agency_id, agency_name, user_name, user_email, user_phone,
    notes, start_at, end_at, meeting_type, status,
    original_reservation_id
  )
  SELECT
    user_id, counselor_id, counselor_name,
    agency_id, agency_name, user_name, user_email, user_phone,
    notes,
    v_res.reschedule_proposed_start,
    v_res.reschedule_proposed_end,
    meeting_type, 'active',
    p_reservation_id
  FROM reservations
  WHERE id = p_reservation_id
  RETURNING id INTO v_new_res_id;

  -- billing_events はトリガーに一本化（手動 INSERT は重複違反になるため廃止）。

  RETURN jsonb_build_object(
    'ok',                 true,
    'new_reservation_id', v_new_res_id
  );
END;
$function$;
