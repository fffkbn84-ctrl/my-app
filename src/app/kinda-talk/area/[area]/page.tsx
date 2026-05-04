import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { getCounselors } from "@/lib/data";
import CounselorReelGrid from "@/components/kinda-talk/CounselorReelGrid";

/* スラグ（URL）→ 検索用部分文字列・表示名 */
const AREA_MAP: Record<string, { label: string; match: string[] }> = {
  tokyo: { label: "東京", match: ["東京"] },
  osaka: { label: "大阪", match: ["大阪"] },
  nagoya: { label: "名古屋", match: ["名古屋"] },
  fukuoka: { label: "福岡", match: ["福岡"] },
  online: { label: "オンライン", match: ["オンライン"] },
};

export function generateStaticParams() {
  return Object.keys(AREA_MAP).map((area) => ({ area }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const info = AREA_MAP[area];
  if (!info) return { title: "エリアが見つかりません | Kinda ふたりへ" };

  const title = `${info.label}のカウンセラー一覧 | Kinda talk | Kinda ふたりへ`;
  const description = `${info.label}エリアの結婚相談所カウンセラーを、リールと言葉で選ぼう。Kinda ふたりへなら、所属相談所のロゴではなくカウンセラー個人を見て予約できます。`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/kinda-talk/area/${area}` },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const info = AREA_MAP[area];
  if (!info) notFound();

  const all = await getCounselors();
  const filtered = all.filter((c) =>
    info.match.some((m) => c.area.includes(m)),
  ).sort(
    (a, b) =>
      b.rating * Math.log(b.reviewCount + 2) -
      a.rating * Math.log(a.reviewCount + 2),
  );

  return (
    <div className="kt-page" data-section="talk">
      <Header />

      <main style={{ background: "#FEFCFA" }}>
        <SectionSubHeader sectionName="Kinda talk" sectionRoot="/kinda-talk" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda talk", href: "/kinda-talk" },
            { label: info.label },
          ]}
        />
        <section className="kt-hero">
          <div className="kt-hero-inner">
            <div className="kt-hero-eyebrow">Kinda talk · area</div>
            <h1 className="kt-hero-title">
              {info.label}<em>のカウンセラー</em>
            </h1>
            <div className="kt-hero-sub">
              {info.label}エリアで活動するカウンセラーを{filtered.length}名掲載中
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
              {info.label}で婚活を始めるなら、まずカウンセラーを見て決めよう。
              <br />
              リールに込められた言葉と空気から、あなたが安心して話せる人が見つかります。
            </p>
          </div>
        </section>

        <div className="kt-section-head">
          <div className="kt-section-divider" />
          <h2 className="kt-section-title">
            <em>{filtered.length} counselors</em>
          </h2>
          <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
            {info.label}エリアの在籍カウンセラー
          </div>
          <div className="kt-section-divider" />
        </div>

        <div className="kt-grid-wrap">
          <CounselorReelGrid counselors={filtered} />
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
              すべてのエリアを見る
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
