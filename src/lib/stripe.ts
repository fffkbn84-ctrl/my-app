// src/lib/stripe.ts
// サーバー専用の Stripe クライアント。
// STRIPE_SECRET_KEY 未設定（テストキー未投入 / preview）でもビルドが壊れないよう、
// 未設定なら null を返し、各 API ルートは 503 を返す（事故防止・admin/email と同じガード方針）。
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : null;

export const STRIPE_ENABLED = !!STRIPE_SECRET_KEY;

// 送客料：契約書（agency-agreement.md 第6条）は ¥5,000（税別）＋消費税と定めているため、
// 実際に課金する金額は税込 ¥5,500。JPY はゼロ十進通貨なので amount=5500 が ¥5,500。
export const REFERRAL_FEE_JPY = 5500;

// redeploy: Stripe env(STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET) 反映 2026-06-14
