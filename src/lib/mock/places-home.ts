/* ────────────────────────────────────────────────────────────
   トップページ用 お店モックデータ
   将来的には Supabase の shops テーブルから取得する
   型定義は src/lib/mock/shops.ts の BadgeType を流用
──────────────────────────────────────────────────────────── */

export type BadgeType = "certified" | "agency";
export type PlaceTabCategory = "all" | "omiai" | "date" | "beauty" | "photo";

/**
 * ThumbVariant: コンポーネント側でグラデーション＋SVGアイコンを選択するためのキー。
 * Supabase に差し替える際は thumb_image_url 等の画像URLに置き換える。
 */
export type ThumbVariant = "cafe" | "lounge" | "hair" | "photo-studio";

export interface PlaceHome {
  id: string;
  name: string;
  /** タブフィルター用カテゴリ */
  category: PlaceTabCategory;
  /** カード上部に表示するステージラベル（例: "カフェ · お見合い"） */
  stage: string;
  location: string;
  rating: number;
  reviewCount: number;
  badgeType: BadgeType;
  thumbVariant: ThumbVariant;
}

export const placesHomeData: PlaceHome[] = [
  {
    id: "1",
    name: "カフェ ソワレ",
    category: "omiai",
    stage: "カフェ · お見合い",
    location: "東京・表参道",
    rating: 5,
    reviewCount: 47,
    badgeType: "certified",
    thumbVariant: "cafe",
  },
  {
    id: "2",
    name: "ルーム カフェ 青山",
    category: "date",
    stage: "カフェ · デート1回目",
    location: "東京・南青山",
    rating: 4,
    reviewCount: 31,
    badgeType: "agency",
    thumbVariant: "lounge",
  },
  {
    id: "3",
    name: "ヘアサロン ルーシュ",
    category: "beauty",
    stage: "美容室 · 婚活準備",
    location: "東京・南青山",
    rating: 5,
    reviewCount: 28,
    badgeType: "certified",
    thumbVariant: "hair",
  },
  {
    id: "4",
    name: "スタジオ クラリス",
    category: "photo",
    stage: "フォトスタジオ",
    location: "東京・代官山",
    rating: 5,
    reviewCount: 14,
    badgeType: "certified",
    thumbVariant: "photo-studio",
  },
];

export const placeTabs: { label: string; value: PlaceTabCategory }[] = [
  { label: "すべて",   value: "all" },
  { label: "お見合い", value: "omiai" },
  { label: "デート",   value: "date" },
  { label: "ビューティ", value: "beauty" },
  { label: "フォト",   value: "photo" },
];
