import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COUNSELOR_APP_URL = "https://futarive-counselor.vercel.app";

type NotifyEvent = "cancel" | "reschedule_request" | "reschedule_approve";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtJst(iso: string | null): string {
  if (!iso) return "日時未定";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "日時未定";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

type ResvRow = {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_info_visible: boolean | null;
  created_at: string | null;
  counselor_name: string | null;
  agency_id: string | null;
  start_at: string | null;
  reschedule_proposed_start: string | null;
  reschedule_proposed_end: string | null;
};

const STRIPE_LAUNCH_AT = Date.parse("2026-06-14T00:00:00Z");
/** 連絡先開示済みか（決済済み or Stripe 導入前の旧予約）。相談所宛メールで本名を出すか判定。 */
function isDisclosed(r: ResvRow): boolean {
  if (r.user_info_visible) return true;
  if (!r.created_at) return true;
  return Date.parse(r.created_at) < STRIPE_LAUNCH_AT;
}

function wrap(inner: string): string {
  return `<div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">${inner}<p style="font-size:12px;color:#9a9088;margin-top:20px;">Kinda 運営事務局</p></div>`;
}
function ctaButton(): string {
  return `<p style="margin:24px 0;"><a href="${COUNSELOR_APP_URL}/reservations" style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px;">予約を確認する</a></p>`;
}

/**
 * 会員（ユーザー）がキャンセル / 日程変更 申請・承認 をしたときに、相手方の相談所へ通知する。
 * - client から RPC 成功後に best-effort で叩かれる（失敗してもユーザー操作は完了済み）。
 * - 認可：ログインユーザー本人の予約のときだけ送信する（成りすまし防止）。
 */
export async function POST(req: Request) {
  let body: { reservationId?: string; event?: NotifyEvent };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const reservationId = (body.reservationId ?? "").trim();
  const event = body.event;
  if (!reservationId || !event) {
    return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
  }

  // 認証（本人確認）
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  const admin = await createAdminClient();
  const { data: resvRow } = await admin
    .from("reservations")
    .select(
      "id, user_id, user_name, user_info_visible, created_at, counselor_name, agency_id, start_at, reschedule_proposed_start, reschedule_proposed_end",
    )
    .eq("id", reservationId)
    .maybeSingle();
  const r = resvRow as unknown as ResvRow | null;
  if (!r) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  // 本人の予約でなければ送らない（他人の予約 ID を投げ込まれても無視）
  if (r.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  // 宛先＝相談所メール。なければ送らない（モック/メール未設定の相談所）。
  if (!r.agency_id) {
    return NextResponse.json({ ok: true, skipped: "no_agency" });
  }
  const { data: ag } = await admin
    .from("agencies")
    .select("email")
    .eq("id", r.agency_id)
    .maybeSingle();
  const agencyEmail = (ag as { email: string | null } | null)?.email;
  if (!agencyEmail) {
    return NextResponse.json({ ok: true, skipped: "no_agency_email" });
  }

  const who = isDisclosed(r) ? r.user_name || "お客様" : "お客様";
  const counselor = r.counselor_name ? `（担当：${escapeHtml(r.counselor_name)}）` : "";

  let subject: string;
  let html: string;
  if (event === "cancel") {
    subject = "ご予約がキャンセルされました｜Kinda";
    html = wrap(
      `<p>${escapeHtml(who)} 様より、下記のご予約がキャンセルされました${counselor}。</p>
       <table style="font-size:14px;margin:8px 0;"><tr><td style="color:#8a7;padding-right:12px;">日時</td><td>${escapeHtml(fmtJst(r.start_at))}</td></tr></table>
       ${ctaButton()}`,
    );
  } else if (event === "reschedule_request") {
    subject = "日程変更の申請が届きました｜Kinda";
    html = wrap(
      `<p>${escapeHtml(who)} 様より、下記のご予約について日程変更の申請が届きました${counselor}。管理画面からご確認のうえ、ご対応ください。</p>
       <table style="font-size:14px;margin:8px 0;">
         <tr><td style="color:#8a7;padding-right:12px;">現在の日時</td><td>${escapeHtml(fmtJst(r.start_at))}</td></tr>
         <tr><td style="color:#8a7;padding-right:12px;">希望の日時</td><td>${escapeHtml(fmtJst(r.reschedule_proposed_start))}</td></tr>
       </table>
       ${ctaButton()}`,
    );
  } else if (event === "reschedule_approve") {
    subject = "日程変更が承認されました｜Kinda";
    html = wrap(
      `<p>${escapeHtml(who)} 様が日程変更を承認し、新しい日時でご予約が確定しました${counselor}。</p>
       <table style="font-size:14px;margin:8px 0;"><tr><td style="color:#8a7;padding-right:12px;">確定した日時</td><td>${escapeHtml(fmtJst(r.reschedule_proposed_start))}</td></tr></table>
       ${ctaButton()}`,
    );
  } else {
    return NextResponse.json({ ok: false, error: "unknown_event" }, { status: 400 });
  }

  const result = await sendEmail({ to: agencyEmail, subject, html });
  return NextResponse.json({ ok: true, mail: result });
}
