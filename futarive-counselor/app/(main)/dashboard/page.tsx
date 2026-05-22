'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AddCounselorModal from '@/components/dashboard/AddCounselorModal'
import PendingCompletionsRows from '@/components/dashboard/PendingCompletionsSection'
import UpcomingReservationsSection from '@/components/dashboard/UpcomingReservationsSection'
import NotificationSettingsCard from '@/components/shared/NotificationSettingsCard'
import { daysSince, FRESHNESS_AGING_DAYS, FRESHNESS_STALE_DAYS } from '@/lib/freshness'
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

type TodoType = 'urgent' | 'reply' | 'booking' | 'rec' | 'profile-aging' | 'profile-stale'
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

function todoTag(type: TodoType): { label: string; className?: string; style?: React.CSSProperties } {
  if (type === 'urgent' || type === 'reply') return { label: '返信', className: `todo-tag todo-tag-${type}` }
  if (type === 'booking') return { label: '予約', className: 'todo-tag todo-tag-booking' }
  if (type === 'rec') return { label: '推奨', className: 'todo-tag todo-tag-rec' }
  if (type === 'profile-stale') {
    return {
      label: '要更新',
      style: {
        background: '#FEE2E2', color: '#B91C1C', fontSize: 10, fontWeight: 700,
        padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
      },
    }
  }
  // profile-aging
  return {
    label: '点検',
    style: {
      background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700,
      padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap',
    },
  }
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
  const [pendingCount, setPendingCount] = useState(0)
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

    // 直近 7 日の active reservations を取得（todo 生成用）
    const nowIso = new Date().toISOString()
    const sevenDaysIso = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: upcomingRows } = await supabase
      .from('reservations')
      .select('id, start_at, notes, agency_message, shared_kinda_type_key, shared_kinda_note_key')
      .in('counselor_id', ids)
      .eq('status', 'active')
      .gte('start_at', nowIso)
      .lte('start_at', sevenDaysIso)

    type UR = { id: string; start_at: string | null; notes: string | null; agency_message: string | null; shared_kinda_type_key: string | null; shared_kinda_note_key: string | null }
    const upcoming = (upcomingRows as UR[] | null) ?? []

    // 今日・明日・直近の予約 をカウント。
    // 「ちいさなしなきゃ」は『今日と明日の予定』『未返信質問』『近日の事前共有あり』を全部見えるように。
    const now2 = new Date()
    const todayStart = new Date(now2)
    todayStart.setHours(0, 0, 0, 0)
    const tomorrow = new Date(todayStart)
    tomorrow.setDate(todayStart.getDate() + 1)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(tomorrow.getDate() + 1)
    const todayCount = upcoming.filter((r) => {
      if (!r.start_at) return false
      const t = new Date(r.start_at).getTime()
      return t >= todayStart.getTime() && t < tomorrow.getTime()
    }).length
    const tomorrowCount = upcoming.filter((r) => {
      if (!r.start_at) return false
      const t = new Date(r.start_at).getTime()
      return t >= tomorrow.getTime() && t < dayAfter.getTime()
    }).length
    const needsReplyCount = upcoming.filter(
      (r) => r.notes && r.notes.trim().length > 0 && !r.agency_message,
    ).length
    // 今日も明日もない場合でも「直近 N 件の予約」表示は出す
    const upcomingTotalCount = upcoming.length

    const reviews = (reviewRows ?? []) as { id: string; rating: number; agency_reply: string | null }[]
    const unreplied = reviews.filter(r => !r.agency_reply)
    const unrepliedLow = unreplied.filter(r => r.rating <= 3)
    const ratings = reviews.map(r => r.rating)
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null

    // Todo 生成
    const newTodos: TodoItem[] = []

    // ─── 予約系（最優先）— ユーザー満足度に直結するため上位に積む ───
    // 1) 質問付き未返信予約（最重要・要返信）— 事前に伝えたいことに記述あり & 未返信
    if (needsReplyCount > 0) {
      newTodos.push({
        type: 'urgent',
        label: `予約者からの質問が${needsReplyCount}件未返信です — 24時間以内のご対応を`,
        action: '予約を見る →',
        href: '/calendar',
      })
    }
    // 2) 今日の面談リマインダー
    if (todayCount > 0) {
      newTodos.push({
        type: 'booking',
        label: `今日の面談が${todayCount}件あります — 開始前に共有された Kinda 結果に目を通してください`,
        action: 'カレンダーで確認 →',
        href: '/calendar',
      })
    }
    // 3) 明日の面談リマインダー
    if (tomorrowCount > 0) {
      newTodos.push({
        type: 'booking',
        label: `明日の面談が${tomorrowCount}件あります — 事前に Kinda note / type を確認しておきましょう`,
        action: 'カレンダーで確認 →',
        href: '/calendar',
      })
    }
    // 4) 今日も明日もないが、7日以内に予約がある場合のソフトリマインダー
    if (todayCount === 0 && tomorrowCount === 0 && upcomingTotalCount > 0) {
      newTodos.push({
        type: 'rec',
        label: `今後7日以内に${upcomingTotalCount}件の面談予定があります`,
        action: 'カレンダーを開く →',
        href: '/calendar',
      })
    }

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

    // ─── プロフィール鮮度（updated_at ベース） ───
    // 30〜90日 → aging（点検）/ 90日以上 → stale（赤・要更新）
    // 30日未満はプロフィール確認ページに控えめ表示するため、ここには出さない
    let agingCount = 0
    let staleCount = 0
    filtered.forEach(c => {
      const d = daysSince(c.updated_at)
      if (d === null) return
      if (d >= FRESHNESS_STALE_DAYS) staleCount++
      else if (d >= FRESHNESS_AGING_DAYS) agingCount++
    })
    if (staleCount > 0) {
      newTodos.push({
        type: 'profile-stale',
        label: staleCount > 1
          ? `${staleCount}件のプロフィールが${FRESHNESS_STALE_DAYS}日以上更新されていません`
          : `プロフィールが${FRESHNESS_STALE_DAYS}日以上更新されていません`,
        action: 'プロフィールを更新 →',
        href: '/profile',
      })
    }
    if (agingCount > 0) {
      newTodos.push({
        type: 'profile-aging',
        label: agingCount > 1
          ? `${agingCount}件のプロフィールが${FRESHNESS_AGING_DAYS}日以上更新されていません`
          : `プロフィールが${FRESHNESS_AGING_DAYS}日以上更新されていません`,
        action: '内容を見直す →',
        href: '/profile',
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

      {/* K-5: ブラウザ通知 設定カード */}
      <div style={{ marginTop: 20 }}>
        <NotificationSettingsCard />
      </div>

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

      {/* これからの面談（前日リマインダー + 直近 7 日）— context に応じてフィルタ */}
      <UpcomingReservationsSection
        scopedCounselors={
          context === ALL_SENTINEL
            ? counselors
            : counselors.filter((c) => c.id === context)
        }
      />

      {/* ちいさな「しなきゃ」 — 面談完了待ち + 通常の todo を同一カードに集約 */}
      <div className="todo-card">
        <div className="todo-head">
          <span className="todo-head-title">ちいさな「しなきゃ」</span>
          <span className="todo-head-count">{todos.length + pendingCount}件</span>
        </div>

        {/* 面談完了待ち（先頭：押せばその場で完了マーク。
            0 件のときはコンポーネント側で何も描画しないが、件数フェッチは行う） */}
        <PendingCompletionsRows
          scopedCounselors={counselors}
          onCountChange={setPendingCount}
        />

        {/* 既存の todo */}
        {todos.map((t, i) => {
          const tag = todoTag(t.type)
          return (
          <Link
            key={i}
            href={t.href}
            className={`todo-row ${t.type === 'profile-stale' ? 'todo-row-stale' : ''}`}
            style={t.type === 'profile-stale' ? { border: '1px solid #DC2626' } : undefined}
          >
            <span
              className={tag.className ?? `todo-tag todo-tag-${t.type}`}
              style={tag.style}
            >
              {tag.label}
            </span>
            <span
              className="todo-body"
              style={t.type === 'profile-stale' ? { color: '#B91C1C', fontWeight: 600 } : undefined}
            >
              {t.label}
            </span>
            <span className="todo-action">{t.action}</span>
          </Link>
        )})}

        {/* どちらも 0 件のときのヒント */}
        {todos.length === 0 && pendingCount === 0 && (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8 }}>
              今日の「しなきゃ」はありません。<br/>
              プロフィールやリールを整えてみませんか？
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
