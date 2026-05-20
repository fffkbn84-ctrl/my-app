'use client'

import type { Reservation } from '@/lib/types'
import LeadCard, { type ColumnKey } from './LeadCard'

interface Props {
  column: ColumnKey
  title: string
  subtitle?: string
  items: Reservation[]
  onOpenReservation: (r: Reservation) => void
  /** カラム見出しの右端に出すアクセントカラー（点で表す） */
  accentColor?: string
  /** 空のときに出すメッセージ */
  emptyText?: string
}

export default function KanbanColumn({
  column,
  title,
  subtitle,
  items,
  onOpenReservation,
  accentColor,
  emptyText = 'いまはありません',
}: Props) {
  return (
    <div style={{
      background: 'var(--bg-elev)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: 160,
    }}>
      {/* 見出し */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
        }}>
          {accentColor && (
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: accentColor,
              flexShrink: 0,
            }} />
          )}
          <span style={{
            fontFamily: 'Shippori Mincho, serif',
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--text-deep)',
            letterSpacing: '.04em',
          }}>
            {title}
          </span>
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text-mid)',
            background: 'var(--card)',
            padding: '1px 8px',
            borderRadius: 20,
            border: '1px solid var(--border)',
          }}>
            {items.length}
          </span>
        </div>
        {subtitle && (
          <p style={{
            fontSize: 10,
            color: 'var(--text-mid)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* カードリスト */}
      {items.length === 0 ? (
        <div style={{
          padding: '22px 12px',
          fontSize: 11,
          color: 'var(--text-light)',
          textAlign: 'center',
          fontFamily: 'Shippori Mincho, serif',
          fontStyle: 'italic',
          lineHeight: 1.7,
        }}>
          {emptyText}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {items.map(r => (
            <LeadCard
              key={r.id}
              reservation={r}
              column={column}
              onOpen={() => onOpenReservation(r)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
