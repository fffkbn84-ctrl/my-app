'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Agency } from '@/lib/types'

interface ReviewLite {
  id: string
  rating: number
  agency_reply: string | null
  counselor_id: string
  author_age_range: string | null
  author_gender: string | null
  created_at: string
}

interface ReservationLite {
  id: string
  counselor_id: string
  user_name: string
  start_time: string | null
}

type TodoCategory = 'urgent' | 'review' | 'booking' | 'tip'

interface TodoItem {
  category: TodoCategory
  title: string
  cta: string
  href: string
}

interface Stats {
  reelPublished: number
  reelTotal: number
  reservationsThisMonth: number
  reservationsLastMonth: number
  unrepliedReviews: number
  unrepliedLow: number
  avgRating: number | null
  totalReviews: number
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function formatToday() {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`
}

function maskName(name: string): string {
  if (!name) return '匿名'
  // 「佐藤 美穂」→「S.M」風のマスク
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}.${parts[1].charAt(0)}`
  }
  return parts[0].charAt(0) + '.'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [scopeKey, setScopeKey] = useState<string>('all')
  const [displayName, setDisplayName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: agencyRows } = await supabase
        .from('agencies')
        .select('*')
        .eq('owner_user_id', user.id)

      const { data: ownCounselor } = await supabase
        .from('counselors')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle()

      const ownerMode = !!agencyRows && agencyRows.length > 0
      setIsOwner(ownerMode)
      setAgencies((agencyRows as Agency[]) ?? [])

      let scopedCounselors: Counselor[] = []
      if (ownerMode) {
        const { data: ac } = await supabase
          .from('counselors')
          .select('*')
          .in(
            'agency_id',
            (agencyRows as Agency[]).map((a) => a.id),
          )
        scopedCounselors = (ac as Counselor[]) ?? []
        setDisplayName((agencyRows as Agency[])[0]?.name ?? '')
      } else if (ownCounselor) {
        scopedCounselors = [ownCounselor as Counselor]
        setDisplayName(ownCounselor.name)
      }
      setCounselors(scopedCounselors)

