import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * お店の口コミ投稿の受け口。
 *
 * shop_reviews は RLS で SELECT しか許可していないため、書き込みは
 * ここ（service_role）経由のみ。/api/for-counselors/inquiry と同方針。
 *
 * 投稿は必ず is_published=false で入る（編集ゲート制）。公開の判断は運営が行う。
 * source_type は 'user' 固定。編集部の観測を入れる場合は管理画面から 'editorial' で入れる。
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_BODY = 20;
const MAX_BODY = 2000;
const TIMEFRAMES = ["平日昼", "平日夜", "土日昼", "土日夜"] as const;

// 簡易レート制限（プロセス内メモリ）。bot の連投抑止用。
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
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

  // 1. ハニーポット → 成功を装って捨てる
  const trap = typeof body.website === "string" ? body.website.trim() : "";
  if (trap.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2. サーバー側バリデーション（クライアント検証は信用しない）
  const shopId = String(body.shop_id ?? "").trim();
  const rating = Number(body.rating);
  const bodyText = String(body.body ?? "").trim().slice(0, MAX_BODY);
  const title = String(body.title ?? "").trim().slice(0, 120);
  const situation = String(body.situation ?? "").trim().slice(0, 50);
  const authorLabel = String(body.author_label ?? "").trim().slice(0, 50);
  const timeframeRaw = String(body.visited_timeframe ?? "").trim();
  const visitedTimeframe = (TIMEFRAMES as readonly string[]).includes(timeframeRaw)
    ? timeframeRaw
    : null;

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(shopId)) {
    return NextResponse.json({ ok: false, error: "invalid_shop_id" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "invalid_rating" }, { status: 400 });
  }
  if (bodyText.length < MIN_BODY) {
    return NextResponse.json({ ok: false, error: "body_too_short" }, { status: 400 });
  }

  // 3. レート制限
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("[shop-reviews] supabase env not configured");
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey);

  // 4. 存在しない店への投稿を弾く（FK 違反を 500 にせず 400 で返すため）
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("id", shopId)
    .maybeSingle();
  if (!shop) {
    return NextResponse.json({ ok: false, error: "shop_not_found" }, { status: 404 });
  }

  const { error: insertError } = await supabase.from("shop_reviews").insert({
    shop_id: shopId,
    source_type: "user",
    rating,
    situation: situation || null,
    title: title || null,
    body: bodyText,
    author_label: authorLabel || null,
    visited_timeframe: visitedTimeframe,
    // 既定で非公開。運営が確認してから公開する
    is_published: false,
  });

  if (insertError) {
    console.error("[shop-reviews] insert error:", insertError.message);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
