'use client'

export type FilterType = 'all' | 'unreplied' | 'high' | 'low'

interface ReviewFiltersProps {
  current: FilterType
  onChange: (f: FilterType) => void
  counts: Record<FilterType, number>
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'unreplied', label: '未返信' },
  { key: 'high', label: '★4以上' },
  { key: 'low', label: '★3以下' },
]

export default function ReviewFilters({ current, onChange, counts }: ReviewFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          style={{
            padding: '7px 14px',
            borderRadius: 50,
            border: '1px solid',
            fontSize: 12,
            cursor: 'pointer',
            fontWeight: current === f.key ? 600 : 400,
            background: current === f.key ? 'var(--accent-pale)' : 'var(--card)',
            borderColor: current === f.key ? 'var(--accent)' : 'var(--border)',
            color: current === f.key ? 'var(--accent-deep)' : 'var(--text-mid)',
            transition: 'all .15s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {f.label}
          {counts[f.key] > 0 && (
            <span style={{
              background: current === f.key ? 'var(--accent)' : 'var(--bg-subtle)',
              color: current === f.key ? 'white' : 'var(--text-mid)',
              borderRadius: 10,
              padding: '0 6px',
              fontSize: 10,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
            }}>
              {counts[f.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
