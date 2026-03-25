import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";

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
        {/* スクロールrevealオブザーバー（クライアント） */}
        <RevealObserver />

        {/* ═══════════════════════════════════════════════════
            HERO — futarive-v4.html 準拠
        ═══════════════════════════════════════════════════ */}
        <section className="hero">
          {/* グリッドパターン背景 */}
          <div className="hero-grid" />

          {/* 左カラム */}
          <div className="hero-left">
            <div className="hero-tag">marriage counseling, reimagined</div>
            <h1 className="hero-h1">
              <span style={{ display: "block" }}>カウンセラーを見てから、</span>
              <span style={{ display: "block" }}>選べる結婚相談所。</span>
              <span className="hero-h1-en">The counselor comes first.</span>
            </h1>
            <p className="hero-sub">
              面談した人だけが書けるレビューと、担当者の顔・経歴が最初から見えるサービスです。<br /><br />
              お見合いやデートのお店情報も、ここで。<br />出会いから、ずっと先まで一緒にいます。
            </p>
            <div className="hero-actions">
              <Link href="/counselors" className="btn btn-dark">相談所を探す</Link>
              <Link href="/shops" className="btn btn-outline">お見合い・デートのお店</Link>
            </div>
            <p style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "12px" }}>✓ 無料で使えます・登録不要</p>
          </div>

          {/* 右カラム — フローティングカード */}
          <div className="hero-right">
            {/* fc-main: カウンセラーレビューカード */}
            <div className="fc fc-main">
              <div className="fc-p">
                <div className="fc-av">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="8" r="4" fill="#C8A97A" opacity=".6" />
                    <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#C8A97A" strokeWidth="1.2" fill="none" opacity=".4" />
                  </svg>
                </div>
                <div>
                  <div className="fc-nm">田中 美紀 カウンセラー</div>
                  <div className="fc-or">ブライダルハウス東京 · 銀座</div>
                </div>
                <div className="fc-vf">✓ 面談済み</div>
              </div>
              <div className="fc-stars">★★★★★</div>
              <p className="fc-txt">最初の相談で「この人なら任せられる」と思えました。押しつけがましくなく、でもちゃんと考えてくれている。</p>
            </div>

            {/* fc-stat: 統計カード */}
            <div className="fc fc-stat">
              <div className="fc-num">98%</div>
              <div className="fc-lbl">予約完了率</div>
              <div className="fc-bar">
                <div className="fc-fill" />
              </div>
            </div>

            {/* fc-scene: 婚活シーンカード */}
            <div className="fc fc-scene">
              <div className="scene-title">婚活の流れ、ぜんぶ</div>
              <div className="scene-tags">
                <span className="sc-tag hi">婚活準備（美容）</span>
                <span className="sc-tag hi">お見合いの場所</span>
                <span className="sc-tag">デート1回目・2回目</span>
                <span className="sc-tag">プロポーズ</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            MARQUEE — futarive-v4.html 準拠
        ═══════════════════════════════════════════════════ */}
        <div className="marquee-wrap">
          <div className="mi">
            {/* 2セット並べてシームレスループ */}
            {[0, 1].map((i) => (
              <span key={i} style={{ display: "contents" }}>
                <span className="mqi">面談済み口コミだけ<span className="mqd">·</span></span>
                <span className="mqi">カウンセラーの顔が見える<span className="mqd">·</span></span>
                <span className="mqi">予約まで完結<span className="mqd">·</span></span>
                <span className="mqi">関係を育てている2人のために<span className="mqd">·</span></span>
                <span className="mqi">デートにおすすめのお店<span className="mqd">·</span></span>
                <span className="mqi">プロポーズの場所を探す<span className="mqd">·</span></span>
                <span className="mqi">成婚後もふたりへ<span className="mqd">·</span></span>
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            VISION — futarive-v4.html 準拠
        ═══════════════════════════════════════════════════ */}
        <section className="vision-sec">
          <div className="vision-inner">
            <div className="vision-eyebrow">our belief</div>
            <p className="vision-quote reveal">
              世の中のレビューサイトは、<br />
              <em>関係が出来上がった人たちのため</em>にある。<br /><br />
              ふたりへは、<em>今まさに関係を作っている</em><br />あなたたちのためにある。
            </p>
            <p className="vision-sub reveal rd1">
              不安なまま相談所に飛び込まなくていい。お見合いの場所に迷わなくていい。そのそばに、ずっといます。
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            JOURNEY — ふたりの旅程 / futarive-v4.html 準拠
        ═══════════════════════════════════════════════════ */}
        <section className="journey-sec">
          <div className="journey-inner">
            <div className="sec-label reveal">what we offer</div>
            <h2 className="sec-h reveal">
              ふたりの旅程、ぜんぶ。
              <span className="sec-h-jp">出会いの準備から、ずっと先まで</span>
            </h2>
            <p className="sec-sub reveal">
              今は相談所とデート・婚活準備のお店から。ふたりの関係が育つにつれて、使える場所が広がっていきます。
            </p>

            {/* Phase タイムライン */}
            <div className="phase-row reveal">
              <div className="phase-item">
                <div className="phase-stage">Phase 1 — 今すぐ</div>
                <div className="phase-name">出会いの準備</div>
                <div className="phase-cats">
                  <div className="phase-cat launch">結婚相談所・カウンセラー</div>
                  <div className="phase-cat launch">婚活向け美容室</div>
                  <div className="phase-cat launch">ネイル・眉毛サロン</div>
                  <div className="phase-cat launch">フォトスタジオ</div>
                </div>
              </div>
              <div className="phase-item">
                <div className="phase-stage">Phase 2 — 近日</div>
                <div className="phase-name">出会い・デート</div>
                <div className="phase-cats">
                  <div className="phase-cat">お見合いのカフェ・ラウンジ</div>
                  <div className="phase-cat">デート1回目・2回目のお店</div>
                  <div className="phase-cat">ディナー・夜景スポット</div>
                  <div className="phase-cat">ドライブコース</div>
                </div>
                <div className="phase-soon">coming soon</div>
              </div>
              <div className="phase-item">
                <div className="phase-stage">Phase 3 — 将来</div>
                <div className="phase-name">大切な時</div>
                <div className="phase-cats">
                  <div className="phase-cat">プロポーズスポット</div>
                  <div className="phase-cat">婚約指輪</div>
                  <div className="phase-cat">前撮り・フォト婚</div>
                  <div className="phase-cat">ふたりの旅行先</div>
                </div>
                <div className="phase-soon">coming soon</div>
              </div>
              <div className="phase-item">
                <div className="phase-stage">Phase 4 — その先も</div>
                <div className="phase-name">共に生きる</div>
                <div className="phase-cats">
                  <div className="phase-cat">新居・インテリア</div>
                  <div className="phase-cat">夫婦でのレストラン</div>
                  <div className="phase-cat">記念日の宿</div>
                  <div className="phase-cat">ふたりの旅</div>
                </div>
                <div className="phase-soon">coming soon</div>
              </div>
            </div>

            {/* カテゴリカード 6枚 */}
            <div className="cat-grid reveal">

              {/* ct-1: 相談所・カウンセラー */}
              <div className="cat-card">
                <div className="cat-thumb ct-1">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="20" r="10" stroke="#C8A97A" strokeWidth="1.5" fill="rgba(200,169,122,.1)" />
                    <path d="M8 48c0-11.046 8.954-20 20-20s20 8.954 20 20" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".5" />
                  </svg>
                </div>
                <div className="cat-body">
                  <div className="cat-type">相談所・カウンセラー</div>
                  <div className="cat-name">担当者を見て、選ぶ</div>
                  <div className="cat-desc">面談した人だけが書けるレビューで、カウンセラーの人となりがわかる。</div>
                  <div className="cat-review-note crn-strict">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1L1 2.5v3c0 2.5 1.71 4.84 4 5.5 2.29-.66 4-3 4-5.5v-3L5 1z" stroke="#C8A97A" strokeWidth=".9" fill="rgba(200,169,122,.1)" />
                    </svg>
                    面談完了者のみ口コミ可
                  </div>
                </div>
              </div>

              {/* ct-2: カフェ・レストラン */}
              <div className="cat-card">
                <div className="cat-thumb ct-2">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <path d="M12 20h28l-3 22H15L12 20z" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.1)" strokeLinejoin="round" />
                    <path d="M40 24h4a4 4 0 010 8h-4" stroke="#7A9E87" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M20 14c0-3 4-3 4-6M28 14c0-3 4-3 4-6" stroke="#7A9E87" strokeWidth="1.3" strokeLinecap="round" opacity=".5" />
                  </svg>
                </div>
                <div className="cat-body">
                  <div className="cat-type">カフェ・レストラン</div>
                  <div className="cat-name">お見合い・デートのお店</div>
                  <div className="cat-desc">お見合いの場所選びから、デート1回目・2回目・記念日まで。シーンに合ったお店を口コミで選べる。</div>
                  <div className="cat-review-note crn-open">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l3 3 4-4" stroke="#7A9E87" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    利用後なら誰でも口コミ可
                  </div>
                </div>
              </div>

              {/* ct-3: ヘア・ネイル・眉 */}
              <div className="cat-card">
                <div className="cat-thumb ct-3">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <circle cx="24" cy="22" r="9" stroke="#B8906A" strokeWidth="1.5" fill="rgba(184,144,106,.1)" />
                    <circle cx="24" cy="22" r="4" stroke="#B8906A" strokeWidth="1.5" fill="none" opacity=".4" />
                    <path d="M30 28l10 10" stroke="#B8906A" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="cat-body">
                  <div className="cat-type">ヘア・ネイル・眉</div>
                  <div className="cat-name">婚活準備のビューティ</div>
                  <div className="cat-desc">「婚活で使いたい」と伝えやすいサロンだけを掲載。プロに整えてもらって自信を持って。</div>
                  <div className="cat-review-note crn-open">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l3 3 4-4" stroke="#7A9E87" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    利用後なら誰でも口コミ可
                  </div>
                </div>
              </div>

              {/* ct-4: プロポーズ */}
              <div className="cat-card">
                <div className="cat-thumb ct-4">
                  <div className="cat-soon-overlay">
                    <span className="cat-soon-label">coming soon</span>
                  </div>
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <path d="M28 10l3 8h8l-6.5 5 2.5 8L28 26l-7 5 2.5-8L17 18h8z" stroke="#6B8FBF" strokeWidth="1.5" fill="rgba(107,143,191,.1)" strokeLinejoin="round" />
                    <circle cx="28" cy="34" r="8" stroke="#6B8FBF" strokeWidth="1.5" fill="none" opacity=".4" />
                    <path d="M24 40l8-8" stroke="#6B8FBF" strokeWidth="1.3" strokeLinecap="round" opacity=".5" />
                  </svg>
                </div>
                <div className="cat-body">
                  <div className="cat-type">プロポーズ（準備中）</div>
                  <div className="cat-name">最高の瞬間の場所を</div>
                  <div className="cat-desc">プロポーズにおすすめのレストラン・ホテル・スポット。あの瞬間を完璧にしたい。</div>
                  <div className="cat-review-note crn-soon">coming soon</div>
                </div>
              </div>

              {/* ct-5: 旅行・おでかけ（coming soon overlay） */}
              <div className="cat-card">
                <div className="cat-thumb ct-5">
                  <div className="cat-soon-overlay">
                    <span className="cat-soon-label">coming soon</span>
                  </div>
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <path d="M12 36L28 14l16 22H12z" stroke="#C4877A" strokeWidth="1.5" fill="rgba(196,135,122,.1)" strokeLinejoin="round" />
                    <circle cx="28" cy="40" r="6" stroke="#C4877A" strokeWidth="1.5" fill="none" opacity=".5" />
                  </svg>
                </div>
                <div className="cat-body">
                  <div className="cat-type">旅行・おでかけ（準備中）</div>
                  <div className="cat-name">ふたりで行く旅先</div>
                  <div className="cat-desc">カップル・婚約中・新婚旅行。関係の節目ごとに使えるおすすめの旅先。</div>
                  <div className="cat-review-note crn-soon">coming soon</div>
                </div>
              </div>

              {/* ct-6: 記念日・アニバーサリー（coming soon overlay） */}
              <div className="cat-card">
                <div className="cat-thumb ct-6">
                  <div className="cat-soon-overlay">
                    <span className="cat-soon-label">coming soon</span>
                  </div>
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <path d="M14 44V22l14-12 14 12v22H34V32H22v12H14z" stroke="#8FA88A" strokeWidth="1.5" fill="rgba(143,168,138,.1)" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="cat-body">
                  <div className="cat-type">記念日・アニバーサリー（準備中）</div>
                  <div className="cat-name">大切な日をもっと特別に</div>
                  <div className="cat-desc">付き合った記念日、結婚記念日。ふたりの節目を彩るレストランや宿。</div>
                  <div className="cat-review-note crn-soon">coming soon</div>
                </div>
              </div>

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
