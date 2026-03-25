import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import PlacesSection from "@/components/home/PlacesSection";
import EpisodesSection from "@/components/home/EpisodesSection";
import ColumnsSection from "@/components/home/ColumnsSection";

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
              <Link href="#counselors" className="cat-card">
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
              </Link>

              {/* ct-2: カフェ・レストラン */}
              <Link href="#places" className="cat-card">
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
              </Link>

              {/* ct-3: ヘア・ネイル・眉 */}
              <Link href="#places" className="cat-card">
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
              </Link>

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
            注目のカウンセラー（横スクロール）
        ═══════════════════════════════════════════════════ */}
        <section
          id="counselors"
          style={{ background: "var(--pale)", padding: "100px 0", overflow: "hidden" }}
        >
          {/* セクションヘッダー */}
          <div className="counselor-inner">
            <div className="sec-label">find your counselor</div>
            <h2 className="sec-h">
              担当者を見て、選ぶ。
              <span className="sec-h-jp">
                面談した人だけが書けるレビューで、カウンセラーの人となりがわかります
              </span>
            </h2>
          </div>

          {/* 横スクロールトラック */}
          <div
            className="counselor-scroll"
            style={{ overflowX: "auto", scrollbarWidth: "none", cursor: "grab", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <div style={{ display: "flex", gap: 16, width: "max-content" }}>
              {featuredCounselors.map((counselor, i) => {
                const avatarThemes = [
                  { bg: "linear-gradient(135deg,#F5E8D8,#EDD8C0)", color: "#C8A97A" },
                  { bg: "linear-gradient(135deg,#D8E8F5,#C0D4ED)", color: "#6B8FBF" },
                  { bg: "linear-gradient(135deg,#D8F5E8,#C0EDD4)", color: "#7A9E87" },
                ];
                const av = avatarThemes[i % avatarThemes.length];

                return (
                  <Link
                    key={counselor.id}
                    href={`/counselors/${counselor.id}`}
                    className="group hover:-translate-y-[7px] hover:shadow-[0_28px_72px_rgba(0,0,0,.1)]"
                    style={{
                      width: 262,
                      flexShrink: 0,
                      background: "white",
                      borderRadius: 14,
                      border: "1px solid var(--light)",
                      overflow: "hidden",
                      transition: "all .4s cubic-bezier(.16,1,.3,1)",
                      display: "block",
                    }}
                  >
                    {/* カード上部：アバター＋基本情報 */}
                    <div
                      style={{
                        padding: "22px 20px 16px",
                        borderBottom: "1px solid var(--pale)",
                        display: "flex",
                        gap: 12,
                      }}
                    >
                      {/* SVGアバター */}
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background: av.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="9" r="5" fill={av.color} opacity=".6" />
                          <path
                            d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9"
                            stroke={av.color}
                            strokeWidth="1.2"
                            fill="none"
                            opacity=".4"
                          />
                        </svg>
                      </div>

                      {/* 名前・相談所・経験年数 */}
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 400,
                            fontSize: 15,
                            marginBottom: 3,
                            color: "var(--ink)",
                          }}
                        >
                          {counselor.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {counselor.agency}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--accent)",
                            background: "rgba(200,169,122,0.12)",
                            padding: "2px 9px",
                            borderRadius: 20,
                            display: "inline-block",
                            marginTop: 5,
                          }}
                        >
                          経験 {counselor.yearsExp}年
                        </div>
                      </div>
                    </div>

                    {/* カード下部：タグ・引用・評価・CTA */}
                    <div style={{ padding: "16px 20px 20px" }}>
                      {/* 専門タグ */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                        {counselor.specialties.map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 10,
                              padding: "3px 9px",
                              borderRadius: 20,
                              border: "1px solid var(--light)",
                              color: "var(--mid)",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* 自己紹介引用 */}
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--ink)",
                          lineHeight: 1.9,
                          padding: "10px 12px",
                          background: "var(--pale)",
                          borderRadius: 6,
                          borderLeft: "2px solid var(--accent)",
                          marginBottom: 12,
                        }}
                      >
                        「{counselor.intro}」
                      </div>

                      {/* 評価・口コミ数 */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <span style={{ color: "var(--accent)", fontSize: 11, letterSpacing: ".5px" }}>
                          {"★".repeat(Math.round(counselor.rating))}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--muted)" }}>
                          口コミ {counselor.reviewCount}件
                        </span>
                      </div>

                      {/* 予約ボタン */}
                      <button
                        className="hover:!bg-[var(--accent)]"
                        style={{
                          width: "100%",
                          padding: 11,
                          background: "var(--black)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontFamily: "var(--font-sans)",
                          fontSize: 10,
                          letterSpacing: ".16em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "all .3s",
                        }}
                      >
                        面談を予約する
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ふたりへが選んだお店
        ═══════════════════════════════════════════════════ */}
        <PlacesSection />

        {/* ═══════════════════════════════════════════════════
            成婚エピソード
        ═══════════════════════════════════════════════════ */}
        <EpisodesSection />

        {/* ═══════════════════════════════════════════════════
            コラム
        ═══════════════════════════════════════════════════ */}
        <ColumnsSection />

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
