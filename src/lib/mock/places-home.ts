/* ────────────────────────────────────────────────────────────
   お店モックデータ（正データ）
   将来的には Supabase の shops テーブルから取得する
──────────────────────────────────────────────────────────── */

export type BadgeType = "certified" | "agency" | "listed";
export type PlaceTabCategory = "all" | "omiai" | "date" | "beauty" | "photo";

/**
 * ThumbVariant: コンポーネント側でグラデーション＋SVGアイコンを選択するためのキー。
 * Supabase に差し替える際は thumb_image_url 等の画像URLに置き換える。
 */
export type ThumbVariant = "cafe" | "lounge" | "hair" | "nail" | "brow" | "photo-studio";

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
  description: string;
  features: string[];
  /** 検索ページのカテゴリ選択用ラベル */
  categoryLabel: string;
  /** 検索ページのエリア選択用ラベル */
  areaLabel: string;
  priceRange?: string;
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
    description: "表参道の落ち着いたカフェ。ゆったりとした空間でお見合いの第一印象を大切に。個室席も完備。",
    features: ["個室あり", "禁煙", "予約可"],
    categoryLabel: "カフェ",
    areaLabel: "東京",
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
    description: "南青山の隠れ家カフェ。デート1回目にぴったりな落ち着いた雰囲気で、会話が弾みます。",
    features: ["Wi-Fi", "電源あり", "テラス席"],
    categoryLabel: "カフェ",
    areaLabel: "東京",
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
    description: "婚活写真・お見合い当日に向けたスタイリングを丁寧にサポート。婚活経験者のスタイリスト在籍。",
    features: ["婚活ヘア専門", "当日予約可", "カラー対応"],
    categoryLabel: "美容室",
    areaLabel: "東京",
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
    description: "婚活プロフィール写真に特化したスタジオ。自然な表情を引き出すプロの撮影技術が好評。",
    features: ["プロフィール写真", "当日データ渡し", "衣装貸出"],
    categoryLabel: "フォトスタジオ",
    areaLabel: "東京",
  },
  {
    id: "5",
    name: "THE STRINGS OMOTESANDO",
    category: "omiai",
    stage: "レストラン · お見合い",
    location: "東京・表参道",
    rating: 4.8,
    reviewCount: 34,
    badgeType: "certified",
    thumbVariant: "lounge",
    description: "表参道の隠れ家フレンチ。個室完備でお見合い・デートに最適。ソムリエが在籍しワインのペアリングも楽しめます。",
    features: ["個室あり", "フレンチ", "ワイン"],
    categoryLabel: "レストラン",
    areaLabel: "東京",
    priceRange: "¥¥¥",
  },
  {
    id: "6",
    name: "茶寮 つぼ市",
    category: "omiai",
    stage: "カフェ · お見合い",
    location: "東京・銀座",
    rating: 4.7,
    reviewCount: 28,
    badgeType: "certified",
    thumbVariant: "cafe",
    description: "銀座の老舗和カフェ。落ち着いた和の空間でゆっくり話せると婚活カップルから好評。抹茶スイーツが絶品。",
    features: ["和カフェ", "個室あり", "禁煙"],
    categoryLabel: "カフェ",
    areaLabel: "東京",
    priceRange: "¥¥",
  },
  {
    id: "7",
    name: "CICADA",
    category: "date",
    stage: "レストラン · デート",
    location: "東京・南青山",
    rating: 4.6,
    reviewCount: 19,
    badgeType: "agency",
    thumbVariant: "lounge",
    description: "南青山のMiddle Eastern料理レストラン。非日常的な雰囲気が会話を弾ませます。テラス席が人気。",
    features: ["中東料理", "テラス席", "おしゃれ"],
    categoryLabel: "レストラン",
    areaLabel: "東京",
    priceRange: "¥¥¥",
  },
  {
    id: "8",
    name: "カフェ ド クリエ 丸の内店",
    category: "omiai",
    stage: "カフェ · お見合い前",
    location: "東京・丸の内",
    rating: 4.2,
    reviewCount: 12,
    badgeType: "listed",
    thumbVariant: "cafe",
    description: "丸の内のビジネス街にある落ち着いたカフェ。待ち合わせ場所として使いやすく、面談前後の軽いお茶に最適。",
    features: ["カフェ", "Wi-Fi", "電源あり"],
    categoryLabel: "カフェ",
    areaLabel: "東京",
    priceRange: "¥",
  },
  {
    id: "9",
    name: "鉄板焼 青山 三谷",
    category: "date",
    stage: "レストラン · 記念日",
    location: "東京・青山",
    rating: 4.9,
    reviewCount: 41,
    badgeType: "certified",
    thumbVariant: "lounge",
    description: "青山の鉄板焼き割烹。目の前で繰り広げられるシェフの技術が話のネタに。特別な記念日や重要な食事会に。",
    features: ["鉄板焼き", "個室あり", "記念日"],
    categoryLabel: "レストラン",
    areaLabel: "東京",
    priceRange: "¥¥¥¥",
  },
  {
    id: "10",
    name: "HIGASHIYA GINZA",
    category: "omiai",
    stage: "カフェ · お見合い",
    location: "東京・銀座",
    rating: 4.5,
    reviewCount: 22,
    badgeType: "agency",
    thumbVariant: "cafe",
    description: "銀座の上質な和菓子・茶房。四季折々の和菓子と日本茶でゆったりとした時間を。洗練された空間が人気。",
    features: ["和菓子", "日本茶", "銀座"],
    categoryLabel: "カフェ",
    areaLabel: "東京",
    priceRange: "¥¥¥",
  },
  {
    id: "11",
    name: "THE LOBBY at Park Hotel Tokyo",
    category: "date",
    stage: "ラウンジ · デート",
    location: "東京・汐留",
    rating: 4.4,
    reviewCount: 15,
    badgeType: "listed",
    thumbVariant: "lounge",
    description: "汐留のパークホテル東京1Fラウンジ。開放感のある空間でアフタヌーンティーが楽しめます。",
    features: ["ホテルラウンジ", "アフタヌーンティー", "眺望"],
    categoryLabel: "レストラン",
    areaLabel: "東京",
    priceRange: "¥¥¥",
  },
  {
    id: "12",
    name: "麻布十番 更科堀井",
    category: "date",
    stage: "和食 · デート",
    location: "東京・麻布十番",
    rating: 4.7,
    reviewCount: 31,
    badgeType: "certified",
    thumbVariant: "lounge",
    description: "麻布十番の老舗蕎麦店。落ち着いた和空間でじっくりと話せます。コースもあり、時間を気にせず過ごせます。",
    features: ["蕎麦", "和食", "老舗"],
    categoryLabel: "レストラン",
    areaLabel: "東京",
    priceRange: "¥¥¥",
  },
];

export const placeTabs: { label: string; value: PlaceTabCategory }[] = [
  { label: "すべて",    value: "all" },
  { label: "お見合い",  value: "omiai" },
  { label: "デート",    value: "date" },
  { label: "ビューティ", value: "beauty" },
  { label: "フォト",    value: "photo" },
];
