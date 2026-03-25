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
            サービスの特徴
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">
                Why futarini
              </p>
              <h2
                className="text-3xl md:text-4xl text-ink"
                style={{ fontFamily: "var(--font-mincho)" }}
              >
                ふたりへが選ばれる理由
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "面談者だけの\nリアルな口コミ",
                  desc: "ふたりへ経由で面談した方のみが投稿できる仕組み。広告ではなく、実際に体験した人の声だけを集めています。",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                      <path d="M14 3C7.9 3 3 7.9 3 14s4.9 11 11 11 11-4.9 11-11S20.1 3 14 3z" />
                      <path d="M10 13l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  num: "02",
                  title: "カウンセラー個人を\n指名して予約",
                  desc: "相談所単位ではなく、カウンセラー個人のプロフィールと口コミを見て比較。気に入った方を直接予約できます。",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                      <circle cx="14" cy="10" r="5" />
                      <path d="M4 24c0-5.5 4.5-10 10-10s10 4.5 10 10" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  num: "03",
                  title: "完全無料で\n何度でも相談",
                  desc: "ユーザー登録・面談予約・口コミ投稿はすべて無料。あなたに合うカウンセラーが見つかるまで、じっくり探せます。",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                      <circle cx="14" cy="14" r="10" />
                      <path d="M14 8v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div
                  key={feature.num}
                  className="group p-8 rounded-2xl border border-light hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <span
                      className="text-3xl text-light leading-none select-none"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {feature.num}
                    </span>
                    <div className="mt-1">{feature.icon}</div>
                  </div>
                  <h3
                    className="text-lg text-ink mb-3 whitespace-pre-line leading-snug"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-mid leading-relaxed">{feature.desc}</p>
                </div>
              ))}
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
            CTA
        ═══════════════════════════════════════════════════ */}
        <section className="cta-sec">
          <div className="cta-o1" />
          <div className="cta-o2" />
          <div className="cta-inner">
            <div className="cta-ey">start from here</div>
            <h2 className="cta-h">
              いいカウンセラーに<br />出会えると、変わります。
              <span className="cta-en">Good counselor. Good start.</span>
            </h2>
            <p className="cta-d">まずは口コミを読むだけでも。予約は、準備できてからで大丈夫。</p>
            <div className="cta-btns">
              <Link href="#counselors" className="btn btn-wh">相談所を探す</Link>
              <Link href="#places" className="btn btn-gl">お見合い・デートのお店</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
