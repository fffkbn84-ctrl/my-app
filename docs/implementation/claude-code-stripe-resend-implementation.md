# Claude Code 実装指示書 — Stripe・Resend 導入（Kinda）

> 対象リポジトリ：`fffkbn84-ctrl/my-app`
> 対象アプリ：ユーザーサイト（`src/`）＋ カウンセラー管理画面（`futarive-counselor/`）
> 作業前に必ず `origin/main` の最新を取得してから feature branch を切ること。

---

## 前提・設計の確認（実装前に必読）

### 決済フロー

```
ユーザーが予約確定ボタン押下
    ↓
Kindaサーバー：Stripe Payment Intentを作成（¥5,000）
    ↓
相談所の登録カードに即時課金
    ↓
Stripe Webhook（payment_intent.succeeded）をKindaが受信
    ↓
Supabase：予約ステータスを「confirmed」に更新
    ↓
相談所管理画面：ユーザーの連絡先・情報が自動開示
    ↓
Resend：相談所と管理者に決済完了メール送信
```

### 返金フロー（2026-06-05 改定・現行モデル）

> 旧「24時間以内 全額返金」モデルは廃止。**予約確定で即時課金・以後は原則返金なし**。例外は運営事務局が個別判断（CLAUDE.md §12）。

| トリガー | 処理 |
|---|---|
| 予約確定 | 即時 ¥5,000 課金（猶予期間なし） |
| 以後のキャンセル・当日キャンセル・ユーザー不参加（ドタキャン） | 原則返金なし（課金確定） |
| やむを得ない事情 | 運営事務局へ相談 → 個別判断で返金しうる（Stripe Refund API・admin のみ実行） |

### 支払い手段

- クレジットカード登録制のみ
- 銀行振込は対応しない
- Billing・Invoiceは使用しない

---

## タスク一覧

---

### TASK 1：環境変数の追加

`.env.local` に以下を追加。値はStripe・Resendのダッシュボードから取得。

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxxxxx          # 本番キー（テスト時は sk_test_）
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxx     # 公開キー
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx        # Webhook署名シークレット

# Resend
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=noreply@kinda.jp          # 送信元（Resendで認証済みドメイン）
```

---

### TASK 2：Stripeパッケージのインストール

```bash
npm install stripe @stripe/stripe-js
npm install resend
```

---

### TASK 3：Stripe Customersへのカード登録フロー

#### 3-1. カード登録APIエンドポイント（サーバーサイド）

`src/app/api/stripe/setup-intent/route.ts` を新規作成：

```typescript
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  // 相談所IDをセッションから取得
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Supabaseから既存のStripe Customer IDを取得（なければ新規作成）
  const { data: agency } = await supabase
    .from('agencies')
    .select('stripe_customer_id, name, email')
    .eq('user_id', user.id)
    .single()

  let customerId = agency?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: agency?.email,
      name: agency?.name,
      metadata: { supabase_user_id: user.id }
    })
    customerId = customer.id

    await supabase
      .from('agencies')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id)
  }

  // SetupIntent作成（カード登録用）
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  })

  return NextResponse.json({ client_secret: setupIntent.client_secret })
}
```

#### 3-2. カード登録UIコンポーネント

`futarive-counselor/src/components/CardRegistration.tsx` を新規作成：

- `@stripe/stripe-js` と `@stripe/react-stripe-js` を使用
- `loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)` で初期化
- `CardElement` を使ったフォームを実装
- 登録完了後に「カード登録済み」バッジを表示
- Kindaのクレイ風デザインには縛られない（管理画面用UI）

---

### TASK 4：予約成立時の即時課金

#### 4-1. 課金APIエンドポイント

`src/app/api/stripe/charge/route.ts` を新規作成：

```typescript
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const CHARGE_AMOUNT = 5000 // ¥5,000

export async function POST(req: Request) {
  const { reservation_id, agency_id } = await req.json()

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  // 相談所のStripe Customer IDとデフォルトカードを取得
  const { data: agency } = await supabase
    .from('agencies')
    .select('stripe_customer_id, name')
    .eq('id', agency_id)
    .single()

  if (!agency?.stripe_customer_id) {
    return NextResponse.json({ error: 'No card registered' }, { status: 400 })
  }

  // デフォルトのPaymentMethodを取得
  const customer = await stripe.customers.retrieve(agency.stripe_customer_id) as Stripe.Customer
  const paymentMethodId = customer.invoice_settings.default_payment_method as string

  if (!paymentMethodId) {
    return NextResponse.json({ error: 'No default payment method' }, { status: 400 })
  }

  // Payment Intent作成・即時確定
  const paymentIntent = await stripe.paymentIntents.create({
    amount: CHARGE_AMOUNT,
    currency: 'jpy',
    customer: agency.stripe_customer_id,
    payment_method: paymentMethodId,
    confirm: true,
    off_session: true, // カード登録済みのため画面表示不要
    metadata: {
      reservation_id,
      agency_id,
    }
  })

  // 予約テーブルにpayment_intent_idを保存（返金時に必要）
  await supabase
    .from('reservations')
    .update({ stripe_payment_intent_id: paymentIntent.id })
    .eq('id', reservation_id)

  return NextResponse.json({ payment_intent_id: paymentIntent.id })
}
```

---

### TASK 5：Stripe Webhook処理

`src/app/api/stripe/webhook/route.ts` を新規作成：

```typescript
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)

