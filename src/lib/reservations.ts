/* ────────────────────────────────────────────────────────────
   Kinda — 予約作成 / キャンセルのヘルパー
   ──────────────────────────────────────────────────────────────
   - Step4Confirm から createReservation を呼ぶ
   - マイページの予約カードから cancelReservation を呼ぶ
   - 本物の Supabase slot UUID の場合のみ排他制御 UPDATE を効かせる。
     モック slot（Step1Calendar が動的生成するもの）の場合は INSERT のみ。
──────────────────────────────────────────────────────────── */
import type { SupabaseClient } from "@supabase/supabase-js";

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

  // 1. 本物の slot UUID なら排他制御 UPDATE（status='open' or 'locked' の時だけ booked にできる）
  let resolvedSlotId: string | null = null;
  if (input.slotId && isUuid(input.slotId)) {
    const { data: updatedSlot, error: slotError } = await supabase
      .from("slots")
      .update({ status: "booked" })
      .eq("id", input.slotId)
      .in("status", ["open", "locked"])
      .select("id")
      .maybeSingle();

    if (slotError) {
      return { ok: false, error: "unknown", message: slotError.message };
    }
    if (!updatedSlot) {
      return {
        ok: false,
        error: "slot_unavailable",
        message:
          "この予約枠は別の方が押さえています。お手数ですが別の枠をお選びください。",
      };
    }
    resolvedSlotId = (updatedSlot as { id: string }).id;
  }

  // 2. reservation INSERT
  const { data: inserted, error: insertError } = await supabase
    .from("reservations")
    .insert({
      user_id: input.userId,
      slot_id: resolvedSlotId,
      counselor_id: isUuid(input.counselorId ?? null) ? input.counselorId : null,
      counselor_name: input.counselorName,
      agency_id: isUuid(input.agencyId ?? null) ? input.agencyId : null,
      agency_name: input.agencyName,
      user_name: input.userName,
      user_email: input.userEmail,
      notes: input.notes ?? null,
      start_at: input.startAt,
      end_at: input.endAt,
      meeting_type: input.meetingType,
      status: "active",
      // 024_reservations_shared_diagnosis — Kinda type / Kinda note の共有スナップショット
      shared_kinda_type_key: input.sharedKindaTypeKey ?? null,
      shared_kinda_type_at: input.sharedKindaTypeAt ?? null,
      shared_kinda_note_key: input.sharedKindaNoteKey ?? null,
      shared_kinda_note_at: input.sharedKindaNoteAt ?? null,
      shared_kinda_note_freetext: input.sharedKindaNoteFreetext ?? null,
    })
    .select("id")
    .maybeSingle();

  if (insertError || !inserted) {
    // ロールバック: 本物 slot を locked → open に戻す
    if (resolvedSlotId) {
      await supabase
        .from("slots")
        .update({ status: "open" })
        .eq("id", resolvedSlotId);
    }
    return {
      ok: false,
      error: "unknown",
      message:
        insertError?.message ??
        "予約の保存に失敗しました。少し時間をおいてもう一度お試しください。",
    };
  }

  return { ok: true, reservationId: (inserted as { id: string }).id };
}

/* ────────────────────────────────────────────────────────────
   cancelReservation
   - reservations.status を 'canceled' に UPDATE
   - 本物の slot に紐付いていれば slot を 'open' に戻す
──────────────────────────────────────────────────────────── */
export type CancelReservationResult =
  | { ok: true }
  | {
      ok: false;
      error: "deadline_passed" | "supabase_unavailable" | "unknown";
      message: string;
    };

export async function cancelReservation(
  supabase: SupabaseClient | null,
  reservationId: string,
  slotId: string | null,
): Promise<CancelReservationResult> {
  if (!supabase) {
    return {
      ok: false,
      error: "supabase_unavailable",
      message: "予約システムに接続できません。",
    };
  }

  const { error: updateError } = await supabase
    .from("reservations")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    })
    .eq("id", reservationId);

  if (updateError) {
    return { ok: false, error: "unknown", message: updateError.message };
  }

  // 本物の slot UUID なら open に戻す
  if (slotId && isUuid(slotId)) {
    await supabase.from("slots").update({ status: "open" }).eq("id", slotId);
  }

  return { ok: true };
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
