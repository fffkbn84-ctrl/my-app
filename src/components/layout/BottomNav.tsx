"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserNotifications } from "@/lib/useUserNotifications";

const navItems = [
  {
    label: "ホーム",
    href: "/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 11.5L12 4l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V11.5z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M9 22v-7h6v7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "気持ち",
    href: "/kinda-note",
    icon: (
      // 雲＋太陽（天気 = Kinda note のメタファー）
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* 太陽（右上） */}
        <circle cx="17" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M17 2.5v1.4M17 10.1v1.4M12.4 7h1.4M20.2 7h1.4M13.7 3.7l1 1M19.3 10.3l1 1M13.7 10.3l1-1M19.3 3.7l1-1"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* 雲（左下） */}
        <path
          d="M6.5 19a3.2 3.2 0 010-6.4h.4a4.3 4.3 0 018.4-1A3.4 3.4 0 0114.5 19h-8z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "担当",
    href: "/kinda-talk",
    icon: (
      // 人 + 吹き出し（カウンセラーとの対話）
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M2.5 20c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* 吹き出し（右上） */}
        <path
          d="M14.5 4h6a1 1 0 011 1v3.5a1 1 0 01-1 1h-3l-1.5 1.5V9.5h-1.5a1 1 0 01-1-1V5a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "マイページ",
    href: "/mypage",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { hasUnseen } = useUserNotifications();

  return (
    <nav
      /* display はインライン style に書くと md:hidden より優先されて
         PC でも表示されてしまうため、クラス側（flex / md:hidden）で持つ */
      className="flex md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(250,250,248,.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--pale)",
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "60px",
      }}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              border: "none",
              background: "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transition: "all .2s",
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--muted)",
            }}
          >
            <span style={{ position: "relative", display: "inline-flex" }}>
              {item.icon}
              {item.href === "/mypage" && hasUnseen && (
                <span
                  aria-label="新しいお知らせがあります"
                  style={{
                    position: "absolute",
                    top: -1,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--rose)",
                    border: "1.5px solid var(--white)",
                  }}
                />
              )}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: ".06em",
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
