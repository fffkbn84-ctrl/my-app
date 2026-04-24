'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Agency } from '@/lib/types'

interface Stats {
  reelPublished: number
  reelTotal: number
  reservationsThisMonth: number
  unrepliedReviews: number
  avgRating: number | null
}

interface TodoItem {
  type: 'urgent' | 'review' | 'booking'
  label: string
  sub: string
  href: string
}

function getDayString() {
  const d = new Date()
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | 'all'>('all')
  const [currentCounselorId, setCurrentCounselorId] = useState<string | 'all'>('all')
  const [displayName, setDisplayName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 相談所オーナーチェック
      const { data: agencyRows } = await supabase
        .from('agencies')
        .select('*')
        .eq('owner_user_id', user.id)

      const { data: ownCounselor } = await supabase
        .from('counselors')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle()

      const ownerMode = agencyRows && agencyRows.length > 0
      setIsOwner(!!ownerMode)
      setAgencies((agencyRows as Agency[]) ?? [])

      let scopedCounselors: Counselor[] = []
      if (ownerMode) {
        const { data: ac } = await supabase
          .from('counselors')
          .select('*')
          .in('agency_id', (agencyRows as Agency[]).map(a => a.id))
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadStats = async (supabase: any, scopedCounselors: Counselor[]) => {
    const ids = scopedCounselors.map(c => c.id)
    if (ids.length === 0) {
      setStats({ reelPublished: 0, reelTotal: 0, reservationsThisMonth: 0, unrepliedReviews: 0, avgRating: null })
      return
    }

    const reelPublished = scopedCounselors.filter(c => c.reel_enabled).length
    const reelTotal = scopedCounselors.length

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const { count: resCount } = await supabase
      .from('reservations')
      .select('id', { count: 'exact', head: true })
      .in('counselor_id', ids)
      .gte('created_at', monthStart)

    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('id, rating, agency_reply')
      .in('counselor_id', ids)
      .eq('is_published', true)

    const unreplied = (reviewRows ?? []).filter((r: { agency_reply: string | null }) => !r.agency_reply).length
    const ratings = (reviewRows ?? []).map((r: { rating: number }) => r.rating)
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
      : null

    // todos
    const newTodos: TodoItem[] = []
    const urgentReviews = (reviewRows ?? []).filter((r: { agency_reply: string | null; rating: number }) => !r.agency_reply && r.rating <= 3)
    if (urgentReviews.length > 0) {
      newTodos.push({ type: 'urgent', label: `★3以下の未返信が${urgentReviews.length}件`, sub: '早めの返信がおすすめです', href: '/reviews' })
    }
    const normalReviews = (reviewRows ?? []).filter((r: { agency_reply: string | null; rating: number }) => !r.agency_reply && r.rating >= 4)
    if (normalReviews.length > 0) {
      newTodos.push({ type: 'review', label: `未返信のレビューが${normalReviews.length}件`, sub: '感謝の返信を届けましょう', href: '/reviews' })
    }
    const needReel = scopedCounselors.filter(c => !c.reel_enabled)
    if (needReel.length > 0) {
      newTodos.push({ type: 'booking', label: 'リールを公開していないカウンセラーがいます', sub: 'リール画像を追加して集客しましょう', href: '/reel' })
    }
    setTodos(newTodos)
    setStats({ reelPublished, reelTotal, reservationsThisMonth: resCount ?? 0, unrepliedReviews: unreplied, avgRating })
  }

  if (loading) {
    return (
      <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-mid)' }}>
        <div style={{ width: 18, height: 18, border: '2px solid var(--border-mid)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
        読み込み中...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 28px', maxWidth: 900 }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{getDayString()}</div>
        <h1 className="page-title">
          おかえりなさい、{displayName} さん
        </h1>
        {isOwner && counselors.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-mid)' }}>表示切替：</span>
            {agencies.map(ag => (
              <button
                key={ag.id}
                onClick={() => setSelectedAgencyId(ag.id)}
                className="kc-btn kc-btn-ghost kc-btn-sm"
                style={selectedAgencyId === ag.id ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
              >
                {ag.name}
              </button>
            ))}
            {counselors.map(c => (
              <button
                key={c.id}
                onClick={() => setCurrentCounselorId(c.id)}
                className="kc-btn kc-btn-ghost kc-btn-sm"
                style={currentCounselorId === c.id ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 統計カード */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          <StatCard
            value={`${stats.reelPublished}/${stats.reelTotal}`}
            label="リール公開カウンセラー"
            icon={<ReelIcon />}
            href="/reel"
          />
          <StatCard
            value={String(stats.reservationsThisMonth)}
            label="今月の予約"
            icon={<CalIcon />}
            href="/calendar"
          />
          <StatCard
            value={String(stats.unrepliedReviews)}
            label="未返信レビュー"
            icon={<MsgIcon />}
            href="/reviews"
            urgent={stats.unrepliedReviews > 0}
          />
          <StatCard
            value={stats.avgRating !== null ? String(stats.avgRating) : '—'}
            label="平均評価"
            icon={<StarIcon />}
            href="/reviews"
          />
        </div>
      )}

      {/* ちいさな「しなきゃ」 */}
      {todos.length > 0 && (
        <div className="kc-card" style={{ padding: '20px 22px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v6l3 3" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="7" cy="7" r="6" stroke="var(--accent)" strokeWidth="1.3"/>
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-deep)', fontFamily: 'Shippori Mincho, serif' }}>
              ちいさな「しなきゃ」
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todos.map((t, i) => (
              <Link key={i} href={t.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: 'var(--bg-elev)',
                  borderRadius: 10,
                  transition: 'background .15s',
                }}>
                  <span className={`kc-badge kc-badge-${t.type}`}>{t.type === 'urgent' ? '急ぎ' : t.type === 'review' ? 'レビュー' : '推奨'}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-deep)' }}>{t.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-mid)', marginTop: 2 }}>{t.sub}</div>
                  </div>
                  <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="var(--text-light)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* クイックアクション */}
      <div className="kc-card" style={{ padding: '20px 22px' }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>QUICK ACTION</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <QuickBtn href="/reviews" label="レビューに返信する" />
          <QuickBtn href="/reel" label="リールを編集する" />
          <QuickBtn href="/calendar" label="予約枠を追加する" />
          <QuickBtn href="/profile" label="プロフィールを更新する" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, icon, href, urgent }: { value: string; label: string; icon: React.ReactNode; href: string; urgent?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="stat-card" style={urgent ? { borderColor: 'var(--danger)' } : {}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ color: urgent ? 'var(--danger)' : 'var(--accent)', opacity: .8 }}>{icon}</div>
        </div>
        <div className="stat-value" style={urgent ? { color: 'var(--danger)' } : {}}>{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </Link>
  )
}

function QuickBtn({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '9px 16px',
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
        borderRadius: 50,
        fontSize: '12px',
        color: 'var(--text)',
        transition: 'background .15s, border-color .15s',
        cursor: 'pointer',
      }}>{label}</div>
    </Link>
  )
}

function ReelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
    </svg>
  )
}
function CalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 2v4M14 2v4M2 9h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}
function MsgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8l-4 3V14H4a1 1 0 0 1-1-1V4Z" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}
function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2.4 5H18l-4.4 3.2 1.7 5.2L10 12.5l-5.3 2.9 1.7-5.2L2 7h5.6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}
