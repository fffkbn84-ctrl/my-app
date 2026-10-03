-- 045_shops_slug.sql
-- お店の詳細ページを UUID ではなく店名の URL（/places/<slug>）で出すための列（2026-10-03）。
-- 検索で見つけてもらうため。旧 UUID の URL は slug へ 301 で転送する（アプリ側）。
-- slug は一度決めたら原則変えない（変えると検索の評価を引き継ぎ直しになる）。
-- 新規掲載時は Claude が取材ログの「slug」欄から埋める（docs/guides/kinda-act-log.md）。
-- ※ 本番 DB へは Supabase MCP apply_migration で適用済み（このファイルは記録用）。

alter table public.shops
  add column if not exists slug text;

alter table public.shops
  drop constraint if exists shops_slug_format_check;

-- 英小文字・数字・ハイフンのみ。UUID と取り違えないよう 36 文字の UUID 形は不可。
alter table public.shops
  add constraint shops_slug_format_check
  check (
    slug is null
    or (
      slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      and slug !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    )
  );

create unique index if not exists shops_slug_key on public.shops (slug);

update public.shops set slug = v.slug
from (values
  ('dc483116-0e40-4cc3-a59c-8ffe85877615'::uuid, 'rendezvous-lounge-imperial-hotel-tokyo'),
  ('8ef4d4ff-9728-47f9-a2f5-ded9138ac977'::uuid, 'pisola-yokohama-mutsumicho'),
  ('5fcf87dc-1391-4d89-b7a4-2f84d1bf4903'::uuid, 'ginza-bansuke-shinjuku-takashimaya'),
  ('363524dd-a502-4ad1-a103-7a888739af98'::uuid, 'musashino-mori-coffee-kugahara'),
  ('5ac6a1fc-c131-487e-91c6-a062443c48a0'::uuid, 'odashimon-tressa-yokohama'),
  ('8f7b4b88-b00a-44da-9188-a81f37adcdca'::uuid, 'rie-coffee-honten'),
  ('3954ba2c-c850-47d4-890f-0cb96a6695f0'::uuid, 'fiorentina-grand-hyatt-tokyo'),
  ('8241c6dc-eee0-44ef-b23d-a848f913bdf6'::uuid, 'french-kitchen-grand-hyatt-tokyo'),
  ('99f6fbaf-fb21-420d-8ea0-48ed6f72bc07'::uuid, 'myojinshita-kandagawa-honten'),
  ('69a34e2d-520e-43c5-b9ad-80dc8d870b70'::uuid, 'kushiba-yokohama-world-porters')
) as v(id, slug)
where public.shops.id = v.id;
