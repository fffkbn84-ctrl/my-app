"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { QUESTIONS, DIAGNOSIS_TYPES, DiagnosisTypeId, calculateResult } from "@/lib/diagnosis";

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
        router.push(`/diagnosis/result?type=${resultType}`);
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
      <main
        style={{
          minHeight: "100vh",
          background: "var(--white)",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>

          {/* ページヘッダー */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--accent)",
                fontFamily: "DM Serif Display, serif",
                marginBottom: 12,
              }}
            >
              COUNSELOR MATCHING
            </div>
            <h1
              style={{
                fontFamily: "Shippori Mincho, serif",
                fontSize: "clamp(20px, 4vw, 28px)",
                fontWeight: 400,
                color: "var(--black)",
                letterSpacing: "0.05em",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              あなたに合う、カウンセラータイプ診断
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>
              8つの質問に答えるだけ。1〜3分で診断できます。
            </p>
          </div>

          {/* プログレスバー */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  fontFamily: "DM Sans, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Q{currentQ + 1} / {QUESTIONS.length}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                background: "var(--pale)",
                borderRadius: 4,
                height: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "var(--accent)",
                  borderRadius: 4,
                  height: "100%",
                  width: `${progress}%`,
                  transition: "width 0.4s cubic-bezier(.16,1,.3,1)",
                }}
              />
            </div>
          </div>

          {/* 質問カード */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "36px 32px",
              marginBottom: 24,
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            <p
              style={{
                fontFamily: "Shippori Mincho, serif",
                fontSize: "clamp(18px, 3vw, 22px)",
                lineHeight: 1.7,
                color: "var(--black)",
                marginBottom: 28,
                letterSpacing: "0.03em",
              }}
            >
              {question.text}
            </p>

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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "16px 20px",
                      border: isSelected
                        ? `1.5px solid ${typeColor}`
                        : "1.5px solid var(--light)",
                      borderRadius: 12,
                      background: isSelected
                        ? `${typeColor}14` // 8% opacity
                        : "white",
                      fontFamily: "Noto Sans JP, sans-serif",
                      fontSize: 14,
                      fontWeight: 300,
                      color: "var(--ink)",
                      textAlign: "left",
                      cursor: "pointer",
                      marginBottom: 10,
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = typeColor;
                        (e.currentTarget as HTMLButtonElement).style.background = `${typeColor}0D`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--light)";
                        (e.currentTarget as HTMLButtonElement).style.background = "white";
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        style={{ flexShrink: 0, marginLeft: 12 }}
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
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                fontSize: 12,
                color: "var(--muted)",
                cursor: "pointer",
                padding: "4px 0",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="var(--muted)"
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
