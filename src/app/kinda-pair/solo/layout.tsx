import type { Metadata } from "next";

/**
 * ひとりモードは個人の回答を扱う画面のため noindex。
 * sitemap にも入れない（src/app/sitemap.ts 参照）。
 *
 * 仕様書 §6 に従い、noindex は robots メタと X-Robots-Tag の両方で落とす
 * （ヘッダ側は next.config.ts の headers() で付与）。
 * referrer も no-referrer にしておく（v1.1 でトークン付き URL を扱う際の
 * リファラ漏洩防止を、同じ配下で先に効かせておくため）。
 */
export const metadata: Metadata = {
  title: "まだ話していないことを並べる｜Kinda pair",
  description:
    "話したことと、まだ話していないこと。28の話題を1枚ずつ送って、まだ触れていない話題と聞き方を並べます。",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function KindaPairSoloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
