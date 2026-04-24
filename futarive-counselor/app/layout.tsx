import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kinda カウンセラー管理',
  description: 'ふたりへ カウンセラー・相談所オーナー向け管理画面',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
