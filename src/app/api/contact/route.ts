import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

// cookies() を読むため動的・Node ランタイム（resend SDK 利用）
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORT_INBOX = "hello@kinda.jp";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // ハニーポット（bot は hidden の company を埋めがち）→ 成功を装って破棄
  if (body.company && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim();

  if (message.length < 5) {
    return NextResponse.json({ ok: false, error: "message_too_short" }, { status: 400 });
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "message_too_long" }, { status: 400 });
  }

  // ログイン中なら送信者の種別（会員 / カウンセラー / 相談所オーナー）を特定する
  let kind = "未ログイン";
  let nickname: string | null = null;
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      kind = "会員";

      const { data: ownedCounselors } = await supabase
        .from("counselors")
        .select("id")
        .eq("owner_user_id", user.id)
        .limit(1);
      const { data: ownedAgencies } = await supabase
        .from("agencies")
        .select("id")
        .eq("owner_user_id", user.id)
        .limit(1);
      if ((ownedAgencies?.length ?? 0) > 0) kind = "相談所オーナー";
      else if ((ownedCounselors?.length ?? 0) > 0) kind = "カウンセラー";

      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();
      const nn = (profile as { nickname: string | null } | null)?.nickname;
      if (nn && nn.trim()) nickname = nn.trim();
    }
  } catch {
    // 認証情報が取れなくても問い合わせ自体は送る（種別は「未ログイン」扱い）
  }

  const nowJst = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const displayName = name || nickname || "（名前未入力）";
  const subject = `[Kinda お問い合わせ] ${kind}・${displayName}`;

  const html = `
    <div style="font-family:sans-serif;line-height:1.8;color:#2E2620;">
      <h2 style="font-size:16px;margin:0 0 12px;">Kinda お問い合わせ</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">種別</td><td><strong>${escapeHtml(kind)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">お名前</td><td>${escapeHtml(name || "（未入力）")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">ニックネーム</td><td>${escapeHtml(nickname || "（なし）")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">メール</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">user_id</td><td>${escapeHtml(userId || "（未ログイン）")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#8a7;">受信日時</td><td>${escapeHtml(nowJst)} JST</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
      <div style="white-space:pre-wrap;font-size:14px;">${escapeHtml(message)}</div>
    </div>
  `;

  // 送信者のメールを Reply-To に入れて、Gmail からそのまま返信できるようにする
  const result = await sendEmail({
    to: SUPPORT_INBOX,
    subject,
    html,
    replyTo: email,
  });

  if ("skipped" in result || ("ok" in result && result.ok === false)) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
