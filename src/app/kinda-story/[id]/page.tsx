import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SympathyButton from "@/components/episodes/SympathyButton";
import ShareBar from "@/components/share/ShareBar";
import ReadingConversionFooter from "@/components/reading/ReadingConversionFooter";
import InlineBridgeCta from "@/components/reading/InlineBridgeCta";
import { STORIES, getStoryById, getStoryThumbnail } from "@/lib/mock/stories";
import type { StoryStage } from "@/lib/mock/stories";
import { COUNSELORS, AGENCIES } from "@/lib/data";

/** サムネ未読込・欠損時のフォールバック（home の STAGE_VISUAL と同色） */
const STAGE_GRADIENT: Record<StoryStage, string> = {
  成婚: "linear-gradient(135deg,#E9D9C4,#F3E6D2)",
  交際中: "linear-gradient(135deg,#DDE5D2,#EEF2E4)",
  活動中: "linear-gradient(135deg,#DCE2EE,#ECEFF7)",
};

export function generateStaticParams() {
  return STORIES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const story = getStoryById(id);
  if (!story) return { title: "Kinda story | ふたりへ" };
  const title = `${story.title} | Kinda story | ふたりへ`;
  const description = story.quote.slice(0, 100);
  // 記事ごとのサムネ（個別 thumbnail > stage プール）を og:image に流用。
  // SNS シェア時のカード画像を記事固有にして拡散・流入を強める。
  const image = getStoryThumbnail(story);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: image, width: 1672, height: 941, alt: story.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: `/kinda-story/${id}` },
  };
}

