import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import AgencyCardBlock from "@/components/ui/AgencyCardBlock";
import SaveButton from "@/components/ui/SaveButton";
import CounselorDetailViewTracker from "@/components/counselors/CounselorDetailViewTracker";
import {
  AGENCIES,
  COUNSELORS,
  getCounselorById,
  getCounselors,
  getReviewsByCounselor,
  getNextSlotByCounselor,
  getAgencyById,
  formatFeeItem,
  type FeePlan,
} from "@/lib/data";
import { DIAGNOSIS_TYPES, DiagnosisTypeId } from "@/lib/diagnosis";
import { getStoryById } from "@/lib/mock/stories";

// ISR：60秒キャッシュで2回目以降の遷移を高速化
export const revalidate = 60;

/**
 * mock の 1-6 + 101-105 と、Supabase の公開済みカウンセラーを
 * ビルド時に事前レンダリングして HTML を Edge にキャッシュする。
 * これで初回アクセス時の SSR コスト（数百ms）をスキップできる。
 * 未知の ID（運営後追加されたカウンセラー）は ISR で動的フォールバック。
 */
export async function generateStaticParams() {
  const mockIds = ["1", "2", "3", "4", "5", "6", "101", "102", "103", "104", "105"];
  try {
    const list = await getCounselors();
    const supabaseIds = list.map((c) => String(c.id)).filter((id) => !!id);
    const all = Array.from(new Set([...mockIds, ...supabaseIds]));
    return all.map((id) => ({ id }));
  } catch {
    return mockIds.map((id) => ({ id }));
  }
}

/* ────────────────────────────────────────────────────────────
   モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */
