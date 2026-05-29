import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

export const metadata = {
  title: "Kinda ふたりへとは｜担当を選んで予約できる婚活サービス",
  description:
    "Kinda ふたりへは、担当カウンセラーを自分の目で選んで納得してから始められる婚活サービスです。面談した人だけが書ける口コミ、カウンセラーへの直接予約、気持ちを整理する Kinda note を提供しています。運営チーム・編集ポリシー・収益のしくみも公開しています。",
  keywords: [
    "Kinda ふたりへ",
    "Kinda ふたりへ とは",
    "結婚相談所 サービス",
    "婚活 カウンセラー 口コミ",
    "結婚相談所 比較",
    "婚活 サービス 運営",
  ],
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Kinda ふたりへとは｜担当を選んで予約できる婚活サービス",
    description:
      "担当カウンセラーを自分の目で選んで、納得してから始める。面談した人だけが書ける口コミと、気持ちを整理する Kinda note。運営の透明性も公開しています。",
    type: "website",
    locale: "ja_JP",
    siteName: "Kinda ふたりへ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinda ふたりへとは｜担当を選んで予約できる婚活サービス",
    description:
      "担当を自分の目で選んで、納得してから始める婚活サービス。運営チーム・編集ポリシー・収益のしくみも公開。",
  },
};

