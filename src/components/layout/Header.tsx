import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-light">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex flex-col items-start leading-none">
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "22px",
              color: "var(--black)",
              letterSpacing: "-.01em",
              lineHeight: 1,
            }}
          >
            Kinda
          </span>
          <span
            style={{
              fontFamily: "var(--font-mincho)",
              fontWeight: 400,
              fontSize: "9px",
              color: "var(--muted)",
              letterSpacing: ".08em",
              marginTop: "3px",
            }}
          >
            — 今、関係を築いているふたりへ。
          </span>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/counselors"
            className="text-sm text-mid hover:text-ink transition-colors duration-200 tracking-wide"
          >
            カウンセラーを探す
          </Link>
          <Link
            href="/shops"
            className="text-sm text-mid hover:text-ink transition-colors duration-200 tracking-wide"
          >
            お店を探す
          </Link>
          <Link
            href="/columns"
            className="text-sm text-mid hover:text-ink transition-colors duration-200 tracking-wide"
          >
            コラム
          </Link>
          <Link
            href="/episodes"
            className="text-sm text-mid hover:text-ink transition-colors duration-200 tracking-wide"
          >
            成婚エピソード
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/counselors"
            className="hidden md:inline-flex items-center px-5 py-2 text-sm bg-accent text-white rounded-full hover:opacity-90 transition-opacity duration-200 tracking-wide"
          >
            無料で相談する
          </Link>
          {/* モバイルメニューボタン */}
          <button
            className="md:hidden p-2 text-ink"
            aria-label="メニューを開く"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
