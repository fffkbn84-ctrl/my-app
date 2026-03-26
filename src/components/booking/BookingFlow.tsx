"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { BookingState, BookingUserInfo, Slot } from "@/types/booking";
import Step1DateTime from "./Step1Calendar";
import Step3Form from "./Step3Form";
import Step4Confirm from "./Step4Confirm";

interface Props {
  counselorId: string;
  counselorName: string;
  agencyName: string;
}

const initialUserInfo: BookingUserInfo = {
  fullName: "",
  fullNameKana: "",
  age: "",
  prefecture: "",
  email: "",
  meetingFormat: "",
  message: "",
};

const STEPS = [
  { num: 1, label: "日時を選ぶ" },
  { num: 2, label: "情報を入力" },
  { num: 3, label: "内容を確認" },
  { num: 4, label: "予約完了" },
];

/* ────────────────────────────────────────────────────────────
   ステップインジケーター（白背景対応）
──────────────────────────────────────────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="relative flex items-start justify-center py-10 mb-10">
      {/* connecting line */}
      <div
        className="absolute z-0 h-px"
        style={{
          top: "calc(40px + 40px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          background: "var(--light)",
        }}
      />
      {STEPS.map((step) => {
        const isDone = step.num < current;
        const isActive = step.num === current;
        return (
          <div key={step.num} className="flex-1 flex flex-col items-center gap-2 relative z-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base transition-all duration-300"
              style={{
                fontFamily: "var(--font-serif)",
                ...(isDone
                  ? {
                      background: "var(--accent)",
                      border: "1px solid var(--accent)",
                      color: "white",
                    }
                  : isActive
                  ? {
                      background: "var(--black)",
                      border: "1.5px solid var(--black)",
                      color: "white",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid var(--light)",
                      color: "var(--muted)",
                    }),
              }}
            >
              {step.num}
            </div>
            <span
              className="text-[11px] tracking-[0.08em] whitespace-nowrap"
              style={{
                color: isDone || isActive ? "var(--ink)" : "var(--muted)",
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
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

  const lockedSlotRef = useRef<Slot | null>(null);

  const releaseLockedSlot = useCallback(() => {
    if (lockedSlotRef.current) lockedSlotRef.current = null;
  }, []);

  useEffect(() => {
    const onPop = () => releaseLockedSlot();
    const onUnload = () => releaseLockedSlot();
    window.addEventListener("popstate", onPop);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", onUnload);
      releaseLockedSlot();
    };
  }, [releaseLockedSlot]);

  const goToStep = useCallback((step: BookingState["step"]) => {
    setState((prev) => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDateTimeNext = useCallback(
    (date: string, slot: Slot) => {
      lockedSlotRef.current = slot;
      setState((prev) => ({
        ...prev,
        selectedDate: date,
        selectedSlot: slot,
        userInfo: { ...prev.userInfo, meetingFormat: slot.meetingType ?? "" },
      }));
      goToStep(2);
    },
    [goToStep]
  );

  const handleUserInfoChange = useCallback((info: BookingUserInfo) => {
    setState((prev) => ({ ...prev, userInfo: info }));
  }, []);

  const handleConfirm = useCallback(() => {
    lockedSlotRef.current = null;
    goToStep(4);
  }, [goToStep]);

  return (
    <div className="mx-auto px-5 sm:px-8 py-10" style={{ maxWidth: "720px" }}>
      <StepIndicator current={state.step} />

      {state.step === 1 && (
        <Step1DateTime
          counselorId={counselorId}
          selectedDate={state.selectedDate}
          selectedSlot={state.selectedSlot}
          onNext={handleDateTimeNext}
        />
      )}
      {state.step === 2 && (
        <Step3Form
          userInfo={state.userInfo}
          onChange={handleUserInfoChange}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
        />
      )}
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
      {state.step === 4 && state.selectedSlot && (
        <CompletionScreen
          counselorId={counselorId}
          counselorName={counselorName}
          agencyName={agencyName}
          slot={state.selectedSlot}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   予約完了画面（Step 4）
──────────────────────────────────────────────────────────── */
function formatDateJa(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}

function CompletionScreen({
  counselorId,
  counselorName,
  agencyName,
  slot,
}: {
  counselorId: string;
  counselorName: string;
  agencyName: string;
  slot: Slot;
}) {
  return (
    <div className="text-center py-12">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        style={{ margin: "0 auto 28px", display: "block" }}
      >
        <circle
          cx="36"
          cy="36"
          r="34"
          stroke="#C8A97A"
          strokeWidth="1.5"
          fill="rgba(200,169,122,.06)"
        />
        <path
          d="M22 36l10 10 18-20"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h2
        className="text-[28px] mb-3 tracking-[0.06em]"
        style={{ fontFamily: "var(--font-mincho)", color: "var(--black)" }}
      >
        予約が完了しました
      </h2>
      <p className="text-sm leading-loose mb-9" style={{ color: "var(--mid)" }}>
        確認メールをお送りしました。
        <br />
        ゆっくり準備して、当日いらしてください。
      </p>

      <div
        className="rounded-2xl text-left mb-7"
        style={{ background: "var(--pale)", border: "1px solid var(--light)", padding: "24px 28px" }}
      >
        {[
          { key: "カウンセラー", val: `${counselorName}（${agencyName}）` },
          { key: "日時", val: `${formatDateJa(slot.date)} ${slot.startTime}〜` },
          { key: "費用", val: "無料", green: true },
        ].map(({ key, val, green }, i, arr) => (
          <div
            key={key}
            className="flex justify-between py-2.5"
            style={{
              borderBottom: i < arr.length - 1 ? "1px solid var(--light)" : "none",
            }}
          >
            <span className="text-xs" style={{ color: "var(--mid)" }}>{key}</span>
            <span
              className="text-[13px]"
              style={{ color: green ? "var(--green)" : "var(--ink)" }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* ボタン */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <Link
          href={`/counselors/${counselorId}`}
          className="flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:-translate-y-0.5"
          style={{ padding: "14px 32px", background: "white", color: "var(--ink)", border: "1px solid var(--light)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", letterSpacing: ".16em", textTransform: "uppercase", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ink)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--light)"; }}
        >
          カウンセラーページに戻る
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent"
          style={{ padding: "14px 32px", background: "var(--black)", color: "white", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", letterSpacing: ".16em", textTransform: "uppercase", textDecoration: "none" }}
        >
          トップに戻る
        </Link>
      </div>

      <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", marginTop: "32px", lineHeight: 2 }}>
        面談後、口コミを書いていただけると次の方の参考になります。
      </p>
    </div>
  );
}
