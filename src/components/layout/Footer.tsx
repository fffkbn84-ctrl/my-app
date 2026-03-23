import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* ブランド */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <span
                className="text-2xl tracking-widest text-white"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                ふたりへ
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              今まさに関係を作っている
              <br />
              ふたりのためのサービス。
            </p>
          </div>

          {/* サービス */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-5 text-white/40">
              Service
            </h3>
            <ul className="space-y-3">
              {[
                { label: "カウンセラーを探す", href: "/counselors" },
                { label: "お店を探す", href: "/shops" },
                { label: "口コミを書く", href: "/reviews/new" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* コンテンツ */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-5 text-white/40">
              Contents
            </h3>
            <ul className="space-y-3">
              {[
                { label: "コラム", href: "/columns" },
                { label: "成婚エピソード", href: "/episodes" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 会社情報 */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-5 text-white/40">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: "サービスについて", href: "/about" },
                { label: "ご利用規約", href: "/terms" },
                { label: "プライバシーポリシー", href: "/privacy" },
                { label: "相談所の方へ", href: "/for-agencies" },
                { label: "お問い合わせ", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2024 ふたりへ. All rights reserved.
          </p>
          <p
            className="text-xs tracking-widest text-white/20"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            futarini
          </p>
        </div>
      </div>
    </footer>
  );
}
