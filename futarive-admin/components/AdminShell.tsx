'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}
function IconReview() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 7h10M3 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconPerson() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 13V9h6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 6h2M9 6h2M5 8.5h2M9 8.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconShop() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 6h12l-1.5 7H3.5L2 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M2 6L4 2h8l2 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8 6v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 7h12M5 2v2M11 2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconBooking() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 13s-6-3.5-6-7.5C2 3.6 3.6 2 5.5 2c1 0 2 .5 2.5 1.3C8.5 2.5 9.5 2 10.5 2 12.4 2 14 3.6 14 5.5 14 9.5 8 13 8 13z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}
function IconDocument() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M9 2v4h4M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2a6 6 0 016 6v3l1.5 2H1.5L3 11V8a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M7 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
function IconExternal() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 2H2v10h10V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2h4v4M12 2L7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

const navSections: NavSection[] = [
  {
    title: '概要',
    items: [
      { label: 'ダッシュボード', href: '/admin', icon: <IconDashboard /> },
    ],
  },
  {
    title: '口コミ管理',
    items: [
      { label: '承認待ち', href: '/admin/reviews', icon: <IconReview /> },
      { label: '新規代理入力', href: '/admin/reviews/new', icon: <IconPlus /> },
    ],
  },
  {
    title: 'マスター管理',
    items: [
      { label: '相談所', href: '/admin/agencies', icon: <IconBuilding /> },
      { label: 'カウンセラー', href: '/admin/counselors', icon: <IconPerson /> },
      { label: 'お店', href: '/admin/shops', icon: <IconShop /> },
    ],
  },
  {
    title: '予約・スロット',
    items: [
      { label: 'スロット管理', href: '/admin/slots', icon: <IconCalendar /> },
      { label: '予約管理', href: '/admin/reservations', icon: <IconBooking /> },
    ],
  },
  {
    title: 'コンテンツ',
    items: [
      { label: '成婚エピソード', href: '/admin/episodes', icon: <IconHeart /> },
      { label: 'コラム管理', href: '/admin/columns', icon: <IconDocument /> },
    ],
  },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const SidebarContent = () => (
    <nav style={{ padding: '8px 0' }}>
      {navSections.map(section => (
        <div key={section.title} style={{ marginBottom: 8 }}>
          <div style={{
            padding: '8px 16px 4px',
            fontSize: '10px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>{section.title}</div>
          {section.items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 16px',
                fontSize: '13px',
                color: isActive(item.href) ? 'var(--accent)' : 'var(--ink)',
                background: isActive(item.href) ? 'rgba(168,124,42,.08)' : 'transparent',
                borderLeft: isActive(item.href) ? '3px solid var(--accent)' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all .15s',
                position: 'relative',
              }}
            >
              <span style={{ opacity: isActive(item.href) ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#EA580C',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '20px',
                }}>{item.badge}</span>
              )}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top bar */}
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 56,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 40,
        gap: 12,
      }}>
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="btn btn-ghost btn-sm"
          style={{ padding: '6px', display: 'none' }}
          id="mobile-menu-btn"
        >
          {sidebarOpen ? <IconX /> : <IconMenu />}
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'Shippori Mincho, serif',
            fontWeight: 500,
            fontSize: '18px',
            color: 'var(--ink)',
            letterSpacing: '.1em',
          }}>ふたりへ</span>
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            border: '1px solid var(--accent)',
            borderRadius: '20px',
            fontSize: '10px',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--accent)',
            letterSpacing: '.08em',
          }}>統括管理</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Site link */}
        <a
          href="https://my-app-git-integration-redesign-772ffb-fffkbn84-4095s-projects.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
          style={{ gap: 6 }}
        >
          <IconExternal />
          <span style={{ fontFamily: 'DM Sans', fontSize: 12 }}>サイトを見る</span>
        </a>

        {/* Bell */}
        <button className="btn btn-ghost btn-sm" style={{ padding: '6px', position: 'relative' }}>
          <IconBell />
        </button>

        {/* User + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>ふうか</span>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
            <IconLogout />
            <span style={{ fontSize: 12 }}>ログアウト</span>
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', paddingTop: 56, flex: 1 }}>
        {/* Sidebar desktop */}
        <aside style={{
          width: 220,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          position: 'fixed',
          top: 56,
          bottom: 0,
          left: 0,
          overflowY: 'auto',
        }} className="sidebar-desktop">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.4)',
              zIndex: 39,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {sidebarOpen && (
          <aside style={{
            position: 'fixed',
            top: 56,
            bottom: 0,
            left: 0,
            width: 240,
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            zIndex: 40,
          }}>
            <SidebarContent />
          </aside>
        )}

        {/* Main content */}
        <main style={{
          flex: 1,
          marginLeft: 220,
          padding: '24px',
          minHeight: 'calc(100vh - 56px)',
        }} className="admin-main">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
