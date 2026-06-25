-- 041_notify_signups.sql
-- Kinda talk 空状態の通知登録（メール獲得）用テーブル。
-- 書き込みは /api/notify（service_role）経由のみ。クライアント直書きは禁止のため
-- RLS 有効・ポリシーなし（service_role は RLS をバイパスする）。
-- ※ 本番 DB へは Supabase MCP apply_migration で適用済み（このファイルは記録用）。

create table if not exists public.notify_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'talk_empty',
  created_at timestamptz not null default now()
);

-- 大文字小文字を無視して重複防止
create unique index if not exists notify_signups_email_lower_key
  on public.notify_signups (lower(email));

-- RLS 有効・公開ポリシーなし＝service_role のサーバ経由でのみ書き込み可
alter table public.notify_signups enable row level security;
