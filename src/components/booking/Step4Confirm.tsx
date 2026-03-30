"use client";

import { useState } from "react";
import type { Slot, BookingUserInfo } from "@/types/booking";

interface Props {
  counselorName: string;
  agencyName: string;
  slot: Slot;
  userInfo: BookingUserInfo;
  showCounselorRow?: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

function formatDateJa(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}

export default function Step4Confirm({
  counselorName,
  agencyName,
  slot,
  userInfo,
  showCounselorRow = false,
  onConfirm,
  onBack,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    onConfirm();
  };

  const meetingLabel =
    userInfo.meetingFormat === "対面"
      ? "対面（カウンセラーオフィス）"
      : userInfo.meetingFormat === "オンライン"
      ? "オンライン（Zoom）"
      : slot.meetingType ?? "対面";

  const rows = [
    ...(showCounselorRow ? [{ key: "担当カウンセラー", val: counselorName }] : []),
    { key: "日時", val: `${formatDateJa(slot.date)} ${slot.startTime}〜` },
    { key: "形式", val: meetingLabel },
    { key: "所要時間", val: "約60分" },
    { key: "お名前", val: userInfo.fullName || "—" },
    { key: "メール", val: userInfo.email || "—" },
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
        {rows.map(({ key, val, green }) => (
          <div key={key} className="bk-confirm-row">
            <span className="bk-confirm-key">{key}</span>
            <span className="bk-confirm-val" style={green ? { color: "var(--green)" } : undefined}>
              {val}
            </span>
          </div>
        ))}
      </div>

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
          予約完了後、確認メールをお送りします。入会の強制はありません。前日まで無料でキャンセル可能です。
        </div>
      </div>

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
