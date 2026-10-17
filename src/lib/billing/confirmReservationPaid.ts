import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

/**
 * 予約を「支払い済み」にして、相談所に連絡先を開示し、確定メールを送る（2026-10-17 切り出し）。
 *
 * 呼ぶところは2つ。どちらも同じ後始末をするため、ここを1つにしている。
 * - カードで課金できたとき：Stripe Webhook（payment_intent.succeeded）
 * - 充当で確定したとき：/api/stripe/charge（Stripe に課金しないので Webhook が来ない）
 *
 * 予約の paid_at が空のときだけ書き換える。同じ予約で2回呼ばれても、メールは最初の1回だけ。
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";
const COUNSELOR_APP_URL = "https://futarive-counselor.vercel.app";

type Admin = Awaited<ReturnType<typeof createAdminClient>>;

export type PaidVia = { kind: "card"; paymentIntentId: string } | { kind: "credit"; creditId: string };

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

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function fmtJst(iso: string | null): string {
  if (!iso) return "日時未定";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "日時未定";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric",
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
}

export async function confirmReservationPaid(
  admin: Admin,
  reservationId: string,
  via: PaidVia,
): Promise<{ firstTime: boolean }> {
  const now = new Date().toISOString();
  const piPatch = via.kind === "card" ? { stripe_payment_intent_id: via.paymentIntentId } : {};

  const { data: flippedRow, error } = await admin
    .from("reservations")
    .update({ ...piPatch, paid_at: now, user_info_visible: true } as never)
    .eq("id", reservationId)
    .is("paid_at", null)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`reservation_update_failed: ${error.message}`);

  if (!flippedRow) {
    // すでに支払い済み（Webhook の再送・同時の呼び出し）。PI の控えだけ合わせて終わる
    if (via.kind === "card") {
      await admin
        .from("reservations")
        .update({ ...piPatch, user_info_visible: true } as never)
        .eq("id", reservationId);
    }
    return { firstTime: false };
  }

  // 請求台帳(billing_events)も「確定＋支払い済み」に（既に無効化された行は除く）。
  // 充当のときは payment_method が card ではないので other にして、どの充当かを残す
  await admin
    .from("billing_events")
    .update({
      status: "confirmed",
      paid_at: now,
      ...(via.kind === "credit"
        ? { payment_method: "other", payment_note: `充当で確定（agency_credits ${via.creditId}）` }
        : {}),
    } as never)
    .eq("reservation_id", reservationId)
    .neq("status", "voided");

  await sendReservationConfirmedEmails(admin, flippedRow as unknown as ResvForMail, via.kind);
  return { firstTime: true };
}

/** 確定の通知メール（ユーザー＝確定通知 / 相談所＝新規予約・連絡先開示）。失敗は握りつぶす。 */
async function sendReservationConfirmedEmails(
  admin: Admin,
  r: ResvForMail,
  kind: PaidVia["kind"],
): Promise<void> {
  const dt = fmtJst(r.start_at);
  const who = [r.agency_name, r.counselor_name].filter((x): x is string => !!x).map(escapeHtml).join(" / ") || "担当カウンセラー";

  // ユーザー宛：予約確定（課金の方法はユーザーには関係ないので同じ文面）
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
      const lead =
        kind === "credit"
          ? "新しいご予約が確定しました。今回は、お預かりしている充当分を1件使いました（今回のカードへの課金はありません）。お客様の連絡先を開示します。"
          : "新しいご予約が確定し、送客料（¥5,500・税込）の決済が完了しました。お客様の連絡先を開示します。";
      await sendEmail({
        to: agencyEmail,
        subject: "新しいご予約が入りました｜Kinda",
        html: `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
          <p>${lead}</p>
          <table style="font-size:14px;margin:8px 0;">${contactRows}</table>
          <p style="margin:24px 0;"><a href="${COUNSELOR_APP_URL}/reservations" style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;">予約を確認する</a></p>
          <p style="font-size:12px;color:#9a9088;">Kinda 運営事務局</p>
        </div>`,
      }).catch(() => {});
    }
  }
}
