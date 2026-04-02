import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import SympathyButton from "@/components/episodes/SympathyButton";
import { episodesData } from "@/lib/mock/episodes";

export async function generateStaticParams() {
  return episodesData.map((e) => ({ id: String(e.id) }));
}

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const episodeData = episodesData.find((e) => String(e.id) === id);
  if (!episodeData) notFound();
  const episode = episodeData;

  const others = episodesData.filter((e) => String(e.id) !== id).slice(0, 2);

  return (
    <>
      <Header />

      <main style={{ paddingTop: 64, background: "var(--white)" }}>
        {/* ═══ ヒーローエリア ═══ */}
        <section style={{ background: episode.gradient, padding: "56px 32px 48px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {/* パンくず */}
            <p style={{ fontSize: 11, color: "rgba(0,0,0,.4)", marginBottom: 36 }}>
              <Link href="/" style={{ color: "inherit" }}>
                ふたりへ
              </Link>
              {" > "}
              <Link href="/#episodes" style={{ color: "inherit" }}>
                成婚エピソード
              </Link>
            </p>

            {/* 2人アバター */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div className="ep-detail-av">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="5" fill={episode.person1.color} opacity=".6" />
                  <path
                    d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10"
                    stroke={episode.person1.color}
                    strokeWidth="1.3"
                    fill="none"
                    opacity=".4"
                  />
                </svg>
              </div>

              {/* ハート */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 13.5C8 13.5 2 9.5 2 5.5C2 3.5 3.5 2 5.5 2C6.5 2 7.5 2.5 8 3.5C8.5 2.5 9.5 2 10.5 2C12.5 2 14 3.5 14 5.5C14 9.5 8 13.5 8 13.5Z"
                  stroke="#C8A97A"
                  strokeWidth="1.2"
                  fill="rgba(200,169,122,.2)"
                />
              </svg>

              <div className="ep-detail-av">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="5" fill={episode.person2.color} opacity=".6" />
                  <path
                    d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10"
                    stroke={episode.person2.color}
                    strokeWidth="1.3"
                    fill="none"
                    opacity=".4"
                  />
                </svg>
              </div>
            </div>

            {/* カップル情報 */}
            <p
              style={{
                fontFamily: "Noto Sans JP, sans-serif",
                fontSize: 14,
                color: "var(--ink)",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {episode.person1.initial}さん（{episode.person1.age}）×{" "}
              {episode.person2.initial}さん（{episode.person2.age}）
            </p>

            {/* 期間 */}
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {episode.period} · {episode.year}
            </p>

            {/* 相談所バッジ */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <span
                style={{
                  background: "var(--adim)",
                  color: "var(--accent)",
                  fontSize: 11,
                  padding: "4px 16px",
                  borderRadius: 20,
                  letterSpacing: ".06em",
                  fontFamily: "Noto Sans JP, sans-serif",
                }}
              >
                {episode.agencyName}
              </span>
            </div>

            {/* タイトル */}
            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(20px,3vw,32px)",
                color: "var(--black)",
                fontWeight: 400,
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              {episode.title}
            </h1>
          </div>
        </section>

        {/* ═══ 本文エリア ═══ */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
          {/* ストーリー */}
          {episode.story.map((para, i) => (
            <p key={i} className="ep-story">
              {para}
            </p>
          ))}

          {/* 引用 */}
          <blockquote className="ep-quote">{episode.quote}</blockquote>

          {/* タグ */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {episode.tags.map((tag) => (
              <span key={tag} className="ep-story-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* 共感ボタン */}
          <SympathyButton initialCount={episode.sympathyCount} />

          {/* 相談所・カウンセラーリンクカード */}
          <div
            style={{
              marginTop: 48,
              padding: "28px 24px",
              background: "var(--pale)",
              borderRadius: 16,
              border: "1px solid var(--light)",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              このエピソードの担当者
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Link
                href={`/agencies/${episode.agencyId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "13px 0",
                  background: "white",
                  border: "1px solid var(--light)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "var(--ink)",
                  textDecoration: "none",
                  fontFamily: "Noto Sans JP, sans-serif",
                }}
              >
                相談所を見る
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href={`/counselors/${episode.counselorId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "13px 0",
                  background: "var(--black)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "white",
                  textDecoration: "none",
                  fontFamily: "Noto Sans JP, sans-serif",
                }}
              >
                カウンセラーに予約する
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 他のエピソード */}
          {others.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: ".24em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  marginBottom: 20,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Other Stories
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {others.map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/episodes/${ep.id}`}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "1px solid var(--light)",
                      background: "var(--white)",
                    }}
                  >
                    {/* サムネイル */}
                    <div
                      style={{
                        background: ep.gradient,
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="10" r="5" fill={ep.person1.color} opacity=".6" />
                          <path
                            d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10"
                            stroke={ep.person1.color}
                            strokeWidth="1.3"
                            fill="none"
                            opacity=".4"
                          />
                        </svg>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 13.5C8 13.5 2 9.5 2 5.5C2 3.5 3.5 2 5.5 2C6.5 2 7.5 2.5 8 3.5C8.5 2.5 9.5 2 10.5 2C12.5 2 14 3.5 14 5.5C14 9.5 8 13.5 8 13.5Z"
                          stroke="#C8A97A"
                          strokeWidth="1.2"
                          fill="rgba(200,169,122,.2)"
                        />
                      </svg>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="10" r="5" fill={ep.person2.color} opacity=".6" />
                          <path
                            d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10"
                            stroke={ep.person2.color}
                            strokeWidth="1.3"
                            fill="none"
                            opacity=".4"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* テキスト */}
                    <div style={{ padding: "14px 16px" }}>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--accent)",
                          marginBottom: 6,
                          fontFamily: "Noto Sans JP, sans-serif",
                        }}
                      >
                        {ep.agencyName} · {ep.period}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--ink)",
                          lineHeight: 1.65,
                          fontFamily: "var(--font-mincho)",
                        }}
                      >
                        {ep.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </>
  );
}
