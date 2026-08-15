import type { MetadataRoute } from "next";
import { COUNSELORS } from "@/lib/data";
import { STORIES } from "@/lib/mock/stories";
import { KINDA_TYPE_KEYS } from "@/lib/kinda-types";
import { getAllWeathers } from "@/app/kinda-note/data/weatherDescriptions";
import { getAllColumns } from "@/lib/columns";

/* 本番ドメイン未確定のため、env でも上書き可能 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

const AREA_SLUGS = ["tokyo", "osaka", "nagoya", "fukuoka", "online"];

/**
 * lastmod について
 *
 * 以前は実際の更新日を持たないページにも `new Date()`（＝ビルド時刻）を入れていた。
 * その結果 92 URL 中 56 URL の lastmod が常に「今日」になり、Google から
 * 信頼できない値と見なされてサイト全体で lastmod が無視される状態だった
 * （2026-08-15 時点で最終読み込みが約1か月前で止まっていた）。
 *
 * Google のガイダンスは「正確な lastmod を出せないなら省略する」。
 * そのため、実日付を持つコラム（updatedAt / publishedAt）にだけ lastmod を付け、
 * それ以外は付けない。将来ページ単位の更新日を持てるようになったら復活させる。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/kinda-talk",
    "/kinda-act",
    "/kinda-glow",
    "/kinda-note",
    "/kinda-note/quiz",
    "/kinda-type",
    "/kinda-type/quiz",
    // /kinda-note/result と /kinda-type/result は結果画面（クエリで内容が変わる）ため入れない
    "/kinda-pair",
    "/kinda-pair/topics",
    // /kinda-pair/solo は noindex（個人の回答画面）のため sitemap に含めない
    "/kinda-story",
    "/agencies",
    "/shops",
    "/contact",
    "/about",
    "/about/editorial-policy",
    "/about/founder",
    "/about/transparency",
    "/columns",
    // /mypage は robots.txt で Disallow しているため sitemap からも除外（GSC 警告整合）
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const forCounselorsEntry: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/for-counselors`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const legalEntries: MetadataRoute.Sitemap = [
    "/terms",
    "/privacy",
    "/tokushou",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const counselorEntries: MetadataRoute.Sitemap = COUNSELORS
    .filter((c) => !c.isDemo)
    .map((c) => ({
      url: `${SITE_URL}/counselors/${c.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Kinda story は「掲載同意の記録がある物語」だけを sitemap に載せる。
  // consent を持たない初期のサンプル物語（A.M さん等）は実在の取材素材ではないため、
  // 検索エンジンに実話として送信しない（CLAUDE.md §5 Story 細則・ステマ規制回避）。
  const storyEntries: MetadataRoute.Sitemap = STORIES
    .filter((s) => !!s.consent)
    .map((s) => ({
      url: `${SITE_URL}/kinda-story/${s.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const areaEntries: MetadataRoute.Sitemap = AREA_SLUGS.map((a) => ({
    url: `${SITE_URL}/kinda-talk/area/${a}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const typeEntries: MetadataRoute.Sitemap = KINDA_TYPE_KEYS.map((t) => ({
    url: `${SITE_URL}/kinda-talk/type/${t}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const weatherListEntry: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/note/weather`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // 紐づくコラムがある天気のみ sitemap に含める（薄いページは除外）
  const weatherEntries: MetadataRoute.Sitemap = getAllWeathers()
    .filter((w) => !!w.column_slug)
    .map((w) => ({
      url: `${SITE_URL}/note/weather/${w.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // コラム本体（MDX 全件、publishedAt を lastmod に使用）
  const columns = await getAllColumns();
  const columnEntries: MetadataRoute.Sitemap = columns.map((c) => ({
    url: `${SITE_URL}/columns/${c.slug}`,
    // 実日付を持つのはコラムだけ。どちらも無い記事は lastmod を付けない
    ...(c.updatedAt || c.publishedAt
      ? { lastModified: new Date((c.updatedAt ?? c.publishedAt) as string) }
      : {}),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticEntries,
    ...forCounselorsEntry,
    ...legalEntries,
    ...counselorEntries,
    ...storyEntries,
    ...areaEntries,
    ...typeEntries,
    ...weatherListEntry,
    ...weatherEntries,
    ...columnEntries,
  ];
}
