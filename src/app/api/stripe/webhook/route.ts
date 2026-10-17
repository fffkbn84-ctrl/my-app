import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { confirmReservationPaid, escapeHtml, fmtJst } from "@/lib/billing/confirmReservationPaid";

const SUPPORT_INBOX = "hello@kinda.jp";

/**
 * チャージバック（相談所がカード会社に申し立て）を運営に知らせる。
 * 期限までに Stripe ダッシュボードで反論しないと自動で負けになり、¥1,500 の手数料もかかる。
 */
async function notifyDispute(
  admin: Awaited<ReturnType<typeof createAdminClient>>,
  dispute: Stripe.Dispute,
): Promise<void> {
  const piId = typeof dispute.payment_intent === "string" ? dispute.payment_intent : dispute.payment_intent?.id ?? null;
  let reservationId: string | null = null;
  let agencyName: string | null = null;
  if (piId) {
    const { data } = await admin
      .from("reservations")
      .select("id, agency_name")
      .eq("stripe_payment_intent_id", piId)
      .maybeSingle();
    const row = data as { id: string; agency_name: string | null } | null;
    reservationId = row?.id ?? null;
    agencyName = row?.agency_name ?? null;
  }
  // 充当のもとになった課金への申し立てなら、まだ使っていない充当を取り消す（契約書 第6条第5項）。
  // 元の課金は充当に写してある（049）。日程変更で予約が替わっていても課金の ID で見つかる
  let revokedCredits = 0;
  if (piId) {
    const { data: revoked } = await admin
      .from("agency_credits")
      .update({
        status: "revoked",
        revoked_at: new Date().toISOString(),
        admin_note: `チャージバック ${dispute.id} により取り消し`,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("source_payment_intent_id", piId)
      .eq("status", "available")
      .select("id");
    revokedCredits = (revoked as { id: string }[] | null)?.length ?? 0;
  }
  const dueBy = dispute.evidence_details?.due_by
    ? fmtJst(new Date(dispute.evidence_details.due_by * 1000).toISOString())
    : "（Stripe で確認）";
  const rows = [
    ["予約ID", reservationId ?? "（見つかりません）"],
    ["相談所", agencyName ?? "—"],
    ["金額", `¥${dispute.amount.toLocaleString("ja-JP")}`],
    ["理由", dispute.reason],
    ["反論の期限", dueBy],
    ["Stripe の ID", dispute.id],
    ...(revokedCredits > 0 ? [["取り消した充当", `${revokedCredits} 件（未使用だった分）`]] : []),
  ]
    .map(([k, v]) => `<tr><td style="color:#8a7;padding-right:12px;">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  await sendEmail({
    to: SUPPORT_INBOX,
    subject: "【要対応】チャージバック（支払いへの異議）が届きました｜Kinda",
    html: `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
      <p>相談所のカード会社から、送客料の支払いに異議が出されました。金額はいったん Stripe の残高から引かれています。</p>
      <table style="font-size:14px;margin:8px 0;">${rows}</table>
      <p>期限までに Stripe ダッシュボードの「不審請求の申し立て」から、予約の記録と規約を出して反論してください。手順は docs/ops/billing-and-refunds.md §3。</p>
      <p style="margin:24px 0;"><a href="https://dashboard.stripe.com/disputes/${encodeURIComponent(dispute.id)}" style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;">Stripe で開く</a></p>
    </div>`,
  }).catch(() => {});
}

/**
 * カードへの返金が失敗した（カードの解約・期限切れなど）。失敗した額は Stripe の残高に戻っている。
 * 契約書 第6条第5項のとおり、相談所の口座への振込で返す必要がある。
 */
async function notifyRefundFailed(
  admin: Awaited<ReturnType<typeof createAdminClient>>,
  refund: Stripe.Refund,
): Promise<void> {
  const piId = typeof refund.payment_intent === "string" ? refund.payment_intent : refund.payment_intent?.id ?? null;
  let reservationId: string | null = null;
  let agencyName: string | null = null;
  if (piId) {
    const { data } = await admin
      .from("reservations")
      .select("id, agency_name")
      .eq("stripe_payment_intent_id", piId)
      .maybeSingle();
    const row = data as { id: string; agency_name: string | null } | null;
    reservationId = row?.id ?? null;
    agencyName = row?.agency_name ?? null;
  }
  const rows = [
    ["予約ID", reservationId ?? "（見つかりません）"],
    ["相談所", agencyName ?? "—"],
    ["金額", `¥${refund.amount.toLocaleString("ja-JP")}`],
    ["失敗の理由", refund.failure_reason ?? "—"],
    ["Stripe の返金 ID", refund.id],
  ]
    .map(([k, v]) => `<tr><td style="color:#8a7;padding-right:12px;">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  await sendEmail({
    to: SUPPORT_INBOX,
    subject: "【要対応】カードへの返金ができませんでした｜Kinda",
    html: `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
      <p>相談所のカードへの返金が失敗しました。金額は Stripe の残高に戻っています。</p>
      <table style="font-size:14px;margin:8px 0;">${rows}</table>
      <p>相談所に名義の銀行口座を聞いて、振込で返してください（振込手数料は Kinda の負担）。手順は docs/ops/billing-and-refunds.md。</p>
      <p style="font-size:12px;color:#9a9088;">予約には返金済み（refunded_at）が入っていることがあります。振込が済むまで、記録の上では未返金として扱ってください。</p>
    </div>`,
  }).catch(() => {});
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe Webhook。
 * - payment_intent.succeeded → 予約を paid_at / user_info_visible=true に更新（相談所に連絡先開示）。
 *   後始末は充当のときと共通（lib/billing/confirmReservationPaid）。
 * - charge.refunded → 予約を refunded_at に更新。
 * - charge.dispute.created → 運営（hello@kinda.jp）に要対応メール。未使用の充当は取り消す。
 * - refund.failed → 運営に要対応メール（振込で返す）。
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
        // 支払い済みへの更新・連絡先の開示・確定メールは充当のときと共通（lib/billing/confirmReservationPaid）
        await confirmReservationPaid(admin, reservationId, { kind: "card", paymentIntentId: pi.id });
      }
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      const refundId = charge.refunds?.data?.[0]?.id ?? null;
      if (piId) {
        const { data: resvRow } = await admin
          .from("reservations")
          .select("id")
          .eq("stripe_payment_intent_id", piId)
          .maybeSingle();
        const refundedReservationId = (resvRow as { id: string } | null)?.id ?? null;
        await admin
          .from("reservations")
          .update({
            refunded_at: new Date().toISOString(),
            stripe_refund_id: refundId,
          } as never)
          .eq("stripe_payment_intent_id", piId);
        // 返金 → 請求台帳を無効化（請求対象から外す）
        if (refundedReservationId) {
          await admin
            .from("billing_events")
            .update({ status: "voided", paid_at: null } as never)
            .eq("reservation_id", refundedReservationId);
        }
      }
    } else if (event.type === "charge.dispute.created") {
      await notifyDispute(admin, event.data.object as Stripe.Dispute);
    } else if (event.type === "refund.failed") {
      await notifyRefundFailed(admin, event.data.object as Stripe.Refund);
    }
  } catch (err) {
    const e = err as Error;
    // 失敗しても 200 を返すと Stripe が再送しないため、5xx で再送を促す
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
