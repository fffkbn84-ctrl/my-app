import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllVoices, getVoiceBySlug } from "@/lib/voices";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CopyBlock from "./CopyBlock";
import { buildTemplates } from "./templates";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  // 未公開記事にもキットは要る（掲載直後に本人へ渡すため）
  const voices = await getAllVoices();
  return voices.map((v) => ({ slug: v.slug }));
}

/**
 * キットページは記事本体とカニバるうえ、検索結果に出す価値がない。
 * URL を知っている本人だけが見る想定で、noindex, nofollow を出し sitemap にも載せない。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let voice;
  try {
    voice = await getVoiceBySlug(slug);
  } catch {
    return { robots: { index: false, follow: false } };
  }
  return {
    title: `${voice.counselorName}さんへ | Kinda voices 告知用キット`,
    robots: { index: false, follow: false },
  };
}

/** 外部サイト向けの埋め込みコード。alt は全記事共通の固定文字列にする。 */
function embedCode(articleUrl: string, name: "wide" | "square") {
  const size = name === "wide" ? { w: 260, h: 72 } : { w: 200, h: 200 };
  const base = `${SITE_URL}/images/badge/voices-${name}`;
  return [
    `<a href="${articleUrl}" target="_blank" rel="noopener">`,
    `  <img src="${base}.png"`,
    `       srcset="${base}.png 1x, ${base}@2x.png 2x"`,
    `       alt="Kinda voices インタビュー掲載"`,
    `       width="${size.w}" height="${size.h}" loading="lazy">`,
    `</a>`,
  ].join("\n");
}

export default async function VoiceKitPage({ params }: Props) {
  const { slug } = await params;

  let voice;
  try {
    voice = await getVoiceBySlug(slug);
  } catch {
    notFound();
  }

  const articleUrl = `${SITE_URL}/voices/${voice.slug}`;
  const templates = buildTemplates(voice, articleUrl);

  const sectionTitle = {
    fontFamily: "var(--font-mincho)",
    fontSize: "clamp(16px, 2.6vw, 19px)",
    fontWeight: 500,
    color: "var(--black)",
    margin: "0 0 6px",
  } as const;

  const sectionNote = {
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    fontWeight: 300,
    color: "var(--mid)",
    lineHeight: 1.95,
    margin: "0 0 18px",
  } as const;

  return (
    <>
      <Header />

      <main style={{ background: "#FCF8F2", minHeight: "100vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
          {/* (a) ヘッダー */}
          <header style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Kinda voices
            </p>
            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 400,
                color: "var(--black)",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              {voice.counselorName}さんへ
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--mid)",
                marginBottom: 20,
              }}
            >
              Kinda voices 告知用キット
            </p>
            <Link
              href={`/voices/${voice.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--light)",
                borderRadius: 999,
                padding: "10px 22px",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "#8B7355",
                textDecoration: "none",
                background: "var(--white)",
              }}
            >
              掲載された記事を見る
            </Link>
          </header>

          {/* (b) リード文 */}
          <div
            style={{
              background: "var(--pale)",
              border: "1px solid var(--light)",
              borderRadius: 16,
              padding: "22px 24px",
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13.5,
                fontWeight: 300,
                lineHeight: 2.1,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              記事をご紹介いただける場合に使っていただける素材です。
              <br />
              そのままお使いいただいても、書き換えていただいても構いません。
              <br />
              ご紹介は任意です。掲載や今後の取り扱いには影響しません。
            </p>
          </div>

          {/* (c) 告知文テンプレート3種 */}
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionTitle}>告知文</h2>
            <p style={sectionNote}>
              お名前・地域・記事のURLは入力済みです。そのままコピーしてお使いいただけます。
            </p>
            {templates.map((t) => (
              <CopyBlock key={t.id} label={t.label} hint={t.hint} text={t.body} />
            ))}
          </section>

          {/* (d) バッジと埋め込みコード */}
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionTitle}>掲載バッジ</h2>
            <p style={sectionNote}>
              ご自身のサイトやブログに貼っていただける画像です。クリックすると記事が開きます。
              横長と正方形のどちらでも構いません。
            </p>

            {(["wide", "square"] as const).map((kind) => {
              const jp = kind === "wide" ? "横長（260 × 72）" : "正方形（200 × 200）";
              const base = `/images/badge/voices-${kind}`;
              return (
                <div key={kind} style={{ marginBottom: 28 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "var(--black)",
                      margin: "0 0 12px",
                    }}
                  >
                    {jp}
                  </h3>

                  {/* プレビュー */}
                  <div
                    style={{
                      border: "1px solid var(--light)",
                      borderRadius: 12,
                      background: "var(--white)",
                      padding: "20px",
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {/* 実ファイルをそのまま表示する。next/image は使わない
                        （外部配布と同じ静的URLで見え方を確認してもらうため） */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${base}.png`}
                      srcSet={`${base}.png 1x, ${base}@2x.png 2x`}
                      alt="Kinda voices インタビュー掲載"
                      width={kind === "wide" ? 260 : 200}
                      height={kind === "wide" ? 72 : 200}
                    />
                  </div>

                  <CopyBlock
                    label="貼り付け用のコード"
                    hint="ブログの HTML 編集画面に貼り付けてください。"
                    text={embedCode(articleUrl, kind)}
                    mono
                  />

                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      fontWeight: 300,
                      color: "var(--mid)",
                      lineHeight: 2,
                      margin: 0,
                    }}
                  >
                    画像だけをダウンロード：
                    <a
                      href={`${base}.png`}
                      download
                      style={{ color: "#8B7355", textDecoration: "underline", marginLeft: 6 }}
                    >
                      通常サイズ
                    </a>
                    <span style={{ color: "var(--muted)", margin: "0 6px" }}>·</span>
                    <a
                      href={`${base}@2x.png`}
                      download
                      style={{ color: "#8B7355", textDecoration: "underline" }}
                    >
                      高解像度
                    </a>
                  </p>
                </div>
              );
            })}

            {/* HTML が貼れない環境向け */}
            <CopyBlock
              label="テキストだけのご紹介"
              hint="HTML を貼れない場合は、こちらをお使いください。"
              text={`Kinda voices にインタビューが掲載されました\n${articleUrl}`}
            />
          </section>

          {/* (e) 記事URL */}
          <section>
            <h2 style={sectionTitle}>記事のURL</h2>
            <p style={sectionNote}>
              SNS に貼る場合はこちらです。貼るだけで画像付きで表示されます。
            </p>
            <CopyBlock label="記事のURL" text={articleUrl} mono />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