export default function AboutPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kinda ふたりへ",
    alternateName: ["Kinda", "カインダ ふたりへ"],
    url: "https://www.kinda-futari.app",
    description:
      "担当者を自分の目で選んで納得してから始められる婚活サービス。面談した人だけが書ける口コミと、カウンセラーへの直接予約を提供しています。",
    founder: {
      "@type": "Person",
      name: "ふうか",
      jobTitle: "代表",
      description:
        "結婚相談所で5年間勤務しトップレベルの成婚率を維持したのち独立。FP2級技能士・証券外務員一種・宅地建物取引士の資格を持ち、婚活とお金の両面から伴走する。Kinda ふたりへ の創業者。",
      knowsAbout: ["結婚相談所", "婚活", "ファイナンシャルプランニング"],
    },
  };

  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {/* Kinda 村のクレイ風背景（ぼかし固定） */}
      <div className="about-village-bg" aria-hidden="true" />
      <main>
      <SectionSubHeader sectionName="ホーム" sectionRoot="/" />
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kindaについて" }]} />


      {/* ━━━━━━━━━━━━━━━━━━━━
          ① ヒーロー（Apple 風：ウォームベージュ背景・濃文字・余裕のある余白）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#FBF7F1",
          padding: "clamp(80px, 14vw, 160px) 32px clamp(80px, 12vw, 140px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            ABOUT US
          </p>
          <h1
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 5.4vw, 56px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            ふたりになるまでの、
            <br />
            全部をここで。
          </h1>

          <div
            style={{
              height: 1,
              background: "rgba(26,19,14,.08)",
              margin: "56px 0",
            }}
          />

          <div
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: "clamp(17px, 2.4vw, 22px)",
              color: "#2E2620",
              lineHeight: 2.3,
              letterSpacing: ".04em",
            }}
          >
            <p style={{ margin: 0 }}>あなたとあの人が出会うこと</p>
            <p style={{ margin: 0 }}>それは、世界中でふたりにしか起こせないこと</p>
            <p style={{ margin: 0, marginTop: "1.8em" }}>はじめての恋愛でも</p>
            <p style={{ margin: 0 }}>結婚を考え始めたばかりでも</p>
            <p style={{ margin: 0 }}>再婚でも</p>
            <p style={{ margin: 0 }}>子連れでも</p>
            <p style={{ margin: 0 }}>何度目の春でも</p>
            <p style={{ margin: 0, marginTop: "1.8em" }}>誰かと「ふたり」になる瞬間は</p>
            <p style={{ margin: 0 }}>いつだって、はじめてです</p>
            <p
              style={{
                margin: 0,
                marginTop: "2em",
                fontSize: "clamp(20px, 3.2vw, 30px)",
                color: "#D4A090",
                fontWeight: 500,
              }}
            >
              その瞬間のために、<span className="brand-name">Kinda ふたりへ</span>
            </p>

            {/* Kinda の語源を一行で（ブランド名の腑落ち）*/}
            <p
              style={{
                margin: "3em 0 0",
                fontFamily: "'Shippori Mincho', serif",
                fontStyle: "italic",
                fontSize: "clamp(13px, 1.6vw, 15px)",
                color: "#6B5D52",
                letterSpacing: ".06em",
                lineHeight: 2,
              }}
            >
              Kinda — 英語で「なんとなく」。
              <br />
              そして &ldquo;my kinda&rdquo; と言えば、「私にぴったりの」。
              <br />
              決めなくていい余白と、しっくりくる感覚から、
              <br />
              ふたりは始まる。
            </p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ② メインコピー（Apple 風：純白背景・大きな見出し・余白）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#FFFFFF",
          padding: "clamp(96px, 14vw, 160px) 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(28px, 5vw, 52px)",
              color: "#1A130E",
              letterSpacing: ".06em",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            出会いは、人で決まる。
          </h2>
          <p
            style={{
              marginTop: 32,
              fontSize: "clamp(15px, 1.9vw, 18px)",
              color: "#6B5D52",
              lineHeight: 2.2,
              fontFamily: "'Noto Sans JP', sans-serif",
              letterSpacing: ".04em",
            }}
          >
            担当者を自分の目で選んで、
            <br />
            納得してから始められる婚活を。
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ③ なぜ作ったか（Apple 風：白背景・大きな見出し）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "clamp(96px, 14vw, 160px) 32px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            WHY WE BUILT THIS
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.5,
              marginBottom: 48,
            }}
          >
            なぜ、作ったのか
          </h2>
          <div
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "#2E2620",
              lineHeight: 2.2,
            }}
          >
            <p style={{ margin: "0 0 1.6em" }}>
              既存のレビューサイトは、関係が成立した人のためにある。
            </p>
            <p style={{ margin: "0 0 .4em" }}>結婚した人が振り返って書くレビュー。</p>
            <p style={{ margin: "0 0 1.6em" }}>成婚した人だけが語れるストーリー。</p>
            <p style={{ margin: "0 0 1.6em" }}>
              それはとても大切なものだけれど、
              <br />
              今まさに婚活をしている人には届かない。
            </p>
            <p style={{ margin: "0 0 .4em" }}>カウンセラーを選ぶ前の不安</p>
            <p style={{ margin: "0 0 .4em" }}>お見合い前夜の緊張</p>
            <p style={{ margin: "0 0 1.6em" }}>断られた翌朝の気持ち</p>
            <p style={{ margin: "0 0 1.6em" }}>
              そういう瞬間に寄り添える場所が
              <br />
              なかった。
            </p>
            <p style={{ margin: "0 0 .4em" }}>だから作りました。</p>
            <p style={{ margin: 0 }}>
              今まさに関係を作っているあなたのための
              <br />
              レビューと予約と、頑張れる場所を。
            </p>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ④ Kinda ふたりへが信じること
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#FBF7F1",
          padding: "clamp(96px, 14vw, 160px) 32px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            OUR BELIEF
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.5,
              marginBottom: 0,
            }}
          >
            <span className="brand-name">Kinda ふたりへ</span>が信じること
          </h2>

          <div className="about-belief-grid">
            {[
              {
                num: "01",
                title: "カウンセラーは、人で選ぶ",
                body: "相談所のブランドより、目の前のカウンセラーがどんな人かの方が、あなたの婚活を左右する。だから私たちは、カウンセラー個人のプロフィールと口コミを中心に据えた。",
              },
              {
                num: "02",
                title: "口コミは、体験した人だけが書く",
                body: "面談していない人の声は、ここにはない。Kinda ふたりへ経由で面談を完了した人だけが投稿できる仕組みにしているのは、あなたに正直な情報だけを届けたいから。",
              },
              {
                num: "03",
                title: "婚活の孤独は、ひとりにしない",
                body: "断られた日も、迷っている夜も、誰かに話せる場所があればいい。婚活は孤独になりやすい。だからKinda ふたりへは、頑張れる場所でもありたい。",
              },
              {
                num: "04",
                title: "ふたりの時間に、いい場所を渡す",
                body: "出会いのカフェから、婚活準備の美容室、成婚後の記念日まで。\n\nはじめてでも、もう一度でも。婚活中だけじゃなく、ふたりになったあとも\nずっと使えるサービスでありたい。",
              },
            ].map((belief) => (
              <div key={belief.num} className="about-belief-card">
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 48,
                    color: "rgba(212,160,144,.7)",
                    lineHeight: 1,
                    marginBottom: 18,
                  }}
                >
                  {belief.num}
                </div>
                <h3
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontWeight: 500,
                    fontSize: "clamp(20px, 2.4vw, 24px)",
                    color: "#1A130E",
                    letterSpacing: ".04em",
                    marginBottom: 16,
                  }}
                >
                  {belief.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "clamp(15px, 1.6vw, 17px)",
                    color: "#4A4038",
                    lineHeight: 2.05,
                    margin: 0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {belief.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑤ Kinda ふたりへでできること（Apple 風：ベージュ背景）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "clamp(96px, 14vw, 160px) 32px", background: "#FBF7F1" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            WHAT YOU CAN DO
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.5,
              marginBottom: 56,
            }}
          >
            <span className="brand-name">Kinda ふたりへ</span>でできること
          </h2>

          {/* ① カウンセラーを選ぶ */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 40 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F4E5CC, #E0CDA8)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(180,140,90,.15), inset 0 1px 0 rgba(255,255,255,.55)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="4" stroke="#A88858" strokeWidth="1.5" />
                <path
                  d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                  stroke="#A88858"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontWeight: 500,
                  fontSize: 18,
                  color: "var(--black)",
                  letterSpacing: ".04em",
                  marginBottom: 8,
                }}
              >
                担当者を自分で選ぶ
              </h3>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  color: "var(--mid)",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                面談した人だけが書けるレビューを読んで、
                <br />
                気に入った担当者に直接予約できる。
                <br />
                相談所のブランドではなく、人を見て選べる。
              </p>
            </div>
          </div>

          {/* ② お店を見つける */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 40 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #DCE8DA, #B4CDB6)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(100,130,100,.15), inset 0 1px 0 rgba(255,255,255,.55)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 9l8-6 8 6v11H3V9z"
                  stroke="#5A8068"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 20v-6h4v6"
                  stroke="#5A8068"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontWeight: 500,
                  fontSize: 18,
                  color: "var(--black)",
                  letterSpacing: ".04em",
                  marginBottom: 8,
                }}
              >
                ふたりのお店を見つける
              </h3>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  color: "var(--mid)",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                お見合いのカフェ、婚活前の美容室、
                <br />
                記念日のレストラン。
                <br />
                <span className="brand-name">Kinda ふたりへ</span>が取材・厳選したお店を、
                <br />
                口コミと一緒に探せる。
              </p>
            </div>
          </div>

          {/* ③ 仲間と頑張る */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 0 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #DAE3F0, #B6C4DC)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(90,120,170,.15), inset 0 1px 0 rgba(255,255,255,.55)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 19C11 19 3 13.5 3 8C3 5.5 5 3.5 7.5 3.5C9 3.5 10.5 4.5 11 6C11.5 4.5 13 3.5 14.5 3.5C17 3.5 19 5.5 19 8C19 13.5 11 19 11 19Z"
                  stroke="#4F76A8"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontWeight: 500,
                  fontSize: 18,
                  color: "var(--black)",
                  letterSpacing: ".04em",
                  marginBottom: 8,
                }}
              >
                孤独じゃない婚活を
              </h3>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  color: "var(--mid)",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                婚活は、孤独になりやすい。
                <br />
                今日頑張ったこと、うれしかったこと。
                <br />
                小さな一歩を報告できる場所が、ここにある。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑤' Kinda のしくみ（5つの Kinda 一覧・Apple 風：白背景）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "clamp(96px, 14vw, 160px) 32px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            KINDA SERIES
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            5つの<span className="brand-name"> Kinda</span>、ひとつの場所で。
          </h2>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "#6B5D52",
              lineHeight: 2.1,
              marginBottom: 48,
            }}
          >
            気持ちの整理から、ふたりが過ごす日々まで。
            <br />
            Kinda は5つの役割で、あなたのそばにいます。
          </p>

          {/* 5つの Kinda サービスカード（2×n グリッド） */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              {
                key: "note",
                href: "/kinda-note",
                suffix: "note",
                accent: "#D4A090",
                bg: "#FAF1EB",
                desc: "言葉にならない気持ちを整理する",
              },
              {
                key: "type",
                href: "/kinda-type",
                suffix: "type",
                accent: "#5A7FAF",
                bg: "#E0ECF8",
                desc: "診断するだけで合うカウンセラーが見つかる",
              },
              {
                key: "talk",
                href: "/kinda-talk",
                suffix: "talk",
                accent: "#B89A4A",
                bg: "#FAF3DE",
                desc: "ぴったりのカウンセラーに直接会う",
              },
              {
                key: "act",
                href: "/kinda-act",
                suffix: "act",
                accent: "#B86E68",
                bg: "#F5E1E0",
                desc: "お見合いやデートに使いやすい場所",
              },
              {
                key: "glow",
                href: "/kinda-glow",
                suffix: "glow",
                accent: "#8A66B0",
                bg: "#EDE0F4",
                desc: "好きな人に会う前に、自分を整える",
              },
            ].map((svc) => (
              <Link
                key={svc.key}
                href={svc.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 124,
                  background: svc.bg,
                  borderRadius: 16,
                  padding: "18px 18px 14px",
                  border: "1px solid rgba(0,0,0,.06)",
                  textDecoration: "none",
                  transition: "transform .25s, box-shadow .25s",
                  boxShadow:
                    "0 2px 10px rgba(180,140,90,.10), inset 0 1px 0 rgba(255,255,255,.5)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Shippori Mincho', serif",
                      fontSize: 18,
                      color: "var(--black)",
                      margin: "0 0 6px",
                      letterSpacing: ".03em",
                    }}
                  >
                    Kinda{" "}
                    <em
                      style={{
                        fontStyle: "italic",
                        color: svc.accent,
                        fontFamily: "'DM Serif Display', serif",
                      }}
                    >
                      {svc.suffix}
                    </em>
                  </p>
                  <p
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 12,
                      color: "var(--mid)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {svc.desc}
                  </p>
                </div>
                {/* 矢印（右下にタップ可能感を出す） */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 10,
                  }}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M7 2l5 5-5 5"
                      stroke={svc.accent}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑥ 数字で見るKinda ふたりへ
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#FBF7F1",
          padding: "clamp(96px, 14vw, 160px) 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            BY THE NUMBERS
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.5,
              marginBottom: 48,
            }}
          >
            数字で見る<span className="brand-name">Kinda ふたりへ</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
            }}
          >
            {[
              { num: "247", label: "掲載カウンセラー数" },
              { num: "1,840", label: "累計口コミ数" },
              { num: "5", label: "掲載エリア" },
              { num: "無料", label: "ご利用料金" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 48,
                    color: "var(--black)",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    color: "var(--muted)",
                    letterSpacing: ".1em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑦ 運営チームより（Apple 風：白背景・大きな見出し）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "clamp(96px, 14vw, 160px) 32px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: ".2em",
              color: "#D4A090",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            OUR TEAM
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(26px, 4.2vw, 42px)",
              color: "#1A130E",
              letterSpacing: ".04em",
              lineHeight: 1.5,
              marginBottom: 56,
            }}
          >
            運営チームより
          </h2>

          {/* 代表（ふうか）— 経歴つきフィーチャーカード */}
          <div
            style={{
              background: "rgba(255,253,247,.6)",
              border: "1px solid rgba(180,140,90,.14)",
              borderRadius: 20,
              padding: "32px 28px",
              marginBottom: 40,
              textAlign: "left",
              boxShadow: "0 4px 18px rgba(180,140,90,.08), inset 0 1px 0 rgba(255,255,255,.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #EDE0D4, #D4C4B0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(180,140,110,.14), inset 0 1px 0 rgba(255,255,255,.5)",
                }}
                aria-hidden="true"
              >
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    fontSize: 30,
                    color: "rgba(255,255,255,.92)",
                    textShadow: "0 1px 2px rgba(0,0,0,.06)",
                  }}
                >
                  F
                </span>
              </div>
              <div>
                <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 20, color: "var(--black)", marginBottom: 4 }}>
                  ふうか
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase" }}>
                  代表 / Founder
                </p>
              </div>
            </div>

            <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13.5, color: "var(--mid)", lineHeight: 2, margin: "0 0 16px" }}>
              新卒で大手自動車メーカーの接客・提案の仕事を経験したのち、結婚相談所に5年間勤務。
              在籍中はトップレベルの成婚率を維持してきました。婚活の現場ではお金にまつわる相談も多く、
              よりお客様の側に立って伴走するために、FP2級技能士・証券外務員一種・宅地建物取引士の資格を取得。
              その後、独立して Kinda ふたりへ を立ち上げました。
            </p>
            <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13.5, color: "var(--mid)", lineHeight: 2, margin: "0 0 16px" }}>
              相談所に勤めるなかで、改善したいことを伝えても、企業の中ではなかなかスピードが出せないもどかしさがありました。
              そのうちに気づいたのは、相談所とユーザーのあいだにある「気持ち」のこと。
              人の心は0か100ではなく、たいてい複雑な感情と一緒にあります。
              悩んだり、嬉しかったりしながら、ゆるく進んでいける場所がほしい。
              そして、カウンセラーとの相性で婚活の進み方は驚くほど変わる——だからこそ、
              不透明になりがちなカウンセラーを「見える」ようにしたかった。
              自分の気持ちも見えて、カウンセラーのことも見える。見えることで、ようやく自分と向き合いながら進んでいける。
              そう思って Kinda をつくりました。
            </p>
            <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--muted)", lineHeight: 1.9, margin: 0 }}>
              趣味はサーキット場に通うこと。いつか自分でも走れるようになるのが目標です。
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
            className="about-team-grid"
          >
            {[
              {
                name: "るな",
                initial: "R",
                role: "設計 / デザイン",
                quote: "楽天的だけど、繊細な寄り添いができる唯一無二の存在。",
                gradient: "linear-gradient(135deg, #D8E4D8, #C0D4C2)",
              },
              {
                name: "つよし",
                initial: "T",
                role: "共同代表 / 全国取材",
                quote: "予約の取れない金融の専門家。お金のことなら、この人に聞けばたいてい分かる。",
                gradient: "linear-gradient(135deg, #D4DDE8, #C0CCDA)",
              },
              {
                name: "みづき",
                initial: "M",
                role: "取材 / コラム",
                quote: "実際に足を運んで、正直に書きます",
                gradient: "linear-gradient(135deg, #E8EEF0, #D0DFE4)",
              },
              {
                name: "あかり",
                initial: "A",
                role: "コラム / お店担当",
                quote: "婚活中のあなたに、本当に使えるお店を",
                gradient: "linear-gradient(135deg, #FCE8E5, #F0D0CC)",
              },
              {
                name: "さき",
                initial: "S",
                role: "コラム / カウンセラー取材",
                quote: "カウンセラーの人となりを、正直にお届けします",
                gradient: "linear-gradient(135deg, #E8D8EE, #D4C0E2)",
              },
            ].map((member) => (
              <div key={member.name} style={{ textAlign: "center" }}>
                {/* シンプルなパステルグラデーション円 + DM Serif italic イニシャル */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: member.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 4px 14px rgba(180,140,110,.12), inset 0 1px 0 rgba(255,255,255,.5)",
                  }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontStyle: "italic",
                      fontSize: 32,
                      color: "rgba(255,255,255,.92)",
                      letterSpacing: "0.02em",
                      textShadow: "0 1px 2px rgba(0,0,0,.06)",
                    }}
                  >
                    {member.initial}
                  </span>
                </div>
                <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>
                  {member.name}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>
                  {member.role}
                </p>
                <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                  {member.quote}
                </p>
              </div>
            ))}
          </div>

          {/* 編集ポリシー・運営の透明性への導線 */}
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 12,
              color: "var(--mid)",
              lineHeight: 1.9,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            わたしたちの取材・執筆の方針は{" "}
            <Link href="/about/editorial-policy" style={{ color: "var(--accent-deep, #A88858)", textDecoration: "underline" }}>
              編集ポリシー
            </Link>
            、運営の収益や並び順の考え方は{" "}
            <Link href="/about/transparency" style={{ color: "var(--accent-deep, #A88858)", textDecoration: "underline" }}>
              運営の透明性
            </Link>{" "}
            にまとめています。
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑧ 締め（Apple 風：ライト背景・大きな見出し・余白）
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#FBF7F1",
          padding: "clamp(96px, 14vw, 160px) 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(28px, 5vw, 46px)",
              color: "#1A130E",
              letterSpacing: ".06em",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            あなたの婚活を、孤独にしない。
          </h2>
          <div
            style={{
              marginTop: 56,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* 主CTA — Kinda note（ヒーローと同じローズゴールド主CTA） */}
            <Link
              href="/kinda-note"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                minWidth: 280,
                padding: "18px 36px",
                background: "#D4A090",
                color: "white",
                borderRadius: 999,
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: ".04em",
                textDecoration: "none",
                boxShadow:
                  "0 0 28px rgba(212,160,144,.35), 0 8px 22px rgba(212,160,144,.28)",
                transition: "transform .2s, box-shadow .2s",
              }}
            >
              いまの気持ちを整理する
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            {/* 副CTA — Kinda talk（ghost テキストリンク） */}
            <Link
              href="/kinda-talk"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                color: "#6B5D52",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                letterSpacing: ".04em",
                textDecoration: "none",
                transition: "color .2s",
              }}
            >
              カウンセラーを見てみる
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .brand-name {
          color: var(--accent);
          font-family: 'Shippori Mincho', serif;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .about-team-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* ④信じること：Apple 風の柔らかい白カード（モバイル 1 列 / PC 2 列） */
        .about-belief-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          margin-top: 56px;
        }
        .about-belief-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 36px 32px 34px;
          box-shadow:
            0 1px 2px rgba(26,19,14,.04),
            0 8px 28px rgba(26,19,14,.06);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .about-belief-card:hover {
            transform: translateY(-2px);
            box-shadow:
              0 1px 2px rgba(26,19,14,.04),
              0 14px 36px rgba(26,19,14,.08);
          }
        }
        @media (min-width: 768px) {
          .about-belief-grid {
            grid-template-columns: 1fr 1fr;
            gap: 22px;
          }
          .about-belief-card { padding: 40px 36px; }
        }
      `}</style>
      </main>
    </div>
  );
}
