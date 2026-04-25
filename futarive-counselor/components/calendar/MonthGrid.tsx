'use client'

import type { Slot } from '@/lib/types'

interface MonthGridProps {
  year: number
  month: number // 0-indexed
  slots: Slot[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

export default function MonthGrid({ year, month, slots, selectedDate, onSelectDate }: MonthGridProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = firstDay.getDay() // 0=Sun
  const daysInMonth = lastDay.getDate()

  // スロットを日付でグループ化
  const slotsByDate: Record<string, { open: number; booked: number; locked: number }> = {}
  slots.forEach(s => {
    const d = s.start_at.slice(0, 10)
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

          return (
            <div
              key={dateStr}
              className={`cal-cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => onSelectDate(dateStr)}
            >
              <span className="cal-day-num" style={{
                color: dow === 0 ? 'var(--danger)' : dow === 6 ? 'var(--accent)' : undefined,
                fontWeight: isToday ? 700 : undefined,
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
