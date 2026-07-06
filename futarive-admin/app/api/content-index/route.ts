// futarive-admin/app/api/content-index/route.ts
//
// ユーザーサイト(kinda.jp)の /api/content-index をサーバー側で仲介するプロキシ。
// admin のページ(クライアントコンポーネント)から直接 kinda.jp を fetch すると
// 別オリジン間のCORSでブロックされるため、admin 自身のサーバー経由にする。
// 共有シークレット(CONTENT_INDEX_KEY)は環境変数のみに置き、ブラウザには渡さない。
//
// 必要な環境変数:
//   - SITE_URL（未設定なら https://kinda.jp）
//   - CONTENT_INDEX_KEY（my-app 側と同じ値）

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://kinda.jp'
  const key = process.env.CONTENT_INDEX_KEY
  if (!key) {
    return NextResponse.json({ error: 'server_not_configured' }, { status: 500 })
  }

  try {
    const res = await fetch(`${siteUrl}/api/content-index`, {
      headers: { 'x-content-index-key': key },
      cache: 'no-store',
    })
    const body = await res.json()
    return NextResponse.json(body, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'upstream_fetch_failed' }, { status: 502 })
  }
}
