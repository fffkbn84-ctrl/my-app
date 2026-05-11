"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  /* 相談所カード表示用 */
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

export default function ReservationDetailClient({ reservationId }: { reservationId: string }) {
  const { user, loading: authLoading, supabase } = useAuth();
  const router = useRouter();
  const [row, setRow] = useState<ReservationRow | null>(null);
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>(DEFAULT_INFO);
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const [counselorInfo, setCounselorInfo] = useState<CounselorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 未ログインなら login へリダイレクト
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/login?redirect=/mypage/reservations/${reservationId}`);
    }
  }, [authLoading, user, router, reservationId]);

  // 予約 + 相談所情報を取得
  useEffect(() => {
    if (authLoading || !user || !supabase) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await supabase
        .from("reservations")
        .select(
          "id, slot_id, counselor_id, counselor_name, agency_id, agency_name, start_at, end_at, meeting_type, notes, status, canceled_at, created_at",
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

      // 相談所情報（Supabase 優先・mock フォールバック）
      // user-side で表示する hours / holiday は DB 上は別カラム名:
      //   business_hours_text → hours
      //   closed_weekdays (number[]) → holiday (テキスト変換)
      let info: AgencyInfo = { ...DEFAULT_INFO };
      if (r.agency_id) {
        const ag = await supabase
          .from("agencies")
          .select(
            "id, name, area, address, access, business_hours_text, closed_weekdays, directions, phone, email, cancel_deadline_hours, cancel_policy",
          )
          .eq("id", r.agency_id)
          .maybeSingle();
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
          // closed_weekdays (例: [2,3]) → 「火・水曜定休」
          const labels = ["日", "月", "火", "水", "木", "金", "土"];
          const holidayText = Array.isArray(a.closed_weekdays) && a.closed_weekdays.length > 0
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
      // Supabase が空でも mock があれば埋める
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

      // カウンセラー基本情報の取得（counselor_id が UUID の場合のみ）
      // mock の数値 ID 1〜6 / 101〜105 ではテーブルに存在しないのでスキップ
      if (r.counselor_id && /^[0-9a-f-]{36}$/i.test(r.counselor_id)) {
        const ce = await supabase
          .from("counselors")
          .select("id, name, area, photo_url, specialties, years_of_experience, experience_label, catchphrase, message, rating_avg, review_count")
          .eq("id", r.counselor_id)
          .maybeSingle();
        if (!cancelled && ce.data) {
          const c = ce.data as {
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
          });
        }
      }

      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, supabase, reservationId]);

  const handleCancel = async () => {
    if (!supabase || !row) return;
    const ok = window.confirm(
      `この予約をキャンセルしますか？\n\n${formatDateTimeJa(row.start_at)}\n${row.counselor_name ?? "指名なし"}（${row.agency_name ?? ""}）`,
    );
    if (!ok) return;
    const result = await cancelReservation(supabase, row.id, row.slot_id);
    if (!result.ok) {
      window.alert(`キャンセルに失敗しました：${result.message}`);
      return;
    }
    setRow({ ...row, status: "canceled", canceled_at: new Date().toISOString() });
  };

  if (authLoading || (!user && !error)) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--mid)" }}>
        読み込み中…
      </div>
    );
  }
  if (loading) {
    return <SkeletonView />;
  }
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
  const isFuture = row.start_at ? new Date(row.start_at).getTime() > Date.now() : false;
  const cancellable = !canceled && isFuture && isCancellable(row.start_at, agencyInfo.cancelDeadlineHours);
  const mapsQuery = agencyInfo.address ?? agencyInfo.name ?? "";

  return (
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
          {canceled ? "この予約はキャンセル済みです" : isFuture ? "ご予約ありがとうございます" : "面談は終了しました"}
        </p>
      </div>

      {/* 予約サマリ */}
      <section
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "20px 22px",
          marginBottom: 16,
          opacity: canceled ? 0.7 : 1,
        }}
      >
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, letterSpacing: ".04em" }}>
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
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </section>

      {/* カウンセラー基本情報（Supabase カウンセラーのみ） */}
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

          {/* アバター + 名前 + エリア */}
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

          {/* 専門分野・経験 */}
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

      {/* 所属相談所カード（タップで詳細へ） */}
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
              <p
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: 15,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                {agencyInfo.name}
              </p>
              {agencyInfo.area && (
                <p style={{ fontSize: 11, color: "var(--muted)" }}>{agencyInfo.area}</p>
              )}
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              style={{ color: "var(--accent)", flexShrink: 0 }}
            >
              <path
                d="M5 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
            {agencyInfo.directions && <Row label="最寄駅からの行き方" value={agencyInfo.directions} multiline />}
          </div>

          {/* Google Maps（API キー不要のクエリ埋め込み形式） */}
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

      {/* アクション（キャンセル / 連絡先） */}
      {!canceled && isFuture && (
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
              <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.8, marginBottom: 12 }}>
                {agencyInfo.cancelPolicy ?? "面談前であればマイページからキャンセルできます。"}
              </p>
              <button
                type="button"
                onClick={handleCancel}
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
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
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
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
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

      {/* マイページへ戻る */}
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
  );
}

function Row({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          color: "var(--ink)",
          lineHeight: 1.7,
          whiteSpace: multiline ? "pre-line" : "normal",
        }}
      >
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
