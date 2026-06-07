/* ────────────────────────────────────────────────────────────
   Kinda ふたりへ — モックデータ（Supabaseフォールバック用）
──────────────────────────────────────────────────────────── */
import { supabase } from '@/lib/supabase'
import { episodesData } from '@/lib/mock/episodes'
import { places } from '@/lib/mock/places'
import { placesHomeData, type PlaceHome, type PlaceTabCategory, type ThumbVariant } from '@/lib/mock/places-home'
import type { Database } from '@/types/database'

type CounselorRow = Database['public']['Tables']['counselors']['Row']
type CounselorMediaRow = Database['public']['Tables']['counselor_media']['Row']
type ShopRow = Database['public']['Tables']['shops']['Row']

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
  /**
   * 面談開始時刻から何時間前までキャンセル可能か。
   * 0 = 当日まで可、24 = 24時間前まで。未設定なら 24 とみなす。
   */
  cancelDeadlineHours?: number;
  /** キャンセル期限切れ時にユーザーへ案内する電話番号 */
  phone?: string;
  /** キャンセル期限切れ時にユーザーへ案内するメールアドレス */
  email?: string;
  /** 最寄駅からの行き方（相談所が任意で記入する自由テキスト） */
  directions?: string | null;
  /* ───── カウンセラー管理画面から編集されるフィールド ───── */
  /** 料金プラン配列（複数プラン対応）。空配列なら従来の plans を表示 */
  fees?: FeePlan[];
  /** 各種割引（U30 等）— 料金プラン横断のお得情報枠 */
  discounts?: Discount[];
  /** キャンペーン本文（新フィールド。旧 campaign より優先） */
  campaignText?: string | null;
  /** キャンペーン有効期限 ISO 文字列。NULL なら無期限 */
  campaignExpiresAt?: string | null;
  /** 創業日 'YYYY-MM-DD'（NULL なら新店舗バッジ非表示） */
  foundedAt?: string | null;
  /** 相談所のロゴ・プロフィール画像 URL（015 マイグレーション以降に登録される） */
  logoUrl?: string | null;
  /** 相談所のリール画像（CounselorReelMini と同じ shape） */
  reelImages?: { bg: string; caption?: string }[];
  /** 入会時に提出が必要な書類リスト（021 マイグレーション）
   *  例：["独身証明書", "住民票", "本人確認書類", "所得証明書"] */
  requiredDocuments?: string[] | null;
  /** 相談所全体の注意事項（021 マイグレーション）— 複数行可 */
  generalNotes?: string | null;
  /** 営業デモ用ダミーフラグ（true なら "サンプル" バッジを agency 関連 UI に表示） */
  isDemo?: boolean;
};

/** 料金プラン1項目（カウンセラー管理画面と共通） */
export type FeeItem = {
  /** 例：入会金 / 月会費 / 成婚料 / 独自名 */
  label: string;
  /** 円単位の整数。0 は「無料」と表示 */
  amount: number;
  /** 表示サフィックス（任意）。例: '/月' '/回' '/年'。
   *  未指定 & amount > 0 なら「(税込)」を自動付与 */
  suffix?: string | null;
  /** 補足説明（任意）。「初回のみ」等 */
  note?: string | null;
};

/** 料金プラン（複数を agencies.fees に持てる） */
export type FeePlan = {
  /** プラン名。例: 'ベーシック' / 'フルサポート' */
  name: string;
  /** 「人気」バッジ表示するか */
  popular?: boolean;
  /** 内訳項目 */
  items: FeeItem[];
  /** プラン単位の注意事項（自由テキスト・複数行可） */
  notes?: string | null;
  /** 「こんな方向け」1〜2行の対象セグメント */
  description?: string | null;
  /** 「含まれるもの」箇条書き（短文・3〜6 件想定） */
  included?: string[] | null;
  /** プラン単位の追加オプション（写真撮影・追加カウンセリング 等）— FeeItem と同 shape */
  options?: FeeItem[] | null;
};

/** 割引（U30 / 乗り換え割 / 学割など）— 料金プランと独立した「お得情報」枠 */
export type Discount = {
  label: string;
  condition?: string | null;
  amount?: number | null;   // 円表記
  percent?: number | null;  // % 表記（amount と排他）
  note?: string | null;
};

