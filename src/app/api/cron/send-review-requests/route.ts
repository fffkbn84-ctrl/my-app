import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

// service role / cookies / resend を使うため Node・動的
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";
const SUPPORT_REPLY_TO = "hello@kinda.jp";

// 初回デプロイ時に過去の completed 予約へ大量送信しないための保険（直近この日数だけ対象）
const WINDOW_DAYS = 14;
// 1 回の実行で送る上限
const BATCH_LIMIT = 50;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(args: {
  userName: string | null;
  counselorName: string | null;
  agencyName: string | null;
  reviewUrl: string;
}): string {
  const greeting = args.userName ? `${escapeHtml(args.userName)} さん` : "こんにちは";
  const who = [args.agencyName, args.counselorName]
    .filter((x): x is string => !!x)
    .map(escapeHtml)
    .join(" / ");
  const whoLine = who
    ? `先日は ${who} さんとの面談、おつかれさまでした。`
    : "先日の面談、おつかれさまでした。";
  return `
  <div style="font-family:sans-serif;line-height:1.9;color:#2E2620;max-width:560px;">
    <p>${greeting}</p>
    <p>${whoLine}</p>
    <p>もしよければ、その時間の感想を聞かせてください。<br>
      あなたの言葉は、これから同じように誰かを探している人の助けになります。</p>
    <p style="margin:28px 0;">
      <a href="${args.reviewUrl}"
         style="display:inline-block;background:#D4A090;color:#fff;text-decoration:none;
                padding:13px 26px;border-radius:24px;font-size:15px;">
        面談の感想を書く
      </a>
    </p>
    <p style="font-size:13px;color:#7a6f64;">
      急かすつもりはありません。書ける時に、書ける範囲で大丈夫です。<br>
      （投稿は面談から30日以内に受け付けています。）
    </p>
    <p style="font-size:12px;color:#9a9088;margin-top:24px;">
      このメールに心当たりがない場合は、破棄していただいてかまいません。<br>
      Kinda ふたりへ
    </p>
  </div>`;
}

export async function GET(req: Request) {
  // Vercel Cron は CRON_SECRET 設定時に Authorization: Bearer <CRON_SECRET> を付与する
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // 送信対象：completed・未送信・直近・メールあり
  const { data: rows, error } = await supabase
    .from("reservations")
    .select("id, user_name, user_email, counselor_name, agency_name, completed_at")
    .eq("status", "completed")
    .is("review_request_sent_at", null)
    .gte("completed_at", cutoff)
    .not("user_email", "is", null)
    .order("completed_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  type Row = {
    id: string;
    user_name: string | null;
    user_email: string | null;
    counselor_name: string | null;
    agency_name: string | null;
    completed_at: string | null;
  };
  const candidates = (rows ?? []) as Row[];

  // すでに口コミ投稿済みの予約は除外
  let alreadyReviewed = new Set<string>();
  if (candidates.length > 0) {
    const { data: reviewed } = await supabase
      .from("reviews")
      .select("reservation_id")
      .in(
        "reservation_id",
        candidates.map((c) => c.id),
      );
    alreadyReviewed = new Set(
      ((reviewed ?? []) as { reservation_id: string | null }[])
        .map((r) => r.reservation_id)
        .filter((x): x is string => !!x),
    );
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const r of candidates) {
    if (!r.user_email || alreadyReviewed.has(r.id)) {
      skipped++;
      continue;
    }
    const reviewUrl = `${SITE_URL}/reviews/new?reservation=${r.id}`;
    const result = await sendEmail({
      to: r.user_email,
      subject: "先日の面談はいかがでしたか｜Kinda ふたりへ",
      html: buildHtml({
        userName: r.user_name,
        counselorName: r.counselor_name,
        agencyName: r.agency_name,
        reviewUrl,
      }),
      replyTo: SUPPORT_REPLY_TO,
    });

    if ("ok" in result && result.ok) {
      // 送信成功したものだけ送信済みにマーク（失敗は次回再試行）
      await supabase
        .from("reservations")
        // review_request_sent_at は生成済み Database 型に未反映のためキャストで回避
        .update({ review_request_sent_at: new Date().toISOString() } as never)
        .eq("id", r.id);
      sent++;
    } else {
      // RESEND_API_KEY 未設定(skipped) や送信失敗
      failed++;
    }
  }

  return NextResponse.json({ ok: true, candidates: candidates.length, sent, failed, skipped });
}
