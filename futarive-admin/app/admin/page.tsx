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

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: 13 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ pending: 0, total: 0, published: 0, monthly: 0 })
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [pending, total, published, monthly, reviews, reservations] = await Promise.all([
      supabase.from('reviews').select('*', { count: 'exact', head: true })
        .eq('is_published', false).eq('source_type', 'face_to_face'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('counselors').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('reviews').select('*, counselors(name)')
        .eq('is_published', false).eq('source_type', 'face_to_face')
        .order('created_at', { ascending: false }).limit(5),
      supabase.from('reservations').select('*, counselors(name), slots(start_at)')
        .order('created_at', { ascending: false }).limit(5),
    ])

    setStats({
      pending: pending.count ?? 0,
      total: total.count ?? 0,
      published: published.count ?? 0,
      monthly: monthly.count ?? 0,
    })

    setPendingReviews(
      (reviews.data ?? []).map((r: Record<string, unknown>) => ({
        ...r,
        counselor_name: (r.counselors as { name?: string } | null)?.name ?? '—',
      })) as PendingReview[]
    )

    setRecentReservations(
      (reservations.data ?? []).map((r: Record<string, unknown>) => ({
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

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Sans', letterSpacing: '.06em', marginBottom: 8 }}>承認待ち口コミ</div>
          <div className="stat-value" style={{ color: stats.pending > 0 ? '#EA580C' : 'var(--ink)' }}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Sans', letterSpacing: '.06em', marginBottom: 8 }}>累計口コミ</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Sans', letterSpacing: '.06em', marginBottom: 8 }}>掲載カウンセラー</div>
          <div className="stat-value">{stats.published}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Sans', letterSpacing: '.06em', marginBottom: 8 }}>今月の予約</div>
          <div className="stat-value">{stats.monthly}</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--ink)' }}>クイックアクション</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link href="/admin/reviews" className="btn btn-ghost btn-sm">口コミ承認</Link>
          <Link href="/admin/reviews/new" className="btn btn-primary btn-sm">新規代理入力</Link>
          <Link href="/admin/slots" className="btn btn-ghost btn-sm">スロット追加</Link>
          <Link href="/admin/episodes" className="btn btn-ghost btn-sm">エピソード追加</Link>
        </div>
      </div>

      {/* Pending reviews */}
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

      {/* Recent reservations */}
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
