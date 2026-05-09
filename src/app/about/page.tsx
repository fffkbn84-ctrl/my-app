import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

export const metadata = {
  title: "このサービスについて",
  description:
    "Kinda ふたりへは、担当者を自分の目で選んで納得してから始められる婚活サービスです。面談した人だけが書けるレビューと、カウンセラーへの直接予約を提供しています。",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Kinda 村のクレイ風背景（ぼかし固定） */}
      <div className="about-village-bg" aria-hidden="true" />
      <main>
      <SectionSubHeader sectionName="ホーム" sectionRoot="/" />
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kindaについて" }]} />


      {/* ━━━━━━━━━━━━━━━━━━━━
          ① ヒーロー
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#231A12",
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            ABOUT US
          </p>
          <h1
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "white",
              letterSpacing: ".06em",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            ふたりになるまでの、全部をここで。
          </h1>

          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,.1)",
              margin: "40px 0",
            }}
          />

          <div
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: "clamp(16px, 2.5vw, 22px)",
              color: "white",
              lineHeight: 2.4,
              letterSpacing: ".06em",
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
                marginTop: "1.8em",
                fontSize: "clamp(18px, 3vw, 28px)",
                color: "var(--accent)",
              }}
            >
              その瞬間のために、<span className="brand-name">Kinda ふたりへ</span>
            </p>

            {/* Kinda の語源を一行で（ブランド名の腑落ち）*/}
            <p
              style={{
                margin: "2.4em 0 0",
                fontFamily: "'Shippori Mincho', serif",
                fontStyle: "italic",
                fontSize: "clamp(13px, 1.6vw, 15px)",
                color: "rgba(255,255,255,.55)",
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
          ② メインコピー
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "rgba(240,238,235,.55)",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(24px, 4vw, 44px)",
              color: "var(--black)",
              letterSpacing: ".08em",
              margin: 0,
            }}
          >
            出会いは、人で決まる。
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: 15,
              color: "var(--mid)",
              lineHeight: 2.2,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            担当者を自分の目で選んで、
            <br />
            納得してから始められる婚活を。
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ③ なぜ作ったか
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "80px 32px", background: "rgba(255,253,247,.5)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            WHY WE BUILT THIS
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 36px)",
              color: "var(--black)",
              letterSpacing: ".06em",
              marginBottom: 40,
            }}
          >
            なぜ、作ったのか
          </h2>
          <div
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 15,
              color: "var(--ink)",
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
          background: "#231A12",
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            OUR BELIEF
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 36px)",
              color: "white",
              letterSpacing: ".06em",
              marginBottom: 0,
            }}
          >
            <span className="brand-name">Kinda ふたりへ</span>が信じること
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 24,
              marginTop: 48,
            }}
          >
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
              <div
                key={belief.num}
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 48,
                    color: "rgba(200,169,122,.2)",
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {belief.num}
                </div>
                <h3
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontWeight: 500,
                    fontSize: 20,
                    color: "white",
                    letterSpacing: ".04em",
                    marginBottom: 12,
                  }}
                >
                  {belief.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,.6)",
                    lineHeight: 2,
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
          ⑤ Kinda ふたりへでできること
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "80px 32px", background: "rgba(255,253,247,.5)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            WHAT YOU CAN DO
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 36px)",
              color: "var(--black)",
              letterSpacing: ".06em",
              marginBottom: 48,
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
          ⑤' Kinda のしくみ（5つの Kinda 一覧）
          ホームの B カードと同じ書体ルールとカラーパレットを使い、
          サイト全体での Kinda シリーズの認知を補強する。
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,.55)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
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
              fontSize: "clamp(22px, 3vw, 36px)",
              color: "var(--black)",
              letterSpacing: ".06em",
              marginBottom: 16,
            }}
          >
            5つの<span className="brand-name"> Kinda</span>、ひとつの場所で。
          </h2>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14,
              color: "var(--mid)",
              lineHeight: 2,
              marginBottom: 40,
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
                desc: "自分に合うカウンセラーを見つける",
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
                  display: "block",
                  background: svc.bg,
                  borderRadius: 16,
                  padding: "20px 18px",
                  border: "1px solid rgba(0,0,0,.04)",
                  textDecoration: "none",
                  transition: "transform .3s",
                }}
              >
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
          background: "rgba(240,238,235,.55)",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            BY THE NUMBERS
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 36px)",
              color: "var(--black)",
              letterSpacing: ".06em",
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
          ⑦ 運営チームより
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "80px 32px", background: "rgba(255,253,247,.5)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            OUR TEAM
          </p>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3vw, 36px)",
              color: "var(--black)",
              letterSpacing: ".06em",
              marginBottom: 48,
            }}
          >
            運営チームより
          </h2>

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
                name: "ふうか",
                initial: "F",
                role: "代表",
                quote: "ここでの出会いが一生ものになる、そんな瞬間を作っていきます",
                gradient: "linear-gradient(135deg, #EDE0D4, #D4C4B0)",
              },
              {
                name: "るな",
                initial: "R",
                role: "設計 / デザイン",
                quote: "使うたびに、少し前に進める場所にしたい",
                gradient: "linear-gradient(135deg, #D8E4D8, #C0D4C2)",
              },
              {
                name: "つよし",
                initial: "T",
                role: "共同代表 / 全国取材",
                quote: "みなさんのために駆け抜けます！",
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
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑧ 締め
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "#231A12",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 3.5vw, 38px)",
              color: "white",
              letterSpacing: ".08em",
              margin: 0,
            }}
          >
            あなたの婚活を、孤独にしない。
          </h2>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Link href="/kinda-talk" className="btn btn-wh" style={{ minWidth: 240 }}>
              カウンセラーを探す
            </Link>
            <Link href="/shops" className="btn btn-gl" style={{ minWidth: 240 }}>
              ふたりのお店を探す
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
      `}</style>
      </main>
    </div>
  );
}
