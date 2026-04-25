'use client'

interface MottoFieldProps {
  value: string
  onChange: (v: string) => void
}

const MAX = 80

export default function MottoField({ value, onChange }: MottoFieldProps) {
  return (
    <div>
      <h3 className="section-title" style={{ marginBottom: 6 }}>
        ことば
      </h3>
      <p
        style={{
          fontSize: 12,
          color: 'var(--text-mid)',
          lineHeight: 1.7,
          margin: 0,
          marginBottom: 16,
        }}
      >
        詳細ページとリールの最後に表示される、あなたの言葉。
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>
          大事にしていること・座右の銘
        </span>
        <span
          style={{
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 999,
            background: 'var(--bg-subtle)',
            color: 'var(--text-mid)',
          }}
        >
          任意
        </span>
      </div>

      <textarea
        className="kc-textarea"
        style={{
          minHeight: 70,
          fontFamily: 'Shippori Mincho, serif',
          fontSize: 15,
          lineHeight: 1.8,
        }}
        maxLength={MAX}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="急がせないことを、いちばん大切にしています。"
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: 11,
          fontFamily: 'DM Sans, sans-serif',
          color: 'var(--text-light)',
          marginTop: 6,
        }}
      >
        {value.length} / {MAX}
      </div>
    </div>
  )
}
