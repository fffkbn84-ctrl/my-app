import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import SectionDivider from "@/components/ui/SectionDivider";
import HomeReelCarousel from "@/components/home/HomeReelCarousel";
import { getCounselors } from "@/lib/data";
import { STORIES } from "@/lib/mock/stories";
import { getAllColumns } from "@/lib/columns";

/* ────────────────────────────────────────────────────────────
   定数（1箇所変更で全体に反映）
──────────────────────────────────────────────────────────── */
const HERO_H1_LINE1 = "好きな人を見つけて、";
const HERO_H1_LINE2 = "一緒に過ごす日々まで。";
const HERO_H2 =
  "カウンセラー × お見合いのカフェ × デートの場所 × 美容、ふたりに寄り添うすべて。";
const HERO_IMAGE_SRC = "/images/hero-couple-new.webp";

/* SEO 用の構造化データ（JSON-LD）。婚活キーワード対策の中核。 */
const SITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kinda ふたりへ",
  url: "https://www.kinda-futari.app",
  description:
    "好きな人を見つけて、一緒に過ごす日々まで。プロのカウンセラーと本音の口コミで選ぶ結婚相談所サービス。",
  keywords:
    "結婚相談所, 結婚相談所 口コミ, カウンセラー, 婚活, 婚活カウンセラー, 相性診断, お見合い, デート, パートナー探し",
  inLanguage: "ja-JP",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.kinda-futari.app/kinda-talk?keyword={search_term_string}",
    "query-input": "required name=search_term_string",
  },
} as const;

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kinda ふたりへ",
  alternateName: ["Kinda", "カインダ", "カインダふたりへ"],
  description:
    "好きな人を見つけて、一緒に過ごす日々まで。プロのカウンセラーが伴走する、本音の口コミで選ぶ結婚相談所サービス。",
  url: "https://www.kinda-futari.app",
} as const;

/* ────────────────────────────────────────────────────────────
   「もう決まっている方へ」カード定義
──────────────────────────────────────────────────────────── */
/**
 * カードの bg / accent カラーは globals.css の [data-section] と同じ
 * パステルパレットを使用：
 *   type → #E0ECF8（パステルブルー）
 *   talk → #FAF3DE（パステルイエロー）
 *   act  → #F5E1E0（パステルピンク）
 *   glow → #EDE0F4（パステルパープル）
 */
const DECIDED_CARDS = [
  {
    key: "type",
    href: "/kinda-type",
    kindaLabel: "type",
    desc: "診断するだけで合うカウンセラーが見つかる",
    img: "/images/section-kinda-type.webp",
    alt: "Kinda type",
    bg: "#E0ECF8",
    accent: "#5A7FAF",
  },
  {
    key: "talk",
    href: "/kinda-talk",
    kindaLabel: "talk",
    desc: "ぴったりのカウンセラーに直接会う",
    img: "/images/section-counseling.webp",
    alt: "Kinda talk",
    bg: "#FAF3DE",
    accent: "#B89A4A",
  },
  {
    key: "act",
    href: "/kinda-act",
    kindaLabel: "act",
    desc: "お見合いやデートの場所",
    img: "/images/section-cafe-pastel.webp",
    alt: "Kinda act",
    bg: "#F5E1E0",
    accent: "#B86E68",
  },
  {
    key: "glow",
    href: "/kinda-glow",
    kindaLabel: "glow",
    desc: "好きな人に会う前に、自分を整える",
    img: "/images/section-beauty-n2.png.webp",
    alt: "Kinda glow",
    bg: "#EDE0F4",
    accent: "#8A66B0",
  },
] as const;

/* ────────────────────────────────────────────────────────────
   Kinda note — 天気アイコン 5 種
   pre / waiting / omiai / date1 / kousai の各ルートから 1 つずつ選定。
   重い天気（thunderstorm / rain_cloud / mist）は初見ユーザーに重いため除外。
──────────────────────────────────────────────────────────── */
const NOTE_WEATHERS = [
  { src: "/images/w_pre_dawn.webp",         label: "夜明け前" },
  { src: "/images/w_light_rain_start.webp", label: "小雨のはじまり" },
  { src: "/images/w_angels_ladder.webp",    label: "天使の梯子" },
  { src: "/images/w_light_sunrise.webp",    label: "淡い朝焼け" },
  { src: "/images/w_twilight.webp",         label: "夕暮れ" },
] as const;

