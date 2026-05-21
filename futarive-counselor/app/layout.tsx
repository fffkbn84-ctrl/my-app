import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kinda カウンセラー管理',
  description: 'ふたりへ カウンセラー・相談所オーナー向け管理画面',
}

// FOUC 防止：React マウント前に localStorage を読んで data-theme を適用
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('kinda-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,400&family=Noto+Sans+JP:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
