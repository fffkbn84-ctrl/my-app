/* ────────────────────────────────────────────────────────────
   Kinda — 予約作成 / キャンセルのヘルパー
   ──────────────────────────────────────────────────────────────
   - Step4Confirm から createReservation を呼ぶ（枠確保＋INSERT は
     create_reservation_rpc に集約。slots 直接 UPDATE は廃止）。
   - マイページの予約カードから cancelReservationViaRpc を呼ぶ。
   - モック slot（Step1Calendar が動的生成するもの）の場合は p_slot_id=null。
──────────────────────────────────────────────────────────── */
import type { SupabaseClient } from "@supabase/supabase-js";

/* ────────────────────────────────────────────────────────────
   notifyAgencyOfReservationEvent
   - 会員の操作（キャンセル / 日程変更 申請・承認）を相談所へメール通知する。
   - best-effort：失敗してもユーザー操作は既に完了しているので握りつぶす。
──────────────────────────────────────────────────────────── */
function notifyAgencyOfReservationEvent(
  reservationId: string,
  event: "cancel" | "reschedule_request" | "reschedule_approve",
): void {
  if (typeof fetch === "undefined") return;
  void fetch("/api/reservations/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservationId, event }),
    keepalive: true,
  }).catch(() => {});
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/* ────────────────────────────────────────────────────────────
   createReservation
──────────────────────────────────────────────────────────── */
export type CreateReservationInput = {
  userId: string;
  userName: string;
  userEmail: string;
  notes?: string | null;
  /** 本物の Supabase slot UUID。モック slot の場合は null */
  slotId?: string | null;
  /** ISO 8601 (timestamptz) */
  startAt: string;
  endAt: string;
  meetingType: "対面" | "オンライン" | null;
  /** モック counselor の場合は null */
  counselorId?: string | null;
  counselorName: string;
  /** モック agency の場合は null */
  agencyId?: string | null;
  agencyName: string;
  /** ユーザーが共有を選んだ Kinda type の result_key（A/B/C/D）と診断日時 */
  sharedKindaTypeKey?: "A" | "B" | "C" | "D" | null;
  sharedKindaTypeAt?: string | null;
  /** ユーザーが共有を選んだ Kinda note の天気キーと診断日時 */
  sharedKindaNoteKey?: string | null;
  sharedKindaNoteAt?: string | null;
  /** Kinda note の自由記述本文（your words）。結果画面で「結果に含める」が ON だった人のみ */
  sharedKindaNoteFreetext?: string | null;
};

export type CreateReservationResult =
  | { ok: true; reservationId: string }
  | {
      ok: false;
      error:
        | "slot_unavailable"
        | "auth_required"
        | "supabase_unavailable"
        | "unknown";
      message: string;
    };

export async function createReservation(
  supabase: SupabaseClient | null,
  input: CreateReservationInput,
): Promise<CreateReservationResult> {
  if (!supabase) {
    return {
      ok: false,
      error: "supabase_unavailable",
      message:
        "予約システムに接続できません。時間をおいてもう一度お試しください。",
    };
  }

  // 枠確保（open/locked→booked）＋ reservation INSERT を単一トランザクションの
  // SECURITY DEFINER RPC で実行する。以前は client から slots を直接 UPDATE して
  // いたため slots の UPDATE ポリシーを全開放せざるを得なかった（他人の枠を
  // 書き換え可能な脆弱性）。RPC 化により user_id は auth.uid() に固定され、
  // slots の UPDATE ポリシーは owner/admin スコープに絞られている。
  const { data, error } = await supabase.rpc("create_reservation_rpc", {
    p_slot_id: input.slotId && isUuid(input.slotId) ? input.slotId : null,
    p_start_at: input.startAt,
    p_end_at: input.endAt,
    p_meeting_type: input.meetingType,
    p_counselor_id: isUuid(input.counselorId ?? null) ? input.counselorId : null,
    p_counselor_name: input.counselorName,
    p_agency_id: isUuid(input.agencyId ?? null) ? input.agencyId : null,
    p_agency_name: input.agencyName,
    p_user_name: input.userName,
    p_user_email: input.userEmail,
    p_notes: input.notes ?? null,
    p_shared_kinda_type_key: input.sharedKindaTypeKey ?? null,
    p_shared_kinda_type_at: input.sharedKindaTypeAt ?? null,
    p_shared_kinda_note_key: input.sharedKindaNoteKey ?? null,
    p_shared_kinda_note_at: input.sharedKindaNoteAt ?? null,
    p_shared_kinda_note_freetext: input.sharedKindaNoteFreetext ?? null,
  });

  if (error) {
    return { ok: false, error: "unknown", message: error.message };
  }

  const result = data as {
    ok: boolean;
    reservation_id?: string;
    error?: string;
  };

  if (!result.ok) {
    if (result.error === "slot_unavailable") {
      return {
        ok: false,
        error: "slot_unavailable",
        message:
          "この予約枠は別の方が押さえています。お手数ですが別の枠をお選びください。",
      };
    }
    if (result.error === "auth_required") {
      return {
        ok: false,
        error: "auth_required",
        message: "予約するにはログインが必要です。",
      };
    }
    return {
      ok: false,
      error: "unknown",
      message:
        "予約の保存に失敗しました。少し時間をおいてもう一度お試しください。",
    };
  }

  return { ok: true, reservationId: result.reservation_id ?? "" };
}

