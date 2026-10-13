import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * 相談所のカード登録用 SetupIntent を発行する。
 * - ログインユーザーが owner の相談所(agencies.owner_user_id)を対象にする。
 * - Stripe Customer 未作成、または保存済みの ID が Stripe に無いなら作成し agencies.stripe_customer_id に保存（上書き）。
 * - 既存の登録カードがあればブランド/末尾4桁も返す（表示用）。
 */
export async function POST() {
  if (!stripe) {
    return NextResponse.json({ ok: false, error: 'stripe_not_configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'not_authenticated' }, { status: 401 })
  }

  const { data: agencies } = await supabase
    .from('agencies')
    .select('id, name, email, stripe_customer_id')
    .eq('owner_user_id', user.id)
    .limit(1)
  const agency = agencies?.[0] as
    | { id: string; name: string | null; email: string | null; stripe_customer_id: string | null }
    | undefined
  if (!agency) {
    return NextResponse.json({ ok: false, error: 'no_agency' }, { status: 403 })
  }

  // 本人のセッションでは stripe_customer_id を書けない（DB ガード）。本人確認済みなので service role で書く
  const service = createServiceRoleClient()
  if (!service) {
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 })
  }
  const stripeClient = stripe

  const createCustomer = async (): Promise<string | null> => {
    const customer = await stripeClient.customers.create({
      name: agency.name ?? undefined,
      email: agency.email ?? user.email ?? undefined,
      metadata: { agency_id: agency.id },
    })
    const { error: saveErr } = await service
      .from('agencies')
      .update({ stripe_customer_id: customer.id })
      .eq('id', agency.id)
    return saveErr ? null : customer.id
  }

  // 保存済みの顧客を読む。Stripe に無い（テストモードの ID が残っている・削除済み）なら作り直して上書きする。
  // 2026-10-13 に本番キーへ切り替えた際、テストモードの顧客 ID が残ってカード画面が開けなくなった再発防止。
  let customerId = agency.stripe_customer_id
  let cust: Stripe.Customer | null = null
  if (customerId) {
    try {
      const got = await stripe.customers.retrieve(customerId)
      if (!('deleted' in got && got.deleted)) cust = got as Stripe.Customer
    } catch (e) {
      if ((e as { code?: string }).code !== 'resource_missing') throw e
    }
    if (!cust) customerId = null
  }
  if (!customerId) {
    customerId = await createCustomer()
    if (!customerId) {
      return NextResponse.json({ ok: false, error: 'save_customer_failed' }, { status: 500 })
    }
  }

  // 既存の登録カード（default → 無ければ最初の card）。作り直した顧客にはカードがないので見ない
  let card: { brand: string; last4: string } | null = null
  if (cust) {
    try {
      const def = cust.invoice_settings?.default_payment_method
      const defId = typeof def === 'string' ? def : def?.id
      let pm: Stripe.PaymentMethod | null = null
      if (defId) {
        pm = await stripe.paymentMethods.retrieve(defId)
      } else {
        const list = await stripe.paymentMethods.list({ customer: customerId, type: 'card', limit: 1 })
        pm = list.data[0] ?? null
      }
      if (pm?.card) card = { brand: pm.card.brand, last4: pm.card.last4 }
    } catch {
      /* 取得失敗は無視（登録フローは続行可能） */
    }
  }

  const si = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session',
  })

  return NextResponse.json({ ok: true, clientSecret: si.client_secret, card })
}
