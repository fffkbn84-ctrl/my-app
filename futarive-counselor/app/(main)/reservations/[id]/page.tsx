'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Reservation } from '@/lib/types'
import { requestRescheduleAsCounselor, approveRescheduleAsCounselor } from '@/lib/reservations'

interface SlotOption {
  id: string
  start_at: string
  end_at: string
  meeting_type: string | null
}

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [slots, setSlots] = useState<SlotOption[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      setReservation(data as Reservation | null)
      setLoading(false)
    }
    load()
  }, [id])

  const loadSlots = async () => {
    if (!reservation?.counselor_id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('slots')
      .select('id, start_at, end_at, meeting_type')
      .eq('counselor_id', reservation.counselor_id)
      .eq('status', 'open')
      .gte('start_at', new Date().toISOString())
      .order('start_at')
    setSlots((data as SlotOption[]) ?? [])
  }

  const handleOpenReschedule = async () => {
    await loadSlots()
    setSelectedSlot(null)
    setShowRescheduleModal(true)
  }

  const handleRequestReschedule = async () => {
    if (!selectedSlot || !reservation) return
    const slot = slots.find(s => s.id === selectedSlot)
    if (!slot) return
    setSubmitting(true)
    const supabase = createClient()
    const result = await requestRescheduleAsCounselor(supabase, reservation.id, slot.start_at, slot.end_at)
    setSubmitting(false)
    if (result.ok) {
      showToast('日程変更を提案しました。ユーザーの了承をお待ちください。')
      setShowRescheduleModal(false)
      setReservation(prev => prev ? {
        ...prev,
        reschedule_status: 'requested',
        reschedule_requested_by: 'counselor',
        reschedule_proposed_start: slot.start_at,
        reschedule_proposed_end: slot.end_at,
      } : prev)
    } else {
      showToast(result.message)
    }
  }

  const handleApprove = async () => {
    if (!reservation) return
    setSubmitting(true)
    const supabase = createClient()
    const result = await approveRescheduleAsCounselor(supabase, reservation.id)
    setSubmitting(false)
    if (result.ok) {
      showToast('日程変更を了承しました')
      router.push(`/reservations/${result.newReservationId}`)
    } else {
      showToast(result.message)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-mid)' }}>
        <div style={{ width: 18, height: 18, border: '2px solid var(--border-mid)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
        読み込み中...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>予約が見つかりません</p>
      </div>
    )
  }

  const dateStr = reservation.start_at
    ? new Date(reservation.start_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
    : '日時未定'
  const timeStr = reservation.start_at && reservation.end_at
    ? `${new Date(reservation.start_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} – ${new Date(reservation.end_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
    : ''

  const isActive = reservation.status === 'active'
  const isPendingUserRequest = reservation.reschedule_status === 'requested' && reservation.reschedule_requested_by === 'user'
  const isPendingCounselorRequest = reservation.reschedule_status === 'requested' && reservation.reschedule_requested_by === 'counselor'
  const canProposeReschedule = isActive && !reservation.reschedule_status

  const slotsByDate = slots.reduce<Record<string, SlotOption[]>>((acc, slot) => {
    const dateKey = slot.start_at.slice(0, 10)
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(slot)
    return acc
  }, {})

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
      <h1 className="page-title" style={{ marginBottom: 8 }}>{reservation.user_name} さん</h1>
      <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 24 }}>
        予約 #{reservation.id.slice(0, 8)}
      </p>

      {/* ユーザーから日程変更申請バナー */}
      {isPendingUserRequest && (
        <div style={{
          background: '#FFF8F0',
          border: '1px solid var(--accent)',
          borderRadius: 14,
          padding: '16px 18px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.3"/>
              <path d="M7 4v3.5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="7" cy="10" r=".6" fill="var(--accent)"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
              ユーザーから日程変更の申請があります
            </span>
          </div>
          {reservation.reschedule_proposed_start && (
            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-mid)', marginRight: 8 }}>希望日時</span>
              {new Date(reservation.reschedule_proposed_start).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
              {' '}{new Date(reservation.reschedule_proposed_start).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              {reservation.reschedule_proposed_end &&
                ` – ${new Date(reservation.reschedule_proposed_end).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
              }
            </div>
          )}
          {reservation.reschedule_expires_at && (
            <div style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 14 }}>
              了承期限：{new Date(reservation.reschedule_expires_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
            </div>
          )}
          <button
            onClick={handleApprove}
            disabled={submitting}
            className="kc-btn kc-btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {submitting ? '処理中...' : '日程変更を了承する'}
          </button>
        </div>
      )}

      {/* カウンセラーが提案中バナー */}
      {isPendingCounselorRequest && (
        <div style={{
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6" stroke="var(--text-mid)" strokeWidth="1.3"/>
            <path d="M7 4v3l2 2" stroke="var(--text-mid)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>
              日程変更をユーザーに提案中
            </p>
            {reservation.reschedule_proposed_start && (
              <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>
                提案日時：{new Date(reservation.reschedule_proposed_start).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                {' '}{new Date(reservation.reschedule_proposed_start).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                {reservation.reschedule_expires_at &&
                  `（了承期限：${new Date(reservation.reschedule_expires_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}）`
                }
              </p>
            )}
          </div>
        </div>
      )}

      {/* 面談情報 */}
      <div className="kc-card" style={{ padding: '20px 22px', marginBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>面談情報</p>
        <InfoRow label="日付" value={dateStr} />
        {timeStr && <InfoRow label="時間" value={timeStr} />}
        {reservation.meeting_type && <InfoRow label="形式" value={reservation.meeting_type} />}
        <InfoRow
          label="ステータス"
          value={
            reservation.status === 'active' ? '予定' :
            reservation.status === 'canceled' ? 'キャンセル済み' : '完了'
          }
        />
      </div>

      {/* ユーザー情報 */}
      <div className="kc-card" style={{ padding: '20px 22px', marginBottom: 16 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>ご予約者</p>
        <InfoRow label="お名前" value={reservation.user_name} />
        <InfoRow label="メール" value={reservation.user_email} />
        {reservation.user_phone && <InfoRow label="電話" value={reservation.user_phone} />}
        {reservation.notes && <InfoRow label="メモ" value={reservation.notes} />}
      </div>

      {/* 日程変更提案カード */}
      {canProposeReschedule && (
        <div className="kc-card" style={{ padding: '20px 22px', marginBottom: 16 }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>日程変更</p>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 14 }}>
            空き枠を選んでユーザーに日程変更を提案できます。
          </p>
          <button onClick={handleOpenReschedule} className="kc-btn kc-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            日程変更を提案する
          </button>
        </div>
      )}

      {/* 日程変更モーダル */}
      {showRescheduleModal && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 400, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 className="kc-modal-title" style={{ margin: 0 }}>日程変更を提案</h2>
              <button
                onClick={() => setShowRescheduleModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 14 }}>
              新しい面談日時を選んでください。ユーザーに通知され、了承を待ちます。
            </p>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {slots.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-mid)', textAlign: 'center', padding: '24px 0' }}>
                  現在、空き枠がありません
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {Object.entries(slotsByDate).map(([dateKey, daySlots]) => {
                    const dateLabel = new Date(dateKey + 'T00:00:00').toLocaleDateString('ja-JP', {
                      month: 'long', day: 'numeric', weekday: 'short',
                    })
                    return (
                      <div key={dateKey}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6, letterSpacing: '.04em' }}>
                          {dateLabel}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {daySlots.map(slot => {
                            const startTime = new Date(slot.start_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                            const endTime = new Date(slot.end_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
                            const isSelected = selectedSlot === slot.id
                            return (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 14px',
                                  borderRadius: 10,
                                  border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                                  background: isSelected ? '#FFF8F0' : 'var(--card)',
                                  cursor: 'pointer',
                                  transition: 'all .15s',
                                  width: '100%',
                                  textAlign: 'left',
                                }}
                              >
                                <span style={{
                                  fontSize: 13,
                                  fontWeight: isSelected ? 600 : 400,
                                  color: isSelected ? 'var(--accent)' : 'var(--text)',
                                }}>
                                  {startTime} – {endTime}
                                </span>
                                {slot.meeting_type && (
                                  <span style={{
                                    fontSize: 11,
                                    color: 'var(--text-mid)',
                                    background: 'var(--bg-elev)',
                                    borderRadius: 6,
                                    padding: '2px 8px',
                                  }}>
                                    {slot.meeting_type}
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {slots.length > 0 && (
              <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="kc-btn kc-btn-ghost"
                  style={{ flex: 1 }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleRequestReschedule}
                  disabled={!selectedSlot || submitting}
                  className="kc-btn kc-btn-primary"
                  style={{ flex: 1 }}
                >
                  {submitting ? '送信中...' : '提案する'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '9px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-mid)', minWidth: 60, flexShrink: 0, paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: 'var(--text)', wordBreak: 'break-all' }}>{value}</span>
    </div>
  )
}