/* ────────────────────────────────────────────────────────────
   isCancellable
   - 「面談開始まで cancelDeadlineHours より時間があれば true」
──────────────────────────────────────────────────────────── */
export function isCancellable(
  startAt: string | null,
  cancelDeadlineHours: number | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!startAt) return true; // 開始時刻不明なら一旦キャンセル可とする
  const startMs = new Date(startAt).getTime();
  const nowMs = now.getTime();
  const hoursUntilStart = (startMs - nowMs) / (1000 * 60 * 60);
  const deadline = cancelDeadlineHours ?? 24;
  return hoursUntilStart > deadline;
}

/* ────────────────────────────────────────────────────────────
   cancelReservationViaRpc
   - cancel_reservation_rpc を呼ぶ（billing_events も一括更新）
   - Stripe モック：DB 更新のみ、外部 API 呼び出しなし
──────────────────────────────────────────────────────────── */
export type CancelViaRpcResult =
  | { ok: true; withinGrace: boolean }
  | { ok: false; error: string; message: string };

export async function cancelReservationViaRpc(
  supabase: SupabaseClient | null,
  reservationId: string,
): Promise<CancelViaRpcResult> {
  if (!supabase) {
    return { ok: false, error: "supabase_unavailable", message: "予約システムに接続できません。" };
  }
  const { data, error } = await supabase.rpc("cancel_reservation_rpc", {
    p_reservation_id: reservationId,
    p_cancelled_by: "user",
  });
  if (error) {
    return { ok: false, error: "unknown", message: error.message };
  }
  const result = data as { ok: boolean; within_grace?: boolean; error?: string };
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: "予約が見つかりません。",
      not_active: "この予約はすでにキャンセル済みか完了しています。",
      unauthorized: "この予約をキャンセルする権限がありません。",
    };
    return {
      ok: false,
      error: result.error ?? "unknown",
      message: msgs[result.error ?? ""] ?? "キャンセルに失敗しました。",
    };
  }
  notifyAgencyOfReservationEvent(reservationId, "cancel");
  return { ok: true, withinGrace: result.within_grace ?? false };
}

/* ────────────────────────────────────────────────────────────
   undoCancelReservationViaRpc
   - undo_cancel_reservation_rpc を呼ぶ（直前のキャンセルを取り消す）
   - 本人・5分以内・slot が空いている時のみ成功
──────────────────────────────────────────────────────────── */
export type UndoCancelResult =
  | { ok: true }
  | { ok: false; error: string; message: string };

