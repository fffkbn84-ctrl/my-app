"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { BookingState, BookingUserInfo, Slot } from "@/types/booking";
import type { Counselor } from "@/lib/data";
import Step1DateTime from "./Step1Calendar";
import Step3Form from "./Step3Form";
import Step4Confirm from "./Step4Confirm";

interface Props {
  agencyId: string;
  agencyName: string;
  counselors: Counselor[];
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
  { num: 1, label: "カウンセラーを選ぶ" },
  { num: 2, label: "日時を選ぶ" },
  { num: 3, label: "情報を入力" },
  { num: 4, label: "内容を確認" },
  { num: 5, label: "予約完了" },
];

/* ────────────────────────────────────────────────────────────
   ステップインジケーター（5ステップ）
──────────────────────────────────────────────────────────── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step) => {
        const isDone = step.num < current;
        const isActive = step.num === current;
        return (
          <div key={step.num} className="step-item">
            <div className={`step-dot${isDone ? " done" : isActive ? " active" : ""}`}>
              {step.num}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 1：カウンセラーを選ぶ
──────────────────────────────────────────────────────────── */
function CounselorSelectStep({
  counselors,
  agencyName,
  onNext,
}: {
  counselors: Counselor[];
  agencyName: string;
  onNext: (counselorId: number | string | null) => void;
}) {
  const [selected, setSelected] = useState<number | string | "none" | null>(null);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
      {/* eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: "var(--accent)",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 1,
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
        select counselor
      </div>

      {/* 見出し */}
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 4vw, 48px)",
          lineHeight: 1.15,
          letterSpacing: "-.02em",
          color: "var(--black)",
          marginBottom: 8,
        }}
      >
        カウンセラーを選ぶ
      </h2>
      <p style={{ fontSize: 13, color: "var(--mid)", marginBottom: 28 }}>
        指名なしでも予約できます
      </p>

      {/* 指名なしボタン */}
      <button
        type="button"
        onClick={() => setSelected(selected === "none" ? null : "none")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: selected === "none" ? "1.5px solid var(--black)" : "1px solid var(--light)",
          borderRadius: 50,
          fontSize: 12,
          padding: "10px 24px",
          marginBottom: 20,
          background: selected === "none" ? "var(--black)" : "var(--white)",
          color: selected === "none" ? "var(--white)" : "var(--mid)",
          cursor: "pointer",
          transition: "all .2s",
          fontFamily: "var(--font-sans)",
          letterSpacing: ".04em",
        }}
      >
        {selected === "none" && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="#C8A97A" />
            <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        指名なしで予約する
      </button>

      {/* カウンセラーカード一覧 */}
      <div style={{ marginBottom: 32 }}>
        {counselors.map((c) => {
          const isSelected = selected === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelected(isSelected ? null : c.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "20px 24px",
                border: isSelected ? "1.5px solid var(--accent)" : "1.5px solid var(--light)",
                borderRadius: 14,
                background: isSelected ? "rgba(200,169,122,.06)" : "var(--white)",
                cursor: "pointer",
                transition: "all .25s",
                marginBottom: 12,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(200,169,122,.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--light)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--white)";
                }
              }}
            >
              {/* アバター */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: c.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="5" fill={c.svgColor} opacity=".6" />
                  <path
                    d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9"
                    stroke={c.svgColor}
                    strokeWidth="1.2"
                    fill="none"
                    opacity=".4"
                  />
                </svg>
              </div>

              {/* テキスト情報 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "var(--black)",
                    fontFamily: "var(--font-mincho)",
                    marginBottom: 2,
                  }}
                >
                  {c.name}
                </p>
                <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 5 }}>
                  {c.role}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 9,
                      background: "rgba(200,169,122,.1)",
                      color: "var(--accent)",
                      padding: "2px 9px",
                      borderRadius: 20,
                      letterSpacing: ".04em",
                    }}
                  >
                    経験 {c.experience}年
                  </span>
                  {c.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10,
                        border: "1px solid var(--light)",
                        borderRadius: 20,
                        padding: "2px 9px",
                        color: "var(--mid)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 評価（右寄せ） */}
              <div style={{ textAlign: "right", flexShrink: 0, marginRight: isSelected ? 12 : 0 }}>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--accent)",
                    letterSpacing: ".5px",
                    marginBottom: 2,
                  }}
                >
                  {"★".repeat(Math.round(c.rating))}
                </p>
                <p style={{ fontSize: 10, color: "var(--muted)" }}>{c.reviewCount}件</p>
              </div>

              {/* 選択チェック */}
              {isSelected && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="9" fill="#C8A97A" />
                  <path
                    d="M6 10l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* 次へボタン */}
      <div className="step-nav" style={{ justifyContent: "flex-end" }}>
        <button
          type="button"
          disabled={selected === null}
          onClick={() => onNext(selected === "none" ? null : (selected as number | string))}
          className="bk-btn bk-btn-accent bk-btn-lg"
          style={{ borderRadius: 50, opacity: selected === null ? 0.4 : 1 }}
        >
          次へ：日時を選ぶ
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 2 上部：選択済みカウンセラーバナー
──────────────────────────────────────────────────────────── */
function SelectedCounselorBanner({
  counselor,
  agencyName,
  onChangeCounselor,
}: {
  counselor: Counselor | null;
  agencyName: string;
  onChangeCounselor: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        background: "var(--pale)",
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      {/* アバター */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: counselor ? counselor.gradient : "var(--light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="9"
            r="5"
            fill={counselor ? counselor.svgColor : "var(--muted)"}
            opacity=".6"
          />
          <path
            d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9"
            stroke={counselor ? counselor.svgColor : "var(--muted)"}
            strokeWidth="1.2"
            fill="none"
            opacity=".4"
          />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: "var(--black)" }}>
          {counselor ? counselor.name : "指名なし"}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
          {agencyName}
        </div>
      </div>

      <button
        type="button"
        onClick={onChangeCounselor}
        style={{
          marginLeft: "auto",
          fontSize: 11,
          color: "var(--accent)",
          background: "none",
          border: "none",
          cursor: "pointer",
          letterSpacing: ".04em",
          flexShrink: 0,
        }}
      >
        変更する
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   予約完了画面（Step 5）
──────────────────────────────────────────────────────────── */
function formatDateJa(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}）`;
}

function AgencyCompletionScreen({
  counselorName,
  agencyName,
  agencyId,
  counselorId,
  slot,
}: {
  counselorName: string;
  agencyName: string;
  agencyId: string;
  counselorId: number | string | null;
  slot: Slot;
}) {
  return (
    <div className="bk-done-wrap">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        style={{ margin: "0 auto 28px", display: "block" }}
      >
        <circle cx="36" cy="36" r="34" stroke="#C8A97A" strokeWidth="1.5" fill="rgba(200,169,122,.06)" />
        <path
          d="M22 36l10 10 18-20"
          stroke="#C8A97A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h2 className="bk-done-title">予約が完了しました</h2>
      <p className="bk-done-sub">
        確認メールをお送りしました。
        <br />
        ゆっくり準備して、当日いらしてください。
      </p>

      <div className="bk-done-info">
        {[
          { key: "担当カウンセラー", val: counselorName },
          { key: "日時", val: `${formatDateJa(slot.date)} ${slot.startTime}〜` },
          { key: "費用", val: "無料", green: true },
        ].map(({ key, val, green }) => (
          <div key={key} className="bk-done-row">
            <span className="bk-done-key">{key}</span>
            <span
              className="bk-done-val"
              style={green ? { color: "var(--green)" } : undefined}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        {counselorId ? (
          <Link href={`/counselors/${counselorId}`} className="bk-btn bk-btn-secondary">
            カウンセラーページに戻る
          </Link>
        ) : (
          <Link href={`/agencies/${agencyId}`} className="bk-btn bk-btn-secondary">
            相談所ページに戻る
          </Link>
        )}
        <Link href="/" className="bk-btn bk-btn-primary">
          トップに戻る
        </Link>
      </div>

      <p
        style={{
          fontSize: 12,
          color: "var(--muted)",
          textAlign: "center",
          marginTop: 32,
          lineHeight: 2,
        }}
      >
        面談後、口コミを書いていただけると次の方の参考になります。
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   AgencyBookingFlow（メイン）
──────────────────────────────────────────────────────────── */
interface AgencyState {
  step: 1 | 2 | 3 | 4 | 5;
  selectedCounselorId: number | string | null;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  userInfo: BookingUserInfo;
}

export default function AgencyBookingFlow({ agencyId, agencyName, counselors }: Props) {
  const [state, setState] = useState<AgencyState>({
    step: 1,
    selectedCounselorId: undefined as unknown as null,
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

  const goToStep = useCallback((step: AgencyState["step"]) => {
    setState((prev) => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCounselorSelect = useCallback(
    (counselorId: number | string | null) => {
      setState((prev) => ({ ...prev, selectedCounselorId: counselorId }));
      goToStep(2);
    },
    [goToStep]
  );

  const handleDateTimeNext = useCallback(
    (date: string, slot: Slot) => {
      lockedSlotRef.current = slot;
      setState((prev) => ({
        ...prev,
        selectedDate: date,
        selectedSlot: slot,
        userInfo: { ...prev.userInfo, meetingFormat: slot.meetingType ?? "" },
      }));
      goToStep(3);
    },
    [goToStep]
  );

  const handleUserInfoChange = useCallback((info: BookingUserInfo) => {
    setState((prev) => ({ ...prev, userInfo: info }));
  }, []);

  const handleConfirm = useCallback(() => {
    lockedSlotRef.current = null;
    goToStep(5);
  }, [goToStep]);

  const selectedCounselor =
    state.selectedCounselorId != null
      ? (counselors.find((c) => String(c.id) === String(state.selectedCounselorId)) ?? null)
      : null;

  const counselorDisplayName = selectedCounselor ? selectedCounselor.name : "指名なし";
  const counselorCounselorId = selectedCounselor ? String(selectedCounselor.id) : "0";

  return (
    <div className="booking-wrap pb-16">
      <StepIndicator current={state.step} />

      {/* Step 1: カウンセラーを選ぶ */}
      {state.step === 1 && (
        <CounselorSelectStep
          counselors={counselors}
          agencyName={agencyName}
          onNext={handleCounselorSelect}
        />
      )}

      {/* Step 2: 日時を選ぶ */}
      {state.step === 2 && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <SelectedCounselorBanner
            counselor={selectedCounselor}
            agencyName={agencyName}
            onChangeCounselor={() => goToStep(1)}
          />
          <Step1DateTime
            counselorId={counselorCounselorId}
            selectedDate={state.selectedDate}
            selectedSlot={state.selectedSlot}
            onNext={handleDateTimeNext}
          />
        </div>
      )}

      {/* Step 3: 情報を入力 */}
      {state.step === 3 && (
        <Step3Form
          userInfo={state.userInfo}
          onChange={handleUserInfoChange}
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
        />
      )}

      {/* Step 4: 内容を確認 */}
      {state.step === 4 && state.selectedSlot && (
        <Step4Confirm
          counselorName={counselorDisplayName}
          agencyName={agencyName}
          slot={state.selectedSlot}
          userInfo={state.userInfo}
          showCounselorRow
          onConfirm={handleConfirm}
          onBack={() => goToStep(3)}
        />
      )}

      {/* Step 5: 予約完了 */}
      {state.step === 5 && state.selectedSlot && (
        <AgencyCompletionScreen
          counselorName={counselorDisplayName}
          agencyName={agencyName}
          agencyId={agencyId}
          counselorId={state.selectedCounselorId}
          slot={state.selectedSlot}
        />
      )}
    </div>
  );
}
