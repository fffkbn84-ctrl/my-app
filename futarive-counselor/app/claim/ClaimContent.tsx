'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { describeError } from '@/lib/errors'

interface Preview {
  valid: boolean
  counselor_name?: string
  agency_name?: string
}

type Mode = 'signup' | 'login'

export default function ClaimContent() {
  const router = useRouter()
  const sp = useSearchParams()
  const token = sp.get('token') ?? ''

  const [preview, setPreview] = useState<Preview | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      // 既にログイン済みなら直接 claim を試す
      const { data: { user } } = await supabase.auth.getUser()
      if (user && token) {
        const { data, error } = await supabase.rpc('claim_counselor_by_token', { p_token: token })
        if (!error && data?.success) {
          router.push('/profile')
          return
        }
      }

      if (!token) {
        setPreview({ valid: false })
        setLoading(false)
        return
      }

      const { data, error } = await supabase.rpc('preview_invite', { p_token: token })
      if (error) {
        console.error('[preview_invite] error', error)
        setPreview({ valid: false })
      } else {
        setPreview(data as Preview)
      }
      setLoading(false)
    }
    run()
  }, [token, router])

  const claimAndRedirect = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('claim_counselor_by_token', { p_token: token })
    if (error) {
      setError(describeError(error))
      return false
    }
    if (!data?.success) {
      setError(data?.error === 'invalid_or_used' ? '招待リンクが無効、または既に使用済みです' : '反映に失敗しました')
      return false
    }
    router.push('/profile')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email || !password) { setError('メールアドレスとパスワードを入力してください'); return }
    if (password.length < 8) { setError('パスワードは8文字以上にしてください'); return }
    setSubmitting(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/claim?token=${token}` },
      })
      if (error) { setError(describeError(error)); setSubmitting(false); return }
      // メール確認が必要な設定の場合 session は null
      if (!data.session) {
        setInfo('登録メールを送信しました。受信箱からリンクをタップしてアカウントを有効化してください。')
        setSubmitting(false)
        return
      }
      // 確認不要ですぐログインされた場合は claim へ
      await claimAndRedirect()
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('メールアドレスまたはパスワードが違うようです')
        setSubmitting(false)
        return
      }
      await claimAndRedirect()
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div style={{ padding: 40, color: 'var(--text-mid)' }}>招待を確認中…</div>
  }

  if (!preview?.valid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
        <div className="kc-card" style={{ maxWidth: 420, padding: 28, textAlign: 'center' }}>
          <h1 className="page-title" style={{ marginBottom: 12 }}>招待リンクが無効です</h1>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: 20 }}>
            このリンクは有効期限切れか、既に使用されている可能性があります。<br/>
            お手数ですが、相談所の管理者に再発行を依頼してください。
          </p>
          <Link href="/login" className="kc-btn kc-btn-ghost" style={{ textDecoration: 'none' }}>
            ログイン画面へ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* ロゴ */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 600, fontSize: 22, color: 'var(--text-deep)', letterSpacing: '.06em' }}>
            Kinda
          </span>
          <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300, fontSize: 12, color: 'var(--text-mid)', marginLeft: 8 }}>
            管理画面
          </span>
        </div>

        <div className="kc-card" style={{ padding: 26 }}>
          {/* 招待プレビュー */}
          <div style={{
            padding: '14px 16px',
            background: 'var(--accent-pale)',
            border: '1px solid var(--accent-dim)',
            borderRadius: 12,
            marginBottom: 22,
          }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>INVITATION</div>
            <p style={{ fontSize: 13, color: 'var(--text-deep)', lineHeight: 1.8 }}>
              <strong style={{ fontFamily: "'Shippori Mincho', serif" }}>{preview.agency_name ?? '相談所'}</strong>
              から、<strong>{preview.counselor_name}</strong> さんへの招待が届いています。<br/>
              アカウントを作成すると、ご自身でプロフィールやリールを編集できるようになります。
            </p>
          </div>

          {/* タブ */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setInfo('') }}
              style={{
                flex: 1, padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid ' + (mode === 'signup' ? 'var(--accent)' : 'var(--border)'),
                background: mode === 'signup' ? 'var(--accent-pale)' : 'transparent',
                color: mode === 'signup' ? 'var(--accent-deep)' : 'var(--text-mid)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >新規登録</button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setInfo('') }}
              style={{
                flex: 1, padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid ' + (mode === 'login' ? 'var(--accent)' : 'var(--border)'),
                background: mode === 'login' ? 'var(--accent-pale)' : 'transparent',
                color: mode === 'login' ? 'var(--accent-deep)' : 'var(--text-mid)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >既にアカウントがある</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="kc-label">メールアドレス</label>
              <input
                className="kc-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="kc-label">
                パスワード
                {mode === 'signup' && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--text-light)' }}>8文字以上</span>}
              </label>
              <input
                className="kc-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
              />
            </div>

            {error && (
              <p style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 12 }}>{error}</p>
            )}
            {info && (
              <p style={{ fontSize: 12, color: 'var(--success)', marginBottom: 12, lineHeight: 1.7 }}>{info}</p>
            )}

            <button
              type="submit"
              className="kc-btn kc-btn-primary"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? '処理中…' : mode === 'signup' ? '新規登録して引き継ぐ' : 'ログインして引き継ぐ'}
            </button>
          </form>

          <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 16, lineHeight: 1.7, textAlign: 'center' }}>
            登録すると、Kinda カウンセラー管理画面の利用規約に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  )
}
