'use client'

import type { Slot } from '@/lib/types'

interface SlotDetailPanelProps {
  date: string
  slots: Slot[]
  onStatusChange: (slotId: string, status: Slot['status']) => void
  onDelete: (slotId: string) => void
  onAddNew: () => void
  onViewReservation: (slotId: string) => void
}

const STATUS_LABELS: Record<Slot['status'], string> = {
  open: '空き',
  locked: 'ロック中',
  booked: '予約済み',
}

export default function SlotDetailPanel({ date, slots, onStatusChange, onDelete, onAddNew, onViewReservation }: SlotDetailPanelProps) {
  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
    month: 'long', day: 'numeric', weekday: 'short',
  })

  return (
    <div className="kc-card" style={{ padding: '18px 20px', marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="section-title">{dateLabel}</span>
        <button className="kc-btn kc-btn-primary kc-btn-sm" onClick={onAddNew}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          枠を追加
        </button>
      </div>

      {slots.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', padding: '16px 0' }}>
          この日の予約枠はありません
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {slots.map(slot => {
            const start = new Date(slot.start_at)
            const end = new Date(slot.end_at)
            const timeStr = `${start.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`

            return (
              <div key={slot.id} style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                rowGap: 8,
                padding: '10px 12px',
                background: 'var(--bg-elev)',
                borderRadius: 10,
                overflow: 'hidden',          // 万一の数 px 漏れも吸収
              }}>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-deep)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}>
                  {timeStr}
                </span>

                <span className={`kc-badge kc-badge-${slot.status}`} style={{ flexShrink: 0 }}>
                  {STATUS_LABELS[slot.status]}
                </span>

                {/* 右側コントロール群：1つの flex グループにまとめて、
                    必要なら一括で次の行に折り返す（iPhone 16 などの幅で
                    ゴミ箱がはみ出るバグ対策） */}
                <div style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  flexShrink: 0,
                  minWidth: 0,
                }}>
                  {slot.status === 'booked' ? (
                    <button
                      onClick={() => onViewReservation(slot.id)}
                      className="kc-btn kc-btn-ghost kc-btn-sm"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M2 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      予約者を見る
                    </button>
                  ) : (
                    <>
                      <select
                        value={slot.status}
                        onChange={e => onStatusChange(slot.id, e.target.value as Slot['status'])}
                        style={{
                          fontSize: 12,
                          padding: '4px 8px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: 'var(--card)',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          maxWidth: 130,
                        }}
                      >
                        <option value="open">空きに変更</option>
                        <option value="locked">ロックに変更</option>
                      </select>

                      {slot.status === 'open' && (
                        <button
                          onClick={() => onDelete(slot.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-light)',
                            padding: 4,
                            flexShrink: 0,
                          }}
                          aria-label="削除"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 3h10M5 3V2h4v1M4 3v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
