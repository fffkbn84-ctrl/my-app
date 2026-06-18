"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  cancelReservationViaRpc,
  undoCancelReservationViaRpc,
  requestRescheduleViaRpc,
  approveRescheduleViaRpc,
  isCancellable,
} from "@/lib/reservations";
import { AGENCIES, type Agency } from "@/lib/data";
import InfoTooltip from "@/components/ui/InfoTooltip";
import UndoToast from "@/components/ui/UndoToast";
import { CancelPolicyTooltipContent } from "@/lib/policyMessages";

type ReservationRow = {
  id: string;
  slot_id: string | null;
  counselor_id: string | null;
  counselor_name: string | null;
  agency_id: string | null;
  agency_name: string | null;
  start_at: string | null;
  end_at: string | null;
  meeting_type: "対面" | "オンライン" | null;
  notes: string | null;
  status: "active" | "canceled" | "completed";
  canceled_at: string | null;
  created_at: string;
  agency_message: string | null;
  agency_message_at: string | null;
  cancelled_by: "user" | "counselor" | "system" | null;
  reschedule_status: "requested" | "approved" | "expired" | null;
  reschedule_requested_by: "user" | "counselor" | null;
  reschedule_requested_at: string | null;
  reschedule_expires_at: string | null;
  reschedule_proposed_start: string | null;
  reschedule_proposed_end: string | null;
  original_reservation_id: string | null;
};

type AgencyInfo = {
  id?: string;
  name?: string;
  address?: string;
  access?: string;
  hours?: string;
  holiday?: string;
  directions?: string;
  phone?: string;
  email?: string;
  cancelDeadlineHours: number;
  cancelPolicy?: string;
  area?: string;
  type?: string[];
};

type CounselorInfo = {
  id: string;
  name: string;
  area?: string | null;
  photoUrl?: string | null;
  specialties?: string[] | null;
  yearsOfExperience?: number | null;
  experienceLabel?: string | null;
  catchphrase?: string | null;
  message?: string | null;
  ratingAvg?: number | null;
  reviewCount?: number | null;
  fee?: string | null;
};

type SlotRow = {
  id: string;
  start_at: string;
  end_at: string;
  meeting_type: "対面" | "オンライン" | null;
};

const DEFAULT_INFO: AgencyInfo = {
  cancelDeadlineHours: 24,
  cancelPolicy: "面談日の前日までキャンセル可能です。",
};

function findMockAgency(name: string | null): Agency | null {
  if (!name) return null;
  return AGENCIES.find((a) => a.name === name) ?? null;
}

function formatDateTimeJa(iso: string | null): string {
  if (!iso) return "日時未定";
  const d = new Date(iso);
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}） ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}〜`;
}

function formatDateTimeShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}

function formatTimeRange(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  return `${String(s.getHours()).padStart(2, "0")}:${String(s.getMinutes()).padStart(2, "0")} 〜 ${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
}

