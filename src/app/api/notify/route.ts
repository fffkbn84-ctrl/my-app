import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// service_role で notify_signups に挿入するため Node・動的。
// notify_signups は Database 型に未登録の新規テーブルなので、
// 既存の typed クライアント（createAdminClient）ではなく untyped クライアントを使う。
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    // env 未設定でもビルドは通す。実行時のみ 500。
    return NextResponse.json({ error: "server_not_configured" }, { status: 500 });
  }

  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const supabase = createClient(url, serviceKey);
    const { error } = await supabase
      .from("notify_signups")
      .insert({ email: email.trim().toLowerCase(), source: "talk_empty" });

    // 23505 = unique 違反（既に登録済み）。冪等にするため成功扱い。
    if (error && error.code !== "23505") {
      console.error("notify insert error:", error.message);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
