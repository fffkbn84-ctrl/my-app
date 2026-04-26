"use client";

import { useEffect, useState } from "react";

/**
 * 全ページ共通のフローティング「ページトップへ戻る」ボタン。
 *
 * - 画面右下に固定（モバイルのボトムナビ + CTA とも干渉しない位置）
 * - 200px 以上スクロールしたら表示、それ未満は非表示
 * - タップで smooth scroll でトップへ
 * - root layout から呼ばれるので、追加の page-level 実装は不要
 */
export default function FloatingScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="ページトップへ戻る"
      style={{
        position: "fixed",
        right: 16,
        bottom: "calc(60px + 12px + env(safe-area-inset-bottom))",
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(255,255,255,.94)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(0,0,0,.08)",
        boxShadow: "0 4px 14px rgba(184,128,110,.18), 0 1px 4px rgba(0,0,0,.08)",
        color: "var(--ink)",
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 95,
        cursor: "pointer",
        transition: "transform .15s ease, opacity .2s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 4v10M4 9l5-5 5 5" />
      </svg>
    </button>
  );
}