// ── キャンセル確認モーダル ────────────────────────────────────
// 表示するのは「相談所のキャンセルポリシー」のみ。
// Kinda の課金・返金ルールはユーザーには見せない。
function CancelModal({
  row,
  agencyInfo,
  counselorFee,
  onConfirm,
  onClose,
  loading,
}: {
  row: ReservationRow;
  agencyInfo: AgencyInfo;
  counselorFee?: string | null;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  // 有料面談かどうか（counselors.fee が '無料' / null / undefined 以外）
  const isPaidSession =
    counselorFee != null && counselorFee !== "" && counselorFee !== "無料";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "0 20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px 24px",
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 16px 48px rgba(0,0,0,0.16)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 17,
            color: "var(--ink)",
            marginBottom: 16,
          }}
        >
          この予約をキャンセルしますか？
        </p>

        {/* 予約サマリ */}
        <div
          style={{
            background: "var(--pale)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: "var(--mid)",
            lineHeight: 1.9,
          }}
        >
          <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
            {row.counselor_name ?? "カウンセラー未定"}
            {row.agency_name ? `（${row.agency_name}）` : ""}
          </p>
          <p>{formatDateTimeJa(row.start_at)}</p>
        </div>

        {/* キャンセルポリシー（相談所のポリシー or 有料面談時の注意） */}
        {(agencyInfo.cancelPolicy || isPaidSession) && (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 20,
              fontSize: 12,
              color: "var(--mid)",
              lineHeight: 1.8,
            }}
          >
            {isPaidSession && (
              <p style={{ marginBottom: agencyInfo.cancelPolicy ? 8 : 0, color: "var(--ink)" }}>
                ※ この面談には料金が発生します（{counselorFee}）。
              </p>
            )}
            {agencyInfo.cancelPolicy && (
              <p>{agencyInfo.cancelPolicy}</p>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 50,
              border: "1px solid var(--border)",
              background: "white",
              fontSize: 13,
              color: "var(--mid)",
              cursor: "pointer",
            }}
          >
            戻る
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 50,
              border: "1px solid var(--rose)",
              background: "white",
              fontSize: 13,
              color: "var(--rose)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "処理中…" : "キャンセルする"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 日程変更申請モーダル（カレンダー式） ───────────────────────
