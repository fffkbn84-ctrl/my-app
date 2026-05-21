'use client'

/**
 * 申込からの経過時間を段階的なバッジで表示する。
 * Claude.ai 設計の 5 段階に準拠：
 *   < 2h : 緑「新着」
 *   2-12h: 緑「N時間経過」
 *   12-24h: 黄「対応推奨」
 *   24-48h: オレンジ「要対応」
 *   > 48h: 赤「機会損失リスク」
 *
 * カード全体に赤縁を付けたいときは parent 側で `escalation === 'critical'` を見て判定する。
 */

export type Escalation = 'fresh' | 'normal' | 'recommended' | 'urgent' | 'critical'

export function computeEscalation(createdAt: string, now: Date = new Date()): {
  level: Escalation
  hours: number
} {
  const created = new Date(createdAt).getTime()
  const elapsedMs = now.getTime() - created
  const hours = elapsedMs / (1000 * 60 * 60)
  let level: Escalation = 'normal'
  if (hours < 2) level = 'fresh'
  else if (hours < 12) level = 'normal'
  else if (hours < 24) level = 'recommended'
  else if (hours < 48) level = 'urgent'
  else level = 'critical'
  return { level, hours }
}

const LEVEL_STYLE: Record<Escalation, { bg: string; color: string; border: string; label: (h: number) => string }> = {
  fresh:       { bg: 'rgba(122,158,135,.16)', color: '#4F7762', border: 'rgba(122,158,135,.45)',
                 label: () => '新着' },
  normal:      { bg: 'rgba(122,158,135,.12)', color: '#4F7762', border: 'rgba(122,158,135,.35)',
                 label: (h) => `${Math.floor(h)}時間経過` },
  recommended: { bg: 'rgba(212,162,61,.16)',  color: '#8A6A1F', border: 'rgba(212,162,61,.5)',
                 label: () => '対応推奨' },
  urgent:      { bg: 'rgba(214,134,80,.18)',  color: '#A0541F', border: 'rgba(214,134,80,.55)',
                 label: () => '要対応' },
  critical:    { bg: 'rgba(192,122,110,.20)', color: '#9A3B2C', border: 'rgba(192,122,110,.6)',
                 label: () => '機会損失リスク' },
}

interface Props {
  createdAt: string
  /** 上限超過時の代替テキスト。例：「面談予定まであと N時間」 */
  override?: { label: string; tone?: 'neutral' | 'urgent' }
}

export default function ElapsedBadge({ createdAt, override }: Props) {
  if (override) {
    const isUrgent = override.tone === 'urgent'
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 600,
        letterSpacing: '.06em',
        padding: '3px 9px',
        borderRadius: 20,
        background: isUrgent ? 'rgba(214,134,80,.18)' : 'var(--bg-elev)',
        color: isUrgent ? '#A0541F' : 'var(--text-mid)',
        border: `1px solid ${isUrgent ? 'rgba(214,134,80,.5)' : 'var(--border)'}`,
        whiteSpace: 'nowrap',
      }}>
        {override.label}
      </span>
    )
  }

  const { level, hours } = computeEscalation(createdAt)
  const s = LEVEL_STYLE[level]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 600,
      letterSpacing: '.06em',
      padding: '3px 9px',
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {level === 'critical' && (
        <span style={{ width: 6, height: 6, borderRadius: 3, background: '#9A3B2C', display: 'inline-block' }} />
      )}
      {s.label(hours)}
    </span>
  )
}
