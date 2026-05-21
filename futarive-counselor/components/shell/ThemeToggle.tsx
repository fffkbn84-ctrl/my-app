'use client'

import { useEffect, useState } from 'react'

type ThemeChoice = 'auto' | 'light' | 'dark'
const STORAGE_KEY = 'kinda-theme'

function applyTheme(choice: ThemeChoice) {
  const html = document.documentElement
  if (choice === 'auto') {
    html.removeAttribute('data-theme')
  } else {
    html.setAttribute('data-theme', choice)
  }
}

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [choice, setChoice] = useState<ThemeChoice>('auto')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? 'auto'
    setChoice(stored)
    setMounted(true)
  }, [])

  const update = (next: ThemeChoice) => {
    setChoice(next)
    if (next === 'auto') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }

  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="テーマ切替" disabled>
        <span style={{ width: 14, height: 14, display: 'inline-block' }} />
      </button>
    )
  }

  const next: ThemeChoice = choice === 'auto' ? 'light' : choice === 'light' ? 'dark' : 'auto'
  const label = choice === 'auto' ? '自動' : choice === 'light' ? 'ライト' : 'ダーク'

  return (
    <button
      className="theme-toggle"
      onClick={() => update(next)}
      aria-label={`テーマ：${label}（クリックで切替）`}
      title={`テーマ：${label}`}
    >
      {choice === 'light' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.6 2.6l1 1M10.4 10.4l1 1M2.6 11.4l1-1M10.4 3.6l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      )}
      {choice === 'dark' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11.5 7.5A4.5 4.5 0 1 1 6.5 2.5a3.5 3.5 0 0 0 5 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      )}
      {choice === 'auto' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M7 2v10a5 5 0 0 0 0-10Z" fill="currentColor"/>
        </svg>
      )}
      {!compact && <span style={{ marginLeft: 6 }}>{label}</span>}
    </button>
  )
}
