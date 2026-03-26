"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { BookingState, BookingUserInfo, Slot } from "@/types/booking";
import Step1DateTime from "./Step1Calendar";
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
   ステップ定義（4ステップ）
──────────────────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: "日時を選ぶ" },
  { num: 2, label: "情報を入力" },
  { num: 3, label: "内容を確認" },
  { num: 4, label: "予約完了" },
];

/* ────────────────────────────────────────────────────────────
   ステップインジケーター
──────────────────────────────────────────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="relative flex items-start justify-center py-10 mb-12">
      {/* connecting line */}
      <div
        className="absolute z-0 h-px"
        style={{
          top: "calc(40px / 2 + 40px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          background: "var(--light)",
        }}
      />
      {STEPS.map((step) => (
        <div key={step.num} className="flex-1 flex flex-col items-center gap-2 relative z-10">
          <div
            className="w-10 h-10 rounded-full border flex items-center justify-center text-base transition-all duration-300"
            style={{
              fontFamily: "var(--font-serif)",
              ...(step.num < current
                ? { background: "var(--accent)", borderColor: "var(--accent)", color: "white" }
                : step.num === current
                ? { background: "var(--black)", borderColor: "var(--black)", color: "white" }
                : { background: "white", borderColor: "var(--light)", color: "var(--muted)" }),
            }}
          >
            {step.num}
          </div>
          <span
            className="text-[11px] tracking-[0.08em] whitespace-nowrap"
            style={{
              color: step.num <= current ? "var(--black)" : "var(--muted)",
            }}
          >
            {step.label}
          </span>
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

  // ブラウザバック時にlocked枠を解放するためのref
  const lockedSlotRef = useRef<Slot | null>(null);

  // TODO: Supabase実装時はここでslots.status='open'に戻すAPI呼び出し
  const releaseLockedSlot = useCallback(() => {
    if (lockedSlotRef.current) {
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
      releaseLockedSlot();
    };
  }, [releaseLockedSlot]);

  const goToStep = useCallback((step: BookingState["step"]) => {
    setState((prev) => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Step1: 日時（日付＋時間枠）を選んで次へ
  const handleDateTimeNext = useCallback(
    (date: string, slot: Slot) => {
      // TODO: Supabase実装時はここで slots.status='locked' に更新
      lockedSlotRef.current = slot;
      setState((prev) => ({ ...prev, selectedDate: date, selectedSlot: slot }));
      goToStep(2);
    },
    [goToStep]
  );

  const handleUserInfoChange = useCallback((info: BookingUserInfo) => {
    setState((prev) => ({ ...prev, userInfo: info }));
  }, []);

  const handleConfirm = useCallback(() => {
    // TODO: Supabase で slots.status='booked' に更新する排他制御API呼び出し
    lockedSlotRef.current = null;
    goToStep(4);
  }, [goToStep]);

  return (
    <div
      className="mx-auto px-5 sm:px-8 py-10"
      style={{ maxWidth: "720px" }}
    >
      <StepIndicator current={state.step} />

      {/* Step 1: 日時を選ぶ */}
      {state.step === 1 && (
        <Step1DateTime
          counselorId={counselorId}
          selectedDate={state.selectedDate}
          selectedSlot={state.selectedSlot}
          onNext={handleDateTimeNext}
        />
      )}

      {/* Step 2: 情報を入力 */}
      {state.step === 2 && (
        <Step3Form
          userInfo={state.userInfo}
          onChange={handleUserInfoChange}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
        />
      )}

      {/* Step 3: 内容を確認 */}
      {state.step === 3 && state.selectedSlot && (
        <Step4Confirm
          counselorName={counselorName}
          agencyName={agencyName}
          slot={state.selectedSlot}
          userInfo={state.userInfo}
          onConfirm={handleConfirm}
          onBack={() => goToStep(2)}
        />
      )}

      {/* Step 4: 予約完了 */}
      {state.step === 4 && state.selectedSlot && (
        <CompletionScreen counselorName={counselorName} slot={state.selectedSlot} />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   予約完了画面（Step 4）
──────────────────────────────────────────────────────────── */
function CompletionScreen({ counselorName, slot }: { counselorName: string; slot: Slot }) {
  return (
    <div className="text-center py-12">
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
        className="text-3xl mb-3 tracking-[0.06em]"
        style={{ fontFamily: "var(--font-mincho)", color: "var(--black)" }}
      >
        ご予約が完了しました
      </h2>
      <p
        className="text-sm leading-loose mb-9"
        style={{ color: "var(--mid)" }}
      >
        ご登録いただいたメールアドレスに確認メールを送信しました。
        <br />
        当日はどうぞよろしくお願いします。
      </p>

      {/* 予約サマリー */}
      <div
        className="rounded-2xl p-6 text-left mb-7"
        style={{ background: "var(--pale)" }}
      >
        <div
          className="flex justify-between py-2.5 border-b"
          style={{ borderColor: "rgba(0,0,0,.05)" }}
        >
          <span className="text-xs" style={{ color: "var(--mid)" }}>カウンセラー</span>
          <span
            className="text-sm"
            style={{ color: "var(--black)", fontFamily: "var(--font-mincho)" }}
          >
            {counselorName}
          </span>
        </div>
        <div
          className="flex justify-between py-2.5 border-b"
          style={{ borderColor: "rgba(0,0,0,.05)" }}
        >
          <span className="text-xs" style={{ color: "var(--mid)" }}>日時</span>
          <span className="text-sm" style={{ color: "var(--black)" }}>
            {slot.date} {slot.startTime}〜{slot.endTime}
          </span>
        </div>
        <div className="flex justify-between py-2.5">
          <span className="text-xs" style={{ color: "var(--mid)" }}>面談料金</span>
          <span className="text-sm" style={{ color: "var(--black)" }}>無料</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/"
          className="px-6 py-3 border rounded-full text-sm transition-all duration-200 hover:border-ink hover:text-ink"
          style={{ borderColor: "var(--light)", color: "var(--mid)" }}
        >
          トップへ戻る
        </a>
        <a
          href="/counselors"
          className="px-6 py-3 rounded-full text-sm text-white hover:opacity-90 transition-opacity duration-200"
          style={{ background: "var(--accent)" }}
        >
          他のカウンセラーを見る
        </a>
      </div>
    </div>
  );
}
