-- 0032_reschedule_multi_candidates.sql
-- カウンセラー発の日程変更で「第3候補まで」提示できるようにする。
-- 方針：
--   * 既存の単一候補 RPC (request_reschedule_rpc) と単一カラム
--     (reschedule_proposed_start/end) はそのまま残す（後方互換）。
--   * 追加で reschedule_candidates(jsonb) に候補配列を保持。
--     形式: [{"start": "<tstz>", "end": "<tstz>"}, ...]（最大3件）
--   * 先頭候補は従来カラムにもミラーして、既存の表示・期限ロジックを流用。
--   * ユーザー側がどの候補を選んで了承するかは user-site 側で別途実装する。

alter table public.reservations
  add column if not exists reschedule_candidates jsonb;

-- カウンセラー（相談所オーナー / 本人）が最大3件の候補で日程変更を申請する。
create or replace function public.request_reschedule_multi_rpc(
  p_reservation_id uuid,
  p_candidates jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_reservation reservations%rowtype;
  v_now timestamptz := now();
  v_actor uuid := auth.uid();
  v_expires timestamptz;
  v_count int;
  v_first_start timestamptz;
  v_first_end timestamptz;
begin
  -- 候補のバリデーション（1〜3件・jsonb 配列）
  if p_candidates is null or jsonb_typeof(p_candidates) <> 'array' then
    return jsonb_build_object('ok', false, 'error', 'invalid_candidates');
  end if;
  v_count := jsonb_array_length(p_candidates);
  if v_count < 1 or v_count > 3 then
    return jsonb_build_object('ok', false, 'error', 'invalid_candidate_count');
  end if;

  -- 予約取得
  select * into v_reservation from reservations where id = p_reservation_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  -- 権限チェック：相談所オーナー or 本人（counselor）か
  if not exists (
    select 1 from counselors c
    join agencies a on a.id = c.agency_id
    where c.id = v_reservation.counselor_id
      and (a.owner_user_id = v_actor or c.owner_user_id = v_actor)
  ) then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if v_reservation.reschedule_status = 'requested' then
    return jsonb_build_object('ok', false, 'error', 'reschedule_already_pending');
  end if;

  if v_reservation.status <> 'active' then
    return jsonb_build_object('ok', false, 'error', 'not_active');
  end if;

  -- 先頭候補を従来カラムへミラー
  v_first_start := (p_candidates->0->>'start')::timestamptz;
  v_first_end := (p_candidates->0->>'end')::timestamptz;
  if v_first_start is null or v_first_end is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_candidates');
  end if;

  v_expires := v_now + interval '72 hours';

  update reservations set
    reschedule_status = 'requested',
    reschedule_requested_by = 'counselor',
    reschedule_requested_at = v_now,
    reschedule_candidates = p_candidates,
    reschedule_proposed_start = v_first_start,
    reschedule_proposed_end = v_first_end,
    reschedule_expires_at = v_expires
  where id = p_reservation_id;

  return jsonb_build_object('ok', true, 'expires_at', v_expires, 'count', v_count);
end;
$function$;
