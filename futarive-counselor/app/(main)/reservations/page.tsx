'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** 予約一覧は「予約」ページ（/inbox）の「すべての予約」タブに統合済み。互換のためリダイレクト。 */
export default function ReservationsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/inbox')
  }, [router])
  return (
    <div style={{ padding: 32, color: 'var(--text-mid)', fontSize: 14 }}>
      予約ページへ移動しています…
    </div>
  )
}
