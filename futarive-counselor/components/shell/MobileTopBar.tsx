'use client'

import Link from 'next/link'

interface MobileTopBarProps {
  title?: string
  accountName?: string
}

export default function MobileTopBar({ title, accountName }: MobileTopBarProps) {
  return (
    <header className="kc-topbar" style={{ display: undefined }}>
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontFamily: 'Shippori Mincho, serif',
          fontWeight: 600,
          fontSize: '15px',
          color: 'var(--text-deep)',
          letterSpacing: '.08em',
        }}>ふたりへ</span>
        <span style={{ color: 'var(--accent)', fontSize: '13px' }}>·</span>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 200,
          fontSize: '12px',
          color: 'var(--text-mid)',
        }}>Kinda</span>
      </Link>

      {title && (
        <span style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-deep)',
          fontFamily: 'Shippori Mincho, serif',
        }}>{title}</span>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {accountName && (
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--accent-pale)',
            border: '1.5px solid var(--accent-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent-deep)',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {accountName.charAt(0)}
          </div>
        )}
      </div>
    </header>
  )
}