// カウンセラーの空き枠（slots）を取得して表示する。
// 空き枠がない場合はメッセージを表示して直接連絡を促す。
function RescheduleModal({
  counselorId,
  supabase,
  onConfirm,
  onClose,
  loading,
}: {
  counselorId: string | null;
  supabase: SupabaseClient | null;
  onConfirm: (start: string, end: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [selected, setSelected] = useState<SlotRow | null>(null);
  // 2段選択：まず日付を選び、次に時間を選ぶ（カウンセラー管理画面と同じ操作）
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !counselorId) {
      setSlotsLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("slots")
        .select("id, start_at, end_at, meeting_type")
        .eq("counselor_id", counselorId)
        .eq("status", "open")
        .gte("start_at", new Date().toISOString())
        .order("start_at")
        .limit(30);
      setSlots((data as SlotRow[]) ?? []);
      setSlotsLoading(false);
    })();
  }, [supabase, counselorId]);

  // 日付ごとにグループ化
  const grouped = slots.reduce<Record<string, SlotRow[]>>((acc, slot) => {
    const label = formatDateLabel(slot.start_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(slot);
    return acc;
  }, {});

  const handleSubmit = () => {
    if (!selected) return;
    onConfirm(selected.start_at, selected.end_at);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "0 20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px 24px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 16px 48px rgba(0,0,0,0.16)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 17,
            color: "var(--ink)",
            marginBottom: 6,
            flexShrink: 0,
          }}
        >
          日程変更を申請する
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, lineHeight: 1.7, flexShrink: 0 }}>
          希望する日時を選んでください。カウンセラーが確認後、改めてご連絡します。
        </p>

        {/* 空き枠リスト */}
        <div style={{ overflowY: "auto", flex: 1, marginBottom: 16 }}>
          {slotsLoading ? (
            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "20px 0" }}>
              空き枠を確認中…
            </p>
          ) : Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: 13, color: "var(--mid)", marginBottom: 8 }}>
                現在、空き枠がありません。
              </p>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
                カウンセラーに直接ご連絡いただくか、
                <br />しばらくしてからもう一度お試しください。
              </p>
            </div>
          ) : selectedDateLabel === null ? (
            // 1段目：予約枠のある日付の一覧（カウンセラー管理画面と同じ操作）
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(grouped).map(([dateLabel, daySlots]) => (
                <button
                  key={dateLabel}
                  type="button"
                  onClick={() => {
                    setSelectedDateLabel(dateLabel);
                    setSelected(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14, color: "var(--ink)" }}>{dateLabel}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>
                    {daySlots.length}枠 ›
                  </span>
                </button>
              ))}
            </div>
          ) : (
            // 2段目：選んだ日付の時間一覧
            <div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDateLabel(null);
                  setSelected(null);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "transparent",
                  border: "none",
                  color: "var(--mid)",
                  fontSize: 12,
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: 10,
                }}
              >
                ‹ 日付を選び直す
              </button>
              <p style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600, marginBottom: 10 }}>
                {selectedDateLabel}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(grouped[selectedDateLabel] ?? []).map((slot) => {
                  const isSelected = selected?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelected(slot)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: isSelected
                          ? "1.5px solid var(--accent)"
                          : "1px solid var(--border)",
                        background: isSelected ? "rgba(212,168,90,.07)" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color .15s, background .15s",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "var(--ink)" }}>
                        {formatTimeRange(slot.start_at, slot.end_at)}
                      </span>
                      {slot.meeting_type && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--muted)",
                            background: "var(--pale)",
                            padding: "2px 8px",
                            borderRadius: 20,
                            flexShrink: 0,
                          }}
                        >
                          {slot.meeting_type}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 50,
              border: "1px solid var(--border)",
              background: "white",
              fontSize: 13,
              color: "var(--mid)",
              cursor: "pointer",
            }}
          >
            戻る
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !selected || Object.keys(grouped).length === 0}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 50,
              border: "none",
              background: selected ? "var(--accent)" : "var(--border)",
              fontSize: 13,
              color: selected ? "white" : "var(--muted)",
              cursor: loading || !selected ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "background .15s",
            }}
          >
            {loading ? "送信中…" : "申請する"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── メインコンポーネント ─────────────────────────────────────
export default function ReservationDetailClient({ reservationId }: { reservationId: string }) {
  const { user, loading: authLoading, supabase } = useAuth();
  const router = useRouter();
  const [row, setRow] = useState<ReservationRow | null>(null);
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>(DEFAULT_INFO);
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const [counselorInfo, setCounselorInfo] = useState<CounselorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoBusy, setUndoBusy] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/login?redirect=/mypage/reservations/${reservationId}`);
    }
  }, [authLoading, user, router, reservationId]);

  useEffect(() => {
    if (authLoading || !user || !supabase) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await supabase
        .from("reservations")
        .select(
          "id, slot_id, counselor_id, counselor_name, agency_id, agency_name, start_at, end_at, meeting_type, notes, status, canceled_at, created_at, agency_message, agency_message_at, cancelled_by, reschedule_status, reschedule_requested_by, reschedule_requested_at, reschedule_expires_at, reschedule_proposed_start, reschedule_proposed_end, original_reservation_id",
        )
        .eq("id", reservationId)
        .maybeSingle();
      if (cancelled) return;
      if (res.error || !res.data) {
        setError("予約が見つかりません");
        setLoading(false);
        return;
      }
      const r = res.data as ReservationRow;
      setRow(r);
      setCounselorId(r.counselor_id);

      // 相談所情報
      let info: AgencyInfo = { ...DEFAULT_INFO };
      const AGENCY_COLUMNS =
        "id, name, area, address, access, business_hours_text, closed_weekdays, directions, phone, email, cancel_deadline_hours, cancel_policy";
      let agencyQuery = null;
      if (r.agency_id && /^[0-9a-f-]{36}$/i.test(r.agency_id)) {
        agencyQuery = await supabase
          .from("agencies")
          .select(AGENCY_COLUMNS)
          .eq("id", r.agency_id)
          .maybeSingle();
      } else if (r.agency_name) {
        agencyQuery = await supabase
          .from("agencies")
          .select(AGENCY_COLUMNS)
          .eq("name", r.agency_name)
          .maybeSingle();
      }
      {
        const ag = agencyQuery ?? { data: null };
        if (!cancelled && ag.data) {
          const a = ag.data as {
            id: string;
            name: string | null;
            area: string | null;
            address: string | null;
            access: string | null;
            business_hours_text: string | null;
            closed_weekdays: number[] | null;
            directions: string | null;
            phone: string | null;
            email: string | null;
            cancel_deadline_hours: number | null;
            cancel_policy: string | null;
          };
          const labels = ["日", "月", "火", "水", "木", "金", "土"];
          const holidayText =
            Array.isArray(a.closed_weekdays) && a.closed_weekdays.length > 0
              ? [...new Set(a.closed_weekdays.filter((w) => Number.isInteger(w) && w >= 0 && w <= 6))]
                  .sort((x, y) => x - y)
                  .map((w) => labels[w])
                  .join("・") + "曜定休"
              : undefined;
          info = {
            id: a.id,
            name: a.name ?? r.agency_name ?? undefined,
            area: a.area ?? undefined,
            address: a.address ?? undefined,
            access: a.access ?? undefined,
            hours: a.business_hours_text ?? undefined,
            holiday: holidayText,
            directions: a.directions ?? undefined,
            phone: a.phone ?? undefined,
            email: a.email ?? undefined,
            cancelDeadlineHours: a.cancel_deadline_hours ?? 24,
            cancelPolicy: a.cancel_policy ?? undefined,
          };
        }
      }
      if (!info.address) {
        const mock = findMockAgency(r.agency_name);
        if (mock) {
          info = {
            ...info,
            id: info.id ?? String(mock.id),
            name: info.name ?? mock.name,
            address: info.address ?? mock.address,
            access: info.access ?? mock.access,
            hours: info.hours ?? mock.hours,
            holiday: info.holiday ?? mock.holiday,
            phone: info.phone ?? mock.phone,
            email: info.email ?? mock.email,
            cancelDeadlineHours: mock.cancelDeadlineHours ?? info.cancelDeadlineHours,
            cancelPolicy: info.cancelPolicy ?? mock.cancelPolicy,
            area: info.area ?? mock.area,
            type: info.type ?? mock.type,
          };
        }
      }
      setAgencyInfo(info);

      // カウンセラー情報（fee を含む）
      const COUNSELOR_COLUMNS =
        "id, name, area, photo_url, specialties, years_of_experience, experience_label, catchphrase, message, rating_avg, review_count, fee";
      let counselorQuery = null;
      if (r.counselor_id && /^[0-9a-f-]{36}$/i.test(r.counselor_id)) {
        counselorQuery = await supabase
          .from("counselors")
          .select(COUNSELOR_COLUMNS)
          .eq("id", r.counselor_id)
          .maybeSingle();
      } else if (r.counselor_name) {
        counselorQuery = await supabase
          .from("counselors")
          .select(COUNSELOR_COLUMNS)
          .eq("name", r.counselor_name)
          .maybeSingle();
      }
      if (!cancelled && counselorQuery?.data) {
        const c = counselorQuery.data as {
          id: string;
          name: string;
          area: string | null;
          photo_url: string | null;
          specialties: string[] | null;
          years_of_experience: number | null;
          experience_label: string | null;
          catchphrase: string | null;
          message: string | null;
          rating_avg: number | null;
          review_count: number | null;
          fee: string | null;
        };
        setCounselorInfo({
          id: c.id,
          name: c.name,
          area: c.area,
          photoUrl: c.photo_url,
          specialties: c.specialties,
          yearsOfExperience: c.years_of_experience,
          experienceLabel: c.experience_label,
          catchphrase: c.catchphrase,
          message: c.message,
          ratingAvg: c.rating_avg,
          reviewCount: c.review_count,
          fee: c.fee,
        });
      }

      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [authLoading, user, supabase, reservationId]);

  const handleCancelConfirm = async () => {
    if (!supabase || !row) return;
    setActionLoading(true);
    setActionError(null);
    const result = await cancelReservationViaRpc(supabase, row.id);
    setActionLoading(false);
    if (!result.ok) {
      setActionError(result.message);
      setShowCancelModal(false);
      return;
    }
    setShowCancelModal(false);
    setRow({ ...row, status: "canceled", canceled_at: new Date().toISOString(), cancelled_by: "user" });
    setShowUndo(true);
  };

  const handleUndoCancel = async () => {
    if (!supabase || !row) return;
    setUndoBusy(true);
    setActionError(null);
    const result = await undoCancelReservationViaRpc(supabase, row.id);
    setUndoBusy(false);
    setShowUndo(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    setRow({ ...row, status: "active", canceled_at: null, cancelled_by: null });
  };

  const handleRescheduleConfirm = async (start: string, end: string) => {
    if (!supabase || !row) return;
    setActionLoading(true);
    setActionError(null);
    const result = await requestRescheduleViaRpc(supabase, row.id, start, end);
    setActionLoading(false);
    if (!result.ok) {
      setActionError(result.message);
      setShowRescheduleModal(false);
      return;
    }
    setShowRescheduleModal(false);
    setRow({
      ...row,
      reschedule_status: "requested",
      reschedule_requested_by: "user",
      reschedule_requested_at: new Date().toISOString(),
      reschedule_proposed_start: start,
      reschedule_proposed_end: end,
    });
  };

  const handleApproveReschedule = async () => {
    if (!supabase || !row) return;
    setActionLoading(true);
    setActionError(null);
    const result = await approveRescheduleViaRpc(supabase, row.id);
    setActionLoading(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    router.push(`/mypage/reservations/${result.newReservationId}`);
  };

  if (authLoading || (!user && !error)) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--mid)" }}>
        読み込み中…
      </div>
    );
  }
  if (loading) return <SkeletonView />;
  if (error || !row) {
    return (
      <div style={{ padding: "60px 20px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--mid)", marginBottom: 20 }}>
          予約が見つかりませんでした。
        </p>
        <Link
          href="/mypage"
          style={{
            display: "inline-block",
            fontSize: 13,
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            padding: "10px 22px",
            borderRadius: 50,
            textDecoration: "none",
          }}
        >
          マイページへ戻る
        </Link>
      </div>
    );
  }

  const canceled = row.status === "canceled";
  const completed = row.status === "completed";
  const isFuture = row.start_at ? new Date(row.start_at).getTime() > Date.now() : false;
  const cancellable =
    !canceled && !completed && isFuture && isCancellable(row.start_at, agencyInfo.cancelDeadlineHours);
  const reschedulable = !canceled && !completed && isFuture && row.reschedule_status == null;
  const hasPendingReschedule = row.reschedule_status === "requested";
  const canApproveReschedule = hasPendingReschedule && row.reschedule_requested_by === "counselor";
  const mapsQuery = agencyInfo.address ?? agencyInfo.name ?? "";

  return (
    <>
      {showCancelModal && row && (
        <CancelModal
          row={row}
          agencyInfo={agencyInfo}
          counselorFee={counselorInfo?.fee}
          onConfirm={handleCancelConfirm}
          onClose={() => setShowCancelModal(false)}
          loading={actionLoading}
        />
      )}
      {showRescheduleModal && (
        <RescheduleModal
          counselorId={counselorId}
          supabase={supabase}
          onConfirm={handleRescheduleConfirm}
          onClose={() => setShowRescheduleModal(false)}
          loading={actionLoading}
        />
      )}
      {showUndo && (
        <UndoToast
          message="予約をキャンセルしました"
          onAction={handleUndoCancel}
          onClose={() => setShowUndo(false)}
          busy={undoBusy}
        />
      )}

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: ".28em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            reservation
          </p>
          <h1
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: 24,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            予約の詳細
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            {canceled
              ? "この予約はキャンセル済みです"
              : completed
                ? "面談完了済みです。口コミでこの体験を残せます。"
                : hasPendingReschedule
                  ? "日程変更を申請中です"
                  : isFuture
                    ? "ご予約ありがとうございます"
                    : "面談予定の時刻を過ぎました。担当の確認をお待ちください。"}
          </p>
        </div>

        {/* エラー表示 */}
        {actionError && (
          <div
            style={{
              background: "rgba(200,60,60,.08)",
              border: "1px solid rgba(200,60,60,.3)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 13,
              color: "#B91C1C",
            }}
          >
            {actionError}
          </div>
        )}

        {/* 口コミ導線 */}
        {completed && (
          <div
            style={{
              background: "rgba(122,158,135,.08)",
              border: "1px solid rgba(122,158,135,.3)",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="8.5" stroke="var(--green)" strokeWidth="1.4" />
              <path
                d="M6 10.5L9 13l5-6"
                stroke="var(--green)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: "var(--ink)", marginBottom: 2 }}>
                面談完了 — 口コミを残しませんか？
              </p>
              <p style={{ fontSize: 11, color: "var(--muted)" }}>
                実際に会った方だけの言葉が、次の誰かを助けます。
              </p>
            </div>
            <Link
              href={`/reviews/new?reservation=${row.id}`}
              style={{
                flexShrink: 0,
                fontSize: 12,
                padding: "8px 14px",
                border: "1px solid var(--green)",
                borderRadius: 50,
                color: "var(--green)",
                textDecoration: "none",
                fontFamily: "var(--font-mincho)",
              }}
            >
              口コミを書く →
            </Link>
          </div>
        )}

        {/* 日程変更申請中バナー */}
        {hasPendingReschedule && (
          <div
            style={{
              background: "rgba(212,168,90,.08)",
              border: "1px solid rgba(212,168,90,.35)",
              borderRadius: 14,
              padding: "16px 18px",
              marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 13, color: "var(--ink)", marginBottom: 6 }}>
              {row.reschedule_requested_by === "user"
                ? "日程変更を申請しました。カウンセラーの返答をお待ちください。"
                : "カウンセラーから日程変更の提案が届いています。"}
            </p>
            {row.reschedule_proposed_start && (
              <p style={{ fontSize: 12, color: "var(--mid)" }}>
                希望日時：{formatDateTimeJa(row.reschedule_proposed_start)}
              </p>
            )}
            {row.reschedule_expires_at && (
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                了承期限：{formatDateTimeShort(row.reschedule_expires_at)}まで
              </p>
            )}
            {canApproveReschedule && (
              <button
                type="button"
                onClick={handleApproveReschedule}
                disabled={actionLoading}
                style={{
                  marginTop: 12,
                  padding: "10px 22px",
                  borderRadius: 50,
                  border: "none",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: 13,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading ? "処理中…" : "この日程で了承する"}
              </button>
            )}
          </div>
        )}

        {/* 予約サマリ */}
        <section
          style={{
            background: "linear-gradient(135deg, #FFF8E1 0%, #FEFAF0 100%)",
            border: "1px solid #F0E4C2",
            borderRadius: 16,
            padding: "20px 22px",
            marginBottom: 16,
            opacity: canceled ? 0.7 : 1,
            boxShadow: "0 2px 12px rgba(212, 168, 90, .08)",
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 22,
              right: 22,
              height: 2,
              background: "linear-gradient(90deg, transparent, #D4A85A, transparent)",
              borderRadius: 2,
            }}
          />
          <p style={{ fontSize: 11, color: "#8B7A4D", marginBottom: 4, letterSpacing: ".04em" }}>
            {row.agency_name ?? "—"}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: 17,
              color: "var(--ink)",
              marginBottom: 12,
            }}
          >
            {row.counselor_name ?? "指名なし"} カウンセラー
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Row label="面談日時" value={formatDateTimeJa(row.start_at)} />
            {row.meeting_type && <Row label="形式" value={row.meeting_type} />}
            {row.notes && <Row label="メモ" value={row.notes} multiline />}
          </div>

          {row.agency_message && (
            <div
              style={{
                marginTop: 16,
                padding: "14px 16px",
                background: "rgba(200,169,122,.10)",
                border: "1px solid rgba(200,169,122,.30)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: 12,
              }}
              aria-label="相談所からのメッセージ"
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: ".18em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Message from {row.agency_name ?? "相談所"}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: 13,
                  color: "var(--ink)",
                  lineHeight: 1.85,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {row.agency_message}
              </p>
              {row.agency_message_at && (
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    marginTop: 8,
                    marginBottom: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {formatDateTimeJa(row.agency_message_at)}
                </p>
              )}
            </div>
          )}

          {counselorId && (
            <Link
              href={`/counselors/${counselorId}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 18,
                padding: "10px 20px",
                fontSize: 13,
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                borderRadius: 50,
                textDecoration: "none",
                fontFamily: "var(--font-mincho)",
              }}
            >
              このカウンセラーのプロフィールを見る
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </section>

        {/* カウンセラー基本情報 */}
        {counselorInfo && (
          <section
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "20px 22px",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 15,
                color: "var(--ink)",
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: "1px solid var(--pale)",
              }}
            >
              担当カウンセラー
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F5E8D8, #EDD8C0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {counselorInfo.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={counselorInfo.photoUrl}
                    alt={counselorInfo.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                    <circle cx="20" cy="15" r="8" fill="#C8A97A" opacity=".6" />
                    <path
                      d="M4 38c0-8.837 7.163-16 16-16s16 7.163 16 16"
                      stroke="#C8A97A"
                      strokeWidth="1.5"
                      fill="none"
                      opacity=".4"
                    />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-mincho)",
                    fontSize: 16,
                    color: "var(--ink)",
                    marginBottom: 2,
                  }}
                >
                  {counselorInfo.name}
                </p>
                {counselorInfo.area && (
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>{counselorInfo.area}</p>
                )}
                {counselorInfo.ratingAvg != null &&
                  counselorInfo.ratingAvg > 0 &&
                  counselorInfo.reviewCount != null &&
                  counselorInfo.reviewCount > 0 && (
                    <p style={{ fontSize: 11, color: "var(--mid)", marginTop: 2 }}>
                      <span style={{ color: "var(--accent)" }}>★</span>{" "}
                      {counselorInfo.ratingAvg.toFixed(1)}（{counselorInfo.reviewCount}件）
                    </p>
                  )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {counselorInfo.specialties && counselorInfo.specialties.length > 0 && (
                <div>
                  <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em", marginBottom: 4 }}>
                    専門分野
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {counselorInfo.specialties.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          background: "var(--pale)",
                          color: "var(--mid)",
                          borderRadius: 20,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(counselorInfo.experienceLabel ||
                (counselorInfo.yearsOfExperience != null && counselorInfo.yearsOfExperience > 0)) && (
                <Row
                  label="経歴・実績"
                  value={counselorInfo.experienceLabel ?? `${counselorInfo.yearsOfExperience}年`}
                />
              )}
              {counselorInfo.catchphrase && (
                <div
                  style={{
                    padding: "12px 14px",
                    background: "var(--pale)",
                    borderRadius: 10,
                    borderLeft: "2px solid var(--accent)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-mincho)",
                      fontSize: 13,
                      color: "var(--ink)",
                      lineHeight: 1.7,
                    }}
                  >
                    「{counselorInfo.catchphrase}」
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 所属相談所カード */}
        {agencyInfo.id && agencyInfo.name && (
          <Link
            href={`/agencies/${agencyInfo.id}`}
            style={{
              display: "block",
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "16px 18px",
              marginBottom: 16,
              textDecoration: "none",
              color: "inherit",
              transition: "transform .2s, box-shadow .2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    color: "var(--muted)",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  所属相談所
                </p>
                <p style={{ fontFamily: "var(--font-mincho)", fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>
                  {agencyInfo.name}
                </p>
                {agencyInfo.area && <p style={{ fontSize: 11, color: "var(--muted)" }}>{agencyInfo.area}</p>}
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0 }}>
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        )}

        {/* 相談所情報 */}
        {(agencyInfo.address || agencyInfo.access || agencyInfo.hours || agencyInfo.directions) && (
          <section
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "20px 22px",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 15,
                color: "var(--ink)",
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: "1px solid var(--pale)",
              }}
            >
              会場へのアクセス
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {agencyInfo.address && <Row label="所在地" value={agencyInfo.address} />}
              {agencyInfo.access && <Row label="アクセス" value={agencyInfo.access} />}
              {agencyInfo.hours && <Row label="営業時間" value={agencyInfo.hours} />}
              {agencyInfo.holiday && <Row label="定休日" value={agencyInfo.holiday} />}
              {agencyInfo.directions && (
                <Row label="最寄駅からの行き方" value={agencyInfo.directions} multiline />
              )}
            </div>
            {mapsQuery && (
              <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", border: "1px solid var(--pale)" }}>
                <iframe
                  title="Google マップ"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
                  width="100%"
                  height="240"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </section>
        )}

        {/* アクション（キャンセル / 日程変更 / 連絡先） */}
        {!canceled && isFuture && !hasPendingReschedule && (
          <section
            style={{
              background: "var(--pale)",
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 16,
            }}
          >
            {cancellable ? (
              <>
                {/* 日程変更を主アクションとして優先表示。キャンセルは副アクション */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  {reschedulable && (
                    <button
                      type="button"
                      onClick={() => setShowRescheduleModal(true)}
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        background: "var(--accent)",
                        border: "1px solid var(--accent)",
                        borderRadius: 50,
                        padding: "10px 22px",
                        cursor: "pointer",
                        fontFamily: "var(--font-mincho)",
                      }}
                    >
                      日程変更を申請する
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    style={{
                      fontSize: 13,
                      color: "var(--rose)",
                      background: "white",
                      border: "1px solid var(--rose)",
                      borderRadius: 50,
                      padding: "10px 22px",
                      cursor: "pointer",
                      fontFamily: "var(--font-mincho)",
                    }}
                  >
                    この予約をキャンセルする
                  </button>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    lineHeight: 1.8,
                    display: "inline-flex",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    {agencyInfo.cancelPolicy ?? "面談前であればマイページからキャンセルできます。"}
                  </span>
                  <InfoTooltip ariaLabel="キャンセル規定の詳細を見る" variant="muted" align="left-anchor">
                    <CancelPolicyTooltipContent
                      policy={agencyInfo.cancelPolicy}
                      phone={agencyInfo.phone}
                      email={agencyInfo.email}
                    />
                  </InfoTooltip>
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.8, marginBottom: 10 }}>
                  マイページからのキャンセル期限を過ぎました。お手数ですが相談所へ直接ご連絡ください。
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13 }}>
                  {agencyInfo.phone && (
                    <a
                      href={`tel:${agencyInfo.phone}`}
                      style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M3 2l2 1-1 2c1 2 3 4 5 5l2-1 1 2-2 2c-4 0-9-5-9-9l2-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                      </svg>
                      {agencyInfo.phone}
                    </a>
                  )}
                  {agencyInfo.email && (
                    <a
                      href={`mailto:${agencyInfo.email}`}
                      style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <rect x="1.5" y="3" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        <path d="M2 4l5 4 5-4" stroke="currentColor" strokeWidth="1.2" fill="none" />
                      </svg>
                      {agencyInfo.email}
                    </a>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        <Link
          href="/mypage"
          style={{
            display: "block",
            textAlign: "center",
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 24,
            textDecoration: "underline",
          }}
        >
          ← マイページへ戻る
        </Link>
      </div>
    </>
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.7, whiteSpace: multiline ? "pre-line" : "normal" }}>
        {value}
      </span>
    </div>
  );
}

function SkeletonView() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <div className="sk-pulse" style={{ width: 120, height: 12, marginBottom: 12 }} />
      <div className="sk-pulse" style={{ width: 180, height: 28, marginBottom: 30 }} />
      <div className="sk-pulse" style={{ width: "100%", height: 160, marginBottom: 16, borderRadius: 16 }} />
      <div className="sk-pulse" style={{ width: "100%", height: 240, borderRadius: 16 }} />
      <style>{`
        .sk-pulse {
          background: linear-gradient(90deg, rgba(0,0,0,.05), rgba(0,0,0,.09), rgba(0,0,0,.05));
          background-size: 200% 100%;
          border-radius: 6px;
          animation: sk-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sk-pulse {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
