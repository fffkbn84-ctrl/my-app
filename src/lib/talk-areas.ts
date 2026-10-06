/**
 * Kinda talk のエリア定義（スラグ → 表示名・照合文字列）
 *
 * `/kinda-talk/area/[area]` のページと `sitemap.ts` の両方から参照するため、
 * ページ側に置かず lib に切り出している。
 * sitemap は「そのエリアに公開カウンセラーが1名以上いるか」を判定するのに使う。
 */
export type TalkArea = { label: string; match: string[] };

export const AREA_MAP: Record<string, TalkArea> = {
  tokyo: { label: "東京", match: ["東京"] },
  osaka: { label: "大阪", match: ["大阪"] },
  nagoya: { label: "名古屋", match: ["名古屋"] },
  fukuoka: { label: "福岡", match: ["福岡"] },
  online: { label: "オンライン", match: ["オンライン"] },
};

export const AREA_SLUGS = Object.keys(AREA_MAP);

/** カウンセラーの area 文字列が、そのエリアスラグに属するか（area が null/空でも落ちない） */
export function matchesArea(counselorArea: string | null | undefined, slug: string): boolean {
  const info = AREA_MAP[slug];
  if (!info) return false;
  const area = counselorArea ?? "";
  return info.match.some((m) => area.includes(m));
}
