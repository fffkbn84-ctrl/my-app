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
      </div>
    </header>
  )
}
