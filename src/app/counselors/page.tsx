import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ────────────────────────────────────────────────────────────
   モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */
const counselors = [
  {
    id: "1",
    name: "田中 美咲",
    nameKana: "たなか みさき",
    agency: "ブライダルサロン エクラン",
    area: "東京・渋谷",
    specialties: ["初婚", "30代", "キャリア女性"],
    rating: 4.9,
    reviewCount: 47,
    yearsExp: 8,
    intro: "一人ひとりの価値観を大切に、焦らず本当のご縁を一緒に探します。",
    nextAvailable: "2024/12/10",
    fee: "無料",
  },
  {
    id: "2",
    name: "佐藤 あかり",
    nameKana: "さとう あかり",
    agency: "マリーナ結婚相談所",
    area: "東京・銀座",
    specialties: ["再婚", "バツあり", "子持ち"],
    rating: 4.8,
    reviewCount: 32,
    yearsExp: 12,
    intro: "再婚・シングルの方に寄り添い、新しい幸せへの第一歩をサポートします。",
    nextAvailable: "2024/12/08",
    fee: "無料",
  },
  {
    id: "3",
    name: "山本 花子",
    nameKana: "やまもと はなこ",
    agency: "ローズブライダル",
    area: "神奈川・横浜",
    specialties: ["20代", "初婚", "地方在住"],
    rating: 4.7,
    reviewCount: 58,
    yearsExp: 5,
    intro: "婚活が初めての方でも安心。一緒に理想のパートナーを見つけましょう。",
    nextAvailable: "2024/12/12",
    fee: "無料",
  },
  {
    id: "4",
    name: "鈴木 恵",
    nameKana: "すずき めぐみ",
    agency: "プレシャスマリッジ",
    area: "大阪・梅田",
    specialties: ["30代", "40代", "晩婚"],
    rating: 4.8,
    reviewCount: 41,
    yearsExp: 10,
    intro: "年齢を気にせず婚活を楽しんでほしい。あなたのペースに合わせてサポートします。",
    nextAvailable: "2024/12/09",
    fee: "無料",
  },
  {
    id: "5",
    name: "伊藤 由美",
    nameKana: "いとう ゆみ",
    agency: "ハーモニーブライダル",
    area: "愛知・名古屋",
    specialties: ["公務員・教員", "転勤族", "地元重視"],
    rating: 4.6,
    reviewCount: 29,
    yearsExp: 7,
    intro: "地元・名古屋での婚活を全力サポート。安定職の方のお見合い実績豊富です。",
    nextAvailable: "2024/12/11",
    fee: "無料",
  },
  {
    id: "6",
    name: "中村 涼子",
    nameKana: "なかむら りょうこ",
    agency: "ルシェルブライダル",
    area: "東京・新宿",
    specialties: ["海外在住経験", "バイリンガル", "外国籍歓迎"],
    rating: 4.9,
    reviewCount: 22,
    yearsExp: 6,
    intro: "海外在住・帰国子女・外国籍の方の婚活を専門にサポートしています。",
    nextAvailable: "2024/12/13",
    fee: "無料",
  },
];

const areas = ["すべて", "東京", "神奈川", "大阪", "愛知", "その他"];
const specialtyOptions = [
  "すべて",
  "初婚",
  "再婚",
  "20代",
  "30代",
  "40代",
  "キャリア女性",
];

/* ────────────────────────────────────────────────────────────
   StarRating
──────────────────────────────────────────────────────────── */
function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
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

/* ────────────────────────────────────────────────────────────
   カウンセラーカード
──────────────────────────────────────────────────────────── */
function CounselorCard({ counselor }: { counselor: (typeof counselors)[0] }) {
  return (
    <Link
      href={`/counselors/${counselor.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-light hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* アバター */}
      <div className="aspect-[3/2] bg-pale flex items-center justify-center relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white"
          style={{ background: "var(--accent)", fontFamily: "var(--font-mincho)" }}
        >
          {counselor.name.slice(-1)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        {/* エリアバッジ */}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/80 text-mid backdrop-blur-sm">
            {counselor.area}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* 名前・評価 */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3
              className="text-base text-ink leading-tight"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              {counselor.name}
            </h3>
            <p className="text-xs text-muted mt-0.5">{counselor.nameKana}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <StarRating rating={Math.round(counselor.rating)} />
              <span className="text-xs font-medium text-ink">{counselor.rating}</span>
            </div>
            <p className="text-xs text-muted">{counselor.reviewCount}件</p>
          </div>
        </div>

        {/* 相談所 */}
        <p className="text-xs text-muted mb-3">{counselor.agency}</p>

        {/* 専門タグ */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {counselor.specialties.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-0.5 rounded-full border text-accent"
              style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* 紹介文 */}
        <p className="text-xs text-mid leading-relaxed flex-1 line-clamp-2">
          {counselor.intro}
        </p>

        {/* フッター */}
        <div className="mt-4 pt-4 border-t border-light flex items-center justify-between">
          <div className="text-xs text-muted">
            経験 <span className="text-ink">{counselor.yearsExp}年</span>
            <span className="mx-2">·</span>
            次の空き <span className="text-ink">{counselor.nextAvailable}</span>
          </div>
          <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
            予約する
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
export default function CounselorsPage() {
  return (
    <>
      <Header />

      <main className="pt-16">
        {/* ページヘッダー */}
        <section className="bg-pale py-14 md:py-20 border-b border-light">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">
              Counselors
            </p>
            <h1
              className="text-3xl md:text-4xl text-ink mb-3"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              カウンセラーを探す
            </h1>
            <p className="text-sm text-mid">
              {counselors.length}名のカウンセラーが登録中
            </p>
          </div>
        </section>

        {/* 検索・フィルター */}
        <section className="bg-white border-b border-light sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* テキスト検索 */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="M11 11l2.5 2.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="カウンセラー名・相談所名で検索"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 placeholder:text-muted"
                />
              </div>

              {/* エリアフィルター */}
              <select className="px-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink min-w-[130px]">
                {areas.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>

              {/* 専門フィルター */}
              <select className="px-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink min-w-[150px]">
                {specialtyOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {/* 並び替え */}
              <select className="px-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink min-w-[140px]">
                <option>口コミ評価が高い順</option>
                <option>口コミ件数が多い順</option>
                <option>経験年数が長い順</option>
                <option>空き枠が近い順</option>
              </select>
            </div>
          </div>
        </section>

        {/* カウンセラー一覧 */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs text-muted mb-6">
              {counselors.length}件表示中
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {counselors.map((c) => (
                <CounselorCard key={c.id} counselor={c} />
              ))}
            </div>

            {/* ページネーション */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-9 h-9 rounded-full text-sm transition-all duration-200 ${
                    page === 1
                      ? "bg-accent text-white"
                      : "border border-light text-mid hover:border-ink hover:text-ink"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-9 h-9 rounded-full border border-light text-mid hover:border-ink hover:text-ink text-sm transition-all duration-200">
                →
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
