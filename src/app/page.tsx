import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import HomeReelCarousel from "@/components/home/HomeReelCarousel";
import { getCounselors } from "@/lib/data";

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
    desc: "自分に合うカウンセラーが見つかる相性チェック",
    img: "/images/section-kinda-type.webp",
    alt: "Kinda type",
    bg: "#E0ECF8",
    accent: "#5A7FAF",
  },
  {
    key: "talk",
    href: "/kinda-talk",
    kindaLabel: "talk",
    desc: "カウンセラー・相談所を見る",
    img: "/images/section-counseling.webp",
    alt: "Kinda talk",
    bg: "#FAF3DE",
    accent: "#B89A4A",
  },
  {
    key: "act",
    href: "/kinda-act",
    kindaLabel: "act",
    desc: "お見合いやデートに使いやすい場所",
    img: "/images/section-cafe-pastel.webp",
    alt: "Kinda act",
    bg: "#F5E1E0",
    accent: "#B86E68",
  },
  {
    key: "glow",
    href: "/kinda-glow",
    kindaLabel: "glow",
    desc: "好きな人に会う前に、自分を整える時間",
    img: "/images/section-beauty-n2.png.jpg",
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
  { src: "/images/w_light_rain_start.webp", label: "小雨の始まり" },
  { src: "/images/w_angels_ladder.webp",    label: "天使のはしご" },
  { src: "/images/w_wandering_clouds.webp", label: "迷い雲" },
  { src: "/images/w_sunrise.webp",          label: "朝焼け" },
] as const;

/* ────────────────────────────────────────────────────────────
   Kinda story — ダミーデータ
──────────────────────────────────────────────────────────── */
const STORIES = [
  {
    id: "1",
    quote:
      "「最初はなんとなく始めたんです。決めなきゃって焦ってた時に、カウンセラーさんが『急がなくていい』って言ってくれて、肩の力が抜けました」",
    author: "A.M さん",
    age: "32歳",
    status: "6ヶ月で成婚",
  },
  {
    id: "2",
    quote:
      "「お見合いの後にいつも迷ってしまって、でもそれを責めずに聞いてくれる人がいました。だから続けられていると思います」",
    author: "K.T さん",
    age: "28歳",
    status: "交際3ヶ月",
  },
] as const;

