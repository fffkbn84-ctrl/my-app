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
const HERO_TAGLINE = "なんとなく、いいふたりへ";
const HERO_IMAGE_SRC = "/images/hero-couple-new.png.PNG";

/* ────────────────────────────────────────────────────────────
   「やりたいことが決まっている方へ」カード定義
──────────────────────────────────────────────────────────── */
const DECIDED_CARDS = [
  {
    key: "type",
    href: "/kinda-type",
    kindaLabel: "type",
    desc: "自分に合うカウンセラーを見つける",
    img: "/images/section-kinda-type.png.PNG",
    alt: "Kinda type",
  },
  {
    key: "talk",
    href: "/kinda-talk",
    kindaLabel: "talk",
    desc: "カウンセラー・相談所を直接見る",
    img: "/images/section-counseling.png",
    alt: "Kinda talk",
  },
  {
    key: "meet",
    href: "/kinda-meet",
    kindaLabel: "meet",
    desc: "お見合いやデートの場所",
    img: "/images/section-cafe-pastel.png.PNG",
    alt: "Kinda meet",
  },
  {
    key: "glow",
    href: "/kinda-glow",
    kindaLabel: "glow",
    desc: "好きな人に会う前に、自分を整える",
    img: "/images/section-beauty-n2.png.jpg",
    alt: "Kinda glow",
  },
] as const;

/* ────────────────────────────────────────────────────────────
   A' — Kinda note 天気アイコン（5種）
──────────────────────────────────────────────────────────── */
const WEATHER_ITEMS = [
  { key: "pre_dawn", label: "夜明け前", src: "/images/w_pre_dawn.webp" },
  { key: "light_rain_start", label: "小雨のはじまり", src: "/images/w_light_rain_start.webp" },
  { key: "angels_ladder", label: "天使の梯子", src: "/images/w_angels_ladder.webp" },
  { key: "light_sunrise", label: "淡い朝焼け", src: "/images/w_light_sunrise.webp" },
  { key: "twilight", label: "夕暮れ", src: "/images/w_twilight.webp" },
] as const;

/* ────────────────────────────────────────────────────────────
   A'' — Kinda note ユースケース（2グループ × 4項目）
──────────────────────────────────────────────────────────── */
const KN_USECASES_PAUSE = [
  "カウンセラーになんて伝えればいいか分からない",
  "お見合いの後、ことばにならない違和感があった",
  "交際中、なぜか不安が消えない",
  "複数の人で、気持ちが揺れている",
] as const;

