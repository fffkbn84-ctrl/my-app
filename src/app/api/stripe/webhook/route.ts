import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";
const COUNSELOR_APP_URL = "https://futarive-counselor.vercel.app";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function fmtJst(iso: string | null): string {
  if (!iso) return "日時未定";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "日時未定";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric",
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
}

type ResvForMail = {
  id: string;
  user_email: string | null;
  user_name: string | null;
  user_phone: string | null;
  counselor_name: string | null;
  agency_name: string | null;
  agency_id: string | null;
  start_at: string | null;
};

/** 決済確定時の通知メール（ユーザー＝確定通知 / 相談所＝新規予約・連絡先開示）。失敗は握りつぶす。 */
async function sendReservationConfirmedEmails(
  admin: Awaited<ReturnType<typeof createAdminClient>>,
  r: ResvForMail,
): Promise<void> {
  const dt = fmtJst(r.start_at);
  const who = [r.agency_name, r.counselor_name].filter((x): x is string => !!x).map(escapeHtml).join(" / ") || "担当カウンセラー";

  // ユーザー宛：予約確定
  if (r.user_email) {
    const greeting = r.user_name ? `${escapeHtml(r.user_name)} 様` : "こんにちは";
    await sendEmail({
      to: r.user_email,
      subject: "ご予約が確定しました｜Kinda ふたりへ",
      html: `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
        <p>${greeting}</p>
        <p>${who} さんとのご予約が確定しました。当日はどうぞ落ち着いてお越しください。</p>
        <table style="font-size:14px;margin:8px 0;"><tr><td style="color:#8a7;padding-right:12px;">日時</td><td>${escapeHtml(dt)}</td></tr></table>
        <p style="margin:24px 0;"><a href="${SITE_URL}/mypage" style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;">マイページで確認する</a></p>
        <p style="font-size:12px;color:#9a9088;">日時の確認・変更・キャンセルはマイページからできます。Kinda ふたりへ</p>
      </div>`,
    }).catch(() => {});
  }

  // 相談所宛：新規予約＋連絡先開示
  if (r.agency_id) {
    const { data: ag } = await admin.from("agencies").select("email").eq("id", r.agency_id).maybeSingle();
    const agencyEmail = (ag as { email: string | null } | null)?.email;
    if (agencyEmail) {
      const contactRows = [
        `<tr><td style="color:#8a7;padding-right:12px;">お名前</td><td>${escapeHtml(r.user_name || "（未入力）")}</td></tr>`,
        `<tr><td style="color:#8a7;padding-right:12px;">メール</td><td>${escapeHtml(r.user_email || "（未入力）")}</td></tr>`,
        r.user_phone ? `<tr><td style="color:#8a7;padding-right:12px;">電話</td><td>${escapeHtml(r.user_phone)}</td></tr>` : "",
        `<tr><td style="color:#8a7;padding-right:12px;">日時</td><td>${escapeHtml(dt)}</td></tr>`,
      ].join("");
      await sendEmail({
        to: agencyEmail,
        subject: "新しいご予約が入りました｜Kinda",
        html: `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
          <p>新しいご予約が確定し、送客料（¥5,500 税込）の決済が完了しました。お客様の連絡先を開示します。</p>
          <table style="font-size:14px;margin:8px 0;">${contactRows}</table>
          <p style="margin:24px 0;"><a href="${COUNSELOR_APP_URL}/reservations" style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;">予約を確認する</a></p>
          <p style="font-size:12px;color:#9a9088;">Kinda 運営事務局</p>
        </div>`,
      }).catch(() => {});
    }
  }
}

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
        // 先に現状取得（メール二重送信防止のため paid_at の有無を確認）
        const { data: beforeRow } = await admin
          .from("reservations")
          .select("*")
          .eq("id", reservationId)
          .maybeSingle();
        const before = beforeRow as unknown as (ResvForMail & { paid_at: string | null }) | null;
        const wasAlreadyPaid = !!before?.paid_at;

        await admin
          .from("reservations")
          .update({
            stripe_payment_intent_id: pi.id,
            paid_at: new Date().toISOString(),
            user_info_visible: true,
          } as never)
          .eq("id", reservationId);
        // 請求台帳(billing_events)も「確定＋支払い済み」に同期（既に無効化された行は除く）
        await admin
          .from("billing_events")
          .update({ status: "confirmed", paid_at: new Date().toISOString() } as never)
          .eq("reservation_id", reservationId)
          .neq("status", "voided");

        // 初回確定時のみ通知メール（イベント再送・重複では送らない）
        if (before && !wasAlreadyPaid) {
          await sendReservationConfirmedEmails(admin, before);
        }
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
    }
  } catch (err) {
    const e = err as Error;
    // 失敗しても 200 を返すと Stripe が再送しないため、5xx で再送を促す
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
