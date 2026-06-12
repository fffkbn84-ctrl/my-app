import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    .select('stripe_customer_id')
    .eq('owner_user_id', user.id)
    .limit(1)
  const customerId = (agencies?.[0] as { stripe_customer_id: string | null } | undefined)?.stripe_customer_id
  if (!customerId) {
    return NextResponse.json({ ok: false, error: 'no_customer' }, { status: 400 })
  }

  try {
    // SetupIntent 確定時点で Customer に attach 済みだが、念のため冪等に attach
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId }).catch(() => {})
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const e = err as Error
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
