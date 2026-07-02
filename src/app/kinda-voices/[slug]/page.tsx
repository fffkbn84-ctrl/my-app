import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShareBar from "@/components/share/ShareBar";
import FAQAccordion from "@/components/kinda-talk/FAQAccordion";
import {
  getPublishedVoices,
  getVoiceBySlug,
  VOICE_FALLBACK_GRADIENT,
} from "@/lib/mock/voices";
import { COUNSELORS } from "@/lib/data";

export function generateStaticParams() {
  return getPublishedVoices().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const voice = getVoiceBySlug(slug);
  if (!voice) return { title: "Kinda voices | ふたりへ" };
  const title = `${voice.title} | Kinda voices | ふたりへ`;
  const description = voice.lead.slice(0, 120);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(voice.heroImage && {
        images: [{ url: voice.heroImage, alt: voice.title }],
      }),
    },
    twitter: {
      card: voice.heroImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(voice.heroImage && { images: [voice.heroImage] }),
    },
    alternates: { canonical: `/kinda-voices/${slug}` },
  };
}

export default async function KindaVoiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const voice = getVoiceBySlug(slug);
  if (!voice) notFound();

  const counselor = COUNSELORS.find(
    (c) => voice.counselorId > 0 && c.id === voice.counselorId
  );
  const others = getPublishedVoices()
    .filter((v) => v.slug !== voice.slug)
    .slice(0, 3);

  // 構造化データ：Article（＋取材対象の Person）。Review/Rating は付けない。
  const SITE_URL = "https://kinda.jp";
  const canonical = `${SITE_URL}/kinda-voices/${voice.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: voice.title,
    description: voice.lead.slice(0, 120),
    ...(voice.heroImage && { image: `${SITE_URL}${voice.heroImage}` }),
    author: { "@type": "Person", name: "ふうか" },
    about: { "@type": "Person", name: voice.counselorName },
    datePublished: voice.publishedAt,
    ...(voice.updatedAt && { dateModified: voice.updatedAt }),
    publisher: { "@type": "Organization", name: "Kinda", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };
  const faqLd = voice.faq?.length
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
    <div className="ks-page">
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

      <main style={{ background: "#FBFCF8" }}>
        {/* ─── 記事ヘッダー ─── */}
        <header className="ks-detail-head">
          <nav className="ks-breadcrumb" aria-label="パンくず">
            <Link href="/">ふたりへ</Link>
            <span>/</span>
            <Link href="/kinda-voices">Kinda voices</Link>
          </nav>

          <div
            className="ks-detail-thumb"
            style={{
              background: voice.heroImage
                ? `url('${voice.heroImage}') center/cover no-repeat, ${VOICE_FALLBACK_GRADIENT}`
                : VOICE_FALLBACK_GRADIENT,
            }}
          >
            <span className="ks-detail-thumb-stage">{voice.area}</span>
            <span className="ks-detail-thumb-period">{voice.agencyName}</span>
          </div>

          <h1 className="ks-detail-title">{voice.title}</h1>

          <div className="ks-detail-byline">
            <span>{voice.counselorName} さん</span>
            <span className="ks-detail-byline-sep">·</span>
            <span>{voice.publishedAt}</span>
          </div>
        </header>

        {/* ─── 本文 ─── */}
        <article className="ks-article">
          <div className="ks-article-inner">
            {/* リード */}
            <p className="ks-article-p" style={{ fontWeight: 600 }}>
              {voice.lead}
            </p>

            {/* プロフィールサマリー（箱組み） */}
            <aside
              style={{
                margin: "24px 0",
                padding: "16px 18px",
                background: "#F3EFE7",
                border: "1px solid #E8DED0",
                borderRadius: 12,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: ".08em",
                  color: "#9A8A7A",
                  marginBottom: 8,
                }}
              >
                {voice.counselorName} さんのプロフィール
              </p>
              <dl style={{ display: "grid", gap: 6 }}>
                {voice.profile.map((p) => (
                  <div key={p.label} style={{ display: "flex", gap: 12, fontSize: 14 }}>
                    <dt style={{ color: "#9A8A7A", minWidth: 92 }}>{p.label}</dt>
                    <dd style={{ color: "var(--ink, #3C3630)" }}>{p.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>

            {/* セクション本文 */}
            {voice.sections.map((sec) => (
              <section key={sec.heading}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    margin: "36px 0 12px",
                    color: "var(--ink, #3C3630)",
                  }}
                >
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((para, i) => (
                  <p key={i} className="ks-article-p">
                    {para}
                  </p>
                ))}
              </section>
            ))}

            {/* 印象に残っているひとこと（引用ブロック） */}
            <blockquote className="ks-pullquote">
              <span className="ks-pullquote-mark" aria-hidden>
                &ldquo;
              </span>
              <p>{voice.pullQuote}</p>
            </blockquote>

            {/* クロージング */}
            {voice.closing.map((para, i) => (
              <p key={i} className="ks-article-p">
                {para}
              </p>
            ))}

            {/* タグ */}
            <div className="ks-article-tags">
              {voice.tags.map((t) => (
                <span key={t} className="ks-article-tag">
                  {t}
                </span>
              ))}
            </div>

            {/* シェア */}
            <ShareBar title={voice.title} label="この記事をシェアする" />

            {/* CTA → カウンセラー詳細（実データに紐づく場合のみ） */}
            <div className="ks-article-divider" />
            <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
              {counselor ? (
                <Link
                  href={`/counselors/${counselor.id}?from=voices&fromId=${voice.slug}`}
                  className="ks-cta-btn ks-cta-btn-primary"
                >
                  {voice.ctaLabel ?? `${voice.counselorName}さんの話を、直接聞いてみる。`}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 7h10M7 2l5 5-5 5" />
                  </svg>
                </Link>
              ) : (
                <Link href="/kinda-talk" className="ks-cta-btn ks-cta-btn-primary">
                  カウンセラーを見る
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 7h10M7 2l5 5-5 5" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </article>

        {/* ─── FAQ ─── */}
        {voice.faq && voice.faq.length > 0 && (
          <section className="ks-related">
            <div className="ks-related-inner" style={{ maxWidth: 720 }}>
              <div className="ks-section-divider" />
              <h2 className="ks-section-title">
                <em>questions</em>
              </h2>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4, marginBottom: 16 }}>
                この記事によく寄せられる質問
              </div>
              <div style={{ textAlign: "left" }}>
                <FAQAccordion items={voice.faq} />
              </div>
            </div>
          </section>
        )}

        {/* ─── ほかの取材記事 ─── */}
        {others.length > 0 && (
          <section className="ks-related">
            <div className="ks-related-inner">
              <div className="ks-section-divider" />
              <h2 className="ks-section-title">
                <em>other voices</em>
              </h2>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
                ほかのカウンセラーの話も読む
              </div>
              <div className="ks-section-divider" />
              <div className="ks-related-grid">
                {others.map((v) => (
                  <Link key={v.slug} href={`/kinda-voices/${v.slug}`} className="ks-card">
                    <div className="ks-card-meta">
                      <span className="ks-card-stage">{v.area}</span>
                      <span className="ks-card-period">{v.agencyName}</span>
                    </div>
                    <p className="ks-card-quote">{v.title}</p>
                    <div className="ks-card-foot">
                      <span className="ks-card-author">— {v.counselorName} さん</span>
                      <span className="ks-card-link">
                        読む
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2 7h10M7 2l5 5-5 5" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 一覧へ戻る ─── */}
        <section style={{ textAlign: "center", padding: "32px 24px 8px" }}>
          <Link
            href="/kinda-voices"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--mid)",
              textDecoration: "underline",
              fontFamily: "var(--font-sans)",
            }}
          >
            ぜんぶの取材記事を見る
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