      await loadStats(supabase, scopedCounselors)
      setLoading(false)
    }
    load()
  }, [])

  const filteredCounselors =
    scopeKey === 'all'
      ? counselors
      : counselors.filter((c) => c.id === scopeKey)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadStats = async (supabase: any, scopedCounselors: Counselor[]) => {
    const ids = scopedCounselors.map((c) => c.id)
    if (ids.length === 0) {
      setStats({
        reelPublished: 0,
        reelTotal: 0,
        reservationsThisMonth: 0,
        reservationsLastMonth: 0,
        unrepliedReviews: 0,
        unrepliedLow: 0,
        avgRating: null,
        totalReviews: 0,
      })
      return
    }

    const reelPublished = scopedCounselors.filter((c) => c.reel_enabled).length
    const reelTotal = scopedCounselors.length

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const { count: thisMonthCount } = await supabase
      .from('reservations')
      .select('id', { count: 'exact', head: true })
      .in('counselor_id', ids)
      .gte('created_at', thisMonthStart.toISOString())
    const { count: lastMonthCount } = await supabase
      .from('reservations')
      .select('id', { count: 'exact', head: true })
      .in('counselor_id', ids)
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', thisMonthStart.toISOString())

    const { data: reviewRows } = await supabase
      .from('reviews')
      .select(
        'id,rating,agency_reply,counselor_id,author_age_range,author_gender,created_at',
      )
      .in('counselor_id', ids)
      .eq('is_published', true)

    const reviews = (reviewRows ?? []) as ReviewLite[]
    const unreplied = reviews.filter((r) => !r.agency_reply)
    const unrepliedLow = unreplied.filter((r) => r.rating <= 3).length
    const avgRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10,
          ) / 10
        : null

    // 明日の予約 (slots.start_time から)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)

    const { data: tomorrowRes } = await supabase
      .from('reservations')
      .select('id,counselor_id,user_name,slot_id,slots(start_time)')
      .in('counselor_id', ids)
      .order('created_at', { ascending: false })
      .limit(20)

    const tomorrowList: ReservationLite[] = ((tomorrowRes ?? []) as Array<
      ReservationLite & { slots: { start_time: string } | null }
    >)
      .map((r) => ({
        id: r.id,
        counselor_id: r.counselor_id,
        user_name: r.user_name,
        start_time: r.slots?.start_time ?? null,
      }))
      .filter((r) => {
        if (!r.start_time) return false
        const d = new Date(r.start_time)
        return d >= tomorrow && d < dayAfter
      })

    // ToDo を組み立て
    const newTodos: TodoItem[] = []

    // 1) 低評価未返信
    const lowUnreplied = unreplied
      .filter((r) => r.rating <= 3)
      .sort((a, b) => a.rating - b.rating)
    lowUnreplied.slice(0, 1).forEach((r) => {
      const age = r.author_age_range ?? ''
      const ageNum = age.match(/(\d{2})/)?.[1] ?? ''
      const ageLabel = ageNum ? `${ageNum}歳前後` : ''
      newTodos.push({
        category: 'urgent',
        title: `${maskName('匿名 利用者')}さん${ageLabel ? `（${ageLabel}）` : ''}から★${r.rating}のレビュー — 誠実な返信を書きましょう`,
        cta: '返信する',
        href: '/reviews',
      })
    })

    // 2) 高評価未返信 1件
    const highUnreplied = unreplied
      .filter((r) => r.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
    highUnreplied.slice(0, 1).forEach((r) => {
      const age = r.author_age_range ?? ''
      const ageNum = age.match(/(\d{2})/)?.[1] ?? ''
      const ageLabel = ageNum ? `${ageNum}歳前後` : ''
      newTodos.push({
        category: 'review',
        title: `${maskName('匿名 利用者')}さん${ageLabel ? `（${ageLabel}）` : ''}から★${r.rating}のレビュー — 感謝を伝えるチャンス`,
        cta: '返信する',
        href: '/reviews',
      })
    })

    // 3) 明日の予約
    tomorrowList.slice(0, 1).forEach((r) => {
      const t = r.start_time ? new Date(r.start_time) : null
      const time = t
        ? `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`
        : ''
      newTodos.push({
        category: 'booking',
        title: `明日 ${time}〜 初回面談・${r.user_name}さん`,
        cta: '詳細',
        href: '/calendar',
      })
    })

    // 4) リール推奨 (3枚未満のカウンセラーがいる場合)
    const needReel = scopedCounselors.find((c) => c.reel_enabled === false)
    if (needReel) {
      newTodos.push({
        category: 'tip',
        title: `${needReel.name}さんのリールがまだ非公開です。3〜5枚あると視聴完了率が大きく上がります`,
        cta: 'リールを編集',
        href: '/reel',
      })
    }

    setTodos(newTodos)
    setStats({
      reelPublished,
      reelTotal,
      reservationsThisMonth: thisMonthCount ?? 0,
      reservationsLastMonth: lastMonthCount ?? 0,
      unrepliedReviews: unreplied.length,
      unrepliedLow,
      avgRating,
      totalReviews: reviews.length,
    })
  }

  if (loading) {
    return (
      <div
        style={{
          padding: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--text-mid)',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            border: '2px solid var(--border-mid)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        読み込み中...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // 表示中ラベル
  const scopeLabel =
    scopeKey === 'all'
      ? `${displayName}・全体のようす`
      : `${counselors.find((c) => c.id === scopeKey)?.name ?? ''} さん`

  // stat card sub-text
  const reelSub =
    stats && stats.reelTotal > 0
      ? stats.reelPublished === stats.reelTotal
        ? 'すべて公開中'
        : `${stats.reelTotal - stats.reelPublished}名 非公開`
      : '—'

  const resSub = stats
    ? (() => {
        const diff = stats.reservationsThisMonth - stats.reservationsLastMonth
        if (stats.reservationsLastMonth === 0 && diff === 0) return '先月比 ±0'
        return `先月比 ${diff >= 0 ? '+' : ''}${diff}`
      })()
    : ''

  const reviewSub =
    stats && stats.unrepliedReviews > 0
      ? stats.unrepliedLow > 0
        ? `うち${stats.unrepliedLow}件は低評価`
        : 'すべて高評価です'
      : 'すべて返信済み'

  const ratingSub =
    stats && stats.avgRating != null
      ? `口コミ ${stats.totalReviews}件から`
      : '口コミ未到着'

  const filteredStats = stats // 表示中フィルタの集計切替は将来課題

  return (
    <div style={{ padding: '28px 22px', maxWidth: 920 }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 22 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          DASHBOARD
        </div>
        <h1
          className="page-title"
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            marginBottom: 14,
          }}
        >
          おかえりなさい、{displayName} さん
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-mid)',
            lineHeight: 1.85,
          }}
        >
          今日 · {formatToday()}。あなたの相談所の全体のようすです。
        </p>
      </div>

      {/* 表示切替カード (オーナーモード時のみ) */}
      {isOwner && counselors.length > 0 && (
        <div className="kc-card" style={{ padding: 18, marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-mid)',
                whiteSpace: 'nowrap',
                letterSpacing: '.04em',
              }}
            >
              今表示中
            </span>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <select
                className="kc-select"
                value={scopeKey}
                onChange={(e) => setScopeKey(e.target.value)}
                style={{ paddingRight: 36 }}
              >
                <option value="all">{`${displayName}・全体のようす`}</option>
                {counselors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} さん
                  </option>
                ))}
              </select>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--text-mid)',
                }}
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Link
              href="/profile"
              className="kc-btn kc-btn-ghost kc-btn-sm"
              style={{ textDecoration: 'none' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 2v8M2 6h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              カウンセラーを追加
            </Link>
          </div>
        </div>
      )}

      {/* スコープ表示インジケータ (本人モード時) */}
      {!isOwner && (
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-mid)',
            marginBottom: 16,
          }}
        >
          {scopeLabel}
        </p>
      )}

      {/* 統計カード 4枚 */}
      {filteredStats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <StatCard
            label="リール公開状況"
            value={`${filteredStats.reelPublished}`}
            unit={`/ ${filteredStats.reelTotal}名`}
            sub={reelSub}
            href="/reel"
          />
          <StatCard
            label="今月の予約"
            value={String(filteredStats.reservationsThisMonth)}
            sub={resSub}
            href="/calendar"
          />
          <StatCard
            label="未返信レビュー"
            value={String(filteredStats.unrepliedReviews)}
            sub={reviewSub}
            urgent={filteredStats.unrepliedLow > 0}
            href="/reviews"
          />
          <StatCard
            label="平均評価"
            value={filteredStats.avgRating != null ? String(filteredStats.avgRating) : '—'}
            sub={ratingSub}
            href="/reviews"
          />
        </div>
      )}

      {/* ちいさな「しなきゃ」 */}
      {todos.length > 0 && (
        <div className="kc-card" style={{ padding: 18, marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 14,
              padding: '0 4px',
            }}
          >
            <h2
              className="section-title"
              style={{
                fontSize: 17,
                margin: 0,
              }}
            >
              ちいさな「しなきゃ」
            </h2>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'DM Sans, sans-serif',
                color: 'var(--text-mid)',
              }}
            >
              {todos.length}件
            </span>
          </div>

          <div>
            {todos.map((t, i) => (
              <TodoRow key={i} item={t} divider={i < todos.length - 1} />
            ))}
          </div>
        </div>
      )}

      {/* クイックアクション */}
      <div className="kc-card" style={{ padding: '18px 20px' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>
          QUICK ACTION
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <QuickBtn href="/reviews" label="レビューに返信する" />
          <QuickBtn href="/reel" label="リールを編集する" />
          <QuickBtn href="/calendar" label="予約枠を追加する" />
          <QuickBtn href="/profile" label="プロフィールを更新する" />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  unit,
  sub,
  href,
  urgent,
}: {
  label: string
  value: string
  unit?: string
  sub?: string
  href: string
  urgent?: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '16px 16px 14px',
        display: 'block',
        boxShadow: 'var(--sh-sm)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-mid)',
          marginBottom: 8,
          letterSpacing: '.02em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            fontSize: 30,
            lineHeight: 1,
            color: urgent ? 'var(--danger)' : 'var(--text-deep)',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 12,
              color: 'var(--text-mid)',
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: urgent ? 'var(--danger)' : 'var(--text-light)',
          }}
        >
          {sub}
        </div>
      )}
    </Link>
  )
}

