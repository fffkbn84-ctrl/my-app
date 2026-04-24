'use client'

import type { Review } from '@/lib/types'
import ReplyForm from './ReplyForm'

interface ReviewCardProps {
  review: Review
  onReply: (reviewId: string, reply: string) => Promise<void>
  onExpand: (reviewId: string) => void
  expanded: boolean
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="rv-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M6.5 1l1.6 3.3H12L9 6.8l1.1 3.4L6.5 8.5 3.4 10.2 4.5 6.8 1.5 4.3h3.9z"
            fill={i < rating ? 'var(--accent)' : 'var(--border-strong)'}
            stroke={i < rating ? 'var(--accent)' : 'var(--border-strong)'}
            strokeWidth=".5"
          />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewCard({ review, onReply, onExpand, expanded }: ReviewCardProps) {
  const dateStr = new Date(review.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const unreplied = !review.agency_reply
  const urgent = unreplied && review.rating <= 3

  return (
    <div className={`rv-card${unreplied ? ' unreplied' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* アバター */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: urgent ? 'var(--danger-pale)' : 'var(--accent-pale)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6.5" r="3" stroke={urgent ? 'var(--danger)' : 'var(--accent)'} strokeWidth="1.3"/>
              <path d="M2 16c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke={urgent ? 'var(--danger)' : 'var(--accent)'} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <Stars rating={review.rating} />
            <div className="rv-meta" style={{ marginTop: 3 }}>
              {[review.author_age_range, review.author_gender, review.author_area]
                .filter(Boolean).join(' · ')}
              {review.source_type === 'proxy' && (
                <span style={{ marginLeft: 6, color: 'var(--text-faint)', fontSize: 10 }}>（代理掲載）</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {unreplied && (
            <span className={`kc-badge ${urgent ? 'kc-badge-urgent' : 'kc-badge-review'}`}>
              {urgent ? '★3以下' : '未返信'}
            </span>
          )}
          <span className="rv-meta">{dateStr}</span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8 }}>{review.body}</p>

      {/* 返信済み */}
      {review.agency_reply && (
        <div className="rv-reply-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4.5L2 11V9H3a1 1 0 0 1-1-1V4Z" stroke="var(--accent)" strokeWidth="1.2"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-deep)' }}>カウンセラーからの返信</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 'auto' }}>
              <circle cx="6" cy="6" r="5" stroke="var(--accent)" strokeWidth="1.1"/>
              <path d="M3.5 6l2 2L8.5 4" stroke="var(--accent)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>編集不可</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7 }}>{review.agency_reply}</p>
        </div>
      )}

      {/* 返信フォーム */}
      {unreplied && (
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => onExpand(review.id)}
            className="kc-btn kc-btn-ghost kc-btn-sm"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4.5L2 11V9H3a1 1 0 0 1-1-1V4Z" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            {expanded ? '返信フォームを閉じる' : '返信する'}
          </button>

          {expanded && (
            <ReplyForm reviewId={review.id} onSubmit={onReply} />
          )}
        </div>
      )}
    </div>
  )
}
