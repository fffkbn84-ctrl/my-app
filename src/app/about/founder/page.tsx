import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

const SITE_URL = "https://kinda.jp";
const PUBLISHED_AT = "2026-06-21";

export const metadata = {
  title:
    "「結婚してみようかな」と思ったとき、最初になんとなくのぞける場所を｜Kinda ふたりへ",
  description:
    "Kinda（カインダ）をつくった、ふうかへのインタビュー。結婚相談所で5年働いた経験から、カウンセラーを口コミで選べる場所をなぜつくったのか。取材・文／さき。",
  alternates: { canonical: "/about/founder" },
  robots: { index: true, follow: true },
  openGraph: {
    title:
      "「結婚してみようかな」と思ったとき、最初になんとなくのぞける場所を",
    description:
      "Kinda をつくった、ふうかへのインタビュー。カウンセラーを口コミで選べる場所をなぜつくったのか。",
    type: "article",
    locale: "ja_JP",
    siteName: "Kinda ふたりへ",
    images: [{ url: "/images/OGP-hero.jpg", width: 1200, height: 632 }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "「結婚してみようかな」と思ったとき、最初になんとなくのぞける場所を",
    description:
      "Kinda をつくった、ふうかへのインタビュー。取材・文／さき。",
    images: ["/images/OGP-hero.jpg"],
  },
};

function InterviewBlock({
  speaker,
  avatar,
  children,
}: {
  speaker: "さき" | "ふうか";
  avatar: string;
  children: React.ReactNode;
}) {
  const isSaki = speaker === "さき";
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        marginBottom: 36,
        flexDirection: isSaki ? "row" : "row-reverse",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow:
            "0 2px 8px rgba(180,140,110,.15), inset 0 1px 0 rgba(255,255,255,.4)",
        }}
      >
        <Image
          src={avatar}
          alt={speaker}
          width={48}
          height={48}
          style={{ objectFit: "cover", width: 48, height: 48 }}
        />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: "left",
        }}
      >
        <p
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontWeight: 500,
            fontSize: 13,
            color: isSaki ? "#8A66B0" : "#D4A090",
            marginBottom: 6,
            textAlign: isSaki ? "left" : "right",
          }}
        >
          {speaker}
        </p>
        <div
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: "clamp(15px, 1.7vw, 17px)",
            color: "#2E2620",
            lineHeight: 2.2,
            letterSpacing: ".03em",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FounderPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "「結婚してみようかな」と思ったとき、最初になんとなくのぞける場所を",
    description:
      "Kinda（カインダ）をつくった、ふうかへのインタビュー。結婚相談所で5年働いた経験から、カウンセラーを口コミで選べる場所をなぜつくったのか。",
    image: `${SITE_URL}/images/OGP-hero.jpg`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/about/founder`,
    },
    author: {
      "@type": "Person",
      name: "さき",
      jobTitle: "コラム / カウンセラー取材",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Kinda ふたりへ",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/toppage_name.webp`,
      },
    },
    about: {
      "@type": "Person",
      name: "ふうか",
      jobTitle: "代表 / Founder",
      url: `${SITE_URL}/about`,
    },
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
    inLanguage: "ja",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <div style={{ background: "#FCF8F2", minHeight: "100vh" }}>
        <SectionSubHeader sectionName="Kindaについて" sectionRoot="/about" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kindaについて", href: "/about" },
            { label: "ファウンダーストーリー" },
          ]}
        />

        <article
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}
        >
          {/* ヘッダー */}
          <header style={{ marginBottom: 48 }}>
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
              FOUNDER STORY
            </p>
            <h1
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontWeight: 500,
                fontSize: "clamp(24px, 4.8vw, 36px)",
                color: "#1A130E",
                letterSpacing: ".04em",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              「結婚してみようかな」と思ったとき、
              <br />
              最初になんとなくのぞける場所を
            </h1>
            <p
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: "clamp(14px, 1.6vw, 16px)",
                color: "#6B5D52",
                lineHeight: 1.8,
                margin: "0 0 12px",
              }}
            >
              Kinda をつくった、ふうかに聞いた
            </p>

            {/* バイライン */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid rgba(26,19,14,.08)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/images/saki-editor.webp"
                  alt="さき"
                  width={40}
                  height={40}
                  style={{ objectFit: "cover", width: 40, height: 40 }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    color: "#2E2620",
                    margin: 0,
                  }}
                >
                  取材・文／さき（Kinda）
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 11,
                    color: "#9B8E82",
                    margin: 0,
                  }}
                >
                  {PUBLISHED_AT.replace(/-/g, ".")}
                </p>
              </div>
            </div>
          </header>

          {/* リード */}
          <div
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: "clamp(15px, 1.7vw, 17px)",
              color: "#2E2620",
              lineHeight: 2.2,
              letterSpacing: ".03em",
              marginBottom: 48,
            }}
          >
            <p style={{ margin: "0 0 1.4em" }}>
              こんにちは。Kinda
              で取材とコラムを担当している、さきです。
            </p>
            <p style={{ margin: 0 }}>
              結婚相談所を、実際に会った人の口コミで——しかも会社単位ではなく、カウンセラー個人の単位で選べる場所、「Kinda（カインダ）」。それをつくったのが、ふうかさんです。どうやって始まったのか、いま何を考えているのか、聞いてきました。
            </p>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(26,19,14,.08)",
              margin: "0 0 48px",
            }}
          />

          {/* インタビュー本文 */}
          <div>
            <InterviewBlock
              speaker="さき"
              avatar="/images/saki-editor.webp"
            >
              <p style={{ margin: 0 }}>
                Kinda って、どんなふうに始まったんですか。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="ふうか"
              avatar="/images/fuka-profile.webp"
            >
              <p style={{ margin: "0 0 1.2em" }}>
                正直、最初はふわっとしたアイディアしかなかったんです。独立を考えていた頃で、プラットフォーム側をやりたいとか、いっそもっとアナログにとか、いろいろ浮かんでいて。
              </p>
              <p style={{ margin: 0 }}>
                でも「結婚相談所を探せるサイトを作りたい」と思った、たぶんその次の瞬間にはもう手が動いていました。アイディアが固まる前に、サイトを作り始めてたんです。そこからは考えが止まらなくなって。足したり、削ったり、これは今後の課題、って置いたりしながら、Kinda
                を作ってきました。いまも作っている途中です。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="さき"
              avatar="/images/saki-editor.webp"
            >
              <p style={{ margin: 0 }}>
                いろんな案があった中で、なんでそれだけ手が止まらなかったんでしょう。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="ふうか"
              avatar="/images/fuka-profile.webp"
            >
              <p style={{ margin: "0 0 1.2em" }}>
                世間って、結婚相談所といえば大手の何社か、くらいのイメージしか持っていないことが多いと思うんです。でも実際には、小さな相談所がたくさんあって、それぞれにいい人がいる。
              </p>
              <p style={{ margin: "0 0 1.2em" }}>
                一方で、探す側はイメージだけが先行していて。怖そう、敷居が高そう、おせっかいされそう……そういう先入観で、一歩が踏み出せない。しかも料金の出し方も相談所ごとにバラバラで、情報を集めるだけでもう疲れてしまう。
              </p>
              <p style={{ margin: 0 }}>
                だったら、ちゃんと中身を見て選べる場所がいる、と思ったんです。それが手を動かした理由でした。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="さき"
              avatar="/images/saki-editor.webp"
            >
              <p style={{ margin: 0 }}>
                実際に、踏み出せずにいる人を見てきたんですか。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="ふうか"
              avatar="/images/fuka-profile.webp"
            >
              <p style={{ margin: "0 0 1.2em" }}>
                前に結婚相談所で働いていたので、何人も見ました。
              </p>
              <p style={{ margin: "0 0 1.2em" }}>
                ひとり、よく思い出す方がいます。30代の女性で、自分のキャリアも大事にしたい、でも周りが結婚ラッシュで少し焦っている、という人でした。最初は気軽にと思ってマッチングアプリを始めたら、安心して活動しづらい相手が紛れていて。本当に疲れた、怖かった、って話してくれました。
              </p>
              <p style={{ margin: "0 0 1.2em" }}>
                その方は最終的に相談所が合っていたんですが、私が引っかかったのはそこじゃなくて。アプリの疲れをやっと抜けても、今度は「どの相談所の、どのカウンセラーにするか」で、また同じ怖さと疲れが来るんですよ。怖そう、よく分からない、比べようがない。せっかく前に進もうとした人が、選ぶ手前でまたつまずく。
              </p>
              <p style={{ margin: 0 }}>
                その人を救ったのは、結局「自分の味方になってくれる担当」がいたことでした。だったら、その&ldquo;味方になってくれる人&rdquo;を、会う前に、実際に会った人の声で選べたらいい。Kinda
                が、面談した人の口コミでカウンセラーを選べる場所になっているのは、そのためです。広告の大きさじゃなくて、本当に会った人の声で選べる。それだけで、最初の一歩はずっと軽くなると思っています。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="さき"
              avatar="/images/saki-editor.webp"
            >
              <p style={{ margin: 0 }}>
                もうひとつ、気持ちを「天気」で表す道具がありますよね。あれはどこから来たんですか。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="ふうか"
              avatar="/images/fuka-profile.webp"
            >
              <p style={{ margin: "0 0 1.2em" }}>
                これはもう、本当に軽い思いつきです。気持ちって、はっきり言葉にできなくて、なんとなく感じているものだよなと思って。それで、なんとなく「天気みたいだな」って。それくらいの始まりでした。
              </p>
              <p style={{ margin: "0 0 1.2em" }}>
                ただ、別のところでずっと気になっていたこともあって。担当との距離がなかなか縮まらない人や、言い出せなくて悩んでいる人がいたんです。カウンセラーの側も寄り添おうとするんだけど、うまく届かないときがある。
              </p>
              <p style={{ margin: "0 0 1.2em" }}>
                そんなとき、長い説明じゃなくて、「いま、こんな天気みたいな気分です」って一枚そっと渡すだけでよかったら、もっと気軽だろうな、と思ったんです。問診票みたいに。書いて渡したら、あとは受け取る側のプロにまかせればいい。
              </p>
              <p style={{ margin: 0 }}>
                ……前に、少しずつ打ち解けてきたかな、と思えていた方がいたんです。でも、あるときを境に連絡が取れなくなってしまって。いまでも、ときどき考えます。あの頃、こういうものがあったら、何か違ったのかなって。Kinda
                note は、たぶんその気持ちから来ています。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="さき"
              avatar="/images/saki-editor.webp"
            >
              <p style={{ margin: 0 }}>
                その「あの頃これがあったら」という気持ちが、いまの Kinda note
                に残っているんですね。……最後に。これから、Kinda
                をどんな場所にしていきたいですか。
              </p>
            </InterviewBlock>

            <InterviewBlock
              speaker="ふうか"
              avatar="/images/fuka-profile.webp"
            >
              <p style={{ margin: "0 0 1.2em" }}>
                「結婚してみようかな」とふと思えたとき、最初になんとなくのぞいてくれる場所だったら、もうそれだけで泣けるほどうれしいです。
              </p>
              <p style={{ margin: "0 0 1.2em" }}>
                欲を言えば、その人が実際に動き始めて、うまくいった日も、うまくいかない日も、ここで吐き出せて。初めてのデートの場所を探すのにも使って。そして——ふたりになったその先も、「ふたりで行く場所を探すのに、まだ使ってます」って言ってもらえたら。そんなサービスにできていたら、信じられないくらいうれしいです。
              </p>
              <p style={{ margin: 0 }}>
                ゴールは、ご成婚という一点じゃないんです。準備の時期から、その先の日々まで。自分のペースで、誰とも比べずに。そっと隣にいられる場所にしたい。
              </p>
            </InterviewBlock>
          </div>

          {/* エンディング */}
          <div
            style={{
              height: 1,
              background: "rgba(26,19,14,.08)",
              margin: "48px 0",
            }}
          />

          <div
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "#6B5D52",
              lineHeight: 2.2,
              letterSpacing: ".04em",
              fontStyle: "italic",
              marginBottom: 48,
            }}
          >
            <p style={{ margin: "0 0 1.2em" }}>
              うまくいく日も、うまく言葉にできない日もある。
              <br />
              どちらも、天気みたいなものだと、話を聞いていて思いました。
            </p>
            <p style={{ margin: 0 }}>
              まずは今日の気持ちを、天気の言葉にしてみるところから。
              <br />
              その場所は、いま{" "}
              <Link
                href="/"
                style={{
                  color: "#D4A090",
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                }}
              >
                kinda.jp
              </Link>{" "}
              に開いています。
            </p>
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "48px 0",
              borderTop: "1px solid rgba(26,19,14,.08)",
            }}
          >
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
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: ".04em",
                textDecoration: "none",
                boxShadow:
                  "0 0 28px rgba(212,160,144,.35), 0 8px 22px rgba(212,160,144,.28)",
              }}
            >
              いまの気持ちを整理する
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                color: "#6B5D52",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14,
                letterSpacing: ".04em",
                textDecoration: "none",
              }}
            >
              Kindaについて
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
