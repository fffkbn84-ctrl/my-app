"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { BookingState, BookingUserInfo, Slot } from "@/types/booking";
import Step1Calendar from "./Step1Calendar";
import Step2Slots from "./Step2Slots";
import Step3Form from "./Step3Form";
import Step4Confirm from "./Step4Confirm";

/* ────────────────────────────────────────────────────────────
   Props
──────────────────────────────────────────────────────────── */
interface Props {
  counselorId: string;
  counselorName: string;
  agencyName: string;
}

/* ────────────────────────────────────────────────────────────
   初期状態
──────────────────────────────────────────────────────────── */
const initialUserInfo: BookingUserInfo = {
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  email: "",
  phone: "",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  gender: "",
  message: "",
};

/* ────────────────────────────────────────────────────────────
   ステップインジケーター
──────────────────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: "日付を選ぶ" },
  { num: 2, label: "時間を選ぶ" },
  { num: 3, label: "情報を入力" },
  { num: 4, label: "予約確定" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 md:mb-14">
      {STEPS.map((step, i) => (
        <div key={step.num} className="flex items-center">
          {/* ステップ円 */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                step.num < current
                  ? "bg-accent text-white"
                  : step.num === current
                  ? "bg-accent text-white ring-4 ring-accent/20"
                  : "bg-light text-muted"
              }`}
            >
              {step.num < current ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-xs hidden sm:block tracking-wide ${
                step.num === current ? "text-ink" : "text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* コネクター */}
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 md:w-20 h-px mx-1 mb-5 transition-all duration-300 ${
                step.num < current ? "bg-accent" : "bg-light"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   BookingFlow
──────────────────────────────────────────────────────────── */
export default function BookingFlow({ counselorId, counselorName, agencyName }: Props) {
  const [state, setState] = useState<BookingState>({
    step: 1,
    selectedDate: null,
    selectedSlot: null,
    userInfo: initialUserInfo,
  });
  const [isComplete, setIsComplete] = useState(false);

  // ブラウザバック時にlocked枠を解放するためのref
  const lockedSlotRef = useRef<Slot | null>(null);

  // TODO: Supabase実装時はここでslots.status='open'に戻すAPI呼び出し
  const releaseLockedSlot = useCallback(() => {
    if (lockedSlotRef.current) {
      // console.log("スロット解放:", lockedSlotRef.current.id);
      lockedSlotRef.current = null;
    }
  }, []);

  // ページ離脱・ブラウザバック時の解放
  useEffect(() => {
    const handlePopState = () => releaseLockedSlot();
    const handleBeforeUnload = () => releaseLockedSlot();

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      releaseLockedSlot(); // アンマウント時も解放
    };
  }, [releaseLockedSlot]);

  const goToStep = useCallback((step: BookingState["step"]) => {
    setState((prev) => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setState((prev) => ({ ...prev, selectedDate: date, selectedSlot: null }));
    goToStep(2);
  }, [goToStep]);

  const handleSlotSelect = useCallback((slot: Slot) => {
    // TODO: Supabase実装時はここで slots.status='locked' に更新
    lockedSlotRef.current = slot;
    setState((prev) => ({ ...prev, selectedSlot: slot }));
    goToStep(3);
  }, [goToStep]);

  const handleUserInfoChange = useCallback((info: BookingUserInfo) => {
    setState((prev) => ({ ...prev, userInfo: info }));
  }, []);

  const handleConfirm = useCallback(() => {
    // TODO: Supabase で slots.status='booked' に更新する排他制御API呼び出し
    lockedSlotRef.current = null; // 確定済みなので解放不要
    setIsComplete(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* 予約完了画面 */
  if (isComplete) {
    return <CompletionScreen counselorName={counselorName} slot={state.selectedSlot!} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">
      {/* カウンセラー情報（ミニ表示） */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-pale rounded-xl border border-light">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shrink-0"
          style={{ background: "var(--accent)", fontFamily: "var(--font-mincho)" }}
        >
          {counselorName.slice(-1)}
        </div>
        <div>
          <p className="text-xs text-muted">{agencyName}</p>
          <p className="text-sm text-ink" style={{ fontFamily: "var(--font-mincho)" }}>
            {counselorName} カウンセラーへの予約
          </p>
        </div>
      </div>

      <StepIndicator current={state.step} />

      {state.step === 1 && (
        <Step1Calendar
          counselorId={counselorId}
          selectedDate={state.selectedDate}
          onSelect={handleDateSelect}
        />
      )}
      {state.step === 2 && state.selectedDate && (
        <Step2Slots
          counselorId={counselorId}
          date={state.selectedDate}
          onSelect={handleSlotSelect}
          onBack={() => goToStep(1)}
        />
      )}
      {state.step === 3 && (
        <Step3Form
          userInfo={state.userInfo}
          onChange={handleUserInfoChange}
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
        />
      )}
      {state.step === 4 && state.selectedSlot && (
        <Step4Confirm
          counselorName={counselorName}
          agencyName={agencyName}
          slot={state.selectedSlot}
          userInfo={state.userInfo}
          onConfirm={handleConfirm}
          onBack={() => goToStep(3)}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   予約完了画面
──────────────────────────────────────────────────────────── */
function CompletionScreen({ counselorName, slot }: { counselorName: string; slot: Slot }) {
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      {/* チェックアイコン */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
        style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--accent)" strokeWidth="2">
          <path d="M6 16l7 7 13-13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2
        className="text-2xl md:text-3xl text-ink mb-4"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        ご予約が完了しました
      </h2>
      <p className="text-sm text-mid leading-relaxed mb-8">
        ご登録いただいたメールアドレスに確認メールを送信しました。
        <br />
        当日はどうぞよろしくお願いします。
      </p>

      {/* 予約サマリー */}
      <div className="bg-pale rounded-2xl p-6 border border-light text-left mb-8">
        <p className="text-xs text-muted uppercase tracking-wide mb-4">予約内容</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">カウンセラー</span>
            <span className="text-ink" style={{ fontFamily: "var(--font-mincho)" }}>
              {counselorName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">日時</span>
            <span className="text-ink">
              {slot.date} {slot.startTime}〜{slot.endTime}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">面談料金</span>
            <span className="text-ink">無料</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/"
          className="px-6 py-3 border border-light text-mid rounded-full text-sm hover:border-ink hover:text-ink transition-all duration-200"
        >
          トップへ戻る
        </a>
        <a
          href="/counselors"
          className="px-6 py-3 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity duration-200"
        >
          他のカウンセラーを見る
        </a>
      </div>
    </div>
  );
}
