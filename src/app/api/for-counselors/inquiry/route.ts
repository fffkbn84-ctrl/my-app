import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

// service_role で counselor_inquiries に挿入するため Node・動的。
// counselor_inquiries は Database 型に未登録の新規テーブルなので untyped クライアントを使う（/api/notify と同方針）。
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORT_INBOX = "hello@kinda.jp";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 簡易レート制限（同一 IP からの短時間の連投を弾く・プロセス内メモリのみ）。
// 冪等な永続化ではないが、フォーム bot の連投抑止には十分。
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  // Map の肥大を防ぐ簡易 GC
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return arr.length > RATE_MAX;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // 1. ハニーポット → 成功を装って何もしない（bot に失敗を知らせない）
  const companyUrl = typeof body.company_url === "string" ? body.company_url.trim() : "";
  if (companyUrl.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2. サーバー側バリデーション（クライアント検証を信用しない）
  // 用件（inquiry_type）。不正値はエラーにせず interview にフォールバック（取りこぼさない方針）。
  const ALLOWED_TYPES = ["interview", "listing", "other"] as const;
  const inquiryTypeRaw = String(body.inquiry_type ?? "interview").trim();
  const inquiryType = (ALLOWED_TYPES as readonly string[]).includes(inquiryTypeRaw)
    ? inquiryTypeRaw
    : "interview";

  const agencyName = String(body.agency_name ?? "").trim().slice(0, 200);
  const contactName = String(body.contact_name ?? "").trim().slice(0, 100);
  const emailRaw = String(body.email ?? "").trim().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 50);
  const prefecture = String(body.prefecture ?? "").trim().slice(0, 20);
  const website = String(body.website ?? "").trim().slice(0, 500);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!agencyName) {
    return NextResponse.json({ ok: false, error: "agency_name_required" }, { status: 400 });
  }
  if (!contactName) {
    return NextResponse.json({ ok: false, error: "contact_name_required" }, { status: 400 });
  }
  if (!emailRaw || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // 3. 簡易レート制限
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // 4. Supabase へ INSERT（service_role）。問い合わせを取りこぼさないことを最優先。
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("[for-counselors/inquiry] supabase env not configured");
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey);
  const { error: insertError } = await supabase.from("counselor_inquiries").insert({
    inquiry_type: inquiryType,
    agency_name: agencyName,
    contact_name: contactName,
    email: emailRaw,
    phone: phone || null,
    prefecture: prefecture || null,
    website: website || null,
    message: message || null,
    source: "for-counselors",
  });

  if (insertError) {
    console.error("[for-counselors/inquiry] insert error:", insertError.message);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  // 5 & 6. メール送信（取引メール＝Resend 規約 OK）。失敗しても INSERT 済みなので 200 を返す。
  const nowJst = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  // 用件に応じた表示ラベル
  const subjectPrefix =
    inquiryType === "interview"
      ? "取材のお問い合わせ"
      : inquiryType === "listing"
        ? "掲載のお問い合わせ"
        : "お問い合わせ";
  const inquiryTypeLabel =
    inquiryType === "interview"
      ? "取材について"
      : inquiryType === "listing"
        ? "掲載について"
        : "その他";

  // (a) 運営宛通知（Reply-To は送信者）
  const adminHtml = `
    <div style="font-family:sans-serif;line-height:1.8;color:#2A2A2A;">
      <h2 style="font-size:16px;margin:0 0 12px;">${escapeHtml(subjectPrefix)}</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">ご用件</td><td><strong>${escapeHtml(inquiryTypeLabel)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">相談所名</td><td><strong>${escapeHtml(agencyName)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">ご担当者名</td><td>${escapeHtml(contactName)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">メール</td><td>${escapeHtml(emailRaw)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">電話番号</td><td>${escapeHtml(phone || "（未入力）")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">所在地</td><td>${escapeHtml(prefecture || "（未入力）")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">ウェブサイト</td><td>${escapeHtml(website || "（未入力）")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">受信日時</td><td>${escapeHtml(nowJst)} JST</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
      <div style="white-space:pre-wrap;font-size:14px;">${escapeHtml(message || "（ご質問・ご要望の記載なし）")}</div>
    </div>
  `;

  try {
    const notifyResult = await sendEmail({
      to: SUPPORT_INBOX,
      subject: `[Kinda] ${subjectPrefix}：${agencyName}`,
      html: adminHtml,
      replyTo: emailRaw,
    });
    if ("ok" in notifyResult && notifyResult.ok === false) {
      console.error("[for-counselors/inquiry] admin notify failed");
    }
  } catch (e) {
    console.error("[for-counselors/inquiry] admin notify threw:", e);
  }

  // (b) 送信者への自動返信（Reply-To は hello@kinda.jp）
  const replyClosing =
    inquiryType === "interview"
      ? `<p>3営業日以内に、取材の日程についてご連絡いたします。<br>取材はオンライン（Google Meet）で60分ほどです。費用はいただきません。<br>Kinda への掲載は取材の条件ではありませんので、その点はご安心ください。</p>`
      : `<p>3営業日以内に、運営よりご返信いたします。</p>`;

  const autoReplyHtml = `
    <div style="font-family:sans-serif;line-height:1.9;color:#2A2A2A;font-size:14px;">
      <p>${escapeHtml(contactName)} 様</p>
      <p>Kinda へお問い合わせいただきありがとうございます。<br>以下の内容で承りました。</p>
      <table style="border-collapse:collapse;font-size:14px;margin:12px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">相談所名</td><td>${escapeHtml(agencyName)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">ご担当者名</td><td>${escapeHtml(contactName)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">ご連絡先</td><td>${escapeHtml(emailRaw)}</td></tr>
      </table>
      ${replyClosing}
      <p>お急ぎの場合は、このメールにそのままご返信ください。</p>
      <p style="margin-top:18px;">Kinda<br><a href="https://kinda.jp" style="color:#B8806E;">https://kinda.jp</a></p>
    </div>
  `;

  const replySubject =
    inquiryType === "interview"
      ? "取材のお問い合わせありがとうございます（Kinda）"
      : "お問い合わせありがとうございます（Kinda）";

  try {
    const replyResult = await sendEmail({
      to: emailRaw,
      subject: replySubject,
      html: autoReplyHtml,
      replyTo: SUPPORT_INBOX,
    });
    if ("ok" in replyResult && replyResult.ok === false) {
      console.error("[for-counselors/inquiry] auto-reply failed");
    }
  } catch (e) {
    console.error("[for-counselors/inquiry] auto-reply threw:", e);
  }

  return NextResponse.json({ ok: true });
}