const counselors = {
  "1": {
    id: "1",
    name: "田中 美咲",
    nameKana: "たなか みさき",
    agency: "ブライダルサロン エクラン",
    agencyId: "1",
    area: "東京・渋谷",
    address: "東京都渋谷区神宮前1-2-3 エクランビル4F",
    specialties: ["初婚", "30代", "キャリア女性", "婚活初心者"],
    rating: 4.9,
    reviewCount: 47,
    yearsExp: 8,
    successCount: 124,
    nextAvailable: "2026年4月8日（水）14:00〜",
    bio: "大学卒業後、IT企業で5年間働いた後、結婚相談所のカウンセラーに転身。自身の婚活経験を活かし、特にキャリア女性の婚活をサポートしています。\n\n「婚活は自分を知ること」をモットーに、価値観の整理から始めて、本当にご縁のある方との出会いをお手伝いします。焦らず、でも着実に。一人ひとりに向き合った丁寧なサポートが強みです。",
    message: "初めての婚活で不安な方も、何度かチャレンジしてうまくいかない方も、まずは気軽にお話しに来てください。あなたのペースに合わせて、一緒に考えていきましょう。",
    qualifications: ["婚活カウンセラー資格", "メンタルヘルス・マネジメント検定"],
    photoUrl: undefined,
    monthlyFee: "29,800",
    campaign: { label: "春の婚活キャンペーン", detail: "4/30までのご入会で入会金10%オフ", expiry: "〜2026-04-30" },
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 100000, monthly: 19800, matchmaking: 5000, success: 200000 },
        { name: "プレミアム", featured: true, enrollment: 150000, monthly: 29800, matchmaking: null, success: 200000, notes: "お見合い料込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談・見学は無料。詳細はカウンセラーにご確認ください。",
    },
  },
  "2": {
    id: "2",
    name: "佐藤 あかり",
    nameKana: "さとう あかり",
    agency: "マリーナ結婚相談所",
    agencyId: "2",
    area: "東京・銀座",
    address: "東京都中央区銀座5-6-7 マリーナビル3F",
    specialties: ["再婚", "バツあり", "子持ち"],
    rating: 4.8,
    reviewCount: 32,
    yearsExp: 12,
    successCount: 98,
    nextAvailable: "2026年4月6日（月）13:00〜",
    bio: "離婚経験のある方やシングルペアレントの婚活を12年間専門にサポート。再婚に対する不安や葛藤を誰よりも深く理解できるカウンセラーを目指しています。\n\n「過去は変えられないけれど、未来は一緒に作れる」という信念のもと、一人ひとりの事情に寄り添いながら、新しいご縁づくりをお手伝いします。",
    message: "バツイチ・シングルだからこそ見えてくる、本当に大切なものがあります。遠慮なく、まず話しに来てください。",
    qualifications: ["婚活カウンセラー資格", "家族相談士", "心理カウンセラー"],
    photoUrl: undefined,
    monthlyFee: "24,800",
    campaign: null,
    pricing: {
      plans: [
        { name: "ベーシック", enrollment: 80000, monthly: 16800, matchmaking: 3000, success: 150000 },
        { name: "フルサポート", featured: true, enrollment: 120000, monthly: 24800, matchmaking: null, success: 180000, notes: "お見合い料・活動サポート費込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料。再婚専門プランについてはご相談ください。",
    },
  },
  "3": {
    id: "3",
    name: "山本 花子",
    nameKana: "やまもと はなこ",
    agency: "ローズブライダル",
    agencyId: "3",
    area: "神奈川・横浜",
    address: "神奈川県横浜市西区みなとみらい2-3-4 ローズタワー5F",
    specialties: ["20代", "初婚", "地方在住"],
    rating: 4.7,
    reviewCount: 58,
    yearsExp: 5,
    successCount: 67,
    nextAvailable: "2026年4月10日（金）11:00〜",
    bio: "横浜生まれ・横浜育ちのカウンセラー。神奈川・東京エリアの婚活事情を知り尽くしており、特に20代の婚活初心者のサポートを得意としています。\n\n「焦る必要はない、でも後悔はしてほしくない」という思いから、タイミングと縁を大切にした婚活スタイルを提案。笑顔が多い面談を心がけています。",
    message: "婚活って難しそう…と思っている方ほど、ぜひ一度来てみてください。一緒に楽しく進めましょう！",
    qualifications: ["婚活カウンセラー資格", "ブライダルコーディネーター"],
    photoUrl: undefined,
    monthlyFee: "19,800",
    campaign: { label: "20代限定キャンペーン", detail: "初回面談後ご入会で入会金半額", expiry: "〜2026-05-31" },
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 80000, monthly: 19800, matchmaking: 3000, success: 150000 },
        { name: "プレミアム", featured: true, enrollment: 100000, monthly: 29800, matchmaking: null, success: 150000, notes: "お見合い料込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料。20代の方は入会金優遇あり。",
    },
  },
  "4": {
    id: "4",
    name: "鈴木 恵",
    nameKana: "すずき めぐみ",
    agency: "プレシャスマリッジ",
    agencyId: "4",
    area: "大阪・梅田",
    address: "大阪府大阪市北区梅田1-8-9 プレシャスビル6F",
    specialties: ["30代", "40代", "晩婚"],
    rating: 4.8,
    reviewCount: 41,
    yearsExp: 10,
    successCount: 89,
    nextAvailable: "2026年4月7日（火）15:00〜",
    bio: "大阪を拠点に10年間、30〜40代の婚活を専門にサポート。年齢へのコンプレックスを抱えて来られる方が多いですが、「年齢は武器になる」という考え方でポジティブな婚活スタイルを提案しています。\n\n豊富な人生経験を持つ大人の婚活だからこそ、深い価値観のすり合わせから始めることを大切にしています。",
    message: "30代・40代からの婚活を何百人もサポートしてきました。年齢を言い訳にしない婚活、一緒に始めましょう。",
    qualifications: ["婚活カウンセラー資格", "キャリアコンサルタント"],
    photoUrl: undefined,
    monthlyFee: "26,800",
    campaign: { label: "大人の婚活応援キャンペーン", detail: "35歳以上の方は入会金20%オフ", expiry: "〜2026-06-30" },
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 120000, monthly: 19800, matchmaking: 5000, success: 200000 },
        { name: "プレミアム", featured: true, enrollment: 180000, monthly: 26800, matchmaking: null, success: 200000, notes: "お見合い料・プロフィール作成込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料。年齢に応じた優遇プランあり。",
    },
  },
  "5": {
    id: "5",
    name: "伊藤 由美",
    nameKana: "いとう ゆみ",
    agency: "ハーモニーブライダル",
    agencyId: "5",
    area: "愛知・名古屋",
    address: "愛知県名古屋市中区栄3-4-5 ハーモニービル2F",
    specialties: ["公務員・教員", "転勤族", "地元重視"],
    rating: 4.6,
    reviewCount: 29,
    yearsExp: 7,
    successCount: 53,
    nextAvailable: "2026年4月9日（木）10:00〜",
    bio: "名古屋・東海エリアの婚活市場を熟知したカウンセラー。地元での安定した生活を重視する方や、転勤族の悩みを抱える方のサポートを得意としています。\n\n公務員・教員・看護師など安定職の方との成婚実績が豊富で、職種特有の働き方や価値観を理解した上でマッチングの提案ができます。",
    message: "地元・名古屋での幸せな結婚を本気で目指す方、一緒に頑張りましょう。実績と経験で全力サポートします。",
    qualifications: ["婚活カウンセラー資格", "ファイナンシャルプランナー3級"],
    photoUrl: undefined,
    monthlyFee: "22,800",
    campaign: null,
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 100000, monthly: 22800, matchmaking: 3000, success: 180000 },
        { name: "安定職応援プラン", featured: true, enrollment: 80000, monthly: 22800, matchmaking: null, success: 180000, notes: "公務員・教員・看護師限定" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料。安定職の方への優遇プランあり。",
    },
  },
  "6": {
    id: "6",
    name: "中村 涼子",
    nameKana: "なかむら りょうこ",
    agency: "ルシェルブライダル",
    agencyId: "6",
    area: "東京・新宿",
    address: "東京都新宿区西新宿1-2-3 ルシェルビル8F",
    specialties: ["海外在住経験", "バイリンガル", "外国籍歓迎"],
    rating: 4.9,
    reviewCount: 22,
    yearsExp: 6,
    successCount: 41,
    nextAvailable: "2026年4月11日（土）13:00〜",
    bio: "ニューヨーク在住5年の経験を持つバイリンガルカウンセラー。帰国子女・海外在住経験者・外国籍の方など、グローバルなバックグラウンドを持つ方の婚活を専門にサポートしています。\n\n日英両語対応可能で、文化的背景の異なるカップルのマッチングにも定評があります。「ボーダーレスな愛の形」を信じて活動中。",
    message: "海外経験があることでかえって婚活に悩んでいる方、その経験は必ず強みになります。一緒に証明しましょう。",
    qualifications: ["婚活カウンセラー資格", "TOEIC 990点", "米国ブライダルコンサルタント認定"],
    photoUrl: undefined,
    monthlyFee: "34,800",
    campaign: { label: "グローバル婚活スタートキャンペーン", detail: "英語カウンセリング初回無料", expiry: "〜2026-05-31" },
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 150000, monthly: 24800, matchmaking: 5000, success: 250000 },
        { name: "グローバルプラン", featured: true, enrollment: 200000, monthly: 34800, matchmaking: null, success: 250000, notes: "英語対応・海外マッチング込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料（日英対応可）。",
    },
  },

  /* ──────────────────────────────────────────
     営業デモ用ダミー（src/lib/data.ts の COUNSELORS と
     同じ ID 101〜105 でプロフィール詳細を持たせる）。
     カードのリールモーダルから「プロフィールを見る」で
     直接ここへ遷移してくる。
  ────────────────────────────────────────── */
  "101": {
    id: "101",
    name: "藤村 詩織（サンプル）",
    nameKana: "ふじむら しおり",
    agency: "ブライダルハウス銀座（サンプル）",
    agencyId: "1",
    area: "東京・銀座",
    address: "東京都中央区銀座（サンプル表示）",
    specialties: ["再婚OK", "30〜40代女性", "実績重視"],
    rating: 4.9,
    reviewCount: 28,
    yearsExp: 15,
    successCount: 96,
    nextAvailable: "（サンプル）— 営業用デモ表示のため、実際の予約はできません",
    bio: "（サンプル表示）ブライダルハウス銀座で15年カウンセラーを務めています。30〜40代女性を中心に、再婚や仕事との両立など、人生のステージに合わせたサポートを大切にしています。\n\n焦らず、流されず、選ぶ。一人ひとりの「らしさ」を尊重しながら、納得のいく出会いまで丁寧に伴走します。これは Kinda の掲載サンプルとしてのプロフィールです。",
    message: "（サンプル）あなたのペースで、丁寧に。",
    qualifications: ["IBJ認定カウンセラー"],
    photoUrl: undefined,
    monthlyFee: "18,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "スタンダード", featured: false, enrollment: 110000, monthly: 18000, matchmaking: 5000, success: 200000, notes: "" },
      ],
      note: "※ サンプル表示の料金です。実際の掲載相談所では金額が変わります。",
    },
  },
  "102": {
    id: "102",
    name: "吉岡 結衣（サンプル）",
    nameKana: "よしおか ゆい",
    agency: "マリッジサポート梅田（サンプル）",
    agencyId: "3",
    area: "大阪・梅田",
    address: "大阪府大阪市北区梅田（サンプル表示）",
    specialties: ["自分軸", "20〜30代", "関西エリア"],
    rating: 4.8,
    reviewCount: 19,
    yearsExp: 8,
    successCount: 54,
    nextAvailable: "（サンプル）— 営業用デモ表示のため、実際の予約はできません",
    bio: "（サンプル表示）マリッジサポート梅田所属。8年間で「自分が本当は何を求めているのか」を一緒に見つけることを大切にしてきました。\n\n好きの輪郭が、相手を引き寄せる。条件先行ではなく、まずは自分の感覚を整えるところから始めます。これは Kinda の掲載サンプルとしてのプロフィールです。",
    message: "（サンプル）自分の軸を、一緒に見つけましょう。",
    qualifications: ["IBJ認定カウンセラー", "心理カウンセラー資格"],
    photoUrl: undefined,
    monthlyFee: "13,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "スタンダード", featured: false, enrollment: 80000, monthly: 13000, matchmaking: 3000, success: 150000, notes: "" },
      ],
      note: "※ サンプル表示の料金です。実際の掲載相談所では金額が変わります。",
    },
  },
  "103": {
    id: "103",
    name: "山本 健太（サンプル）",
    nameKana: "やまもと けんた",
    agency: "天神マリッジセンター（サンプル）",
    agencyId: "5",
    area: "福岡・天神",
    address: "福岡県福岡市中央区天神（サンプル表示）",
    specialties: ["戦略派", "データ志向", "男性カウンセラー"],
    rating: 4.7,
    reviewCount: 31,
    yearsExp: 12,
    successCount: 78,
    nextAvailable: "（サンプル）— 営業用デモ表示のため、実際の予約はできません",
    bio: "（サンプル表示）天神マリッジセンター所属。12年間蓄積したデータをもとに、確率を上げる行動を一緒に設計します。\n\n感情と数字、両方で結婚する。感覚だけに頼らず、お見合い数・申込率・返事率まで見ながら戦略を立てるスタイルです。これは Kinda の掲載サンプルとしてのプロフィールです。",
    message: "（サンプル）データに基づく戦略で、確実に。",
    qualifications: ["IBJ認定カウンセラー", "MBA"],
    photoUrl: undefined,
    monthlyFee: "14,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "スタンダード", featured: false, enrollment: 90000, monthly: 14000, matchmaking: 3000, success: 180000, notes: "" },
      ],
      note: "※ サンプル表示の料金です。実際の掲載相談所では金額が変わります。",
    },
  },
  "104": {
    id: "104",
    name: "中村 さくら（サンプル）",
    nameKana: "なかむら さくら",
    agency: "栄ブライダルカフェ（サンプル）",
    agencyId: "4",
    area: "名古屋・栄",
    address: "愛知県名古屋市中区栄（サンプル表示）",
    specialties: ["20〜30代", "全力サポート", "明るい"],
    rating: 4.9,
    reviewCount: 14,
    yearsExp: 5,
    successCount: 32,
    nextAvailable: "（サンプル）— 営業用デモ表示のため、実際の予約はできません",
    bio: "（サンプル表示）栄ブライダルカフェ所属。5年間、全力で寄り添うことを大切にしてきました。\n\n本気は、最強の武器。本気で結婚したい人と本気で向き合う、シンプルだけど強いスタンスです。これは Kinda の掲載サンプルとしてのプロフィールです。",
    message: "（サンプル）二人三脚で、本気で婚活します。",
    qualifications: ["IBJ認定カウンセラー"],
    photoUrl: undefined,
    monthlyFee: "11,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "スタンダード", featured: false, enrollment: 70000, monthly: 11000, matchmaking: 3000, success: 150000, notes: "" },
      ],
      note: "※ サンプル表示の料金です。実際の掲載相談所では金額が変わります。",
    },
  },
  "105": {
    id: "105",
    name: "高橋 玲奈（サンプル）",
    nameKana: "たかはし れいな",
    agency: "オンライン専門 RING（サンプル）",
    agencyId: "5",
    area: "オンライン",
    address: "オンライン対応のため店舗無し（サンプル表示）",
    specialties: ["オンライン専門", "仕事忙しい人向け", "全国対応"],
    rating: 4.8,
    reviewCount: 22,
    yearsExp: 10,
    successCount: 67,
    nextAvailable: "（サンプル）— 営業用デモ表示のため、実際の予約はできません",
    bio: "（サンプル表示）オンライン専門 RING 所属。10年間、忙しい方の婚活をサポート。「仕事を犠牲にしない婚活」を一緒に設計します。\n\n無理なく続くことが、いちばんの近道。スキマ時間で進められる工夫と、続けやすいペース配分が強みです。これは Kinda の掲載サンプルとしてのプロフィールです。",
    message: "（サンプル）忙しい毎日でも、無理なく続けられる婚活を。",
    qualifications: ["IBJ認定カウンセラー"],
    photoUrl: undefined,
    monthlyFee: "11,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "スタンダード", featured: false, enrollment: 60000, monthly: 11000, matchmaking: 3000, success: 150000, notes: "" },
      ],
      note: "※ サンプル表示の料金です。実際の掲載相談所では金額が変わります。",
    },
  },
};

