-- ふたりへ — favorites（気になる）テーブル新規作成
-- 002 / 003 の次に実行してください
--
-- 認証済みユーザーが「気になる」したカウンセラー・相談所を保存。
-- 未ログイン時は localStorage に保存し、ログイン時に DB へ同期する想定。

-- ===== favorites（気になる）テーブル =====
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('counselor', 'agency')),
  /** mock 段階は数値文字列、Supabase 移行後は UUID 文字列。両方収容するため TEXT */
  target_id   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  /** 同一ユーザー × 同一対象は 1 行のみ */
  UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_type
  ON favorites(user_id, target_type, created_at DESC);

-- ===== Row Level Security =====
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 自分の favorites のみ参照可
DROP POLICY IF EXISTS "users read own favorites" ON favorites;
CREATE POLICY "users read own favorites" ON favorites
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 自分の行のみ INSERT 可
DROP POLICY IF EXISTS "users insert own favorites" ON favorites;
CREATE POLICY "users insert own favorites" ON favorites
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 自分の行のみ DELETE 可
DROP POLICY IF EXISTS "users delete own favorites" ON favorites;
CREATE POLICY "users delete own favorites" ON favorites
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
