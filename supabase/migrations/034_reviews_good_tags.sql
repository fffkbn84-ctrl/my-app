-- 口コミの「よかった点」選択タグを保存するカラムを追加し、
-- submit_review RPC で保存できるようにする。
-- （フォーム UI は以前からあったが DB 未保存だった問題への対応）

alter table public.reviews add column if not exists good_tags text[];

-- 旧6引数版を破棄し good_tags 付き7引数版へ一本化
-- （両方残ると PostgREST が named-args 解決で曖昧エラーになるため）
drop function if exists public.submit_review(uuid, integer, text, text, text, text);

create or replace function public.submit_review(
  p_reservation_id uuid,
  p_rating integer,
  p_body text,
  p_reviewer_age_range text default null,
  p_reviewer_gender text default null,
  p_reviewer_area text default null,
  p_good_tags text[] default '{}'::text[]
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_res public.reservations%rowtype;
  v_review_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'invalid_rating';
  end if;
  if p_body is null or length(btrim(p_body)) = 0 then
    raise exception 'empty_body';
  end if;

  select * into v_res from public.reservations where id = p_reservation_id;
  if not found then
    raise exception 'reservation_not_found';
  end if;
  if v_res.user_id is distinct from v_uid then
    raise exception 'not_owner';
  end if;
  if v_res.status <> 'completed' then
    raise exception 'not_completed';
  end if;
  if v_res.counselor_id is null then
    raise exception 'no_counselor';
  end if;
  if v_res.completed_at is null or v_res.completed_at < now() - interval '30 days' then
    raise exception 'review_window_closed';
  end if;
  if exists (select 1 from public.reviews where reservation_id = p_reservation_id) then
    raise exception 'already_reviewed';
  end if;

  insert into public.reviews (
    counselor_id, reservation_id, rating, body, source_type, is_published,
    reviewer_age_range, reviewer_gender, reviewer_area, user_id, good_tags
  ) values (
    v_res.counselor_id, p_reservation_id, p_rating, btrim(p_body), 'face_to_face', false,
    p_reviewer_age_range, p_reviewer_gender, p_reviewer_area, v_uid,
    coalesce(p_good_tags, '{}'::text[])
  ) returning id into v_review_id;

  return v_review_id;
end;
$function$;
