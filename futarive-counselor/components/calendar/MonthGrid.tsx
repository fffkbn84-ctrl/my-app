'use client'

import type { Slot } from '@/lib/types'

interface MonthGridProps {
  year: number
  month: number // 0-indexed
  slots: Slot[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  closedWeekdays?: number[] | null  // 0=Sun..6=Sat
}

export default function MonthGrid({ year, month, slots, selectedDate, onSelectDate, closedWeekdays }: MonthGridProps) {
  const closedSet = new Set(closedWeekdays ?? [])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = firstDay.getDay() // 0=Sun
  const daysInMonth = lastDay.getDate()

  // スロットを日付でグループ化（ローカルタイムゾーンの日付で）
  const slotsByDate: Record<string, { open: number; booked: number; locked: number }> = {}
  slots.forEach(s => {
    const dt = new Date(s.start_at)
    const d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
    if (!slotsByDate[d]) slotsByDate[d] = { open: 0, booked: 0, locked: 0 }
    slotsByDate[d][s.status]++
  })

  // カレンダーセル配列
  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const DOW = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div>
      {/* 曜日ヘッダー */}
      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {DOW.map((d, i) => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 500,
            color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--accent)' : 'var(--text-light)',
            padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* セルグリッド */}
      <div className="cal-grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const cellDate = new Date(year, month, day)
          const isToday = cellDate.getTime() === today.getTime()
          const isSelected = dateStr === selectedDate
          const dotData = slotsByDate[dateStr]
          const dow = cellDate.getDay()
          const isClosed = closedSet.has(dow)

          return (
            <div
              key={dateStr}
              className={`cal-cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${isClosed ? ' closed' : ''}`}
              onClick={() => onSelectDate(dateStr)}
              title={isClosed ? '定休日' : undefined}
            >
              <span className="cal-day-num" style={{
                color: dow === 0 ? 'var(--danger)' : dow === 6 ? 'var(--accent)' : undefined,
                fontWeight: isToday ? 700 : undefined,
                opacity: isClosed ? .4 : 1,
              }}>
                {day}
              </span>
              {dotData && (
                <div className="cal-dots">
                  {dotData.open > 0 && <div className="cal-dot cal-dot-open" />}
                  {dotData.booked > 0 && <div className="cal-dot cal-dot-booked" />}
                  {dotData.locked > 0 && <div className="cal-dot cal-dot-locked" />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
