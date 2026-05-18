'use client'

import { useRef, useState } from 'react'
import type { CounselorMedia } from '@/lib/types'
import ShareSheet from './ShareSheet'

interface Review {
  id: string
  rating: number
  body: string
  author_age_range: string | null
  author_gender: string | null
  created_at: string
}

interface PhonePreviewProps {
  catchphrase: string
  mediaList: CounselorMedia[]
  selectedIndex: number
  onSelectIndex: (i: number) => void
  counselorId: string
  counselorName: string
  agencyName: string
  reviews: Review[]
}

export default function PhonePreview({
  catchphrase,
  mediaList,
  selectedIndex,
  onSelectIndex,
  counselorId,
  counselorName,
  agencyName,
  reviews,
}: PhonePreviewProps) {
  const [showShare, setShowShare] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [liked, setLiked] = useState(false)
  const [dragDx, setDragDx] = useState(0)
  const dragRef = useRef<{ startX: number; startY: number; startTime: number; locked: 'h' | 'v' | null; dx: number } | null>(null)
  const SWIPE_THRESHOLD = 40

  const handlePointerDown = (clientX: number, clientY: number) => {
    if (mediaList.length <= 1) return
    dragRef.current = { startX: clientX, startY: clientY, startTime: Date.now(), locked: null, dx: 0 }
  }
  const handlePointerMove = (clientX: number, clientY: number) => {
    const d = dragRef.current
    if (!d) return
    const dx = clientX - d.startX
    const dy = clientY - d.startY
    if (!d.locked) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        d.locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
      }
    }
    if (d.locked === 'h') {
      d.dx = dx
      setDragDx(dx)
    }
  }
  const handlePointerUp = () => {
    const d = dragRef.current
    if (!d) { setDragDx(0); return }
    const dx = d.locked === 'h' ? d.dx : 0
    dragRef.current = null
    setDragDx(0)
    if (dx <= -SWIPE_THRESHOLD && selectedIndex < mediaList.length - 1) {
      onSelectIndex(selectedIndex + 1)
    } else if (dx >= SWIPE_THRESHOLD && selectedIndex > 0) {
      onSelectIndex(selectedIndex - 1)
    }
  }

  const current = mediaList[selectedIndex]
  const total = Math.max(mediaList.length, 1)
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null

  return (
    <>
      <div className="phone-frame">
        {/* ノッチ */}
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 22, borderRadius: 999, background: '#000', zIndex: 20,
        }} />
        <div
          className="phone-screen"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={e => { if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY) }}
          onTouchMove={e => { if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY) }}
          onTouchEnd={handlePointerUp}
          onTouchCancel={handlePointerUp}
          onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={e => { if (dragRef.current) handlePointerMove(e.clientX, e.clientY) }}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
        >
          {/* 背景画像 */}
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${dragDx}px)`,
            transition: dragRef.current ? 'none' : 'transform .25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.media_url} alt="" className="phone-img" draggable={false} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(180deg, #F4ECDA 0%, #E8DDC2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Shippori Mincho, serif',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'rgba(60,40,20,.55)',
                letterSpacing: '.04em',
              }}>
                portrait 9:16 · {selectedIndex + 1}/{total}
              </span>
            </div>
          )}
          </div>

          {/* オーバーレイ */}
          <div className="phone-overlay" />

          {/* プログレスバー */}
          {mediaList.length > 0 && (
            <div className="phone-progress">
              {mediaList.map((_, i) => (
                <div
                  key={i}
                  className={`phone-prog-seg${i === selectedIndex ? ' active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectIndex(i)}
                />
              ))}
            </div>
          )}

          {/* 右側アクション */}
          <div className="phone-actions">
            {/* ハート */}
            <button className="phone-action-btn" onClick={() => setLiked(l => !l)}>
              <div className="phone-action-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 15s-6-4.5-6-8.5A4 4 0 0 1 9 4.5 4 4 0 0 1 15 6.5C15 10.5 9 15 9 15Z"
                    stroke="white"
                    strokeWidth="1.4"
                    fill={liked ? 'white' : 'none'}
                  />
                </svg>
              </div>
              <span className="phone-action-label">共感</span>
            </button>

            {/* 吹き出し（口コミ） */}
            <button className="phone-action-btn" onClick={() => setShowReviews(true)}>
              <div className="phone-action-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6l-3 2v-2H4a1 1 0 0 1-1-1V4Z" stroke="white" strokeWidth="1.4"/>
                </svg>
              </div>
              <span className="phone-action-label">口コミ</span>
            </button>

            {/* 共有 */}
            <button className="phone-action-btn" onClick={async () => {
              const url = `https://kinda.futarive.jp/counselors/${counselorId}`
              const text = `${counselorName} @${agencyName} のプロフィール`
              if (navigator.share) {
                try { await navigator.share({ title: 'Kinda ふたりへ', text, url }); return } catch (e) {
                  if ((e as Error).name === 'AbortError') return
                }
              }
              setShowShare(true)
            }}>
              <div className="phone-action-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="14" cy="4" r="2" stroke="white" strokeWidth="1.3"/>
                  <circle cx="4" cy="9" r="2" stroke="white" strokeWidth="1.3"/>
                  <circle cx="14" cy="14" r="2" stroke="white" strokeWidth="1.3"/>
                  <path d="M6 8l6-3M6 10l6 3" stroke="white" strokeWidth="1.3"/>
                </svg>
              </div>
              <span className="phone-action-label">共有</span>
            </button>
          </div>

          {/* 下部テキスト */}
          <div className="phone-bottom">
            <div className="phone-catchphrase">
              {catchphrase || 'キャッチコピーを入力してください'}
            </div>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,.85)',
              marginTop: 8, fontFamily: 'Noto Sans JP, sans-serif',
              textShadow: '0 1px 4px rgba(0,0,0,.5)',
            }}>
              {[counselorName, agencyName].filter(Boolean).join(' · ')}
            </div>
            {avgRating !== null && (
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,.85)',
                marginTop: 4, fontFamily: 'DM Sans, sans-serif',
                textShadow: '0 1px 4px rgba(0,0,0,.5)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <path d="M5 .8l1.3 2.7H9L7 5.4l.8 2.6L5 6.5 2.2 8 3 5.4 1 3.5h2.7z"/>
                </svg>
                {avgRating} · レビュー {reviews.length}件
              </div>
            )}
            {current?.caption && (
              <div className="phone-caption" style={{ marginTop: 6 }}>{current.caption}</div>
            )}
          </div>

          {/* ページインジケーター */}
          {mediaList.length > 1 && (
            <div className="phone-page-dots">
              {mediaList.map((_, i) => (
                <div
                  key={i}
                  className={`phone-page-dot${i === selectedIndex ? ' active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 共有シート */}
      {showShare && (
        <ShareSheet
          counselorId={counselorId}
          counselorName={counselorName}
          agencyName={agencyName}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* 口コミボトムシート */}
      {showReviews && (
        <div className="kc-overlay" onClick={() => setShowReviews(false)}>
          <div className="kc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="kc-modal-title" style={{ margin: 0 }}>口コミ ({reviews.length}件)</h2>
              <button onClick={() => setShowReviews(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', padding: '20px 0' }}>まだ口コミはありません</p>
              ) : reviews.map(r => (
                <div key={r.id} style={{ padding: '12px 14px', background: 'var(--bg-elev)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1l1.5 3.2H11L8.3 6.4l1 3.1L6 7.8 2.7 9.5l1-3.1L1 4.2h3.5z"
                          fill={i < r.rating ? 'var(--accent)' : 'var(--border-strong)'}
                          stroke={i < r.rating ? 'var(--accent)' : 'var(--border-strong)'}
                          strokeWidth=".5"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7 }}>{r.body}</p>
                  {(r.author_age_range || r.author_gender) && (
                    <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 6 }}>
                      {[r.author_age_range, r.author_gender].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
