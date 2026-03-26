/* ────────────────────────────────────────────────────────────
   ふたりへ — モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */

export type Plan = {
  name: string;
  admission: number;
  monthly: number;
  omiai: number;
  marriage: number;
  popular?: boolean;
};

export type AgencyReview = {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
};

export type Agency = {
  id: number;
  name: string;
  area: string;
  type: string[];
  plans: Plan[];
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  gradient: string;
  counselorIds: number[];
  access: string;
  hours: string;
  holiday: string;
  reviews: AgencyReview[];
};

export type Counselor = {
  id: number;
  name: string;
  kana: string;
  agencyId: number;
  agencyName: string;
  area: string;
  role: string;
  experience: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  online: boolean;
  minAdmission: number;
  monthlyFrom: number;
  gradient: string;
  svgColor: string;
  message: string;
};

export const AGENCIES: Agency[] = [
  {
    id: 1,
    name: "ブライダルハウス東京",
    area: "東京・銀座",
    type: ["仲人型", "IBJ加盟"],
    plans: [
      { name: "スタンダード", admission: 100000, monthly: 18000, omiai: 3000, marriage: 150000 },
      { name: "プレミアム", admission: 150000, monthly: 25000, omiai: 0, marriage: 200000, popular: true },
    ],
    rating: 4.9,
    reviewCount: 82,
    description: "面談経験者の口コミで選べる、銀座の相談所。",
    features: ["専任カウンセラー制", "IBJ加盟", "オンライン対応可"],
    gradient: "linear-gradient(135deg,#EDE0D4,#D4C4B0)",
    counselorIds: [1, 2],
    access: "東銀座駅 徒歩3分",
    hours: "10:00〜20:00",
    holiday: "火曜定休",
    reviews: [
      { id: "rv1", user: "S.K さん（33歳）", rating: 5, text: "押しつけられることなく、自分のペースで決められました。", date: "2025年1月" },
      { id: "rv2", user: "M.T さん（29歳）", rating: 5, text: "職種への理解があるカウンセラーさんで安心でした。", date: "2025年2月" },
    ],
  },
  {
    id: 2,
    name: "リーガルウェディング",
    area: "東京・渋谷",
    type: ["データ婚活", "IBJ加盟"],
    plans: [
      { name: "ライト", admission: 80000, monthly: 12000, omiai: 2000, marriage: 100000 },
      { name: "スタンダード", admission: 100000, monthly: 15000, omiai: 0, marriage: 150000, popular: true },
    ],
    rating: 4.7,
    reviewCount: 28,
    description: "データで相性を分析する、渋谷の相談所。",
    features: ["AI相性診断", "オンライン専用プランあり", "20〜30代中心"],
    gradient: "linear-gradient(135deg,#D8E4D8,#C0D4C2)",
    counselorIds: [3],
    access: "渋谷駅 徒歩5分",
    hours: "11:00〜21:00",
    holiday: "水曜定休",
    reviews: [
      { id: "rv3", user: "K.M さん（28歳）", rating: 5, text: "急かされることなく、自分の希望が整理できた感じ。", date: "2025年3月" },
    ],
  },
  {
    id: 3,
    name: "シンプリーマリッジ",
    area: "大阪・梅田",
    type: ["仲人型"],
    plans: [
      { name: "スタンダード", admission: 80000, monthly: 12000, omiai: 2000, marriage: 100000, popular: true },
    ],
    rating: 4.8,
    reviewCount: 19,
    description: "再婚・40代サポートに強い、梅田の相談所。",
    features: ["再婚専門サポート", "40代実績多数", "完全個室"],
    gradient: "linear-gradient(135deg,#E8D8EE,#D4C0E2)",
    counselorIds: [4],
    access: "梅田駅 徒歩4分",
    hours: "10:00〜19:00",
    holiday: "月・火曜定休",
    reviews: [
      { id: "rv4", user: "M.K さん（39歳）", rating: 5, text: "再婚でも全く気にせず話してくれた。最初からリラックスできた。", date: "2025年1月" },
    ],
  },
  {
    id: 4,
    name: "ハッピーロードサロン",
    area: "名古屋・栄",
    type: ["仲人型"],
    plans: [
      { name: "スタンダード", admission: 100000, monthly: 14000, omiai: 3000, marriage: 150000 },
      { name: "プレミアム", admission: 120000, monthly: 16000, omiai: 0, marriage: 180000, popular: true },
    ],
    rating: 4.6,
    reviewCount: 63,
    description: "15年の実績を持つ、名古屋の老舗相談所。",
    features: ["15年の実績", "名古屋・愛知エリア最大級", "成婚率高い"],
    gradient: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    counselorIds: [5],
    access: "栄駅 徒歩3分",
    hours: "10:00〜20:00",
    holiday: "木曜定休",
    reviews: [
      { id: "rv5", user: "Y.N さん（34歳）", rating: 5, text: "15年のキャリア。話の引き出しが多く、アドバイスが的確。", date: "2025年2月" },
    ],
  },
  {
    id: 5,
    name: "コトブキ相談センター",
    area: "東京・新宿",
    type: ["オンライン専門"],
    plans: [
      { name: "オンラインプラン", admission: 50000, monthly: 10000, omiai: 0, marriage: 80000, popular: true },
    ],
    rating: 4.5,
    reviewCount: 16,
    description: "完全オンライン対応、全国から利用できる相談所。",
    features: ["完全オンライン", "全国対応", "20代〜IT・クリエイター実績"],
    gradient: "linear-gradient(135deg,#DBEAFE,#BFDBFE)",
    counselorIds: [6],
    access: "新宿駅 徒歩7分（オンライン対応）",
    hours: "9:00〜22:00",
    holiday: "なし",
    reviews: [
      { id: "rv6", user: "A.R さん（28歳）", rating: 5, text: "同世代感覚で話せた。自分のペースを一緒に考えてくれた。", date: "2025年1月" },
    ],
  },
];

