-- 047_notify_signups_unique_per_source.sql
-- お知らせ登録を「どこで登録したか（source）」ごとに持てるようにする。
-- 041 の一意制約は lower(email) だけで、Kinda talk で登録済みの人が Kinda pair でも
-- 登録すると 23505 で黙って捨てられていた。場所ごとにお知らせの約束が違うため、
-- (lower(email), source) で一意にする。RLS は 041 のまま（有効・ポリシーなし）。
-- ※ 本番 DB へは Supabase MCP apply_migration で適用（このファイルは記録用）。

drop index if exists public.notify_signups_email_lower_key;

create unique index if not exists notify_signups_email_lower_source_key
  on public.notify_signups (lower(email), source);
