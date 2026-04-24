'use client'

import { useState, useEffect, useRef } from 'react'

interface ReplyFormProps {
  reviewId: string
  onSubmit: (reviewId: string, reply: string) => Promise<void>
}

const DRAFT_KEY = (id: string) => `kinda_reply_draft_${id}`

export default function ReplyForm({ reviewId, onSubmit }: ReplyFormProps) {
  const [text, setText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ローカルストレージから下書き復元
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY(reviewId))
    if (saved) setText(saved)
  }, [reviewId])

  const handleChange = (val: string) => {
    setText(val)
    if (draftTimer.current) clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY(reviewId), val)
    }, 1000)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await onSubmit(reviewId, text)
    localStorage.removeItem(DRAFT_KEY(reviewId))
    setText('')
    setShowConfirm(false)
    setSubmitting(false)
  }

  const charCount = text.length
  const withinRange = charCount >= 100 && charCount <= 200

  return (
    <>
      <div style={{
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
      }}>
        {/* 1回限り注意 */}
        <div className="warning-banner" style={{ marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>返信は1回のみです。送信後は編集できません。</span>
        </div>

        <textarea
          className="kc-textarea"
          style={{ minHeight: 90 }}
          placeholder="返信を入力してください（推奨 100〜200 文字）"
          value={text}
          onChange={e => handleChange(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{
            fontSize: 11,
            color: withinRange ? 'var(--success)' : 'var(--text-light)',
          }}>
            {charCount}文字{!withinRange && charCount > 0 && '（推奨 100〜200 文字）'}
          </span>
          <button
            className="kc-btn kc-btn-primary kc-btn-sm"
            onClick={() => setShowConfirm(true)}
            disabled={!text.trim()}
          >
            返信を送る
          </button>
        </div>
      </div>

      {/* 二段階確認モーダル */}
      {showConfirm && (
        <div className="kc-overlay">
          <div className="kc-modal" style={{ maxWidth: 360 }}>
            <h2 className="kc-modal-title">返信を送信しますか？</h2>
            <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 6 }}>
              送信後は編集できません。<br/>
              内容をご確認ください。
            </p>
            <div style={{
              background: 'var(--bg-elev)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--text)',
              lineHeight: 1.7,
            }}>
              {text}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setShowConfirm(false)}>
                戻って編集
              </button>
              <button
                className="kc-btn kc-btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '送信中...' : '送信する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