function TodoRow({ item, divider }: { item: TodoItem; divider: boolean }) {
  const cat = CATEGORY_META[item.category]
  return (
    <Link
      href={item.href}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '14px 6px',
        borderBottom: divider ? '1px solid var(--border)' : 'none',
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          padding: '4px 10px',
          borderRadius: 999,
          background: cat.bg,
          color: cat.color,
          whiteSpace: 'nowrap',
          letterSpacing: '.04em',
        }}
      >
        {cat.label}
      </span>
      <p
        style={{
          fontSize: 13,
          color: 'var(--text-deep)',
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {item.title}
      </p>
      <span
        style={{
          fontSize: 11,
          color: 'var(--accent-deep)',
          whiteSpace: 'nowrap',
          fontWeight: 500,
        }}
      >
        {item.cta} →
      </span>
    </Link>
  )
}

const CATEGORY_META: Record<
  TodoCategory,
  { label: string; bg: string; color: string }
> = {
  urgent: {
    label: '返信',
    bg: 'var(--danger-pale)',
    color: 'var(--danger)',
  },
  review: {
    label: '返信',
    bg: 'var(--accent-pale)',
    color: 'var(--accent-deep)',
  },
  booking: {
    label: '予約',
    bg: 'var(--success-pale)',
    color: 'var(--success)',
  },
  tip: {
    label: '推奨',
    bg: 'var(--warning-pale)',
    color: 'var(--warning)',
  },
}

function QuickBtn({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        padding: '8px 14px',
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
        borderRadius: 50,
        fontSize: 12,
        color: 'var(--text)',
      }}
    >
      {label}
    </Link>
  )
}
