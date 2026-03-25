import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
   ページ
──────────────────────────────────────────────────────────── */
export default async function CounselorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const counselor = counselors[id as keyof typeof counselors];
  if (!counselor) notFound();

  const counselorReviews = reviews.filter((r) => r.counselorId === id);
  const avgRating =
    counselorReviews.reduce((sum, r) => sum + r.rating, 0) /
    counselorReviews.length;

  return (
    <>
      <Header />

      <main className="pt-16">
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

              <div className="d-agency-badge">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1L1 2.5v3c0 2.5 1.71 4.84 4 5.5 2.29-.66 4-3 4-5.5v-3L5 1z"
                    stroke="var(--accent)" strokeWidth=".9" fill="rgba(200,169,122,.15)" />
                </svg>
                {counselor.agency}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                <div className="d-avatar">
                  {counselor.photoUrl ? (
                    <img src={counselor.photoUrl} alt={counselor.name} />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="15" r="8" fill="#C8A97A" opacity=".6" />
                      <path d="M4 38c0-8.837 7.163-16 16-16s16 7.163 16 16"
                        stroke="#C8A97A" strokeWidth="1.5" fill="none" opacity=".4" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="d-name">{counselor.name}</div>
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
                        fill={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(255,255,255,.18)"}
                        stroke={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(255,255,255,.18)"}
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
                      stroke="rgba(255,255,255,.55)"
                      strokeWidth="1.1"
                      fill="rgba(255,255,255,.06)"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 4.8h6M3.5 6.6h4"
                      stroke="rgba(255,255,255,.4)"
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

              <div className="d-stats">
                <div className="d-stat-item">
                  <div className="d-stat-num">{counselor.successCount}</div>
                  <div className="d-stat-label">成婚実績</div>
                </div>
                <div className="d-stat-item">
                  <div className="d-stat-num">{counselor.yearsExp}</div>
                  <div className="d-stat-label">経験年数</div>
                </div>
              </div>
            </div>

            {/* 右: 予約カード（PCのみ） */}
            <div className="d-book-card">
              <div className="d-book-card-title">初回面談を予約する</div>
              <div className="d-book-card-sub">次の空き: {counselor.nextAvailable}</div>
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
              <p className="d-book-note">当日キャンセル可 · 登録不要</p>
            </div>

          </div>
        </div>

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
                    <div className="d-profile-item">
                      <div className="d-profile-key">専門分野</div>
                      <div className="d-profile-val">{counselor.specialties.join(" · ")}</div>
                    </div>
                    <div className="d-profile-item">
                      <div className="d-profile-key">エリア</div>
                      <div className="d-profile-val">{counselor.area}</div>
                    </div>
                    <div className="d-profile-item">
                      <div className="d-profile-key">経験年数</div>
                      <div className="d-profile-val">{counselor.yearsExp}年</div>
                    </div>
                    <div className="d-profile-item">
                      <div className="d-profile-key">成婚実績</div>
                      <div className="d-profile-val">{counselor.successCount}組</div>
                    </div>
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
                  <p className="pricing-note">{counselor.pricing.note}</p>
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
                      <div className="flex-1 space-y-2 w-full">
                        <RatingBar label="話しやすさ" value={4.9} />
                        <RatingBar label="専門知識" value={4.8} />
                        <RatingBar label="提案力" value={4.7} />
                        <RatingBar label="サポート" value={4.9} />
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-4 pt-4 border-t border-light">
                      ※ ふたりへ経由で面談した方のみ投稿できます
                    </p>
                  </div>

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

              </div>

              {/* ── 右カラム: スティッキーサイドバー ── */}
              <aside style={{ alignSelf: "start", position: "sticky", top: "72px" }}>

                {/* 予約カード */}
                <div
                  className="bg-white rounded-2xl border border-light overflow-hidden"
                  style={{ marginBottom: 20 }}
                >
                  <div style={{ padding: "24px 24px 0" }}>
                    <p className="text-xs text-muted mb-2">次の空き枠</p>
                    <p
                      className="text-sm text-ink mb-5"
                      style={{ fontFamily: "var(--font-mincho)" }}
                    >
                      {counselor.nextAvailable}
                    </p>
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
                    <p className="cta-book-main-note">当日キャンセル可 · 登録不要 · 完全無料</p>
                  </div>
                </div>

                {/* 相談所情報カード */}
                <div className="bg-white rounded-2xl border border-light p-6">
                  <p
                    className="text-xs text-muted uppercase tracking-wider mb-4"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    所属相談所
                  </p>
                  <p
                    className="text-base text-ink mb-2"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    {counselor.agency}
                  </p>
                  <p className="text-xs text-muted flex items-start gap-1.5 mb-4 leading-relaxed">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginTop: 2, flexShrink: 0 }}>
                      <path d="M6 1C3.8 1 2 2.8 2 5c0 3 4 6 4 6s4-3 4-6c0-2.2-1.8-4-4-4z" />
                      <circle cx="6" cy="5" r="1.5" />
                    </svg>
                    {counselor.address}
                  </p>
                  <Link
                    href={`/shops/${counselor.agencyId}`}
                    className="text-xs text-accent hover:opacity-70 transition-opacity flex items-center gap-1"
                  >
                    相談所の詳細を見る
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

              </aside>

            </div>
          </div>
        </div>
      </main>

      {/* モバイル用固定フッターCTA */}
      <div className="cta-mobile-bar">
        <div style={{ fontSize: 11, color: "var(--mid)", marginBottom: 2 }}>
          次の空き: {counselor.nextAvailable}
        </div>
        <Link href={`/booking/${counselor.id}`} className="cta-mobile-btn">
          無料面談を予約する — 完全無料
        </Link>
      </div>

      <Footer />
    </>
  );
}
