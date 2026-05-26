'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: '最初に見る',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 8L10 2l8 6v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8Z" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <path d="M7 19v-7h6v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/inbox',
    label: 'やるべきこと',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 11V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <path d="M3 11h4l1.2 2.4h3.6L13 11h4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
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
  {
    href: '/reel',
    label: '動画・写真',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="10" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: '/reviews',
    label: '口コミ返信',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H7l-3.5 2.5V14H4a1 1 0 0 1-1-1V4Z" stroke="currentColor" strokeWidth="1.4" fill={active ? 'var(--accent-pale)' : 'none'}/>
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
