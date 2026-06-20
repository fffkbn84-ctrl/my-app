import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import FloatingScrollToTop from "@/components/ui/FloatingScrollToTop";
import FloatingBackButton from "@/components/ui/FloatingBackButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kinda.jp"
  ),
  // ファビコン／ホーム画面アイコンは App Router 規約のファイルに一本化：
  // src/app/favicon.ico（/favicon.ico 直リクエスト対応）, src/app/icon.png, src/app/apple-icon.png。
  // 旧 1.1MB の /images/kinda-icon.png 直指定はサイズ過大で一部環境でフォールバックしていたため撤去。
  title: "Kinda（カインダ）ふたりへ｜結婚相談所を、会った人の口コミで選ぶ",
  // 検索スニペット用の説明文は SEO 重視の既存文を維持。
  // シェアカード（og/twitter）の文面はブランドコピーを使う（下記）。
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
    type: "website",
    locale: "ja_JP",
    url: "https://kinda.jp",
    siteName: "Kinda ふたりへ",
    title: "Kinda（カインダ）ふたりへ｜結婚相談所を、会った人の口コミで選ぶ",
    description:
      "結婚相談所を、実際に会った人の口コミで選ぶ。会う前にカウンセラーの様子まで見られるから「人で選べる」。デートの準備や顔合わせまで、成婚だけを目的にせず、そっと隣に。",
    // og:image は WebP 非対応クローラー対策で JPG を使う（metadataBase で絶対URL化）
    images: [
      {
        url: "/images/OGP-hero.jpg",
        width: 1200,
        height: 632,
        alt: "Kinda（カインダ）— 気持ちを、天気の言葉で。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinda（カインダ）ふたりへ｜結婚相談所を、会った人の口コミで選ぶ",
    description:
      "結婚相談所を、実際に会った人の口コミで選ぶ。会う前にカウンセラーの様子まで見られるから「人で選べる」。デートの準備や顔合わせまで、そっと隣に。",
    images: ["/images/OGP-hero.jpg"],
  },
};

/**
 * viewport を明示することで iOS Safari の意図せぬズーム挙動を抑止する。
 * - maximumScale: 1 はアクセシビリティ上の懸念があるため指定しない（ユーザーは
 *   ピンチで自由にズーム可能のまま）
 * - viewportFit: 'cover' で iPhone X 以降のセーフエリアにも対応
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
          <FloatingBackButton />
          <BottomNav />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
