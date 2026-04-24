'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logAuthEvent } from '@/lib/supabase/audit'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError('おっと、メールアドレスかパスワードが違うようです')
      await logAuthEvent('login_failure', 'failure', { reason: 'invalid_credentials' })
      setLoading(false)
      return
    }

    await logAuthEvent('login_success')
    router.push('/dashboard')
    router.refresh()
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    await logAuthEvent('password_reset_requested')
    setResetSent(true)
    setLoading(false)
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
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* ロゴ */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ marginBottom: 10 }}>
            <span style={{
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 600,
              fontSize: '24px',
              color: 'var(--text-deep)',
              letterSpacing: '.1em',
            }}>ふたりへ</span>
            <span style={{ color: 'var(--accent)', margin: '0 7px', fontSize: '20px' }}>·</span>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 200,
              fontSize: '19px',
              color: 'var(--text-mid)',
              letterSpacing: '.08em',
            }}>futarive</span>
          </div>
          <div style={{
            display: 'inline-block',
            padding: '3px 14px',
            border: '1px solid var(--accent)',
            borderRadius: '20px',
            fontSize: '11px',
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '.12em',
            color: 'var(--accent)',
          }}>COUNSELOR ADMIN</div>
        </div>

        {!showReset ? (
          <div className="kc-card" style={{ padding: '36px 32px' }}>
            <h1 style={{
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 600,
              fontSize: '18px',
              color: 'var(--text-deep)',
              textAlign: 'center',
              marginBottom: 28,
            }}>ログイン</h1>

            {error && (
              <div style={{
                background: 'var(--danger-pale)',
                border: '1px solid var(--danger)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '13px',
                color: 'var(--danger)',
                marginBottom: 18,
              }}>{error}</div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label className="kc-label">メールアドレス</label>
                <input
                  type="email"
                  className="kc-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@futarive.jp"
                  required
                  autoComplete="email"
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="kc-label">パスワード</label>
                <input
                  type="password"
                  className="kc-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="kc-btn kc-btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '12px' }}
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={() => setShowReset(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-mid)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >パスワードを忘れた方</button>
            </div>
          </div>
        ) : (
          <div className="kc-card" style={{ padding: '36px 32px' }}>
            <button
              onClick={() => { setShowReset(false); setResetSent(false) }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-mid)',
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              戻る
            </button>
            <h2 style={{
              fontFamily: 'Shippori Mincho, serif',
              fontWeight: 600,
              fontSize: '17px',
              color: 'var(--text-deep)',
              marginBottom: 16,
            }}>パスワードリセット</h2>

            {resetSent ? (
              <div style={{
                background: 'var(--success-pale)',
                border: '1px solid var(--success)',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '13px',
                color: 'var(--success)',
              }}>
                リセットリンクをメールで送りました。ご確認ください。
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: 20 }}>
                  <label className="kc-label">登録済みのメールアドレス</label>
                  <input
                    type="email"
                    className="kc-input"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="kc-btn kc-btn-primary"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? '送信中...' : 'リセットリンクを送る'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
