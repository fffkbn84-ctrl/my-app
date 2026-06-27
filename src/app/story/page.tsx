import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getAllMdxStories, getStoryHeroImage } from "@/lib/mdx-stories";

export const metadata: Metadata = {
  title: "Kinda story | ふたりの物語 | Kinda ふたりへ",
  description:
    "結婚相談所での出会い・交際・成婚まで、実際に経験した方の物語を、ご本人の同意を得て取材・構成しています。",
  alternates: {
    canonical: "https://kinda.jp/story",
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  marriage: "成婚",
  dating: "交際",
  struggle: "悩み克服",
};

export default async function StoryListPage() {
  const stories = await getAllMdxStories();

  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
      <Header />

      <main>
        {/* ヒーロー */}
        <section
          style={{
            padding: "64px 24px 48px",
            textAlign: "center",
            background: "linear-gradient(180deg, #F5EEE6 0%, #EDE4D8 100%)",
          }}
        >
          <p
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "var(--accent-deep, #B8806E)",
              marginBottom: 16,
              textTransform: "lowercase",
            }}
          >
            kinda story
          </p>
          <h1
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 400,
              color: "var(--black)",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            ふたりの物語
          </h1>
          <p
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 14,
              lineHeight: 2,
              color: "var(--mid)",
              maxWidth: 480,
              margin: "0 auto",
              fontWeight: 300,
            }}
          >
            成婚した先輩も、迷いながら続けている人も。
            <br />
            ぜんぶ、本人の言葉のまま。
          </p>
        </section>

        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda story" },
          ]}
        />

        {/* 記事グリッド */}
        <section
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}
        >
          {stories.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--mid)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                padding: "40px 0",
              }}
            >
              物語はまだ準備中です。
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {stories.map((story) => (
                <Link
                  key={story.slug}
                  href={`/story/${story.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    textDecoration: "none",
                    border: "1px solid rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  className="story-card"
                >
                  <div
                    style={{
                      height: "200px",
                      position: "relative",
                      background: "linear-gradient(135deg,#E9D9C4,#F3E6D2)",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={getStoryHeroImage(story)}
                      alt={story.heroAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      style={{ objectFit: "cover" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        border: "1px solid rgba(255,255,255,0.8)",
                        borderRadius: "20px",
                        padding: "3px 12px",
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
                  <div style={{ padding: "20px 20px 24px", flexGrow: 1 }}>
                    <p
                      style={{
                        fontFamily: "'Shippori Mincho', serif",
                        fontSize: 16,
                        fontWeight: 500,
                        color: "var(--black)",
                        lineHeight: 1.7,
                        marginBottom: 10,
                      }}
                    >
                      {story.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: 12,
                        color: "var(--mid)",
                        lineHeight: 1.85,
                        fontWeight: 300,
                        marginBottom: 16,
                      }}
                    >
                      {story.description.slice(0, 60)}...
                    </p>
                    {story.pullQuote && (
                      <p
                        style={{
                          fontFamily: "'Shippori Mincho', serif",
                          fontSize: 13,
                          color: "var(--accent-deep, #B8806E)",
                          lineHeight: 1.8,
                          borderLeft: "2px solid var(--accent)",
                          paddingLeft: 10,
                        }}
                      >
                        「{story.pullQuote}」
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        .story-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}
