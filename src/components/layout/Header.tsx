"use client";

import Link from "next/link";
import { useState } from "react";
import SearchModal from "@/components/search/SearchModal";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
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

        {/* Search icon button */}
        <button
          onClick={() => setModalOpen(true)}
          aria-label="さがす"
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
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--mid)")}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="9.5" cy="9.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14.5 14.5L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <SearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
