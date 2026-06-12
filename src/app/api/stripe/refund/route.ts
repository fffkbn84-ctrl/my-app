import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 例外返金（運営判断）。返金は原則なし・やむを得ない場合のみ運営が個別返金する方針
 * （CLAUDE.md §12）。admin ユーザーのみ実行可。
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

  // 認証＋admin 権限チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }
  const admin = await createAdminClient();
  const { data: adminRow } = await admin
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!adminRow || (adminRow as { role: string }).role !== "admin") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const { data: resvRow } = await admin
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .maybeSingle();
  const reservation = resvRow as unknown as {
    id: string;
    stripe_payment_intent_id: string | null;
    refunded_at: string | null;
  } | null;
  if (!reservation) {
    return NextResponse.json({ ok: false, error: "reservation_not_found" }, { status: 404 });
  }
  if (reservation.refunded_at) {
    return NextResponse.json({ ok: true, alreadyRefunded: true });
  }
  if (!reservation.stripe_payment_intent_id) {
    return NextResponse.json({ ok: false, error: "not_paid" }, { status: 400 });
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: reservation.stripe_payment_intent_id,
    });
    await admin
      .from("reservations")
      .update({
        refunded_at: new Date().toISOString(),
        stripe_refund_id: refund.id,
      } as never)
      .eq("id", reservation.id);
    return NextResponse.json({ ok: true, refundId: refund.id });
  } catch (err) {
    const e = err as Stripe.errors.StripeError;
    return NextResponse.json({ ok: false, error: "refund_failed", message: e.message ?? null }, { status: 500 });
  }
}
