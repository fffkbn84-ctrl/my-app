import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ふたりへ — カウンセラーの口コミで選ぶ結婚相談所",
  description:
    "面談した人だけが書けるリアルな口コミで、あなたにぴったりのカウンセラーを見つけて予約できる結婚相談所マッチングサービス。",
  keywords: ["結婚相談所", "カウンセラー", "口コミ", "婚活", "予約"],
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
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
