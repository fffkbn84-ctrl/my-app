'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logPersonalDataAccess } from '@/lib/supabase/audit'
import type { Review, Counselor } from '@/lib/types'
import ReviewCard from '@/components/reviews/ReviewCard'
import ReviewFilters, { type FilterType } from '@/components/reviews/ReviewFilters'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // スコープ内のカウンセラー取得
      const { data: ownC } = await supabase.from('counselors').select('*').eq('owner_user_id', user.id)
      const { data: agRows } = await supabase.from('agencies').select('id').eq('owner_user_id', user.id)
      let allCounselors: Counselor[] = (ownC as Counselor[]) ?? []
      if (agRows && agRows.length > 0) {
        const { data: agC } = await supabase
          .from('counselors')
          .select('*')
          .in('agency_id', agRows.map((a: { id: string }) => a.id))
        const extra = (agC as Counselor[]) ?? []
        const ids = new Set(allCounselors.map(c => c.id))
        allCounselors = [...allCounselors, ...extra.filter(c => !ids.has(c.id))]
      }
      setCounselors(allCounselors)

      if (allCounselors.length === 0) { setLoading(false); return }

      const { data: rv } = await supabase
        .from('reviews')
        .select('*')
        .in('counselor_id', allCounselors.map(c => c.id))
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      setReviews((rv as Review[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleReply = async (reviewId: string, reply: string) => {
    const supabase = createClient()

    // 既に返信済みの場合は拒否（二重送信防止）
    const { data: current } = await supabase
      .from('reviews')
      .select('agency_reply')
      .eq('id', reviewId)
      .maybeSingle()
    if (current?.agency_reply) {
      showToast('すでに返信済みです')
      return
    }

    const { error } = await supabase
      .from('reviews')
      .update({ agency_reply: reply, agency_replied_at: new Date().toISOString() })
      .eq('id', reviewId)
      .is('agency_reply', null)

    if (error) { showToast('返信に失敗しました'); return }

    setReviews(prev => prev.map(r =>
      r.id === reviewId ? { ...r, agency_reply: reply, agency_replied_at: new Date().toISOString() } : r
    ))
    setExpandedId(null)
    showToast('返信を送信しました')

    // 監査ログ
    const review = reviews.find(r => r.id === reviewId)
    if (review) await logPersonalDataAccess('reviews', reviewId, null)
  }

  const handleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
    // 個人情報閲覧ログ
    const review = reviews.find(r => r.id === id)
    if (review) logPersonalDataAccess('reviews', id, null)
  }

  // フィルタリング
  const filtered = reviews.filter(r => {
    if (filter === 'unreplied') return !r.agency_reply
    if (filter === 'high') return r.rating >= 4
    if (filter === 'low') return r.rating <= 3
    return true
  })

  const counts: Record<FilterType, number> = {
    all: reviews.length,
    unreplied: reviews.filter(r => !r.agency_reply).length,
    high: reviews.filter(r => r.rating >= 4).length,
    low: reviews.filter(r => r.rating <= 3).length,
  }

  // カウンセラー名をIDから引く
  const getCounselorName = (id: string) =>
    counselors.find(c => c.id === id)?.name ?? ''

  if (loading) return <div style={{ padding: 32, color: 'var(--text-mid)' }}>読み込み中...</div>

  return (
    <div style={{ padding: '28px 24px', maxWidth: 720, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>REVIEWS</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <h1 className="page-title">レビュー返信</h1>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          color: 'var(--text-mid)',
        }}>
          {reviews.length}件
        </span>
      </div>

      {/* フィルター */}
      <div style={{ marginBottom: 20 }}>
        <ReviewFilters current={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* 統計サマリー */}
      {reviews.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 16,
          padding: '14px 18px',
          background: 'var(--card-warm)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}>
          <SumItem
            label="平均評価"
            value={`★ ${(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}`}
          />
          <SumItem label="未返信" value={String(counts.unreplied)} urgent={counts.unreplied > 0} />
          <SumItem label="返信済み" value={String(reviews.length - counts.unreplied)} />
        </div>
      )}

      {/* レビュー一覧 */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 0',
          color: 'var(--text-light)',
          fontSize: 13,
        }}>
          該当するレビューはありません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(review => (
            <div key={review.id}>
              {counselors.length > 1 && (
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, paddingLeft: 2 }}>
                  {getCounselorName(review.counselor_id)}
                </div>
              )}
              <ReviewCard
                review={review}
                onReply={handleReply}
                onExpand={handleExpand}
                expanded={expandedId === review.id}
              />
            </div>
          ))}
        </div>
      )}

      {toast && <div className="kc-toast">{toast}</div>}
    </div>
  )
}

function SumItem({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 2 }}>{label}</div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 600,
        fontSize: 18,
        color: urgent ? 'var(--danger)' : 'var(--text-deep)',
      }}>{value}</div>
    </div>
  )
}
