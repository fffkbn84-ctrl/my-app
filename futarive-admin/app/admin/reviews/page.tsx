'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
interface ReviewRow {
  id: string
  counselor_id: string | null
  rating: number
  body: string
  source_type: 'face_to_face' | 'proxy'
  is_published: boolean
  reviewer_age_range: string | null
  reviewer_gender: string | null
  reviewer_area: string | null
  created_at: string
}

type ReviewWithCounselor = ReviewRow & { counselor_name: string }

function StarRating({ rating }: { rating: number }) {
  return <span style={{ color: '#F59E0B' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function ReviewsPage() {
  const [tab, setTab] = useState<'pending' | 'proxy'>('pending')
  const [reviews, setReviews] = useState<ReviewWithCounselor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadReviews() }, [tab])

  async function loadReviews() {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('reviews').select('*, counselors(name)').order('created_at', { ascending: false })

    if (tab === 'pending') {
      query = query.eq('is_published', false).eq('source_type', 'face_to_face')
    } else {
      query = query.eq('source_type', 'proxy')
    }

    const { data } = await query
    setReviews(
      (data ?? []).map((r: Record<string, unknown>) => ({
        ...r,
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
      })) as ReviewWithCounselor[]
    )
    setLoading(false)
  }

  async function approveReview(id: string) {
    const supabase = createClient()
    await supabase.from('reviews').update({ is_published: true }).eq('id', id)
    loadReviews()
  }

  async function rejectReview(id: string) {
    if (!confirm('この口コミを削除しますか？この操作は元に戻せません。')) return
    const supabase = createClient()
    await supabase.from('reviews').delete().eq('id', id)
    loadReviews()
  }

  async function unpublishReview(id: string) {
    const supabase = createClient()
    await supabase.from('reviews').update({ is_published: false }).eq('id', id)
    loadReviews()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">口コミ管理</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {(['pending', 'proxy'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {t === 'pending' ? '承認待ち' : '代理入力済み'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            {tab === 'pending' ? '承認待ちの口コミはありません' : '代理入力済みの口コミはありません'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>投稿者属性</th>
                  <th>カウンセラー</th>
                  <th>評価</th>
                  <th>本文</th>
                  <th>投稿日</th>
                  {tab === 'proxy' && <th>掲載状態</th>}
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {[r.reviewer_age_range, r.reviewer_gender, r.reviewer_area].filter(Boolean).join(' / ') || '非公開'}
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>{r.counselor_name}</td>
                    <td style={{ whiteSpace: 'nowrap' }}><StarRating rating={r.rating} /></td>
                    <td style={{ fontSize: 12, maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.body}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    {tab === 'proxy' && (
                      <td>
                        <span className={r.is_published ? 'badge badge-published' : 'badge badge-draft'}>
                          {r.is_published ? '公開中' : '下書き'}
                        </span>
                      </td>
                    )}
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        {tab === 'pending' && (
                          <button onClick={() => approveReview(r.id)} className="btn btn-sm" style={{ background: '#DCFCE7', color: '#166534', border: 'none', gap: 4 }}>
                            <IconCheck /> 承認
                          </button>
                        )}
                        {tab === 'proxy' && r.is_published && (
                          <button onClick={() => unpublishReview(r.id)} className="btn btn-ghost btn-sm">
                            非公開
                          </button>
                        )}
                        <button onClick={() => rejectReview(r.id)} className="btn btn-danger btn-sm" style={{ gap: 4 }}>
                          <IconX /> 削除
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
    </div>
  )
}
