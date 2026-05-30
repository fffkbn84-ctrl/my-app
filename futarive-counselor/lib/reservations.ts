import type { SupabaseClient } from '@supabase/supabase-js'

export type RescheduleRequestResult =
  | { ok: true; expiresAt: string }
  | { ok: false; error: string; message: string }

export async function requestRescheduleAsCounselor(
  supabase: SupabaseClient,
  reservationId: string,
  proposedStart: string,
  proposedEnd: string,
): Promise<RescheduleRequestResult> {
  const { data, error } = await supabase.rpc('request_reschedule_rpc', {
    p_reservation_id: reservationId,
    p_requested_by: 'counselor',
    p_proposed_start: proposedStart,
    p_proposed_end: proposedEnd,
  })
  if (error) return { ok: false, error: 'unknown', message: error.message }
  const result = data as { ok: boolean; expires_at?: string; error?: string }
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: '予約が見つかりません。',
      not_active: 'この予約はすでにキャンセル済みか完了しています。',
      reschedule_already_pending: 'すでに日程変更の申請中です。',
      unauthorized: 'この予約の日程変更を申請する権限がありません。',
    }
    return {
      ok: false,
      error: result.error ?? 'unknown',
      message: msgs[result.error ?? ''] ?? '日程変更の提案に失敗しました。',
    }
  }
  return { ok: true, expiresAt: result.expires_at ?? '' }
}

/**
 * カウンセラー発の日程変更を「第3候補まで」で申請する（Migration 032）。
 * candidates は1〜3件。先頭候補が従来の proposed_* にミラーされる。
 * ユーザーは user-site 側で候補から1つを選んで了承する想定。
 */
export async function requestRescheduleMultiAsCounselor(
  supabase: SupabaseClient,
  reservationId: string,
  candidates: { start: string; end: string }[],
): Promise<RescheduleRequestResult> {
  const { data, error } = await supabase.rpc('request_reschedule_multi_rpc', {
    p_reservation_id: reservationId,
    p_candidates: candidates,
  })
  if (error) return { ok: false, error: 'unknown', message: error.message }
  const result = data as { ok: boolean; expires_at?: string; error?: string }
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: '予約が見つかりません。',
      not_active: 'この予約はすでにキャンセル済みか完了しています。',
      reschedule_already_pending: 'すでに日程変更の申請中です。',
      unauthorized: 'この予約の日程変更を申請する権限がありません。',
      invalid_candidates: '候補日時が正しくありません。',
      invalid_candidate_count: '候補は1〜3件で選んでください。',
    }
    return {
      ok: false,
      error: result.error ?? 'unknown',
      message: msgs[result.error ?? ''] ?? '日程変更の提案に失敗しました。',
    }
  }
  return { ok: true, expiresAt: result.expires_at ?? '' }
}

export type RescheduleApproveResult =
  | { ok: true; newReservationId: string }
  | { ok: false; error: string; message: string }

export async function approveRescheduleAsCounselor(
  supabase: SupabaseClient,
  reservationId: string,
): Promise<RescheduleApproveResult> {
  const { data, error } = await supabase.rpc('approve_reschedule_rpc', {
    p_reservation_id: reservationId,
  })
  if (error) return { ok: false, error: 'unknown', message: error.message }
  const result = data as { ok: boolean; new_reservation_id?: string; error?: string }
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: '予約が見つかりません。',
      not_in_requested_state: '日程変更の申請が見つかりません。',
      expired: '日程変更の申請期限が切れています。',
      unauthorized: '承認する権限がありません。',
    }
    return {
      ok: false,
      error: result.error ?? 'unknown',
      message: msgs[result.error ?? ''] ?? '日程変更の承認に失敗しました。',
    }
  }
  return { ok: true, newReservationId: result.new_reservation_id ?? '' }
}
