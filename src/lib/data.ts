/* ────────────────────────────────────────────────────────────
   ふたりへ — モックデータ（Supabaseフォールバック用）
──────────────────────────────────────────────────────────── */
import { supabase } from '@/lib/supabase'
import { episodesData } from '@/lib/mock/episodes'
import { places } from '@/lib/mock/places'
import { placesHomeData } from '@/lib/mock/places-home'
import type { Database } from '@/types/database'

type CounselorRow = Database['public']['Tables']['counselors']['Row']

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

export type AgencyPhoto = {
  caption: string;
  bg: string; /* CSSグラデーション（本番はSupabase Storage URL に差し替え） */
};

/* 掲載プラン別写真上限（顧客には非表示） */
export const PLAN_PHOTO_LIMITS: Record<"premium" | "standard" | "fast", number> = {
  premium: 5,
  standard: 3,
  fast: 1,
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
  address: string;
  hours: string;
  holiday: string;
  reviews: AgencyReview[];
  campaign?: string;
  /** 相談所が個別に記載する経営方針・メッセージ */
  policy?: string;
  /** 掲載プラン（顧客には非表示） */
  plan: "premium" | "standard" | "fast";
  /** 写真一覧。表示上限は plan に応じて PLAN_PHOTO_LIMITS で制御 */
  photos: AgencyPhoto[];
  /**
   * キャンセルポリシー。
   * 相談所ごとに異なる場合はここを上書きする。
   * 未設定時は予約コーナーでデフォルト文言を表示する。
   */
  cancelPolicy?: string;
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
  campaign?: string;
  /**
   * キャンセルポリシー。
   * 将来的に相談所ごとのポリシーをカウンセラー詳細にも表示する際はここを参照する。
   * 未設定時は所属相談所の cancelPolicy にフォールバックする想定。
   */
  cancelPolicy?: string;
  /** 婚活タイプ診断で相性の良いタイプID（"A" | "B" | "C" | "D"） */
  diagnosisType?: string;
  /* ───── /kinda-talk リール用フィールド ───── */
  /** リール1枚目に表示される 20 文字以内のキャッチコピー */
  catchphrase?: string;
  /** 自己紹介の本文（個別ページ用） */
  intro?: string;
  /** 座右の銘や一言メッセージ */
  quote?: string;
  /** 得意分野（既存 tags より具体的なテキスト） */
  specialties?: string[];
  /** 資格 */
  qualifications?: string[];
  /** 料金（個別ページのテキスト表示用） */
  fee?: string;
  /** Kinda type（最大2: 自動診断1 + 手動追加1） */
  matchingTypes?: string[];
  /** 営業デモ用ダミーフラグ（true なら "サンプル" バッジ表示） */
  isDemo?: boolean;
  /** リール画像（モック段階ではグラデ + キャプションで表現） */
  reelImages?: { bg: string; caption?: string }[];
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
    address: "東京都中央区銀座4丁目",
    hours: "10:00〜20:00",
    holiday: "火曜定休",
    reviews: [
      { id: "rv1", user: "S.K さん（33歳）", rating: 5, text: "押しつけられることなく、自分のペースで決められました。", date: "2025年1月" },
      { id: "rv2", user: "M.T さん（29歳）", rating: 5, text: "職種への理解があるカウンセラーさんで安心でした。", date: "2025年2月" },
    ],
    cancelPolicy: "面談日の前日23:59までキャンセル無料。当日キャンセルも可（初回のみ）。",
    campaign: "初回面談料 無料キャンペーン実施中",
    policy: "「焦らず、急かさず、あなたのペースで」をモットーに、一人ひとりに寄り添ったカウンセリングを行っています。初回面談では婚活の悩みや理想のパートナー像をじっくりお聞きし、無理のないペースで活動を進めていただけるようサポートします。IT・医療・公務員など多様な職種のご成婚実績を持ち、おひとりおひとりのライフスタイルに合わせたご提案が当所の強みです。",
    plan: "premium",
    photos: [
      { caption: "エントランス", bg: "linear-gradient(135deg,#E8D8C8,#D4C4B0)" },
      { caption: "面談室", bg: "linear-gradient(135deg,#F0E8DC,#E0D0C0)" },
      { caption: "ラウンジ", bg: "linear-gradient(135deg,#DDD0C0,#CCC0B0)" },
      { caption: "カウンセリングルーム", bg: "linear-gradient(135deg,#EAE0D8,#D8CCB8)" },
      { caption: "資格・認定証", bg: "linear-gradient(135deg,#E4D8CC,#D0C4B0)" },
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
    address: "東京都渋谷区渋谷2丁目",
    hours: "11:00〜21:00",
    holiday: "水曜定休",
    cancelPolicy: "面談日の24時間前までキャンセル無料。それ以降のキャンセルはご連絡ください。",
    policy: "データと感性の両輪でパートナー探しをサポートします。AI相性診断はあくまでも出会いのきっかけ。大切なのは実際にお会いしたときの「感じ」だと私たちは考えています。20〜30代の方が多く活動されており、同世代の価値観を大切にしながらも、長期的なパートナーシップを見据えたアドバイスを心がけています。",
    reviews: [
      { id: "rv3", user: "K.M さん（28歳）", rating: 5, text: "急かされることなく、自分の希望が整理できた感じ。", date: "2025年3月" },
    ],
    plan: "standard",
    photos: [
      { caption: "エントランス", bg: "linear-gradient(135deg,#C8DCC8,#B8CEB8)" },
      { caption: "面談スペース", bg: "linear-gradient(135deg,#D4E4D4,#C0D4C0)" },
      { caption: "AI診断コーナー", bg: "linear-gradient(135deg,#BCDCBC,#A8CCA8)" },
      { caption: "ラウンジ", bg: "linear-gradient(135deg,#CCE0CC,#B8D0B8)" },
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
    address: "大阪府大阪市北区梅田1丁目",
    hours: "10:00〜19:00",
    holiday: "月・火曜定休",
    policy: "再婚・バツイチの方も、初婚の方と全く同じ目線でお迎えします。過去のご結婚歴を気にすることなく、「今のあなた」を大切に考えてくれるパートナーを一緒に探しましょう。40代の方のご成婚実績も豊富で、ライフステージに応じた柔軟なサポートが当所の誇りです。完全個室でのカウンセリングで、プライバシーにも配慮しています。",
    reviews: [
      { id: "rv4", user: "M.K さん（39歳）", rating: 5, text: "再婚でも全く気にせず話してくれた。最初からリラックスできた。", date: "2025年1月" },
    ],
    cancelPolicy: "キャンセルは面談日前日まで承ります。当日の急なご事情もお気軽にご相談ください。",
    campaign: "5月限定 入会金20,000円割引",
    plan: "standard",
    photos: [
      { caption: "完全個室の面談室", bg: "linear-gradient(135deg,#DCC8E8,#C8B0DC)" },
      { caption: "エントランス", bg: "linear-gradient(135deg,#E4D0EC,#D0BCE0)" },
      { caption: "カウンセラー紹介ボード", bg: "linear-gradient(135deg,#D8C4E4,#C4B0D8)" },
      { caption: "ラウンジ", bg: "linear-gradient(135deg,#E0CCEC,#CCB8E0)" },
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
    address: "愛知県名古屋市中区栄3丁目",
    hours: "10:00〜20:00",
    holiday: "木曜定休",
    policy: "創業15年・成婚実績1,000組以上の実績が私たちの自信です。名古屋・愛知エリア最大級のネットワークを活かし、地元に根ざした出会いをご提供しています。一時的なブームに流されず、長く安定した関係を築けるパートナーを真剣にお探しの方を全力でサポートします。経験豊富なカウンセラーが、婚活の全過程で的確なアドバイスをお届けします。",
    reviews: [
      { id: "rv5", user: "Y.N さん（34歳）", rating: 5, text: "15年のキャリア。話の引き出しが多く、アドバイスが的確。", date: "2025年2月" },
    ],
    cancelPolicy: "無断キャンセルはご遠慮ください。前日までのご連絡で何度でも日程変更可能です。",
    campaign: "ご成婚実績 累計1,000組突破記念 入会金半額",
    plan: "premium",
    photos: [
      { caption: "エントランス", bg: "linear-gradient(135deg,#FEF0B0,#FDE480)" },
      { caption: "ロビー", bg: "linear-gradient(135deg,#FDF0A0,#FDE070)" },
      { caption: "面談室A", bg: "linear-gradient(135deg,#FEECB0,#FDDE80)" },
      { caption: "面談室B", bg: "linear-gradient(135deg,#FEF4C0,#FDE890)" },
      { caption: "成婚記念コーナー", bg: "linear-gradient(135deg,#FDF2A8,#FDE878)" },
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
    address: "東京都新宿区新宿3丁目",
    hours: "9:00〜22:00",
    holiday: "なし",
    policy: "住んでいる場所に関係なく、全国どこからでも本格的な婚活ができる環境を提供しています。IT・クリエイター・フリーランスなど、柔軟な働き方をされている方の婚活実績が豊富です。オンラインだからこそできる「隙間時間を活用した婚活スタイル」を一緒に作りましょう。ビデオ通話での面談は、通勤時間や移動コストを気にすることなく参加できます。",
    reviews: [
      { id: "rv6", user: "A.R さん（28歳）", rating: 5, text: "同世代感覚で話せた。自分のペースを一緒に考えてくれた。", date: "2025年1月" },
    ],
    cancelPolicy: "オンライン面談のため当日キャンセル・日程変更も柔軟に対応します。お気軽にどうぞ。",
    plan: "fast",
    photos: [
      { caption: "オンライン面談の様子", bg: "linear-gradient(135deg,#C8DDF8,#B0CCEE)" },
      { caption: "事務所エントランス", bg: "linear-gradient(135deg,#D4E4FC,#C0D8F4)" },
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
    campaign: "初回面談料 無料",
    diagnosisType: "B",
    catchphrase: "焦らなくていい、話を聞かせて",
    intro: "結婚相談所のカウンセラーになって11年、約400組の出会いを見てきました。最初の面談で大切にしているのは、あなたが今どんな気持ちでここに来てくれたのかをゆっくり聞くこと。婚活は人生の選択。だから、急がず、誤魔化さず、あなたの言葉を待ちます。",
    quote: "「結婚は、誰かの理想ではなく、あなたの安心の場所」",
    specialties: ["30代女性のキャリア両立", "IT・医療職サポート", "傾聴型カウンセリング"],
    qualifications: ["IBJ認定カウンセラー", "メンタルヘルス・マネジメント検定 II 種"],
    fee: "入会金 100,000円 / 月会費 18,000円〜",
    matchingTypes: ["anshin", "jibunjiku"],
    reelImages: [
      { bg: "linear-gradient(135deg,#F5E8D8,#EDD8C0)", caption: "焦らなくていい、話を聞かせて" },
      { bg: "linear-gradient(160deg,#FAEAE5,#F0D8D0)", caption: "あなたのペースで、いっしょに" },
      { bg: "linear-gradient(135deg,#FAF3DE,#F4E8C4)", caption: "30代女性の婚活、約400組見てきました" },
    ],
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
    campaign: "初回面談料 無料",
    diagnosisType: "A",
    catchphrase: "回り道はしない、戦略で結婚する",
    intro: "医師・自営業・経営者の方の婚活を中心にサポート。男性目線で「どうすれば確率が上がるか」を共に考えます。優しさだけでは婚活は終わらない。データと戦略で、ここから半年〜1年での成婚を一緒に目指します。",
    quote: "「迷ったら、行動で答えを取りに行く」",
    specialties: ["医師・経営者の婚活", "短期成婚プラン", "男性目線アドバイス"],
    qualifications: ["IBJ認定カウンセラー", "ファイナンシャルプランナー2級"],
    fee: "入会金 100,000円 / 月会費 18,000円〜",
    matchingTypes: ["senryaku", "zenryoku"],
    reelImages: [
      { bg: "linear-gradient(135deg,#D8EAE0,#C0D8CA)", caption: "回り道はしない、戦略で結婚する" },
      { bg: "linear-gradient(160deg,#E0ECF8,#C4D8EC)", caption: "男性目線で確率を上げる" },
    ],
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
    diagnosisType: "C",
    catchphrase: "あなたの軸を、一緒にさがしましょう",
    intro: "婚活で迷子になっていた方の「自分にとって大切なもの」を一緒に言葉にしてきました。結婚は誰かに合わせる場所ではなく、あなたの価値観を分かち合える人との出会い。12年間で見てきたのは、自分軸を見つけた人ほど、納得のいく結婚にたどり着いているということ。",
    quote: "「答えは外ではなく、あなたの中にある」",
    specialties: ["価値観の言語化", "30代の自分探し", "押しつけないカウンセリング"],
    qualifications: ["IBJ認定カウンセラー", "産業カウンセラー"],
    fee: "入会金 80,000円 / 月会費 12,000円〜",
    matchingTypes: ["jibunjiku", "anshin"],
    reelImages: [
      { bg: "linear-gradient(135deg,#E8EEF0,#D0DFE4)", caption: "あなたの軸を、一緒にさがしましょう" },
      { bg: "linear-gradient(160deg,#FAEAE5,#F0D8D0)", caption: "急がない婚活でいい" },
      { bg: "linear-gradient(135deg,#F0E5D6,#E0D0BC)", caption: "自分の言葉を取り戻す時間" },
    ],
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
    campaign: "5月限定 入会金20,000円割引",
    diagnosisType: "B",
    catchphrase: "もう一度、と決めたあなたへ",
    intro: "再婚・40代以降の婚活を専門にサポート。一度目で諦めかけた人ほど、本当に大切なものが見えていることが多いと感じています。事情があっても、過去があっても、ここからの幸せは作れる。関西エリアで6年間、新しい出発に立ち会ってきました。",
    quote: "「過去は変えられないけれど、これからは選べる」",
    specialties: ["再婚サポート", "40代以降の婚活", "シングルマザー対応"],
    qualifications: ["IBJ認定カウンセラー", "家族支援専門相談員"],
    fee: "入会金 80,000円 / 月会費 12,000円〜",
    matchingTypes: ["restart", "anshin"],
    reelImages: [
      { bg: "linear-gradient(135deg,#E8D8EE,#D4C0E2)", caption: "もう一度、と決めたあなたへ" },
      { bg: "linear-gradient(160deg,#E8F4E4,#C8E0C0)", caption: "過去ごと受け止める場所" },
    ],
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
    campaign: "入会金半額キャンペーン実施中",
    diagnosisType: "A",
    catchphrase: "15年の経験で、確率を上げる",
    intro: "結婚相談所のカウンセラーになって15年、名古屋エリアで300組以上の成婚を見届けてきました。経験から導き出した「決まる人のパターン」をお伝えします。優しさと厳しさを使い分け、一年以内の成婚を真剣に目指す方を歓迎します。",
    quote: "「正しい行動は、必ず結果につながる」",
    specialties: ["短期成婚", "名古屋エリア", "経験豊富なベテラン"],
    qualifications: ["IBJ認定カウンセラー", "成婚アドバイザー資格"],
    fee: "入会金 100,000円 / 月会費 14,000円〜",
    matchingTypes: ["senryaku", "zenryoku"],
    reelImages: [
      { bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)", caption: "15年の経験で、確率を上げる" },
      { bg: "linear-gradient(160deg,#E0ECF8,#C4D8EC)", caption: "名古屋で300組の成婚に立ち会いました" },
    ],
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
    diagnosisType: "D",
    catchphrase: "同世代だから、わかる温度感で",
    intro: "20代後半〜30代前半の婚活を中心に、オンラインでの相談を専門にしています。同世代として、価値観や働き方を理解した上でアドバイスしたい。地方在住の方や、仕事が忙しくて店舗に通えない方も大歓迎です。",
    quote: "「気構えずに、まずは話してみよう」",
    specialties: ["20代の婚活", "オンライン専門", "IT・クリエイター職"],
    qualifications: ["IBJ認定カウンセラー"],
    fee: "入会金 50,000円 / 月会費 10,000円〜",
    matchingTypes: ["lifestyle", "jibunjiku"],
    reelImages: [
      { bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)", caption: "同世代だから、わかる温度感で" },
      { bg: "linear-gradient(160deg,#F0E5D6,#E0D0BC)", caption: "オンラインで全国どこからでも" },
    ],
  },
  /* ──────────────────────────────────────────
     営業デモ用ダミー（is_demo=true）
     ふうかが他相談所への営業時に「掲載されるとこう見えます」を
     見せるためのサンプル。カード上に「サンプル」バッジが付く。
  ────────────────────────────────────────── */
  {
    id: 101,
    name: "藤村 詩織（サンプル）",
    kana: "ふじむら しおり",
    agencyId: 1,
    agencyName: "ブライダルハウス銀座（サンプル）",
    area: "東京・銀座",
    role: "シニアブライダルカウンセラー",
    experience: 15,
    tags: ["再婚OK", "30〜40代女性", "実績重視"],
    rating: 4.9,
    reviewCount: 28,
    online: true,
    minAdmission: 110000,
    monthlyFrom: 18000,
    gradient: "linear-gradient(135deg,#FAEAE5,#F0D8D0)",
    svgColor: "#D4A090",
    message: "（サンプル）あなたのペースで、丁寧に。",
    catchphrase: "丁寧に、納得のいく出会いを",
    intro: "（サンプル表示）ブライダルハウス銀座で15年カウンセラーを務めています。30〜40代女性を中心に、再婚や仕事との両立など、人生のステージに合わせたサポートを大切にしています。",
    quote: "「焦らず、流されず、選ぶ」",
    specialties: ["再婚サポート", "30〜40代女性", "実績重視"],
    qualifications: ["IBJ認定カウンセラー"],
    fee: "入会金 110,000円 / 月会費 18,000円〜",
    matchingTypes: ["anshin", "restart"],
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#FAEAE5,#F0D8D0)", caption: "丁寧に、納得のいく出会いを" },
      { bg: "linear-gradient(160deg,#F0E5D6,#E0D0BC)", caption: "15年の実績でサポート" },
      { bg: "linear-gradient(135deg,#FAF3DE,#F4E8C4)", caption: "再婚も、年齢も、関係なく" },
    ],
  },
  {
    id: 102,
    name: "吉岡 結衣（サンプル）",
    kana: "よしおか ゆい",
    agencyId: 3,
    agencyName: "マリッジサポート梅田（サンプル）",
    area: "大阪・梅田",
    role: "ブライダルカウンセラー",
    experience: 8,
    tags: ["自分軸", "20〜30代", "関西エリア"],
    rating: 4.8,
    reviewCount: 19,
    online: true,
    minAdmission: 80000,
    monthlyFrom: 13000,
    gradient: "linear-gradient(135deg,#E8EEF0,#D0DFE4)",
    svgColor: "#A0B8D4",
    message: "（サンプル）自分の軸を、一緒に見つけましょう。",
    catchphrase: "あなたの「好き」から始めよう",
    intro: "（サンプル表示）マリッジサポート梅田所属。8年間で「自分が本当は何を求めているのか」を一緒に見つけることを大切にしてきました。",
    quote: "「好きの輪郭が、相手を引き寄せる」",
    specialties: ["自分軸の発見", "20〜30代", "関西"],
    qualifications: ["IBJ認定カウンセラー", "心理カウンセラー資格"],
    fee: "入会金 80,000円 / 月会費 13,000円〜",
    matchingTypes: ["jibunjiku"],
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#E8EEF0,#D0DFE4)", caption: "あなたの「好き」から始めよう" },
      { bg: "linear-gradient(160deg,#FAEAE5,#F0D8D0)", caption: "8年間、自分軸を一緒に探してきました" },
    ],
  },
  {
    id: 103,
    name: "山本 健太（サンプル）",
    kana: "やまもと けんた",
    agencyId: 5,
    agencyName: "天神マリッジセンター（サンプル）",
    area: "福岡・天神",
    role: "ブライダルカウンセラー",
    experience: 12,
    tags: ["戦略派", "データ志向", "男性カウンセラー"],
    rating: 4.7,
    reviewCount: 31,
    online: true,
    minAdmission: 90000,
    monthlyFrom: 14000,
    gradient: "linear-gradient(135deg,#E0ECF8,#C4D8EC)",
    svgColor: "#A0B8D4",
    message: "（サンプル）データに基づく戦略で、確実に。",
    catchphrase: "データで選ぶ、最短の道",
    intro: "（サンプル表示）天神マリッジセンター所属。12年間蓄積したデータをもとに、確率を上げる行動を一緒に設計します。",
    quote: "「感情と数字、両方で結婚する」",
    specialties: ["戦略立案", "データ分析", "男性目線アドバイス"],
    qualifications: ["IBJ認定カウンセラー", "MBA"],
    fee: "入会金 90,000円 / 月会費 14,000円〜",
    matchingTypes: ["senryaku"],
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#E0ECF8,#C4D8EC)", caption: "データで選ぶ、最短の道" },
      { bg: "linear-gradient(160deg,#D8EAE0,#C0D8CA)", caption: "12年分のデータが、あなたを支える" },
    ],
  },
  {
    id: 104,
    name: "中村 さくら（サンプル）",
    kana: "なかむら さくら",
    agencyId: 4,
    agencyName: "栄ブライダルカフェ（サンプル）",
    area: "名古屋・栄",
    role: "ブライダルカウンセラー",
    experience: 5,
    tags: ["20〜30代", "全力サポート", "明るい"],
    rating: 4.9,
    reviewCount: 14,
    online: false,
    minAdmission: 70000,
    monthlyFrom: 11000,
    gradient: "linear-gradient(135deg,#F5E5E1,#ECC8C5)",
    svgColor: "#C89090",
    message: "（サンプル）二人三脚で、本気で婚活します。",
    catchphrase: "本気のあなたと、本気で走ります",
    intro: "（サンプル表示）栄ブライダルカフェ所属。5年間、全力で寄り添うことを大切にしてきました。本気で結婚したい人と本気で向き合う、シンプルだけど強いスタンスです。",
    quote: "「本気は、最強の武器」",
    specialties: ["全力サポート", "明るい雰囲気", "20〜30代"],
    qualifications: ["IBJ認定カウンセラー"],
    fee: "入会金 70,000円 / 月会費 11,000円〜",
    matchingTypes: ["zenryoku"],
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#F5E5E1,#ECC8C5)", caption: "本気のあなたと、本気で走ります" },
      { bg: "linear-gradient(160deg,#FAF3DE,#F4E8C4)", caption: "全力で、結婚を一緒に取りに行く" },
    ],
  },
  {
    id: 105,
    name: "高橋 玲奈（サンプル）",
    kana: "たかはし れいな",
    agencyId: 5,
    agencyName: "オンライン専門 RING（サンプル）",
    area: "オンライン",
    role: "ブライダルカウンセラー",
    experience: 10,
    tags: ["オンライン専門", "仕事忙しい人向け", "全国対応"],
    rating: 4.8,
    reviewCount: 22,
    online: true,
    minAdmission: 60000,
    monthlyFrom: 11000,
    gradient: "linear-gradient(135deg,#F0E5D6,#E0D0BC)",
    svgColor: "#B0A090",
    message: "（サンプル）忙しい毎日でも、無理なく続けられる婚活を。",
    catchphrase: "仕事も、婚活も、両立できる",
    intro: "（サンプル表示）オンライン専門 RING 所属。10年間、忙しい方の婚活をサポート。「仕事を犠牲にしない婚活」を一緒に設計します。",
    quote: "「無理なく続くことが、いちばんの近道」",
    specialties: ["オンライン専門", "ライフスタイル両立", "全国対応"],
    qualifications: ["IBJ認定カウンセラー"],
    fee: "入会金 60,000円 / 月会費 11,000円〜",
    matchingTypes: ["lifestyle"],
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#F0E5D6,#E0D0BC)", caption: "仕事も、婚活も、両立できる" },
      { bg: "linear-gradient(160deg,#E0ECF8,#C4D8EC)", caption: "全国どこからでもオンラインで" },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   Supabase データ取得関数
──────────────────────────────────────────────────────────── */

// カウンセラー一覧取得
export async function getCounselors() {
  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .eq('is_published', true)
    .order('review_count', { ascending: false })
  if (error) {
    console.error('getCounselors error:', error)
    return COUNSELORS
  }
  return data
}

// カウンセラー詳細取得
export async function getCounselorById(id: string): Promise<CounselorRow | null> {
  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

// 相談所一覧取得
export async function getAgencies() {
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return AGENCIES
  return data
}

// お店一覧取得
// NOTE: Supabase shops テーブルのスキーマは PlaceHome 型と未整合のため
// 現時点ではモックデータを返す。スキーマ整合後に Supabase データに切り替える。
export async function getShops() {
  void places // 将来 Supabase 利用時の参照用
  return placesHomeData
}

// 口コミ取得（カウンセラー別）
export async function getReviewsByCounselor(counselorId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('counselor_id', counselorId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

// エピソード一覧取得
export async function getEpisodes() {
  const { data, error } = await supabase
    .from('episodes')
    .select(`
      *,
      agencies(name),
      counselors(name)
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error) return episodesData
  return data
}

// エピソード詳細取得
export async function getEpisodeById(id: string) {
  const { data, error } = await supabase
    .from('episodes')
    .select(`
      *,
      agencies(name),
      counselors(name)
    `)
    .eq('id', id)
    .single()
  if (error) return null
  return data
}