export type Counselor = {
  /** mock 段階では数値、Supabase 移行後は UUID 文字列 */
  id: number | string;
  name: string;
  kana: string;
  agencyId: number | string;
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
  /** 旧スキーマ互換: 個別ページの bio フィールド（intro と並行使用される箇所がある） */
  bio?: string;
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
  /** 所属相談所の創業日（user-side で「新店舗」バッジ判定に使用） */
  agencyFoundedAt?: string | null;
  /** プロフィール写真 URL（Supabase Storage 等） */
  photoUrl?: string | null;
  /** 経歴ラベル（例: 「10年以上」など、数値より柔軟に表現したい時） */
  experienceLabel?: string | null;
  /** 成婚実績件数（DB に無ければ undefined。0 / 未設定なら非表示） */
  successCount?: number | null;
  /* ───── カウンセラー個別キャンペーン（021 マイグレーション） ─────
     既存の `campaign?: string`（短文）と並列で、構造化されたキャンペーン情報を持つ。
     カードでは campaignLabel を優先表示、未設定なら旧 campaign 文字列にフォールバック。
     詳細ページでは campaignLabel / campaignDetail / campaignExpiry を組で表示。 */
  /** カウンセラー個別キャンペーンの見出し */
  campaignLabel?: string | null;
  /** カウンセラー個別キャンペーンの説明 */
  campaignDetail?: string | null;
  /** カウンセラー個別キャンペーンの期限表記（例：「〜2026-06-30」） */
  campaignExpiry?: string | null;
};

export const AGENCIES: Agency[] = [
  {
    id: 1,
    name: "Atelier Mariage 銀座",
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
    cancelDeadlineHours: 0,
    phone: "03-1234-5678",
    email: "info@bridal-house-tokyo.example.jp",
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
    isDemo: true,
  },
  {
    id: 2,
    name: "Wedding Note 渋谷",
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
    cancelDeadlineHours: 24,
    phone: "03-2345-6789",
    email: "contact@legal-wedding.example.jp",
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
    isDemo: true,
  },
  {
    id: 5,
    name: "Marry Hub 新宿",
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
    cancelDeadlineHours: 0,
    phone: "0120-555-1234",
    email: "support@kotobuki-center.example.jp",
    plan: "fast",
    photos: [
      { caption: "オンライン面談の様子", bg: "linear-gradient(135deg,#C8DDF8,#B0CCEE)" },
      { caption: "事務所エントランス", bg: "linear-gradient(135deg,#D4E4FC,#C0D8F4)" },
    ],
    isDemo: true,
  },
];

export const COUNSELORS: Counselor[] = [
  {
    id: 1,
    name: "田中 美紀",
    kana: "たなか みき",
    agencyId: 1,
    agencyName: "Atelier Mariage 銀座",
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
    isDemo: true,
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
    agencyName: "Atelier Mariage 銀座",
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
    isDemo: true,
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
    agencyName: "Wedding Note 渋谷",
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
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#E8EEF0,#D0DFE4)", caption: "あなたの軸を、一緒にさがしましょう" },
      { bg: "linear-gradient(160deg,#FAEAE5,#F0D8D0)", caption: "急がない婚活でいい" },
      { bg: "linear-gradient(135deg,#F0E5D6,#E0D0BC)", caption: "自分の言葉を取り戻す時間" },
    ],
  },
  {
    id: 6,
    name: "林 俊介",
    kana: "はやし しゅんすけ",
    agencyId: 5,
    agencyName: "Marry Hub 新宿",
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
    isDemo: true,
    reelImages: [
      { bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)", caption: "同世代だから、わかる温度感で" },
      { bg: "linear-gradient(160deg,#F0E5D6,#E0D0BC)", caption: "オンラインで全国どこからでも" },
    ],
  },
  /* ──────────────────────────────────────────
     注: 2026-05-21 にデモカウンセラー（ID 101〜105）と
     重複タイプのカウンセラー（ID 4, 5）を削除。
     ID 1, 2, 3, 6 の 4 名（各 diagnosisType 1 名ずつ）が
     営業用サンプルとして残る。isDemo=true で「サンプル」バッジが表示される。
     本番リリース後、実カウンセラーが Supabase に登録されたら
     ここの mock 4 名は段階的に消す予定。
  ────────────────────────────────────────── */
];

