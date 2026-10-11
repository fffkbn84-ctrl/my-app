import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * カード登録（SetupIntent 成功）後に、その payment_method を相談所 Customer の
 * デフォルト支払い方法に設定する。課金時にこのカードが使われる。
 */
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ ok: false, error: 'stripe_not_configured' }, { status: 503 })
  }

  let body: { paymentMethodId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }
  const paymentMethodId = (body.paymentMethodId ?? '').trim()
  if (!paymentMethodId) {
    return NextResponse.json({ ok: false, error: 'missing_payment_method' }, { status: 400 })
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
    .select('id, stripe_customer_id')
    .eq('owner_user_id', user.id)
    .limit(1)
  const agency = agencies?.[0] as { id: string; stripe_customer_id: string | null } | undefined
  const customerId = agency?.stripe_customer_id
  if (!customerId) {
    return NextResponse.json({ ok: false, error: 'no_customer' }, { status: 400 })
  }

  try {
    // SetupIntent 確定時点で Customer に attach 済みだが、念のため冪等に attach
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId }).catch(() => {})
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })
    // カード登録済みの印。kinda.jp はこれがある相談所のカウンセラーだけを表示する（DB の RLS）。
    // 本人のセッションでは書けない列なので service role で書く
    const service = createServiceRoleClient()
    if (!service || !agency) {
      return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 })
    }
    const { error: markErr } = await service
      .from('agencies')
      .update({ card_registered_at: new Date().toISOString() })
      .eq('id', agency.id)
    if (markErr) {
      return NextResponse.json({ ok: false, error: 'mark_card_failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const e = err as Error
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
