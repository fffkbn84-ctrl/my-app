-- ============================================================
-- counselor-media Storage バケット作成と RLS ポリシー
-- ============================================================
-- 使い方：Supabase ダッシュボード > SQL Editor で本ファイルを実行、
-- または Supabase CLI で `supabase db push` する。
--
-- バケット構成：
--   counselor-media / {counselor_id}/profile-xxx.jpg   プロフィール写真
--   counselor-media / {counselor_id}/reel-xxx.jpg      リール画像
--
-- ポリシー：
--   - 公開バケット（誰でも閲覧可）。URLが分かれば誰でも画像を取得可能。
--   - アップロード・更新・削除は、自分が owner_user_id となっている
--     counselor の id フォルダ配下のみ許可。
-- ============================================================

-- 1. バケット作成（既にあれば何もしない）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'counselor-media',
  'counselor-media',
  true,
  5242880, -- 5MB
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. 既存ポリシーを削除してから作り直し（冪等化）
drop policy if exists "counselor-media public read" on storage.objects;
drop policy if exists "counselor-media owner insert" on storage.objects;
drop policy if exists "counselor-media owner update" on storage.objects;
drop policy if exists "counselor-media owner delete" on storage.objects;

-- 3. 公開閲覧ポリシー
create policy "counselor-media public read"
on storage.objects for select
to public
using ( bucket_id = 'counselor-media' );

-- 4. 自分のカウンセラーフォルダに限り書き込み可
--    パスの先頭フォルダが counselors.id = auth.uid() の所有行の id と一致するかで判定
create policy "counselor-media owner insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'counselor-media'
  and (storage.foldername(name))[1] in (
    select id::text from public.counselors where owner_user_id = auth.uid()
  )
);

create policy "counselor-media owner update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'counselor-media'
  and (storage.foldername(name))[1] in (
    select id::text from public.counselors where owner_user_id = auth.uid()
  )
)
with check (
  bucket_id = 'counselor-media'
  and (storage.foldername(name))[1] in (
    select id::text from public.counselors where owner_user_id = auth.uid()
  )
);

create policy "counselor-media owner delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'counselor-media'
  and (storage.foldername(name))[1] in (
    select id::text from public.counselors where owner_user_id = auth.uid()
  )
);
