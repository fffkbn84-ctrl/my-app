"use client";

import Link from "next/link";

// 検索モーダルは未実装機能（美容店フィルタ・予約タイミング等）を含むため、現在は非表示。
// 将来 SearchModal を再公開する際は @/components/search/SearchModal を import し、
// 検索アイコンと <SearchModal /> を復活させる。

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 56,
        background: "rgba(254,252,250,.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mincho)",
            fontWeight: 500,
            fontSize: 20,
            color: "var(--ink)",
            letterSpacing: ".06em",
            lineHeight: 1,
          }}
        >
          Kinda
        </span>
        <span
          style={{
            fontFamily: "var(--font-mincho)",
            fontWeight: 400,
            fontSize: 12,
            color: "var(--mid)",
            letterSpacing: ".08em",
            whiteSpace: "nowrap",
          }}
        >
          ふたりへ
        </span>
      </Link>

      {/* Right side: Hamburger only（検索アイコンは未実装機能のため非表示） */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Hamburger menu */}
        <button
          aria-label="メニューを開く"
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--mid)",
            borderRadius: "50%",
            transition: "color .2s",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--mid)")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
