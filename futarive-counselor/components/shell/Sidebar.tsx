'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { logAuthEvent } from '@/lib/supabase/audit'
import ThemeToggle from './ThemeToggle'

const AGENCY_ITEM = {
  href: '/agency',
  label: '相談所プロフィール',
  icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 14V6l6-4 6 4v8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
}

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'ダッシュボード',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'プロフィール',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/reel',
    label: 'リール',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: '/calendar',
    label: '予約枠管理',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/reviews',
    label: 'レビュー返信',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6l-3 2v-2H3a1 1 0 0 1-1-1V3Z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await logAuthEvent('logout')
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="kc-sidebar" style={{ display: undefined }}>
      {/* ロゴ */}
      <div className="kc-sidebar-logo">
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 600,
              fontSize: '17px',
              color: 'var(--text-deep)',
              letterSpacing: '.08em',
            }}>ふたりへ</span>
            <span style={{ color: 'var(--accent)', margin: '0 5px' }}>·</span>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 200,
              fontSize: '14px',
              color: 'var(--text-mid)',
              letterSpacing: '.06em',
            }}>futarive</span>
          </div>
          <div className="eyebrow" style={{ fontSize: '9px', letterSpacing: '.16em' }}>
            COUNSELOR ADMIN
          </div>
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="kc-sidebar-nav">
        <div style={{ marginBottom: 4 }}>
          <div className="eyebrow" style={{ fontSize: '9px', padding: '0 12px', marginBottom: 8 }}>
            MENU
          </div>
          {[...NAV_ITEMS, AGENCY_ITEM].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`kc-nav-item${pathname.startsWith(item.href) ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* フッター */}
      <div className="kc-sidebar-footer">
        <div style={{ padding: '0 12px 8px' }}>
          <ThemeToggle />
        </div>
        <button onClick={handleLogout} className="kc-nav-item" style={{ width: '100%' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M10 5l3 3-3 3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ログアウト
        </button>
      </div>
    </aside>
  )
}
