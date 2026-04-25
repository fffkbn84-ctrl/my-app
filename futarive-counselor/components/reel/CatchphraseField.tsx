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
  const meterClass = over ? 'over' : near ? 'near' : ''

  return (
    <div className="cp-card">
      <div className="cp-head">
        <span className="cp-label">CATCHPHRASE</span>
        <span className="cp-hint">{MAX}文字まで・リール1枚目に重ねて表示</span>
      </div>
      <textarea
        className="cp-textarea"
        maxLength={MAX}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="あなたの婚活、一緒に歩みます"
        rows={2}
      />
      <div className="cp-meter">
        <div className="cp-bar">
          <div className={`cp-bar-fill ${meterClass}`} style={{ width: `${pct * 100}%` }} />
        </div>
        <span className={`cp-count ${meterClass}`}>
          {value.length} / {MAX}
        </span>
      </div>
    </div>
  )
}
