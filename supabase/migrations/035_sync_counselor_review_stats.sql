-- counselors.review_count / rating_avg を実際の公開口コミ行から同期する。
-- これまで口コミ投稿・公開時にカラムが更新されず、リール/カード（review_count を参照）と
-- カウンセラー詳細ページ（実口コミ件数を集計）で件数がズレていた問題への恒久対応。
-- 例：実カウンセラー「小山楓華」は実際の公開口コミ 2 件があるのに、リールで 0 と表示されていた。

create or replace function public.recalc_counselor_review_stats(p_counselor uuid)
returns void
language sql
security definer
set search_path to 'public'
as $$
  update public.counselors c set
    review_count = sub.cnt,
    rating_avg = sub.avg_rating
  from (
    select
      count(*) as cnt,
      coalesce(round(avg(rating)::numeric, 1), 0) as avg_rating
    from public.reviews
    where counselor_id = p_counselor and is_published = true
  ) sub
  where c.id = p_counselor;
$$;

create or replace function public.trg_reviews_recalc_stats()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if (tg_op = 'DELETE') then
    perform public.recalc_counselor_review_stats(old.counselor_id);
    return old;
  end if;
  perform public.recalc_counselor_review_stats(new.counselor_id);
  if (tg_op = 'UPDATE' and new.counselor_id is distinct from old.counselor_id) then
    perform public.recalc_counselor_review_stats(old.counselor_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reviews_recalc_stats on public.reviews;
create trigger trg_reviews_recalc_stats
after insert or update or delete on public.reviews
for each row execute function public.trg_reviews_recalc_stats();

-- バックフィル：実際の公開口コミ行を持つカウンセラーのみ更新（純表示用 seed は触らない）
update public.counselors c set
  review_count = sub.cnt,
  rating_avg = sub.avg_rating
from (
  select counselor_id,
         count(*) as cnt,
         coalesce(round(avg(rating)::numeric, 1), 0) as avg_rating
  from public.reviews
  where is_published = true
  group by counselor_id
) sub
where c.id = sub.counselor_id;
