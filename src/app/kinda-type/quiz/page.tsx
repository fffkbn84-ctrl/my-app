"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { QUESTIONS, DIAGNOSIS_TYPES, DiagnosisTypeId, calculateResult } from "@/lib/diagnosis";
import { trackEvent } from "@/lib/analytics";

/* タイプ別アクセントカラー */
const TYPE_COLORS: Record<DiagnosisTypeId, string> = {
  A: "#B8912A",
  B: "#8B6240",
  C: "#2D5A3D",
  D: "#3D2D5A",
};

export default function DiagnosisPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0); // 0-indexed
  // answers: questionId -> type letter ("A"/"B"/"C"/"D")
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // answerIndices: questionId -> optionIndex（戻るボタン時のUI復元用）
  const [answerIndices, setAnswerIndices] = useState<Record<number, number>>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  // 開始時に1回だけ kinda_type_quiz_start イベントを送信
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("kinda_type_quiz_start");
  }, []);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  function handleSelect(optionIndex: number) {
    if (animating) return;
    const optionType = question.options[optionIndex].type;
    setSelectedIndex(optionIndex);

    const newAnswers = { ...answers, [question.id]: optionType };
    const newIndices = { ...answerIndices, [question.id]: optionIndex };
    setAnswers(newAnswers);
    setAnswerIndices(newIndices);

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setAnimating(true);
        setTimeout(() => {
          setCurrentQ((q: number) => q + 1);
          // 次の質問の既回答を復元
          const nextQ = QUESTIONS[currentQ + 1];
          setSelectedIndex(newIndices[nextQ.id] ?? null);
          setAnimating(false);
        }, 200);
      } else {
        const resultType = calculateResult(newAnswers);
        trackEvent("kinda_type_quiz_complete", { result_type: resultType });
        router.push(`/kinda-type/result?type=${resultType}`);
      }
    }, 300);
  }

  function handleBack() {
    if (currentQ === 0 || animating) return;
    setAnimating(true);
    setTimeout(() => {
      const prevQ = QUESTIONS[currentQ - 1];
      setCurrentQ((q: number) => q - 1);
      setSelectedIndex(answerIndices[prevQ.id] ?? null);
      setAnimating(false);
    }, 150);
  }

  return (
    <>
      <Header />
      <main className="ktq-main">
        <div className="ktr-subheader-wrap">
          <SectionSubHeader sectionName="Kinda type" sectionRoot="/kinda-type" />
        </div>
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda type", href: "/kinda-type" },
            { label: "質問中" },
          ]}
        />
        <div className="ktq-content">

          {/* ページヘッダー */}
          <div className="ktq-header">
            <div className="ktq-eyebrow">COUNSELOR MATCHING</div>
            <h1 className="ktq-title">あなたに合うカウンセラータイプを見つける</h1>
            <p className="ktq-subtitle">8つの質問に答えるだけ。1〜3分でわかります。</p>
          </div>

          {/* プログレスバー */}
          <div className="ktq-progress-wrap">
            <div className="ktq-progress-meta">
              <span className="ktq-progress-counter">
                Q{currentQ + 1} / {QUESTIONS.length}
              </span>
              <span className="ktq-progress-percent">{Math.round(progress)}%</span>
            </div>
            <div
              className="ktq-progress-bar"
              role="progressbar"
              aria-valuenow={currentQ + 1}
              aria-valuemin={1}
              aria-valuemax={QUESTIONS.length}
              aria-label={`${QUESTIONS.length}問中の${currentQ + 1}問目`}
            >
              <div className="ktq-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* 質問カード */}
          <div className="ktq-card" data-animating={animating}>
            <p className="ktq-question">{question.text}</p>

            <div>
              {question.options.map((option, i) => {
                const isSelected =
                  selectedIndex === i ||
                  (selectedIndex === null && answerIndices[question.id] === i);
                const typeColor = TYPE_COLORS[option.type];
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className="ktq-option"
                    data-selected={isSelected}
                    style={
                      {
                        "--type-color": typeColor,
                        "--type-bg": `${typeColor}14`,
                        "--type-bg-hover": `${typeColor}0D`,
                      } as React.CSSProperties
                    }
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        className="ktq-option-icon"
                        aria-hidden="true"
                      >
                        <circle cx="9" cy="9" r="8" fill={typeColor} />
                        <path
                          d="M5.5 9l3 3 4-5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 戻るボタン */}
          {currentQ > 0 && (
            <button onClick={handleBack} className="ktq-back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              前の質問
            </button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
