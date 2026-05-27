'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import type { Slot } from '@/lib/types'

interface WeekViewProps {
  /** その範囲の開始日（00:00:00 ローカル時刻）。週ビューは日曜、日ビューは当日 */
  weekStart: Date
  slots: Slot[]
  /** 質問付き未返信予約がある日付（YYYY-MM-DD ローカルTZ） */
  needsReplyDates?: Set<string>
  /** 0=日..6=土 のリスト。定休日扱いで背景を薄く */
  closedWeekdays?: number[] | null
  /** 表示開始時刻（時）。デフォルト 8 */
  startHour?: number
  /** 表示終了時刻（時、排他的）。デフォルト 22 */
  endHour?: number
  /** 表示する日数。1（日ビュー）または 7（週ビュー）。デフォルト 7 */
  daysCount?: number
  /** スロットブロックタップ */
  onSlotClick: (slot: Slot) => void
  /** 空き時間タップで枠追加（dateStr=YYYY-MM-DD, timeStr=HH:mm） */
  onAddSlot: (dateStr: string, timeStr: string) => void
}

const DOW = ['日', '月', '火', '水', '木', '金', '土']

/** Date を「YYYY-MM-DD」ローカル時刻文字列に */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** ローカル時刻で 00:00 にそろえた Date を返す */
function startOfDay(d: Date): Date {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

export default function WeekView({
  weekStart,
  slots,
  needsReplyDates,
  closedWeekdays,
  startHour = 8,
  endHour = 22,
  daysCount = 7,
  onSlotClick,
  onAddSlot,
}: WeekViewProps) {
  const isDayMode = daysCount === 1
  const closedSet = useMemo(() => new Set(closedWeekdays ?? []), [closedWeekdays])
  const hours = useMemo(() => {
    const arr: number[] = []
    for (let h = startHour; h < endHour; h++) arr.push(h)
    return arr
  }, [startHour, endHour])

  const PX_PER_HOUR = 56
  const totalHeight = (endHour - startHour) * PX_PER_HOUR

  // 日付配列（週=7日 / 日=1日）
  const days = useMemo(() => {
    const arr: Date[] = []
    const base = startOfDay(weekStart)
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [weekStart, daysCount])

  // 「いま」を示す赤いライン用：今日が表示範囲内かを判定 + 何分目か
  const [nowMinutes, setNowMinutes] = useState<number | null>(null)
  const [nowDateStr, setNowDateStr] = useState<string | null>(null)
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const today0 = startOfDay(now)
      const weekS = startOfDay(weekStart)
      const weekEnd = new Date(weekS)
      weekEnd.setDate(weekS.getDate() + daysCount)
      if (today0 >= weekS && today0 < weekEnd) {
        const minutesFromViewStart = now.getHours() * 60 + now.getMinutes() - startHour * 60
        if (minutesFromViewStart >= 0 && minutesFromViewStart <= (endHour - startHour) * 60) {
          setNowMinutes(minutesFromViewStart)
          setNowDateStr(ymd(now))
          return
        }
      }
      setNowMinutes(null)
      setNowDateStr(null)
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [weekStart, startHour, endHour, daysCount])

  // スロットを日ごとに振り分け
  const slotsByDay = useMemo(() => {
    const map: Record<string, Slot[]> = {}
    for (const s of slots) {
      const d = new Date(s.start_at)
      const key = ymd(d)
      if (!map[key]) map[key] = []
      map[key].push(s)
    }
    return map
  }, [slots])

  // 空きエリアタップ：座標から時刻を逆算
  const columnRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const handleColumnClick = (e: React.MouseEvent<HTMLDivElement>, dateStr: string) => {
    // スロット内タップはこのハンドラを呼ばないようにブロック側で stopPropagation 済み
    const el = columnRefs.current.get(dateStr)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const y = e.clientY - rect.top
    const minutesFromStart = (y / PX_PER_HOUR) * 60
    const totalMinutes = startHour * 60 + minutesFromStart
    // 30 分単位に丸める
    const snappedMinutes = Math.max(startHour * 60, Math.round(totalMinutes / 30) * 30)
    const h = Math.floor(snappedMinutes / 60)
    const m = snappedMinutes % 60
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    onAddSlot(dateStr, timeStr)
  }

  return (
    <div className="wv-root">
      {/* ヘッダー：曜日 + 日付 */}
      <div className={`wv-header${isDayMode ? ' is-day' : ''}`}>
        <div className="wv-time-spacer" />
        {days.map((d) => {
          const dateStr = ymd(d)
          const isToday = ymd(new Date()) === dateStr
          const dow = d.getDay()
          const hasUnread = needsReplyDates?.has(dateStr) ?? false
          return (
            <div key={dateStr} className={`wv-day-header${isToday ? ' is-today' : ''}`}>
              <span className="wv-day-name" style={{
                color: dow === 0 ? 'var(--danger)' : dow === 6 ? 'var(--accent)' : 'var(--text-mid)',
              }}>{DOW[dow]}</span>
              <span className="wv-day-num" style={{
                color: isToday ? 'var(--accent)' : dow === 0 ? 'var(--danger)' : undefined,
              }}>
                {isDayMode ? `${d.getMonth() + 1}/${d.getDate()}` : d.getDate()}
              </span>
              {hasUnread && (
                <span className="wv-unread-badge" aria-label="未返信の質問あり" title="未返信の質問あり">!</span>
              )}
            </div>
          )
        })}
      </div>

      {/* 本体：時刻軸 + 日列 */}
      <div className={`wv-body${isDayMode ? ' is-day' : ''}`} style={{ minHeight: totalHeight }}>
        {/* 時刻軸 */}
        <div className="wv-time-axis" style={{ height: totalHeight }}>
          {hours.map(h => (
            <div key={h} className="wv-hour-label" style={{ height: PX_PER_HOUR }}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* 日ごとの列 */}
        {days.map(d => {
          const dateStr = ymd(d)
          const daySlots = slotsByDay[dateStr] ?? []
          const isClosed = closedSet.has(d.getDay())
          const showNowLine = nowDateStr !== null && nowDateStr === dateStr && nowMinutes !== null

          return (
            <div
              key={dateStr}
              className={`wv-day-col${isClosed ? ' is-closed' : ''}`}
              style={{ height: totalHeight }}
              ref={(el) => { columnRefs.current.set(dateStr, el) }}
              onClick={(e) => handleColumnClick(e, dateStr)}
            >
              {/* 1時間ごとの罫線 */}
              {hours.map((h, i) => (
                <div
                  key={h}
                  className="wv-hour-line"
                  style={{ top: i * PX_PER_HOUR }}
                />
              ))}

              {/* スロットブロック */}
              {daySlots.map(s => {
                const start = new Date(s.start_at)
                const end = new Date(s.end_at)
                const startMin = start.getHours() * 60 + start.getMinutes() - startHour * 60
                const endMin = end.getHours() * 60 + end.getMinutes() - startHour * 60
                if (endMin <= 0) return null
                if (startMin >= (endHour - startHour) * 60) return null
                const top = Math.max(0, (startMin / 60) * PX_PER_HOUR)
                const bottom = Math.min(totalHeight, (endMin / 60) * PX_PER_HOUR)
                const height = Math.max(18, bottom - top)
                const startLabel = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
                const endLabel = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`

                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`wv-slot wv-slot-${s.status}`}
                    style={{ top, height }}
                    onClick={(e) => { e.stopPropagation(); onSlotClick(s) }}
                    aria-label={`${startLabel} から ${endLabel} の枠`}
                  >
                    <span className="wv-slot-time">{startLabel}</span>
                    <span className="wv-slot-status">
                      {s.status === 'open' ? '空き' : s.status === 'booked' ? '予約済' : 'ロック'}
                    </span>
                    {s.meeting_type && height >= 50 && (
                      <span className="wv-slot-meta">{s.meeting_type}</span>
                    )}
                  </button>
                )
              })}

              {/* 「いま」ライン */}
              {showNowLine && nowMinutes !== null && (
                <div
                  className="wv-now-line"
                  style={{ top: (nowMinutes / 60) * PX_PER_HOUR }}
                  aria-hidden="true"
                >
                  <span className="wv-now-dot" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
