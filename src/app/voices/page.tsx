import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getPublishedVoices } from "@/lib/voices";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

export const metadata: Metadata = {
  title: "Kinda voices | カウンセラーに会いに行った記録 | Kinda ふたりへ",
  description:
    "結婚相談所のカウンセラー一人ひとりに会いに行き、その人の言葉で聞いた話を記事にしています。相談所ではなく、伴走する人から選ぶための取材記事です。",
  alternates: { canonical: `${SITE_URL}/voices` },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function VoicesPage() {
  const voices = await getPublishedVoices();

  return (
    <div className="kv-page">
      <Header />

      <main style={{ background: "#FCF8F2" }}>
        <section className="kv-hero">
          <div className="kv-hero-bg" aria-hidden />
          <div className="kv-hero-overlay" aria-hidden />
          <div className="kv-hero-inner">
            <div className="kv-hero-eyebrow">Kinda voices</div>
            <h1 className="kv-hero-title">
              Kinda <em>voices</em>
            </h1>
            <div className="kv-hero-sub">会いに行って、聞いた話</div>

            <div className="kv-hero-divider" />
            <p className="kv-hero-copy">
              相談所ではなく、その人から選ぶために。
              <br />
              カウンセラー一人ひとりに会いに行った記録です。
            </p>
          </div>
        </section>

        <div style={{ background: "#FCF8F2" }}>
          <Breadcrumb
            items={[{ label: "ホーム", href: "/" }, { label: "Kinda voices" }]}
          />
        </div>

        <section
          style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          {voices.length === 0 ? (
            <div
              style={{
                border: "1px solid var(--light)",
                borderRadius: 16,
                padding: "40px 28px",
                background: "var(--white)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: 18,
                  color: "var(--ink)",
                  lineHeight: 1.9,
                  marginBottom: 14,
                }}
              >
                いま、取材に出ています。
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "var(--mid)",
                  lineHeight: 2,
                  marginBottom: 24,
                }}
              >
                最初の記事を準備しています。
                <br />
                先にカウンセラーを見てみることもできます。
              </p>
              <Link
                href="/kinda-talk"
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
                  padding: "13px 28px",
                  boxShadow: "0 6px 22px rgba(212,160,144,.45)",
                }}
              >
                カウンセラーを見てみる
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {voices.map((v) => (
                <Link
                  key={v.slug}
                  href={`/voices/${v.slug}`}
                  style={{
                    display: "block",
                    border: "1px solid var(--light)",
                    borderRadius: 16,
                    overflow: "hidden",
                    textDecoration: "none",
                    background: "var(--white)",
                  }}
                >
                  <div
                    style={{
                      height: 140,
                      background:
                        v.thumbnail ||
                        "url('/images/Kinda-voices-nouse.webp') center/cover no-repeat",
                    }}
                  />
                  <div style={{ padding: "18px 20px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      {[v.area, v.agencyName, v.partLabel]
                        .filter((x): x is string => !!x)
                        .map((label) => (
                          <span
                            key={label}
                            style={{
                              border: "1px solid var(--light)",
                              borderRadius: 20,
                              fontSize: 10,
                              color: "var(--mid)",
                              padding: "3px 12px",
                              fontFamily: "var(--font-sans)",
                            }}
                          >
                            {label}
                          </span>
                        ))}
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-mincho)",
                        fontSize: 17,
                        fontWeight: 400,
                        color: "var(--black)",
                        lineHeight: 1.7,
                        margin: "0 0 8px",
                      }}
                    >
                      {v.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12.5,
                        fontWeight: 300,
                        color: "var(--mid)",
                        lineHeight: 1.9,
                        margin: "0 0 12px",
                      }}
                    >
                      {v.description}
                    </p>
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 11,
                        color: "var(--muted)",
                      }}
                    >
                      {formatDate(v.publishedAt)} · {v.readTime} min read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
