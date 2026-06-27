import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllMdxStories, getMdxStoryBySlug } from "@/lib/mdx-stories";
import LeadAnswer from "@/components/story/LeadAnswer";
import PullQuote from "@/components/story/PullQuote";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShareBar from "@/components/share/ShareBar";
import Breadcrumb from "@/components/ui/Breadcrumb";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const stories = await getAllMdxStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let story;
  try {
    story = await getMdxStoryBySlug(slug);
  } catch {
    return {};
  }

  const canonical = `${SITE_URL}/story/${story.slug}`;
  const ogImageUrl = story.ogImage?.startsWith("/")
    ? `${SITE_URL}${story.ogImage}`
    : `${SITE_URL}/images/OGP-hero.webp`;

  return {
    title: `${story.title} | Kinda story`,
    description: story.description,
    alternates: { canonical },
    openGraph: {
      title: story.title,
      description: story.description,
      type: "article",
      url: canonical,
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt ?? story.publishedAt,
      authors: [story.author],
      siteName: "Kinda ふたりへ",
      locale: "ja_JP",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.description,
      images: [ogImageUrl],
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

const CATEGORY_LABEL: Record<string, string> = {
  marriage: "成婚",
  dating: "交際",
  struggle: "悩み克服",
};

const mdxComponents = {
  LeadAnswer,
  PullQuote,
};

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;

  let story;
  try {
    story = await getMdxStoryBySlug(slug);
  } catch {
    notFound();
  }

  const canonical = `${SITE_URL}/story/${story.slug}`;
  const ogImageUrl = story.ogImage?.startsWith("/")
    ? `${SITE_URL}${story.ogImage}`
    : `${SITE_URL}/images/OGP-hero.webp`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.description,
    image: ogImageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    author: {
      "@type": "Person",
      name: "ふうか",
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
    datePublished: story.publishedAt,
    dateModified: story.updatedAt ?? story.publishedAt,
    inLanguage: "ja",
  };

  const faqLd =
    story.faq && story.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: story.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const hasHeroImage = !!story.heroImage;

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
      <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda story", href: "/kinda-story" },
            { label: story.pseudonym + "さんの物語" },
          ]}
        />

        <article
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}
        >
          {/* ヒーロー画像 */}
          <div
            style={{
              height: "280px",
              borderRadius: "16px",
              marginBottom: "32px",
              overflow: "hidden",
              position: "relative",
              background: hasHeroImage
                ? undefined
                : "linear-gradient(135deg,#E9D9C4,#F3E6D2)",
            }}
          >
            {hasHeroImage && (
              <Image
                src={story.heroImage}
                alt={story.heroAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 720px"
                style={{ objectFit: "cover" }}
              />
            )}
            {/* カテゴリバッジ */}
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
                background: "rgba(0,0,0,0.18)",
                backdropFilter: "blur(4px)",
                letterSpacing: "0.06em",
              }}
            >
              {CATEGORY_LABEL[story.category] ?? story.category}
            </span>
          </div>

          {/* 記事ヘッダー */}
          <header style={{ marginBottom: "32px" }}>
            <span
              style={{
                display: "inline-block",
                border: "1px solid var(--accent)",
                borderRadius: "20px",
                padding: "3px 14px",
                fontSize: "10px",
                color: "var(--accent-deep, #B8806E)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.06em",
                marginBottom: "16px",
              }}
            >
              {CATEGORY_LABEL[story.category] ?? story.category}
            </span>

            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(22px, 3.5vw, 36px)",
                fontWeight: 400,
                color: "var(--black)",
                lineHeight: 1.65,
                marginBottom: "20px",
              }}
            >
              {story.title}
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
                    background: "var(--accent)",
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
                  F
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--mid)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {story.author}
                </span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--mid)",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {formatDate(story.publishedAt)}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--mid)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {story.area}
              </span>
            </div>
          </header>

          <div style={{ borderBottom: "1px solid var(--pale)", marginBottom: "32px" }} />

          {/* MDX 本文 */}
          <div className="story-mdx-content">
            <MDXRemote source={story.content} components={mdxComponents} />
          </div>

          {/* FAQ セクション */}
          {story.faq && story.faq.length > 0 && (
            <section
              style={{
                marginTop: 48,
                paddingTop: 32,
                borderTop: "1px solid var(--pale)",
              }}
              aria-label="よくある質問"
            >
              <p
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "#8B7355",
                  marginBottom: 12,
                  textTransform: "lowercase",
                }}
              >
                frequently asked
              </p>
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
                {story.faq.map((f, i) => (
                  <details
                    key={i}
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "16px 18px",
                    }}
                  >
                    <summary
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--black)",
                        cursor: "pointer",
                        listStyle: "none",
                        display: "flex",
                        alignItems: "start",
                        gap: 10,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          fontFamily: "DM Serif Display, serif",
                          color: "var(--accent-deep, #B8806E)",
                          fontSize: 16,
                          flexShrink: 0,
                          lineHeight: 1.4,
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

          <div style={{ borderBottom: "1px solid var(--pale)", margin: "48px 0 32px" }} />

          {/* SNSシェア */}
          <ShareBar title={story.title} label="この物語をシェアする" />

          <div style={{ borderBottom: "1px solid var(--pale)", margin: "40px 0 32px" }} />

          {/* 著者プロフィールカード */}
          <div
            style={{
              background: "var(--pale)",
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--accent)",
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
              F
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--black)",
                  fontWeight: 400,
                }}
              >
                ふうか
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                Kinda 編集部
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

          {/* Kinda story 一覧へ */}
          <div style={{ textAlign: "center" }}>
            <Link
              href="/kinda-story"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "#8B7355",
                textDecoration: "none",
                border: "1px solid #D8C9B0",
                borderRadius: "999px",
                padding: "10px 22px",
              }}
            >
              ほかの物語も読む
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </article>
      </div>
      <Footer />

      <style>{`
        .story-mdx-content p {
          font-size: 15px;
          color: var(--ink);
          line-height: 2.2;
          margin-bottom: 24px;
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 300;
        }
        .story-mdx-content h2 {
          font-family: 'Shippori Mincho', serif;
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 500;
          color: var(--black);
          margin: 48px 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--pale);
        }
        .story-mdx-content blockquote {
          padding: 16px 20px;
          background: var(--pale);
          border-left: 3px solid #8B7355;
          border-radius: 0 10px 10px 0;
          margin: 28px 0;
          font-size: 13.5px;
          line-height: 2;
          color: var(--ink);
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 300;
        }
        .story-mdx-content blockquote p {
          margin-bottom: 0;
        }
        .story-mdx-content a {
          color: #8B7355;
          text-decoration: underline;
        }
        .story-mdx-content strong {
          font-weight: 500;
          color: var(--black);
        }
      `}</style>
    </>
  );
}
