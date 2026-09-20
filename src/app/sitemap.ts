import type { MetadataRoute } from "next";
import { getPublicCounselors } from "@/lib/data";
import { STORIES } from "@/lib/mock/stories";
import { KINDA_TYPE_KEYS } from "@/lib/kinda-types";
import { getAllColumns } from "@/lib/columns";
import { AREA_SLUGS, matchesArea } from "@/lib/talk-areas";
import { getShops } from "@/lib/data";
import {
  ACT_THUMB_VARIANTS,
  GLOW_THUMB_VARIANTS,
  hasPublishedPlaces,
} from "@/lib/placeSections";

/* 本番ドメイン未確定のため、env でも上書き可能 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

/* カウンセラーが Supabase に追加されたとき、再デプロイなしで sitemap に反映させる。
   ビルド時に固定されると新規カウンセラーの詳細ページが送信されないため。 */
export const revalidate = 3600;

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

  /* カウンセラー詳細は Supabase の公開カウンセラーが正。
     以前は mock 配列 COUNSELORS を参照していたが、mock は全件 isDemo=true のため
     除外され、実在カウンセラーの詳細ページが 1 件も sitemap に載っていなかった。
     デモは詳細ページ側で noindex になっているので、ここでも除外する。 */
  const publicCounselors = await getPublicCounselors();

  const counselorEntries: MetadataRoute.Sitemap = publicCounselors.map((c) => ({
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

  /* お店の一覧も同じ理由で、掲載が1件以上あるセクションだけ送信する。
     掲載を始めれば次の再生成で自動的に戻る（ページ側の noindex 判定と同じデータを見る）。 */
  const allShops = await getShops();
  const shopSectionEntries: MetadataRoute.Sitemap = (
    [
      ["/kinda-act", ACT_THUMB_VARIANTS],
      ["/kinda-glow", GLOW_THUMB_VARIANTS],
    ] as const
  )
    .filter(([, variants]) => hasPublishedPlaces(allShops, variants))
    .map(([path]) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  /* 一覧ページは「掲載0名」だと実質空ページになり、Google に
     「クロール済み - インデックス未登録」と判定されてドメイン全体の評価を下げる。
     該当カウンセラーが1名以上いるエリア/タイプだけを送信する。
     掲載が増えれば次のビルドで自動的に sitemap へ戻る。 */
  const areaEntries: MetadataRoute.Sitemap = AREA_SLUGS
    .filter((a) => publicCounselors.some((c) => matchesArea(c.area, a)))
    .map((a) => ({
      url: `${SITE_URL}/kinda-talk/area/${a}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const typeEntries: MetadataRoute.Sitemap = KINDA_TYPE_KEYS
    .filter((t) => publicCounselors.some((c) => (c.matchingTypes ?? []).includes(t)))
    .map((t) => ({
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

  /* 天気の個別ページ（/note/weather/[slug]）は sitemap に含めない。
     本文が約400字のティーザーで、内容も検索意図も紐づくコラム本体と重複するため、
     ページ側を noindex, follow にして評価をコラムへ集約した（2026-09-13）。
     一覧の /note/weather だけは Kinda note の入口として残す。 */

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
    ...shopSectionEntries,
    ...areaEntries,
    ...typeEntries,
    ...weatherListEntry,
    ...columnEntries,
  ];
}
