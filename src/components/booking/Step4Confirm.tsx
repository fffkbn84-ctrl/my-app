"use client";

import { useState } from "react";
import type { Slot, BookingUserInfo } from "@/types/booking";
import { useAuth } from "@/lib/auth/AuthProvider";
import { DIAGNOSIS_TYPES, type DiagnosisTypeId } from "@/lib/diagnosis";
import { WEATHER_DESCRIPTIONS, type WeatherKey } from "@/app/kinda-note/data/weatherDescriptions";
import { createReservation } from "@/lib/reservations";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  CancelPolicyTooltipContent,
  FreeMeetingTooltipContent,
  MeetingFormatTooltipContent,
} from "@/lib/policyMessages";

export interface AgencyCancelInfo {
  policy?: string;
  phone?: string;
  email?: string;
}

interface Props {
  counselorName: string;
  agencyName: string;
  slot: Slot;
  userInfo: BookingUserInfo;
  showCounselorRow?: boolean;
  /** 本物の Supabase counselor UUID（モックなら null） */
  counselorId?: string | null;
  /** 本物の Supabase agency UUID（モックなら null） */
  agencyId?: string | null;
  /** 相談所のキャンセル規定・連絡先（InfoTooltip 表示用） */
  agencyCancelInfo?: AgencyCancelInfo;
  /** 予約 INSERT 成功時に呼ばれる。reservationId を渡す */
  onConfirm: (reservationId: string | null) => void;
  onBack: () => void;
}

function formatDateJa(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}

/** "YYYY-MM-DD" + "HH:MM" → JST ローカル時刻として ISO 8601 に変換 */
function toIsoFromDateAndTime(date: string, time: string): string {
  // タイムゾーン非依存に組み立てる：date と time をそのままローカル時刻として扱う
  const iso = new Date(`${date}T${time}:00`).toISOString();
  return iso;
}

