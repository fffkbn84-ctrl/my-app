-- Migration 033: 通知の既読時刻を profiles に保存（全端末同期）
-- 適用済み: 2026-06-01（apply_migration で先行適用済み・履歴整合のための記録）
--
-- これまで既読時刻は端末ローカル（localStorage）に保存していたため、
-- スマホで既読にしても PC では未読ドットが残っていた。
-- profiles.notifications_seen_at に保存し、全端末で既読を同期する。
-- 書き込みはクライアントからの upsert（profiles の本人 insert/update ポリシーで許可）。

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notifications_seen_at timestamptz;

COMMENT ON COLUMN public.profiles.notifications_seen_at IS
  '相談所からのお知らせを最後に確認した時刻。この時刻より新しい通知を未読として扱う（全端末同期）。';
