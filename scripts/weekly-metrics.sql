-- weekly-metrics.sql
-- Kinda 週次レポート用の集計クエリ。
-- Supabase SQL Editor に貼るか、Supabase MCP の execute_sql で流す。
-- project_id: lmxdhvmrtbzrbigzcnxs（Futarive）
--
-- 数え方の注意：
--   - 運営本人のアカウント（fffkbn84@gmail.com）は実ユーザーから除外して見る。
--   - oastify.com / burpcollaborator.net 等のドメインは脆弱性スキャナの使い捨て
--     アドレスなので実ユーザーではない。下のクエリでは bot_like として分離する。

-- ① お知らせメール登録（notify_signups）
select
  'notify_signups' as metric,
  count(*)                                                          as total,
  count(*) filter (where created_at >= now() - interval '7 days')   as last_7d,
  count(*) filter (where created_at >= now() - interval '30 days')  as last_30d,
  max(created_at)                                                   as latest_at
from public.notify_signups;

-- ② お知らせメール登録の流入元内訳
select source, count(*) as n, max(created_at) as latest
from public.notify_signups
group by source
order by n desc;

-- ③ マイページ登録（auth.users）
select
  'auth_users' as metric,
  count(*)                                                                     as total_raw,
  count(*) filter (
    where email <> 'fffkbn84@gmail.com'
      and email not like '%oastify.com'
      and email not like '%burpcollaborator.net'
  )                                                                            as total_real,
  count(*) filter (where email like '%oastify.com' or email like '%burpcollaborator.net')
                                                                               as bot_like,
  count(*) filter (where created_at >= now() - interval '7 days')              as new_7d,
  count(*) filter (where created_at >= now() - interval '30 days')             as new_30d,
  count(*) filter (where (raw_user_meta_data->>'marketing_emails_opt_in')::boolean is true)
                                                                               as marketing_opt_in,
  count(*) filter (where last_sign_in_at >= now() - interval '30 days')        as signed_in_30d
from auth.users;

-- ④ マイページ登録の週別推移（直近12週）
select date_trunc('week', created_at)::date as week, count(*) as n
from auth.users
where created_at >= now() - interval '12 weeks'
group by 1
order by 1;

-- ⑤ 今週の新規登録の中身（メールはマスクして表示）
select
  left(email, 3) || '***@' || split_part(email, '@', 2) as masked_email,
  created_at::date                                       as signed_up,
  last_sign_in_at::date                                  as last_seen,
  raw_user_meta_data->>'marketing_emails_opt_in'         as opt_in
from auth.users
where created_at >= now() - interval '7 days'
order by created_at;
