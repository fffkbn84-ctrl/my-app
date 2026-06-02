-- Migration 032: ユーザー側キャンセルの取り消し（UNDO）用RPC
-- 適用済み: 2026-06-01（Supabase に apply_migration で先行適用済み。本ファイルは履歴整合のための記録）
--
-- cancel_reservation_rpc の処理を反転する。
--   - 本人(user)が・5分以内に・自分でキャンセルした予約のみ復元可
--   - slot が空いている(open)場合のみ再 booked。他の人に取られていたら slot_taken
--   - billing は「猶予内キャンセルで voided」になったものだけ pending に戻す
-- 呼び出し: src/lib/reservations.ts の undoCancelReservationViaRpc

CREATE OR REPLACE FUNCTION public.undo_cancel_reservation_rpc(p_reservation_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_res  reservations%ROWTYPE;
  v_bill billing_events%ROWTYPE;
  v_slot_ok boolean := true;
BEGIN
  -- 予約を排他ロックで取得
  SELECT * INTO v_res
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_found');
  END IF;

  -- キャンセル済みでなければ対象外
  IF v_res.status != 'canceled' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_canceled', 'current_status', v_res.status);
  END IF;

  -- 本人がユーザー操作でキャンセルした予約のみ復元可
  IF v_res.cancelled_by IS DISTINCT FROM 'user' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_user_cancelled');
  END IF;
  IF v_res.user_id IS DISTINCT FROM auth.uid() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unauthorized');
  END IF;

  -- UNDO 可能なのはキャンセルから5分以内
  IF v_res.canceled_at IS NULL OR v_res.canceled_at < now() - interval '5 minutes' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'undo_window_expired');
  END IF;

  -- slot を再度押さえる（open の時だけ booked に。取られていたら失敗）
  IF v_res.slot_id IS NOT NULL THEN
    UPDATE slots
    SET status = 'booked', updated_at = now()
    WHERE id = v_res.slot_id AND status = 'open';
    IF NOT FOUND THEN
      v_slot_ok := false;
    END IF;
  END IF;

  IF NOT v_slot_ok THEN
    RETURN jsonb_build_object('ok', false, 'error', 'slot_taken');
  END IF;

  -- 予約を active に復元
  UPDATE reservations
  SET
    status       = 'active',
    canceled_at  = NULL,
    cancelled_by = NULL,
    updated_at   = now()
  WHERE id = p_reservation_id;

  -- billing を復元（猶予内キャンセルで voided にしたものだけ pending に戻す）
  SELECT * INTO v_bill
  FROM billing_events
  WHERE reservation_id = p_reservation_id
  FOR UPDATE;

  IF v_bill.id IS NOT NULL
     AND v_bill.status = 'voided'
     AND v_bill.void_reason = 'cancelled_within_grace' THEN
    UPDATE billing_events
    SET
      status      = 'pending',
      voided_at   = NULL,
      void_reason = NULL,
      updated_at  = now()
    WHERE id = v_bill.id;
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.undo_cancel_reservation_rpc(uuid) TO authenticated;
