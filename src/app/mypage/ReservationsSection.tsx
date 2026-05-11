"use client";

/**
 * マイページ：予約履歴セクション
 * - 自分の予約を Supabase から取得（RLS で user_id=auth.uid() に絞られる）
 * - 期限内ならキャンセル可、期限切れなら相談所連絡先を表示
 * - active / canceled を分けて表示
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cancelReservation, isCancellable } from "@/lib/reservations";
import { AGENCIES, type Agency } from "@/lib/data";

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
};

type AgencyContact = {
  cancelDeadlineHours: number;
  cancelPolicy?: string;
  phone?: string;
  email?: string;
};

const DEFAULT_CONTACT: AgencyContact = {
  cancelDeadlineHours: 24,
  cancelPolicy: "面談日の前日までキャンセル可能です。",
};

function findMockAgencyContact(agencyName: string | null): AgencyContact | null {
  if (!agencyName) return null;
  const mock: Agency | undefined = AGENCIES.find((a) => a.name === agencyName);
  if (!mock) return null;
  return {
    cancelDeadlineHours: mock.cancelDeadlineHours ?? 24,
    cancelPolicy: mock.cancelPolicy,
    phone: mock.phone,
    email: mock.email,
  };
}

function formatDateJa(iso: string): string {
  const d = new Date(iso);
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}
function formatTimeJa(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ReservationsSection() {
  const { user, loading: authLoading, supabase } = useAuth();
  const [rows, setRows] = useState<ReservationRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agencyContacts, setAgencyContacts] = useState<
    Record<string, AgencyContact>
  >({});

  // 予約一覧の取得
  useEffect(() => {
    if (authLoading) return;
    if (!user || !supabase) {
      setRows([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select(
          "id, slot_id, counselor_id, counselor_name, agency_id, agency_name, start_at, end_at, meeting_type, notes, status, canceled_at, created_at",
        )
        .order("start_at", { ascending: false, nullsFirst: false });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setRows([]);
      } else {
        setRows((data as ReservationRow[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, supabase]);

  // agency_id（UUID）が含まれる予約について Supabase から連絡先情報を取得
  useEffect(() => {
    if (!supabase || !rows || rows.length === 0) return;
    const ids = Array.from(
      new Set(rows.map((r) => r.agency_id).filter((id): id is string => !!id)),
    );
    if (ids.length === 0) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("agencies")
        .select("id, cancel_deadline_hours, cancel_policy, phone, email")
        .in("id", ids);
      if (cancelled || !data) return;
      const next: Record<string, AgencyContact> = {};
      for (const row of data as Array<{
        id: string;
        cancel_deadline_hours: number | null;
        cancel_policy: string | null;
        phone: string | null;
        email: string | null;
      }>) {
        next[row.id] = {
          cancelDeadlineHours: row.cancel_deadline_hours ?? 24,
          cancelPolicy: row.cancel_policy ?? undefined,
          phone: row.phone ?? undefined,
          email: row.email ?? undefined,
        };
      }
      setAgencyContacts(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, rows]);

  const { upcoming, past } = useMemo(() => {
    const list = rows ?? [];
    const now = Date.now();
    const upcoming: ReservationRow[] = [];
    const past: ReservationRow[] = [];
    for (const r of list) {
      const isFuture = r.start_at ? new Date(r.start_at).getTime() > now : true;
      const isActive = r.status === "active";
      if (isActive && isFuture) upcoming.push(r);
      else past.push(r);
    }
    return { upcoming, past };
  }, [rows]);

  const resolveContact = (r: ReservationRow): AgencyContact => {
    if (r.agency_id && agencyContacts[r.agency_id]) {
      return agencyContacts[r.agency_id];
    }
    const mock = findMockAgencyContact(r.agency_name);
    return mock ?? DEFAULT_CONTACT;
  };

  const handleCancel = async (r: ReservationRow) => {
    if (!supabase) return;
    const ok = window.confirm(
      `この予約をキャンセルしますか？\n\n${r.start_at ? formatDateJa(r.start_at) + " " + formatTimeJa(r.start_at) : ""}\n${r.counselor_name ?? ""}（${r.agency_name ?? ""}）`,
    );
    if (!ok) return;
    const result = await cancelReservation(supabase, r.id, r.slot_id);
    if (!result.ok) {
      window.alert(`キャンセルに失敗しました：${result.message}`);
      return;
    }
    setRows((prev) =>
      (prev ?? []).map((row) =>
        row.id === r.id
          ? {
              ...row,
              status: "canceled",
              canceled_at: new Date().toISOString(),
            }
          : row,
      ),
    );
  };

  if (authLoading) return null;
  if (!user) return null; // 未ログイン時は AuthCard が促進カードを出すため、ここでは表示しない

  return (
    <section style={{ marginTop: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 18,
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          予約履歴
        </h2>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          {(rows ?? []).length} reservations
        </span>
      </div>

      {loading && <SkeletonCard />}

      {!loading && error && (
        <p style={{ fontSize: 12, color: "var(--rose)", lineHeight: 1.7 }}>
          予約履歴の取得に失敗しました：{error}
        </p>
      )}

      {!loading && !error && rows && rows.length === 0 && (
        <EmptyState />
      )}

      {!loading && upcoming.length > 0 && (
        <>
          <SubHeader label="これから" />
          {upcoming.map((r) => (
            <ReservationCard
              key={r.id}
              row={r}
              contact={resolveContact(r)}
              onCancel={() => handleCancel(r)}
            />
          ))}
        </>
      )}

      {!loading && past.length > 0 && (
        <>
          <SubHeader label="過去・キャンセル済み" />
          {past.map((r) => (
            <ReservationCard
              key={r.id}
              row={r}
              contact={resolveContact(r)}
              onCancel={() => handleCancel(r)}
              readOnly
            />
          ))}
        </>
      )}
    </section>
  );
}

function SubHeader({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        color: "var(--muted)",
        marginTop: 18,
        marginBottom: 8,
        letterSpacing: ".06em",
      }}
    >
      {label}
    </p>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div
        style={{
          height: 14,
          width: "60%",
          background: "var(--pale)",
          borderRadius: 6,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 12,
          width: "40%",
          background: "var(--pale)",
          borderRadius: 6,
        }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "24px 20px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 13, color: "var(--ink)", marginBottom: 6 }}>
        まだ予約はありません
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--muted)",
          lineHeight: 1.8,
          marginBottom: 14,
        }}
      >
        気になるカウンセラーが見つかったら、面談予約してみましょう。
      </p>
      <Link
        href="/kinda-talk"
        style={{
          display: "inline-block",
          fontSize: 12,
          color: "var(--accent)",
          border: "1px solid var(--accent)",
          padding: "8px 18px",
          borderRadius: 50,
          textDecoration: "none",
        }}
      >
        カウンセラーを見る →
      </Link>
    </div>
  );
}

function ReservationCard({
  row,
  contact,
  onCancel,
  readOnly = false,
}: {
  row: ReservationRow;
  contact: AgencyContact;
  onCancel: () => void;
  readOnly?: boolean;
}) {
  const cancellable = !readOnly && isCancellable(row.start_at, contact.cancelDeadlineHours);
  const canceled = row.status === "canceled";
  const dateLabel = row.start_at
    ? `${formatDateJa(row.start_at)} ${formatTimeJa(row.start_at)}〜`
    : "日時未定";

  return (
    <article
      style={{
        background: "white",
        border: canceled ? "1px solid var(--light)" : "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 10,
        opacity: canceled ? 0.7 : 1,
      }}
    >
      {/* タップで予約詳細へ遷移（カウンセラー詳細/相談所情報/Maps を表示） */}
      <Link
        href={`/mypage/reservations/${row.id}`}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: ".04em",
                marginBottom: 4,
              }}
            >
              {row.agency_name ?? "—"}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 15,
                color: "var(--ink)",
                marginBottom: 6,
              }}
            >
              {row.counselor_name ?? "指名なし"} カウンセラー
            </div>
            <div style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.7 }}>
              {dateLabel}
              {row.meeting_type ? ` ・ ${row.meeting_type}` : ""}
            </div>
          </div>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            {canceled ? (
              <span
                style={{
                  fontSize: 10,
                  background: "var(--pale)",
                  color: "var(--muted)",
                  padding: "3px 10px",
                  borderRadius: 20,
                }}
              >
                キャンセル済み
              </span>
            ) : readOnly ? (
              <span
                style={{
                  fontSize: 10,
                  background: "rgba(122,158,135,.12)",
                  color: "var(--green)",
                  padding: "3px 10px",
                  borderRadius: 20,
                }}
              >
                終了
              </span>
            ) : (
              <span
                style={{
                  fontSize: 10,
                  background: "rgba(200,169,122,.14)",
                  color: "var(--accent)",
                  padding: "3px 10px",
                  borderRadius: 20,
                }}
              >
                予約中
              </span>
            )}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: "var(--muted)", opacity: .6 }}>
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>

      {!canceled && !readOnly && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px dashed var(--pale)",
          }}
        >
          {cancellable ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {contact.cancelPolicy ?? "面談前であればマイページからキャンセルできます。"}
              </p>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  fontSize: 12,
                  color: "var(--rose)",
                  background: "transparent",
                  border: "1px solid var(--rose)",
                  borderRadius: 50,
                  padding: "6px 16px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                キャンセルする
              </button>
            </div>
          ) : (
            <div
              style={{
                background: "var(--pale)",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 11,
                color: "var(--mid)",
                lineHeight: 1.7,
              }}
            >
              <p style={{ marginBottom: 6 }}>
                マイページからのキャンセル期限を過ぎました。お手数ですが相談所へ直接ご連絡ください。
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  fontSize: 11,
                }}
              >
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M3 2l2 1-1 2c1 2 3 4 5 5l2-1 1 2-2 2c-4 0-9-5-9-9l2-2z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="1.5" y="3" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                      <path d="M2 4l5 4 5-4" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                    {contact.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