/* ────────────────────────────────────────────────────────────
   共通 SVG — 右矢印
──────────────────────────────────────────────────────────── */
function ArrowRight({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 7h10M7 2l5 5-5 5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   共通 — Ghost button
──────────────────────────────────────────────────────────── */
function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 28px",
        border: "1px solid var(--light)",
        borderRadius: 999,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--mid)",
        textDecoration: "none",
        transition: "border-color .2s, color .2s",
      }}
    >
      {children}
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   共通 — セクション区切り + ラベル
──────────────────────────────────────────────────────────── */
function SectionLabel({ label, en }: { label: string; en?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: 20,
          color: "var(--ink)",
          letterSpacing: ".05em",
          marginBottom: en ? 6 : 0,
        }}
      >
        {label}
      </p>
      {en && (
        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--accent)",
            letterSpacing: ".04em",
          }}
        >
          {en}
        </p>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   トップページ
──────────────────────────────────────────────────────────── */
export default async function HomePage() {
  // ホームのリールカルーセル用：Supabase or mock fallback から取得し
  // rating × log(reviewCount+2) で上位 6 件
  const allCounselors = await getCounselors();
  const homeReelCounselors = [...allCounselors]
    .sort(
      (a, b) =>
        b.rating * Math.log(b.reviewCount + 2) -
        a.rating * Math.log(a.reviewCount + 2),
    )
    .slice(0, 6);

  // Kinda voices（ふたりを見守る人たち）— 取材・コラム最新3件
  const homeColumns = (await getAllColumns()).slice(0, 3);

  return (
    <>
      <Header />
      <RevealObserver />

      <main style={{ fontFamily: "var(--font-sans)" }}>

        {/* ═══════════════════════════════════════════════════
            A — ヒーロー（垂直分離レイアウト）
            Block 1: ビジュアル / Block 2: コピー / Block 3: 主CTA / Block 4: 副CTA帯
        ═══════════════════════════════════════════════════ */}
        <section className="ktp-hero" aria-labelledby="hero-h1">
          {/* SEO: 構造化データ（JSON-LD） */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSONLD) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
          />

          {/* Block 1 — ビジュアル（画像のみ・文字一切なし） */}
          <div className="ktp-hero-visual">
            <Image
              src={HERO_IMAGE_SRC}
              alt="Kindaの世界観：ミニチュアクレイで作られた、ふたりが歩く村"
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 480px, 100vw"
              className="ktp-hero-visual-img"
            />
          </div>

          {/* Block 2 — メインコピー（ベージュ単色背景・濃ブラウン文字）
              ヘッダーに固定でロゴが出ているため、ヒーロー内ロゴは
              二重表示になる。ファーストビューの情報整理のため省略。 */}
          <div className="ktp-hero-copy">
            <h1 id="hero-h1" className="ktp-hero-h1">
              {HERO_H1_LINE1}
              <br />
              {HERO_H1_LINE2}
            </h1>
            <h2 className="ktp-hero-h2">{HERO_H2}</h2>
          </div>

          {/* Block 3 — 主CTA（Kinda note） */}
          <div className="ktp-hero-cta-block">
            <p className="ktp-hero-cta-tagline">
              言葉にならないモヤモヤを、60秒で。
            </p>
            <Link
              href="/kinda-note"
              className="ktp-hero-cta"
              aria-label="いまの気持ちを整理する Kinda note を始める"
            >
              いまの気持ちを整理する
              <ArrowRight color="white" />
            </Link>
            <p className="ktp-hero-micro">
              ✓60秒で言葉になる　✓登録不要　✓相談前の整理に
            </p>
          </div>

          {/* Block 4 — 副CTA帯（ヒーローの「外」として階層化）
              帯全体を 1 つのクリック領域に。リード＋リンクの2行構成は
              タップ可能領域が分散して伝わりにくかったので、文言を一体化。 */}
          <div className="ktp-hero-sub-block">
            <Link href="#section-b" className="ktp-hero-sub-link">
              やりたいことが決まっている方はこちら
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            A' — Kinda note 説明セクション
            ヒーロー直下で「気持ちを整理する」体験を訴求し、Kinda の
            差別化機能（他社にない唯一無二のメモツール）を主役に置く。
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#F5EEE6",
            padding: "56px 24px 60px",
            borderBottom: "1px solid rgba(0,0,0,.04)",
          }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            {/* セクションラベル（Bパターン：Kinda 主役・Mincho + DM Serif italic accent） */}
            <p
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 18,
                color: "var(--ink)",
                letterSpacing: ".04em",
                textAlign: "center",
                marginBottom: 14,
              }}
            >
              Kinda{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "#D4A090",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                note
              </em>
            </p>

            {/* セクション見出し（Georgia serif 大きめ） */}
            <h2
              style={{
                fontFamily: "Georgia, 'DM Serif Display', serif",
                fontSize: "clamp(22px, 5.8vw, 30px)",
                color: "var(--ink)",
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: ".02em",
                textAlign: "center",
                margin: "0 0 18px",
              }}
            >
              あなたの気持ちは
              <br />
              いま、どんな天気？
            </h2>

            {/* リード文 */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--mid)",
                lineHeight: 1.95,
                textAlign: "center",
                margin: "0 0 32px",
                letterSpacing: ".02em",
              }}
            >
              うまく言葉にできない不安や、
              <br />
              言葉にならない嬉しさも。
              <br />
              天気のメタファーを通して、
              <br />
              自分の気持ちが見えてきます。
            </p>

            {/* 天気アイコン 5 種（横スクロール） */}
            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                padding: "4px 4px 18px",
                margin: "0 -24px 28px",
                paddingLeft: 24,
                paddingRight: 24,
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
              className="hide-scrollbar"
            >
              {NOTE_WEATHERS.map((w, i) => (
                <div
                  key={w.src}
                  style={{
                    flex: "0 0 auto",
                    width: 96,
                    textAlign: "center",
                    scrollSnapAlign: "start",
                  }}
                >
                  <div
                    className="weather-icon-animated"
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "white",
                      boxShadow: "0 4px 14px rgba(180,140,110,.14)",
                      position: "relative",
                      marginBottom: 8,
                      animationDelay: `${i * 0.6}s`,
                    }}
                  >
                    <Image
                      src={w.src}
                      alt={w.label}
                      fill
                      sizes="96px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mincho)",
                      fontSize: 11,
                      color: "var(--ink)",
                      letterSpacing: ".04em",
                      margin: 0,
                    }}
                  >
                    {w.label}
                  </p>
                </div>
              ))}
            </div>

            {/* 全20種であることをそっと伝える（"これだけ?" を防ぐ・詩的な余韻） */}
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 14,
                color: "var(--muted)",
                textAlign: "center",
                lineHeight: 1.9,
                letterSpacing: "0.02em",
                margin: "24px 0 32px",
              }}
            >
              並んでいるのは、ほんの一部。
              <br />
              あなたの天気は、20の中にあります。
            </p>

            {/* 機能の特徴 3 つ（チェックリスト） */}
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 28px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                "60秒で、いまの気持ちが言葉になる",
                "整理したメモは、そのままカウンセラーに渡せる",
                "何度でも、気持ちが揺れたときに",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: 13,
                    color: "var(--ink)",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                    style={{ flex: "0 0 auto", marginTop: 4 }}
                  >
                    <path
                      d="M2.5 7.5l3 3 6-7"
                      stroke="#D4A090"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA — 気持ちを整理する */}
            <div style={{ textAlign: "center" }}>
              <Link
                href="/kinda-note"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: "#D4A090",
                  color: "white",
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: ".04em",
                  textDecoration: "none",
                  boxShadow: "0 6px 18px rgba(212,160,144,.4)",
                  transition: "transform .2s, box-shadow .2s",
                }}
              >
                気持ちを整理する
                <ArrowRight color="white" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            B — やりたいことが決まっている方へ
        ═══════════════════════════════════════════════════ */}
        <section
          id="section-b"
          style={{
            padding: "48px 24px 64px",
            background: "#FEFCFA",
          }}
        >
          <SectionDivider />

          {/* ラベル（中央テキストのみ・線は SectionDivider に一本化） */}
          <p
            style={{
              fontSize: 12,
              color: "var(--muted)",
              letterSpacing: ".16em",
              fontFamily: "var(--font-sans)",
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            やりたいことが決まっている方へ
          </p>

          {/* 2×2 グリッド */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {DECIDED_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                style={{
                  display: "block",
                  background: card.bg,
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,.04)",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(200,169,122,.08)",
                  textDecoration: "none",
                  transition: "transform .3s, box-shadow .3s",
                }}
              >
                {/* 画像エリア（カードと同色のパステル背景に画像が乗る） */}
                <div
                  style={{
                    aspectRatio: "1/1",
                    background: card.bg,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    src={card.img}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 768px) 240px, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* テキストエリア — カード bg を継承して馴染ませる */}
                <div style={{ padding: "12px 14px 16px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-mincho)",
                      fontSize: 16,
                      color: "var(--ink)",
                      marginBottom: 6,
                      letterSpacing: ".03em",
                    }}
                  >
                    Kinda{" "}
                    <em
                      style={{
                        fontStyle: "italic",
                        color: card.accent,
                        fontFamily: "'DM Serif Display', serif",
                      }}
                    >
                      {card.kindaLabel}
                    </em>
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--mid)",
                      lineHeight: 1.5,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            B' — Kinda talk より | 今いるカウンセラーたち
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "56px 0 8px",
            background: "#FEFCFA",
          }}
        >
          <SectionDivider />

          <div style={{ textAlign: "center", marginBottom: 24, padding: "0 20px" }}>
            {/* セクションラベル（Bパターン：Kinda 主役・「より」は削除） */}
            <p
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 18,
                color: "var(--ink)",
                letterSpacing: ".04em",
                marginBottom: 6,
              }}
            >
              Kinda{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "#B89A4A",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                talk
              </em>
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 22,
                color: "var(--ink)",
                fontWeight: 500,
                margin: "4px 0",
              }}
            >
              今いるカウンセラーたち
            </h2>
            <div
              style={{
                fontSize: 12,
                color: "var(--mid)",
                marginTop: 6,
              }}
            >
              リールにこめた言葉と空気から、選ぶ
            </div>
          </div>

          <HomeReelCarousel counselors={homeReelCounselors} />
        </section>

        {/* ═══════════════════════════════════════════════════
            C' — Kinda story より | 続いている、ふたりの物語
        ═══════════════════════════════════════════════════ */}
        <section
          id="stories"
          style={{
            padding: "72px 24px 64px",
            background: "#F4FAF1",
            scrollMarginTop: 80,
          }}
        >
          <SectionDivider />

          <div style={{ textAlign: "center", marginBottom: 28, padding: "0 4px" }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                letterSpacing: ".18em",
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Kinda story{" "}
              <em
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  color: "#5A8050",
                  textTransform: "lowercase",
                  margin: "0 2px",
                }}
              >
                より
              </em>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 22,
                color: "var(--ink)",
                fontWeight: 500,
                margin: "4px 0",
              }}
            >
              続いている、ふたりの物語
            </h2>
            <div
              style={{
                fontSize: 12,
                color: "var(--mid)",
                marginTop: 6,
              }}
            >
              成婚の先輩・活動中の声、ぜんぶそのまま
              <br />
              <span style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>
                読んだあとも、Kinda が次の一歩まで伴走します。
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 560,
              margin: "0 auto 28px",
            }}
          >
            {STORIES.slice(0, 3).map((story) => (
              <Link
                key={story.id}
                href={`/kinda-story/${story.id}`}
                style={{
                  display: "block",
                  background: "var(--white)",
                  borderRadius: 18,
                  padding: 22,
                  border: "1px solid #DDEAD4",
                  textDecoration: "none",
                  transition: "transform .25s, box-shadow .25s",
                }}
              >
                {/* ステージ + 期間 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "#5A8050",
                      background: "#E8F4E4",
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {story.stage}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--mid)" }}>
                    {story.periodLabel}
                  </span>
                </div>

                {/* 引用文 */}
                <p
                  style={{
                    fontFamily: "var(--font-mincho)",
                    fontSize: 15,
                    color: "var(--ink)",
                    lineHeight: 1.95,
                    marginBottom: 14,
                    letterSpacing: ".02em",
                  }}
                >
                  「{story.quote}」
                </p>

                {/* 著者情報 + 続きを読む */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <p style={{ fontSize: 11, color: "var(--mid)" }}>
                    — {story.author}（{story.age}）／{story.counselorName}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#5A8050",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    読む
                    <ArrowRight color="#5A8050" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* もっと読む */}
          <div style={{ textAlign: "center" }}>
            <GhostButton href="/kinda-story">
              ぜんぶの物語を読む
              <ArrowRight />
            </GhostButton>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            C' — Kinda voices より | ふたりを見守る人たち
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "72px 24px 64px",
            background: "#FCF8F2",
          }}
        >
          <SectionDivider />

          <div style={{ textAlign: "center", marginBottom: 28, padding: "0 4px" }}>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                letterSpacing: ".18em",
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Kinda voices{" "}
              <em
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  color: "#8B7355",
                  textTransform: "lowercase",
                  margin: "0 2px",
                }}
              >
                より
              </em>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 22,
                color: "var(--ink)",
                fontWeight: 500,
                margin: "4px 0",
              }}
            >
              ふたりを見守る人たち
            </h2>
            <div
              style={{
                fontSize: 12,
                color: "var(--mid)",
                marginTop: 6,
              }}
            >
              気持ちの整理から、ふたりに寄り添う読みもの
              <br />
              <span style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>
                読みものから、次の一歩へ繋がります。
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 560,
              margin: "0 auto 28px",
            }}
          >
            {homeColumns.map((article) => (
              <Link
                key={article.slug}
                href={`/columns/${article.slug}`}
                style={{
                  display: "block",
                  background: "var(--white)",
                  borderRadius: 18,
                  padding: 22,
                  border: "1px solid #E5DACB",
                  textDecoration: "none",
                  transition: "transform .25s, box-shadow .25s",
                }}
              >
                {/* カテゴリ + 読了時間 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "#8B7355",
                      background: "#F4ECE0",
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {article.category}
                  </span>
                  {article.readTime && (
                    <span style={{ fontSize: 11, color: "var(--mid)" }}>
                      読了 {article.readTime}分
                    </span>
                  )}
                </div>

                {/* タイトル */}
                <p
                  style={{
                    fontFamily: "var(--font-mincho)",
                    fontSize: 15,
                    color: "var(--ink)",
                    lineHeight: 1.95,
                    marginBottom: 14,
                    letterSpacing: ".02em",
                  }}
                >
                  {article.title}
                </p>

                {/* 著者・日付・読む */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <p style={{ fontSize: 11, color: "var(--mid)" }}>
                    — {article.author}　{article.publishedAt}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#8B7355",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    読む
                    <ArrowRight color="#8B7355" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* コラム一覧へ */}
          <div style={{ textAlign: "center" }}>
            <GhostButton href="/columns">
              ぜんぶの記事を読む
              <ArrowRight />
            </GhostButton>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            D — Kinda ふたりへについて（Brand Belief・/about のティザー）
            /about のヒーローコピーと同期。詩的ブロック末尾に CTA を置き、
            タップで /about の詳細へ遷移する。
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "64px 24px",
            background: "#FAF5EE",
          }}
        >
          <SectionDivider />

          {/* ラベル */}
          <p
            style={{
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 40,
              fontFamily: "var(--font-sans)",
            }}
          >
            about
          </p>

          <div
            style={{
              maxWidth: 480,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* /about ヒーローと同じ詩的ブロックを圧縮版で */}
            <p
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: "clamp(16px, 4vw, 18px)",
                color: "var(--ink)",
                lineHeight: 2.2,
                marginBottom: 24,
                letterSpacing: ".06em",
              }}
            >
              誰かと「ふたり」になる瞬間は
              <br />
              いつだって、はじめて。
            </p>

            <p
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: "clamp(15px, 3.6vw, 17px)",
                color: "var(--mid)",
                lineHeight: 2.2,
                marginBottom: 32,
                letterSpacing: ".04em",
              }}
            >
              はじめての恋愛でも、再婚でも、子連れでも。
              <br />
              その瞬間のために、
              <span style={{ color: "var(--accent)" }}>Kinda ふたりへ</span>
              がいます。
            </p>

            {/* Kinda の語源（圧縮版・/about ヒーローと同期） */}
            <p
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 2,
                letterSpacing: ".06em",
                marginBottom: 36,
              }}
            >
              Kinda — 英語で「なんとなく」。
              <br />
              そして &ldquo;my kinda&rdquo; と言えば、「私にぴったりの」。
            </p>

            {/* CTA → /about */}
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                border: "1px solid var(--light)",
                borderRadius: 999,
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--ink)",
                textDecoration: "none",
                transition: "border-color .2s, color .2s, background .2s",
                background: "var(--white)",
              }}
              aria-label="Kinda ふたりへについて、もっと知る"
            >
              Kinda ふたりへについて、もっと知る
              <ArrowRight />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
