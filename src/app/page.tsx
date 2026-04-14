import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import PlacesSection from "@/components/home/PlacesSection";
import EpisodesSection from "@/components/home/EpisodesSection";
import ColumnsSection from "@/components/home/ColumnsSection";
import KindaSearchBar from "@/components/home/KindaSearchBar";

/* ────────────────────────────────────────────────────────────
   ヒーロー 目次カード定義
──────────────────────────────────────────────────────────── */
const heroNavItems = [
  {
    label: "担当者",
    href: "#counselors",
    cls: "hnc-1",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="9" r="5" stroke="white" strokeWidth="1.3" fill="none" opacity=".8" />
        <path d="M2 24c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
      </svg>
    ),
  },
  {
    label: "お店",
    href: "#places",
    cls: "hnc-2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M4 10h18l-1.5 12H5.5L4 10z" stroke="white" strokeWidth="1.3" fill="none" strokeLinejoin="round" opacity=".8" />
        <path d="M16 14h2a2 2 0 010 4h-2" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
        <path d="M9 7c0-1.5 2-1.5 2-3M13 7c0-1.5 2-1.5 2-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".4" />
      </svg>
    ),
  },
  {
    label: "エピソード",
    href: "#episodes",
    cls: "hnc-3",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 3l2 6h6L16 13l2 6-5-3.5L8 19l2-6-5-4h6z" stroke="white" strokeWidth="1.3" fill="none" strokeLinejoin="round" opacity=".8" />
      </svg>
    ),
  },
  {
    label: "診断",
    href: "/diagnosis",
    cls: "hnc-4",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="white" strokeWidth="1.3" fill="none" opacity=".7" />
        <path d="M13 7v2M13 17v2M7 13h2M17 13h2" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        <path d="M16 10l-4 3-2 4 4-3 2-4z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(255,255,255,.15)" />
      </svg>
    ),
  },
  {
    label: "コラム",
    href: "/columns",
    cls: "hnc-5",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="4" y="5" width="18" height="16" rx="2" stroke="white" strokeWidth="1.3" fill="none" opacity=".7" />
        <path d="M8 10h10M8 14h7" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
      </svg>
    ),
  },
  {
    label: "サービス",
    href: "/about",
    cls: "hnc-6",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="white" strokeWidth="1.3" fill="none" opacity=".7" />
        <path d="M13 9v5l3 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      </svg>
    ),
  },
] as const;

/* ────────────────────────────────────────────────────────────
   モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */
