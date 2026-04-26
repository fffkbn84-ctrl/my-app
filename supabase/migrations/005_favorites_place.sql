-- ふたりへ — favorites の target_type に 'place' を追加
-- 004_favorites.sql の後に実行してください
--
-- Kinda act / Kinda glow のお店も「気になる」保存できるよう、
-- favorites.target_type の CHECK 制約を拡張する。

-- 既存の CHECK 制約を一旦削除
ALTER TABLE favorites
  DROP CONSTRAINT IF EXISTS favorites_target_type_check;

-- 新しい CHECK 制約を追加（place を含む）
ALTER TABLE favorites
  ADD CONSTRAINT favorites_target_type_check
  CHECK (target_type IN ('counselor', 'agency', 'place'));
