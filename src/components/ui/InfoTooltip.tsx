"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** ⓘ ボタンに付けるアクセシブルラベル（例：「キャンセル規定の詳細を見る」） */
  ariaLabel: string;
  /** ポップオーバーに表示するコンテンツ */
  children: React.ReactNode;
  /** ⓘ アイコンの色味（既存テキスト色に合わせる時は inherit） */
  variant?: "inherit" | "muted" | "accent";
  /**
   * ポップオーバーの展開方向。
   * "right-anchor"（既定）: ⓘ の右端を基点に左方向へ展開（行末用）。
   * "left-anchor": ⓘ の左端を基点に右方向へ展開（行頭用）。
   */
  align?: "right-anchor" | "left-anchor";
}

/**
 * 文字の隣に置く ⓘ ボタン。タップで小さなポップオーバーを開き、
 * 各店舗固有のキャンセル規定や料金の注意書きなどを表示する。
 *
 * a11y: aria-haspopup + aria-expanded、Esc / 外タップで閉じる。
 * モバイル優先（タップで開閉）。
 */
export default function InfoTooltip({
  ariaLabel,
  children,
  variant = "muted",
  align = "right-anchor",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const iconColor =
    variant === "accent"
      ? "var(--accent, #C8A97A)"
      : variant === "inherit"
        ? "currentColor"
        : "var(--muted, #A0A0A0)";

  return (
    <span
      ref={wrapRef}
      style={{
        position: "relative",
        display: "inline-flex",
        verticalAlign: "middle",
        marginLeft: 4,
        marginRight: 2,
      }}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((v) => !v);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          minWidth: 22,
          padding: 0,
          border: "none",
          background: "transparent",
          color: iconColor,
          cursor: "pointer",
          borderRadius: "50%",
          lineHeight: 1,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="6" />
          <line x1="7" y1="6" x2="7" y2="10" strokeLinecap="round" />
          <circle cx="7" cy="3.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            ...(align === "left-anchor"
              ? { left: 0, right: "auto" }
              : { right: 0, left: "auto" }),
            width: "min(280px, calc(100vw - 32px))",
            background: "var(--white, #FAFAF8)",
            border: "1px solid var(--border, #E5DACB)",
            borderRadius: 12,
            padding: "12px 14px",
            boxShadow:
              "0 8px 24px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.5)",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 12,
            lineHeight: 1.85,
            color: "var(--ink, #2A2A2A)",
            fontWeight: 300,
            zIndex: 50,
            textAlign: "left",
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}
