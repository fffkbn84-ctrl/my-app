'use client'

import { useParams, useRouter } from 'next/navigation'
import ReservationDetailBody from '@/components/reservations/ReservationDetailBody'

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  return (
    <div style={{ padding: '28px 24px', maxWidth: 600, paddingBottom: 80 }}>
      <button
        onClick={() => router.push('/reservations')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)', fontSize: 13, marginBottom: 20, padding: 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        予約一覧に戻る
      </button>

      <div className="eyebrow" style={{ marginBottom: 8 }}>RESERVATION DETAIL</div>
      <h1 className="page-title" style={{ marginBottom: 20 }}>予約の詳細</h1>

      <ReservationDetailBody reservationId={id} />
    </div>
  )
}