const featuredCounselors = [
  {
    id: "1",
    name: "田中 美咲",
    agency: "ブライダルサロン エクラン",
    area: "東京・渋谷",
    access: "渋谷駅 徒歩3分",
    parking: false,
    specialties: ["初婚", "30代", "キャリア女性"],
    rating: 4.9,
    reviewCount: 47,
    yearsExp: 8,
    intro: "一人ひとりの価値観を大切に、焦らず本当のご縁を一緒に探します。",
    monthlyFee: "29,800",
    campaign: { label: "春の婚活キャンペーン", detail: "4/30までのご入会で入会金10%オフ" },
  },
  {
    id: "2",
    name: "佐藤 あかり",
    agency: "マリーナ結婚相談所",
    area: "東京・銀座",
    access: "銀座駅 徒歩2分",
    parking: false,
    specialties: ["再婚", "バツあり", "子持ち"],
    rating: 4.8,
    reviewCount: 32,
    yearsExp: 12,
    intro: "再婚・シングルの方に寄り添い、新しい幸せへの第一歩をサポートします。",
    monthlyFee: "24,800",
    campaign: null,
  },
  {
    id: "3",
    name: "山本 花子",
    agency: "ローズブライダル",
    area: "神奈川・横浜",
    access: "みなとみらい駅 徒歩5分",
    parking: true,
    specialties: ["20代", "初婚", "地方在住"],
    rating: 4.7,
    reviewCount: 58,
    yearsExp: 5,
    intro: "婚活が初めての方でも安心。一緒に理想のパートナーを見つけましょう。",
    monthlyFee: "19,800",
    campaign: { label: "20代限定キャンペーン", detail: "初回面談後ご入会で入会金半額" },
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
            ① HERO — ミニチュア世界観
        ═══════════════════════════════════════════════════ */}
        <section className="hero-kinda-new">

          {/* 背景ミニチュア装飾（左右に散らす） */}
          <div className="hkn-bg" aria-hidden="true">
            <Image
              src="/images/section-cafe.png"
              alt=""
              width={280}
              height={280}
              className="hkn-bg-item hkn-bg-left"
              style={{ width: "100%", height: "auto" }}
            />
            <Image
              src="/images/section-counseling.png"
              alt=""
              width={240}
              height={240}
              className="hkn-bg-item hkn-bg-right"
              style={{ width: "100%", height: "auto" }}
            />
            <Image
              src="/images/section-beauty.png"
              alt=""
              width={200}
              height={200}
              className="hkn-bg-item hkn-bg-bl"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {/* 中央コンテンツ */}
          <div className="hkn-inner">

            {/* ロゴ行: Kinda 大 + ふたりへ 小 */}
            <div className="hkn-logo">
              <span className="hkn-logo-main">Kinda</span>
              <span className="hkn-logo-ja">ふたりへ</span>
            </div>

            {/* サブテキスト */}
            <p className="hkn-sub">なんとなく、でいい。一緒に探そう。</p>

            {/* メイン画像 */}
            <div className="hkn-img-wrap">
              <Image
                src="/images/hero-couple-top.png"
                alt="カフェでくつろぐカップル"
                width={360}
                height={360}
                priority
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* 検索バー */}
            <KindaSearchBar />

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════
            ② Kinda カテゴリセクション
        ═══════════════════════════════════════════════════ */}
        <section className="kinda-cats-sec">
          <div className="kinda-cats-inner">
            {/* ヘッダー */}
            <div className="kinda-cats-hd reveal">
              <div className="sec-label">WHAT&apos;S YOUR KINDA</div>
              <h2 className="kinda-cats-ttl">
                あなたの「<em>Kinda</em>」はどれですか？
              </h2>
            </div>

            {/* 4枚カードグリッド */}
            <div className="kinda-cats-grid">

              {/* Kinda talk — カウンセラー・相談所（パステル黄） */}
              <Link href="/search" className="kinda-cat-card kc-yellow reveal">
                <div className="kinda-cat-img-area">
                  <Image
                    src="/images/section-counseling.png"
                    alt="カウンセラーとの面談"
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="kinda-cat-body">
                  <div className="kinda-cat-name"><em>Kinda</em> talk</div>
                  <p className="kinda-cat-desc">カウンセラー・相談所</p>
                  <span className="kinda-cat-btn kc-btn-yellow">
                    もっと見てみる
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Kinda meet — お見合い・デートカフェ（パステルピンク） */}
              <Link href="/shops" className="kinda-cat-card kc-pink reveal reveal-delay-1">
                <div className="kinda-cat-img-area">
                  <Image
                    src="/images/section-cafe2.png"
                    alt="お見合い・デートカフェ"
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="kinda-cat-body">
                  <div className="kinda-cat-name"><em>Kinda</em> meet</div>
                  <p className="kinda-cat-desc">お見合い・デートに使えるカフェ</p>
                  <span className="kinda-cat-btn kc-btn-pink">
                    探してみる
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Kinda change — 美容室・エステ（パステル青） */}
              <Link href="/shops" className="kinda-cat-card kc-blue reveal reveal-delay-2">
                <div className="kinda-cat-img-area">
                  <Image
                    src="/images/section-beauty.png"
                    alt="美容室・エステ"
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="kinda-cat-body">
                  <div className="kinda-cat-name"><em>Kinda</em> change</div>
                  <p className="kinda-cat-desc">美容室・エステ</p>
                  <span className="kinda-cat-btn kc-btn-blue">
                    探してみる
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Kinda story — みんなの体験談（パステル緑） */}
              <Link href="/episodes" className="kinda-cat-card kc-green reveal reveal-delay-3">
                <div className="kinda-cat-img-area">
                  <Image
                    src="/images/section-story.png"
                    alt="みんなの体験談"
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="kinda-cat-body">
                  <div className="kinda-cat-name"><em>Kinda</em> story</div>
                  <p className="kinda-cat-desc">みんなの体験談</p>
                  <span className="kinda-cat-btn kc-btn-green">
                    読んでみる
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* ─── 旧ヒーロー（削除済み） ─── */}
        <section style={{ display: "none" }}>
          {/* グリッドパターン背景 */}
          <div className="hero-grid" />

          {/* 左カラム */}
          <div className="hero-left">
            <div className="hero-tag">marriage counseling, reimagined</div>
            <h1 className="hero-h1">
              <span style={{ display: "block" }}>担当者を自分で選んで</span>
              <span style={{ display: "block" }}>予約までここで完結</span>
              <span className="hero-h1-en">The counselor comes first.</span>
            </h1>
            <p className="hero-sub">
              面談した人だけが書ける口コミと、担当者の顔・経歴が最初から見えるサービスです。<br /><br />
              お見合いやデート、婚活準備のための美容のお店の情報も、ここで。<br />出会いから、ずっと先まで一緒にいます。
            </p>
            <div className="hero-actions">
              <Link href="/search" className="btn btn-dark">カウンセラーを探す</Link>
              <Link href="/shops" className="btn btn-outline">ふたりのお店を探す</Link>
            </div>
            <p style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "12px" }}>✓ 無料で使えます・登録不要</p>

            {/* 診断カード */}
            <Link
              href="/diagnosis"
              className="diagnosis-hero-card"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="16" cy="16" r="13" stroke="#C8A97A" strokeWidth="1.3" fill="rgba(200,169,122,.08)" />
                <path d="M16 8v2M16 22v2M8 16h2M22 16h2" stroke="#C8A97A" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
                <path d="M20 12l-5 4-3 5 5-4 3-5z" stroke="#C8A97A" strokeWidth="1.3" strokeLinejoin="round" fill="rgba(200,169,122,.2)" />
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", marginBottom: 4 }}>
                  サクッと1~3分 · 無料
                </div>
                <div style={{ fontFamily: "Shippori Mincho, serif", fontSize: 16, color: "var(--black)", letterSpacing: ".05em" }}>
                  あなたに合う担当タイプ、<span className="diagnosis-br" />婚活スタイルを診断する
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <path d="M4 10h12M10 4l6 6-6 6" stroke="#C8A97A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
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
            ③ 信頼の数字セクション
        ═══════════════════════════════════════════════════ */}
        <div className="stats-sec">
          {[
            { num: "247",   lbl: "掲載カウンセラー" },
            { num: "1,840", lbl: "累計口コミ数" },
            { num: "98%",   lbl: "面談後認証率" },
            { num: "無料",  lbl: "ご利用料金" },
          ].map((s) => (
            <div key={s.lbl} className="stat-cell">
              <div className="stat-num">{s.num}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* JOURNEY — 非表示（新デザインでは削除） */}
        <section className="journey-sec" style={{ display: "none" }}>
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
            ④ カウンセラーセクション — Photo background
        ═══════════════════════════════════════════════════ */}
        <section id="counselors" className="counselors-photo-sec">
          {/* 半透明オーバーレイ */}
          <div className="counselors-photo-overlay" />

          <div className="counselors-photo-inner">
            {/* セクションヘッダー */}
            <div className="counselor-inner">
              <div className="sec-label reveal">FIND YOUR COUNSELOR</div>
              <h2 className="sec-h reveal reveal-delay-1">
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

                      {/* 名前・エリア・相談所・経験年数 */}
                      <div>
                        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2, letterSpacing: ".06em" }}>
                          {counselor.area}
                        </div>
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

                      {/* アクセス情報 */}
                      <div
                        style={{
                          padding: "9px 11px",
                          background: "var(--pale)",
                          borderRadius: 8,
                          marginBottom: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        {/* 駅・徒歩 */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--mid)" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="2" width="10" height="7" rx="1.5" stroke="var(--mid)" strokeWidth="1"/>
                            <path d="M3 9v1.5M9 9v1.5" stroke="var(--mid)" strokeWidth="1" strokeLinecap="round"/>
                            <path d="M1 5.5h10" stroke="var(--mid)" strokeWidth=".8" opacity=".5"/>
                            <circle cx="3.5" cy="7" r=".8" fill="var(--mid)"/>
                            <circle cx="8.5" cy="7" r=".8" fill="var(--mid)"/>
                          </svg>
                          {counselor.access}
                        </div>
                        {/* 駐車場 */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--mid)" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="1" width="10" height="10" rx="2" stroke="var(--mid)" strokeWidth="1"/>
                            <path d="M4.5 8.5V3.5h2a1.5 1.5 0 010 3H4.5" stroke="var(--mid)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {counselor.parking ? "駐車場あり" : "駐車場なし"}
                        </div>
                      </div>

                      {/* 月会費 */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                        <span style={{ fontSize: 10, color: "var(--muted)" }}>月会費</span>
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: 18,
                            color: "var(--ink)",
                            letterSpacing: "-.02em",
                          }}
                        >
                          ¥{counselor.monthlyFee}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--muted)" }}>〜/月</span>
                      </div>

                      {/* キャンペーンバナー */}
                      {counselor.campaign && (
                        <div
                          style={{
                            background: "rgba(200,169,122,0.1)",
                            border: "1px solid rgba(200,169,122,0.3)",
                            borderRadius: 8,
                            padding: "8px 11px",
                            marginBottom: 12,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <div style={{ fontSize: 9, color: "var(--accent)", fontWeight: 600, letterSpacing: ".06em" }}>
                            {counselor.campaign.label}
                          </div>
                          <div style={{ fontSize: 10, color: "var(--ink)" }}>{counselor.campaign.detail}</div>
                        </div>
                      )}

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

          {/* もっと見てみるボタン */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link
              href="/search"
              className="btn btn-outline reveal reveal-delay-2"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              もっと見てみる
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          </div>{/* /counselors-photo-inner */}
        </section>

        {/* ═══════════════════════════════════════════════════
            ⑤ 口コミピックアップ
        ═══════════════════════════════════════════════════ */}
        <div className="reviews-pickup">
          <div className="reviews-pickup-inner">
            <div className="sec-label reveal">REAL REVIEWS</div>
            <h2 className="sec-h reveal reveal-delay-1">
              面談した人だけが書ける
              <span className="sec-h-jp">すべての口コミは面談完了後に認証されます</span>
            </h2>

            <div className="review-card-list">
              {/* 口コミ 1 */}
              <div className="review-card-item reveal reveal-delay-2">
                <div className="review-card-head">
                  <div className="review-av-wrap">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="4" fill="var(--accent)" opacity=".5" />
                      <path d="M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity=".35" />
                    </svg>
                  </div>
                  <div className="review-meta">
                    <div className="review-name">S.K さん（32歳）</div>
                    <div className="review-counselor-line">田中 美紀 カウンセラー</div>
                  </div>
                  <div className="review-date-stars">
                    <span className="review-date">2025年11月</span>
                    <span className="review-stars">★★★★★</span>
                  </div>
                </div>
                <p className="review-body">
                  「初回面談で『入会を急かされないかな』と心配でしたが、まず話を聞いてもらえて安心しました。自分でも気づいていなかった理想のパートナー像が見えてきた気がします。」
                </p>
                <div className="review-verified-badge">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l3 3 4-4" stroke="var(--forest)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  面談完了済み
                </div>
              </div>

              {/* 口コミ 2 */}
              <div className="review-card-item reveal reveal-delay-3">
                <div className="review-card-head">
                  <div className="review-av-wrap">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="4" fill="var(--accent)" opacity=".5" />
                      <path d="M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity=".35" />
                    </svg>
                  </div>
                  <div className="review-meta">
                    <div className="review-name">M.T さん（28歳）</div>
                    <div className="review-counselor-line">佐藤 綾乃 カウンセラー</div>
                  </div>
                  <div className="review-date-stars">
                    <span className="review-date">2025年10月</span>
                    <span className="review-stars">★★★★★</span>
                  </div>
                </div>
                <p className="review-body">
                  「口コミを読んで予約したのですが、本当に口コミ通りの方でした。仕事との両立について親身に考えてくれる姿勢が伝わってきました。」
                </p>
                <div className="review-verified-badge">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l3 3 4-4" stroke="var(--forest)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  面談完了済み
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            ⑥ ふたりへが選んだお店 — Photo background (dark)
        ═══════════════════════════════════════════════════ */}
        <PlacesSection />

        {/* ═══════════════════════════════════════════════════
            ⑦ 成婚エピソード（既存を維持）
        ═══════════════════════════════════════════════════ */}
        <EpisodesSection />

        {/* ═══════════════════════════════════════════════════
            ⑧ OUR BELIEF — Photo background
        ═══════════════════════════════════════════════════ */}
        <section className="belief-sec">
          <div className="belief-overlay" />
          <div className="belief-inner">
            <div className="vision-eyebrow reveal">our belief</div>
            <p className="vision-main-copy reveal reveal-delay-1">
              選ぶ自由と、頑張れる場所を。
            </p>
            <p className="vision-sub reveal reveal-delay-2">
              世の中のレビューサイトは、<br />
              関係が出来上がった人たちのためにある<br />
              <br />
              <span style={{ color: "var(--accent)" }}>ふたりへ</span>は　今まさに関係を作っている<br />
              あなたたちのためにある<br />
              <br />
              不安なまま相談所に飛び込まなくていい<br />
              お見合いのカフェも　婚活前の美容も<br />
              デートのお店も　迷わない<br />
              そのそばに、ずっといます
            </p>
            <div className="vision-btn-wrap reveal reveal-delay-3">
              <Link href="/about" className="vision-btn">
                このサービスについてもっと知る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ⑨ コラム（既存を維持）
        ═══════════════════════════════════════════════════ */}
        <ColumnsSection />

        {/* ═══════════════════════════════════════════════════
            ⑩ CTA — Photo background
        ═══════════════════════════════════════════════════ */}
        <section className="cta-sec">
          {/* 暗オーバーレイ */}
          <div className="cta-overlay" />
          <div className="cta-inner">
            <div className="cta-ey reveal">GET STARTED</div>
            <h2
              className="reveal reveal-delay-1"
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(20px,4vw,24px)",
                color: "white",
                lineHeight: 1.6,
                letterSpacing: ".06em",
                marginBottom: 32,
              }}
            >
              あなたの婚活を、孤独にしない。
            </h2>
            <div className="cta-btns reveal reveal-delay-2">
              <Link
                href="/search"
                className="btn"
                style={{ background: "white", color: "var(--black)", borderRadius: "50px" }}
              >
                カウンセラーを探す
              </Link>
              <Link
                href="/shops"
                className="btn"
                style={{
                  border: "1px solid rgba(255,255,255,.3)",
                  background: "transparent",
                  color: "rgba(255,255,255,.7)",
                  borderRadius: "50px",
                }}
              >
                ふたりのお店を探す
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
