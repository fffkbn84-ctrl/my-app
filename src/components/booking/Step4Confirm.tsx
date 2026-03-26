"use client";

import { useState } from "react";
import type { Slot, BookingUserInfo } from "@/types/booking";

/* ────────────────────────────────────────────────────────────
   Props
──────────────────────────────────────────────────────────── */
interface Props {
  counselorName: string;
  agencyName: string;
  slot: Slot;
  userInfo: BookingUserInfo;
  onConfirm: () => void;
  onBack: () => void;
}

function formatDateJa(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
}

/* ────────────────────────────────────────────────────────────
   Step4Confirm
──────────────────────────────────────────────────────────── */
export default function Step4Confirm({
  counselorName,
  agencyName,
  slot,
  userInfo,
  onConfirm,
  onBack,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // TODO: Supabase で slots.status = 'booked' に更新
    await new Promise((r) => setTimeout(r, 1200));
    onConfirm();
  };

  return (
    <div>
      {/* カウンセラーカード */}
      <div
        className="flex items-center gap-3.5 p-5 rounded-xl mb-5"
        style={{
          background: "white",
          border: "1px solid var(--pale)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #F5E8D8, #EDD8C0)",
          }}
        >
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
          <p className="text-[15px]" style={{ color: "var(--black)" }}>
            {counselorName} カウンセラー
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
            {agencyName}
          </p>
        </div>
      </div>

      {/* 予約詳細カード */}
      <div
        className="rounded-2xl mb-5"
        style={{
          padding: "28px",
          background: "var(--pale)",
        }}
      >
        {/* 日時 */}
        <div
          className="flex justify-between items-center py-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,.05)" }}
        >
          <span className="text-xs tracking-[0.08em]" style={{ color: "var(--mid)" }}>日時</span>
          <span className="text-sm" style={{ color: "var(--black)" }}>
            {formatDateJa(slot.date)} {slot.startTime}〜
          </span>
        </div>
        {/* 形式 */}
        <div
          className="flex justify-between items-center py-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,.05)" }}
        >
          <span className="text-xs tracking-[0.08em]" style={{ color: "var(--mid)" }}>形式</span>
          <span className="text-sm" style={{ color: "var(--black)" }}>
            {userInfo.meetingFormat || slot.meetingType || "対面"}
          </span>
        </div>
        {/* 所要時間 */}
        <div
          className="flex justify-between items-center py-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,.05)" }}
        >
          <span className="text-xs tracking-[0.08em]" style={{ color: "var(--mid)" }}>所要時間</span>
          <span className="text-sm" style={{ color: "var(--black)" }}>約60分</span>
        </div>
        {/* 費用 */}
        <div className="flex justify-between items-center py-3">
          <span className="text-xs tracking-[0.08em]" style={{ color: "var(--mid)" }}>費用</span>
          <span className="text-sm" style={{ color: "var(--green)" }}>無料</span>
        </div>
      </div>

      {/* グリーンnotice */}
      <div
        className="flex gap-2.5 items-start rounded-[10px] mb-7 text-xs leading-[1.8]"
        style={{
          padding: "16px 20px",
          background: "var(--green-pale)",
          color: "var(--green)",
        }}
      >
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
      <div className="flex items-center justify-between pb-8">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm transition-colors duration-200 disabled:opacity-50"
          style={{ color: "var(--mid)" }}
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
          className="flex items-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide text-white transition-all duration-200 hover:opacity-90 disabled:opacity-70"
          style={{
            background: "var(--accent)",
            boxShadow: loading ? "none" : "0 4px 16px rgba(200,169,122,0.35)",
          }}
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
