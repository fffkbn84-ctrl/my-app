-- Migration 031: Pass 6 Part 2
-- 期限切れ日程変更申請の自動キャンセル関数 + pg_cron スケジュール
-- 適用済み: 2026-05-30

-- 自動キャンセル関数
CREATE OR REPLACE FUNCTION auto_cancel_expired_reschedules()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_count integer := 0;
  r_row record;
BEGIN
  FOR r_row IN
    SELECT id, slot_id
    FROM reservations
    WHERE status = 'active'
      AND reschedule_status = 'requested'
      AND reschedule_expires_at < now()
  LOOP
    -- 予約をシステムキャンセル
    UPDATE reservations
    SET
      status = 'canceled',
      cancelled_by = 'system',
      reschedule_status = 'expired',
      canceled_at = now(),
      updated_at = now()
    WHERE id = r_row.id;

    -- 元の slot を open に戻す
    IF r_row.slot_id IS NOT NULL THEN
      UPDATE slots
      SET status = 'open', updated_at = now()
      WHERE id = r_row.slot_id;
    END IF;

    affected_count := affected_count + 1;
  END LOOP;

  RETURN affected_count;
END;
$$;

-- pg_cron: 毎日 UTC 02:00（JST 11:00）に実行
DO $$
BEGIN
  PERFORM cron.unschedule('auto-cancel-expired-reschedules');
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

SELECT cron.schedule(
  'auto-cancel-expired-reschedules',
  '0 2 * * *',
  'SELECT auto_cancel_expired_reschedules()'
);
