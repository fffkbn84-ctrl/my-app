import Link from "next/link";

export const metadata = {
  title: "このサービスについて",
  description:
    "Kinda ふたりへは、担当者を自分の目で選んで納得してから始められる婚活サービスです。面談した人だけが書けるレビューと、カウンセラーへの直接予約を提供しています。",
};

export default function AboutPage() {
  return (
    <main style={{ background: "var(--white)" }}>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ① ヒーロー
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "var(--black)",
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 200,
              fontSize: 11,
              letterSpacing: ".18em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            ABOUT FUTARIVE
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
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ② メインコピー
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "var(--pale)",
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
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 200,
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
          background: "var(--black)",
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 200,
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
                title: "カウンセラーは、人で選ぶべきだ",
                body: "相談所のブランドより、目の前のカウンセラーがどんな人かの方が、あなたの婚活を左右する。だから私たちは、カウンセラー個人のプロフィールと口コミを中心に据えた。",
              },
              {
                num: "02",
                title: "口コミは、体験した人だけが書ける",
                body: "面談していない人の声は、ここにはない。Kinda ふたりへ経由で面談を完了した人だけが投稿できる仕組みにしているのは、あなたに正直な情報だけを届けたいから。",
              },
              {
                num: "03",
                title: "婚活の孤独を、一人で抱えなくていい",
                body: "断られた日も、迷っている夜も、誰かに話せる場所があればいい。婚活は孤独になりやすい。だからKinda ふたりへは、頑張れる場所でもありたい。",
              },
              {
                num: "04",
                title: "ふたりの時間に、いい場所を",
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
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 200,
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
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--adim)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="4" stroke="#C8A97A" strokeWidth="1.3" />
                <path
                  d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                  stroke="#C8A97A"
                  strokeWidth="1.3"
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
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(122,158,135,.15)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 9l8-6 8 6v11H3V9z"
                  stroke="#7A9E87"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 20v-6h4v6"
                  stroke="#7A9E87"
                  strokeWidth="1.3"
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
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(107,143,191,.15)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 19C11 19 3 13.5 3 8C3 5.5 5 3.5 7.5 3.5C9 3.5 10.5 4.5 11 6C11.5 4.5 13 3.5 14.5 3.5C17 3.5 19 5.5 19 8C19 13.5 11 19 11 19Z"
                  stroke="#6B8FBF"
                  strokeWidth="1.3"
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
          ⑥ 数字で見るKinda ふたりへ
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "var(--pale)",
          padding: "80px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 200,
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
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 200,
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
            {/* 1. ふうか（代表） — ボブ */}
            <div style={{ textAlign: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
                <circle cx="40" cy="40" r="40" fill="url(#g1)" />
                <circle cx="40" cy="32" r="12" fill="rgba(255,255,255,.75)" />
                <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="rgba(255,255,255,.5)" />
                {/* ボブ（あご下） */}
                <path d="M28 26c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="rgba(80,50,30,.25)" />
                <path d="M27 34c-1 0-2-1-2-3v-4h2" fill="rgba(80,50,30,.2)" />
                <path d="M53 34c1 0 2-1 2-3v-4h-2" fill="rgba(80,50,30,.2)" />
                <rect x="28" y="37" width="24" height="6" rx="3" fill="rgba(80,50,30,.2)" />
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EDE0D4" />
                    <stop offset="1" stopColor="#D4C4B0" />
                  </linearGradient>
                </defs>
              </svg>
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>ふうか</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>代表</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                ここでの出会いが一生ものになる、そんな瞬間を作っていきます
              </p>
            </div>

            {/* 2. るな（設計/デザイン） — ミディアム */}
            <div style={{ textAlign: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
                <circle cx="40" cy="40" r="40" fill="url(#g2)" />
                <circle cx="40" cy="32" r="12" fill="rgba(255,255,255,.75)" />
                <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="rgba(255,255,255,.5)" />
                {/* ミディアム（肩まで） */}
                <path d="M28 26c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="rgba(60,40,20,.2)" />
                <path d="M26 30c-1.5 0-2.5-1.5-2-4l1-6h4" fill="rgba(60,40,20,.18)" />
                <path d="M54 30c1.5 0 2.5-1.5 2-4l-1-6h-4" fill="rgba(60,40,20,.18)" />
                <path d="M27 36 Q26 46 27 50" stroke="rgba(60,40,20,.25)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M53 36 Q54 46 53 50" stroke="rgba(60,40,20,.25)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D8E4D8" />
                    <stop offset="1" stopColor="#C0D4C2" />
                  </linearGradient>
                </defs>
              </svg>
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>るな</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>設計 / デザイン</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                使うたびに、少し前に進める場所にしたい
              </p>
            </div>

            {/* 3. つよし（共同代表） — 短髪・男性 */}
            <div style={{ textAlign: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
                <circle cx="40" cy="40" r="40" fill="url(#g3)" />
                <circle cx="40" cy="32" r="12" fill="rgba(255,255,255,.75)" />
                <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="rgba(255,255,255,.5)" />
                {/* 短髪・男性 */}
                <path d="M29 26c0-6.075 4.925-11 11-11s11 4.925 11 11v2H29v-2z" fill="rgba(50,35,20,.25)" />
                <defs>
                  <linearGradient id="g3" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D4DDE8" />
                    <stop offset="1" stopColor="#C0CCDA" />
                  </linearGradient>
                </defs>
              </svg>
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>つよし</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>共同代表 / 全国取材</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                みなさんのために駆け抜けます！
              </p>
            </div>

            {/* 4. みづき（取材/コラム） — ロング */}
            <div style={{ textAlign: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
                <circle cx="40" cy="40" r="40" fill="url(#g4)" />
                <circle cx="40" cy="32" r="12" fill="rgba(255,255,255,.75)" />
                <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="rgba(255,255,255,.5)" />
                {/* ロング（胸まで） */}
                <path d="M28 26c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="rgba(55,35,15,.22)" />
                <path d="M26 30c-1.5 0-2.5-1.5-2-4l1-6h4" fill="rgba(55,35,15,.2)" />
                <path d="M54 30c1.5 0 2.5-1.5 2-4l-1-6h-4" fill="rgba(55,35,15,.2)" />
                <path d="M27 36 Q25 50 26 60" stroke="rgba(55,35,15,.25)" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M53 36 Q55 50 54 60" stroke="rgba(55,35,15,.25)" strokeWidth="5" strokeLinecap="round" fill="none" />
                <defs>
                  <linearGradient id="g4" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E8EEF0" />
                    <stop offset="1" stopColor="#D0DFE4" />
                  </linearGradient>
                </defs>
              </svg>
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>みづき</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>取材 / コラム</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                実際に足を運んで、正直に書きます
              </p>
            </div>

            {/* 5. あかり（コラム/お店担当） — ポニーテール */}
            <div style={{ textAlign: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
                <circle cx="40" cy="40" r="40" fill="url(#g5)" />
                <circle cx="40" cy="32" r="12" fill="rgba(255,255,255,.75)" />
                <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="rgba(255,255,255,.5)" />
                {/* ポニーテール */}
                <path d="M28 26c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="rgba(80,45,20,.22)" />
                <path d="M26 32c-2 0-3-2-2.5-4.5l1.5-7h4" fill="rgba(80,45,20,.2)" />
                {/* ポニー束 */}
                <path d="M52 20 Q58 16 56 28 Q60 20 56 32" stroke="rgba(80,45,20,.28)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx="53" cy="20" r="2.5" fill="rgba(80,45,20,.3)" />
                <defs>
                  <linearGradient id="g5" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FCE8E5" />
                    <stop offset="1" stopColor="#F0D0CC" />
                  </linearGradient>
                </defs>
              </svg>
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>あかり</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>コラム / お店担当</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                婚活中のあなたに、本当に使えるお店を
              </p>
            </div>

            {/* 6. さき（コラム/カウンセラー取材） — ショートボブ */}
            <div style={{ textAlign: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ display: "block", margin: "0 auto 16px" }}>
                <circle cx="40" cy="40" r="40" fill="url(#g6)" />
                <circle cx="40" cy="32" r="12" fill="rgba(255,255,255,.75)" />
                <path d="M18 68c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="rgba(255,255,255,.5)" />
                {/* ショートボブ（耳上） */}
                <path d="M28 26c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="rgba(65,40,25,.22)" />
                <path d="M27 32c-1.5 0-2.5-1.5-2-3.5l1-5.5h3" fill="rgba(65,40,25,.2)" />
                <path d="M53 32c1.5 0 2.5-1.5 2-3.5l-1-5.5h-3" fill="rgba(65,40,25,.2)" />
                <rect x="28" y="36" width="24" height="4" rx="2" fill="rgba(65,40,25,.18)" />
                <defs>
                  <linearGradient id="g6" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E8D8EE" />
                    <stop offset="1" stopColor="#D4C0E2" />
                  </linearGradient>
                </defs>
              </svg>
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 500, fontSize: 16, color: "var(--black)", marginBottom: 4 }}>さき</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>コラム / カウンセラー取材</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, padding: "0 8px", margin: 0 }}>
                カウンセラーの人となりを、正直にお届けします
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━
          ⑧ 締め
      ━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          background: "var(--black)",
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
            <Link href="/search" className="btn btn-wh" style={{ minWidth: 240 }}>
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
  );
}
