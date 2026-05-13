-- Kinda ふたりへ — reviews に user_id を追加
-- マイグレーション 018 の後に実行
--
-- 新規口コミ投稿時に auth.uid() を埋める。
-- 過去データは NULL のまま放置（手動マッピングしない方針）。
-- 表示時は profiles.nickname を JOIN してニックネーム表示。

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_user_id_created
  ON reviews(user_id, created_at DESC);

COMMENT ON COLUMN reviews.user_id IS '投稿者の auth.users.id。新規投稿時に auth.uid() を埋める。過去データは NULL。';