/* ────────────────────────────────────────────────────────────
   コラム・インタビュー — ダミーデータ
──────────────────────────────────────────────────────────── */
const ARTICLES = [
  {
    id: "tanaka-miki-interview",
    category: "INTERVIEW #01",
    title: "「30年間、私が見てきた婚活の本当のこと」",
    author: "田中 美紀さん",
    affiliation: "ブライダルハウス東京",
    slug: "tanaka-miki-interview",
  },
  {
    id: "omiai-chigau-kanjita-toki",
    category: "COLUMN #01",
    title: "「お見合いで『違う』と感じた時、どうすべきか」",
    author: null,
    affiliation: null,
    slug: "omiai-chigau-kanjita-toki",
  },
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
      <div
        style={{
          width: 40,
          height: 1,
          background: "var(--light)",
          margin: "0 auto 20px",
        }}
      />
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
      <div
        style={{
          width: 40,
          height: 1,
          background: "var(--light)",
          margin: "20px auto 0",
        }}
      />
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

  return (
    <>
      <Header />
      <RevealObserver />

      <main style={{ fontFamily: "var(--font-sans)" }}>

        {/* ═══════════════════════════════════════════════════
            A — ヒーロー（フルブリード）
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            width: "100%",
            minHeight: "calc(100svh - 56px)",
            overflow: "hidden",
          }}
        >
          {/* フルブリード背景画像 */}
          <Image
            src={HERO_IMAGE_SRC}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 15%" }}
          />

          {/* 下側グラデーションオーバーレイ — H1/H2 領域をしっかり暗く */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(18,12,8,.18) 30%, rgba(18,12,8,.55) 55%, rgba(18,12,8,.86) 78%, rgba(18,12,8,.94) 100%)",
            }}
          />

          {/* SEO: 構造化データ（JSON-LD） */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSONLD) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
          />

          {/* コンテンツ — 画像下部にオーバーレイ */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "0 24px 28px",
            }}
          >
            {/* H1 — 詩的メインコピー（白文字＋多層シャドウで村背景上で可読） */}
            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontWeight: 500,
                fontSize: "clamp(22px, 6.4vw, 36px)",
                color: "white",
                lineHeight: 1.5,
                letterSpacing: ".02em",
                margin: 0,
                marginBottom: 10,
                textShadow:
                  "0 0 2px rgba(0,0,0,.65), 0 2px 6px rgba(0,0,0,.7), 0 4px 22px rgba(0,0,0,.55)",
              }}
            >
              {HERO_H1_LINE1}
              <br />
              {HERO_H1_LINE2}
            </h1>

            {/* H2 — 機能・カバー範囲を伝える説明文 */}
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 300,
                fontSize: "clamp(12px, 3.4vw, 14px)",
                color: "rgba(255,255,255,.96)",
                lineHeight: 1.7,
                letterSpacing: ".02em",
                margin: 0,
                marginBottom: 16,
                textShadow:
                  "0 0 2px rgba(0,0,0,.6), 0 1px 4px rgba(0,0,0,.65), 0 2px 12px rgba(0,0,0,.5)",
              }}
            >
              {HERO_H2}
            </h2>

            {/* ロゴ — ごく小さく、ブランドマーク程度に控える
                ※ PNG 自体に白い余白が多いので、トリミング後はより小さく見せられる */}
            <div
              style={{
                marginBottom: 18,
                display: "inline-block",
              }}
            >
              <Image
                src="/images/toppage_name.PNG"
                alt="Kinda ふたりへ"
                width={400}
                height={120}
                priority
                style={{
                  display: "block",
                  width: "min(24vw, 110px)",
                  height: "auto",
                  objectFit: "contain",
                  opacity: 0.88,
                  filter: "drop-shadow(0 1px 4px rgba(0,0,0,.4))",
                }}
              />
            </div>

            {/* 主CTA — Kinda note（軽い気持ちの整理から始める） */}
            <Link
              href="/kinda-note"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "18px 24px",
                background: "#D4A090",
                color: "white",
                borderRadius: 999,
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: ".03em",
                textDecoration: "none",
                marginBottom: 10,
                transition: "transform .2s, box-shadow .2s",
                boxShadow:
                  "0 0 32px rgba(212,160,144,.55), 0 8px 24px rgba(212,160,144,.5), 0 2px 6px rgba(0,0,0,.14)",
              }}
            >
              いまの気持ちを整理する
              <ArrowRight color="white" />
            </Link>

            {/* マイクロコピー — 軽さと安心感を伝える */}
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.85)",
                textAlign: "center",
                letterSpacing: ".06em",
                marginBottom: 18,
                textShadow: "0 1px 3px rgba(0,0,0,.4)",
                fontFamily: "var(--font-sans)",
              }}
            >
              ✓ 60秒で言葉になる　✓ 登録不要　✓ 相談前の整理に
            </p>

            {/* 区切り線 + ラベル — 副CTAへの導線 */}
            <div
              aria-hidden="true"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.28)",
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,.72)",
                  letterSpacing: ".08em",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-sans)",
                  textShadow: "0 1px 3px rgba(0,0,0,.4)",
                  margin: 0,
                }}
              >
                やりたいことが決まっている方は
              </p>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.28)",
                }}
              />
            </div>

            {/* 副CTA — Kinda type / Kinda talk（テキストリンク風） */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Link
                href="/kinda-type"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "rgba(255,255,255,.94)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,.4)",
                  paddingBottom: 2,
                  letterSpacing: ".04em",
                  fontFamily: "var(--font-sans)",
                  textShadow: "0 1px 3px rgba(0,0,0,.4)",
                }}
              >
                自分に合う担当を見つける
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/kinda-talk"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "rgba(255,255,255,.94)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,.4)",
                  paddingBottom: 2,
                  letterSpacing: ".04em",
                  fontFamily: "var(--font-sans)",
                  textShadow: "0 1px 3px rgba(0,0,0,.4)",
                }}
              >
                カウンセラーを見てみる
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
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
            {/* eyebrow */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                letterSpacing: ".18em",
                color: "#D4A090",
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: 14,
              }}
            >
              Kinda <em style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>note</em>
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
              あなたの気持ちは、いま、どんな天気？
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
              うまく言葉にできない不安や迷いも、
              <br />
              天気のメタファーを通して、自分の気持ちが見えてきます。
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
              {NOTE_WEATHERS.map((w) => (
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
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "white",
                      boxShadow: "0 4px 14px rgba(180,140,110,.14)",
                      position: "relative",
                      marginBottom: 8,
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

            {/* 全20種であることをそっと伝える（"これだけ?" を防ぐ） */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                color: "var(--muted)",
                textAlign: "center",
                letterSpacing: ".06em",
                margin: "-8px 0 28px",
              }}
            >
              全20種の天気から、自分の気持ちに近いものを選べます。
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
            B — もう決まっている方へ
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "48px 24px 64px",
            background: "#FEFCFA",
          }}
        >
          {/* ラベル */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                letterSpacing: ".16em",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
              }}
            >
              やりたいことが決まっている方へ
            </p>
            <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
          </div>

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
          <div style={{ textAlign: "center", marginBottom: 24, padding: "0 20px" }}>
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
              Kinda talk{" "}
              <em
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  color: "var(--accent)",
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
            C — ふたりの物語（Kinda story 抜粋）
        ═══════════════════════════════════════════════════ */}
        <section
          id="stories"
          style={{
            padding: "64px 24px",
            background: "#FEFCFA",
            scrollMarginTop: 80,
          }}
        >
          <SectionLabel label="ふたりの物語" en="Kinda story" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 560,
              margin: "0 auto 32px",
            }}
          >
            {STORIES.map((story) => (
              <Link
                key={story.id}
                href={`/kinda-story/${story.id}`}
                style={{
                  display: "block",
                  background: "var(--white)",
                  borderRadius: 20,
                  padding: 24,
                  border: "1px solid var(--light)",
                  textDecoration: "none",
                  transition: "transform .3s, box-shadow .3s",
                }}
              >
                {/* 画像プレースホルダー */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    background: "#F5EEE6",
                    border: "1px solid #EAE0D8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"
                      stroke="var(--accent)"
                      strokeWidth="1.3"
                      fill="rgba(212,160,144,.12)"
                    />
                  </svg>
                </div>

                {/* 引用文 */}
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: 17,
                    color: "var(--ink)",
                    lineHeight: 1.9,
                    marginBottom: 14,
                  }}
                >
                  {story.quote}
                </p>

                {/* 著者情報 */}
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--mid)",
                    marginBottom: 12,
                  }}
                >
                  — {story.author}（{story.age}）&nbsp;&nbsp;{story.status}
                </p>

                {/* 続きを読む */}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                  }}
                >
                  続きを読む
                  <ArrowRight color="var(--accent)" />
                </div>
              </Link>
            ))}
          </div>

          {/* もっと読む */}
          <div style={{ textAlign: "center" }}>
            <GhostButton href="/kinda-story">
              もっと読む
              <ArrowRight />
            </GhostButton>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            C' — ふたりを見守る人たち（取材・コラム）
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "64px 24px",
            background: "#FEFCFA",
          }}
        >
          <SectionLabel label="ふたりを見守る人たち" en="interview & column" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 560,
              margin: "0 auto 32px",
            }}
          >
            {ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={`/column/${article.slug}`}
                style={{
                  display: "block",
                  background: "var(--white)",
                  borderRadius: 20,
                  padding: 24,
                  border: "1px solid var(--light)",
                  textDecoration: "none",
                  transition: "transform .3s, box-shadow .3s",
                }}
              >
                {/* 画像プレースホルダー */}
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    background: "#F5EEE6",
                    border: "1px solid #EAE0D8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#B0A090",
                      fontFamily: "monospace",
                      textAlign: "center",
                      padding: "0 8px",
                    }}
                  >
                    [image: {article.slug}]
                  </span>
                </div>

                {/* カテゴリタグ */}
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {article.category}
                </p>

                {/* タイトル */}
                <p
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: 17,
                    color: "var(--ink)",
                    lineHeight: 1.7,
                    marginBottom: 10,
                  }}
                >
                  {article.title}
                </p>

                {/* 著者（インタビュー記事のみ） */}
                {article.author && (
                  <p style={{ fontSize: 12, color: "var(--mid)", marginBottom: 12 }}>
                    {article.author}
                    {article.affiliation && `　${article.affiliation}`}
                  </p>
                )}

                {/* 読む */}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                  }}
                >
                  読む
                  <ArrowRight color="var(--accent)" />
                </div>
              </Link>
            ))}
          </div>

          {/* コラム一覧へ */}
          <div style={{ textAlign: "center" }}>
            <GhostButton href="/column">
              コラム一覧へ
              <ArrowRight />
            </GhostButton>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            D — Kinda ふたりへについて（Brand Belief）
        ═══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "64px 24px",
            background: "#FAF5EE",
          }}
        >
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
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--ink)",
                lineHeight: 2.0,
                marginBottom: 24,
              }}
            >
              <em>既存のレビューサイトは、</em>
              <br />
              <em>関係が成立した人のためにある。</em>
            </p>

            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--ink)",
                lineHeight: 2.0,
                marginBottom: 24,
              }}
            >
              Kinda ふたりへは、
              <br />
              <em>今まさに関係を築いている</em>
              <br />
              <em>あなたたちのためにある。</em>
            </p>

            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--ink)",
                lineHeight: 2.0,
              }}
            >
              不安なまま相談所に
              <br />
              飛び込まなくていい。
              <br />
              入会前から交際後まで
              <br />
              あなたのそばにいます。
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
