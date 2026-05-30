'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'ホーム',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 8L10 2l8 6v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8Z" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <path d="M7 19v-7h6v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/calendar',
    label: '予約枠',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <path d="M6 2v4M14 2v4M2 9h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/reservations',
    label: '予約',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <path d="M7 2v5M13 2v5M3 11h14M7 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/reviews',
    label: 'レビュー',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H7l-3.5 2.5V14H4a1 1 0 0 1-1-1V4Z" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'プロフィール',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <path d="M3 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="kc-bottom-nav">
      {NAV_ITEMS.map(item => {
        const active = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`kc-bottom-nav-item${active ? ' active' : ''}`}
          >
            {item.icon(active)}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
