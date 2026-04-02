"use client";
import { useState } from "react";

interface SympathyButtonProps {
  initialCount: number;
}

export default function SympathyButton({ initialCount }: SympathyButtonProps) {
  const [pressed, setPressed] = useState(false);
  const count = pressed ? initialCount + 1 : initialCount;

  return (
    <div style={{ textAlign: "center", margin: "40px 0" }}>
      <button
        onClick={() => !pressed && setPressed(true)}
        disabled={pressed}
        style={{
          border: pressed ? "1.5px solid var(--accent)" : "1.5px solid var(--light)",
          background: pressed ? "var(--adim)" : "white",
          color: pressed ? "var(--accent)" : "var(--ink)",
          borderRadius: 50,
          padding: "14px 32px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          cursor: pressed ? "default" : "pointer",
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          transition: "all .2s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 15C9 15 2.5 10.5 2.5 6C2.5 4 4 2.5 6 2.5C7 2.5 8 3 9 4C10 3 11 2.5 12 2.5C14 2.5 15.5 4 15.5 6C15.5 10.5 9 15 9 15Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill={pressed ? "var(--accent)" : "none"}
          />
        </svg>
        共感した
        <span style={{ color: pressed ? "var(--accent)" : "var(--muted)", fontSize: 13 }}>
          {count}
        </span>
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
        Supabase連携後、マイページに保存されるようになります
      </p>
    </div>
  );
}
