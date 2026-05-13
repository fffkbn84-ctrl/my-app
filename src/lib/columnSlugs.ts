/**
 * 将来実装するコラム記事の slug 定義。
 *
 * 用途: /note/weather/[slug] の「関連コラム」リンク先など、
 *       コラム本体は未実装でも、内部リンクの整合を取りたい場面で参照する。
 *
 * 運用方針:
 *  - 実装フェーズで `published: true` に切り替える
 *  - `published: false` のコラムはリンク自体を非表示にする（404を出さない）
 */

export const COLUMN_SLUGS = {
  KONKATSU_TSUKARETA: "konkatsu-tsukareta",
  KIMOCHI_SEIRI: "kimochi-seiri",
  DATE_FUAN: "date-fuan",
} as const;

export type ColumnSlug = typeof COLUMN_SLUGS[keyof typeof COLUMN_SLUGS];

export type ColumnMetaLite = {
  title: string;
  description: string;
  /** trueにするとリンク表示が有効になる */
  published: boolean;
};

export const COLUMN_META: Record<ColumnSlug, ColumnMetaLite> = {
  "konkatsu-tsukareta": {
    title:
      "「婚活、疲れた」と感じたら。続けるかやめるかの前に、整理してみる",
    description:
      "婚活で疲れを感じている時。続けるかやめるかを決める前に、まず気持ちを整理することから。",
    published: false,
  },
  "kimochi-seiri": {
    title: "気持ちを整理する方法。モヤモヤを言葉にする60秒",
    description:
      "感情ラベリングの科学的根拠と、婚活の場面で使える整理の実践。",
    published: false,
  },
  "date-fuan": {
    title:
      "デートの後、不安になるあなたへ。不安を消すのではなく、言葉にする",
    description:
      "デートの不安は消すものではなく、言葉にすることで扱える大きさに変わる。",
    published: false,
  },
};

/** 任意の文字列が公開済みコラムの slug かを判定 */
export function isPublishedColumnSlug(slug: string): slug is ColumnSlug {
  return slug in COLUMN_META && COLUMN_META[slug as ColumnSlug].published;
}
