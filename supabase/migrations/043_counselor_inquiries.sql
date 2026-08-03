-- 043_counselor_inquiries.sql
-- /for-counselors ランディングページの掲載お問い合わせ受け皿テーブル。
-- 書き込みは /api/for-counselors/inquiry（service_role）経由のみ。クライアント直書きは禁止のため
-- RLS 有効・ポリシーなし（service_role は RLS をバイパスする）。
-- SELECT は admin（futarive-admin）から service_role で行う想定。anon/authenticated には一切権限を付与しない。
-- ※ 本番 DB へは Supabase MCP apply_migration で適用済み（このファイルは記録用）。

create table if not exists public.counselor_inquiries (
  id            uuid primary key default gen_random_uuid(),
  agency_name   text not null,
  contact_name  text not null,
  email         text not null,
  phone         text,
  prefecture    text,
  website       text,
  message       text,
  status        text not null default 'new',   -- new / contacted / meeting / listed / declined
  admin_note    text,
  source        text default 'for-counselors',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS 有効・公開ポリシーなし＝service_role のサーバ経由でのみ読み書き可
alter table public.counselor_inquiries enable row level security;
