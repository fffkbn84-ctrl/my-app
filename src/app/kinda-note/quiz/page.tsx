"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Route = "pre" | "waiting" | "active" | null;

const OPTIONS = [
  {
    id: "pre" as Route,
    label: "まだ相談所に入っていない",
    sub: "入会前でも使えます",
  },
  {
    id: "waiting" as Route,
    label: "入会したけど、まだお見合いが始まっていない",
    sub: "活動準備中の方へ",
  },
  {
    id: "active" as Route,
    label: "活動中（お見合いや交際をしている）",
    sub: "今の気持ちを整理しよう",
  },
];

export default function KindaNoteQuizPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Route>(null);
  const [nextPressed, setNextPressed] = useState(false);
  const [backPressed, setBackPressed] = useState(false);

  const canProceed = selected !== null;

  function handleNext() {
    if (!canProceed) return;
    // TODO: 次のステップへ（各ルートの質問画面）
    router.push(`/kinda-note/result?route=${selected}`);
  }

  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>

      {/* ミニヘッダー */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(245, 238, 230, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #EAE0D8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 56,
          padding: "0 16px",
        }}
      >
        <button
          onClick={() => router.push("/kinda-note")}
          aria-label="戻る"
          onMouseDown={() => setBackPressed(true)}
          onMouseUp={() => setBackPressed(false)}
          onMouseLeave={() => setBackPressed(false)}
          onTouchStart={() => setBackPressed(true)}
          onTouchEnd={() => setBackPressed(false)}
          style={{
            position: "absolute",
            left: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            transform: backPressed ? "translateY(1px)" : "translateY(0)",
            transition: "transform 0.08s",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 4L6 10L12 16"
              stroke="#3A2E26"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 18,
            fontWeight: 500,
            color: "#3A2E26",
            letterSpacing: "0.04em",
          }}
        >
          Kinda note
        </span>
      </div>

      {/* コンテンツ */}
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "32px 24px 80px",
        }}
      >

        {/* 質問ラベル */}
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#B0A090",
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Q0
        </span>

        {/* 質問文 */}
        <h1
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 22,
            fontWeight: 500,
            color: "#3A2E26",
            lineHeight: 1.7,
            marginBottom: 28,
            letterSpacing: "0.03em",
          }}
        >
          今のあなたの状態は？
        </h1>

        {/* 選択肢 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(1px)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "translateY(1px)";
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: isSelected ? "#F0D8D0" : "#FDFAF7",
                  border: `1.5px solid ${isSelected ? "#D4A090" : "#EAE0D8"}`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition:
                    "background 0.15s, border-color 0.15s, transform 0.08s",
                }}
              >
                {/* ラジオボタン風アイコン */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? "#D4A090" : "#D8D0C8"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.15s",
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "#D4A090",
                      }}
                    />
                  )}
                </div>

                {/* テキスト */}
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: isSelected ? "#B8806E" : "#3A2E26",
                      lineHeight: 1.5,
                      marginBottom: 2,
                      transition: "color 0.15s",
                    }}
                  >
                    {opt.label}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: isSelected ? "#C89880" : "#B0A090",
                      transition: "color 0.15s",
                    }}
                  >
                    {opt.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ナビゲーションボタン */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* もどる */}
          <button
            onClick={() => router.push("/kinda-note")}
            onMouseDown={() => setBackPressed(true)}
            onMouseUp={() => setBackPressed(false)}
            onMouseLeave={() => setBackPressed(false)}
            onTouchStart={() => setBackPressed(true)}
            onTouchEnd={() => setBackPressed(false)}
            style={{
              flex: 1,
              background: "transparent",
              border: "1.5px solid #EAE0D8",
              borderRadius: 999,
              padding: "16px",
              fontSize: 14,
              color: "#7A6A5A",
              cursor: "pointer",
              transform: backPressed ? "translateY(2px)" : "translateY(0)",
              transition: "transform 0.08s",
            }}
          >
            もどる
          </button>

          {/* つぎへ */}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            onMouseDown={() => canProceed && setNextPressed(true)}
            onMouseUp={() => setNextPressed(false)}
            onMouseLeave={() => setNextPressed(false)}
            onTouchStart={() => canProceed && setNextPressed(true)}
            onTouchEnd={() => setNextPressed(false)}
            style={{
              flex: 2,
              background: canProceed ? "#D4A090" : "#EAE0D8",
              border: "none",
              borderRadius: 999,
              padding: "16px",
              fontSize: 14,
              fontWeight: 500,
              color: canProceed ? "white" : "#B0A090",
              cursor: canProceed ? "pointer" : "not-allowed",
              boxShadow:
                canProceed && !nextPressed
                  ? "0 4px 0 #B8806E"
                  : "none",
              transform:
                nextPressed && canProceed ? "translateY(2px)" : "translateY(0)",
              transition: "transform 0.08s, box-shadow 0.08s",
            }}
          >
            つぎへ
          </button>
        </div>

      </div>
    </div>
  );
}
