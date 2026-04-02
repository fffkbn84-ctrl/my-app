/* ────────────────────────────────────────────────────────────
   コラム記事 モックデータ
   将来的には Supabase の columns テーブルから取得する
──────────────────────────────────────────────────────────── */

/**
 * ThumbVariant: サムネイルのグラデーション配色キー。
 * Supabase に差し替える際は thumb_image_url 等の画像URLに置き換える。
 */
export type ColumnThumbVariant = "t1" | "t2" | "t3";

export interface ColumnArticle {
  id: string;
  /** MDXファイルのslug。指定時はカードタップで詳細ページへ遷移 */
  slug?: string;
  /** タグラベル（例: "取材レポート"） */
  tag: string;
  title: string;
  author: string;
  /** アバター表示用イニシャル */
  authorInitial: string;
  /** アバター背景色。未指定時は var(--adim) */
  authorBg?: string;
  /** アバター文字色。未指定時は var(--accent) */
  authorColor?: string;
  /** 例: "2025.03.15" */
  date: string;
  /** 例: "読了 8分"。未指定時は非表示 */
  readTime?: string;
  /** true のとき大きく表示するフィーチャーカード */
  featured?: boolean;
  thumbVariant: ColumnThumbVariant;
}

export const columnsData: ColumnArticle[] = [
  {
    id: "1",
    slug: "good-counselor-traits",
    featured: true,
    tag: "取材レポート",
    title: "全国47都道府県の結婚相談所を取材して気づいた、「いいカウンセラー」の共通点",
    author: "編集部 みづき",
    authorInitial: "M",
    date: "2025.03.15",
    readTime: "読了 8分",
    thumbVariant: "t1",
  },
  {
    id: "2",
    slug: "omiai-cafe-tokyo",
    featured: false,
    tag: "お見合い準備",
    title: "お見合いに使いたい東京カフェ、スタッフが実際に行ってみた12選",
    author: "あかり",
    authorInitial: "A",
    authorBg: "#FCE8E5",
    authorColor: "#C4877A",
    date: "2025.02.28",
    thumbVariant: "t2",
  },
  {
    id: "3",
    slug: "date-plan-by-stage",
    featured: false,
    tag: "デートプラン",
    title: "1回目・2回目・3回目、それぞれのデートで使えるお店の選び方",
    author: "みづき",
    authorInitial: "M",
    date: "2025.02.10",
    thumbVariant: "t3",
  },
];
