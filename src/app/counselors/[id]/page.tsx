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
    bio: "大学卒業後、IT企業で5年間働いた後、結婚相談所のカウンセラーに転身。自身の婚活経験を活かし、特にキャリア女性の婚活をサポートしています。\n\n「婚活は自分を知ること」をモットーに、価値観の整理から始めて、本当にご縁のある方との出会いをお手伝いします。焦らず、でも着実に。一人ひとりに向き合った丁寧なサポートが強みです。",
    message: "初めての婚活で不安な方も、何度かチャレンジしてうまくいかない方も、まずは気軽にお話しに来てください。あなたのペースに合わせて、一緒に考えていきましょう。",
    qualifications: ["婚活カウンセラー資格", "メンタルヘルス・マネジメント検定"],
  },
};

const reviews = [
  {
    id: "1",
    counselorId: "1",
    rating: 5,
    title: "初めての婚活で不安でしたが、安心して相談できました",
    text: "婚活が初めてで何から始めていいか全くわからない状態で面談に伺いました。田中さんは私の話をじっくり聞いてくださり、婚活の流れや注意点を丁寧に説明してくださいました。押しつけがましさが全くなく、「まずは自分の軸を作りましょう」という姿勢がとても好印象でした。面談後は次のステップが明確になり、前向きな気持ちで帰路につけました。",
    author: "30代・女性",
    date: "2024年11月",
    verified: true,
  },
  {
    id: "2",
    counselorId: "1",
    rating: 5,
    title: "価値観の整理から丁寧にサポートしてもらえた",
    text: "転職活動と並行しての婚活で、なかなか優先順位がつけられずにいました。田中さんは私のライフプラン全体を一緒に考えてくださり、婚活と仕事の両立についても具体的なアドバイスをいただけました。話すうちに自分が何を大切にしているかがクリアになっていくのを感じました。",
    author: "30代・女性",
    date: "2024年10月",
    verified: true,
  },
  {
    id: "3",
    counselorId: "1",
    rating: 4,
    title: "話しやすい雰囲気で本音が言えた",
    text: "他の相談所でうまくいかなかった経験があり、少し警戒しながら伺いましたが、田中さんはとても話しやすい方で、気づけば本音で話していました。前の相談所でうまくいかなかった理由も一緒に考えてくださり、次に進む勇気をもらえました。",
    author: "30代・女性",
    date: "2024年10月",
    verified: true,
  },
  {
    id: "4",
    counselorId: "1",
    rating: 5,
    title: "具体的なアドバイスが役に立った",
    text: "プロフィール写真の選び方から、お見合いでの会話のコツまで、具体的なアドバイスをたくさんいただきました。抽象的なことではなく「こういう場合はこうする」という実践的な内容だったので、すぐに使えそうでした。また相談したいと思います。",
    author: "20代・女性",
    date: "2024年9月",
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
        {/* ─── パンくずリスト ─── */}
        <div className="bg-pale border-b border-light">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-ink transition-colors">
              トップ
            </Link>
            <span>/</span>
            <Link href="/counselors" className="hover:text-ink transition-colors">
              カウンセラー一覧
            </Link>
            <span>/</span>
            <span className="text-ink">{counselor.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ─────────────────────────────────────────────────
                左カラム: プロフィール（PC時スティッキー）
            ───────────────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-5">
                {/* プロフィールカード */}
                <div className="bg-white rounded-2xl border border-light overflow-hidden">
                  {/* アバター */}
                  <div className="aspect-square bg-pale flex items-center justify-center">
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center text-5xl text-white"
                      style={{ background: "var(--accent)", fontFamily: "var(--font-mincho)" }}
                    >
                      {counselor.name.slice(-1)}
                    </div>
                  </div>

                  <div className="p-6">
                    <h1
                      className="text-2xl text-ink mb-0.5"
                      style={{ fontFamily: "var(--font-mincho)" }}
                    >
                      {counselor.name}
                    </h1>
                    <p className="text-xs text-muted mb-1">{counselor.nameKana}</p>
                    <p className="text-sm text-mid mb-4">{counselor.agency}</p>

                    {/* 評価 */}
                    <div className="flex items-center gap-2 mb-5 pb-5 border-b border-light">
                      <StarRating rating={Math.round(avgRating)} size={16} />
                      <span className="text-lg font-medium text-ink">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted">
                        ({counselorReviews.length}件)
                      </span>
                    </div>

                    {/* 数字 */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { value: `${counselor.yearsExp}年`, label: "経験年数" },
                        { value: `${counselor.successCount}組`, label: "成婚実績" },
                        { value: "無料", label: "面談料金" },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p
                            className="text-base text-ink"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* エリア */}
                    <div className="flex items-center gap-2 text-sm text-mid mb-5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5S11.5 9.5 11.5 6c0-2.5-2-4.5-4.5-4.5z" />
                        <circle cx="7" cy="6" r="1.5" />
                      </svg>
                      {counselor.area}
                    </div>

                    {/* 専門タグ */}
                    <div className="flex flex-wrap gap-1.5">
                      {counselor.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded-full border text-accent"
                          style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 予約CTA */}
                <div className="bg-pale rounded-2xl border border-light p-5">
                  <p className="text-xs text-muted mb-3">次の空き枠</p>
                  <p
                    className="text-sm text-ink mb-4"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    12月10日（火）14:00〜
                  </p>
                  <Link
                    href={`/booking/${counselor.id}`}
                    className="block w-full text-center px-6 py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200"
                    style={{ boxShadow: "0 6px 20px rgba(200,169,122,0.3)" }}
                  >
                    無料面談を予約する
                  </Link>
                  <p className="text-xs text-muted text-center mt-3">
                    完全無料・当日キャンセル可
                  </p>
                </div>
              </div>
            </aside>

            {/* ─────────────────────────────────────────────────
                右カラム: 詳細情報
            ───────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">
              {/* カウンセラーからのメッセージ */}
              <section>
                <h2
                  className="text-lg text-ink mb-4 pb-3 border-b border-light"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  カウンセラーからのメッセージ
                </h2>
                <div
                  className="bg-pale rounded-2xl p-6 border-l-4 text-sm text-mid leading-relaxed"
                  style={{ borderLeftColor: "var(--accent)" }}
                >
                  <p className="italic">&ldquo;{counselor.message}&rdquo;</p>
                </div>
              </section>

              {/* プロフィール */}
              <section>
                <h2
                  className="text-lg text-ink mb-4 pb-3 border-b border-light"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  プロフィール
                </h2>
                <div className="space-y-4">
                  {counselor.bio.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-sm text-mid leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {counselor.qualifications.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-light">
                    <p className="text-xs text-muted uppercase tracking-wide mb-3">
                      資格・認定
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {counselor.qualifications.map((q) => (
                        <span
                          key={q}
                          className="text-xs px-3 py-1.5 rounded-full bg-pale border border-light text-mid"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 口コミ */}
              <section>
                <div className="flex items-end justify-between mb-4 pb-3 border-b border-light">
                  <h2
                    className="text-lg text-ink"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    口コミ・評価
                  </h2>
                  <span className="text-xs text-muted">
                    {counselorReviews.length}件
                  </span>
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
                      <p className="text-xs text-muted mt-1">
                        {counselorReviews.length}件の評価
                      </p>
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
                <div className="space-y-4">
                  {counselorReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-2xl p-6 border border-light"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <StarRating rating={review.rating} />
                          <h3 className="text-sm font-medium text-ink mt-2">
                            {review.title}
                          </h3>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-xs text-muted">{review.date}</p>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-xs text-green mt-1">
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 00-.7.7l2.1 2.1a.5.5 0 00.7 0l3.2-3.2a.5.5 0 00-.7-.6z" />
                              </svg>
                              面談済み
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-mid leading-relaxed">
                        {review.text}
                      </p>
                      <p className="text-xs text-muted mt-3">{review.author}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 相談所情報 */}
              <section>
                <h2
                  className="text-lg text-ink mb-4 pb-3 border-b border-light"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  所属相談所
                </h2>
                <div className="bg-pale rounded-2xl p-6 border border-light">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className="text-base text-ink mb-1"
                        style={{ fontFamily: "var(--font-mincho)" }}
                      >
                        {counselor.agency}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 1C3.8 1 2 2.8 2 5c0 3 4 6 4 6s4-3 4-6c0-2.2-1.8-4-4-4z" />
                          <circle cx="6" cy="5" r="1.5" />
                        </svg>
                        {counselor.address}
                      </p>
                    </div>
                    <Link
                      href={`/shops/${counselor.agencyId}`}
                      className="text-xs text-accent hover:opacity-70 transition-opacity flex items-center gap-1 shrink-0"
                    >
                      詳細を見る
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* モバイル用固定フッターCTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-light p-4">
        <Link
          href={`/booking/${counselor.id}`}
          className="block w-full text-center px-6 py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200"
        >
          無料面談を予約する
        </Link>
      </div>

      <Footer />
    </>
  );
}
