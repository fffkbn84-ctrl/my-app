import type { MetadataRoute } from "next";
import { COUNSELORS } from "@/lib/data";
import { KINDA_TYPE_KEYS } from "@/lib/kinda-types";

/* 本番ドメイン未確定のため、env でも上書き可能 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

const AREA_SLUGS = ["tokyo", "osaka", "nagoya", "fukuoka", "online"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/kinda-talk",
    "/kinda-act",
    "/kinda-glow",
    "/kinda-type",
    "/kinda-type/quiz",
    "/agencies",
    "/shops",
    "/about",
    "/columns",
    "/mypage",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
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

  return [...staticEntries, ...counselorEntries, ...areaEntries, ...typeEntries];
}
