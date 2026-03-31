import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ────────────────────────────────────────────────────────────
   モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */
const featuredCounselors = [
  {
    id: "1",
    name: "田中 美咲",
    agency: "ブライダルサロン エクラン",
    specialties: ["初婚", "30代", "キャリア女性"],
    rating: 4.9,
    reviewCount: 47,
    yearsExp: 8,
    intro: "一人ひとりの価値観を大切に、焦らず本当のご縁を一緒に探します。",
  },
  {
    id: "2",
    name: "佐藤 あかり",
    agency: "マリーナ結婚相談所",
    specialties: ["再婚", "バツあり", "子持ち"],
    rating: 4.8,
    reviewCount: 32,
    yearsExp: 12,
    intro: "再婚・シングルの方に寄り添い、新しい幸せへの第一歩をサポートします。",
  },
  {
    id: "3",
    name: "山本 花子",
    agency: "ローズブライダル",
    specialties: ["20代", "初婚", "地方在住"],
    rating: 4.7,
    reviewCount: 58,
    yearsExp: 5,
    intro: "婚活が初めての方でも安心。一緒に理想のパートナーを見つけましょう。",
  },
];

const recentReviews = [
  {
    id: "1",
    counselorName: "田中 美咲",
    rating: 5,
    text: "面談前は緊張していましたが、田中さんの温かい雰囲気ですぐにリラックスできました。私の話をしっかり聞いてくれて、押しつけがましさが全くなかったのが印象的でした。",
    author: "30代・女性",
    date: "2024年11月",
  },
  {
    id: "2",
    counselorName: "佐藤 あかり",
    rating: 5,
    text: "バツイチということで不安でしたが、佐藤さんは経験談も交えながら現実的なアドバイスをくださいました。同じ境遇の方を多く支援されているので、心強かったです。",
    author: "30代・女性",
    date: "2024年10月",
  },
  {
    id: "3",
    counselorName: "山本 花子",
    rating: 4,
    text: "婚活自体が初めてで何もわからない状態でしたが、流れを丁寧に説明してもらえました。焦らせることなく進めてもらえたのが一番良かったです。",
    author: "20代・女性",
    date: "2024年10月",
  },
];

