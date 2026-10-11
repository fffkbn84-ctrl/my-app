'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import PasswordInput from '@/components/shared/PasswordInput'

type Phase = 'checking' | 'ready' | 'invalid' | 'done'

/**
 * パスワード再設定。ログイン画面の「パスワードを忘れた方」から送るメールのリンク先。
 * リンクの ?code= をセッションに替えてから、新しいパスワードを受け付ける。
 * code はリセットを申し込んだのと同じブラウザでしか替えられない（PKCE）。
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const run = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        // ブラウザ側のクライアントが先に替えている場合もあるので、失敗は下のセッション確認で判断する
        await supabase.auth.exchangeCodeForSession(code).catch(() => {})
      }
      const { data } = await supabase.auth.getSession()
      setPhase(data.session ? 'ready' : 'invalid')
    }
    run()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('パスワードは8文字以上にしてください')
      return
    }
    if (password !== confirm) {
      setError('確認用のパスワードが一致しません')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) {
      setError('パスワードを変更できませんでした。時間をおいて、もう一度お試しください')
      return
    }
    setPhase('done')
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
        <div className="kc-card" style={{ padding: '36px 32px' }}>
          <h1 style={{
            fontFamily: 'Shippori Mincho, serif',
            fontWeight: 600,
            fontSize: '18px',
            color: 'var(--text-deep)',
            textAlign: 'center',
            marginBottom: 24,
          }}>パスワードの再設定</h1>

          {phase === 'checking' && (
            <p style={{ fontSize: 13, color: 'var(--text-mid)', textAlign: 'center' }}>確認しています...</p>
          )}

          {phase === 'invalid' && (
            <div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8, marginBottom: 20 }}>
                リンクの有効期限が切れているか、リセットを申し込んだのとは別のブラウザで開いています。
                ログイン画面の「パスワードを忘れた方」から、もう一度お申し込みください。
                メールのリンクは、申し込んだのと同じ端末・同じブラウザで開いてください。
              </p>
              <Link href="/login" className="kc-btn kc-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                ログイン画面へ
              </Link>
            </div>
          )}

          {phase === 'ready' && (
            <form onSubmit={handleSubmit}>
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
              <div style={{ marginBottom: 16 }}>
                <label className="kc-label">
                  新しいパスワード
                  <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-light)' }}>8文字以上</span>
                </label>
                <PasswordInput
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="kc-label">新しいパスワード（確認）</label>
                <PasswordInput
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <button
                type="submit"
                className="kc-btn kc-btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '12px' }}
              >
                {loading ? '変更しています...' : 'パスワードを変更する'}
              </button>
            </form>
          )}

          {phase === 'done' && (
            <div>
              <div style={{
                background: 'var(--success-pale)',
                border: '1px solid var(--success)',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '13px',
                color: 'var(--success)',
                marginBottom: 20,
              }}>
                パスワードを変更しました。
              </div>
              <button
                type="button"
                onClick={() => { router.push('/dashboard'); router.refresh() }}
                className="kc-btn kc-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                ダッシュボードへ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
