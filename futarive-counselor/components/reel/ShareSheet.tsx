'use client'

import { useState } from 'react'

interface ShareSheetProps {
  counselorId: string
  counselorName: string
  agencyName: string
  onClose: () => void
}

export default function ShareSheet({ counselorId, counselorName, agencyName, onClose }: ShareSheetProps) {
  const [copied, setCopied] = useState(false)
  const url = `https://kinda.futarive.jp/counselors/${counselorId}`
  const text = `${counselorName} @${agencyName} のプロフィール`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="kc-overlay" onClick={onClose}>
      <div className="kc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="kc-modal-title" style={{ margin: 0 }}>シェアする</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* X (Twitter) */}
          <a
            className="share-btn"
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.6 2h2.3L10.8 7.7 17 16H12L8.1 10.9 3.6 16H1.3l5.5-6.1L1 2h5.1l3.5 4.7L13.6 2Zm-.8 12.6h1.3L5.2 3.3H3.8l9 11.3Z" fill="currentColor"/>
            </svg>
            Xでシェア
          </a>

          {/* LINE */}
          <a
            className="share-btn"
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1C4.6 1 1 4.1 1 8c0 3.5 2.9 6.4 6.8 6.9l.2 1.7c0 .2.3.3.5.2l2-1.3C14.3 15 17 11.8 17 8c0-3.9-3.6-7-8-7Z" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5.5 9V7M7.5 9V6.5M9.5 9V7.5M11.5 9V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            LINEでシェア
          </a>

          {/* URLコピー */}
          <button className="share-btn" onClick={handleCopy}>
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="var(--success)" strokeWidth="1.3"/>
                <path d="M5.5 9l2.5 2.5L13 6" stroke="var(--success)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="6" y="6" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M12 6V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            )}
            <span style={{ color: copied ? 'var(--success)' : 'inherit' }}>
              {copied ? 'コピーしました' : 'URLをコピー'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
