'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AddCounselorModal from '@/components/dashboard/AddCounselorModal'
import type { Counselor, Agency } from '@/lib/types'

interface Stats {
  reelPublished: number
  reelTotal: number
  reservationsThisMonth: number
  reservationsLastMonth: number
  unrepliedReviews: number
  unrepliedLowRating: number
  avgRating: number | null
  totalReviews: number
}

type TodoType = 'urgent' | 'reply' | 'booking' | 'rec'
interface TodoItem {
  type: TodoType
  label: string
  action: string
  href: string
}

function getDayString() {
  const d = new Date()
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`
}

const ALL_SENTINEL = 'ALL'
const CONTEXT_STORAGE_KEY = 'kinda-dashboard-context'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [context, setContextState] = useState<string>(ALL_SENTINEL) // ALL | counselor_id
  const [displayName, setDisplayName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAddCounselor, setShowAddCounselor] = useState(false)

  // localStorage に永続化するラッパー
  const setContext = (next: string) => {
    setContextState(next)
    try {
      if (next === ALL_SENTINEL) localStorage.removeItem(CONTEXT_STORAGE_KEY)
      else localStorage.setItem(CONTEXT_STORAGE_KEY, next)
    } catch {}
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: agencyRows } = await supabase
        .from('agencies').select('*').eq('owner_user_id', user.id)
      const { data: ownCounselor } = await supabase
        .from('counselors').select('*').eq('owner_user_id', user.id).maybeSingle()

      const ownerMode = !!(agencyRows && agencyRows.length > 0)
      setIsOwner(ownerMode)
      setAgencies((agencyRows as Agency[]) ?? [])

      let scoped: Counselor[] = []
      if (ownerMode) {
        const { data: ac } = await supabase
          .from('counselors').select('*')
          .in('agency_id', (agencyRows as Agency[]).map(a => a.id))
        scoped = (ac as Counselor[]) ?? []
        const firstAg = (agencyRows as Agency[])[0]
        setDisplayName(firstAg?.name ?? '')
        setAgencyName(firstAg?.name ?? '')
      } else if (ownCounselor) {
        scoped = [ownCounselor as Counselor]
        setDisplayName((ownCounselor as Counselor).name)
      }
      setCounselors(scoped)

      // 前回選択していたコンテキストを復元（該当カウンセラーが残っている場合のみ）
      let initialContext = ALL_SENTINEL
      try {
        const stored = localStorage.getItem(CONTEXT_STORAGE_KEY)
        if (stored && scoped.some(c => c.id === stored)) {
          initialContext = stored
        }
      } catch {}
      setContextState(initialContext)

      await loadStats(supabase, scoped, initialContext)
      setLoading(false)
    }
    load()
  }, [])

  // カウンセラー追加後の再読み込み
  const reloadCounselors = async () => {
    const supabase = createClient()
    if (agencies.length === 0) return
    const { data } = await supabase
      .from('counselors').select('*')
      .in('agency_id', agencies.map(a => a.id))
    const next = (data as Counselor[]) ?? []
    setCounselors(next)
    await loadStats(supabase, next, context)
  }

  useEffect(() => {
    if (counselors.length === 0) return
    const supabase = createClient()
    void loadStats(supabase, counselors, context)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  const loadStats = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    scopedCounselors: Counselor[],
    ctx: string,
  ) => {
    const filtered = ctx === ALL_SENTINEL
      ? scopedCounselors
      : scopedCounselors.filter(c => c.id === ctx)
    const ids = filtered.map(c => c.id)

    if (ids.length === 0) {
      setStats({
        reelPublished: 0, reelTotal: 0,
        reservationsThisMonth: 0, reservationsLastMonth: 0,
        unrepliedReviews: 0, unrepliedLowRating: 0,
        avgRating: null, totalReviews: 0,
      })
      setTodos([])
      return
    }

    const reelPublished = filtered.filter(c => c.reel_enabled).length
    const reelTotal = filtered.length

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [{ count: thisMonthCount }, { count: lastMonthCount }] = await Promise.all([
      supabase.from('reservations').select('id', { count: 'exact', head: true })
        .in('counselor_id', ids).gte('created_at', thisMonthStart),
      supabase.from('reservations').select('id', { count: 'exact', head: true })
        .in('counselor_id', ids).gte('created_at', lastMonthStart).lt('created_at', lastMonthEnd),
    ])

    const { data: reviewRows } = await supabase
      .from('reviews').select('id, rating, agency_reply')
      .in('counselor_id', ids).eq('is_published', true)

    const reviews = (reviewRows ?? []) as { id: string; rating: number; agency_reply: string | null }[]
    const unreplied = reviews.filter(r => !r.agency_reply)
    const unrepliedLow = unreplied.filter(r => r.rating <= 3)
    const ratings = reviews.map(r => r.rating)
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null

    // Todo 生成
    const newTodos: TodoItem[] = []
    unrepliedLow.slice(0, 1).forEach(r => {
      newTodos.push({
        type: 'urgent',
        label: `★${r.rating}のレビュー — 誠実な返信を書きましょう`,
        action: '返信する →',
        href: '/reviews',
      })
    })
    const unrepliedHigh = unreplied.filter(r => r.rating >= 4).slice(0, 1)
    unrepliedHigh.forEach(r => {
      newTodos.push({
        type: 'reply',
        label: `★${r.rating}のレビュー — 感謝を伝えるチャンス`,
        action: '返信する →',
        href: '/reviews',
      })
    })
    if (reelTotal > 0 && reelPublished < reelTotal) {
      newTodos.push({
        type: 'rec',
        label: `リール未公開のカウンセラーが${reelTotal - reelPublished}名います`,
        action: 'リールを編集 →',
        href: '/reel',
      })
    }

    setTodos(newTodos)
    setStats({
      reelPublished, reelTotal,
      reservationsThisMonth: thisMonthCount ?? 0,
      reservationsLastMonth: lastMonthCount ?? 0,
      unrepliedReviews: unreplied.length,
      unrepliedLowRating: unrepliedLow.length,
      avgRating, totalReviews: reviews.length,
    })
  }

  if (loading) {
    return (
      <div style={{ padding: 32, color: 'var(--text-mid)' }}>
        読み込み中...
      </div>
    )
  }

  const reservationDiff = stats
    ? stats.reservationsThisMonth - stats.reservationsLastMonth
    : 0

  return (
    <div style={{ padding: '24px 20px', paddingBottom: 100, maxWidth: 960 }}>
      <div className="dash-eyebrow">DASHBOARD</div>
      <h1 className="dash-hero">
        おかえりなさい、{displayName || 'あなた'} さん
      </h1>
      <p className="dash-sub">
        今日 · {getDayString()}。{isOwner ? 'あなたの相談所の全体のようすです。' : '今日のあなたのようすです。'}
      </p>

      {/* コンテキストカード：オーナーのみ */}
      {isOwner && counselors.length > 0 && (
        <div className="ctx-card">
          <div className="ctx-label">今表示中</div>
          <div className="ctx-select-wrap">
            <select
              className="ctx-select"
              value={context}
              onChange={e => setContext(e.target.value)}
            >
              <option value={ALL_SENTINEL}>{agencyName || '相談所'}・全体のようす</option>
              {counselors.map(c => (
                <option key={c.id} value={c.id}>{c.name} さんのようす</option>
              ))}
            </select>
            <svg className="ctx-select-caret" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="ctx-add" onClick={() => router.push('/agency')}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10V4l4-3 4 3v6M5 10V7h2v3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              相談所プロフィールを編集
            </button>
            <button className="ctx-add" onClick={() => setShowAddCounselor(true)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M1.5 10c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M9 4v3M7.5 5.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              カウンセラーを追加
            </button>
          </div>
        </div>
      )}

      {showAddCounselor && (
        <AddCounselorModal
          agencies={agencies}
          onClose={() => setShowAddCounselor(false)}
          onCreated={reloadCounselors}
        />
      )}

      {/* 統計カード（2列） */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 8,
        }}>
          <Link href="/reel" className="stat-big" style={{ textDecoration: 'none' }}>
            <div className="stat-big-label">リール公開状況</div>
            <div className="stat-big-value">
              {stats.reelPublished}
              <span className="unit">/ {stats.reelTotal}名</span>
            </div>
            <div className="stat-big-sub">
              {stats.reelTotal > 0 && stats.reelPublished === stats.reelTotal
                ? 'すべて公開中'
                : `${stats.reelTotal - stats.reelPublished}名が未公開`}
            </div>
          </Link>

          <Link href="/calendar" className="stat-big" style={{ textDecoration: 'none' }}>
            <div className="stat-big-label">今月の予約</div>
            <div className="stat-big-value">{stats.reservationsThisMonth}</div>
            <div className="stat-big-sub">
              先月比 {reservationDiff >= 0 ? '+' : ''}{reservationDiff}
            </div>
          </Link>

          <Link href="/reviews" className={`stat-big${stats.unrepliedReviews > 0 ? ' urgent' : ''}`} style={{ textDecoration: 'none' }}>
            <div className="stat-big-label">未返信レビュー</div>
            <div className="stat-big-value">{stats.unrepliedReviews}</div>
            <div className="stat-big-sub">
              {stats.unrepliedLowRating > 0
                ? `うち${stats.unrepliedLowRating}件は低評価`
                : stats.unrepliedReviews === 0 ? 'すべて返信済み' : '返信をお願いします'}
            </div>
          </Link>

          <Link href="/reviews" className="stat-big" style={{ textDecoration: 'none' }}>
            <div className="stat-big-label">平均評価</div>
            <div className="stat-big-value">{stats.avgRating !== null ? stats.avgRating : '—'}</div>
            <div className="stat-big-sub">
              {stats.totalReviews > 0 ? `口コミ ${stats.totalReviews}件から` : 'まだ口コミがありません'}
            </div>
          </Link>
        </div>
      )}

      {/* ちいさな「しなきゃ」 */}
      {todos.length > 0 && (
        <div className="todo-card">
          <div className="todo-head">
            <span className="todo-head-title">ちいさな「しなきゃ」</span>
            <span className="todo-head-count">{todos.length}件</span>
          </div>
          {todos.map((t, i) => (
            <Link key={i} href={t.href} className="todo-row">
              <span className={`todo-tag todo-tag-${t.type}`}>
                {t.type === 'urgent' ? '返信' : t.type === 'reply' ? '返信' : t.type === 'booking' ? '予約' : '推奨'}
              </span>
              <span className="todo-body">{t.label}</span>
              <span className="todo-action">{t.action}</span>
            </Link>
          ))}
        </div>
      )}

      {todos.length === 0 && (
        <div className="todo-card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
            今日の「しなきゃ」はありません。<br/>
            プロフィールやリールを整えてみませんか？
          </div>
        </div>
      )}
    </div>
  )
}
