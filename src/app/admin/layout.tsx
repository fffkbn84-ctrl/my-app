"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: "▦" },
  { href: "/admin/reviews", label: "口コミ管理", icon: "★" },
  { href: "/admin/reservations", label: "予約一覧", icon: "◷" },
  { href: "/admin/agencies", label: "相談所管理", icon: "⊞" },
];

function AdminNav() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 min-h-screen border-r border-light flex flex-col"
      style={{ background: "var(--ink)" }}
    >
      {/* ロゴ */}
      <div className="px-6 py-6 border-b border-white/10">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-1"
          style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
        >
          futarini
        </p>
        <p className="text-white text-sm" style={{ fontFamily: "var(--font-mincho)" }}>
          統括管理画面
        </p>
      </div>

      {/* ナビ */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors"
              style={{
                color: isActive ? "var(--accent)" : "var(--muted)",
                background: isActive ? "rgba(200,169,122,0.1)" : "transparent",
              }}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* フッター */}
      <div className="px-6 py-4 border-t border-white/10">
        <Link
          href="/"
          className="text-xs transition-colors hover:text-white"
          style={{ color: "var(--muted)" }}
        >
          ← サイトに戻る
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--pale)" }}>
      <AdminNav />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
