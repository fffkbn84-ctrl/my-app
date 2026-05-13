-- Kinda — カウンセラー/相談所オーナーが自分の予約を読める / 面談完了マーキングできるよう RLS 拡張
-- 016 の次に実行する。
--
-- 背景:
--   ・007 で reservations.status は 'active' | 'canceled' | 'completed' を許容済み。
--   ・しかし RLS は user_id = auth.uid()（予約者本人）にしか SELECT / UPDATE を許可していなかった。
--   ・面談完了は「予約者本人」ではなく「担当カウンセラー or 相談所オーナー」が押す（Hot Pepper Beauty 方式）。
--   ・したがって counselors.owner_user_id か agencies.owner_user_id 経由で
--     SELECT / UPDATE を許可する追加ポリシーが必要。
--
-- セキュリティ上の補足:
--   ・UPDATE 可能な範囲を絞り込むため WITH CHECK にも同じ条件を入れる。
--   ・実際に "completed" 以外への書き戻し（例: completed → active 巻き戻し）はアプリ層で制限し、
--     DB レベルでは UPDATE 全般を許可する（過去予約の補足メモ等を将来追加する余地のため）。

-- ============================================================
-- 1. SELECT 拡張：自分が担当のカウンセラー or 自社相談所の予約を読める
-- ============================================================

DROP POLICY IF EXISTS "counselor reads own reservations" ON reservations;
CREATE POLICY "counselor reads own reservations" ON reservations
  FOR SELECT TO authenticated
  USING (
    counselor_id IN (
      SELECT id FROM counselors WHERE owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "agency owner reads own reservations" ON reservations;
CREATE POLICY "agency owner reads own reservations" ON reservations
  FOR SELECT TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_user_id = auth.uid()
    )
  );

-- ============================================================
-- 2. UPDATE 拡張：カウンセラー / 相談所オーナーが面談完了等を更新できる
-- ============================================================

DROP POLICY IF EXISTS "counselor updates own reservations" ON reservations;
CREATE POLICY "counselor updates own reservations" ON reservations
  FOR UPDATE TO authenticated
  USING (
    counselor_id IN (
      SELECT id FROM counselors WHERE owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    counselor_id IN (
      SELECT id FROM counselors WHERE owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "agency owner updates own reservations" ON reservations;
CREATE POLICY "agency owner updates own reservations" ON reservations
  FOR UPDATE TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_user_id = auth.uid()
    )
  );

-- ============================================================
-- 3. completed_at カラム（誰がいつ完了マークしたか記録）
-- ============================================================
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

COMMENT ON COLUMN reservations.completed_at IS
  '面談完了マークがついた時刻。NULL の場合は未完了。'
  'status=completed と一緒にセットする運用。';
