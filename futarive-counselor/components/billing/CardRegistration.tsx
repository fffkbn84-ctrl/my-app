'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = pk ? loadStripe(pk) : null

type Card = { brand: string; last4: string } | null

const muted: React.CSSProperties = { fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7 }

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="kc-card"
      style={{ padding: '18px 20px', marginBottom: 20, borderLeft: '3px solid var(--accent)' }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-deep)', marginBottom: 4 }}>
        お支払い方法（クレジットカード）
      </div>
      <p style={{ ...muted, marginBottom: 14 }}>
        送客料（予約確定ごとに ¥5,500 税込）はこのカードに請求されます。カード未登録の場合、ご予約をお受けできません。
      </p>
      {children}
    </div>
  )
}

export default function CardRegistration() {
  const [loading, setLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [card, setCard] = useState<Card>(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  const fetchSetup = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/setup-intent', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(
          data.error === 'no_agency'
            ? 'カード登録は相談所オーナーのアカウントで行ってください。'
            : 'カード設定の取得に失敗しました。時間をおいて再度お試しください。',
        )
        setLoading(false)
        return
      }
      setClientSecret(data.clientSecret)
      setCard(data.card ?? null)
    } catch {
      setError('カード設定の取得に失敗しました。')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSetup()
  }, [])

  if (!pk || !stripePromise) {
    return (
      <Section>
        <p style={muted}>決済の準備中です。設定が完了するまでお待ちください。</p>
      </Section>
    )
  }
  if (loading) return <Section><p style={muted}>読み込み中...</p></Section>
  if (error) return <Section><p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p></Section>

  return (
    <Section>
      {card && !editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 999,
              background: '#DCFCE7',
              color: '#166534',
            }}
          >
            ✓ 登録済み
          </span>
          <span style={{ fontSize: 14, color: 'var(--text-deep)', fontFamily: 'DM Sans, sans-serif' }}>
            {card.brand.toUpperCase()} •••• {card.last4}
          </span>
          <button className="kc-btn kc-btn-ghost kc-btn-sm" onClick={() => setEditing(true)}>
            カードを変更
          </button>
        </div>
      ) : (
        clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <CardForm
              onDone={() => {
                setEditing(false)
                fetchSetup()
              }}
              onCancel={card ? () => setEditing(false) : undefined}
            />
          </Elements>
        )
      )}
    </Section>
  )
}

function CardForm({ onDone, onCancel }: { onDone: () => void; onCancel?: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setErr('')
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    if (error) {
      setErr(error.message ?? '登録に失敗しました。')
      setSubmitting(false)
      return
    }
    const pm = setupIntent?.payment_method
    const pmId = typeof pm === 'string' ? pm : pm?.id
    if (pmId) {
      await fetch('/api/stripe/set-default-pm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: pmId }),
      })
    }
    setSubmitting(false)
    onDone()
  }

  return (
    <form onSubmit={submit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {err && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 10 }}>{err}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button type="submit" className="kc-btn kc-btn-primary" disabled={submitting || !stripe}>
          {submitting ? '登録中...' : 'カードを登録'}
        </button>
        {onCancel && (
          <button type="button" className="kc-btn kc-btn-ghost" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
        )}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 10, lineHeight: 1.7 }}>
        カード情報は Stripe により安全に処理され、Kinda のサーバーには保存されません。
      </p>
    </form>
  )
}
