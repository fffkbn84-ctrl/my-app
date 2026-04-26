import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCounselors } from "@/lib/data";
import { KINDA_TYPES, KINDA_TYPE_KEYS, KindaTypeKey } from "@/lib/kinda-types";
import CounselorReelGrid from "@/components/kinda-talk/CounselorReelGrid";

export function generateStaticParams() {
  return KINDA_TYPE_KEYS.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const t = KINDA_TYPES[type as KindaTypeKey];
  if (!t) return { title: "タイプが見つかりません | ふたりへ" };

  const title = `${t.name}のあなたへ | Kinda talk | ふたりへ`;
  const description = `${t.name}（${t.description}）に合うカウンセラーをリール形式で見つけよう。Kinda ふたりへ。`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/kinda-talk/type/${type}` },
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const t = KINDA_TYPES[type as KindaTypeKey];
  if (!t) notFound();

  const all = await getCounselors();
  const filtered = all.filter((c) =>
    (c.matchingTypes ?? []).includes(type),
  ).sort(
    (a, b) =>
      b.rating * Math.log(b.reviewCount + 2) -
      a.rating * Math.log(a.reviewCount + 2),
  );

  return (
    <div className="kt-page" data-section="talk">
      <Header />

      <main style={{ background: "#FEFCFA" }}>
        <section className="kt-hero" style={{ background: t.bg }}>
          <div className="kt-hero-inner">
            <div className="kt-hero-eyebrow" style={{ color: t.color }}>
              Kinda type · {t.shortName}
            </div>
            <h1 className="kt-hero-title">
              <em>{t.name}</em>のあなたへ
            </h1>
            <div className="kt-hero-sub">{t.description}</div>

            <div
              className="kt-hero-illust"
              aria-hidden
              style={{
                background: `radial-gradient(circle at 30% 30%, white, ${t.bg})`,
                boxShadow: `0 12px 40px ${t.color}33, inset 0 1.5px 0 rgba(255,255,255,.92)`,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: t.color,
                  opacity: 0.85,
                }}
              />
            </div>

            <div className="kt-hero-divider" />

            <p
              style={{
                fontSize: 13,
                color: "var(--mid)",
                lineHeight: 1.85,
                maxWidth: 460,
                margin: "0 auto",
              }}
            >
              {t.name}の方には、ペースを合わせ、言葉を待ち、
              <br />
              安心して話せる場をつくれるカウンセラーが合います。
            </p>
          </div>
        </section>

        <div className="kt-section-head">
          <div className="kt-section-divider" />
          <h2 className="kt-section-title">
            <em>{filtered.length} counselors</em>
          </h2>
          <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
            {t.name}のあなたに合うカウンセラー
          </div>
          <div className="kt-section-divider" />
        </div>

        <div className="kt-grid-wrap">
          {filtered.length > 0 ? (
            <CounselorReelGrid counselors={filtered} />
          ) : (
            <div className="kt-grid-tease" style={{ maxWidth: 320, margin: "0 auto" }}>
              <strong>該当するカウンセラーは現在準備中です</strong>
              <span>新しいカウンセラーは順次公開していきます。</span>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link
              href="/kinda-talk"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 22px",
                border: "1px solid var(--light)",
                borderRadius: 999,
                fontSize: 13,
                color: "var(--ink)",
              }}
            >
              すべてのカウンセラーを見る
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
