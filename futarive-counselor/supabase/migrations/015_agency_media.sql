-- ============================================================
-- 015_agency_media.sql
-- 相談所の写真リール（複数画像）と Storage bucket を追加
-- ============================================================
-- 目的：
-- 相談所が「店内・カウンセリングルーム・スタッフ集合写真」等を
-- 1〜5 枚アップロードして、お客様画面の詳細ヒーロー直下に
-- 1 枚ずつスワイプ可能な「リール式」で表示できるようにする。
-- counselor_media と同型のスキーマ・RLS・Storage policy。
--
-- 既存:
--   agencies.logo_url … 相談所のロゴ/プロフィール画像URL（既存カラム）。
--                       agency-media バケットに上げる前提でこの列は流用する。
--
-- 新規:
--   public.agency_media   テーブル（リール画像メタデータ）
--   storage.buckets       'agency-media' バケット（公開読み取り）
--   Storage RLS policies  オーナーのみアップロード/更新/削除可
--
-- 使い方：Supabase ダッシュボード > SQL Editor で本ファイルを実行。
-- ============================================================

-- 1. agency_media テーブル
create table if not exists public.agency_media (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image','video')),
  caption text,
  display_order integer not null default 0,
  fallback_bg text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_agency_media_agency_order
  on public.agency_media (agency_id, display_order);

comment on table public.agency_media is
  '相談所のリール画像。お客様画面の /agencies/[id] ヒーロー直下に 1 枚ずつスワイプ表示される。';

-- 2. RLS（counselor_media と同方針）
alter table public.agency_media enable row level security;

drop policy if exists agency_media_select_public on public.agency_media;
create policy agency_media_select_public
  on public.agency_media
  for select
  using (true);

drop policy if exists agency_media_owner_insert on public.agency_media;
create policy agency_media_owner_insert
  on public.agency_media
  for insert
  with check (
    exists (
      select 1 from public.agencies a
      where a.id = agency_id and a.owner_user_id = auth.uid()
    )
  );

drop policy if exists agency_media_owner_update on public.agency_media;
create policy agency_media_owner_update
  on public.agency_media
  for update
  using (
    exists (
      select 1 from public.agencies a
      where a.id = agency_id and a.owner_user_id = auth.uid()
    )
  );

drop policy if exists agency_media_owner_delete on public.agency_media;
create policy agency_media_owner_delete
  on public.agency_media
  for delete
  using (
    exists (
      select 1 from public.agencies a
      where a.id = agency_id and a.owner_user_id = auth.uid()
    )
  );

-- 3. Storage bucket（公開読み取り）
insert into storage.buckets (id, name, public)
values ('agency-media', 'agency-media', true)
on conflict (id) do nothing;

-- 4. Storage RLS（パス先頭フォルダ = agency_id の所有者のみ書き込み可）
drop policy if exists agency_media_storage_select on storage.objects;
create policy agency_media_storage_select
  on storage.objects
  for select
  using (bucket_id = 'agency-media');

drop policy if exists agency_media_storage_insert on storage.objects;
create policy agency_media_storage_insert
  on storage.objects
  for insert
  with check (
    bucket_id = 'agency-media'
    and exists (
      select 1 from public.agencies a
      where a.id::text = (storage.foldername(name))[1]
        and a.owner_user_id = auth.uid()
    )
  );

drop policy if exists agency_media_storage_update on storage.objects;
create policy agency_media_storage_update
  on storage.objects
  for update
  using (
    bucket_id = 'agency-media'
    and exists (
      select 1 from public.agencies a
      where a.id::text = (storage.foldername(name))[1]
        and a.owner_user_id = auth.uid()
    )
  );

drop policy if exists agency_media_storage_delete on storage.objects;
create policy agency_media_storage_delete
  on storage.objects
  for delete
  using (
    bucket_id = 'agency-media'
    and exists (
      select 1 from public.agencies a
      where a.id::text = (storage.foldername(name))[1]
        and a.owner_user_id = auth.uid()
    )
  );
