/* ────────────────────────────────────────────────────────────
   成婚エピソード モックデータ
   将来的には Supabase の episodes テーブルから取得する
──────────────────────────────────────────────────────────── */

/**
 * ThumbVariant: サムネイルのグラデーション配色キー。
 * Supabase に差し替える際は thumb_image_url 等の画像URLに置き換える。
 */
export type EpisodeThumbVariant = "warm" | "cool" | "green";

export interface Episode {
  id: string;
  agencyName: string;
  /** 例: "9ヶ月で成婚" */
  period: string;
  title: string;
  /** 特集カードにのみ表示する本文抜粋 */
  excerpt?: string;
  /** 例: "S さん（32）× T さん（35）" */
  coupleLabel: string;
  /** true のとき大きく表示するフィーチャーカード */
  featured?: boolean;
  thumbVariant: EpisodeThumbVariant;
  agencyHref: string;
}

export const episodesData: Episode[] = [
  {
    id: "1",
    agencyName: "ブライダルハウス東京",
    period: "9ヶ月で成婚",
    title:
      "「カウンセラーに背中を押してもらって、初めて自分の気持ちを正直に話せた気がします」",
    excerpt:
      "32歳のSさんは「押しつけられそう」という先入観から相談所に足が向かなかった。口コミを読んで「この人なら話せる」と予約し、9ヶ月後に成婚。",
    coupleLabel: "S さん（32）× T さん（35）",
    featured: true,
    thumbVariant: "warm",
    agencyHref: "#",
  },
  {
    id: "2",
    agencyName: "シンプリーマリッジ",
    period: "6ヶ月で成婚",
    title: "「再婚への偏見がなかったカウンセラーさんに出会えて本当によかった」",
    coupleLabel: "M さん（39）× K さん（41）",
    thumbVariant: "cool",
    agencyHref: "#",
  },
  {
    id: "3",
    agencyName: "コトブキ相談センター",
    period: "11ヶ月で成婚",
    title: "「仕事が忙しすぎて無理だと思っていたけど、ペースを合わせてくれた」",
    coupleLabel: "A さん（28）× R さん（31）",
    thumbVariant: "green",
    agencyHref: "#",
  },
];