const reviews = [
  // 田中 美咲（ID:1）
  {
    id: "1",
    counselorId: "1",
    rating: 5,
    title: "初めての婚活で不安でしたが、安心して相談できました",
    text: "婚活が初めてで何から始めていいか全くわからない状態で面談に伺いました。田中さんは私の話をじっくり聞いてくださり、婚活の流れや注意点を丁寧に説明してくださいました。押しつけがましさが全くなく、「まずは自分の軸を作りましょう」という姿勢がとても好印象でした。",
    author: "30代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "2",
    counselorId: "1",
    rating: 5,
    title: "価値観の整理から丁寧にサポートしてもらえた",
    text: "転職活動と並行しての婚活で、なかなか優先順位がつけられずにいました。田中さんは私のライフプラン全体を一緒に考えてくださり、婚活と仕事の両立についても具体的なアドバイスをいただけました。",
    author: "30代・女性",
    date: "2025年12月",
    verified: true,
  },
  {
    id: "3",
    counselorId: "1",
    rating: 4,
    title: "話しやすい雰囲気で本音が言えた",
    text: "他の相談所でうまくいかなかった経験があり、少し警戒しながら伺いましたが、田中さんはとても話しやすい方で、気づけば本音で話していました。前の相談所でうまくいかなかった理由も一緒に考えてくださり、次に進む勇気をもらえました。",
    author: "30代・女性",
    date: "2025年11月",
    verified: true,
  },
  {
    id: "4",
    counselorId: "1",
    rating: 5,
    title: "具体的なアドバイスが役に立った",
    text: "プロフィール写真の選び方から、お見合いでの会話のコツまで、具体的なアドバイスをたくさんいただきました。「こういう場合はこうする」という実践的な内容だったので、すぐに使えそうでした。",
    author: "20代・女性",
    date: "2025年10月",
    verified: true,
  },
  // 佐藤 あかり（ID:2）
  {
    id: "5",
    counselorId: "2",
    rating: 5,
    title: "バツイチでも前向きになれました",
    text: "離婚後しばらく婚活を諦めていましたが、佐藤さんに相談して前向きな気持ちになれました。同じ境遇の方を多く支援されているので、的外れなアドバイスが全くなく、「あるある」と共感しながら話せました。",
    author: "30代・女性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "6",
    counselorId: "2",
    rating: 5,
    title: "子持ちの婚活に対して偏見なく接してくれた",
    text: "子供がいるため婚活に消極的でしたが、佐藤さんはそれを強みに変える視点を教えてくれました。子供のことを正直に話した上でのマッチング戦略を一緒に考えてもらえて、希望が持てるようになりました。",
    author: "30代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "7",
    counselorId: "2",
    rating: 4,
    title: "再婚特有の悩みをしっかり理解してくれた",
    text: "前の結婚のトラウマがあり、なかなか踏み出せずにいましたが、佐藤さんは焦らせることなく私のペースに合わせてくれました。経験豊富な方ならではの言葉が刺さりました。",
    author: "40代・女性",
    date: "2025年12月",
    verified: true,
  },
  // 山本 花子（ID:3）
  {
    id: "8",
    counselorId: "3",
    rating: 5,
    title: "婚活の全体像がわかって安心しました",
    text: "20代で婚活自体が初めてで不安でしたが、山本さんが婚活の流れをイチから丁寧に教えてくれました。難しい業界用語も噛み砕いて説明してくれて、「これなら自分にもできそう」という気持ちになれました。",
    author: "20代・女性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "9",
    counselorId: "3",
    rating: 4,
    title: "明るい雰囲気で楽しく相談できた",
    text: "面談前は緊張していましたが、山本さんがとても明るく笑顔で迎えてくれたので、すぐにリラックスできました。婚活の悩みだけでなく、将来の理想の生活像まで一緒に考えてもらえました。",
    author: "20代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "10",
    counselorId: "3",
    rating: 5,
    title: "地方在住でも丁寧にサポートしてもらえた",
    text: "地方在住のため婚活の選択肢が少ないと思っていましたが、山本さんはエリアを超えたマッチングも視野に入れた提案をしてくれました。遠距離からのスタートも前向きに考えられるようになりました。",
    author: "20代・女性",
    date: "2025年11月",
    verified: true,
  },
  // 鈴木 恵（ID:4）
  {
    id: "11",
    counselorId: "4",
    rating: 5,
    title: "年齢のコンプレックスが和らぎました",
    text: "38歳での婚活スタートで正直かなり不安でしたが、鈴木さんは「この年齢だからこそ魅力がある」と具体的なエピソードを交えながら話してくれました。面談後は年齢への不安がかなり和らぎました。",
    author: "30代・女性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "12",
    counselorId: "4",
    rating: 5,
    title: "40代での婚活に希望が持てた",
    text: "40代での婚活は厳しいと思っていましたが、鈴木さんは成婚実績を交えながら可能性を示してくれました。現実的でありながらも希望を持たせてくれるバランスが絶妙でした。",
    author: "40代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "13",
    counselorId: "4",
    rating: 4,
    title: "大阪での婚活事情に詳しくて心強かった",
    text: "大阪の婚活市場について詳しく教えてもらえました。地元ならではの情報量が多く、他の相談所では聞けなかったリアルな話が聞けてよかったです。",
    author: "30代・女性",
    date: "2025年12月",
    verified: true,
  },
  // 伊藤 由美（ID:5）
  {
    id: "14",
    counselorId: "5",
    rating: 5,
    title: "公務員同士のマッチングに強いと実感",
    text: "公務員という職業柄、価値観が合う方を探すのが難しいと思っていましたが、伊藤さんは公務員・教員・看護師などの安定職の方々の特性をよく理解されていました。的確な提案に驚きました。",
    author: "30代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "15",
    counselorId: "5",
    rating: 4,
    title: "転勤族の悩みを理解してもらえた",
    text: "転勤族のため地元志向の方とのマッチングに不安がありましたが、伊藤さんは転勤族特有の悩みをよく理解した上でアドバイスをくれました。名古屋エリアに詳しく、地元情報も豊富でした。",
    author: "30代・男性",
    date: "2025年12月",
    verified: true,
  },
  // 中村 涼子（ID:6）
  {
    id: "16",
    counselorId: "6",
    rating: 5,
    title: "海外経験を強みに変えてくれた",
    text: "ニューヨーク帰りで日本の婚活市場に戸惑っていましたが、中村さんは私のバックグラウンドを強みとして捉え直してくれました。英語でも日本語でも話せる安心感がありました。",
    author: "30代・女性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "17",
    counselorId: "6",
    rating: 5,
    title: "グローバルな価値観を理解してくれる唯一のカウンセラー",
    text: "外国籍パートナーとの結婚を考えていて、そういった案件に対応できるカウンセラーを探していました。中村さんは文化的背景の違いも含めて理解した上でサポートしてくれます。",
    author: "30代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "18",
    counselorId: "6",
    rating: 4,
    title: "バイリンガル対応が助かった",
    text: "日本語が得意でない外国籍の友人の通訳を頼まれて同席しましたが、中村さんは英語も堪能でスムーズに面談が進みました。こういうカウンセラーは本当に貴重です。",
    author: "30代・女性",
    date: "2025年11月",
    verified: true,
  },
];

