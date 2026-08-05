import type { Metadata } from "next";

/**
 * ひとりモードは個人の回答を扱う画面のため noindex。
 * sitemap にも入れない（src/app/sitemap.ts 参照）。
 */
export const metadata: Metadata = {
  title: "まだ話していないことを並べる｜Kinda pair",
  description:
    "話したことと、まだ話していないこと。28の話題を1枚ずつ送って、まだ触れていない話題と聞き方を並べます。",
  robots: { index: false, follow: false },
};

export default function KindaPairSoloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
