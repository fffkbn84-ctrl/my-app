'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

interface MobileTopBarProps {
  title?: string
  accountName?: string
  agencyName?: string
}

export default function MobileTopBar({ accountName, agencyName }: MobileTopBarProps) {
  return (
    <header className="kc-topbar">
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: "'Shippori Mincho', serif",
          fontWeight: 500,
          fontSize: 18,
          color: 'var(--text-deep)',
          letterSpacing: '.06em',
        }}>Kinda</span>
        <span style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 300,
          fontSize: 12,
          color: 'var(--text-mid)',
        }}>管理画面</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle compact />
        <div className="acct-badge">
          <span className="acct-avatar">{(agencyName ?? accountName ?? '?').charAt(0).toUpperCase()}</span>
          <span className="acct-name">{agencyName ?? accountName ?? ''}</span>
        </div>
      </div>
    </header>
  )
}
