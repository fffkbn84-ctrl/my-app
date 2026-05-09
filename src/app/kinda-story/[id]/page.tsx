import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SympathyButton from "@/components/episodes/SympathyButton";
import { STORIES, getStoryById } from "@/lib/mock/stories";
import { COUNSELORS, AGENCIES } from "@/lib/data";

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
  return {
    title: `${story.title} | Kinda story | ふたりへ`,
    description: story.quote.slice(0, 100),
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

  return (
    <div className="ks-page">
      <Header />

      <main style={{ background: "#FBFCF8" }}>
        {/* ─── ヒーロー ─── */}
        <section className="ks-detail-hero">
          <div className="ks-detail-hero-bg" aria-hidden>
            <Image
              src="/images/section-story-new.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="ks-detail-hero-tint" aria-hidden />
          <div className="ks-detail-hero-overlay" aria-hidden />

          <div className="ks-detail-hero-inner">
            {/* パンくず */}
            <nav className="ks-breadcrumb" aria-label="パンくず">
              <Link href="/">ふたりへ</Link>
              <span>/</span>
              <Link href="/kinda-story">Kinda story</Link>
            </nav>

            <div className="ks-detail-meta">
              <span className="ks-detail-stage">{story.stage}</span>
              <span className="ks-detail-period">{story.periodLabel}</span>
            </div>

            <h1 className="ks-detail-title">{story.title}</h1>

            <div className="ks-detail-byline">
              <span>{story.author}（{story.age}）</span>
              <span className="ks-detail-byline-sep">·</span>
              <span>{story.date}</span>
            </div>
          </div>
        </section>

        {/* ─── 本文 ─── */}
        <article className="ks-article">
          <div className="ks-article-inner">
            {story.body.map((para, i) => (
              <p key={i} className="ks-article-p">
                {para}
              </p>
            ))}

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
            <SympathyButton initialCount={story.sympathyCount} />

            {/* 担当 */}
            <div className="ks-article-divider" />
            <div className="ks-author-block">
              <p className="ks-author-eyebrow">この物語を支えた人たち</p>

              {counselor && (
                <Link href={`/counselors/${counselor.id}`} className="ks-author-card">
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
                <Link href={`/agencies/${agency.id}`} className="ks-author-card">
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

        {/* ─── CTA ─── */}
        <section className="ks-cta">
          <div className="ks-cta-inner">
            <p className="ks-cta-eyebrow">next step</p>
            <h2 className="ks-cta-title">あなたの物語を、ここから</h2>
            <p className="ks-cta-text">
              読んで「自分も話してみたい」と思ったら、
              <br />
              気になるカウンセラーに直接予約できます。
            </p>
            <div className="ks-cta-actions">
              <Link href="/kinda-talk" className="ks-cta-btn ks-cta-btn-primary">
                カウンセラーを見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
              <Link href="/kinda-story" className="ks-cta-btn ks-cta-btn-ghost">
                ぜんぶの物語を見る
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
