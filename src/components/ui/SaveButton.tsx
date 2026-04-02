"use client";
import { useState } from "react";
import { useSaved } from "@/hooks/useSaved";

interface SaveButtonProps {
  type: "counselor" | "agency";
  id: string | number;
  /** dark: 黒背景ヒーロー用（カウンセラー詳細）、light: 明るい背景用（相談所詳細） */
  variant?: "dark" | "light";
}

export default function SaveButton({ type, id, variant = "dark" }: SaveButtonProps) {
  const { saved, toggle } = useSaved(type, id);
  const [showTooltip, setShowTooltip] = useState(false);

  const label = type === "counselor" ? "カウンセラーを保存" : "相談所を保存";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={toggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="保存（Supabase連携後にマイページに保存されます）"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: saved
            ? "1px solid var(--accent)"
            : variant === "dark"
            ? "1px solid rgba(255,255,255,.2)"
            : "1px solid rgba(0,0,0,.15)",
          background: saved
            ? "var(--adim)"
            : variant === "dark"
            ? "rgba(255,255,255,.08)"
            : "rgba(255,255,255,.5)",
          color: saved ? "var(--accent)" : variant === "dark" ? "white" : "var(--ink)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .2s",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 2h10v13l-5-3-5 3V2z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill={saved ? "var(--accent)" : "none"}
          />
        </svg>
      </button>

      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            background: "var(--black)",
            color: "white",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {saved ? "保存済み" : label}
        </div>
      )}
    </div>
  );
}