// Supabaseはservice_role_keyを使用（RLS bypass）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const reservationId = pi.metadata.reservation_id

      // 予約ステータスを confirmed に更新
      await supabase
        .from('reservations')
        .update({ status: 'confirmed', paid_at: new Date().toISOString() })
        .eq('id', reservationId)

      // 相談所へのユーザー情報開示フラグをON
      await supabase
        .from('reservations')
        .update({ user_info_visible: true })
        .eq('id', reservationId)

      // Resendで決済完了メール送信（後述のTASK 6）
      await sendPaymentSuccessEmail(reservationId)
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const reservationId = pi.metadata.reservation_id

      // 予約ステータスを payment_failed に更新
      await supabase
        .from('reservations')
        .update({ status: 'payment_failed' })
        .eq('id', reservationId)
      break
    }
  }

  return NextResponse.json({ received: true })
}

async function sendPaymentSuccessEmail(reservationId: string) {
  // 予約情報と相談所情報を取得してメール送信
  const { data: reservation } = await supabase
    .from('reservations')
    .select('*, agencies(name, email), users(name)')
    .eq('id', reservationId)
    .single()

  if (!reservation) return

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: reservation.agencies.email,
    subject: '【Kinda】予約が確定しました',
    html: `
      <p>${reservation.agencies.name} 様</p>
      <p>Kinda経由の予約が確定しました。</p>
      <p>管理画面よりユーザーの連絡先をご確認いただけます。</p>
      <p>予約ID：${reservationId}</p>
    `
  })
}
```

#### Vercelへのwebhook URL登録

Stripeダッシュボード → Webhooks → エンドポイント追加：
```
https://my-app-rp9u.vercel.app/api/stripe/webhook
```

監視イベント：
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

### TASK 6：返金API

`src/app/api/stripe/refund/route.ts` を新規作成：

```typescript
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// 例外返金（運営判断）。現行モデル＝予約確定で即時課金・原則返金なし。
// 24時間ルールは廃止。返金は「やむを得ない事情」を運営事務局が個別判断した時のみ、
// admin ユーザーが手動実行する（自動返金フローは持たない）。
export async function POST(req: Request) {
  const { reservation_id } = await req.json()

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  // admin 権限チェック（運営のみ実行可）
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ... admin_users で role==='admin' を確認（実装済みルート参照）

  const { data: reservation } = await supabase
    .from('reservations')
    .select('stripe_payment_intent_id, status, refunded_at')
    .eq('id', reservation_id)
    .single()

  if (!reservation?.stripe_payment_intent_id) {
    return NextResponse.json({ error: 'No payment found' }, { status: 400 })
  }
  if (reservation.refunded_at) {
    return NextResponse.json({ ok: true, alreadyRefunded: true })
  }

  // 返金実行（運営の個別判断による例外対応）
  const refund = await stripe.refunds.create({
    payment_intent: reservation.stripe_payment_intent_id,
    metadata: { reservation_id, reason: 'manual_exception' }
  })

  await supabase
    .from('reservations')
    .update({
      refunded_at: new Date().toISOString(),
      stripe_refund_id: refund.id,
    })
    .eq('id', reservation_id)

  return NextResponse.json({ refund_id: refund.id })
}
```

> 実体は `src/app/api/stripe/refund/route.ts`（admin 限定・例外返金）として実装済み。上記は設計サンプル。

---

### TASK 7：Supabaseスキーマ追加

以下のカラムを追加するマイグレーションを作成・適用してください。
**適用前に必ず `list_tables` でスキーマ確認してから実行すること。**

```sql
-- agenciesテーブルにStripe Customer IDを追加
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- reservationsテーブルに決済関連カラムを追加
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_refund_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS user_info_visible BOOLEAN DEFAULT FALSE;
```

---

### TASK 8：Resendメール送信（追加）

TASK 5のWebhook以外に以下のメールも実装：

| タイミング | 送信先 | 件名 |
|---|---|---|
| 予約キャンセル確定時 | 相談所・ユーザー両方 | 「予約がキャンセルされました」 |
| 日程変更申請時 | 相手側（相談所orユーザー） | 「日程変更のリクエストが届いています」 |
| 日程変更了承時 | 申請した側 | 「日程変更が承認されました」 |

---

## 実装順序

1. TASK 7（スキーマ追加）← 他のタスクの前提
2. TASK 1（環境変数）
3. TASK 2（パッケージインストール）
4. TASK 3（カード登録フロー）← まずここを動作確認
5. TASK 4（課金API）
6. TASK 5（Webhook）← VercelへのURL登録も忘れずに
7. TASK 6（返金API）
8. TASK 8（メール追加）

---

## 動作確認方法

Stripeのテストモード（`sk_test_`）で以下のカードを使って確認：

| カード番号 | 用途 |
|---|---|
| `4242 4242 4242 4242` | 通常の成功 |
| `4000 0000 0000 9995` | 課金失敗テスト |

有効期限：任意の未来の日付、CVV：任意3桁

---

## 注意事項

- 環境変数は `.env.local` のみ。GitHubにpushしない。
- Webhookのシークレットはローカルと本番で別の値になる（Stripe CLIでローカルテスト時は別途設定）。
- `off_session: true` の課金が失敗した場合（カード期限切れ等）は `payment_intent.payment_failed` イベントで検知して相談所に通知する。
- RLSを必ず有効にすること。Webhook処理のみ `service_role_key` を使用。
