import { NextResponse } from "next/server";
import { getAllColumns } from "@/lib/columns";
import { STORIES } from "@/lib/mock/stories";

/**
 * admin(futarive-admin)からKinda voices・Kinda storyの本数と一覧を確認するための
 * 読み取り専用API。site側は自分のファイル（content/columns/*.mdx・stories.ts）を
 * 直接読めるが、admin は別デプロイのため、この公開エンドポイント経由で参照する。
 * 書き込み経路は増やさない（作成・編集はこれまで通りClaude/コードで行う）。
 */
export const dynamic = "force-dynamic";

export async function GET() {
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
