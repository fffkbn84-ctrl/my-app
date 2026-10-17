import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe, REFERRAL_FEE_JPY } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { confirmReservationPaid } from "@/lib/billing/confirmReservationPaid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORT_INBOX = "hello@kinda.jp";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * 課金できなかったことを運営に知らせる。
 * 課金が通らないと webhook が来ず、相談所に連絡先が開示されず、確定メールも出ない。
 * ユーザーには予約完了と表示されるため、運営が気づかないと予約が宙に浮く。
 * 送信失敗はレスポンスに影響させない。ユーザーの個人情報は載せない。
 */
async function notifyChargeFailure(p: {
  reservationId: string;
  agencyId: string | null;
  agencyName: string | null;
  reason: string;
  detail?: string | null;
}): Promise<void> {
  const rows = [
    ["予約ID", p.reservationId],
    ["相談所", p.agencyName ? `${p.agencyName}（${p.agencyId}）` : p.agencyId ?? "（なし）"],
    ["理由", p.reason],
    ["詳細", p.detail ?? "—"],
  ]
    .map(([k, v]) => `<tr><td style="color:#8a7;padding-right:12px;">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  await sendEmail({
    to: SUPPORT_INBOX,
    subject: "【要対応】送客料の課金ができませんでした｜Kinda",
    html: `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
      <p>予約は成立していますが、送客料（¥5,500・税込）の処理（カードの課金、または充当の利用）が完了しませんでした。相談所への連絡先開示と確定メールが止まっている可能性があります。</p>
      <table style="font-size:14px;margin:8px 0;">${rows}</table>
      <p style="font-size:12px;color:#9a9088;">相談所にカードの登録・更新を依頼し、Stripe で課金できたら webhook で開示されます。</p>
    </div>`,
  }).catch(() => {});
}

/**
 * 予約成立で相談所カードに即時 ¥5,500（税込）を off_session 課金する。
 * - 呼び出しは予約本人（ログインユーザー）に限定。
 * - 相談所が Stripe Customer + カード登録済みであることが前提（未登録は 402）。
 * - 二重課金防止：paid_at / stripe_payment_intent_id があればスキップ＋Stripe の idempotency key。
 * - DB の確定更新（paid_at / user_info_visible）は Webhook 側で行う。ここでは PI 作成のみ。
 * - ただし相談所に未使用の充当があれば課金せず、充当を使ってここで確定する（2026-10-17）。
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
  const agency = agencyRow as unknown as { name: string | null; stripe_customer_id: string | null } | null;
  const failure = (reason: string, detail?: string | null) =>
    notifyChargeFailure({
      reservationId: reservation.id,
      agencyId: reservation.agency_id,
      agencyName: agency?.name ?? null,
      reason,
      detail,
    });

  // 充当（返金に代えて次の予約1件分に充てる・2026-10-17）。未使用の充当があれば課金せずに1件使う。
  // 課金しないので Webhook は来ない。支払い済み・連絡先の開示・確定メールはここで起こす（Webhook と同じ関数）。
  // 充当の確認ができないときは課金しない（充当があるのに課金してしまうのを避ける）。運営に知らせる。
  const { data: creditId, error: creditErr } = await admin.rpc("consume_agency_credit" as never, {
    p_agency_id: reservation.agency_id,
    p_reservation_id: reservation.id,
  } as never);
  if (creditErr) {
    await failure("充当の確認ができませんでした（課金は止めています）", creditErr.message);
    return NextResponse.json({ ok: false, error: "credit_check_failed" }, { status: 500 });
  }
  if (typeof creditId === "string" && creditId) {
    try {
      await confirmReservationPaid(admin, reservation.id, { kind: "credit", creditId });
    } catch (err) {
      await failure("充当は使いましたが、予約の確定処理に失敗しました", (err as Error).message);
      return NextResponse.json({ ok: false, error: "credit_confirm_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, paidWithCredit: true });
  }

  const customerId = agency?.stripe_customer_id;
  if (!customerId) {
    await failure("相談所にカードが登録されていません");
    return NextResponse.json({ ok: false, error: "agency_no_card" }, { status: 402 });
  }

  // 登録済みの支払い方法を解決（default → 無ければ最初のカード）。
  // 顧客がいまの Stripe モードに存在しない（テストで作った顧客を本番キーで引く等）・削除済みの場合も
  // ここで受け止め、500 ではなく agency_no_card として返す。
  let paymentMethodId: string | null = null;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      await failure("Stripe の顧客が削除されています", customerId);
      return NextResponse.json({ ok: false, error: "agency_no_card" }, { status: 402 });
    }
    const def = customer.invoice_settings?.default_payment_method;
    if (typeof def === "string") paymentMethodId = def;
    else if (def && typeof def === "object") paymentMethodId = def.id;
    if (!paymentMethodId) {
      const pms = await stripe.paymentMethods.list({ customer: customerId, type: "card", limit: 1 });
      paymentMethodId = pms.data[0]?.id ?? null;
    }
  } catch (err) {
    const e = err as Stripe.errors.StripeError;
    await failure("Stripe の顧客を取得できません（テストと本番のモード違いの可能性）", e.message ?? null);
    return NextResponse.json(
      { ok: false, error: "agency_no_card", code: e.code ?? null },
      { status: 402 },
    );
  }
  if (!paymentMethodId) {
    await failure("相談所のカードが見つかりません", customerId);
    return NextResponse.json({ ok: false, error: "agency_no_card" }, { status: 402 });
  }

  try {
    // 同じ予約への課金がほぼ同時に2回届いても、上の DB チェックは両方とも通ってしまう。
    // Stripe 側で「予約×カード」につき1回に絞る（キーは24時間有効）。
    // カードを登録し直せば支払い方法が変わりキーも変わるので、失敗後の再課金は塞がない。
    const pi = await stripe.paymentIntents.create(
      {
        amount: REFERRAL_FEE_JPY,
        currency: "jpy",
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: { reservation_id: reservation.id },
        description: `Kinda 送客料 (予約 ${reservation.id})`,
      },
      { idempotencyKey: `referral-fee:${reservation.id}:${paymentMethodId}` },
    );

    // PI ID は先に控える（確定更新は webhook）
    await admin
      .from("reservations")
      .update({ stripe_payment_intent_id: pi.id } as never)
      .eq("id", reservation.id);

    return NextResponse.json({ ok: true, status: pi.status, paymentIntentId: pi.id });
  } catch (err) {
    // カードエラー等（残高不足・認証要求 など）
    const e = err as Stripe.errors.StripeError;
    // 同じキーの課金がまだ処理中＝もう1本が課金している最中。失敗ではないので運営に知らせない。
    if (e.type === "StripeIdempotencyError") {
      return NextResponse.json({ ok: true, alreadyCharged: true });
    }
    await failure("カードで課金できませんでした（残高不足・認証要求など）", [e.code, e.message].filter(Boolean).join(" / ") || null);
    return NextResponse.json(
      { ok: false, error: "charge_failed", code: e.code ?? null, message: e.message ?? null },
      { status: 402 },
    );
  }
}
