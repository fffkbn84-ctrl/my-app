-- Migration 030: Pass 6 Part 1
-- RLS ガード：カウンセラーはキャンセル確定済み予約を読めない（個人情報保護）
-- 適用済み: 2026-05-30

-- 重複していた既存ポリシーを削除
DROP POLICY IF EXISTS "counselor reads own reservations" ON reservations;
DROP POLICY IF EXISTS "counselor_select_own_reservations" ON reservations;

-- 新ポリシー: キャンセル確定済み予約は閲覧不可
-- キャンセル確定 = status='canceled' かつ reschedule_status が NULL or 'expired'
-- reschedule_status='approved' の場合（日程変更が了承された元予約）は閲覧可
CREATE POLICY "counselor_select_reservations_pii_guard"
ON reservations FOR SELECT
TO authenticated
USING (
  (counselor_id IS NOT NULL)
  AND EXISTS (
    SELECT 1 FROM counselors c
    WHERE c.id = reservations.counselor_id
      AND c.owner_user_id = auth.uid()
  )
  AND NOT (
    status = 'canceled'
    AND (reschedule_status IS NULL OR reschedule_status = 'expired')
  )
);