const KN_USECASES_MOVE = [
  "好きな人ができた、その気持ちを整理したい",
  "「好き」をどう伝えればいいか考えたい",
  "大事なデートの前、自分の気持ちを見つめたい",
  "節目のとき、いまの自分を残しておきたい",
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
            style={{ objectFit: "cover", objectPosition: "center 15%" }}
          />

          {/* 下側グラデーションオーバーレイ */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 30%, rgba(18,12,8,.68) 80%, rgba(18,12,8,.82) 100%)",
            }}
          />

          {/* コンテンツ — 画像下部にオーバーレイ */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "0 24px 36px",
            }}
          >
            {/* ロゴ行 */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontWeight: 500,
                  fontSize: "clamp(44px, 12vw, 56px)",
                  color: "white",
                  lineHeight: 1,
                }}
              >
                Kinda
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontWeight: 400,
                  fontSize: "clamp(14px, 4vw, 18px)",
                  color: "rgba(255,255,255,.75)",
                  letterSpacing: ".1em",
                }}
              >
                ふたりへ
              </span>
            </div>

            {/* タグライン */}
            <p
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(16px, 4.5vw, 20px)",
                color: "rgba(255,255,255,.9)",
                lineHeight: 1.8,
                marginBottom: 28,
                letterSpacing: ".02em",
              }}
            >
              {HERO_TAGLINE}
            </p>

            {/* 主CTA */}
            <Link
              href="/kinda-note"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "18px 24px",
                background: "var(--accent)",
                color: "white",
                borderRadius: 999,
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                letterSpacing: ".03em",
                textDecoration: "none",
                marginBottom: 14,
                transition: "opacity .2s",
              }}
            >
              Kinda note で今のあなたがわかる
              <ArrowRight color="white" />
            </Link>

            {/* 補足テキスト */}
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.55)",
                textAlign: "center",
                letterSpacing: ".05em",
              }}
            >
              1分で終わる・会員登録なし
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            A' — Kinda note 説明（天気）
        ═══════════════════════════════════════════════════ */}
        <section style={{ padding: "56px 24px 24px", background: "#FEFCFA" }}>
          <SectionLabel label="あなたの気持ちは、いま、どんな天気？" en="kinda note" />

          <p
            style={{
              maxWidth: 480,
              margin: "0 auto 28px",
              textAlign: "center",
              fontSize: 14,
              color: "var(--mid)",
              lineHeight: 1.9,
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

          <div className="kn-weather-scroll" aria-label="天気メタファー一覧">
            {WEATHER_ITEMS.map((w) => (
              <div key={w.key} className="kn-weather-item">
                <div className="kn-weather-img-wrap">
                  <Image src={w.src} alt={w.label} fill style={{ objectFit: "cover" }} sizes="96px" />
                </div>
                <p className="kn-weather-label">{w.label}</p>
              </div>
            ))}
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "28px auto 28px",
              maxWidth: 480,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
              color: "var(--mid)",
              lineHeight: 1.7,
            }}
          >
            <li>✓ 60秒で、いまの気持ちが言葉になる</li>
            <li>✓ 整理したメモは、そのままカウンセラーに渡せる</li>
            <li>✓ 何度でも、気持ちが揺れたときに</li>
          </ul>

          <div style={{ textAlign: "center" }}>
            <Link
              href="/kinda-note"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 36px",
                background: "var(--accent)",
                color: "white",
                borderRadius: 999,
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                letterSpacing: ".03em",
                textDecoration: "none",
              }}
            >
              気持ちを整理する
              <ArrowRight color="white" />
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            A'' — Kinda note は、こんな時に使えます
        ═══════════════════════════════════════════════════ */}
        <section style={{ padding: "48px 24px 64px", background: "#FEFCFA" }}>
          <SectionLabel label="Kinda note は、こんな時に使えます" />

          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <h3 className="kn-usecase-h3">ふと立ち止まったとき</h3>
            <div className="kn-usecase-box">
              <ul className="kn-usecase-list">
                {KN_USECASES_PAUSE.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>

            <h3 className="kn-usecase-h3" style={{ marginTop: 24 }}>
              気持ちが動いたとき
            </h3>
            <div className="kn-usecase-box">
              <ul className="kn-usecase-list">
                {KN_USECASES_MOVE.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>

            <p
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: 16,
                color: "var(--ink)",
                textAlign: "center",
                margin: "32px 0 16px",
              }}
            >
              入会前から交際後まで、何度でも。
            </p>

            <div style={{ textAlign: "center" }}>
              <Link
                href="/kinda-note"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 36px",
                  background: "var(--accent)",
                  color: "white",
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  letterSpacing: ".03em",
                  textDecoration: "none",
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
                  background: "var(--white)",
                  borderRadius: 16,
                  border: "1px solid var(--light)",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(200,169,122,.08)",
                  textDecoration: "none",
                  transition: "transform .3s, box-shadow .3s",
                }}
              >
                {/* 画像エリア */}
                <div
                  style={{
                    aspectRatio: "1/1",
                    background: "#F5EEE6",
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

                {/* テキストエリア */}
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
                        color: "var(--accent)",
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
          style={{
            padding: "64px 24px",
            background: "#FEFCFA",
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
            D — ふたりへについて（Brand Belief）
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
              <em>関係が確立した人のためのもの。</em>
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
              <em>いまに関係を築いている</em>
              <br />
              <em>あなたたちのためのもの。</em>
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
              入会前から交際後まで、
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
