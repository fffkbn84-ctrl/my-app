/* モックデータ（後でSupabaseに差し替え） */
export type BadgeType = "certified" | "agency" | "listed";

export type Shop = {
  id: string;
  name: string;
  area: string;
  category: string;
  badge: BadgeType;
  rating: number;
  reviewCount: number;
  priceRange: string;
  intro: string;
  tags: string[];
};

export const shops: Shop[] = [
  {
    id: "1",
    name: "THE STRINGS OMOTESANDO",
    area: "東京・表参道",
    category: "レストラン",
    badge: "certified",
    rating: 4.8,
    reviewCount: 34,
    priceRange: "¥¥¥",
    intro: "表参道の隠れ家フレンチ。個室完備でお見合い・デートに最適。ソムリエが在籍しワインのペアリングも楽しめます。",
    tags: ["個室あり", "フレンチ", "ワイン"],
  },
  {
    id: "2",
    name: "茶寮 つぼ市",
    area: "東京・銀座",
    category: "カフェ・甘味",
    badge: "certified",
    rating: 4.7,
    reviewCount: 28,
    priceRange: "¥¥",
    intro: "銀座の老舗和カフェ。落ち着いた和の空間でゆっくり話せると婚活カップルから好評。抹茶スイーツが絶品。",
    tags: ["和カフェ", "個室あり", "禁煙"],
  },
  {
    id: "3",
    name: "CICADA",
    area: "東京・南青山",
    category: "レストラン",
    badge: "agency",
    rating: 4.6,
    reviewCount: 19,
    priceRange: "¥¥¥",
    intro: "南青山のMiddle Eastern料理レストラン。非日常的な雰囲気が会話を弾ませます。テラス席が人気。",
    tags: ["中東料理", "テラス席", "おしゃれ"],
  },
  {
    id: "4",
    name: "カフェ ド クリエ 丸の内店",
    area: "東京・丸の内",
    category: "カフェ",
    badge: "listed",
    rating: 4.2,
    reviewCount: 12,
    priceRange: "¥",
    intro: "丸の内のビジネス街にある落ち着いたカフェ。待ち合わせ場所として使いやすく、面談前後の軽いお茶に最適。",
    tags: ["カフェ", "Wi-Fi", "電源あり"],
  },
  {
    id: "5",
    name: "鉄板焼 青山 三谷",
    area: "東京・青山",
    category: "レストラン",
    badge: "certified",
    rating: 4.9,
    reviewCount: 41,
    priceRange: "¥¥¥¥",
    intro: "青山の鉄板焼き割烹。目の前で繰り広げられるシェフの技術が話のネタに。特別な記念日や重要な食事会に。",
    tags: ["鉄板焼き", "個室あり", "記念日"],
  },
  {
    id: "6",
    name: "HIGASHIYA GINZA",
    area: "東京・銀座",
    category: "カフェ・甘味",
    badge: "agency",
    rating: 4.5,
    reviewCount: 22,
    priceRange: "¥¥¥",
    intro: "銀座の上質な和菓子・茶房。四季折々の和菓子と日本茶でゆったりとした時間を。洗練された空間が人気。",
    tags: ["和菓子", "日本茶", "銀座"],
  },
  {
    id: "7",
    name: "THE LOBBY at Park Hotel Tokyo",
    area: "東京・汐留",
    category: "ホテルラウンジ",
    badge: "listed",
    rating: 4.4,
    reviewCount: 15,
    priceRange: "¥¥¥",
    intro: "汐留のパークホテル東京1Fラウンジ。開放感のある空間でアフタヌーンティーが楽しめます。",
    tags: ["ホテルラウンジ", "アフタヌーンティー", "眺望"],
  },
  {
    id: "8",
    name: "麻布十番 更科堀井",
    area: "東京・麻布十番",
    category: "和食",
    badge: "certified",
    rating: 4.7,
    reviewCount: 31,
    priceRange: "¥¥¥",
    intro: "麻布十番の老舗蕎麦店。落ち着いた和空間でじっくりと話せます。コースもあり、時間を気にせず過ごせます。",
    tags: ["蕎麦", "和食", "老舗"],
  },
];