export const COUNSELORS: Counselor[] = [
  {
    id: 1,
    name: "田中 美紀",
    kana: "たなか みき",
    agencyId: 1,
    agencyName: "ブライダルハウス東京",
    area: "東京・銀座",
    role: "シニアブライダルカウンセラー",
    experience: 11,
    tags: ["傾聴が得意", "押しつけない", "30代女性実績多数", "IT・医療職サポート"],
    rating: 4.9,
    reviewCount: 82,
    online: true,
    minAdmission: 100000,
    monthlyFrom: 18000,
    gradient: "linear-gradient(135deg,#F5E8D8,#EDD8C0)",
    svgColor: "#C8A97A",
    message: "まずあなたの話をじっくり聞くことを大切にしています。",
  },
  {
    id: 2,
    name: "山田 健太郎",
    kana: "やまだ けんたろう",
    agencyId: 1,
    agencyName: "ブライダルハウス東京",
    area: "東京・銀座",
    role: "ブライダルカウンセラー",
    experience: 8,
    tags: ["男性カウンセラー", "医師・自営業実績", "率直なアドバイス"],
    rating: 4.8,
    reviewCount: 41,
    online: true,
    minAdmission: 100000,
    monthlyFrom: 18000,
    gradient: "linear-gradient(135deg,#D8EAE0,#C0D8CA)",
    svgColor: "#7A9E87",
    message: "男性目線から率直なアドバイスをします。",
  },
  {
    id: 3,
    name: "佐藤 綾乃",
    kana: "さとう あやの",
    agencyId: 2,
    agencyName: "リーガルウェディング",
    area: "東京・渋谷",
    role: "シニアブライダルカウンセラー",
    experience: 12,
    tags: ["傾聴が得意", "30代実績多数", "押しつけない"],
    rating: 4.9,
    reviewCount: 28,
    online: false,
    minAdmission: 80000,
    monthlyFrom: 12000,
    gradient: "linear-gradient(135deg,#E8EEF0,#D0DFE4)",
    svgColor: "#6B8FBF",
    message: "急かされることなく、自分の希望が整理できる場をつくります。",
  },
  {
    id: 4,
    name: "鈴木 麻衣",
    kana: "すずき まい",
    agencyId: 3,
    agencyName: "シンプリーマリッジ",
    area: "大阪・梅田",
    role: "ブライダルカウンセラー",
    experience: 6,
    tags: ["再婚OK", "40代サポート", "関西エリア"],
    rating: 4.8,
    reviewCount: 19,
    online: true,
    minAdmission: 80000,
    monthlyFrom: 12000,
    gradient: "linear-gradient(135deg,#E8D8EE,#D4C0E2)",
    svgColor: "#9B7AB5",
    message: "再婚でも全く気にせず話せる環境をつくります。",
  },
  {
    id: 5,
    name: "中村 恵子",
    kana: "なかむら けいこ",
    agencyId: 4,
    agencyName: "ハッピーロードサロン",
    area: "名古屋・栄",
    role: "シニアブライダルカウンセラー",
    experience: 15,
    tags: ["成婚率が高い", "名古屋エリア", "アドバイスが的確"],
    rating: 4.6,
    reviewCount: 63,
    online: false,
    minAdmission: 100000,
    monthlyFrom: 14000,
    gradient: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    svgColor: "#B8860B",
    message: "15年のキャリアで積み上げた知識でサポートします。",
  },
  {
    id: 6,
    name: "林 俊介",
    kana: "はやし しゅんすけ",
    agencyId: 5,
    agencyName: "コトブキ相談センター",
    area: "東京・新宿",
    role: "ブライダルカウンセラー",
    experience: 4,
    tags: ["20代対応", "IT・クリエイター", "オンライン専門"],
    rating: 4.5,
    reviewCount: 16,
    online: true,
    minAdmission: 50000,
    monthlyFrom: 10000,
    gradient: "linear-gradient(135deg,#DBEAFE,#BFDBFE)",
    svgColor: "#3B82F6",
    message: "同世代感覚で話せる環境を大切にしています。",
  },
];
