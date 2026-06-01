"use client";

/**
 * UndoToast — 操作直後に下部から出る「取り消し」トースト
 * - キャンセル直後に「予約をキャンセルしました ／ 取り消す」を表示する用途
 * - duration 経過で自動的に消える（残り時間をバーで表示）
 * - 取り消すを押すと onAction、それ以外で閉じると onClose
 */
import { useEffect, useRef, useState } from "react";

export default function UndoToast({
  message,
  actionLabel = "取り消す",
  onAction,
  onClose,
  durationMs = 8000,
  busy = false,
}: {
  message: string;
  actionLabel?: string;
  onAction: () => void;
  onClose: () => void;
  durationMs?: number;
  /** onAction 実行中（取り消し処理中）はボタンを無効化 */
  busy?: boolean;
}) {
  const [remaining, setRemaining] = useState(1); // 1 → 0 の割合
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    if (busy) return; // 処理中はカウントダウンを止める
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const ratio = Math.max(0, 1 - elapsed / durationMs);
      setRemaining(ratio);
      if (ratio <= 0) {
        onClose();
      }
    };
    const interval = setInterval(tick, 60);
    return () => clearInterval(interval);
  }, [durationMs, onClose, busy]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "calc(76px + env(safe-area-inset-bottom))",
        zIndex: 1200,
        width: "calc(100% - 32px)",
        maxWidth: 420,
        background: "var(--ink)",
        color: "white",
        borderRadius: 14,
        boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
        overflow: "hidden",
        animation: "undo-toast-in .24s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 16px",
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1.6, flex: 1, minWidth: 0 }}>
          {message}
        </span>
        <button
          type="button"
          onClick={onAction}
          disabled={busy}
          style={{
            flexShrink: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--accent)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,.28)",
            borderRadius: 50,
            padding: "7px 16px",
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.6 : 1,
            fontFamily: "var(--font-mincho)",
          }}
        >
          {busy ? "処理中…" : actionLabel}
        </button>
      </div>
      {/* 残り時間バー */}
      <div style={{ height: 3, background: "rgba(255,255,255,.12)" }}>
        <div
          style={{
            height: "100%",
            width: `${remaining * 100}%`,
            background: "var(--accent)",
            transition: "width .06s linear",
          }}
        />
      </div>
      <style>{`
        @keyframes undo-toast-in {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
