-- Kinda ふたりへ — favorites の target_type に 'story' / 'voice' を追加
-- マイグレーション 019 の後に実行
--
-- Kinda story（エピソード）と Kinda voices（コラム）の共感保存に対応。
-- 005 で 'place' を追加した時と同パターン。

ALTER TABLE favorites
  DROP CONSTRAINT IF EXISTS favorites_target_type_check;

ALTER TABLE favorites
  ADD CONSTRAINT favorites_target_type_check
  CHECK (target_type IN ('counselor', 'agency', 'place', 'story', 'voice'));