export async function undoCancelReservationViaRpc(
  supabase: SupabaseClient | null,
  reservationId: string,
): Promise<UndoCancelResult> {
  if (!supabase) {
    return { ok: false, error: "supabase_unavailable", message: "予約システムに接続できません。" };
  }
  const { data, error } = await supabase.rpc("undo_cancel_reservation_rpc", {
    p_reservation_id: reservationId,
  });
  if (error) {
    return { ok: false, error: "unknown", message: error.message };
  }
  const result = data as { ok: boolean; error?: string };
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: "予約が見つかりません。",
      not_canceled: "この予約はキャンセルされていません。",
      not_user_cancelled: "この予約は取り消せません。",
      unauthorized: "この予約を取り消す権限がありません。",
      undo_window_expired: "取り消し可能な時間を過ぎました。お手数ですが再度ご予約ください。",
      slot_taken: "この枠は別の方が予約したため、取り消せませんでした。別の日時でご予約ください。",
    };
    return {
      ok: false,
      error: result.error ?? "unknown",
      message: msgs[result.error ?? ""] ?? "キャンセルの取り消しに失敗しました。",
    };
  }
  return { ok: true };
}

/* ────────────────────────────────────────────────────────────
   requestRescheduleViaRpc
   - request_reschedule_rpc を呼ぶ
   - 申請時に billing_events を voided に（即時返金設計）
──────────────────────────────────────────────────────────── */
export type RescheduleRequestResult =
  | { ok: true; expiresAt: string }
  | { ok: false; error: string; message: string };

export async function requestRescheduleViaRpc(
  supabase: SupabaseClient | null,
  reservationId: string,
  proposedStart: string,
  proposedEnd: string,
): Promise<RescheduleRequestResult> {
  if (!supabase) {
    return { ok: false, error: "supabase_unavailable", message: "予約システムに接続できません。" };
  }
  const { data, error } = await supabase.rpc("request_reschedule_rpc", {
    p_reservation_id: reservationId,
    p_requested_by: "user",
    p_proposed_start: proposedStart,
    p_proposed_end: proposedEnd,
  });
  if (error) {
    return { ok: false, error: "unknown", message: error.message };
  }
  const result = data as { ok: boolean; expires_at?: string; error?: string };
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: "予約が見つかりません。",
      not_active: "この予約はすでにキャンセル済みか完了しています。",
      reschedule_already_pending: "すでに日程変更の申請中です。",
      unauthorized: "この予約の日程変更を申請する権限がありません。",
    };
    return {
      ok: false,
      error: result.error ?? "unknown",
      message: msgs[result.error ?? ""] ?? "日程変更の申請に失敗しました。",
    };
  }
  notifyAgencyOfReservationEvent(reservationId, "reschedule_request");
  return { ok: true, expiresAt: result.expires_at ?? "" };
}

/* ────────────────────────────────────────────────────────────
   approveRescheduleViaRpc
   - approve_reschedule_rpc を呼ぶ（カウンセラーが申請した日程変更をユーザーが承認）
──────────────────────────────────────────────────────────── */
export type RescheduleApproveResult =
  | { ok: true; newReservationId: string }
  | { ok: false; error: string; message: string };

export async function approveRescheduleViaRpc(
  supabase: SupabaseClient | null,
  reservationId: string,
): Promise<RescheduleApproveResult> {
  if (!supabase) {
    return { ok: false, error: "supabase_unavailable", message: "予約システムに接続できません。" };
  }
  const { data, error } = await supabase.rpc("approve_reschedule_rpc", {
    p_reservation_id: reservationId,
  });
  if (error) {
    return { ok: false, error: "unknown", message: error.message };
  }
  const result = data as { ok: boolean; new_reservation_id?: string; error?: string };
  if (!result.ok) {
    const msgs: Record<string, string> = {
      not_found: "予約が見つかりません。",
      not_in_requested_state: "日程変更の申請が見つかりません。",
      expired: "日程変更の申請期限が切れています。",
      unauthorized: "承認する権限がありません。",
    };
    return {
      ok: false,
      error: result.error ?? "unknown",
      message: msgs[result.error ?? ""] ?? "日程変更の承認に失敗しました。",
    };
  }
  notifyAgencyOfReservationEvent(reservationId, "reschedule_approve");
  return { ok: true, newReservationId: result.new_reservation_id ?? "" };
}
