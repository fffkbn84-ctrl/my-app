"use client";
import { useState } from "react";

interface SympathyButtonProps {
  initialCount: number;
  /** ボタンに表示するラベル。デフォルト「共感した」 */
  label?: string;
  /** 押す前のサブテキスト。デフォルトは Supabase 連携の案内 */
  hint?: string;
  /** コンパクトサイズ（コラム内のミニ表示用など） */
  size?: "default" | "sm";
}

export default function SympathyButton({
  initialCount,
  label = "共感した",
  hint = "Supabase連携後、マイページに保存されるようになります",
  size = "default",
}: SympathyButtonProps) {
  const [pressed, setPressed] = useState(false);
  // 押すまで件数は見えない仕様。押した瞬間に「あなたを含むN人が共感」を初めて開示する。
  const revealedCount = pressed ? initialCount + 1 : null;

  const isSm = size === "sm";

  return (
    <div style={{ textAlign: "center", margin: isSm ? "20px 0 8px" : "40px 0" }}>
      <button
        onClick={() => !pressed && setPressed(true)}
        disabled={pressed}
        aria-pressed={pressed}
        style={{
          border: pressed ? "1.5px solid var(--accent)" : "1.5px solid var(--light)",
          background: pressed ? "var(--adim)" : "white",
          color: pressed ? "var(--accent)" : "var(--ink)",
          borderRadius: 50,
          padding: isSm ? "10px 22px" : "14px 32px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          cursor: pressed ? "default" : "pointer",
          fontSize: isSm ? 13 : 14,
          fontFamily: "var(--font-sans)",
          transition: "all .2s",
        }}
      >
        <svg width={isSm ? 16 : 18} height={isSm ? 16 : 18} viewBox="0 0 18 18" fill="none">
          <path
            d="M9 15C9 15 2.5 10.5 2.5 6C2.5 4 4 2.5 6 2.5C7 2.5 8 3 9 4C10 3 11 2.5 12 2.5C14 2.5 15.5 4 15.5 6C15.5 10.5 9 15 9 15Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill={pressed ? "var(--accent)" : "none"}
          />
        </svg>
        {pressed ? "共感しました" : label}
        {revealedCount !== null && (
          <span style={{ color: "var(--accent)", fontSize: 13 }}>
            {revealedCount}
          </span>
        )}
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: isSm ? 8 : 12 }}>
        {pressed ? "あなたを含む共感の数が表示されています" : hint}
      </p>
    </div>
  );
}
