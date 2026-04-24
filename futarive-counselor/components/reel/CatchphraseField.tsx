'use client'

import { useRef } from 'react'

interface CatchphraseFieldProps {
  value: string
  onChange: (v: string) => void
}

const MAX = 20

export default function CatchphraseField({ value, onChange }: CatchphraseFieldProps) {
  const pct = Math.min(value.length / MAX, 1)
  const near = value.length > 16
  const over = value.length >= MAX

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--card-warm), var(--accent-pale))',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '18px 20px',
    }}>
      <label className="kc-label" style={{ marginBottom: 10 }}>
        キャッチコピー
        <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-light)', fontWeight: 400 }}>
          リールに大きく表示されます
        </span>
      </label>
      <textarea
        maxLength={MAX}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="あなたの婚活、一緒に歩みます"
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'Shippori Mincho, serif',
          fontWeight: 600,
          fontSize: 20,
          color: 'var(--text-deep)',
          resize: 'none',
          lineHeight: 1.6,
          minHeight: 60,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div className="cp-progress" style={{ flex: 1, marginRight: 12, marginTop: 0 }}>
          <div
            className={`cp-progress-fill${near ? ' near' : ''}${over ? ' over' : ''}`}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <span style={{
          fontSize: 11,
          fontFamily: 'DM Sans, sans-serif',
          color: over ? 'var(--danger)' : near ? 'var(--warning)' : 'var(--text-light)',
          fontWeight: 500,
          flexShrink: 0,
        }}>
          {value.length}/{MAX}
        </span>
      </div>
    </div>
  )
}
