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
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  FeeTooltipContent,
  CampaignTooltipContent,
} from "@/lib/policyMessages";
import CounselorDetailViewTracker from "@/components/counselors/CounselorDetailViewTracker";
import CounselorReelMini from "@/components/counselors/CounselorReelMini";
import ReviewReply from "@/components/counselors/ReviewReply";
import {
  AGENCIES,
  COUNSELORS,
  getCounselorById,
  getCounselors,
  getReviewsByCounselor,
  getNextSlotByCounselor,
  getAgencyById,
  formatFeeItem,
  isCounselorCampaignActive,
  type FeePlan,
} from "@/lib/data";
import { DIAGNOSIS_TYPES, DiagnosisTypeId } from "@/lib/diagnosis";
import { getStoryById } from "@/lib/mock/stories";

// ISR：60秒キャッシュで2回目以降の遷移を高速化
export const revalidate = 60;

/**
 * mock の 4 件（ID 1, 2, 3, 6）と、Supabase の公開済みカウンセラーを
 * ビルド時に事前レンダリングして HTML を Edge にキャッシュする。
 * これで初回アクセス時の SSR コスト（数百ms）をスキップできる。
 * 未知の ID（運営後追加されたカウンセラー）は ISR で動的フォールバック。
 */
export async function generateStaticParams() {
  const mockIds = ["1", "2", "3", "6"];
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
    name: "田中 美紀",
    nameKana: "たなか みき",
    agency: "Atelier Mariage 銀座",
    agencyId: "1",
    area: "東京・銀座",
    address: "東京都中央区銀座4丁目",
    specialties: ["傾聴が得意", "30代女性実績多数", "IT・医療職サポート", "押しつけない"],
    rating: 4.9,
    reviewCount: 82,
    yearsExp: 11,
    successCount: 124,
    nextAvailable: "2026年4月8日（水）14:00〜",
    bio: "結婚相談所のカウンセラーになって11年、約400組の出会いを見てきました。最初の面談で大切にしているのは、あなたが今どんな気持ちでここに来てくれたのかをゆっくり聞くこと。\n\n婚活は人生の選択。だから、急がず、誤魔化さず、あなたの言葉を待ちます。IT・医療・公務員など多様な職種のご成婚実績を持ち、おひとりおひとりのライフスタイルに合わせたご提案が強みです。",
    message: "まずあなたの話をじっくり聞くことを大切にしています。焦らず、自分のペースで進めましょう。",
    qualifications: ["IBJ認定カウンセラー", "メンタルヘルス・マネジメント検定 II 種"],
    photoUrl: undefined,
    monthlyFee: "18,000",
    campaign: { label: "初回面談料 無料", detail: "初めての方は面談料0円でご相談いただけます", expiry: null },
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 100000, monthly: 18000, matchmaking: 3000, success: 150000 },
        { name: "プレミアム", featured: true, enrollment: 150000, monthly: 25000, matchmaking: null, success: 200000, notes: "お見合い料込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談・見学は無料。詳細はカウンセラーにご確認ください。",
    },
  },
  "2": {
    id: "2",
    name: "山田 健太郎",
    nameKana: "やまだ けんたろう",
    agency: "Atelier Mariage 銀座",
    agencyId: "1",
    area: "東京・銀座",
    address: "東京都中央区銀座4丁目",
    specialties: ["医師・経営者の婚活", "短期成婚プラン", "男性目線アドバイス", "率直なアドバイス"],
    rating: 4.8,
    reviewCount: 41,
    yearsExp: 8,
    successCount: 98,
    nextAvailable: "2026年4月6日（月）13:00〜",
    bio: "医師・自営業・経営者の方の婚活を中心にサポート。男性目線で「どうすれば確率が上がるか」を共に考えます。\n\n優しさだけでは婚活は終わらない。データと戦略で、ここから半年〜1年での成婚を一緒に目指します。迷ったら、行動で答えを取りに行く。それが私の流儀です。",
    message: "男性目線から率直なアドバイスをします。短期成婚を本気で目指す方を歓迎します。",
    qualifications: ["IBJ認定カウンセラー", "ファイナンシャルプランナー2級"],
    photoUrl: undefined,
    monthlyFee: "18,000",
    campaign: { label: "初回面談料 無料", detail: "初めての方は面談料0円でご相談いただけます", expiry: null },
    pricing: {
      plans: [
        { name: "スタンダード", enrollment: 100000, monthly: 18000, matchmaking: 3000, success: 150000 },
        { name: "プレミアム", featured: true, enrollment: 150000, monthly: 25000, matchmaking: null, success: 200000, notes: "お見合い料込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料。短期成婚プランの詳細はカウンセラーにご確認ください。",
    },
  },
  "3": {
    id: "3",
    name: "佐藤 綾乃",
    nameKana: "さとう あやの",
    agency: "Wedding Note 渋谷",
    agencyId: "2",
    area: "東京・渋谷",
    address: "東京都渋谷区渋谷2丁目",
    specialties: ["価値観の言語化", "30代の自分探し", "押しつけないカウンセリング", "傾聴が得意"],
    rating: 4.9,
    reviewCount: 28,
    yearsExp: 12,
    successCount: 87,
    nextAvailable: "2026年4月10日（金）11:00〜",
    bio: "婚活で迷子になっていた方の「自分にとって大切なもの」を一緒に言葉にしてきました。結婚は誰かに合わせる場所ではなく、あなたの価値観を分かち合える人との出会い。\n\n12年間で見てきたのは、自分軸を見つけた人ほど、納得のいく結婚にたどり着いているということ。答えは外ではなく、あなたの中にある。それを引き出すお手伝いをします。",
    message: "急かされることなく、自分の希望が整理できる場をつくります。あなたの軸を、一緒にさがしましょう。",
    qualifications: ["IBJ認定カウンセラー", "産業カウンセラー"],
    photoUrl: undefined,
    monthlyFee: "12,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "ライト", enrollment: 80000, monthly: 12000, matchmaking: 2000, success: 100000 },
        { name: "スタンダード", featured: true, enrollment: 100000, monthly: 15000, matchmaking: null, success: 150000, notes: "お見合い料込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料。データ婚活サービスとセットでご利用いただけます。",
    },
  },
  "6": {
    id: "6",
    name: "林 俊介",
    nameKana: "はやし しゅんすけ",
    agency: "Marry Hub 新宿",
    agencyId: "5",
    area: "東京・新宿",
    address: "東京都新宿区新宿3丁目",
    specialties: ["20代の婚活", "オンライン専門", "IT・クリエイター職", "同世代感覚"],
    rating: 4.5,
    reviewCount: 16,
    yearsExp: 4,
    successCount: 32,
    nextAvailable: "2026年4月11日（土）13:00〜",
    bio: "20代後半〜30代前半の婚活を中心に、オンラインでの相談を専門にしています。同世代として、価値観や働き方を理解した上でアドバイスしたい。\n\n地方在住の方や、仕事が忙しくて店舗に通えない方も大歓迎です。気構えずに、まずは話してみよう。住んでいる場所に関係なく、全国どこからでも本格的な婚活ができる環境を提供しています。",
    message: "同世代感覚で話せる環境を大切にしています。気構えずに、まずは話してみよう。",
    qualifications: ["IBJ認定カウンセラー"],
    photoUrl: undefined,
    monthlyFee: "10,000",
    campaign: null,
    pricing: {
      plans: [
        { name: "オンラインプラン", featured: true, enrollment: 50000, monthly: 10000, matchmaking: null, success: 80000, notes: "全国対応・お見合い料込み" },
      ],
      note: "※ 料金はすべて税込です。初回面談は無料（オンライン対応）。",
    },
  },
};

const reviews = [
  // 田中 美紀（ID:1）
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
  // 山田 健太郎（ID:2）
  {
    id: "5",
    counselorId: "2",
    rating: 5,
    title: "戦略的に動けるようになった",
    text: "他の相談所では「とりあえずお見合いしてみましょう」だったのが、山田さんは「申込率・返事率を見ながら戦略を組みましょう」とデータベースで話してくれた。男性として、感情論ではなく数字で動ける感覚が掴めました。",
    author: "30代・男性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "6",
    counselorId: "2",
    rating: 5,
    title: "忙しい医師の働き方を理解してくれた",
    text: "勤務医で婚活時間が限られていることを正直に話したら、山田さんは「短期成婚プラン」を提案してくれました。お見合い件数・優先順位の付け方まで一緒に設計してもらい、半年でお相手が決まりました。",
    author: "30代・男性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "7",
    counselorId: "2",
    rating: 4,
    title: "率直なフィードバックがありがたかった",
    text: "プロフィールやお見合いでの所作について、遠慮なく改善ポイントを指摘してくれました。「迷ったら、行動で答えを取りに行く」というスタンスが私には合っていたと思います。",
    author: "30代・男性",
    date: "2025年12月",
    verified: true,
  },
  // 佐藤 綾乃（ID:3）
  {
    id: "8",
    counselorId: "3",
    rating: 5,
    title: "自分の価値観を言葉にできるようになった",
    text: "婚活で何を優先したいのか分からないまま動いていたのですが、佐藤さんは『あなたにとって大切なものを一緒に言葉にしましょう』と何度も対話してくれました。条件先行ではない婚活の進め方が、はじめて腑に落ちました。",
    author: "30代・女性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "9",
    counselorId: "3",
    rating: 4,
    title: "急かされない安心感があった",
    text: "他の相談所では「来月までに○件のお見合いを」とプレッシャーをかけられていましたが、佐藤さんは『迷うのも大事な時間ですよ』と私のペースを尊重してくれました。気持ちの整理がついてから、お見合いも自然に進められるようになりました。",
    author: "30代・女性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "10",
    counselorId: "3",
    rating: 5,
    title: "押しつけがましさが全くなかった",
    text: "「答えは外ではなく、あなたの中にある」という佐藤さんの言葉が印象的でした。アドバイスを押しつけるのではなく、私の言葉を引き出してくれる傾聴型のカウンセリング。自分軸で動ける感覚が初めて持てました。",
    author: "30代・女性",
    date: "2025年11月",
    verified: true,
  },
  // 林 俊介（ID:6）
  {
    id: "16",
    counselorId: "6",
    rating: 5,
    title: "同世代だから話しやすかった",
    text: "20代後半の婚活で、年上のカウンセラーに相談するのが少し気がひけていました。林さんは同世代で、私の働き方や価値観をすぐに理解してくれて、距離感がちょうどよかったです。",
    author: "20代・女性",
    date: "2026年2月",
    verified: true,
  },
  {
    id: "17",
    counselorId: "6",
    rating: 5,
    title: "オンラインで気軽に相談できた",
    text: "地方在住で店舗に通えないため、オンライン専門のカウンセラーを探していました。林さんはオンライン対応にも慣れていて、画面越しでも温度感が伝わるアドバイスをもらえました。",
    author: "30代・男性",
    date: "2026年1月",
    verified: true,
  },
  {
    id: "18",
    counselorId: "6",
    rating: 4,
    title: "IT 職の働き方を理解してくれた",
    text: "リモートワーク中心の働き方を理解してもらえたのが大きかったです。クリエイティブ職で時間が不規則な中、無理なく婚活を続けるペース配分を一緒に考えてもらえました。",
    author: "30代・男性",
    date: "2025年11月",
    verified: true,
  },
];

/* ────────────────────────────────────────────────────────────
   コンポーネント
──────────────────────────────────────────────────────────── */
/**
 * 成婚実績の表示ヘルパー。
 * カウンセラー管理画面の入力 UI は select で「1〜9 / 10/15/20/30/50/100/200/300 組以上」を
 * 選ぶ仕様（DB は number のまま）。10 以上を選んだら user-site では「○組以上」表示に切替。
 */
function formatSuccessCount(n: number): { num: string; label: string } {
  // ヒーローの大きな数字部分は「10+」のようにコンパクトに表示し、
  // プロフィールセクションでは「10組以上」と読みやすく出す。
  if (n >= 10) {
    return { num: `${n}+`, label: `${n}組以上` };
  }
  return { num: String(n), label: `${n}組` };
}

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
    /** 個別カウンセラーのキャンセルポリシー（未設定なら所属相談所→デフォルトにフォールバック） */
    cancelPolicy?: string;
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
      campaign: isCounselorCampaignActive(sc.campaignLabel, sc.campaignExpiry)
        ? {
            label: sc.campaignLabel as string,
            detail: sc.campaignDetail ?? "",
            expiry: sc.campaignExpiry ?? "",
          }
        : null,
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
        // Supabase 由来のカウンセラー個別キャンペーンを優先（mock より新しい設定）
        campaign: isCounselorCampaignActive(
          supabaseCounselor?.campaignLabel,
          supabaseCounselor?.campaignExpiry,
        )
          ? {
              label: supabaseCounselor!.campaignLabel as string,
              detail: supabaseCounselor!.campaignDetail ?? "",
              expiry: supabaseCounselor!.campaignExpiry ?? "",
            }
          : mockCounselor.campaign,
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
  const matchedCounselorData = COUNSELORS.find((c) => String(c.id) === String(id));
  const diagnosisTypeId = matchedCounselorData?.diagnosisType ?? supabaseCounselor?.diagnosisType ?? null;

  /**
   * キャンセルポリシー表示文言：counselor → agency → デフォルト の順でフォールバック。
   * counselor.cancelPolicy が設定されていればそれを優先（個別カウンセラーの方針）、
   * 無ければ所属相談所の cancelPolicy、それも無ければ共通デフォルト文言を使う。
   */
  const effectiveCancelPolicy =
    counselor.cancelPolicy ??
    matchedAgency?.cancelPolicy ??
    supabaseAgency?.cancelPolicy ??
    "当日キャンセル可 · 登録不要 · 完全無料";

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
                    <div className="d-stat-num">
                      {formatSuccessCount(counselor.successCount).num}
                    </div>
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
              {/* キャンセルポリシー（counselor → agency → デフォルト の順でフォールバック） */}
              <p
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  display: "flex",
                  gap: 6,
                  alignItems: "flex-start",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ flexShrink: 0, marginTop: 2 }}
                  aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="6" stroke="var(--muted)" strokeWidth="1.2" />
                  <path
                    d="M7 6v4M7 4.5v.5"
                    stroke="var(--muted)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                {effectiveCancelPolicy}
              </p>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            ミニリール（ヒーロー直下）
            Kinda talk のリールから遷移した時の世界観の連続性を保つため、
            リール本体と同じ「1 枚ずつスワイプ」の表現で再生する。
        ═══════════════════════════════════════════════════ */}
        {supabaseCounselor?.reelImages && supabaseCounselor.reelImages.length > 0 && (
          <CounselorReelMini images={supabaseCounselor.reelImages} />
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
                <div className="d-campaign-label" style={{ display: "inline-flex", alignItems: "center" }}>
                  {counselor.campaign.label}
                  <InfoTooltip
                    ariaLabel="キャンペーンの適用条件を見る"
                    variant="accent"
                  >
                    <CampaignTooltipContent expiry={counselor.campaign.expiry} />
                  </InfoTooltip>
                </div>
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
                        <div className="d-profile-val">
                          {formatSuccessCount(counselor.successCount).label}
                        </div>
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
                    style={{
                      fontFamily: "var(--font-mincho)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    料金プラン
                    <InfoTooltip
                      ariaLabel="料金プランの注意点を見る"
                      variant="muted"
                      align="left-anchor"
                    >
                      <FeeTooltipContent note={counselor.pricing.note} />
                    </InfoTooltip>
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

                            {/* プランオプション（追加料金項目）— items の直後に表示 */}
                            {plan.options && plan.options.length > 0 && (
                              <div
                                style={{
                                  margin: "4px 20px 12px",
                                  padding: "10px 12px",
                                  background: "rgba(200,169,122,.05)",
                                  border: "1px solid rgba(200,169,122,.2)",
                                  borderRadius: 8,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 10,
                                    letterSpacing: ".14em",
                                    textTransform: "uppercase",
                                    color: "var(--accent)",
                                    fontFamily: "DM Sans, sans-serif",
                                    marginBottom: 8,
                                    fontWeight: 500,
                                  }}
                                >
                                  OPTIONS · 追加オプション
                                </div>
                                {plan.options.map((opt, oi) => {
                                  const fmt = formatFeeItem(opt);
                                  const last = oi === (plan.options?.length ?? 0) - 1;
                                  return (
                                    <div
                                      key={oi}
                                      style={{
                                        padding: "8px 0",
                                        borderBottom: last ? "none" : "1px dashed rgba(200,169,122,.18)",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "flex-start",
                                          gap: 12,
                                        }}
                                      >
                                        <span style={{ fontSize: 12, color: "var(--ink)", flex: 1 }}>{opt.label || "（無題）"}</span>
                                        <span
                                          style={{
                                            fontFamily: "DM Sans, sans-serif",
                                            fontSize: 13,
                                            color: "var(--ink)",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {fmt.main}
                                          {fmt.suffix && (
                                            <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: 2 }}>
                                              {fmt.suffix}
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                      {opt.note && (
                                        <p style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.7, marginTop: 3, whiteSpace: "pre-line" }}>
                                          {opt.note}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

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

                        {/* よかった点タグ（投稿者が選択したもの） */}
                        {Array.isArray(review.goodTags) && review.goodTags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                            {review.goodTags.map((tag: string) => (
                              <span
                                key={tag}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 16,
                                  fontSize: 11,
                                  color: "var(--accent)",
                                  background: "var(--adim, rgba(200,169,122,.12))",
                                  border: "1px solid var(--light)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* フッター: 投稿者 */}
                        <div className="rv-footer">
                          <span className="rv-author">{review.author}</span>
                        </div>

                        {/* 相談所（カウンセラー）からの返信：マーク → タップで展開 */}
                        {review.reply && (
                          <ReviewReply counselorName={counselor.name} reply={review.reply} />
                        )}

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
                    {/* キャンセルポリシー（counselor → agency → デフォルト の順でフォールバック） */}
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 12,
                        color: "var(--muted)",
                        lineHeight: 1.7,
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: 2 }}
                        aria-hidden="true"
                      >
                        <circle cx="7" cy="7" r="6" stroke="var(--muted)" strokeWidth="1.2" />
                        <path
                          d="M7 6v4M7 4.5v.5"
                          stroke="var(--muted)"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      {effectiveCancelPolicy}
                    </p>
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
