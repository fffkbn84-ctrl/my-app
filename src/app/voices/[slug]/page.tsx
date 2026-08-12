import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllVoices,
  getVoiceBySlug,
  getSeriesVoices,
  isPublished,
} from "@/lib/voices";
import ShareBar from "@/components/share/ShareBar";
import SympathyButton from "@/components/episodes/SympathyButton";
import ReadingConversionFooter from "@/components/reading/ReadingConversionFooter";
import VoicesTransparencyNote from "@/components/voices/VoicesTransparencyNote";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  // 未公開（draft / 未来日）も含める。掲載前にカウンセラー本人へ
  // URL を渡して確認してもらうため、ページ自体は存在させる。
  const voices = await getAllVoices();
  return voices.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let voice;
  try {
    voice = await getVoiceBySlug(slug);
  } catch {
    return {};
  }

  const canonical = `${SITE_URL}/voices/${voice.slug}`;
  const published = isPublished(voice);

  return {
    title: `${voice.title} | Kinda voices`,
    description: voice.description,
    alternates: { canonical },
    // 未公開記事は URL を知る人だけが見る前提。検索結果には出さない。
    ...(published ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      title: voice.title,
      description: voice.description,
      type: "article",
      url: canonical,
      publishedTime: voice.publishedAt,
      modifiedTime: voice.updatedAt ?? voice.publishedAt,
      authors: [voice.author],
      tags: voice.tags,
      siteName: "Kinda ふたりへ",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: voice.title,
      description: voice.description,
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function VoiceDetailPage({ params }: Props) {
  const { slug } = await params;

  let voice;
  try {
    voice = await getVoiceBySlug(slug);
  } catch {
    notFound();
  }

  const canonical = `${SITE_URL}/voices/${voice.slug}`;
  const series = await getSeriesVoices(voice.seriesId, voice.slug);

  // 構造化データ：Article。voices は取材対象が実在の専門職個人なので、
  // about に Person（取材対象）を持たせる。author は書き手であって取材対象ではない。
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: voice.title,
    description: voice.description,
    image: `${canonical}/opengraph-image`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    about: {
      "@type": "Person",
      name: voice.counselorName,
      jobTitle: "結婚相談所カウンセラー",
      ...(voice.agencyName && {
        worksFor: { "@type": "Organization", name: voice.agencyName },
      }),
      ...(voice.counselorSlug && {
        url: `${SITE_URL}/counselors/${voice.counselorSlug}`,
      }),
    },
    author: {
      "@type": "Person",
      name: voice.author,
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
    datePublished: voice.publishedAt,
    dateModified: voice.updatedAt ?? voice.publishedAt,
    keywords: voice.tags.join(","),
    inLanguage: "ja",
  };

  const faqLd =
    voice.faq && voice.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: voice.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <Header />
      <div className="kv-page" style={{ background: "#FCF8F2", minHeight: "100vh" }}>
        <SectionSubHeader sectionName="Kinda voices" sectionRoot="/voices" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda voices", href: "/voices" },
            { label: voice.counselorName },
          ]}
        />
        <article
          style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" }}
        >
          {/* サムネイル */}
          <div
            style={{
              background:
                voice.thumbnail ||
                "url('/images/Kinda-voices-nouse.webp') center/cover no-repeat",
              height: "240px",
              borderRadius: "16px",
              marginBottom: "32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: "20px",
                padding: "4px 14px",
                fontSize: "10px",
                color: "#fff",
                fontFamily: "var(--font-sans)",
                background: "rgba(0,0,0,0.15)",
                letterSpacing: "0.04em",
              }}
            >
              取材記事
            </span>
            <span
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                fontSize: "10px",
                color: "rgba(255,255,255,0.9)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {voice.readTime} min read
            </span>
          </div>

          {/* 記事ヘッダー */}
          <header style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {[voice.area, voice.agencyName, voice.partLabel]
                .filter((v): v is string => !!v)
                .map((label) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-block",
                      border: "1px solid #8B7355",
                      borderRadius: "20px",
                      padding: "3px 14px",
                      fontSize: "10px",
                      color: "#8B7355",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
                  </span>
                ))}
            </div>

            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(22px, 3.5vw, 38px)",
                fontWeight: 400,
                color: "var(--black)",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              {voice.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: voice.authorColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#fff",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {voice.authorInitial}
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--mid)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {voice.author}
                </span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--mid)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {formatDate(voice.publishedAt)}
              </span>
              {voice.interviewedAt && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--mid)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  取材: {formatDate(voice.interviewedAt)}
                </span>
              )}
            </div>
          </header>

          <div style={{ borderBottom: "1px solid var(--pale)", marginBottom: "32px" }} />

          {/* Atomic Answer（結論先出し） */}
          {voice.atomicAnswer && (
            <aside
              aria-label="この記事の結論"
              style={{
                background: "linear-gradient(135deg, #FBF7F1 0%, #F4ECE0 100%)",
                border: "1px solid #E5DCC8",
                borderLeft: "3px solid #B89A4A",
                borderRadius: 12,
                padding: "20px 22px",
                marginBottom: 36,
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#8B7355",
                  margin: "0 0 8px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Answer / 結論
              </p>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.95,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {voice.atomicAnswer}
              </p>
            </aside>
          )}

          {/* MDX 本文 */}
          <div className="mdx-content">
            <MDXRemote source={voice.content} />
          </div>

          {/* シリーズ（同一人物の他の記事） */}
          {series.length > 0 && (
            <section
              style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--pale)" }}
              aria-label="この人の他の記事"
            >
              <p
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "#8B7355",
                  marginBottom: 16,
                  textTransform: "lowercase",
                }}
              >
                more from this interview
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {series.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/voices/${s.slug}`}
                    style={{
                      display: "block",
                      border: "1px solid var(--light)",
                      borderRadius: 12,
                      padding: "14px 18px",
                      textDecoration: "none",
                      background: "var(--white)",
                    }}
                  >
                    {s.partLabel && (
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 10,
                          color: "#8B7355",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {s.partLabel}
                      </span>
                    )}
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        color: "var(--ink)",
                        lineHeight: 1.7,
                        margin: "4px 0 0",
                        fontWeight: 300,
                      }}
                    >
                      {s.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {voice.faq && voice.faq.length > 0 && (
            <section
              style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--pale)" }}
              aria-label="よくある質問"
            >
              <h2
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: "clamp(18px, 2.5vw, 22px)",
                  fontWeight: 500,
                  color: "var(--black)",
                  margin: "0 0 24px",
                }}
              >
                よくある質問
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {voice.faq.map((f, i) => (
                  <details
                    key={i}
                    style={{
                      border: "1px solid var(--light)",
                      borderRadius: 12,
                      padding: "16px 18px",
                      background: "var(--white)",
                    }}
                  >
                    <summary
                      style={{
                        display: "flex",
                        gap: 8,
                        cursor: "pointer",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 14,
                        color: "var(--black)",
                        lineHeight: 1.7,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          fontFamily: "DM Serif Display, serif",
                          color: "#8B7355",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        Q.
                      </span>
                      <span>{f.q}</span>
                    </summary>
                    <p
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 13.5,
                        lineHeight: 2,
                        color: "var(--mid)",
                        margin: "12px 0 0",
                        paddingLeft: 24,
                        fontWeight: 300,
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 当該カウンセラーの詳細ページへ。未掲載（counselorSlug: null）なら出さない */}
          {voice.counselorSlug && (
            <div style={{ marginTop: 48, textAlign: "center" }}>
              <Link
                href={`/counselors/${voice.counselorSlug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--accent)",
                  color: "#fff",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  textDecoration: "none",
                  borderRadius: 999,
                  padding: "14px 30px",
                  boxShadow: "0 6px 22px rgba(212,160,144,.45)",
                }}
              >
                {voice.counselorName}さんの話を、直接聞いてみる。
              </Link>
            </div>
          )}

          <div style={{ borderBottom: "1px solid var(--pale)", margin: "48px 0 32px" }} />

          {/* タグ */}
          {voice.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "40px",
              }}
            >
              {voice.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    border: "1px solid var(--light)",
                    borderRadius: "20px",
                    fontSize: "11px",
                    color: "var(--mid)",
                    padding: "5px 14px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <SympathyButton
            initialCount={
              12 +
              (voice.slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 80)
            }
            label="この記事に共感"
            hint="共感した数は押したあとに表示されます"
            targetType="voice"
            targetId={voice.slug}
          />

          <ShareBar title={voice.title} label="この記事をシェアする" />

          <div style={{ borderBottom: "1px solid var(--pale)", margin: "40px 0 32px" }} />

          {/* 記事単位の透明性表記（構造の開示は下の著者カードのリンクが担う） */}
          <VoicesTransparencyNote />

          {/* 著者プロフィールカード */}
          <div
            style={{
              background: "var(--pale)",
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "56px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: voice.authorColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#fff",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {voice.authorInitial}
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--black)",
                }}
              >
                {voice.author}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                Kinda ふたりへ編集部
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", marginTop: "8px" }}>
                <Link
                  href="/about/editorial-policy"
                  style={{ color: "#8B7355", textDecoration: "underline" }}
                >
                  編集ポリシー
                </Link>
                <span style={{ color: "var(--muted)", margin: "0 6px" }}>·</span>
                <Link
                  href="/about/transparency"
                  style={{ color: "#8B7355", textDecoration: "underline" }}
                >
                  運営の透明性
                </Link>
              </p>
            </div>
          </div>

          <ReadingConversionFooter variant="voices" />
        </article>
      </div>
      <Footer />

      <style>{`
        .mdx-content p {
          font-size: 15px;
          color: var(--ink);
          line-height: 2.2;
          margin-bottom: 24px;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 300;
        }
        .mdx-content h2 {
          font-family: 'Shippori Mincho', serif;
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 500;
          color: var(--black);
          margin: 48px 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--pale);
        }
        .mdx-content h3 {
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: var(--black);
          margin: 32px 0 12px;
        }
        .mdx-content blockquote {
          padding: 20px 24px;
          background: var(--pale);
          border-left: 3px solid #8B7355;
          border-radius: 0 10px 10px 0;
          margin: 32px 0;
          font-size: 14px;
          line-height: 2;
          color: var(--ink);
        }
        .mdx-content strong {
          font-weight: 500;
          color: var(--black);
        }
        .mdx-content ul,
        .mdx-content ol {
          padding-left: 20px;
          margin-bottom: 24px;
        }
        .mdx-content li {
          font-size: 15px;
          color: var(--ink);
          line-height: 2;
          margin-bottom: 8px;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 300;
        }
      `}</style>
    </>
  );
}
