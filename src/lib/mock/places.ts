/* モックデータ（後でSupabaseに差し替え） */
export type PlaceBadge = "certified" | "agency" | "listed";

export type PlaceReview = {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
};

export type Place = {
  id: number;
  name: string;
  category: string;
  stage: string;
  area: string;
  badge: PlaceBadge;
  gradient: string;
  svgColor: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  hours: string;
  holiday: string;
  access: string;
  description: string;
  features: string[];
  scenes: string[];
  reviews: PlaceReview[];
};

export const places: Place[] = [
  {
    id: 1,
    name: "カフェ ソワレ",
    category: "カフェ",
    stage: "お見合い",
    area: "東京・表参道",
    badge: "certified",
    gradient: "linear-gradient(135deg,#EDE0D4,#D4C4B0)",
    svgColor: "#C8A97A",
    rating: 4.9, reviewCount: 47,
    priceRange: "¥1,000〜¥2,000",
    hours: "10:00〜20:00", holiday: "月曜定休",
    access: "表参道駅 徒歩3分",
    description: "落ち着いた雰囲気でお見合いに最適。個室・半個室あり。静かで会話しやすい空間です。",
    features: ["個室あり", "禁煙", "Wi-Fi完備", "電源あり"],
    scenes: ["お見合い", "初デート"],
    reviews: [
      { id: "rv1", user: "A.K さん（32歳）", rating: 5,
        text: "お見合いで利用しました。個室で周りを気にせず話せてよかったです。", date: "2025年2月" },
      { id: "rv2", user: "M.T さん（28歳）", rating: 5,
        text: "スタッフの方が親切で、長居しても嫌な顔をされませんでした。", date: "2025年1月" },
    ],
  },
  {
    id: 2,
    name: "ヘアサロン ルーシュ",
    category: "美容室",
    stage: "婚活準備",
    area: "東京・南青山",
    badge: "certified",
    gradient: "linear-gradient(135deg,#D8E4D8,#C0D4C2)",
    svgColor: "#7A9E87",
    rating: 4.8, reviewCount: 28,
    priceRange: "¥8,000〜¥15,000",
    hours: "10:00〜19:00", holiday: "火曜定休",
    access: "表参道駅 徒歩5分",
    description: "婚活写真・お見合い前のスタイリングに特化したサロン。カウンセラーからの紹介も多い。",
    features: ["予約制", "婚活スタイリング相談可", "当日予約可"],
    scenes: ["婚活準備", "お見合い前"],
    reviews: [
      { id: "rv3", user: "S.K さん（33歳）", rating: 5,
        text: "婚活用のヘアセットをお願いしました。イメージ通りに仕上げてもらえました。", date: "2025年3月" },
    ],
  },
  {
    id: 3,
    name: "ネイル ブルーム",
    category: "ネイルサロン",
    stage: "婚活準備",
    area: "東京・恵比寿",
    badge: "certified",
    gradient: "linear-gradient(135deg,#E8D8EE,#D4C0E2)",
    svgColor: "#9B7AB5",
    rating: 4.7, reviewCount: 22,
    priceRange: "¥6,000〜¥12,000",
    hours: "11:00〜20:00", holiday: "水曜定休",
    access: "恵比寿駅 徒歩6分",
    description: "お見合い・婚活写真に合わせた上品なネイルが得意なサロン。",
    features: ["完全予約制", "婚活ネイル相談可", "オフ込み"],
    scenes: ["婚活準備"],
    reviews: [
      { id: "rv4", user: "Y.N さん（29歳）", rating: 5,
        text: "婚活向けの清潔感あるデザインを提案してもらえました。", date: "2025年2月" },
    ],
  },
  {
    id: 4,
    name: "Arch eyebrow studio",
    category: "眉毛サロン",
    stage: "婚活準備",
    area: "大阪・北堀江",
    badge: "agency",
    gradient: "linear-gradient(135deg,#E8E8D8,#D4D4C0)",
    svgColor: "#B8860B",
    rating: 4.9, reviewCount: 35,
    priceRange: "¥4,000〜¥8,000",
    hours: "10:00〜19:00", holiday: "月曜定休",
    access: "肥後橋駅 徒歩8分",
    description: "婚活カウンセラーからの紹介が多い眉毛専門サロン。初めての方でも丁寧に対応。",
    features: ["完全予約制", "眉毛デザイン相談", "メンズ対応可"],
    scenes: ["婚活準備"],
    reviews: [
      { id: "rv5", user: "C.I さん（35歳）", rating: 5,
        text: "眉毛を整えるだけで印象がガラッと変わりました。担当の方が丁寧。", date: "2025年1月" },
    ],
  },
  {
    id: 5,
    name: "スタジオ クラリス",
    category: "フォトスタジオ",
    stage: "婚活準備",
    area: "東京・代官山",
    badge: "certified",
    gradient: "linear-gradient(135deg,#D8DCE4,#C4C8D4)",
    svgColor: "#6B8FBF",
    rating: 4.9, reviewCount: 14,
    priceRange: "¥15,000〜¥30,000",
    hours: "10:00〜18:00", holiday: "火・水曜定休",
    access: "代官山駅 徒歩4分",
    description: "婚活プロフィール写真専門スタジオ。自然な表情を引き出す撮影で好評。",
    features: ["ヘアメイク込みプランあり", "データ当日渡し", "衣装レンタル可"],
    scenes: ["婚活準備", "プロフィール写真"],
    reviews: [
      { id: "rv6", user: "A.R さん（31歳）", rating: 5,
        text: "緊張していたけど、自然な笑顔の写真を撮ってもらえました。", date: "2025年3月" },
    ],
  },
  {
    id: 6,
    name: "リストランテ イル フィオーレ",
    category: "レストラン",
    stage: "記念日",
    area: "東京・広尾",
    badge: "agency",
    gradient: "linear-gradient(135deg,#E4D8D8,#D0C0C0)",
    svgColor: "#C4877A",
    rating: 4.8, reviewCount: 19,
    priceRange: "¥8,000〜¥20,000",
    hours: "18:00〜23:00", holiday: "月曜定休",
    access: "広尾駅 徒歩5分",
    description: "成婚後の記念日や特別な日に使いたい本格イタリアン。カウンセラー推薦が多い。",
    features: ["個室あり", "記念日サービスあり", "ドレスコードあり"],
    scenes: ["記念日", "プロポーズ"],
    reviews: [
      { id: "rv7", user: "T.M さん（38歳）", rating: 5,
        text: "プロポーズで利用しました。スタッフが演出を手伝ってくれて最高でした。", date: "2025年2月" },
    ],
  },
];
