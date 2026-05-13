"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SearchModal from "@/components/search/SearchModal";

const MENU_SECTIONS: { label: string; items: { href: string; label: string; sub?: string }[] }[] = [
  {
    label: "自分から動く",
    items: [
      { href: "/kinda-type", label: "Kinda type", sub: "合うカウンセラーを見つける" },
      { href: "/kinda-talk", label: "Kinda talk", sub: "カウンセラーを見る" },
      { href: "/kinda-act", label: "Kinda act", sub: "お見合い・デートの場所" },
      { href: "/kinda-glow", label: "Kinda glow", sub: "自分を整える" },
      { href: "/kinda-note", label: "Kinda note", sub: "気持ちを整理する" },
    ],
  },
  {
    label: "ふたりを知る",
    items: [
      { href: "/kinda-story", label: "Kinda story", sub: "ふたりの物語" },
      { href: "/columns", label: "Kinda voices", sub: "取材・コラム" },
    ],
  },
  {
    label: "アカウント",
    items: [
      { href: "/mypage", label: "マイページ" },
    ],
  },
  {
    label: "サービス",
    items: [
      { href: "/about", label: "このサービスについて" },
      { href: "/contact", label: "お問い合わせ" },
    ],
  },
];

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // 画面遷移したらシートを自動で閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // メニューを開いている間は背面スクロールをロック
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  // Esc キーで閉じる
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

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
          padding: "0 16px 0 0",
        }}
      >
        {/* Logo（透過 PNG） */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
          aria-label="Kinda ふたりへ ホームへ"
        >
          <Image
            src="/images/logoname _kinda_header.PNG"
            alt="Kinda ふたりへ"
            width={400}
            height={56}
            priority
            style={{
              width: "min(60vw, 280px)",
              height: "auto",
              maxHeight: 52,
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Right side: Search + Hamburger */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Search icon */}
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

          {/* Hamburger menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            aria-controls="kinda-menu-sheet"
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

      <SearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ハンバーガーメニュー：オーバーレイ + 右からスライドインするシート */}
      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 100,
            animation: "kindaMenuFadeIn .2s ease",
          }}
        />
      )}
      <aside
        id="kinda-menu-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="メインメニュー"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(86vw, 360px)",
          background: "var(--white)",
          zIndex: 101,
          boxShadow: "-12px 0 30px rgba(0,0,0,.12)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.22,.61,.36,1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* メニュー上端：閉じるボタン + タイトル */}
        <div
          style={{
            height: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: "1px solid var(--pale)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: 16,
              color: "var(--ink)",
              letterSpacing: ".04em",
            }}
          >
            メニュー
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="メニューを閉じる"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--mid)",
              borderRadius: "50%",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* スクロール可能なリンク群 */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 8px 32px",
          }}
        >
          {MENU_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  padding: "10px 16px 6px",
                }}
              >
                {section.label}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href + "/"));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 12,
                          padding: "12px 16px",
                          textDecoration: "none",
                          borderRadius: 12,
                          color: isActive ? "var(--accent)" : "var(--ink)",
                          background: isActive ? "var(--pale)" : "transparent",
                          transition: "background .15s",
                        }}
                      >
                        <span style={{ fontSize: 15, fontFamily: "var(--font-mincho)" }}>
                          {item.label}
                        </span>
                        {item.sub && (
                          <span style={{ fontSize: 11, color: "var(--mid)" }}>
                            {item.sub}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* シート下端：補足 */}
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid var(--pale)",
            padding: "14px 20px 18px",
            fontSize: 11,
            color: "var(--muted)",
            background: "var(--white)",
          }}
        >
          © Kinda ふたりへ
        </div>
      </aside>

      {/* フェードインアニメーション */}
      <style jsx>{`
        @keyframes kindaMenuFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
