/**
 * 季節ビジュアルの単一の正（single source of truth）。
 *
 * トップのヒーローは「モバイル縦長 2:3」+「PC 横長 16:9」の 2 枚組で運用する。
 * 命名規則：`/images/hero-couple-<season>{,-pc}.webp`（WORKLOG 2026-05-28 で確定）
 *
 * 季節を切り替えるときは CURRENT_SEASON を 1 行変えるだけでよい。
 * page.tsx のヒーローと layout.tsx の LCP preload が同時に追従する。
 *
 * 注意：画像を public/images に置いてから切り替えること。
 * 存在しないパスを指すと、ヒーロー本体と preload の両方が 404 になる。
 *
 * 画像の生成プロンプト・サイズ規格は docs/sns/seasonal-visuals.md を正とする。
 */

export type SeasonKey = "summer" | "autumn" | "halloween";

type SeasonVisual = {
  /** 画像左上のシールに入る英字。画像側に焼き込まれている（コードからは描かない） */
  sticker: string;
  /** モバイル用 縦長 2:3（1024×1536） */
  hero: string;
  /** PC 用 横長 16:9（1672×941） */
  heroPc: string;
  /** 季節の情景に合わせた代替テキスト */
  heroAlt: string;
};

export const SEASON_VISUALS: Record<SeasonKey, SeasonVisual> = {
  summer: {
    sticker: "Summer",
    hero: "/images/hero-couple-2026ss.webp",
    heroPc: "/images/hero-couple-2026ss-pc.webp",
    heroAlt:
      "Kindaの世界観：ミニチュアクレイで作られた、夏の海辺で並んで本を読むふたり",
  },
  autumn: {
    sticker: "Autumn",
    hero: "/images/hero-couple-2026aw.webp",
    heroPc: "/images/hero-couple-2026aw-pc.webp",
    heroAlt:
      "Kindaの世界観：ミニチュアクレイで作られた、落ち葉の並木道を並んで歩くふたり",
  },
  halloween: {
    sticker: "Halloween",
    hero: "/images/hero-couple-2026hw.webp",
    heroPc: "/images/hero-couple-2026hw-pc.webp",
    heroAlt:
      "Kindaの世界観：ミニチュアクレイで作られた、小さなかぼちゃの灯りが並ぶ秋の夕暮れを歩くふたり",
  },
};

/**
 * いま出している季節。
 *
 * 切り替え履歴／予定：
 * - summer    … 〜2026-09（現行）
 * - autumn    … 秋の 2 枚（hero-couple-2026aw{,-pc}.webp）を置いたら切り替える
 * - halloween … 10 月頭に、かぼちゃ入りの 2 枚を置いてから切り替える。11 月に autumn へ戻す
 */
export const CURRENT_SEASON: SeasonKey = "summer";

export const seasonVisual = SEASON_VISUALS[CURRENT_SEASON];
