/**
 * お店をどのセクションに出すかの振り分け。`shops.thumb_variant` で決まる。
 *
 * もとは /kinda-act と /kinda-glow の page.tsx にそれぞれ Set がベタ書きされていた。
 * sitemap からも同じ判定が要るようになったので、ここ1箇所に置く。
 */
export const ACT_THUMB_VARIANTS = new Set(["cafe", "lounge"]);

export const GLOW_THUMB_VARIANTS = new Set([
  "hair",
  "nail",
  "brow",
  "esthetic",
  "photo-studio",
]);

/**
 * 掲載0件のセクションは、検索エンジンに送らない。
 *
 * 店名も観察もないページを送ると「クロール済み - インデックス未登録」になり、
 * ドメイン全体の評価を下げる（2026-09-13 に掲載0名の一覧ページ11本で同じ判断をした）。
 *
 * **0件かどうかはデータで判定する。** noindex をページにベタ書きすると、
 * 掲載を始めたときに外し忘れて、今度は出したいページが検索に出なくなる。
 * 1件でも公開されれば次の再生成で自動的に index に戻る。
 */
export function hasPublishedPlaces(
  places: readonly { thumbVariant: string }[],
  variants: ReadonlySet<string>,
): boolean {
  return places.some((p) => variants.has(p.thumbVariant));
}