/* ────────────────────────────────────────────────────────────
   コンポーネント
──────────────────────────────────────────────────────────── */
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill={star <= rating ? "var(--accent)" : "var(--light)"}
        >
          <path d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-mid w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-light rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs text-ink w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   メタデータ生成（SEO）
──────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mock = counselors[id as keyof typeof counselors];
  const fromCounselors = COUNSELORS.find((c) => String(c.id) === id);

  if (!mock && !fromCounselors) {
    return { title: "カウンセラーが見つかりません | Kinda ふたりへ" };
  }

  const name = mock?.name ?? fromCounselors?.name ?? "カウンセラー";
  const agency = mock?.agency ?? fromCounselors?.agencyName ?? "";
  const area = mock?.area ?? fromCounselors?.area ?? "";
  const catchphrase = fromCounselors?.catchphrase ?? mock?.message ?? "";
  const intro =
    fromCounselors?.intro ??
    mock?.bio ??
    "結婚相談所のカウンセラーを、人で選ぶ。Kinda ふたりへ。";

  const title = `${name} | ${agency}${area ? " " + area : ""} | Kinda ふたりへ`;
  const description = (catchphrase + " " + intro).trim().slice(0, 140);

  return {
    title,
    description,
    openGraph: {
      title: `${name} - Kinda ふたりへ`,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `/counselors/${id}`,
    },
  };
}

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
export default async function CounselorDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; fromId?: string }>;
}) {
  const { id } = await params;
  const { from, fromId } = await searchParams;

  // Supabase から取得を試みる（フォールバック: モックデータ）
  // 並列化で初回 SSR を短縮（counselor / reviews / 次の空き枠 を 1 ラウンドトリップで）
  const [supabaseCounselor, supabaseReviews, nextSlot] = await Promise.all([
    getCounselorById(id),
    getReviewsByCounselor(id),
    getNextSlotByCounselor(id),
  ]);

  // Supabase にレコードがある（UUID）が、ローカル counselors{} にエントリが
  // ない場合は、名前で sample プロフィールにマッチさせて使う。
  // 営業デモ用カウンセラーは Supabase 側で自動生成 UUID を持つが、
  // 当ページは hardcoded mock を中核に組まれているため、UUID URL から
  // ID 101〜105 の sample プロフィールへ橋渡しする必要がある。
  let mockCounselor = counselors[id as keyof typeof counselors];
  if (!mockCounselor && supabaseCounselor) {
    const found = Object.values(counselors).find(
      (c) => c.name === supabaseCounselor.name,
    );
    if (found) mockCounselor = found as typeof mockCounselor;
  }
  if (!mockCounselor && !supabaseCounselor) notFound();

  // mock がない & Supabase オンリーの場合のフォールバックビルダー。
  // 相談所が管理画面から登録したカウンセラー（UUID）でも 404 を出さないために、
  // Supabase のフィールドを mock と同じ shape にマッピングする。
  // 料金は「料金は各相談所詳細をご覧ください」と案内し、所属相談所 ID を表示。
  type PlanShape = {
    name: string;
    enrollment: number;
    monthly: number;
    matchmaking: number | null;
    success: number;
    featured?: boolean;
    notes?: string;
  };
  type CounselorShape = {
    id: string;
    name: string;
    nameKana: string;
    agency: string;
    agencyId: string;
    area: string;
    address: string;
    specialties: string[];
    rating: number;
    reviewCount: number;
    yearsExp: number;
    successCount: number;
    /** "10年以上" 等のラベル表示。あれば yearsExp の代わりに優先表示 */
    experienceLabel?: string | null;
    nextAvailable: string;
    bio: string;
    message: string;
    qualifications: string[];
    photoUrl: string | undefined;
    monthlyFee: string;
    campaign: null | { label: string; detail?: string; expiry?: string };
    pricing: { plans: PlanShape[]; note: string };
    /** Supabase 由来の相談所料金プラン（あれば mock pricing.plans より優先表示） */
    agencyFees?: FeePlan[];
    /** Supabase オンリーで mock ベースが無いカウンセラーか */
    isSupabaseOnly?: boolean;
  };
  const buildFromSupabase = (sc: NonNullable<typeof supabaseCounselor>): CounselorShape => {
    const tags = sc.specialties ?? sc.tags ?? [];
    return {
      id: String(sc.id),
      name: sc.name,
      nameKana: sc.kana ?? "",
      agency: sc.agencyName ?? "",
      agencyId: String(sc.agencyId ?? ""),
      area: sc.area ?? "",
      address: "",
      specialties: Array.isArray(tags) ? tags : [],
      rating: sc.rating ?? 0,
      reviewCount: sc.reviewCount ?? 0,
      yearsExp: sc.experience ?? 0,
      successCount: sc.successCount ?? 0,
      experienceLabel: sc.experienceLabel ?? null,
      nextAvailable: "",
      bio: sc.bio ?? sc.intro ?? "",
      message: sc.message ?? sc.catchphrase ?? "",
      qualifications: sc.qualifications ?? [],
      photoUrl: sc.photoUrl ?? undefined,
      monthlyFee: "",
      campaign: null,
      pricing: { plans: [], note: "※ 料金詳細は所属相談所ページをご確認ください。" },
      isSupabaseOnly: true,
    };
  };

  // Supabase にデータがある場合はフィールドを上書き（フォールバック: モック）
  // mock が無い & Supabase だけある時は Supabase から組み立てる
  const counselor: CounselorShape | undefined = mockCounselor
    ? ({
        ...mockCounselor,
        bio: supabaseCounselor?.bio ?? mockCounselor.bio,
        name: supabaseCounselor?.name ?? mockCounselor.name,
        photoUrl: supabaseCounselor?.photoUrl ?? mockCounselor.photoUrl,
      } as CounselorShape)
    : supabaseCounselor
      ? buildFromSupabase(supabaseCounselor)
      : undefined;
  if (!counselor) notFound();

  // Supabase オンリーの場合、所属相談所の fees / 創業日を取得して料金プラン表示に使う
  const supabaseAgency =
    counselor.isSupabaseOnly && counselor.agencyId
      ? await getAgencyById(counselor.agencyId)
      : null;
  if (supabaseAgency?.fees && supabaseAgency.fees.length > 0) {
    counselor.agencyFees = supabaseAgency.fees;
  }
  if (supabaseAgency?.name && !counselor.agency) {
    counselor.agency = supabaseAgency.name;
  }

  // 次の空き枠：Supabase の slots テーブルから取れたらそちらを優先（mock 文字列を上書き）
  // サーバー（Vercel）は UTC で動くため、明示的に Asia/Tokyo で日時整形する。
  if (nextSlot) {
    const d = new Date(nextSlot.startAt);
    const parts = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(d);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    counselor.nextAvailable = `${get("year")}年${get("month")}月${get("day")}日（${get("weekday")}）${get("hour")}:${get("minute")}〜`;
  } else if (counselor.isSupabaseOnly && !counselor.nextAvailable) {
    counselor.nextAvailable = "面談枠の準備中です";
  }

  const mockReviews = reviews.filter((r) => r.counselorId === id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const counselorReviews = supabaseReviews.length > 0 ? supabaseReviews as any[] : mockReviews;
  // 口コミがゼロの場合は counselor.rating（カードに出している値）をフォールバックに使う。
  // 0/0 = NaN を表示しないための安全弁。デモカウンセラーで顕在化するケース。
  const avgRating =
    counselorReviews.length > 0
      ? counselorReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
        counselorReviews.length
      : counselor.rating;

  const matchedAgency = AGENCIES.find((a) => String(a.id) === String(counselor.agencyId));
  // mock agency が無くて Supabase agency があれば、そちらを AgencyCardBlock に渡して
  // 「タップ可能な相談所カード」を出す（小山楓華のような Supabase オンリーカウンセラー対応）。
  // AgencyCardBlock は Partial<Agency> + { id, name } を受け取れるよう拡張済み。
  const agencyForCard = matchedAgency ?? (
    supabaseAgency && supabaseAgency.id
      ? { ...supabaseAgency, id: supabaseAgency.id, name: supabaseAgency.name ?? counselor.agency }
      : undefined
  );
  const agencyCounselorCount = COUNSELORS.filter((c) => String(c.agencyId) === String(counselor.agencyId)).length;
  const matchedCounselorData = COUNSELORS.find((c) => String(c.id) === String(id));
  const diagnosisTypeId = matchedCounselorData?.diagnosisType ?? supabaseCounselor?.diagnosisType ?? null;

  return (
    <>
      <Header />
      <CounselorDetailViewTracker counselorId={String(id)} />

      <main className="pt-16">
        {(() => {
          // 遷移元（from）に応じてパンくず & 戻り先を切り替える。
          // 例: Kinda story の物語詳細から来た場合はそこへ戻れるように。
          const fromStory = from === "story" && fromId ? getStoryById(fromId) : null;
          if (fromStory) {
            return (
              <>
                <SectionSubHeader
                  sectionName="Kinda story"
                  sectionRoot={`/kinda-story/${fromStory.id}`}
                />
                <Breadcrumb
                  items={[
                    { label: "ホーム", href: "/" },
                    { label: "Kinda story", href: "/kinda-story" },
                    {
                      label: fromStory.author,
                      href: `/kinda-story/${fromStory.id}`,
                    },
                    { label: counselor.name },
                  ]}
                />
              </>
            );
          }
          return (
            <>
              <SectionSubHeader sectionName="Kinda talk" sectionRoot="/kinda-talk" />
              <Breadcrumb
                items={[
                  { label: "ホーム", href: "/" },
                  { label: "Kinda talk", href: "/kinda-talk" },
                  { label: counselor.name },
                ]}
              />
            </>
          );
        })()}
        {/* ═══════════════════════════════════════════════════
            ヒーローストリップ（黒背景）
        ═══════════════════════════════════════════════════ */}
        <div className="hero-strip">
          <div className="detail-hero">

            {/* 左: パンくず・バッジ・名前・タグ・統計 */}
            <div>
              <div className="d-breadcrumb">
                <Link href="/">トップ</Link>
                <span>/</span>
                <Link href="/counselors">カウンセラー一覧</Link>
                <span>/</span>
                <span>{counselor.name}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="d-agency-badge">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L1 2.5v3c0 2.5 1.71 4.84 4 5.5 2.29-.66 4-3 4-5.5v-3L5 1z"
                      stroke="var(--accent)" strokeWidth=".9" fill="rgba(200,169,122,.15)" />
                  </svg>
                  {counselor.agency}
                </div>
                <SaveButton type="counselor" id={counselor.id} variant="dark" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                <div className="d-avatar">
                  {counselor.photoUrl ? (
                    <Image
                      src={counselor.photoUrl}
                      alt={counselor.name}
                      width={80}
                      height={80}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      priority
                    />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="15" r="8" fill="#C8A97A" opacity=".6" />
                      <path d="M4 38c0-8.837 7.163-16 16-16s16 7.163 16 16"
                        stroke="#C8A97A" strokeWidth="1.5" fill="none" opacity=".4" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="d-name" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {counselor.name}
                    {/* 経験年数 1 年未満は「新人」バッジを自動付与 */}
                    {counselor.yearsExp < 1 && (
                      <span className="kt-new-badge" style={{ fontSize: 10 }}>新人</span>
                    )}
                  </div>
                  <div className="d-role">婚活カウンセラー · {counselor.area}</div>
                </div>
              </div>

              {/* 星評価 + 口コミ件数 */}
              <div className="d-rating-row">
                <div className="d-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1.5l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.4l-3.6 2.1.7-4L2.2 5.7l4-.6z"
                        fill={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(46,38,32,.15)"}
                        stroke={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(46,38,32,.2)"}
                        strokeWidth=".5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </div>
                <span className="d-rating-num">{avgRating.toFixed(1)}</span>
                <span className="d-rating-sep" />
                {/* コメントアイコン（独自作成） */}
                <Link href="#reviews" className="d-review-badge">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M1.5 1.5h10a.8.8 0 01.8.8v6a.8.8 0 01-.8.8H8L6.5 11 5 9.1H1.5a.8.8 0 01-.8-.8v-6a.8.8 0 01.8-.8z"
                      stroke="rgba(46,38,32,.55)"
                      strokeWidth="1.1"
                      fill="rgba(255,255,255,.5)"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 4.8h6M3.5 6.6h4"
                      stroke="rgba(46,38,32,.4)"
                      strokeWidth=".9"
                      strokeLinecap="round"
                    />
                  </svg>
                  {counselorReviews.length}件
                </Link>
              </div>

              <div className="d-tags">
                {counselor.specialties.map((s, i) => (
                  <span key={s} className={`d-tag${i === 0 ? " featured" : ""}`}>{s}</span>
                ))}
              </div>

              {/* 診断タイプバッジ */}
              {diagnosisTypeId && (() => {
                const dt = DIAGNOSIS_TYPES[diagnosisTypeId as DiagnosisTypeId];
                if (!dt) return null;
                return (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: ".08em", marginBottom: 6 }}>
                      相性の良い診断タイプ:
                    </div>
                    <span
                      style={{
                        background: dt.gradient,
                        fontSize: 10,
                        padding: "3px 10px",
                        borderRadius: 20,
                        color: "var(--black)",
                        fontFamily: "Noto Sans JP, sans-serif",
                        fontWeight: 400,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {dt.name}
                    </span>
                  </div>
                );
              })()}

              <div className="d-stats">
                {counselor.successCount > 0 && (
                  <div className="d-stat-item">
                    <div className="d-stat-num">{counselor.successCount}</div>
                    <div className="d-stat-label">成婚実績</div>
                  </div>
                )}
                {counselor.yearsExp > 0 && (
                  <div className="d-stat-item">
                    <div className="d-stat-num">{counselor.yearsExp}</div>
                    <div className="d-stat-label">経験年数</div>
                  </div>
                )}
              </div>
            </div>

            {/* 右: 予約カード（PCのみ） */}
            <div className="d-book-card">
              <div className="d-book-card-title">初回面談を予約する</div>
              {counselor.nextAvailable && (
                <div className="d-book-card-sub">次の空き: {counselor.nextAvailable}</div>
              )}
              <div className="d-price-row">
                <span className="d-price-label">面談料金</span>
                <span className="d-price">¥0</span>
                <span className="d-price-free">完全無料</span>
              </div>
              <Link
                href={`/booking/${counselor.id}`}
                className="block w-full text-center py-4 rounded-xl text-sm tracking-wide text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "var(--accent)", boxShadow: "0 6px 20px rgba(200,169,122,0.35)" }}
              >
                空き日時を確認する
              </Link>
              <p className="d-book-note">登録不要 · 面談料 無料</p>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            リール画像 サムネイルスライダー（ヒーロー直下）
            Kinda talk のリールから遷移した時の世界観の連続性を保つため、
            リール画像をミニサムネイルで横スクロール表示する。
        ═══════════════════════════════════════════════════ */}
        {supabaseCounselor?.reelImages && supabaseCounselor.reelImages.length > 0 && (
          <div
            style={{
              borderTop: "1px solid var(--light)",
              borderBottom: "1px solid var(--light)",
              background: "var(--pale)",
              padding: "16px 0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: "0 20px",
                overflowX: "auto",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
              className="hide-scrollbar"
              aria-label="カウンセラーのリール画像"
            >
              {supabaseCounselor.reelImages.map((img, idx) => (
                <div
                  key={idx}
                  role="img"
                  aria-label={`リール ${idx + 1} 枚目${img.caption ? `: ${img.caption}` : ""}`}
                  style={{
                    flexShrink: 0,
                    width: 84,
                    height: 150,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: img.bg.startsWith("url(") ? "#EFE3CB" : img.bg,
                    backgroundImage: img.bg.startsWith("url(") ? img.bg : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                    position: "relative",
                  }}
                >
                  {img.caption && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "6px 8px 6px",
                        background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)",
                        fontFamily: "var(--font-mincho)",
                        fontSize: 9,
                        color: "white",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {img.caption}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            キャンペーンバー
        ═══════════════════════════════════════════════════ */}
        {counselor.campaign && (
          <div className="d-campaign-bar">
            <div className="d-campaign-inner">
              <div className="d-campaign-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.4l-3.6 2.1.7-4L2.2 5.7l4-.6z"
                    fill="var(--accent)" stroke="var(--accent)" strokeWidth=".5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="d-campaign-label">{counselor.campaign.label}</div>
                <div className="d-campaign-detail">{counselor.campaign.detail}</div>
              </div>
              <div className="d-campaign-expiry">{counselor.campaign.expiry}</div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            コンテンツエリア（2カラム）
        ═══════════════════════════════════════════════════ */}
        <div className="detail-body">
          <div className="wrap">
            <div className="detail-grid">

              {/* ── 左カラム: プロフィール・メッセージ・口コミ ── */}
              <div style={{ minWidth: 0 }}>

                {/* プロフィール */}
                <section style={{ marginBottom: 48 }}>
                  <h2
                    className="text-lg text-ink mb-6 pb-3 border-b border-light"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    プロフィール
                  </h2>

                  {/* バイオグラフィ */}
                  <div style={{ marginBottom: 28 }}>
                    {counselor.bio.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-sm text-mid leading-relaxed" style={{ marginBottom: 12 }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* 2カラムグリッド */}
                  <div className="d-profile-grid">
                    {counselor.specialties.length > 0 && (
                      <div className="d-profile-item">
                        <div className="d-profile-key">専門分野</div>
                        <div className="d-profile-val">{counselor.specialties.join(" · ")}</div>
                      </div>
                    )}
                    {counselor.area && (
                      <div className="d-profile-item">
                        <div className="d-profile-key">エリア</div>
                        <div className="d-profile-val">{counselor.area}</div>
                      </div>
                    )}
                    {counselor.yearsExp > 0 && (
                      <div className="d-profile-item">
                        <div className="d-profile-key">経験年数</div>
                        <div className="d-profile-val">{counselor.yearsExp}年</div>
                      </div>
                    )}
                    {counselor.successCount > 0 && (
                      <div className="d-profile-item">
                        <div className="d-profile-key">成婚実績</div>
                        <div className="d-profile-val">{counselor.successCount}組</div>
                      </div>
                    )}
                    {counselor.experienceLabel && (
                      <div className="d-profile-item" style={{ gridColumn: "1 / -1" }}>
                        <div className="d-profile-key">経歴・実績</div>
                        <div className="d-profile-val">{counselor.experienceLabel}</div>
                      </div>
                    )}
                    {counselor.qualifications.length > 0 && (
                      <div className="d-profile-item" style={{ gridColumn: "1 / -1" }}>
                        <div className="d-profile-key">資格・認定</div>
                        <div className="d-profile-val">{counselor.qualifications.join(" / ")}</div>
                      </div>
                    )}
                  </div>
                </section>

                {/* 料金表 */}
                <section style={{ marginBottom: 48 }}>
                  <h2
                    className="text-lg text-ink mb-6 pb-3 border-b border-light"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    料金プラン
                  </h2>

                  {/* Supabase 経由のカウンセラー: 所属相談所の fees を表示 */}
                  {counselor.agencyFees && counselor.agencyFees.length > 0 ? (
                    <>
                      <div className="pricing-grid">
                        {counselor.agencyFees.map((plan, planIdx) => (
                          <div
                            key={`${plan.name}-${planIdx}`}
                            className={`pricing-card${plan.popular ? " featured" : ""}`}
                          >
                            <div className="pricing-card-head">
                              <div className="pricing-plan-name">{plan.name}</div>
                              {plan.popular && <div className="pricing-popular">人気</div>}
                            </div>

                            {/* 対象セグメント */}
                            {plan.description && (
                              <p
                                style={{
                                  margin: 0,
                                  padding: "12px 20px 0",
                                  fontSize: 12,
                                  color: "var(--mid)",
                                  lineHeight: 1.7,
                                  fontFamily: "var(--font-mincho)",
                                }}
                              >
                                {plan.description}
                              </p>
                            )}

                            {/* 含まれるもの */}
                            {plan.included && plan.included.length > 0 && (
                              <ul
                                style={{
                                  margin: 0,
                                  padding: "12px 20px 4px",
                                  listStyle: "none",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                }}
                              >
                                {plan.included.map((line, lineIdx) => (
                                  <li
                                    key={lineIdx}
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: 8,
                                      fontSize: 12,
                                      color: "var(--ink)",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>
                                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                        <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </span>
                                    <span>{line}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="pricing-items">
                              {plan.items.map((item, itemIdx) => {
                                const fmt = formatFeeItem(item);
                                const isFree = item.amount === 0;
                                return (
                                  <div key={`${item.label}-${itemIdx}`} className="pricing-item">
                                    <div className="pricing-item-label">{item.label}</div>
                                    <div className={`pricing-item-val${isFree ? " free" : ""}`}>
                                      {fmt.main}
                                      {fmt.suffix && <small>{fmt.suffix}</small>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* プラン単位の注意事項 */}
                            {plan.notes && (
                              <div
                                style={{
                                  margin: "0 20px 16px",
                                  padding: "10px 12px",
                                  background: "var(--pale)",
                                  borderRadius: 8,
                                  fontSize: 11,
                                  color: "var(--mid)",
                                  lineHeight: 1.7,
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {plan.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 各種割引・お得情報（プラン横断） */}
                      {supabaseAgency?.discounts && supabaseAgency.discounts.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                          <h3
                            style={{
                              fontFamily: "var(--font-mincho)",
                              fontSize: 15,
                              color: "var(--ink)",
                              marginBottom: 12,
                              paddingBottom: 8,
                              borderBottom: "1px solid var(--pale)",
                            }}
                          >
                            <span style={{ color: "var(--accent)", marginRight: 6 }}>✦</span>
                            各種割引・お得情報
                          </h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {supabaseAgency.discounts.map((d, idx) => {
                              const value = d.amount != null
                                ? `¥${d.amount.toLocaleString("ja-JP")} OFF`
                                : d.percent != null
                                  ? `${d.percent}% OFF`
                                  : null;
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    padding: "12px 14px",
                                    background: "rgba(200,169,122,.06)",
                                    border: "1px solid rgba(200,169,122,.25)",
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 12,
                                  }}
                                >
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                      style={{
                                        fontFamily: "var(--font-mincho)",
                                        fontSize: 14,
                                        color: "var(--ink)",
                                        marginBottom: 2,
                                      }}
                                    >
                                      {d.label}
                                    </p>
                                    {d.condition && (
                                      <p style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.6 }}>
                                        対象：{d.condition}
                                      </p>
                                    )}
                                    {d.note && (
                                      <p style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.6, marginTop: 2 }}>
                                        {d.note}
                                      </p>
                                    )}
                                  </div>
                                  {value && (
                                    <span
                                      style={{
                                        fontFamily: "var(--font-serif)",
                                        fontSize: 14,
                                        color: "var(--accent)",
                                        fontWeight: 400,
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <p className="pricing-note">
                        ※ 料金は所属相談所「{counselor.agency}」が設定したものです。詳細は相談所詳細ページからもご確認いただけます。
                      </p>
                    </>
                  ) : counselor.pricing.plans.length === 0 ? (
                    /* Supabase オンリーで fees も未登録: 案内のみ */
                    <div
                      className="bg-pale rounded-2xl p-6"
                      style={{ textAlign: "center" }}
                    >
                      <p style={{ fontSize: 13, color: "var(--mid)", lineHeight: 1.8 }}>
                        料金プランは所属相談所のページでご確認ください。
                      </p>
                      {counselor.agencyId && (
                        <Link
                          href={`/agencies/${counselor.agencyId}`}
                          style={{
                            display: "inline-block",
                            marginTop: 12,
                            padding: "8px 20px",
                            border: "1px solid var(--accent)",
                            borderRadius: 20,
                            fontSize: 12,
                            color: "var(--accent)",
                          }}
                        >
                          {counselor.agency || "相談所詳細"} を見る
                        </Link>
                      )}
                    </div>
                  ) : (
                    /* mock カウンセラー: 従来通り pricing.plans を表示 */
                    <div className="pricing-grid">
                    {counselor.pricing.plans.map((plan) => (
                      <div key={plan.name} className={`pricing-card${plan.featured ? " featured" : ""}`}>
                        <div className="pricing-card-head">
                          <div className="pricing-plan-name">{plan.name}</div>
                          {plan.featured && <div className="pricing-popular">人気</div>}
                        </div>
                        <div className="pricing-items">
                          <div className="pricing-item">
                            <div className="pricing-item-label">入会金</div>
                            <div className="pricing-item-val">
                              ¥{plan.enrollment.toLocaleString()}<small>（税込）</small>
                            </div>
                          </div>
                          <div className="pricing-item">
                            <div className="pricing-item-label">月会費</div>
                            <div className="pricing-item-val">
                              ¥{plan.monthly.toLocaleString()}<small>/月</small>
                            </div>
                          </div>
                          <div className="pricing-item">
                            <div className="pricing-item-label">お見合い料</div>
                            {plan.matchmaking !== null ? (
                              <div className="pricing-item-val">
                                ¥{plan.matchmaking.toLocaleString()}<small>/回</small>
                              </div>
                            ) : (
                              <div className="pricing-item-val free">無料</div>
                            )}
                          </div>
                          <div className="pricing-item">
                            <div className="pricing-item-label">成婚料</div>
                            <div className="pricing-item-val">
                              ¥{plan.success.toLocaleString()}<small>（税込）</small>
                            </div>
                          </div>
                        </div>
                        {plan.notes && (
                          <div style={{ padding: "12px 20px", fontSize: 11, color: "var(--mid)", borderTop: "1px solid rgba(0,0,0,.06)" }}>
                            {plan.notes}
                          </div>
                        )}
                      </div>
                    ))}
                    </div>
                  )}

                  {/* mock 表示時のみ pricing.note を出す（agencyFees / 案内ブロック側は独自の注釈あり） */}
                  {!counselor.agencyFees && counselor.pricing.plans.length > 0 && (
                    <p className="pricing-note">{counselor.pricing.note}</p>
                  )}
                </section>

                {/* メッセージ */}
                <section style={{ marginBottom: 48 }}>
                  <h2
                    className="text-lg text-ink mb-6 pb-3 border-b border-light"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    カウンセラーからのメッセージ
                  </h2>
                  <div className="d-message">
                    <p className="d-message-text">&ldquo;{counselor.message}&rdquo;</p>
                    <p className="d-message-author">— {counselor.name}</p>
                  </div>
                </section>

                {/* 口コミ */}
                <section id="reviews">
                  <div className="flex items-end justify-between mb-6 pb-3 border-b border-light">
                    <h2
                      className="text-lg text-ink"
                      style={{ fontFamily: "var(--font-mincho)" }}
                    >
                      口コミ・評価
                    </h2>
                    <span className="text-xs text-muted">{counselorReviews.length}件</span>
                  </div>

                  {/* 評価サマリー */}
                  {counselorReviews.length > 0 ? (
                    <div className="bg-pale rounded-2xl p-6 mb-6">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="text-center md:w-32 shrink-0">
                          <p
                            className="text-5xl text-ink leading-none mb-2"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {avgRating.toFixed(1)}
                          </p>
                          <StarRating rating={Math.round(avgRating)} size={16} />
                          <p className="text-xs text-muted mt-1">{counselorReviews.length}件の評価</p>
                        </div>
                        {/* 評価カテゴリの棒グラフは口コミが一定数集まってから出す。
                            少数件だと数字に意味が出ないため 3 件以上を閾値にしている */}
                        {counselorReviews.length >= 3 && (
                          <div className="flex-1 space-y-2 w-full">
                            <RatingBar label="話しやすさ" value={4.9} />
                            <RatingBar label="専門知識" value={4.8} />
                            <RatingBar label="提案力" value={4.7} />
                            <RatingBar label="サポート" value={4.9} />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-4 pt-4 border-t border-light">
                        ※ Kinda ふたりへ経由で面談した方のみ投稿できます
                      </p>
                    </div>
                  ) : (
                    <div
                      className="bg-pale rounded-2xl p-6 mb-6"
                      style={{ textAlign: "center" }}
                    >
                      <p style={{ fontSize: 13, color: "var(--mid)", lineHeight: 1.8 }}>
                        まだ口コミはありません。<br />
                        面談された方の口コミがここに表示されます。
                      </p>
                      <p className="text-xs text-muted mt-3">
                        ※ Kinda ふたりへ経由で面談した方のみ投稿できます
                      </p>
                    </div>
                  )}

                  {/* 口コミ一覧 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {counselorReviews.map((review) => (
                      <div key={review.id} className="rv-card">

                        {/* 上段: 日付 / 面談済みバッジ */}
                        <div className="rv-meta">
                          <span className="rv-date">{review.date}</span>
                          {review.verified && (
                            <span className="rv-verified">
                              <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor">
                                <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 00-.7.7l2.1 2.1a.5.5 0 00.7 0l3.2-3.2a.5.5 0 00-.7-.6z" />
                              </svg>
                              面談済み口コミ
                            </span>
                          )}
                        </div>

                        {/* 星 + 数値 */}
                        <div className="rv-stars-row">
                          <StarRating rating={review.rating} size={17} />
                          <span className="rv-rating-num">{review.rating}.0</span>
                        </div>

                        {/* タイトル */}
                        <p className="rv-title">{review.title}</p>

                        {/* 本文 */}
                        <p className="rv-text">{review.text}</p>

                        {/* フッター: 投稿者 */}
                        <div className="rv-footer">
                          <span className="rv-author">{review.author}</span>
                        </div>

                      </div>
                    ))}
                  </div>
                </section>

                {/* 基本情報（ホットペッパー的に下部に配置）
                   所属相談所の場所・営業時間・定休日 + Google Maps を一箇所にまとめる。
                   mock agency 優先・Supabase agency へフォールバックして
                   どちらでも表示できる設計（013 マイグレーション後は Supabase
                   側の address/access/hours/holiday/directions も読み取れる）。 */}
                {(() => {
                  // mock agency / Supabase agency の双方から表示用情報を組み立て
                  const info = {
                    area: matchedAgency?.area ?? supabaseAgency?.area ?? counselor.area ?? null,
                    address: matchedAgency?.address ?? supabaseAgency?.address ?? null,
                    access: matchedAgency?.access ?? supabaseAgency?.access ?? null,
                    hours: matchedAgency?.hours ?? supabaseAgency?.hours ?? null,
                    holiday: matchedAgency?.holiday ?? supabaseAgency?.holiday ?? null,
                    directions: matchedAgency?.directions ?? supabaseAgency?.directions ?? null,
                  };
                  const mapsQuery = info.address ?? agencyForCard?.name ?? null;
                  const hasAny =
                    info.area || info.address || info.access || info.hours ||
                    info.holiday || info.directions || mapsQuery;
                  if (!hasAny) return null;
                  return (
                    <section style={{ marginTop: 48 }}>
                      <h2
                        className="text-lg text-ink mb-6 pb-3 border-b border-light"
                        style={{ fontFamily: "var(--font-mincho)" }}
                      >
                        基本情報
                      </h2>
                      <div className="d-profile-grid">
                        {info.area && (
                          <div className="d-profile-item">
                            <div className="d-profile-key">エリア</div>
                            <div className="d-profile-val">{info.area}</div>
                          </div>
                        )}
                        {info.access && (
                          <div className="d-profile-item">
                            <div className="d-profile-key">アクセス</div>
                            <div className="d-profile-val">{info.access}</div>
                          </div>
                        )}
                        {info.hours && (
                          <div className="d-profile-item">
                            <div className="d-profile-key">営業時間</div>
                            <div className="d-profile-val">{info.hours}</div>
                          </div>
                        )}
                        {info.holiday && (
                          <div className="d-profile-item">
                            <div className="d-profile-key">定休日</div>
                            <div className="d-profile-val">{info.holiday}</div>
                          </div>
                        )}
                        {info.address && (
                          <div className="d-profile-item" style={{ gridColumn: "1 / -1" }}>
                            <div className="d-profile-key">所在地</div>
                            <div className="d-profile-val">{info.address}</div>
                          </div>
                        )}
                        {info.directions && (
                          <div className="d-profile-item" style={{ gridColumn: "1 / -1" }}>
                            <div className="d-profile-key">最寄駅からの行き方</div>
                            <div className="d-profile-val" style={{ whiteSpace: "pre-line" }}>
                              {info.directions}
                            </div>
                          </div>
                        )}
                      </div>
                      {mapsQuery && (
                        <div
                          style={{
                            marginTop: 20,
                            borderRadius: 14,
                            overflow: "hidden",
                            border: "1px solid var(--light)",
                          }}
                        >
                          <iframe
                            title="Google マップ"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
                            width="100%"
                            height="240"
                            style={{ border: 0, display: "block" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      )}
                    </section>
                  );
                })()}

              </div>

              {/* ── 右カラム: スティッキーサイドバー ── */}
              <aside style={{ alignSelf: "start", position: "sticky", top: "72px" }}>

                {/* 予約カード */}
                <div
                  className="bg-white rounded-2xl border border-light overflow-hidden"
                  style={{ marginBottom: 20 }}
                >
                  <div style={{ padding: "24px 24px 0" }}>
                    {counselor.nextAvailable && (
                      <>
                        <p className="text-xs text-muted mb-2">次の空き枠</p>
                        <p
                          className="text-sm text-ink mb-5"
                          style={{ fontFamily: "var(--font-mincho)" }}
                        >
                          {counselor.nextAvailable}
                        </p>
                      </>
                    )}
                    <div className="d-price-row" style={{ marginBottom: 20 }}>
                      <span className="d-price-label">面談料金</span>
                      <span className="d-price">¥0</span>
                      <span className="d-price-free">完全無料</span>
                    </div>
                  </div>
                  <div style={{ padding: "0 24px 24px" }}>
                    <Link href={`/booking/${counselor.id}`} className="cta-book-main">
                      無料面談を予約する
                    </Link>
                    <p className="cta-book-main-note">登録不要 · 面談料 完全無料</p>
                  </div>
                </div>

                {/* 相談所情報カード */}
                <div>
                  <p
                    className="text-xs text-muted uppercase tracking-wider mb-4"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    所属相談所
                  </p>
                  <AgencyCardBlock
                    agency={agencyForCard}
                    counselorCount={agencyCounselorCount}
                    fallbackName={counselor.agency}
                    fallbackAddress={counselor.address}
                  />
                </div>

              </aside>

            </div>
          </div>
        </div>
        <ScrollToTopButton />

        {/* ─── 構造化データ（JSON-LD） ─── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `/counselors/${counselor.id}#person`,
                  name: counselor.name,
                  jobTitle:
                    "role" in counselor && (counselor as { role?: string }).role
                      ? (counselor as { role: string }).role
                      : "ブライダルカウンセラー",
                  worksFor: {
                    "@type": "LocalBusiness",
                    name: counselor.agency,
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: counselor.area,
                      ...(counselor.address
                        ? { streetAddress: counselor.address }
                        : {}),
                    },
                  },
                  description:
                    typeof counselor.bio === "string"
                      ? counselor.bio.slice(0, 280)
                      : "",
                },
                {
                  "@type": "AggregateRating",
                  itemReviewed: { "@id": `/counselors/${counselor.id}#person` },
                  ratingValue: avgRating.toFixed(2),
                  reviewCount: counselorReviews.length,
                  bestRating: "5",
                  worstRating: "1",
                },
                ...counselorReviews.slice(0, 5).map((r: { rating: number; user?: string; text?: string; body?: string; date?: string }) => ({
                  "@type": "Review",
                  itemReviewed: { "@id": `/counselors/${counselor.id}#person` },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: String(r.rating),
                    bestRating: "5",
                    worstRating: "1",
                  },
                  author: { "@type": "Person", name: r.user ?? "匿名" },
                  reviewBody: (r.text ?? r.body ?? "").slice(0, 280),
                  ...(r.date ? { datePublished: r.date } : {}),
                })),
              ],
            }),
          }}
        />
      </main>

      {/* モバイル用固定CTA — 右端浮遊 pill ボタン */}
      <div className="cta-mobile-bar">
        <Link href={`/booking/${counselor.id}`} className="cta-mobile-btn" aria-label={`${counselor.name}カウンセラーの面談を予約する`}>
          <span>予約する</span>
          <svg className="cta-mobile-btn-arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <Footer />
    </>
  );
}
