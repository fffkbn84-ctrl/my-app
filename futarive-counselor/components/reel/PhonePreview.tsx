'use client'

import { useState } from 'react'
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
  area?: string | null
  ratingAvg?: number | null
  reviewCount?: number | null
  reviews: Review[]
}

const RECOMMENDED = 4

export default function PhonePreview({
  catchphrase,
  mediaList,
  selectedIndex,
  onSelectIndex,
  counselorId,
  counselorName,
  agencyName,
  area,
  ratingAvg,
  reviewCount,
  reviews,
}: PhonePreviewProps) {
  const [showShare, setShowShare] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [liked, setLiked] = useState(false)

  const current = mediaList[selectedIndex]
  // 画像が無い時は推奨枚数 (4) のプレースホルダーを表示
  const segCount = mediaList.length > 0 ? mediaList.length : RECOMMENDED
  const displayIndex = Math.min(selectedIndex, segCount - 1)

  const metaLine = [counselorName, agencyName, area].filter(Boolean).join(' · ')

  return (
    <>
      <div className="phone-frame">
        <div className="phone-screen">
          {/* 背景: 画像 or プレースホルダー */}
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.media_url} alt="" className="phone-img" />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(180deg, #F4EADB 0%, #E9DCC4 60%, #DDC9A8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Shippori Mincho, serif',
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'rgba(74,42,31,.55)',
                  letterSpacing: '.04em',
                }}
              >
                portrait 9:16 · {displayIndex + 1}/{segCount}
              </span>
            </div>
          )}

          {/* オーバーレイ */}
          <div className="phone-overlay" />

          {/* プログレスバー */}
          <div className="phone-progress">
            {Array.from({ length: segCount }).map((_, i) => (
              <div
                key={i}
                className={`phone-prog-seg${i === displayIndex ? ' active' : ''}`}
                style={{ cursor: mediaList.length > 0 ? 'pointer' : 'default' }}
                onClick={() => mediaList.length > 0 && onSelectIndex(i)}
              />
            ))}
          </div>

          {/* 右側アクション */}
          <div className="phone-actions">
            <button
              className="phone-action-btn"
              onClick={() => setLiked((l) => !l)}
              aria-label="共感"
            >
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
            </button>

            <button
              className="phone-action-btn"
              onClick={() => setShowReviews(true)}
              aria-label="口コミ"
            >
              <div className="phone-action-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6l-3 2v-2H4a1 1 0 0 1-1-1V4Z"
                    stroke="white"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>
            </button>

            <button
              className="phone-action-btn"
              onClick={async () => {
                const url = `https://kinda.futarive.jp/counselors/${counselorId}`
                const text = `${counselorName} @${agencyName} のプロフィール`
                if (navigator.share) {
                  try {
                    await navigator.share({ title: 'Kinda ふたりへ', text, url })
                    return
                  } catch (e) {
                    if ((e as Error).name === 'AbortError') return
                  }
                }
                setShowShare(true)
              }}
              aria-label="共有"
            >
              <div className="phone-action-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="14" cy="4" r="2" stroke="white" strokeWidth="1.3" />
                  <circle cx="4" cy="9" r="2" stroke="white" strokeWidth="1.3" />
                  <circle cx="14" cy="14" r="2" stroke="white" strokeWidth="1.3" />
                  <path d="M6 8l6-3M6 10l6 3" stroke="white" strokeWidth="1.3" />
                </svg>
              </div>
            </button>
          </div>

          {/* 下部: catchphrase + メタ + 評価 */}
          <div className="phone-bottom">
            <div className="phone-catchphrase">
              {catchphrase || 'キャッチコピーを入力してください'}
            </div>
            {current?.caption && (
              <div className="phone-caption">{current.caption}</div>
            )}
            {metaLine && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10.5,
                  color: 'rgba(255,255,255,.85)',
                  textShadow: '0 1px 4px rgba(0,0,0,.5)',
                  letterSpacing: '.02em',
                }}
              >
                {metaLine}
              </div>
            )}
            {ratingAvg != null && (reviewCount ?? 0) > 0 && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  color: 'rgba(255,255,255,.75)',
                  textShadow: '0 1px 4px rgba(0,0,0,.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1l1.2 2.5L9 4l-2 1.8.5 2.7L5 7.2 2.5 8.5 3 5.8 1 4l2.8-.5z"
                    fill="rgba(255,255,255,.9)"
                  />
                </svg>
                {ratingAvg.toFixed(1)} · レビュー {reviewCount} 件
              </div>
            )}
          </div>
        </div>
      </div>

      {showShare && (
        <ShareSheet
          counselorId={counselorId}
          counselorName={counselorName}
          agencyName={agencyName}
          onClose={() => setShowShare(false)}
        />
      )}

      {showReviews && (
        <div className="kc-overlay" onClick={() => setShowReviews(false)}>
          <div
            className="kc-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 className="kc-modal-title" style={{ margin: 0 }}>
                口コミ ({reviews.length}件)
              </h2>
              <button
                onClick={() => setShowReviews(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-mid)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div
              style={{
                maxHeight: 320,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {reviews.length === 0 ? (
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--text-light)',
                    textAlign: 'center',
                    padding: '20px 0',
                  }}
                >
                  まだ口コミはありません
                </p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg-elev)',
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M6 1l1.5 3.2H11L8.3 6.4l1 3.1L6 7.8 2.7 9.5l1-3.1L1 4.2h3.5z"
                            fill={
                              i < r.rating ? 'var(--accent)' : 'var(--border-strong)'
                            }
                            stroke={
                              i < r.rating ? 'var(--accent)' : 'var(--border-strong)'
                            }
                            strokeWidth=".5"
                          />
                        </svg>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--text)',
                        lineHeight: 1.7,
                      }}
                    >
                      {r.body}
                    </p>
                    {(r.author_age_range || r.author_gender) && (
                      <p
                        style={{
                          fontSize: 10,
                          color: 'var(--text-light)',
                          marginTop: 6,
                        }}
                      >
                        {[r.author_age_range, r.author_gender]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
