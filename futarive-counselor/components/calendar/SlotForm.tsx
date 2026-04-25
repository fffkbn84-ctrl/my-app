'use client'

import { useEffect, useState } from 'react'

// "YYYY-MM-DD" + "HH:mm" を端末ローカルTZのオフセット付き ISO 文字列に変換
function localDateTimeToIso(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const local = new Date(y, m - 1, d, hh, mm, 0)
  const tzMin = -local.getTimezoneOffset()
  const sign = tzMin >= 0 ? '+' : '-'
  const abs = Math.abs(tzMin)
  const tzStr = `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${tzStr}`
}

// "HH:mm" or "HH:mm:ss" → minutes since midnight
function toMinutes(t: string | null | undefined, fallback: number): number {
  if (!t) return fallback
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

function buildTimes(startMin: number, endMin: number): string[] {
  const out: string[] = []
  for (let mm = startMin; mm <= endMin; mm += 30) {
    const h = Math.floor(mm / 60)
    const m = mm % 60
    out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return out
}

interface SlotFormProps {
  date: string // YYYY-MM-DD
  onAdd: (startTime: string, endTime: string) => void
  onClose: () => void
  loading: boolean
  consultationStart?: string | null  // "HH:mm[:ss]"
  consultationEnd?: string | null
}

export default function SlotForm({ date, onAdd, onClose, loading, consultationStart, consultationEnd }: SlotFormProps) {
  // 面談可能時間が無ければ 09:00-20:00 をデフォルトに
  const startMin = toMinutes(consultationStart, 9 * 60)
  const endMin = toMinutes(consultationEnd, 20 * 60)
  const startTimes = buildTimes(startMin, Math.max(startMin, endMin - 30))
  const endTimes = buildTimes(startMin + 30, endMin)

  const [startTime, setStartTime] = useState(startTimes[Math.min(2, startTimes.length - 1)] ?? startTimes[0] ?? '10:00')
  const [endTime, setEndTime] = useState(endTimes.find(t => t > startTime) ?? endTimes[0] ?? '11:00')

  // 開始時刻の変更で終了時刻が破綻したら自動補正
  useEffect(() => {
    if (endTime <= startTime) {
      const next = endTimes.find(t => t > startTime)
      if (next) setEndTime(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(localDateTimeToIso(date, startTime), localDateTimeToIso(date, endTime))
  }

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })

  const hoursHint = consultationStart && consultationEnd
    ? `面談可能時間：${consultationStart.slice(0, 5)}〜${consultationEnd.slice(0, 5)}`
    : '相談所プロフィールで面談可能時間を設定すると、ここが自動で絞られます'

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 6 }}>{dateLabel}</p>
      <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 18 }}>{hoursHint}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div>
          <label className="kc-label">開始時刻</label>
          <select className="kc-select" value={startTime} onChange={e => setStartTime(e.target.value)}>
            {startTimes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="kc-label">終了時刻</label>
          <select className="kc-select" value={endTime} onChange={e => setEndTime(e.target.value)}>
            {endTimes.filter(t => t > startTime).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" className="kc-btn kc-btn-ghost" onClick={onClose}>キャンセル</button>
        <button type="submit" className="kc-btn kc-btn-primary" disabled={loading}>
          {loading ? '追加中...' : '枠を追加'}
        </button>
      </div>
    </form>
  )
}
