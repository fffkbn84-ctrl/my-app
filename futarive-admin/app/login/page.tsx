'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,.06)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 500,
              fontSize: '22px',
              color: 'var(--ink)',
              letterSpacing: '.1em',
            }}>ふたりへ</span>
            <span style={{ color: 'var(--accent)', margin: '0 6px' }}>·</span>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 200,
              fontSize: '18px',
              color: 'var(--muted)',
              letterSpacing: '.08em',
            }}>futarive</span>
          </div>
          <div style={{
            display: 'inline-block',
            padding: '3px 12px',
            border: '1px solid var(--accent)',
            borderRadius: '20px',
            fontSize: '11px',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--accent)',
            letterSpacing: '.1em',
          }}>統括管理</div>
        </div>

        <h1 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--ink)',
          textAlign: 'center',
          marginBottom: 28,
        }}>管理者ログイン</h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">メールアドレス</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@futarive.jp"
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="form-label">パスワード</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#DC2626',
              fontSize: '13px',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', height: 44 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
