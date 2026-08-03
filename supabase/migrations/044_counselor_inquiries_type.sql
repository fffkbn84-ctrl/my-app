-- 044_counselor_inquiries_type.sql
-- /for-counselors の問い合わせに「用件」を追加。
-- interview = 取材について / listing = 掲載について / other = その他
-- 既存行（0件想定）は default 'interview' として扱う。
-- ※ 本番 DB へは Supabase MCP apply_migration で適用済み（このファイルは記録用）。

alter table public.counselor_inquiries
  add column if not exists inquiry_type text not null default 'interview';

alter table public.counselor_inquiries
  drop constraint if exists counselor_inquiries_inquiry_type_check;

alter table public.counselor_inquiries
  add constraint counselor_inquiries_inquiry_type_check
  check (inquiry_type in ('interview', 'listing', 'other'));

create index if not exists counselor_inquiries_inquiry_type_idx
  on public.counselor_inquiries (inquiry_type);
