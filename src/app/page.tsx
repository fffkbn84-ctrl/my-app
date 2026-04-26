import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import HomeReelCarousel from "@/components/home/HomeReelCarousel";
import { COUNSELORS } from "@/lib/data";

/* ────────────────────────────────────────────────────────────
   定数（1箇所変更で全体に反映）
──────────────────────────────────────────────────────────── */
const HERO_TAGLINE = "なんとなく、いいふたりへ";
const HERO_IMAGE_SRC = "/images/hero-couple-new.png.PNG";

/* ────────────────────────────────────────────────────────────
   「もう決まっている方へ」カード定義
──────────────────────────────────────────────────────────── */
const DECIDED_CARDS = [
  {
    key: "type",
    href: "/kinda-type",
    kindaLabel: "type",
    desc: "診断で、合うカウンセラーが見つかる",
    img: "/images/section-kinda-type.png.PNG",
    alt: "Kinda type",
  },
  {
    key: "talk",
    href: "/kinda-talk",
    kindaLabel: "talk",
    desc: "カウンセラー・相談所を見る",
    img: "/images/section-counseling.png",
    alt: "Kinda talk",
  },
  {
    key: "meet",
    href: "/kinda-meet",
    kindaLabel: "meet",
    desc: "お見合いやデートに使いやすい場所を見る",
    img: "/images/section-cafe-pastel.png.PNG",
    alt: "Kinda meet",
  },
  {
    key: "glow",
    href: "/kinda-glow",
    kindaLabel: "glow",
    desc: "美容を整える",
    img: "/images/section-beauty-n2.png.jpg",
    alt: "Kinda glow",
  },
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
export default function HomePage() {
  // ホームのリールカルーセル用：ダミーも含む一覧から rating × log(reviewCount+2) で上位 6 件
  const homeReelCounselors = [...COUNSELORS]
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
              もう決まっている方へ
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
