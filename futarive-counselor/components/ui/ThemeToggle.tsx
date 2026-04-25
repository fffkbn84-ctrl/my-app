'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'kc-theme'

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

interface Props {
  /** 'sidebar' = 縦長3アイコン、'topbar' = アイコン1個（タップでサイクル） */
  variant?: 'sidebar' | 'topbar'
}

export default function ThemeToggle({ variant = 'sidebar' }: Props) {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved)
      } else {
        setTheme('system')
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSet = (next: Theme) => {
    setTheme(next)
    applyTheme(next)
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  // SSR と初回 hydrate のミスマッチを避けるため、未マウント時は枠だけ
  if (!mounted) {
    return (
      <div
        aria-hidden
        style={{
          height: variant === 'topbar' ? 30 : 36,
          width: variant === 'topbar' ? 30 : '100%',
        }}
      />
    )
  }

  if (variant === 'topbar') {
    // モバイル用: タップでlight→dark→systemをサイクル
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    return (
      <button
        type="button"
        onClick={() => handleSet(next)}
        aria-label="テーマを切り替える"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'var(--bg-elev)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-mid)',
        }}
      >
        {theme === 'light' && <SunIcon />}
        {theme === 'dark' && <MoonIcon />}
        {theme === 'system' && <SystemIcon />}
      </button>
    )
  }

  // サイドバー用: 横並び3ボタンセグメント
  return (
    <div
      role="group"
      aria-label="テーマ"
      style={{
        display: 'flex',
        gap: 4,
        padding: 4,
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
        borderRadius: 999,
        marginBottom: 8,
      }}
    >
      <SegBtn active={theme === 'light'} onClick={() => handleSet('light')} label="ライト">
        <SunIcon />
      </SegBtn>
      <SegBtn active={theme === 'system'} onClick={() => handleSet('system')} label="自動">
        <SystemIcon />
      </SegBtn>
      <SegBtn active={theme === 'dark'} onClick={() => handleSet('dark')} label="ダーク">
        <MoonIcon />
      </SegBtn>
    </div>
  )
}

function SegBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      style={{
        flex: 1,
        height: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? 'var(--card)' : 'transparent',
        border: 'none',
        borderRadius: 999,
        cursor: 'pointer',
        color: active ? 'var(--accent-deep)' : 'var(--text-mid)',
        boxShadow: active ? 'var(--sh-sm)' : 'none',
        transition: 'background .15s, color .15s',
      }}
    >
      {children}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.5 2.5l1.1 1.1M10.4 10.4l1.1 1.1M2.5 11.5l1.1-1.1M10.4 3.6l1.1-1.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11.5 8.4A4.5 4.5 0 0 1 5.6 2.5a5 5 0 1 0 5.9 5.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="2.5" width="11" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 12h4M7 10v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
