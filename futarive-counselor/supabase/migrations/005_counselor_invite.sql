-- ============================================================
-- カウンセラー招待リンク機能
-- ============================================================
-- 相談所オーナーが新しいカウンセラーを追加するための招待トークンと
-- それを使った claim/preview の RPC 関数を提供する。
--
-- フロー:
--   1. オーナーが counselors を INSERT（owner_user_id=null, invite_token=uuid）
--   2. 新カウンセラーに /claim?token=UUID URL を共有
--   3. URL を開いた人が新規登録 or ログイン
--   4. claim_counselor_by_token RPC で owner_user_id を auth.uid() に設定
--
-- 使い方：Supabase ダッシュボード > SQL Editor で本ファイルを実行。
-- ============================================================

-- 1. 招待トークンカラム
alter table public.counselors
  add column if not exists invite_token uuid;

create index if not exists counselors_invite_token_idx
  on public.counselors(invite_token)
  where invite_token is not null;

-- 2. 招待トークンで相談所/カウンセラー名をプレビュー（未認証OK）
create or replace function public.preview_invite(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_counselor_name text;
  v_agency_name    text;
begin
  select counselors.name, agencies.name
    into v_counselor_name, v_agency_name
  from public.counselors
  left join public.agencies on agencies.id = counselors.agency_id
  where counselors.invite_token = p_token
    and counselors.owner_user_id is null;

  if v_counselor_name is null then
    return json_build_object('valid', false);
  end if;

  return json_build_object(
    'valid', true,
    'counselor_name', v_counselor_name,
    'agency_name', v_agency_name
  );
end;
$$;

revoke all on function public.preview_invite(uuid) from public;
grant execute on function public.preview_invite(uuid) to anon, authenticated;

-- 3. 招待トークンを使ってカウンセラーを claim（要認証）
create or replace function public.claim_counselor_by_token(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_counselor_id uuid;
begin
  if auth.uid() is null then
    return json_build_object('success', false, 'error', 'not_authenticated');
  end if;

  update public.counselors
     set owner_user_id = auth.uid(),
         invite_token  = null
   where invite_token = p_token
     and owner_user_id is null
   returning id into v_counselor_id;

  if v_counselor_id is null then
    return json_build_object('success', false, 'error', 'invalid_or_used');
  end if;

  return json_build_object('success', true, 'counselor_id', v_counselor_id);
end;
$$;

revoke all on function public.claim_counselor_by_token(uuid) from public;
grant execute on function public.claim_counselor_by_token(uuid) to authenticated;
