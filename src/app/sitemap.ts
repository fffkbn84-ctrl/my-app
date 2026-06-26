import type { MetadataRoute } from "next";
import { COUNSELORS } from "@/lib/data";
import { KINDA_TYPE_KEYS } from "@/lib/kinda-types";
import { getAllWeathers } from "@/app/kinda-note/data/weatherDescriptions";
import { getAllColumns } from "@/lib/columns";

/* 本番ドメイン未確定のため、env でも上書き可能 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

const AREA_SLUGS = ["tokyo", "osaka", "nagoya", "fukuoka", "online"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/kinda-talk",
    "/kinda-act",
    "/kinda-glow",
    "/kinda-note",
    "/kinda-type",
    "/kinda-type/quiz",
    "/agencies",
    "/shops",
    "/about",
    "/about/editorial-policy",
    "/about/founder",
    "/about/transparency",
    "/columns",
    // /mypage は robots.txt で Disallow しているため sitemap からも除外（GSC 警告整合）
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const legalEntries: MetadataRoute.Sitemap = [
    "/terms",
    "/privacy",
    "/tokushou",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const counselorEntries: MetadataRoute.Sitemap = COUNSELORS
    .filter((c) => !c.isDemo)
    .map((c) => ({
      url: `${SITE_URL}/counselors/${c.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const areaEntries: MetadataRoute.Sitemap = AREA_SLUGS.map((a) => ({
    url: `${SITE_URL}/kinda-talk/area/${a}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const typeEntries: MetadataRoute.Sitemap = KINDA_TYPE_KEYS.map((t) => ({
    url: `${SITE_URL}/kinda-talk/type/${t}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const weatherListEntry: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/note/weather`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // 紐づくコラムがある天気のみ sitemap に含める（薄いページは除外）
  const weatherEntries: MetadataRoute.Sitemap = getAllWeathers()
    .filter((w) => !!w.column_slug)
    .map((w) => ({
      url: `${SITE_URL}/note/weather/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // コラム本体（MDX 全件、publishedAt を lastmod に使用）
  const columns = await getAllColumns();
  const columnEntries: MetadataRoute.Sitemap = columns.map((c) => ({
    url: `${SITE_URL}/columns/${c.slug}`,
    lastModified: c.updatedAt
      ? new Date(c.updatedAt)
      : c.publishedAt
        ? new Date(c.publishedAt)
        : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticEntries,
    ...legalEntries,
    ...counselorEntries,
    ...areaEntries,
    ...typeEntries,
    ...weatherListEntry,
    ...weatherEntries,
    ...columnEntries,
  ];
}
