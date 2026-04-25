'use client'

import { useState } from 'react'

const TIMES: string[] = []
for (let h = 9; h <= 20; h++) {
  TIMES.push(`${String(h).padStart(2, '0')}:00`)
  if (h < 20) TIMES.push(`${String(h).padStart(2, '0')}:30`)
}

// "YYYY-MM-DD" + "HH:mm" を端末ローカルタイムゾーンの ISO 文字列に変換
// 例: 2026-04-26 10:00 (JST) → "2026-04-26T10:00:00+09:00"
function localDateTimeToIso(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const local = new Date(y, m - 1, d, hh, mm, 0)
  // タイムゾーンオフセット (分) → "+09:00" 形式の文字列
  const tzMin = -local.getTimezoneOffset()
  const sign = tzMin >= 0 ? '+' : '-'
  const abs = Math.abs(tzMin)
  const tzStr = `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00${tzStr}`
}

interface SlotFormProps {
  date: string // YYYY-MM-DD
  onAdd: (startTime: string, endTime: string) => void
  onClose: () => void
  loading: boolean
}

export default function SlotForm({ date, onAdd, onClose, loading }: SlotFormProps) {
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('11:00')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ローカル時刻として ISO 文字列を生成し、JST 等のオフセットを保持したまま送信
    // （オフセットなしで送ると Supabase は UTC として解釈し、表示時に9時間ずれる）
    const startIso = localDateTimeToIso(date, startTime)
    const endIso = localDateTimeToIso(date, endTime)
    onAdd(startIso, endIso)
  }

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 18 }}>{dateLabel}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div>
          <label className="kc-label">開始時刻</label>
          <select className="kc-select" value={startTime} onChange={e => setStartTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="kc-label">終了時刻</label>
          <select className="kc-select" value={endTime} onChange={e => setEndTime(e.target.value)}>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
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
