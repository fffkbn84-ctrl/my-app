export type FreshnessLevel = 'fresh' | 'aging' | 'stale'

export const FRESHNESS_AGING_DAYS = 30
export const FRESHNESS_STALE_DAYS = 90

export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null
  const ms = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ms)) return null
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function freshnessLevel(iso: string | null | undefined): FreshnessLevel {
  const d = daysSince(iso)
  if (d === null) return 'stale'
  if (d >= FRESHNESS_STALE_DAYS) return 'stale'
  if (d >= FRESHNESS_AGING_DAYS) return 'aging'
  return 'fresh'
}

export function formatLastUpdated(iso: string | null | undefined): string {
  const d = daysSince(iso)
  if (d === null || !iso) return '—'
  const date = new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' })
  if (d === 0) return `${date}（今日）`
  return `${date}（${d}日前）`
}
