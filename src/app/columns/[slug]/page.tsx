import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllColumns, getColumnBySlug } from "@/lib/columns";
import ShareButtons from "./ShareButtons";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const columns = await getAllColumns();
  return columns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let column;
  try {
    column = await getColumnBySlug(slug);
  } catch {
    return {};
  }

  return {
    title: `${column.title} | ふたりへコラム`,
    description: column.description,
    openGraph: {
      title: column.title,
      description: column.description,
      type: "article",
      publishedTime: column.publishedAt,
      authors: [column.author],
      tags: column.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: column.title,
      description: column.description,
    },
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug } = await params;

  let column;
  try {
    column = await getColumnBySlug(slug);
  } catch {
    notFound();
  }

  // 関連記事（同カテゴリの他記事を2件）
  const allColumns = await getAllColumns();
  const related = allColumns
    .filter((c) => c.category === column.category && c.slug !== column.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: column.title,
    description: column.description,
    author: {
      "@type": "Person",
      name: column.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ふたりへ",
    },
    datePublished: column.publishedAt,
    keywords: column.tags.join(","),
  };

  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ background: "var(--white)", minHeight: "100vh" }}>
        <SectionSubHeader sectionName="コラム" sectionRoot="/columns" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "コラム", href: "/columns" },
            { label: column.category },
          ]}
        />
        <article
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}
        >

          {/* サムネイル */}
          <div
            style={{
              background: column.thumbnail,
              height: "240px",
              borderRadius: "16px",
              marginBottom: "32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* カテゴリタグ（左下） */}
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
                backdropFilter: "blur(4px)",
                letterSpacing: "0.04em",
              }}
            >
              {column.category}
            </span>
            {/* 読了時間（右下） */}
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
              {column.readTime} min read
            </span>
          </div>

          {/* 記事ヘッダー */}
          <header style={{ marginBottom: "32px" }}>
            {/* カテゴリタグ */}
            <span
              style={{
                display: "inline-block",
                border: "1px solid var(--accent)",
                borderRadius: "20px",
                padding: "3px 14px",
                fontSize: "10px",
                color: "var(--accent)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.04em",
                marginBottom: "16px",
              }}
            >
              {column.category}
            </span>

            {/* タイトル */}
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
              {column.title}
            </h1>

            {/* 著者・日付・読了時間 */}
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
                    background: column.authorColor,
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
                  {column.authorInitial}
                </div>
                <span style={{ fontSize: "12px", color: "var(--mid)", fontFamily: "var(--font-sans)" }}>
                  {column.author}
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "var(--mid)", fontFamily: "DM Sans, sans-serif" }}>
                {formatDate(column.publishedAt)}
              </span>
              <span style={{ fontSize: "12px", color: "var(--mid)", fontFamily: "DM Sans, sans-serif" }}>
                {column.readTime} min read
              </span>
            </div>
          </header>

          {/* 区切り線 */}
          <div style={{ borderBottom: "1px solid var(--pale)", marginBottom: "40px" }} />

          {/* MDXコンテンツ */}
          <div className="mdx-content">
            <MDXRemote source={column.content} />
          </div>

          {/* 区切り線 */}
          <div style={{ borderBottom: "1px solid var(--pale)", margin: "48px 0 32px" }} />

          {/* タグ一覧 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
            {column.tags.map((tag) => (
              <Link
                key={tag}
                href={`/columns?tag=${encodeURIComponent(tag)}`}
                style={{
                  border: "1px solid var(--light)",
                  borderRadius: "20px",
                  fontSize: "11px",
                  color: "var(--mid)",
                  padding: "5px 14px",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                className="tag-link"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* SNSシェアボタン */}
          <ShareButtons title={column.title} slug={column.slug} />

          {/* 区切り線 */}
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
              marginBottom: "56px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: column.authorColor,
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
              {column.authorInitial}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--black)", fontWeight: 400 }}>
                {column.author}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                ふたりへ編集部
              </p>
            </div>
          </div>

          {/* 関連記事 */}
          {related.length > 0 && (
            <section>
              <p
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  color: "var(--accent)",
                  marginBottom: "20px",
                  textTransform: "lowercase",
                }}
              >
                related articles
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                }}
                className="related-grid"
              >
                {related.map((col) => (
                  <Link
                    key={col.slug}
                    href={`/columns/${col.slug}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "var(--white)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      textDecoration: "none",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    className="related-card"
                  >
                    <div
                      style={{
                        background: col.thumbnail,
                        height: "120px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          border: "1px solid var(--accent)",
                          borderRadius: "20px",
                          padding: "2px 10px",
                          fontSize: "9px",
                          color: "var(--accent)",
                          fontFamily: "var(--font-sans)",
                          marginBottom: "8px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {col.category}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "var(--black)",
                          lineHeight: 1.7,
                        }}
                      >
                        {col.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>

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
          border-left: 3px solid var(--accent);
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
        .tag-link:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .related-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }
        @media (max-width: 480px) {
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
