import { NextRequest, NextResponse } from "next/server";
import { getAllColumns } from "@/lib/columns";
import { STORIES } from "@/lib/mock/stories";

/**
 * admin(futarive-admin)からKinda voices・Kinda storyの本数と一覧を確認するための
 * 読み取り専用API。site側は自分のファイル（content/columns/*.mdx・stories.ts）を
 * 直接読めるが、admin は別デプロイのため、この公開エンドポイント経由で参照する。
 * 書き込み経路は増やさない（作成・編集はこれまで通りClaude/コードで行う）。
 *
 * 中身自体は既にサイト上（/columns・/kinda-story）で公開されている情報だが、
 * 誰でも一覧形式で取得できる状態は避けるため、共有シークレットで認証する。
 * admin からは admin 自身のサーバー経由（/api/content-index プロキシ）でのみ呼び出す。
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const expected = process.env.CONTENT_INDEX_KEY;
  if (!expected) {
    // env未設定でもビルドは通す。実行時のみ、鍵なしでは中身を返さない（フェイルクローズ）。
    return NextResponse.json({ error: "server_not_configured" }, { status: 500 });
  }
  const provided = req.headers.get("x-content-index-key");
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const columns = await getAllColumns();

  const voices = columns
    .filter((c) => c.category === "取材レポート")
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      author: c.author,
      publishedAt: c.publishedAt,
    }));

  const otherColumns = columns
    .filter((c) => c.category !== "取材レポート")
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      category: c.category,
      publishedAt: c.publishedAt,
    }));

  const stories = STORIES.map((s) => ({
    id: s.id,
    title: s.title,
    stage: s.stage,
    date: s.date,
    agencyName: s.agencyId === 0 ? null : s.agencyName,
    consentRecorded: !!s.consent,
  }));

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    voices,
    columns: otherColumns,
    stories,
  });
}
