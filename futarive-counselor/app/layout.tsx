import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kinda カウンセラー管理',
  description: 'ふたりへ カウンセラー・相談所オーナー向け管理画面',
}

// SSR時にも data-theme を即座に当てて、ライト/ダーク切り替えのフラッシュを防ぐ
const themeBootstrap = `(function(){try{var t=localStorage.getItem('kc-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,400&family=Noto+Sans+JP:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <div className="kc-shell">{children}</div>
      </body>
    </html>
  )
}
