'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'loading' | 'enroll' | 'challenge' | 'error'

export default function MfaPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('loading')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [factorId, setFactorId] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    void init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function init() {
    const supabase = createClient()

    const { data: factorsData } = await supabase.auth.mfa.listFactors()
    const verified = factorsData?.totp?.find(
      (f: { status: string }) => f.status === 'verified'
    )

    if (verified) {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.currentLevel === 'aal2') {
        router.push('/admin')
        return
      }
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: verified.id,
      })
      if (challengeError || !challengeData) {
        setError('認証コードの発行に失敗しました。時間をおいて再度お試しください。')
        setMode('error')
        return
      }
      setFactorId(verified.id)
      setChallengeId(challengeData.id)
      setMode('challenge')
      return
    }

    // 未登録 → 新規登録。中途半端な未検証factorが残っていれば片付けてから作り直す
    const unverified = factorsData?.totp?.filter(
      (f: { status: string }) => f.status === 'unverified'
    ) ?? []
    for (const f of unverified) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }

    const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `admin-totp-${Date.now()}`,
    })
    if (enrollError || !enrollData) {
      setError('2段階認証の登録準備に失敗しました。時間をおいて再度お試しください。')
      setMode('error')
      return
    }
    setFactorId(enrollData.id)
    setQrCode(enrollData.totp.qr_code)
    setSecret(enrollData.totp.secret)
    setMode('enroll')
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const supabase = createClient()

    let activeChallengeId = challengeId
    if (mode === 'enroll') {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      })
      if (challengeError || !challengeData) {
        setError('認証コードの発行に失敗しました')
        setSubmitting(false)
        return
      }
      activeChallengeId = challengeData.id
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: activeChallengeId,
      code,
    })
    if (verifyError) {
      setError('コードが正しくありません。認証アプリの最新のコードを入力してください。')
      setSubmitting(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '40px 36px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 4px 24px rgba(0,0,0,.06)',
        }}
      >
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--ink)',
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          2段階認証
        </h1>

        {mode === 'loading' && <p style={{ textAlign: 'center', fontSize: 13 }}>読み込み中...</p>}

        {mode === 'error' && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '12px 14px',
              color: '#DC2626',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {mode === 'enroll' && (
          <>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
              Google Authenticator等の認証アプリで下のQRコードを読み取るか、シークレットキーを手入力して登録してください。
            </p>
            {qrCode && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="QRコード" style={{ width: 180, height: 180 }} />
              </div>
            )}
            {secret && (
              <div
                style={{
                  fontSize: 12,
                  fontFamily: 'monospace',
                  background: '#F7F4EF',
                  padding: '10px 12px',
                  borderRadius: 8,
                  wordBreak: 'break-all',
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                {secret}
              </div>
            )}
          </>
        )}

        {(mode === 'enroll' || mode === 'challenge') && (
          <form onSubmit={handleVerify}>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">認証アプリに表示された6桁のコード</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className="form-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                required
                autoFocus
              />
            </div>

            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#DC2626',
                  fontSize: '13px',
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44 }}
              disabled={submitting}
            >
              {submitting ? '確認中...' : '確認する'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
