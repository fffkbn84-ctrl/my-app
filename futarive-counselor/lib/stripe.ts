// futarive-counselor/lib/stripe.ts
// サーバー専用の Stripe クライアント（カウンセラー/相談所側）。
// STRIPE_SECRET_KEY 未設定なら null（各 API は 503）でビルドを壊さない。
import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export const stripe: Stripe | null = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : null