/* ────────────────────────────────────────────────────────────
   StarRating コンポーネント
──────────────────────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
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
   トップページ
──────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* ═══════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pale pt-16">
          {/* 背景装飾 */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--rose) 0%, transparent 40%)",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs tracking-[0.3em] text-muted uppercase mb-8">
              Marriage Counselor Review &amp; Booking
            </p>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl leading-tight tracking-wide text-ink mb-8"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              出会いの前に、
              <br />
              <span style={{ color: "var(--accent)" }}>カウンセラー</span>を選ぶ。
            </h1>

            <p className="text-base md:text-lg text-mid leading-relaxed max-w-xl mx-auto mb-12">
              面談した人だけが書けるリアルな口コミ。
              <br />
              あなたにぴったりのカウンセラーを見つけて、
              <br className="hidden md:block" />
              今すぐ無料面談を予約しましょう。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/counselors"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-full text-sm tracking-wide hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: "0 8px 32px rgba(200,169,122,0.3)" }}
              >
                カウンセラーを探す
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border border-light text-mid rounded-full text-sm tracking-wide hover:border-ink hover:text-ink transition-all duration-300"
              >
                サービスについて
              </Link>
            </div>

            {/* 実績 */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-12">
              {[
                { value: "2,400+", label: "登録カウンセラー" },
                { value: "8,700+", label: "口コミ件数" },
                { value: "98%", label: "満足度" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-3xl md:text-4xl text-ink mb-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* スクロールインジケーター */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted">
            <p className="text-xs tracking-[0.2em]">SCROLL</p>
            <div className="w-px h-12 bg-light relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-6 bg-accent animate-[scrollLine_2s_ease-in-out_infinite]"
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            Why Futarini
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">
                WHY FUTARINI
              </p>
              <h2
                className="text-ink"
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: "clamp(28px, 4vw, 48px)",
                }}
              >
                ふたりへが選ばれる理由
              </h2>
            </div>

            {/* カード 01 */}
            <div
              style={{
                background: "white",
                border: "1px solid var(--border, var(--light))",
                borderRadius: "16px",
                padding: "28px 32px",
                marginBottom: "16px",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "48px",
                    color: "var(--accent)",
                    opacity: 0.25,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  01
                </span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L3 7v9c0 6.3 4.5 12.2 11 13.9 6.5-1.7 11-7.6 11-13.9V7L14 2z" stroke="#C8A97A" strokeWidth="1.3" fill="rgba(200,169,122,.08)"/>
                  <path d="M9 14l4 4 7-8" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3
                className="text-ink mb-3"
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                面談者だけのリアルな口コミ
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "var(--mid)",
                  lineHeight: 2,
                }}
              >
                ふたりへ経由で面談した方のみが投稿できる仕組み。
                広告ではなく、実際に体験した人の声だけを集めています。
              </p>
            </div>

            {/* カード 02 */}
            <div
              style={{
                background: "white",
                border: "1px solid var(--border, var(--light))",
                borderRadius: "16px",
                padding: "28px 32px",
                marginBottom: "16px",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "48px",
                    color: "var(--accent)",
                    opacity: 0.25,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  02
                </span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="5" stroke="#C8A97A" strokeWidth="1.3" fill="rgba(200,169,122,.08)"/>
                  <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#C8A97A" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <h3
                className="text-ink mb-3"
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                カウンセラー個人を指名して予約
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "var(--mid)",
                  lineHeight: 2,
                }}
              >
                相談所単位ではなく、カウンセラー個人のプロフィールと
                口コミを見て比較。気に入った方を直接予約できます。
              </p>
            </div>

            {/* カード 03 */}
            <div
              style={{
                background: "white",
                border: "1px solid var(--border, var(--light))",
                borderRadius: "16px",
                padding: "28px 32px",
                marginBottom: "16px",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "48px",
                    color: "var(--accent)",
                    opacity: 0.25,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  03
                </span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="#C8A97A" strokeWidth="1.3" fill="rgba(200,169,122,.08)"/>
                  <path d="M14 8v6l4 2" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3
                className="text-ink mb-3"
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                完全無料で何度でも相談
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "var(--mid)",
                  lineHeight: 2,
                }}
              >
                ユーザー登録・面談予約・口コミ投稿はすべて無料。
                あなたに合うカウンセラーが見つかるまで、じっくり探せます。
              </p>
            </div>

            {/* ボタン */}
            <div className="text-center mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border border-light text-mid rounded-full text-sm tracking-wide hover:border-ink hover:text-ink transition-all duration-300"
              >
                サービスについてもっと知りたい
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            注目のカウンセラー
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-pale">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">
                  Featured Counselors
                </p>
                <h2
                  className="text-3xl md:text-4xl text-ink"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  注目のカウンセラー
                </h2>
              </div>
              <Link
                href="/counselors"
                className="hidden md:flex items-center gap-1 text-sm text-mid hover:text-ink transition-colors duration-200"
              >
                すべて見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7h8M7 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCounselors.map((counselor) => (
                <Link
                  key={counselor.id}
                  href={`/counselors/${counselor.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-light hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* アバタープレースホルダー */}
                  <div className="aspect-[4/3] bg-pale flex items-center justify-center relative">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-3xl text-white"
                      style={{ background: "var(--accent)", fontFamily: "var(--font-mincho)" }}
                    >
                      {counselor.name.slice(-1)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className="text-lg text-ink"
                          style={{ fontFamily: "var(--font-mincho)" }}
                        >
                          {counselor.name}
                        </h3>
                        <p className="text-xs text-muted mt-0.5">{counselor.agency}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-0.5">
                          <StarRating rating={Math.round(counselor.rating)} />
                          <span className="text-xs font-medium text-ink">{counselor.rating}</span>
                        </div>
                        <p className="text-xs text-muted">{counselor.reviewCount}件</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-3">
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

                    <p className="text-xs text-mid leading-relaxed line-clamp-2">
                      {counselor.intro}
                    </p>

                    <div className="mt-4 pt-4 border-t border-light flex items-center justify-between">
                      <span className="text-xs text-muted">
                        経験 {counselor.yearsExp}年
                      </span>
                      <span className="text-xs text-accent flex items-center gap-1">
                        面談を予約する
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/counselors"
                className="inline-flex items-center gap-2 px-6 py-3 border border-light rounded-full text-sm text-mid hover:border-ink hover:text-ink transition-all duration-200"
              >
                すべてのカウンセラーを見る
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            口コミ
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">
                Real Reviews
              </p>
              <h2
                className="text-3xl md:text-4xl text-ink mb-4"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                面談者のリアルな声
              </h2>
              <p className="text-sm text-mid">
                すべて実際に面談を経験した方からの口コミです
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-pale rounded-2xl p-7 border border-light/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted">{review.date}</span>
                  </div>

                  <p className="text-sm text-ink leading-relaxed mb-5">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-light">
                    <div>
                      <p className="text-xs text-muted">カウンセラー</p>
                      <p
                        className="text-sm text-ink"
                        style={{ fontFamily: "var(--font-mincho)" }}
                      >
                        {review.counselorName}
                      </p>
                    </div>
                    <p className="text-xs text-muted">{review.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ご利用の流れ
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-ink text-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">
                How it works
              </p>
              <h2
                className="text-3xl md:text-4xl text-white"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                ご利用の流れ
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "カウンセラーを探す",
                  desc: "専門分野・エリア・口コミ評価から、あなたに合うカウンセラーを比較できます。",
                },
                {
                  step: "02",
                  title: "無料面談を予約する",
                  desc: "気に入ったカウンセラーのカレンダーから、空いている日時を選んで予約。リアルタイムで空き状況を確認できます。",
                },
                {
                  step: "03",
                  title: "面談を受ける",
                  desc: "相談所に訪問して面談。ふたりへ経由の予約であることを伝えるだけでOKです。",
                },
                {
                  step: "04",
                  title: "口コミを投稿する",
                  desc: "面談後に専用URLと認証コードが届きます。リアルな感想を書いて、次の方の婚活をサポートしましょう。",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-6 p-6 rounded-2xl border border-white/10 hover:border-accent/30 transition-colors duration-300"
                >
                  <span
                    className="text-4xl text-white/10 leading-none shrink-0 select-none"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3
                      className="text-lg text-white mb-2"
                      style={{ fontFamily: "var(--font-mincho)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-pale">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p
              className="text-sm text-muted tracking-widest mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              futarini
            </p>
            <h2
              className="text-3xl md:text-5xl text-ink leading-tight mb-6"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              今まさに、関係を
              <br />
              作っているふたりへ。
            </h2>
            <p className="text-sm md:text-base text-mid leading-relaxed mb-12">
              婚活の最初の一歩は、信頼できるカウンセラーとの出会いから。
              <br />
              リアルな口コミをもとに、あなたにぴったりの相談所を見つけましょう。
            </p>
            <Link
              href="/counselors"
              className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-white rounded-full text-sm tracking-wide hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: "0 12px 40px rgba(200,169,122,0.35)" }}
            >
              無料で始める
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p className="mt-5 text-xs text-muted">
              登録無料・面談予約無料・口コミ投稿無料
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
