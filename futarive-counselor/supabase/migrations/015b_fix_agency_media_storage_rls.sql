-- ============================================================
-- 015b_fix_agency_media_storage_rls.sql
-- 015 で書いた Storage policy のバグ修正
-- ============================================================
-- 旧: storage.foldername(a.name) ← agencies.name（相談所の名前）を見ていた
-- 新: storage.foldername(name)   ← storage.objects.name（アップロードファイル名）を見る
-- counselor-media policy と同型に揃える。
--
-- 症状: ロゴ・リール画像のアップロードが「new row violates row-level security policy」で全て失敗
-- 原因: agencies テーブルの相談所「名前」とフォルダ名（agency_id）を比較してたので
--       永遠に一致せず INSERT が弾かれていた
-- ============================================================

drop policy if exists agency_media_storage_insert on storage.objects;
create policy agency_media_storage_insert on storage.objects for insert
  with check (
    bucket_id = 'agency-media'
    and (storage.foldername(name))[1] in (
      select (agencies.id)::text from public.agencies
      where agencies.owner_user_id = auth.uid()
    )
  );

drop policy if exists agency_media_storage_update on storage.objects;
create policy agency_media_storage_update on storage.objects for update
  using (
    bucket_id = 'agency-media'
    and (storage.foldername(name))[1] in (
      select (agencies.id)::text from public.agencies
      where agencies.owner_user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'agency-media'
    and (storage.foldername(name))[1] in (
      select (agencies.id)::text from public.agencies
      where agencies.owner_user_id = auth.uid()
    )
  );

drop policy if exists agency_media_storage_delete on storage.objects;
create policy agency_media_storage_delete on storage.objects for delete
  using (
    bucket_id = 'agency-media'
    and (storage.foldername(name))[1] in (
      select (agencies.id)::text from public.agencies
      where agencies.owner_user_id = auth.uid()
    )
  );
