-- ============================================================
-- 011_tighten_reservations_rls.sql
-- reservations の RLS を厳密化
-- ============================================================
-- 旧 auth_all_reservations は認証ユーザーが全予約にアクセスできる
-- 過度に緩いポリシーだったため削除し、以下の役割ごとのポリシーに
-- 置き換える:
--
--   1. ユーザー本人（user_id = auth.uid()）:
--      自分の予約を SELECT/INSERT/UPDATE
--      → 既存の "users * own reservations" ポリシーで対応済み
--
--   2. カウンセラー本人（counselors.owner_user_id = auth.uid()）:
--      自分の counselor_id の予約を SELECT/UPDATE
--
--   3. 相談所オーナー（agencies.owner_user_id = auth.uid()）:
--      自分の agencies に紐づく予約（agency_id 直接または
--      counselor_id 経由）を SELECT/UPDATE
--
-- DELETE は誰にも許可しない（論理キャンセル status='canceled' を使う）
--
-- 使い方: Supabase ダッシュボード > SQL Editor で実行
--         （MCP の apply_migration 経由で 2026-05-11 適用済み）
-- ============================================================

-- RLS パフォーマンス用の追加インデックス
CREATE INDEX IF NOT EXISTS idx_reservations_counselor_id
  ON public.reservations (counselor_id)
  WHERE counselor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reservations_agency_id
  ON public.reservations (agency_id)
  WHERE agency_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_counselors_agency_id
  ON public.counselors (agency_id)
  WHERE agency_id IS NOT NULL;

-- 過度に緩いポリシーを削除
DROP POLICY IF EXISTS auth_all_reservations ON public.reservations;

-- カウンセラー本人: SELECT
DROP POLICY IF EXISTS counselor_select_own_reservations ON public.reservations;
CREATE POLICY counselor_select_own_reservations
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (
    counselor_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.counselors c
      WHERE c.id = reservations.counselor_id
        AND c.owner_user_id = auth.uid()
    )
  );

-- カウンセラー本人: UPDATE
DROP POLICY IF EXISTS counselor_update_own_reservations ON public.reservations;
CREATE POLICY counselor_update_own_reservations
  ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (
    counselor_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.counselors c
      WHERE c.id = reservations.counselor_id
        AND c.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    counselor_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.counselors c
      WHERE c.id = reservations.counselor_id
        AND c.owner_user_id = auth.uid()
    )
  );

-- 相談所オーナー: SELECT
-- agency_id 直接指定、または counselor_id 経由で agency 所有
DROP POLICY IF EXISTS agency_owner_select_reservations ON public.reservations;
CREATE POLICY agency_owner_select_reservations
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (
    (
      agency_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.agencies a
        WHERE a.id = reservations.agency_id
          AND a.owner_user_id = auth.uid()
      )
    )
    OR
    (
      counselor_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.counselors c
        JOIN public.agencies a ON a.id = c.agency_id
        WHERE c.id = reservations.counselor_id
          AND a.owner_user_id = auth.uid()
      )
    )
  );

-- 相談所オーナー: UPDATE
DROP POLICY IF EXISTS agency_owner_update_reservations ON public.reservations;
CREATE POLICY agency_owner_update_reservations
  ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (
    (
      agency_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.agencies a
        WHERE a.id = reservations.agency_id
          AND a.owner_user_id = auth.uid()
      )
    )
    OR
    (
      counselor_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.counselors c
        JOIN public.agencies a ON a.id = c.agency_id
        WHERE c.id = reservations.counselor_id
          AND a.owner_user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    (
      agency_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.agencies a
        WHERE a.id = reservations.agency_id
          AND a.owner_user_id = auth.uid()
      )
    )
    OR
    (
      counselor_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.counselors c
        JOIN public.agencies a ON a.id = c.agency_id
        WHERE c.id = reservations.counselor_id
          AND a.owner_user_id = auth.uid()
      )
    )
  );
