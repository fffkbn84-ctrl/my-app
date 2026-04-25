'use client'

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
    <div
      style={{
        background:
          'linear-gradient(135deg, var(--card-warm) 0%, var(--accent-pale) 100%)',
        border: '1px solid var(--accent-dim)',
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: 'var(--sh-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span
          className="eyebrow"
          style={{ color: 'var(--accent-deep)' }}
        >
          CATCHPHRASE
        </span>
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-mid)',
            letterSpacing: '.02em',
          }}
        >
          20文字まで・リール1枚目に重ねて表示
        </span>
      </div>

      <textarea
        maxLength={MAX}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="焦らなくていい、ふたりの話をしよう"
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'Shippori Mincho, serif',
          fontWeight: 500,
          fontSize: 22,
          color: 'var(--text-deep)',
          resize: 'none',
          lineHeight: 1.55,
          minHeight: 72,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 4,
        }}
      >
        <div
          className="cp-progress"
          style={{ flex: 1, marginTop: 0, background: 'rgba(0,0,0,.06)' }}
        >
          <div
            className={`cp-progress-fill${near ? ' near' : ''}${over ? ' over' : ''}`}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <span
          style={{
            fontSize: 12,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            color: over
              ? 'var(--danger)'
              : near
              ? 'var(--warning)'
              : 'var(--accent-deep)',
            flexShrink: 0,
            minWidth: 44,
            textAlign: 'right',
          }}
        >
          {value.length} / {MAX}
        </span>
      </div>
    </div>
  )
}
