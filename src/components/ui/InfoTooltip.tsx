"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  /** ⓘ ボタンに付けるアクセシブルラベル（例：「キャンセル規定の詳細を見る」） */
  ariaLabel: string;
  /** ポップオーバーに表示するコンテンツ */
  children: React.ReactNode;
  /** ⓘ アイコンの色味（既存テキスト色に合わせる時は inherit） */
  variant?: "inherit" | "muted" | "accent";
  /**
   * 旧 API（互換のため受け取るが、現在は viewport 内に自動 clamp するので無視される）。
   * 新規コードでは指定不要。
   */
  align?: "right-anchor" | "left-anchor";
}

interface PopoverPos {
  left: number;
  top: number;
  width: number;
  /** 下に余地がない時は ⓘ の上に表示する */
  flipUp: boolean;
}

const POPOVER_MAX_WIDTH = 300;
const VIEWPORT_PADDING = 16;
const POPOVER_GAP = 6;
const ESTIMATED_HEIGHT = 220;

/**
 * 文字の隣に置く ⓘ ボタン。タップで小さなポップオーバーを開き、
 * 各店舗固有のキャンセル規定や料金の注意書きなどを表示する。
 *
 * a11y: aria-haspopup + aria-expanded、Esc / 外タップで閉じる。
 * モバイルでも viewport 内に必ず収まるよう、開く瞬間に位置を計算して fixed 配置する。
 */
export default function InfoTooltip({
  ariaLabel,
  children,
  variant = "muted",
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopoverPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const computePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const popoverWidth = Math.min(POPOVER_MAX_WIDTH, vw - VIEWPORT_PADDING * 2);

    // 横：ⓘ ボタンの中央に popover の中央を合わせ、viewport 端から 16px 以内に入らないよう clamp
    const buttonCenterX = rect.left + rect.width / 2;
    let left = buttonCenterX - popoverWidth / 2;
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, vw - popoverWidth - VIEWPORT_PADDING),
    );

    // 縦：下に余地があれば下、なければ上に flip
    const spaceBelow = vh - rect.bottom;
    const flipUp = spaceBelow < ESTIMATED_HEIGHT;
    const top = flipUp ? rect.top - POPOVER_GAP : rect.bottom + POPOVER_GAP;

    setPos({ left, top, width: popoverWidth, flipUp });
  }, []);

  // 開いた瞬間に位置を計算（mounted 後）
  useEffect(() => {
    if (!open) return;
    computePosition();
  }, [open, computePosition]);

  // 外タップ・Esc・スクロール・リサイズで閉じる
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        buttonRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    const onResize = () => setOpen(false);

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const iconColor =
    variant === "accent"
      ? "var(--accent, #C8A97A)"
      : variant === "inherit"
        ? "currentColor"
        : "var(--muted, #A0A0A0)";

  return (
    <>
      <button
        ref={buttonRef}
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
          marginLeft: 4,
          marginRight: 2,
          border: "none",
          background: "transparent",
          color: iconColor,
          cursor: "pointer",
          borderRadius: "50%",
          lineHeight: 1,
          verticalAlign: "middle",
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

      {mounted && open && pos &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={ariaLabel}
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.top,
              ...(pos.flipUp ? { transform: "translateY(-100%)" } : {}),
              width: pos.width,
              background: "var(--white, #FAFAF8)",
              border: "1px solid var(--border, #E5DACB)",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow:
                "0 8px 24px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.5)",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 12,
              lineHeight: 1.85,
              color: "var(--ink, #2A2A2A)",
              fontWeight: 300,
              zIndex: 200,
              textAlign: "left",
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
