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

type MeetingType = '対面' | 'オンライン' | null

interface SlotFormProps {
  date: string // YYYY-MM-DD
  /** meetingType: NULL = 両方OK、'対面' / 'オンライン' = 形式固定 */
  onAdd: (startTime: string, endTime: string, meetingType: MeetingType) => void
  onClose: () => void
  loading: boolean
  consultationStart?: string | null  // "HH:mm[:ss]"
  consultationEnd?: string | null
  slotMinutes?: number               // デフォルト所要時間（分）
}

function addMinutesHHMM(time: string, deltaMin: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + deltaMin
  const hh = Math.floor(total / 60)
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export default function SlotForm({ date, onAdd, onClose, loading, consultationStart, consultationEnd, slotMinutes = 60 }: SlotFormProps) {
  // 面談可能時間が無ければ 09:00-20:00 をデフォルトに
  const startMin = toMinutes(consultationStart, 9 * 60)
  const endMin = toMinutes(consultationEnd, 20 * 60)
  const startTimes = buildTimes(startMin, Math.max(startMin, endMin - 30))
  const endTimes = buildTimes(startMin + 30, endMin)

  const initialStart = startTimes[0] ?? '10:00'
  const suggestedEnd = addMinutesHHMM(initialStart, slotMinutes)
  const [startTime, setStartTime] = useState(initialStart)
  const [endTime, setEndTime] = useState(
    endTimes.includes(suggestedEnd) ? suggestedEnd : (endTimes.find(t => t > initialStart) ?? endTimes[0] ?? '11:00')
  )
  // 面談形式（'both' = NULL = 両方OK / '対面' / 'オンライン'）
  const [meetingType, setMeetingType] = useState<'both' | '対面' | 'オンライン'>('both')

  // 開始時刻が変わったら所要時間ぶん後の終了時刻に自動セット
  useEffect(() => {
    const suggested = addMinutesHHMM(startTime, slotMinutes)
    if (endTimes.includes(suggested)) {
      setEndTime(suggested)
    } else if (endTime <= startTime) {
      const next = endTimes.find(t => t > startTime)
      if (next) setEndTime(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, slotMinutes])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mt: MeetingType = meetingType === 'both' ? null : meetingType
    onAdd(localDateTimeToIso(date, startTime), localDateTimeToIso(date, endTime), mt)
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
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

      {/* 022_slots_meeting_type — 枠ごとに対面/オンラインを事前固定可 */}
      <div style={{ marginBottom: 20 }}>
        <label className="kc-label">面談形式</label>
        <select
          className="kc-select"
          value={meetingType}
          onChange={e => setMeetingType(e.target.value as 'both' | '対面' | 'オンライン')}
        >
          <option value="both">対面 / オンライン どちらも可</option>
          <option value="対面">対面のみ</option>
          <option value="オンライン">オンラインのみ</option>
        </select>
        <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 6, lineHeight: 1.7 }}>
          「どちらも可」にするとユーザーが予約時に選択できます。
          <br />「対面のみ」「オンラインのみ」にするとその形式に固定されます。
        </p>
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
