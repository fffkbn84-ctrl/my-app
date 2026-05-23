'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { createClient } from '@/lib/supabase/client'
import { logAuthEvent } from '@/lib/supabase/audit'

interface MobileTopBarProps {
  title?: string
  accountName?: string
  agencyName?: string
}

export default function MobileTopBar({ accountName, agencyName }: MobileTopBarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  // ドロワー開いている間は body のスクロールをロック
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // ESC キーで閉じる
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await logAuthEvent('logout')
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="kc-topbar">
        <Link href="/dashboard" className="kc-topbar-logo">
          <span className="kc-topbar-logo-jp">Kinda</span>
          <span className="kc-topbar-logo-sub">管理画面</span>
        </Link>

        <div className="kc-topbar-right">
          <ThemeToggle compact />
          <div className="acct-badge">
            <span className="acct-avatar">{(agencyName ?? accountName ?? '?').charAt(0).toUpperCase()}</span>
            <span className="acct-name">{agencyName ?? accountName ?? ''}</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            aria-controls="kc-mobile-drawer"
            className="kc-topbar-menu-btn"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="kc-drawer-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <aside
        id="kc-mobile-drawer"
        className={`kc-drawer${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="kc-drawer-header">
          <span className="kc-drawer-title">メニュー</span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="メニューを閉じる"
            className="kc-drawer-close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="kc-drawer-section">
          <p className="kc-drawer-eyebrow">アカウント</p>
          <button type="button" onClick={handleLogout} className="kc-drawer-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M10 5l3 3-3 3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>ログアウト</span>
          </button>
        </nav>

        <nav className="kc-drawer-section">
          <p className="kc-drawer-eyebrow">法務情報</p>
          <Link href="/terms" onClick={closeMenu} className="kc-drawer-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 2h7l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span>利用規約</span>
          </Link>
          <Link href="/privacy" onClick={closeMenu} className="kc-drawer-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2l5 2v4c0 3.5-2.2 6.4-5 7-2.8-.6-5-3.5-5-7V4l5-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            <span>プライバシーポリシー</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
