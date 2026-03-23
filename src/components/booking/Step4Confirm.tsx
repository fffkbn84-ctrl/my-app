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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
}

/* ────────────────────────────────────────────────────────────
   確認行
──────────────────────────────────────────────────────────── */
function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3.5 border-b border-light last:border-0">
      <span className="text-xs text-muted w-28 shrink-0">{label}</span>
      <span className="text-sm text-ink text-right">{value || "—"}</span>
    </div>
  );
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
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        情報を修正する
      </button>

      <h2
        className="text-xl md:text-2xl text-ink mb-1"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        予約内容を確認してください
      </h2>
      <p className="text-sm text-muted mb-8">
        内容を確認のうえ、「予約を確定する」をクリックしてください
      </p>

      {/* 予約情報 */}
      <div className="bg-pale rounded-2xl p-6 border border-light mb-6">
        <p className="text-xs text-muted uppercase tracking-wide mb-4">面談情報</p>
        <ConfirmRow label="カウンセラー" value={counselorName} />
        <ConfirmRow label="相談所" value={agencyName} />
        <ConfirmRow label="面談日" value={formatDate(slot.date)} />
        <ConfirmRow label="時間" value={`${slot.startTime} 〜 ${slot.endTime}（60分）`} />
        <ConfirmRow label="料金" value="無料" />
      </div>

      {/* 利用者情報 */}
      <div className="bg-white rounded-2xl p-6 border border-light mb-6">
        <p className="text-xs text-muted uppercase tracking-wide mb-4">ご利用者情報</p>
        <ConfirmRow
          label="お名前"
          value={`${userInfo.lastName} ${userInfo.firstName}（${userInfo.lastNameKana} ${userInfo.firstNameKana}）`}
        />
        <ConfirmRow label="メールアドレス" value={userInfo.email} />
        <ConfirmRow label="電話番号" value={userInfo.phone} />
        <ConfirmRow
          label="生年月日"
          value={
            userInfo.birthYear
              ? `${userInfo.birthYear}年${userInfo.birthMonth}月${userInfo.birthDay}日`
              : ""
          }
        />
        <ConfirmRow label="性別" value={userInfo.gender === "female" ? "女性" : userInfo.gender === "male" ? "男性" : ""} />
        {userInfo.message && (
          <div className="pt-3.5">
            <p className="text-xs text-muted mb-1.5">カウンセラーへのメッセージ</p>
            <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{userInfo.message}</p>
          </div>
        )}
      </div>

      {/* キャンセルポリシー */}
      <div className="bg-pale rounded-xl p-4 border border-light mb-8 text-xs text-muted leading-relaxed">
        <p className="font-medium text-ink mb-1">キャンセルについて</p>
        <p>
          面談前日23:59までキャンセル可能です。当日のキャンセルは、カウンセラーへご連絡ください。
          面談後に、ご感想の口コミをお送りいただけると次の方の参考になります。
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3.5 border border-light text-mid rounded-xl text-sm hover:border-ink hover:text-ink transition-all duration-200 disabled:opacity-50"
        >
          戻る
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="flex-[2] py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-opacity duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ boxShadow: loading ? "none" : "0 4px 16px rgba(200,169,122,0.3)" }}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              予約処理中...
            </>
          ) : (
            "予約を確定する"
          )}
        </button>
      </div>
    </div>
  );
}
