import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe, REFERRAL_FEE_JPY } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 予約成立で相談所カードに即時 ¥5,000 を off_session 課金する。
 * - 呼び出しは予約本人（ログインユーザー）に限定。
 * - 相談所が Stripe Customer + カード登録済みであることが前提（未登録は 402）。
 * - 二重課金防止：paid_at / stripe_payment_intent_id があればスキップ。
 * - DB の確定更新（paid_at / user_info_visible）は Webhook 側で行う。ここでは PI 作成のみ。
 */
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }

  let body: { reservationId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const reservationId = (body.reservationId ?? "").trim();
  if (!reservationId) {
    return NextResponse.json({ ok: false, error: "missing_reservation" }, { status: 400 });
  }

  // 認証：ログインユーザー
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  // service role で予約 + 相談所を取得（PII / 他者所有テーブルを跨ぐため）
  const admin = await createAdminClient();
  const { data: resvRow } = await admin
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .maybeSingle();
  const reservation = resvRow as unknown as {
    id: string;
    user_id: string | null;
    agency_id: string | null;
    paid_at: string | null;
    stripe_payment_intent_id: string | null;
  } | null;

  if (!reservation) {
    return NextResponse.json({ ok: false, error: "reservation_not_found" }, { status: 404 });
  }
  // 予約本人のみ課金トリガー可
  if (reservation.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: "not_owner" }, { status: 403 });
  }
  // 二重課金防止
  if (reservation.paid_at || reservation.stripe_payment_intent_id) {
    return NextResponse.json({ ok: true, alreadyCharged: true });
  }
  if (!reservation.agency_id) {
    return NextResponse.json({ ok: false, error: "no_agency" }, { status: 400 });
  }

  const { data: agencyRow } = await admin
    .from("agencies")
    .select("*")
    .eq("id", reservation.agency_id)
    .maybeSingle();
  const agency = agencyRow as unknown as { stripe_customer_id: string | null } | null;
  const customerId = agency?.stripe_customer_id;
  if (!customerId) {
    return NextResponse.json({ ok: false, error: "agency_no_card" }, { status: 402 });
  }

  // 登録済みの支払い方法を解決（default → 無ければ最初のカード）
  const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
  let paymentMethodId: string | null = null;
  const def = customer.invoice_settings?.default_payment_method;
  if (typeof def === "string") paymentMethodId = def;
  else if (def && typeof def === "object") paymentMethodId = def.id;
  if (!paymentMethodId) {
    const pms = await stripe.paymentMethods.list({ customer: customerId, type: "card", limit: 1 });
    paymentMethodId = pms.data[0]?.id ?? null;
  }
  if (!paymentMethodId) {
    return NextResponse.json({ ok: false, error: "agency_no_card" }, { status: 402 });
  }

  try {
    const pi = await stripe.paymentIntents.create({
      amount: REFERRAL_FEE_JPY,
      currency: "jpy",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: { reservation_id: reservation.id },
      description: `Kinda 送客料 (予約 ${reservation.id})`,
    });

    // PI ID は先に控える（確定更新は webhook）
    await admin
      .from("reservations")
      .update({ stripe_payment_intent_id: pi.id } as never)
      .eq("id", reservation.id);

    return NextResponse.json({ ok: true, status: pi.status, paymentIntentId: pi.id });
  } catch (err) {
    // カードエラー等（残高不足・認証要求 など）
    const e = err as Stripe.errors.StripeError;
    return NextResponse.json(
      { ok: false, error: "charge_failed", code: e.code ?? null, message: e.message ?? null },
      { status: 402 },
    );
  }
}
