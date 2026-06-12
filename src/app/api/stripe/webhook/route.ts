import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe Webhook。
 * - payment_intent.succeeded → 予約を paid_at / user_info_visible=true に更新（相談所に連絡先開示）。
 * - charge.refunded → 予約を refunded_at に更新。
 * 署名検証に raw body が必要なので req.text() を使う。service role で更新。
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ ok: false, error: "no_signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ ok: false, error: `invalid_signature: ${e.message}` }, { status: 400 });
  }

  const admin = await createAdminClient();

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const reservationId = pi.metadata?.reservation_id;
      if (reservationId) {
        await admin
          .from("reservations")
          .update({
            stripe_payment_intent_id: pi.id,
            paid_at: new Date().toISOString(),
            user_info_visible: true,
          } as never)
          .eq("id", reservationId);
      }
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      const refundId = charge.refunds?.data?.[0]?.id ?? null;
      if (piId) {
        await admin
          .from("reservations")
          .update({
            refunded_at: new Date().toISOString(),
            stripe_refund_id: refundId,
          } as never)
          .eq("stripe_payment_intent_id", piId);
      }
    }
  } catch (err) {
    const e = err as Error;
    // 失敗しても 200 を返すと Stripe が再送しないため、5xx で再送を促す
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
