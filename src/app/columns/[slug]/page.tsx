import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllColumns, getColumnBySlug } from "@/lib/columns";
import {
  WEATHER_DESCRIPTIONS,
  type WeatherKey,
} from "@/app/kinda-note/data/weatherDescriptions";
import ShareButtons from "./ShareButtons";
import SympathyButton from "@/components/episodes/SympathyButton";
import ReadingConversionFooter from "@/components/reading/ReadingConversionFooter";
import WeatherColumnThumb from "@/components/columns/WeatherColumnThumb";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import SourceCitation from "@/components/ui/SourceCitation";
import { getPublicData } from "@/lib/publicData";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

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

  const canonical = `${SITE_URL}/columns/${column.slug}`;

  return {
    title: `${column.title} | Kinda ふたりへ`,
    description: column.description,
    alternates: { canonical },
    openGraph: {
      title: column.title,
      description: column.description,
      type: "article",
      url: canonical,
      publishedTime: column.publishedAt,
      modifiedTime: column.updatedAt ?? column.publishedAt,
      authors: [column.author],
      tags: column.tags,
      siteName: "Kinda ふたりへ",
      locale: "ja_JP",
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

  const allColumns = await getAllColumns();

  // 関連記事：
  // - 天気コラム（weatherKey あり）→ related_weather_keys に対応するコラムを優先
  //   （天気タイプの「近い気持ち」同士をクラスター相互リンクする）
  // - それ以外 → 同カテゴリの他記事
  let related: typeof allColumns = [];
  if (column.weatherKey && column.weatherKey in WEATHER_DESCRIPTIONS) {
    const wd = WEATHER_DESCRIPTIONS[column.weatherKey as WeatherKey];
    const relatedColumnSlugs = wd.related_weather_keys
      .map((k) => WEATHER_DESCRIPTIONS[k].column_slug)
      .filter((s): s is string => !!s);
    related = relatedColumnSlugs
      .map((s) => allColumns.find((c) => c.slug === s))
      .filter((c): c is (typeof allColumns)[number] => !!c && c.slug !== column.slug)
      .slice(0, 3);
  }
  // フォールバック：同カテゴリの他記事を2件
  if (related.length === 0) {
    related = allColumns
      .filter((c) => c.category === column.category && c.slug !== column.slug)
      .slice(0, 2);
  }

  const canonical = `${SITE_URL}/columns/${column.slug}`;

  // 引用した公的データ（YMYL / E-E-A-T 対応）
  const citationSources = getPublicData(column.sources);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: column.title,
    description: column.description,
    image: `${canonical}/opengraph-image`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    ...(citationSources.length > 0 && {
      citation: citationSources.map((s) => ({
        "@type": "CreativeWork",
        name: `${s.org}「${s.surveyName}」`,
        url: s.url,
      })),
    }),
    author: {
      "@type": "Person",
      name: column.author,
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
    datePublished: column.publishedAt,
    dateModified: column.updatedAt ?? column.publishedAt,
    keywords: column.tags.join(","),
    inLanguage: "ja",
  };

  const faqLd =
    column.faq && column.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: column.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      {/* 構造化データ：Article（Person+Organization 完備） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {/* 構造化データ：FAQPage（AI 引用最適化） */}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <Header />
      <div className="kv-page" style={{ background: "#FCF8F2", minHeight: "100vh" }}>
        <SectionSubHeader sectionName="Kinda voices" sectionRoot="/columns" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda voices", href: "/columns" },
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

          {/* サムネイル — weatherKey ありなら polaroid 風、無ければ gradient or fallback */}
          <div
            style={{
              background: column.weatherKey
                ? undefined
                : column.thumbnail
                  ? column.thumbnail
                  : "url('/images/Kinda-voices-nouse.webp') center/cover no-repeat",
              height: "240px",
              borderRadius: "16px",
              marginBottom: "32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {column.weatherKey && (
              <WeatherColumnThumb
                weatherKey={column.weatherKey as WeatherKey}
                featured
                slug={column.slug}
                height={240}
              />
            )}
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
                border: "1px solid #8B7355",
                borderRadius: "20px",
                padding: "3px 14px",
                fontSize: "10px",
                color: "#8B7355",
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
              {column.updatedAt && column.updatedAt !== column.publishedAt && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--mid)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  更新: {formatDate(column.updatedAt)}
                </span>
              )}
              <span style={{ fontSize: "12px", color: "var(--mid)", fontFamily: "DM Sans, sans-serif" }}>
                {column.readTime} min read
              </span>
            </div>
          </header>

          {/* 区切り線 */}
          <div style={{ borderBottom: "1px solid var(--pale)", marginBottom: "32px" }} />

          {/* Atomic Answer ブロック（40-60字の結論を冒頭に置く / AI 引用最適化） */}
          {column.atomicAnswer && (
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
                  fontWeight: 400,
                }}
              >
                {column.atomicAnswer}
              </p>
            </aside>
          )}

          {/* MDXコンテンツ */}
          <div className="mdx-content">
            <MDXRemote source={column.content} />
          </div>

          {/* FAQ セクション（FAQPage schema と対応） */}
          {column.faq && column.faq.length > 0 && (
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
                {column.faq.map((f, i) => (
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
                          color: "#8B7355",
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

          {/* 出典・参考にした公的データ（YMYL / E-E-A-T 対応） */}
          <SourceCitation sources={citationSources} />

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

          {/* 共感ボタン（押すまで件数非表示） */}
          <SympathyButton
            initialCount={
              // slug から安定して算出するモック件数（Supabase 連携後は DB から取得に差し替え）
              12 +
              column.slug
                .split("")
                .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 80
            }
            label="この記事に共感"
            hint="共感した数は押したあとに表示されます"
            targetType="voice"
            targetId={column.slug}
          />

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
                Kinda ふたりへ編集部
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", marginTop: "8px" }}>
                <Link href="/about/editorial-policy" style={{ color: "#8B7355", textDecoration: "underline" }}>
                  編集ポリシー
                </Link>
                <span style={{ color: "var(--muted)", margin: "0 6px" }}>·</span>
                <Link href="/about/transparency" style={{ color: "#8B7355", textDecoration: "underline" }}>
                  運営の透明性
                </Link>
              </p>
            </div>
          </div>

          {/* Conversion Footer（読了 → 行動への橋）— 関連記事の上に配置 */}
          <ReadingConversionFooter variant="voices" />

          {/* 関連記事 */}
          {related.length > 0 && (
            <section>
              <p
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  color: "#8B7355",
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
                        background: col.weatherKey
                          ? undefined
                          : col.thumbnail
                            ? col.thumbnail
                            : "url('/images/Kinda-voices-nouse.webp') center/cover no-repeat",
                        height: "120px",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {col.weatherKey && (
                        <WeatherColumnThumb
                          weatherKey={col.weatherKey as WeatherKey}
                          slug={col.slug}
                          height={120}
                        />
                      )}
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          border: "1px solid #8B7355",
                          borderRadius: "20px",
                          padding: "2px 10px",
                          fontSize: "9px",
                          color: "#8B7355",
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

          {/* 天気コラムからハブ（20の天気タイプ一覧）への逆リンク */}
          {column.weatherKey && (
            <div style={{ marginTop: "40px", textAlign: "center" }}>
              <Link
                href="/note/weather"
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
                20の天気タイプを見る
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
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
          )}
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
        .tag-link:hover {
          border-color: #8B7355;
          color: #8B7355;
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