/* ────────────────────────────────────────────────────────────
   Supabase データ取得関数
──────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────
   Supabase Row → モック互換 Counselor 型へのマッパー
   002_kinda_talk_extensions.sql / 003_seed_kinda_talk_demo.sql
   実行後の Supabase 構造を Counselor 型に変換する。
──────────────────────────────────────────────────────────── */
function mapCounselorRowToCounselor(
  row: CounselorRow,
  agencyName?: string,
  reelMedia?: CounselorMediaRow[],
  agencyFoundedAt?: string | null,
): Counselor {
  return {
    id: row.id,
    name: row.name,
    kana: '', // Supabase 側に kana カラム未追加。必要なら 004 マイグレーションで追加。
    agencyId: row.agency_id,
    agencyName: agencyName ?? '',
    area: row.area ?? '',
    role: row.role ?? 'ブライダルカウンセラー',
    experience: row.years_of_experience ?? 0,
    tags: row.specialties ?? [],
    rating: Number(row.rating_avg ?? 0),
    reviewCount: row.review_count ?? 0,
    online: false, // Supabase 側に未追加。デフォルト false。
    minAdmission: 0,
    monthlyFrom: 0,
    gradient: 'linear-gradient(135deg,#FAF3DE,#F4E8C4)',
    svgColor: '#B89A4A',
    message: row.message ?? '',
    diagnosisType: row.diagnosis_type ?? undefined,
    catchphrase: row.catchphrase ?? undefined,
    intro: row.intro ?? undefined,
    bio: row.bio ?? undefined,
    quote: row.quote ?? undefined,
    specialties: row.specialties ?? undefined,
    qualifications: row.qualifications ?? undefined,
    fee: row.fee ?? undefined,
    matchingTypes: row.matching_types ?? undefined,
    isDemo: row.is_demo ?? false,
    reelImages: (reelMedia ?? [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((m) => ({
        // CSS で双引用符でくるんで URL に空白等が含まれても安全に
        bg: m.fallback_bg ?? `url("${m.media_url}")`,
        caption: m.caption ?? undefined,
      })),
    agencyFoundedAt: agencyFoundedAt ?? null,
    photoUrl: row.photo_url ?? null,
    experienceLabel: row.experience_label ?? null,
    // success_count は現状 counselors テーブルに未追加。
    // 将来マイグレーションで追加した時にここで row.success_count を拾うよう拡張する。
    successCount: null,
    // カウンセラー個別キャンペーン（021 マイグレーション）
    campaignLabel: row.campaign_label ?? null,
    campaignDetail: row.campaign_detail ?? null,
    campaignExpiry: row.campaign_expiry ?? null,
  }
}

/* ────────────────────────────────────────────────────────────
   カウンセラー一覧取得
   - Supabase に公開データがあれば Counselor[] を返す
   - 0 件 / エラー時は mock COUNSELORS にフォールバック
──────────────────────────────────────────────────────────── */
export async function getCounselors(): Promise<Counselor[]> {
  const { data, error } = await supabase
    .from('counselors')
    .select('*')
    .eq('is_published', true)
    .order('reel_order', { ascending: true })

  // Supabase SDK v2 の型推論が壊れるため明示的にキャストする（CLAUDE.md 参照）
  const counselorRows = data as CounselorRow[] | null

  if (error || !counselorRows || counselorRows.length === 0) {
    if (error) console.error('getCounselors error (fallback to mock):', error.message)
    return COUNSELORS
  }

  // 関連する agencies と counselor_media を別クエリで取得（JOIN は型推論が壊れるため避ける）
  const agencyIds = Array.from(new Set(counselorRows.map((c) => c.agency_id)))
  const counselorIds = counselorRows.map((c) => c.id)

  const [agencyRes, mediaRes] = await Promise.all([
    supabase.from('agencies').select('id,name,founded_at').in('id', agencyIds),
    supabase.from('counselor_media').select('*').in('counselor_id', counselorIds),
  ])
  const agencyRows = agencyRes.data as Array<{ id: string; name: string; founded_at: string | null }> | null
  const mediaRows = mediaRes.data as CounselorMediaRow[] | null

  const agencyById = new Map<string, { name: string; founded_at: string | null }>(
    (agencyRows ?? []).map((a) => [a.id, { name: a.name, founded_at: a.founded_at }]),
  )
  const mediaByCounselor = new Map<string, CounselorMediaRow[]>()
  for (const m of mediaRows ?? []) {
    const list = mediaByCounselor.get(m.counselor_id) ?? []
    list.push(m)
    mediaByCounselor.set(m.counselor_id, list)
  }

  return counselorRows.map((row) => {
    const ag = agencyById.get(row.agency_id)
    return mapCounselorRowToCounselor(
      row,
      ag?.name,
      mediaByCounselor.get(row.id),
      ag?.founded_at ?? null,
    )
  })
}

/* ────────────────────────────────────────────────────────────
   カウンセラー詳細取得
   - Supabase の row を Counselor 型で返す
   - 見つからない時は null（呼び出し側で notFound() 等する）
   - mock fallback は呼び出し側で別途 COUNSELORS.find() してマージする想定
──────────────────────────────────────────────────────────── */
export async function getCounselorById(id: string): Promise<Counselor | null> {
  const res = await supabase
    .from('counselors')
    .select('*')
    .eq('id', id)
    .single()
  const row = res.data as CounselorRow | null
  if (res.error || !row) return null

  const [agencyRes, mediaRes] = await Promise.all([
    supabase.from('agencies').select('id,name,founded_at').eq('id', row.agency_id).single(),
    supabase
      .from('counselor_media')
      .select('*')
      .eq('counselor_id', row.id)
      .order('display_order', { ascending: true }),
  ])
  const agency = agencyRes.data as { id: string; name: string; founded_at: string | null } | null
  const media = mediaRes.data as CounselorMediaRow[] | null

  return mapCounselorRowToCounselor(row, agency?.name, media ?? [], agency?.founded_at ?? null)
}

/* ────────────────────────────────────────────────────────────
   カウンセラーのリール画像のみ取得
──────────────────────────────────────────────────────────── */
export async function getCounselorMedia(counselorId: string): Promise<CounselorMediaRow[]> {
  const res = await supabase
    .from('counselor_media')
    .select('*')
    .eq('counselor_id', counselorId)
    .order('display_order', { ascending: true })
  const data = res.data as CounselorMediaRow[] | null
  if (res.error || !data) return []
  return data
}

/* ────────────────────────────────────────────────────────────
   Agency 用ヘルパー
──────────────────────────────────────────────────────────── */

/** 創業日から「新店舗」表示期間（日数） */
export const NEW_SHOP_DAYS = 365;

/** Supabase agencies 行（snake_case）を Agency 型の partial にマッピング */
type AgencyPartial = Omit<Partial<Agency>, 'id'> & { id: number | string };

/**
 * closed_weekdays 配列（0=日 〜 6=土）を「火・水曜定休」のような表示テキストに変換。
 * - 空配列 / null → null（表示しない）
 * - 1 件: 「火曜定休」
 * - 2 件以上: 「火・水曜定休」
 * - 全曜日: 「年中無休」ではなく「全日定休」のまま（運用上ありえないので例外なし）
 */
function holidayFromClosedWeekdays(weekdays?: number[] | null): string | null {
  if (!Array.isArray(weekdays) || weekdays.length === 0) return null;
  const labels = ['日', '月', '火', '水', '木', '金', '土'];
  const valid = weekdays.filter((w) => Number.isInteger(w) && w >= 0 && w <= 6);
  if (valid.length === 0) return null;
  const sorted = [...new Set(valid)].sort((a, b) => a - b);
  return sorted.map((w) => labels[w]).join('・') + '曜定休';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSupabaseAgency(row: any): AgencyPartial {
  if (!row) return { id: '' };
  return {
    ...row,
    fees: Array.isArray(row.fees) ? row.fees : [],
    discounts: Array.isArray(row.discounts) ? row.discounts : [],
    /* 016 マイグレーション: この相談所の特徴 */
    features: Array.isArray(row.features) ? row.features : [],
    campaignText: row.campaign_text ?? null,
    campaignExpiresAt: row.campaign_expires_at ?? null,
    foundedAt: row.founded_at ?? null,
    cancelPolicy: row.cancel_policy ?? row.cancelPolicy ?? undefined,
    cancelDeadlineHours: row.cancel_deadline_hours ?? row.cancelDeadlineHours ?? undefined,
    /* 013 マイグレーションで追加: 会場へのアクセス情報 */
    address: row.address ?? null,
    access: row.access ?? null,
    directions: row.directions ?? null,
    /* 既存カラムを user-site の Agency 型に合わせて命名統一
       - business_hours_text → hours
       - closed_weekdays (number[]) → holiday (string) */
    hours: row.business_hours_text ?? row.hours ?? null,
    holiday: holidayFromClosedWeekdays(row.closed_weekdays) ?? row.holiday ?? null,
    /* 015 マイグレーション: ロゴ画像 URL */
    logoUrl: row.logo_url ?? null,
    /* 021 マイグレーション: 入会時の提出書類 + 全体注意事項 */
    requiredDocuments: Array.isArray(row.required_documents) ? row.required_documents : null,
    generalNotes: row.general_notes ?? null,
  };
}

/** Supabase agency_media 行を user-site の reel 画像 shape にマッピング */
type AgencyMediaRow = {
  id: string;
  agency_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string | null;
  display_order: number;
  fallback_bg: string | null;
};
function mapAgencyMediaToReelImage(rows: AgencyMediaRow[]): { bg: string; caption?: string }[] {
  return rows
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((m) => ({
      bg: m.fallback_bg ?? `url("${m.media_url}")`,
      caption: m.caption ?? undefined,
    }));
}

/** キャンペーン本文を表示すべきか判定（期限切れ・空文字は false） */
export function isCampaignActive(
  text?: string | null,
  expiresAt?: string | null,
): boolean {
  if (!text || !text.trim()) return false;
  if (!expiresAt) return true;
  const expiry = new Date(expiresAt);
  if (isNaN(expiry.getTime())) return true;
  return expiry > new Date();
}

/**
 * カウンセラー個別キャンペーンの有効判定。
 * campaignExpiry はフリーテキスト（例：「〜2026-06-30」「2026年6月30日まで」）のため、
 * 文字列から YYYY / M / D を抽出し、期限日の終わり（23:59:59）までを有効とする。
 * - ラベル空 → 非表示(false)
 * - 期限テキストなし or 日付抽出不可 → 表示(true)（誤って隠さない安全側）
 */
export function isCounselorCampaignActive(
  label?: string | null,
  expiry?: string | null,
): boolean {
  if (!label || !label.trim()) return false;
  if (!expiry || !expiry.trim()) return true;
  const m = expiry.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!m) return true;
  const end = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 23, 59, 59);
  if (isNaN(end.getTime())) return true;
  return new Date() <= end;
}

/** 新店舗バッジを表示すべきか（創業から NEW_SHOP_DAYS 以内かつ未来でない） */
export function isNewShop(foundedAt?: string | null): boolean {
  if (!foundedAt) return false;
  const founded = new Date(foundedAt.length === 10 ? foundedAt + 'T00:00:00' : foundedAt);
  if (isNaN(founded.getTime())) return false;
  const now = new Date();
  if (founded > now) return false;
  const expires = new Date(founded.getTime() + NEW_SHOP_DAYS * 24 * 60 * 60 * 1000);
  return now < expires;
}

/** 料金額の表示文字列（税込統一）— suffix 指定なしのレガシー版 */
export function formatFeeAmount(amount: number): string {
  if (amount === 0) return '無料';
  return `${amount.toLocaleString('ja-JP')}円（税込）`;
}

/**
 * 料金 1 項目のフォーマット情報を返す。
 * - amount === 0 → { main: '無料', suffix: null }
 * - amount > 0 + suffix なし → { main: '¥XX,XXX', suffix: '(税込)' }
 * - amount > 0 + suffix あり → { main: '¥XX,XXX', suffix: 'XXX' }（例: '/月'）
 *   suffix を持つ項目は税込前提のため (税込) は付けない（重複防止）
 */
export function formatFeeItem(item: FeeItem): { main: string; suffix: string | null } {
  if (item.amount === 0) return { main: '無料', suffix: null };
  const main = `¥${item.amount.toLocaleString('ja-JP')}`;
  const suffix = item.suffix && item.suffix.trim() ? item.suffix.trim() : '(税込)';
  return { main, suffix };
}

/* ────────────────────────────────────────────────────────────
   カウンセラーの次の予約可能枠を取得
   - status='open' かつ start_at >= 今 の最早行を返す
   - UUID 以外（mock の数値 id）が渡されたら null（呼び出し側で mock 値を使う）
──────────────────────────────────────────────────────────── */
type NextSlotInfo = { startAt: string; endAt: string } | null
export async function getNextSlotByCounselor(counselorId: string): Promise<NextSlotInfo> {
  // mock の数値 id（"1" 〜 "105"）は slots テーブルに対応する行が無いのでスキップ
  if (!counselorId || !/^[0-9a-f-]{36}$/i.test(counselorId)) return null
  const nowIso = new Date().toISOString()
  const res = await supabase
    .from('slots')
    .select('start_at,end_at,status')
    .eq('counselor_id', counselorId)
    .eq('status', 'open')
    .gte('start_at', nowIso)
    .order('start_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  const row = res.data as { start_at: string; end_at: string; status: string } | null
  if (res.error || !row) return null
  return { startAt: row.start_at, endAt: row.end_at }
}

/* ────────────────────────────────────────────────────────────
   カウンセラーの予約枠一覧（指定期間・Asia/Tokyo 表記）
   - UUID 以外（mock の数値 id）は null を返す → 呼び出し側で mock 生成にフォールバック
   - 戻り値の date/startTime/endTime は Asia/Tokyo 表記
──────────────────────────────────────────────────────────── */
export type SupabaseSlot = {
  id: string
  date: string         // 'YYYY-MM-DD' (Asia/Tokyo)
  startTime: string    // 'HH:mm' (Asia/Tokyo)
  endTime: string      // 'HH:mm' (Asia/Tokyo)
  status: 'open' | 'locked' | 'booked'
  /** 事前指定された面談形式。null = ユーザー側で選択可（両方OK） */
  meetingType: '対面' | 'オンライン' | null
}

/** UTC ISO timestamp を Asia/Tokyo の YYYY-MM-DD と HH:mm に分解する */
function isoToTokyo(iso: string): { date: string; time: string } {
  // Asia/Tokyo に変換（UTC+9 固定。サマータイム無し）
  const utc = new Date(iso)
  const tokyo = new Date(utc.getTime() + 9 * 60 * 60 * 1000)
  const yyyy = tokyo.getUTCFullYear()
  const mm = String(tokyo.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(tokyo.getUTCDate()).padStart(2, '0')
  const hh = String(tokyo.getUTCHours()).padStart(2, '0')
  const mi = String(tokyo.getUTCMinutes()).padStart(2, '0')
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` }
}

export async function getSlotsByCounselor(
  counselorId: string,
  fromIso: string,
  toIso: string,
): Promise<SupabaseSlot[] | null> {
  // mock の数値 id（"1" 〜 "105"）は slots テーブルに行が無いので null
  if (!counselorId || !/^[0-9a-f-]{36}$/i.test(counselorId)) return null
  const res = await supabase
    .from('slots')
    .select('id,start_at,end_at,status,locked_until,meeting_type')
    .eq('counselor_id', counselorId)
    .gte('start_at', fromIso)
    .lte('start_at', toIso)
    .order('start_at', { ascending: true })
  if (res.error) {
    console.error('[getSlotsByCounselor] error', res.error)
    return null
  }
  type Row = {
    id: string;
    start_at: string;
    end_at: string;
    status: string;
    locked_until: string | null;
    meeting_type: string | null;
  }
  const rows = (res.data as Row[]) ?? []
  // 「ロック切れ slot は実質 open」として user-side で扱う（pg_cron 不要の遅延クリーンアップ）。
  // locked_until が NULL の場合は相談所オーナーの手動ロックなので open に戻さない。
  const nowMs = Date.now()
  return rows
    .filter((r) => r.status === 'open' || r.status === 'locked' || r.status === 'booked')
    .map((r) => {
      const start = isoToTokyo(r.start_at)
      const end = isoToTokyo(r.end_at)
      let effective = r.status as 'open' | 'locked' | 'booked'
      if (r.status === 'locked' && r.locked_until) {
        const lockedUntilMs = new Date(r.locked_until).getTime()
        if (lockedUntilMs < nowMs) effective = 'open'
      }
      const meetingType: '対面' | 'オンライン' | null =
        r.meeting_type === '対面' || r.meeting_type === 'オンライン' ? r.meeting_type : null
      return {
        id: r.id,
        date: start.date,
        startTime: start.time,
        endTime: end.time,
        status: effective,
        meetingType,
      }
    })
}

/* ────────────────────────────────────────────────────────────
   相談所単体取得（normalize 済み AgencyPartial）
──────────────────────────────────────────────────────────── */
export async function getAgencyById(id: string | number): Promise<AgencyPartial | null> {
  if (!id) return null
  // agency + agency_media を並列取得（JOIN は型推論が壊れるため別クエリ）
  const [agencyRes, mediaRes] = await Promise.all([
    supabase.from('agencies').select('*').eq('id', String(id)).maybeSingle(),
    supabase.from('agency_media').select('*').eq('agency_id', String(id)).order('display_order', { ascending: true }),
  ])
  if (agencyRes.error || !agencyRes.data) return null
  const normalized = normalizeSupabaseAgency(agencyRes.data)
  const mediaRows = mediaRes.data as AgencyMediaRow[] | null
  if (mediaRows && mediaRows.length > 0) {
    normalized.reelImages = mapAgencyMediaToReelImage(mediaRows)
  }
  return normalized
}

// 相談所一覧取得（reelImages は付けない・一覧では使わないため軽量化）
export async function getAgencies(): Promise<AgencyPartial[]> {
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return AGENCIES;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map(normalizeSupabaseAgency);
}

/** 相談所のリール画像（agency_media）を別クエリで取得（JOIN は型推論が壊れるため避ける） */
export async function getAgencyMedia(agencyId: string | number): Promise<{ bg: string; caption?: string }[]> {
  if (!agencyId) return []
  const res = await supabase
    .from('agency_media')
    .select('*')
    .eq('agency_id', String(agencyId))
    .order('display_order', { ascending: true })
  const rows = res.data as AgencyMediaRow[] | null
  if (res.error || !rows) return []
  return mapAgencyMediaToReelImage(rows)
}

/* ────────────────────────────────────────────────────────────
   Shop Row → PlaceHome マッパー
   F-3（2026-05-21）: shops テーブルを PlaceHome 型と整合させる
   不足カラムは NULL fallback で安全に空文字を返す。
──────────────────────────────────────────────────────────── */

/** shops.category（自由テキスト）→ PlaceTabCategory のマッピング */
function inferTabCategory(category: string | null, thumbVariant: ThumbVariant | null): PlaceTabCategory {
  // 美容系
  if (thumbVariant === 'hair' || thumbVariant === 'nail' || thumbVariant === 'brow' || thumbVariant === 'esthetic') {
    return 'beauty'
  }
  if (thumbVariant === 'photo-studio') return 'photo'

  // 食事系: 自由テキストをキーワードで判別
  if (!category) return 'all'
  if (/カフェ|喫茶|甘味|和カフェ/.test(category)) return 'omiai'
  if (/レストラン|和食|鉄板|ホテルラウンジ|ラウンジ|フレンチ|イタリアン|焼肉|寿司/.test(category)) return 'date'

  // それ以外は all（フィルター全合致）
  return 'all'
}

function mapShopRowToPlaceHome(row: ShopRow): PlaceHome {
  const thumbVariant = (row.thumb_variant ?? 'cafe') as ThumbVariant
  return {
    id: String(row.id),
    name: row.name,
    category: inferTabCategory(row.category, row.thumb_variant as ThumbVariant | null),
    stage: row.stage ?? '',
    location: row.location ?? row.area ?? '',
    rating: Number(row.rating_avg ?? 0),
    reviewCount: row.review_count ?? 0,
    badgeType: row.badge_type,
    thumbVariant,
    description: row.description ?? '',
    features: row.features ?? [],
    categoryLabel: row.category_label ?? row.category ?? '',
    areaLabel: row.area_label ?? row.area ?? '',
    priceRange: row.price_range ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  }
}

/* ────────────────────────────────────────────────────────────
   お店一覧取得
   F-3 (2026-05-21): shops テーブルを PlaceHome 型と整合させて
   Supabase からのデータ取得を有効化。
   - 公開データ 0 件 or エラー時は mock fallback（既存パターン踏襲）
──────────────────────────────────────────────────────────── */
export async function getShops(): Promise<PlaceHome[]> {
  void places // /places/[id] 詳細用 mock（getShopById で fallback 参照）

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Supabase SDK v2 の型推論を avoid（CLAUDE.md 参照）
  const rows = data as ShopRow[] | null

  if (error || !rows || rows.length === 0) {
    if (error) console.error('getShops error (fallback to mock):', error.message)
    return placesHomeData
  }

  // shop_media を一括取得して shop ごとに集約
  // 一覧カードの自動スライド / リールモーダル / 詳細ページギャラリーで共通利用
  const shopIds = rows.map(r => r.id)
  const mediaRes = await supabase
    .from('shop_media')
    .select('shop_id, media_url, display_order')
    .in('shop_id', shopIds)
    .order('display_order', { ascending: true })
  type MediaLite = { shop_id: string; media_url: string; display_order: number }
  const mediaByShop = new Map<string, string[]>()
  for (const m of (mediaRes.data ?? []) as unknown as MediaLite[]) {
    const list = mediaByShop.get(m.shop_id) ?? []
    list.push(m.media_url)
    mediaByShop.set(m.shop_id, list)
  }

  return rows.map(row => {
    const base = mapShopRowToPlaceHome(row)
    const gallery = mediaByShop.get(row.id) ?? []
    const images = [
      ...(base.photoUrl ? [base.photoUrl] : []),
      ...gallery,
    ]
    return { ...base, images: images.length > 0 ? images : undefined }
  })
}

/* ────────────────────────────────────────────────────────────
   お店詳細取得（/places/[id] 用）
   F-3 (2026-05-21): /places/[id] が mock `places` の Number 型 ID で動いていた
   ため、Kinda act リールから遷移すると別店舗が表示される不整合を解消。
   Supabase shops (UUID) からの取得を有効化。

   返却 shape は PlaceHome + 詳細表示用フィールド（hours/holiday/access/scenes）
   を含む拡張型。reviews は別途 getReviewsByShop() で取得する想定（未実装）。
──────────────────────────────────────────────────────────── */
export type ShopGalleryItem = {
  id: string
  mediaUrl: string
  caption: string | null
  altText: string | null
}

export type ShopDetail = PlaceHome & {
  category: PlaceTabCategory
  hours: string | null
  holiday: string | null
  access: string | null
  scenes: string[] | null
  address: string | null
  /** L-2 (2026-05-22) で追加。予約・SNS 導線 */
  bookingUrl: string | null
  instagramUrl: string | null
  otherSocialUrl: string | null
  /** shop_media テーブルから取得した詳細ページ用ギャラリー（display_order 昇順） */
  gallery: ShopGalleryItem[]
}

export async function getShopById(id: string): Promise<ShopDetail | null> {
  const res = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()
  const row = res.data as ShopRow | null
  if (res.error || !row) return null

  // ギャラリーは別クエリ（JOIN は型推論を壊すため）
  const mediaRes = await supabase
    .from('shop_media')
    .select('id, media_url, caption, alt_text, display_order')
    .eq('shop_id', row.id)
    .order('display_order', { ascending: true })
  type MediaRow = {
    id: string
    media_url: string
    caption: string | null
    alt_text: string | null
    display_order: number
  }
  const gallery: ShopGalleryItem[] = ((mediaRes.data ?? []) as unknown as MediaRow[]).map((m) => ({
    id: m.id,
    mediaUrl: m.media_url,
    caption: m.caption,
    altText: m.alt_text,
  }))

  const base = mapShopRowToPlaceHome(row)
  return {
    ...base,
    hours: row.hours,
    holiday: row.holiday,
    access: row.access,
    scenes: row.scenes,
    address: row.address,
    bookingUrl: row.booking_url ?? null,
    instagramUrl: row.instagram_url ?? null,
    otherSocialUrl: row.other_social_url ?? null,
    gallery,
  }
}

// 口コミ取得（カウンセラー別）
// counselor 詳細ページの表示シェイプに整形して返す（id/rating/title/text/author/date/verified）。
// user_id が紐づく口コミは profiles.nickname を別クエリで取得して author に流す（JOIN は型推論を壊すため使わない）。
export async function getReviewsByCounselor(counselorId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, body, source_type, created_at, reviewer_age_range, user_id, counselor_id, agency_reply')
    .eq('counselor_id', counselorId)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error || !data) return []

  type ReviewRow = {
    id: string
    rating: number
    body: string
    source_type: string
    created_at: string
    reviewer_age_range: string | null
    user_id: string | null
    counselor_id: string
    agency_reply: string | null
  }
  const rows = data as unknown as ReviewRow[]

  // ニックネームをまとめて取得
  const userIds = Array.from(new Set(rows.map((r) => r.user_id).filter((x): x is string => !!x)))
  const nicknameById: Record<string, string> = {}
  if (userIds.length > 0) {
    const p = await supabase.from('profiles').select('id, nickname').in('id', userIds)
    const profiles = (p.data ?? []) as unknown as { id: string; nickname: string | null }[]
    for (const pr of profiles) {
      if (pr.nickname && pr.nickname.trim().length > 0) {
        nicknameById[pr.id] = pr.nickname.trim()
      }
    }
  }

  const ageLabel = (raw: string | null): string => {
    if (!raw) return ''
    const map: Record<string, string> = {
      '20s': '20代',
      '30s': '30代',
      '40s': '40代',
      '50s_plus': '50代以上',
      non_disclosed: '',
    }
    return map[raw] ?? raw
  }

  return rows.map((r) => {
    const nickname = r.user_id ? nicknameById[r.user_id] : undefined
    const age = ageLabel(r.reviewer_age_range)
    const author = [age, nickname || (r.user_id ? 'ゲスト' : 'ゲスト')]
      .filter((s) => s && s.length > 0)
      .join('・')
    const d = new Date(r.created_at)
    return {
      id: r.id,
      counselorId: r.counselor_id,
      rating: r.rating,
      title: '口コミ',
      text: r.body,
      author: author || 'ゲスト',
      date: isNaN(d.getTime()) ? '' : `${d.getFullYear()}年${d.getMonth() + 1}月`,
      verified: r.source_type === 'face_to_face',
      reply: r.agency_reply ?? null,
    }
  })
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