export default async function KindaStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = getStoryById(id);
  if (!story) notFound();

  const counselor = COUNSELORS.find((c) => c.id === story.counselorId);
  const agency = AGENCIES.find((a) => a.id === story.agencyId);

  // 関連物語（自分以外を最大3件）
  const related = STORIES.filter((s) => s.id !== story.id).slice(0, 3);

  // 構造化データ：Article のみ（Review/Rating は付けない＝ステマ規制・広告誤認回避）
  const SITE_URL = "https://kinda.jp";
  const canonical = `${SITE_URL}/kinda-story/${story.id}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.quote.slice(0, 120),
    image: `${SITE_URL}${getStoryThumbnail(story)}`,
    author: { "@type": "Person", name: "ふうか" },
    publisher: {
      "@type": "Organization",
      name: "Kinda",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };
  // FAQPage（質問形 Q&A がある物語のみ）。リッチリザルト狙い。
  const faqLd = story.faq?.length
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
        {/* ─── 記事ヘッダー（Kinda voices 仕様：角丸サムネ + 下にタイトル） ─── */}
        <header className="ks-detail-head">
          <nav className="ks-breadcrumb" aria-label="パンくず">
            <Link href="/">ふたりへ</Link>
            <span>/</span>
            <Link href="/kinda-story">Kinda story</Link>
          </nav>

          <div
            className="ks-detail-thumb"
            style={{
              background: `url('${getStoryThumbnail(story)}') center/cover no-repeat, ${STAGE_GRADIENT[story.stage]}`,
            }}
          >
            <span className="ks-detail-thumb-stage">{story.stage}</span>
            <span className="ks-detail-thumb-period">{story.periodLabel}</span>
          </div>

          <h1 className="ks-detail-title">{story.title}</h1>

          <div className="ks-detail-byline">
            <span>
              {story.author}（{story.age}）
            </span>
            <span className="ks-detail-byline-sep">·</span>
            <span>{story.date}</span>
          </div>
        </header>

        {/* ─── 本文 ─── */}
        <article className="ks-article">
          <div className="ks-article-inner">
            {story.body.map((para, i) => {
              // 本文の中盤に、押し付けない 1 行のサブ CTA を差し込む（自然な橋）
              const midIndex = Math.floor(story.body.length / 2);
              const showMidCta = i === midIndex && story.body.length >= 3;
              return (
                <div key={i}>
                  <p className="ks-article-p">{para}</p>
                  {showMidCta && <InlineBridgeCta variant="story" />}
                </div>
              );
            })}

            {story.pullQuote && (
              <blockquote className="ks-pullquote">
                <span className="ks-pullquote-mark" aria-hidden>
                  &ldquo;
                </span>
                <p>{story.pullQuote}</p>
              </blockquote>
            )}

            {/* タグ */}
            <div className="ks-article-tags">
              {story.tags.map((t) => (
                <span key={t} className="ks-article-tag">
                  {t}
                </span>
              ))}
            </div>

            {/* 共感ボタン */}
            <SympathyButton
              initialCount={story.sympathyCount}
              targetType="story"
              targetId={story.id}
            />

            {/* シェア */}
            <ShareBar title={story.title} label="この物語をシェアする" />

            {/* 担当（相談所名が非公開の物語ではカード自体を出さない） */}
            {(counselor || agency) && (
            <>
            <div className="ks-article-divider" />
            <div className="ks-author-block">
              <p className="ks-author-eyebrow">この物語を支えた人たち</p>

              {counselor && (
                <Link
                  href={`/counselors/${counselor.id}?from=story&fromId=${story.id}`}
                  className="ks-author-card"
                >
                  <div
                    className="ks-author-avatar"
                    style={{ background: counselor.gradient }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                      <circle cx="14" cy="10" r="4" stroke={counselor.svgColor} strokeWidth="1.6" />
                      <path
                        d="M5 23c0-4 4-7 9-7s9 3 9 7"
                        stroke={counselor.svgColor}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="ks-author-card-body">
                    <p className="ks-author-card-role">担当カウンセラー</p>
                    <p className="ks-author-card-name">{counselor.name}</p>
                    <p className="ks-author-card-sub">
                      {counselor.area}・経験 {counselor.experience}年
                    </p>
                  </div>
                  <span className="ks-author-card-arrow" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 7h10M7 2l5 5-5 5" />
                    </svg>
                  </span>
                </Link>
              )}

              {agency && (
                <Link
                  href={`/agencies/${agency.id}?from=story&fromId=${story.id}`}
                  className="ks-author-card"
                >
                  <div
                    className="ks-author-avatar"
                    style={{ background: agency.gradient }}
                  >
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
                      <path
                        d="M4 22V10l9-6 9 6v12"
                        stroke="rgba(0,0,0,.4)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 22v-6h6v6"
                        stroke="rgba(0,0,0,.4)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="ks-author-card-body">
                    <p className="ks-author-card-role">所属相談所</p>
                    <p className="ks-author-card-name">{agency.name}</p>
                    <p className="ks-author-card-sub">{agency.area}</p>
                  </div>
                  <span className="ks-author-card-arrow" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 7h10M7 2l5 5-5 5" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
            </>
            )}
          </div>
        </article>

        {/* ─── 次の物語 ─── */}
        {related.length > 0 && (
          <section className="ks-related">
            <div className="ks-related-inner">
              <div className="ks-section-divider" />
              <h2 className="ks-section-title">
                <em>other stories</em>
              </h2>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
                ほかの物語も読む
              </div>
              <div className="ks-section-divider" />

              <div className="ks-related-grid">
                {related.map((s) => (
                  <Link key={s.id} href={`/kinda-story/${s.id}`} className="ks-card">
                    <div className="ks-card-meta">
                      <span className="ks-card-stage">{s.stage}</span>
                      <span className="ks-card-period">{s.periodLabel}</span>
                    </div>
                    <p className="ks-card-quote">「{s.quote}」</p>
                    <div className="ks-card-foot">
                      <span className="ks-card-author">
                        — {s.author}（{s.age}）
                      </span>
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

        {/* ─── Conversion Footer（読了 → 行動への橋）─── */}
        <ReadingConversionFooter variant="story" />

        {/* ─── 物語の閲覧ループ ─── */}
        <section style={{ textAlign: "center", padding: "32px 24px 8px" }}>
          <Link
            href="/kinda-story"
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
            ぜんぶの物語を見る
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
