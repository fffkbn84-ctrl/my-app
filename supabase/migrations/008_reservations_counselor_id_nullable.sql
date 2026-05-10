-- Kinda — reservations.counselor_id を nullable に変更
-- 007 の次に実行してください。
--
-- 背景:
--   /counselors/[id] の hardcoded モックページ（id: 1〜6, 101〜105 など数値）から
--   予約フローに入った場合、counselor_id を Supabase の UUID に解決できない。
--   この場合は counselor_id=NULL + counselor_name のみ保存し、
--   本物の UUID counselor の予約とは区別する運用にする。

ALTER TABLE reservations ALTER COLUMN counselor_id DROP NOT NULL;
