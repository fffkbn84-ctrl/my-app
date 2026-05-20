'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ReviewRow {
  id: string
  counselor_id: string | null
  reservation_id: string | null
  rating: number
  body: string
  source_type: 'face_to_face' | 'proxy'
  is_published: boolean
  reviewer_age_range: string | null
  reviewer_gender: string | null
  reviewer_area: string | null
  created_at: string
}

interface ReservationRow {
  id: string
  counselor_id: string | null
  slot_id: string | null
  user_name: string
  user_email: string
  review_token_used: boolean
  created_at: string
}

type PendingReview = ReviewRow & { counselor_name: string }
type RecentReservation = ReservationRow & { counselor_name: string; start_at: string | null }

type ActionRequired = {
  pendingReviews: number
  disputedBilling: number
  urgent24h: number
}

type KpiStats = {
  thisMonthReservations: number
  lastMonthReservations: number
  thisMonthBilling: number
  lastMonthBilling: number
  totalReviews: number
  publishedCounselors: number
  totalCounselors: number
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: 13 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`

export default function DashboardPage() {
  const [action, setAction] = useState<ActionRequired>({ pendingReviews: 0, disputedBilling: 0, urgent24h: 0 })
  const [kpi, setKpi] = useState<KpiStats>({
    thisMonthReservations: 0,
    lastMonthReservations: 0,
    thisMonthBilling: 0,
    lastMonthBilling: 0,
    totalReviews: 0,
    publishedCounselors: 0,
    totalCounselors: 0,
  })
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

    const [
      pendingReviewsCount,
      disputedBillingCount,
      urgent24hCount,
      thisMonthResCount,
      lastMonthResCount,
      thisMonthBillingData,
      lastMonthBillingData,
      totalReviewsCount,
      publishedCounselorsCount,
      totalCounselorsCount,
      reviewsList,
      reservationsList,
    ] = await Promise.all([
      supabase.from('reviews').select('*', { count: 'exact', head: true })
        .eq('is_published', false).eq('source_type', 'face_to_face'),
      supabase.from('billing_events').select('*', { count: 'exact', head: true })
        .eq('status', 'disputed'),
      supabase.from('reservations').select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lt('created_at', past24h)
        .is('agency_message_at', null)
        .not('notes', 'is', null),
      supabase.from('reservations').select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart)
        .in('status', ['active', 'completed']),
      supabase.from('reservations').select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart).lt('created_at', thisMonthStart)
        .in('status', ['active', 'completed']),
      supabase.from('billing_events').select('amount_jpy')
        .eq('status', 'confirmed').gte('confirmed_at', thisMonthStart),
      supabase.from('billing_events').select('amount_jpy')
        .eq('status', 'confirmed').gte('confirmed_at', lastMonthStart).lt('confirmed_at', thisMonthStart),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('counselors').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('counselors').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*, counselors(name)')
        .eq('is_published', false).eq('source_type', 'face_to_face')
        .order('created_at', { ascending: false }).limit(5),
      supabase.from('reservations').select('*, counselors(name), slots(start_at)')
        .order('created_at', { ascending: false }).limit(5),
    ])

    setAction({
      pendingReviews: pendingReviewsCount.count ?? 0,
      disputedBilling: disputedBillingCount.count ?? 0,
      urgent24h: urgent24hCount.count ?? 0,
    })

    const sumAmount = (rows: { amount_jpy: number }[] | null) =>
      (rows ?? []).reduce((a, r) => a + (r.amount_jpy ?? 0), 0)

    setKpi({
      thisMonthReservations: thisMonthResCount.count ?? 0,
      lastMonthReservations: lastMonthResCount.count ?? 0,
      thisMonthBilling: sumAmount(thisMonthBillingData.data as { amount_jpy: number }[] | null),
      lastMonthBilling: sumAmount(lastMonthBillingData.data as { amount_jpy: number }[] | null),
      totalReviews: totalReviewsCount.count ?? 0,
      publishedCounselors: publishedCounselorsCount.count ?? 0,
      totalCounselors: totalCounselorsCount.count ?? 0,
    })

    setPendingReviews(
      (reviewsList.data ?? []).map((r: Record<string, unknown>) => ({
        ...r,
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
      })) as PendingReview[]
    )

    setRecentReservations(
      (reservationsList.data ?? []).map((r: Record<string, unknown>) => ({
        ...r,
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
        start_at: (r.slots as { start_at?: string } | null)?.start_at ?? null,
      })) as RecentReservation[]
    )

    setLoading(false)
  }

  async function approveReview(id: string) {
    const supabase = createClient()
    await supabase.from('reviews').update({ is_published: true }).eq('id', id)
    loadData()
  }

  async function rejectReview(id: string) {
    if (!confirm('この口コミを削除しますか？')) return
    const supabase = createClient()
    await supabase.from('reviews').delete().eq('id', id)
    loadData()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ダッシュボード</h1>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'DM Sans' }}>
          {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* ① 要対応 */}
      <SectionLabel>要対応</SectionLabel>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <ActionCard
          label="承認待ち口コミ"
          count={action.pendingReviews}
          href="/admin/reviews"
        />
        <ActionCard
          label="課金 異議申立中"
          count={action.disputedBilling}
          href="/admin/billing"
        />
        <ActionCard
          label="24h 未連絡の予約"
          count={action.urgent24h}
          href="/admin/reservations"
          hint="質問あり・カウンセラー未連絡"
        />
      </div>

      {/* ② 主要KPI */}
      <SectionLabel>今月のKPI</SectionLabel>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        <KpiCard
          label="今月の予約成立"
          value={`${kpi.thisMonthReservations}件`}
          delta={kpi.thisMonthReservations - kpi.lastMonthReservations}
          deltaLabel={`先月 ${kpi.lastMonthReservations}件`}
        />
        <KpiCard
          label="今月の確定課金"
          value={yen(kpi.thisMonthBilling)}
          delta={kpi.thisMonthBilling - kpi.lastMonthBilling}
          deltaLabel={`先月 ${yen(kpi.lastMonthBilling)}`}
          isCurrency
        />
        <KpiCard
          label="累計口コミ"
          value={`${kpi.totalReviews}件`}
        />
        <KpiCard
          label="掲載カウンセラー"
          value={`${kpi.publishedCounselors} / ${kpi.totalCounselors}名`}
          deltaLabel={
            kpi.totalCounselors > 0
              ? `掲載率 ${Math.round((kpi.publishedCounselors / kpi.totalCounselors) * 100)}%`
              : undefined
          }
        />
      </div>

      {/* ③ クイックアクション */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--ink)' }}>クイックアクション</div>
        <div className="quick-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link href="/admin/reviews" className="btn btn-ghost btn-sm">口コミ承認</Link>
          <Link href="/admin/reviews/new" className="btn btn-primary btn-sm">新規代理入力</Link>
          <Link href="/admin/slots" className="btn btn-ghost btn-sm">スロット追加</Link>
          <Link href="/admin/episodes" className="btn btn-ghost btn-sm">Kinda story 追加</Link>
          <Link href="/admin/billing" className="btn btn-ghost btn-sm">課金管理</Link>
        </div>
      </div>

      {/* ④ 承認待ち口コミ */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>承認待ち口コミ（最新5件）</div>
          <Link href="/admin/reviews" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>すべて見る →</Link>
        </div>
        {pendingReviews.length === 0 ? (
          <div className="empty-state">承認待ちの口コミはありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>投稿者</th>
                  <th>カウンセラー</th>
                  <th>評価</th>
                  <th>本文</th>
                  <th>投稿日</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {[r.reviewer_age_range, r.reviewer_gender, r.reviewer_area].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{r.counselor_name}</td>
                    <td><StarRating rating={r.rating} /></td>
                    <td style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.body}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {new Date(r.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => approveReview(r.id)} className="btn btn-sm" style={{ background: '#DCFCE7', color: '#166534', border: 'none', gap: 4 }}>
                          <IconCheck /> 承認
                        </button>
                        <button onClick={() => rejectReview(r.id)} className="btn btn-danger btn-sm">
                          <IconX />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ⑤ 最近の予約 */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>最近の予約（最新5件）</div>
          <Link href="/admin/reservations" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>すべて見る →</Link>
        </div>
        {recentReservations.length === 0 ? (
          <div className="empty-state">予約データがありません</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>面談日時</th>
                  <th>ユーザー名</th>
                  <th>メール</th>
                  <th>カウンセラー</th>
                  <th>口コミ済み</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: 12 }}>
                      {r.start_at ? new Date(r.start_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{r.user_name}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{r.user_email}</td>
                    <td style={{ fontSize: 13 }}>{r.counselor_name}</td>
                    <td>
                      <span className={r.review_token_used ? 'badge badge-published' : 'badge badge-draft'}>
                        {r.review_token_used ? '済み' : '未'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 600,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--muted)',
      marginBottom: 10,
      marginTop: 4,
    }}>{children}</div>
  )
}

function ActionCard({
  label,
  count,
  href,
  hint,
}: {
  label: string
  count: number
  href: string
  hint?: string
}) {
  const isActive = count > 0
  return (
    <Link
      href={href}
      style={{
        background: isActive ? '#FEF3E2' : 'var(--surface)',
        border: `1px solid ${isActive ? '#F59E0B' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '14px 16px',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={(e) => {
        if (isActive) e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,158,11,.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Sans', letterSpacing: '.06em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 700,
          fontSize: 28,
          color: isActive ? '#C2410C' : 'var(--muted)',
          lineHeight: 1,
        }}>{count}</span>
        <span style={{ fontSize: 12, color: isActive ? '#C2410C' : 'var(--muted)' }}>
          {isActive ? '件' : '✓ なし'}
        </span>
      </div>
      {hint && (
        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{hint}</div>
      )}
      <div style={{
        marginTop: 'auto',
        paddingTop: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: isActive ? '#C2410C' : 'var(--muted)',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        管理画面へ <IconArrow />
      </div>
    </Link>
  )
}

function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  isCurrency,
}: {
  label: string
  value: string
  delta?: number
  deltaLabel?: string
  isCurrency?: boolean
}) {
  const hasDelta = delta !== undefined && delta !== 0
  const isUp = (delta ?? 0) > 0
  const deltaColor = !hasDelta ? 'var(--muted)' : isUp ? '#15803D' : '#DC2626'
  const deltaText = !hasDelta
    ? null
    : isCurrency
      ? `${isUp ? '+' : '−'}${yen(Math.abs(delta!))}`
      : `${isUp ? '+' : '−'}${Math.abs(delta!)}`

  return (
    <div className="stat-card">
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Sans', letterSpacing: '.06em', marginBottom: 8 }}>{label}</div>
      <div className="stat-value">{value}</div>
      {(deltaText || deltaLabel) && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {deltaText && (
            <span style={{
              fontSize: 12,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              color: deltaColor,
            }}>{deltaText}</span>
          )}
          {deltaLabel && (
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
