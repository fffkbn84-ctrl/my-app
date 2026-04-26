import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import FloatingScrollToTop from "@/components/ui/FloatingScrollToTop";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Kinda — 今、関係を築いているふたりへ",
  description:
    "Kindaは、担当者を自分の目で選んで予約できる婚活サービスです。面談した人だけが書けるリアルな口コミで、あなたにぴったりのカウンセラーを見つけて。",
  keywords: ["結婚相談所", "カウンセラー", "口コミ", "婚活", "予約", "Kinda"],
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
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@200;300;400&family=Noto+Sans+JP:wght@200;300;400;500&family=Shippori+Mincho:wght@400;500&display=swap"
          rel="stylesheet"
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
      </body>
    </html>
  );
}