export default function Step4Confirm({
  counselorName,
  agencyName,
  slot,
  userInfo,
  showCounselorRow = false,
  counselorId = null,
  agencyId = null,
  agencyCancelInfo,
  onConfirm,
  onBack,
}: Props) {
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!user) {
      setError("ログインが切れているようです。お手数ですが再度ログインしてください。");
      return;
    }
    setLoading(true);
    setError(null);

    const startAt = toIsoFromDateAndTime(slot.date, slot.startTime);
    const endAt = toIsoFromDateAndTime(slot.date, slot.endTime);
    const meetingType =
      userInfo.meetingFormat === "対面" || userInfo.meetingFormat === "オンライン"
        ? userInfo.meetingFormat
        : (slot.meetingType ?? null);

    const result = await createReservation(supabase, {
      userId: user.id,
      userName: userInfo.fullName,
      userEmail: userInfo.email || (user.email ?? ""),
      notes: userInfo.message || null,
      slotId: slot.id, // UUID なら排他制御が走る、モック ID ならスキップ
      startAt,
      endAt,
      meetingType,
      counselorId,
      counselorName,
      agencyId,
      agencyName,
      // 024 — 共有を選んだ診断結果のスナップショット
      sharedKindaTypeKey: userInfo.sharedKindaTypeKey ?? null,
      sharedKindaTypeAt: userInfo.sharedKindaTypeAt ?? null,
      sharedKindaNoteKey: userInfo.sharedKindaNoteKey ?? null,
      sharedKindaNoteAt: userInfo.sharedKindaNoteAt ?? null,
      sharedKindaNoteFreetext: userInfo.sharedKindaNoteFreetext ?? null,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    onConfirm(result.reservationId);
  };

  const meetingLabel =
    userInfo.meetingFormat === "対面"
      ? "対面"
      : userInfo.meetingFormat === "オンライン"
      ? "オンライン（Zoom）"
      : slot.meetingType ?? "対面";

  // 024 — 共有予定の診断結果（あれば確認画面に表示）
  const sharedItems: string[] = [];
  if (userInfo.sharedKindaTypeKey) {
    const t = DIAGNOSIS_TYPES[userInfo.sharedKindaTypeKey as DiagnosisTypeId];
    sharedItems.push(`Kinda type：${t?.name ?? userInfo.sharedKindaTypeKey}`);
  }
  if (userInfo.sharedKindaNoteKey) {
    const w = WEATHER_DESCRIPTIONS[userInfo.sharedKindaNoteKey as WeatherKey];
    let line = `Kinda note：${w?.name_ja ?? userInfo.sharedKindaNoteKey}`;
    if (userInfo.sharedKindaNoteFreetext) {
      line += `\n　└ あなたの言葉：「${userInfo.sharedKindaNoteFreetext.slice(0, 60)}${userInfo.sharedKindaNoteFreetext.length > 60 ? "…" : ""}」`;
    }
    sharedItems.push(line);
  }

  const rows = [
    ...(showCounselorRow ? [{ key: "担当カウンセラー", val: counselorName }] : []),
    { key: "日時", val: `${formatDateJa(slot.date)} ${slot.startTime}〜` },
    { key: "形式", val: meetingLabel },
    { key: "所要時間", val: "約60分" },
    { key: "お名前", val: userInfo.fullName || "—" },
    { key: "メール", val: userInfo.email || "—" },
    ...(userInfo.message && userInfo.message.trim().length > 0
      ? [{ key: "事前に伝えたいこと", val: userInfo.message.trim(), multiline: true }]
      : []),
    ...(sharedItems.length > 0
      ? [{ key: "担当者に共有", val: sharedItems.join("\n"), multiline: true }]
      : []),
    { key: "費用", val: "無料", green: true },
  ];

  return (
    <div>
      {/* カウンセラーカード */}
      <div className="bk-confirm-counselor">
        <div className="bk-confirm-av">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="10" r="5" fill="#C8A97A" opacity=".6" />
            <path
              d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10"
              stroke="#C8A97A"
              strokeWidth="1.3"
              fill="none"
              opacity=".4"
            />
          </svg>
        </div>
        <div>
          <p className="bk-confirm-name">{counselorName} カウンセラー</p>
          <p className="bk-confirm-org">{agencyName}</p>
        </div>
      </div>

      {/* 予約詳細カード */}
      <div className="bk-confirm-card">
        {rows.map(({ key, val, green, multiline }) => (
          <div
            key={key}
            className="bk-confirm-row"
            style={multiline ? { alignItems: "flex-start", flexDirection: "column", gap: 6 } : undefined}
          >
            <span className="bk-confirm-key">{key}</span>
            <span
              className="bk-confirm-val"
              style={{
                ...(green ? { color: "var(--green)" } : {}),
                display: multiline ? "block" : "inline-flex",
                alignItems: "center",
                ...(multiline
                  ? {
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.85,
                      padding: "10px 12px",
                      background: "var(--pale)",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "var(--ink)",
                      width: "100%",
                    }
                  : {}),
              }}
            >
              {val}
              {key === "費用" && (
                <InfoTooltip
                  ariaLabel="面談料が無料である条件を見る"
                  variant="muted"
                >
                  <FreeMeetingTooltipContent />
                </InfoTooltip>
              )}
              {key === "形式" && (
                <InfoTooltip
                  ariaLabel="面談形式（対面 / オンライン）の詳細を見る"
                  variant="muted"
                >
                  <MeetingFormatTooltipContent />
                </InfoTooltip>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* 自分の入力を見直すための案内（押し付けない一言） */}
      <p
        style={{
          fontSize: 11,
          color: "var(--muted)",
          textAlign: "center",
          margin: "8px 0 0",
          lineHeight: 1.8,
        }}
      >
        ここに表示されている内容で予約が確定します。修正したい場合は「戻る」から編集できます。
      </p>

      {/* グリーンnotice */}
      <div className="bk-confirm-notice">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{ flexShrink: 0, marginTop: "2px" }}
        >
          <path
            d="M9 1L1.5 5v6c0 4.14 3.21 8.02 7.5 9 4.29-.98 7.5-4.86 7.5-9V5L9 1z"
            stroke="#7A9E87"
            strokeWidth="1.2"
            fill="rgba(122,158,135,.15)"
          />
          <path
            d="M6 9l2 2 4-4"
            stroke="#7A9E87"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          予約完了後、確認メールをお送りします。マイページから日時の確認・キャンセル
          <InfoTooltip
            ariaLabel="キャンセル規定の詳細を見る"
            variant="muted"
          >
            <CancelPolicyTooltipContent
              policy={agencyCancelInfo?.policy}
              phone={agencyCancelInfo?.phone}
              email={agencyCancelInfo?.email}
            />
          </InfoTooltip>
          もできます。
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div
          role="alert"
          style={{
            background: "rgba(196,135,122,.08)",
            border: "1px solid var(--rose)",
            borderRadius: 10,
            padding: "12px 16px",
            color: "var(--rose)",
            fontSize: 13,
            lineHeight: 1.7,
            margin: "16px 0",
          }}
        >
          {error}
        </div>
      )}

      {/* ナビボタン */}
      <div className="step-nav">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="bk-btn bk-btn-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          戻る
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="bk-btn bk-btn-accent bk-btn-lg"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              予約処理中...
            </>
          ) : (
            <>
              予約を確定する
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
