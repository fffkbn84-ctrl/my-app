'use client'

import type { Slot } from '@/lib/types'

interface SlotDetailPanelProps {
  date: string
  slots: Slot[]
  onStatusChange: (slotId: string, status: Slot['status']) => void
  onDelete: (slotId: string) => void
  onAddNew: () => void
}

const STATUS_LABELS: Record<Slot['status'], string> = {
  open: '空き',
  locked: 'ロック中',
  booked: '予約済み',
}

export default function SlotDetailPanel({ date, slots, onStatusChange, onDelete, onAddNew }: SlotDetailPanelProps) {
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
                gap: 12,
                padding: '10px 12px',
                background: 'var(--bg-elev)',
                borderRadius: 10,
              }}>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-deep)',
                  minWidth: 110,
                }}>
                  {timeStr}
                </span>

                <span className={`kc-badge kc-badge-${slot.status}`}>
                  {STATUS_LABELS[slot.status]}
                </span>

                {slot.status !== 'booked' && (
                  <select
                    value={slot.status}
                    onChange={e => onStatusChange(slot.id, e.target.value as Slot['status'])}
                    style={{
                      marginLeft: 'auto',
                      fontSize: 12,
                      padding: '4px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="open">空きに変更</option>
                    <option value="locked">ロックに変更</option>
                  </select>
                )}

                {slot.status === 'open' && (
                  <button
                    onClick={() => onDelete(slot.id)}
                    style={{
                      marginLeft: 4,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-light)',
                      padding: 4,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3h10M5 3V2h4v1M4 3v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
