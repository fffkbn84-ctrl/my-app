'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Reservation } from '@/lib/types'

export default function ReservationsPage() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: counselor } = await supabase
        .from('counselors')
        .select('id')
        .eq('owner_user_id', user.id)
        .maybeSingle()

      if (!counselor) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('counselor_id', (counselor as { id: string }).id)
        .order('start_at', { ascending: false })

      setReservations((data as Reservation[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-mid)' }}>
        <div style={{ width: 18, height: 18, border: '2px solid var(--border-mid)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
        読み込み中...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const upcoming = reservations.filter(r => r.status === 'active')
  const past = reservations.filter(r => r.status !== 'active')

  return (
    <div style={{ padding: '28px 24px', maxWidth: 700, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>RESERVATIONS</div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>予約管理</h1>

      {reservations.length === 0 ? (
        <div className="kc-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>まだ予約はありません</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>予定</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map(r => (
                  <ReservationCard
                    key={r.id}
                    r={r}
                    onClick={() => router.push(`/reservations/${r.id}`)}
                  />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <p className="eyebrow" style={{ marginBottom: 12 }}>過去の予約</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {past.map(r => (
                  <ReservationCard
                    key={r.id}
                    r={r}
                    onClick={() => router.push(`/reservations/${r.id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function ReservationCard({ r, onClick }: { r: Reservation; onClick: () => void }) {
  const isPendingUserRequest = r.reschedule_status === 'requested' && r.reschedule_requested_by === 'user'
  const isPendingCounselorRequest = r.reschedule_status === 'requested' && r.reschedule_requested_by === 'counselor'

  const dateStr = r.start_at
    ? new Date(r.start_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
    : '日時未定'
  const timeStr = r.start_at && r.end_at
    ? `${new Date(r.start_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} – ${new Date(r.end_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
    : ''

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: 'var(--card)',
        border: `1px solid ${isPendingUserRequest ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 14,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'background .15s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-deep)' }}>{r.user_name}</span>
          {isPendingUserRequest && (
            <span className="kc-badge kc-badge-urgent" style={{ fontSize: 10 }}>日程変更申請あり</span>
          )}
          {isPendingCounselorRequest && (
            <span className="kc-badge kc-badge-booking" style={{ fontSize: 10 }}>了承待ち</span>
          )}
          {r.status === 'canceled' && (
            <span style={{ fontSize: 10, background: 'var(--bg-elev)', color: 'var(--text-mid)', borderRadius: 6, padding: '2px 8px' }}>キャンセル済み</span>
          )}
          {r.status === 'completed' && (
            <span className="kc-badge kc-badge-booking" style={{ fontSize: 10 }}>完了</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>
          {dateStr}{timeStr ? `　${timeStr}` : ''}{r.meeting_type ? `　${r.meeting_type}` : ''}
        </div>
      </div>
      <svg style={{ flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3l4 4-4 4" stroke="var(--text-light)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
