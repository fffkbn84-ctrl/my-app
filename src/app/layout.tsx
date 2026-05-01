import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import FloatingScrollToTop from "@/components/ui/FloatingScrollToTop";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Kinda ふたりへ｜担当を選んで予約できる結婚相談所サービス",
  description:
    "好きな人を見つけて、一緒に過ごす日々まで。プロのカウンセラーと探す、本音の口コミで選ぶ結婚相談所。婚活カウンセラーの相性診断は60秒・無料・登録不要。お見合いのカフェ、デートの場所、ふたりに必要な美容まで、ふたりに寄り添うすべてが Kinda に。",
  keywords: [
    "結婚相談所",
    "結婚相談所 口コミ",
    "結婚相談所 比較",
    "カウンセラー",
    "婚活",
    "婚活カウンセラー",
    "相性診断",
    "お見合い カフェ",
    "ふたりへ",
    "Kinda",
  ],
  openGraph: {
    title: "Kinda ふたりへ｜担当を選んで予約できる結婚相談所サービス",
    description:
      "好きな人を見つけて、一緒に過ごす日々まで。本音の口コミと相性診断で、ふたりになる手前から寄り添う場所。",
    type: "website",
    locale: "ja_JP",
    siteName: "Kinda ふたりへ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinda ふたりへ｜担当を選んで予約できる結婚相談所サービス",
    description:
      "好きな人を見つけて、一緒に過ごす日々まで。本音の口コミと相性診断、お見合いから美容まで。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* フォント本体は CSS から非同期で読む（display=swap）
            preconnect で接続だけ先に確立しておくことで FCP/LCP を改善 */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@200;300;400&family=Noto+Sans+JP:wght@200;300;400;500&family=Shippori+Mincho:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* ヒーロー用 LCP 画像の preload（Lighthouse の "Largest Contentful Paint image was not preloaded" 対策）*/}
        <link
          rel="preload"
          as="image"
          href="/images/hero-couple-new.webp"
          fetchPriority="high"
          type="image/webp"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {/* 固定縦ライン — 全ページ共通装飾 */}
          <div className="side-line" aria-hidden="true">
            <div className="side-line-grad-top" />
            <span className="side-line-txt">Kinda</span>
            <span className="side-line-sep">·</span>
            <span className="side-line-en">ふたりへ</span>
            <div className="side-line-mid" />
            <span className="side-line-txt">Kinda</span>
            <span className="side-line-sep">·</span>
            <span className="side-line-en">ふたりへ</span>
            <div className="side-line-grad-bot" />
          </div>

          {children}
          <FloatingScrollToTop />
          <BottomNav />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
