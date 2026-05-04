import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { placesHomeData } from "@/lib/mock/places-home";
import KindaGlowClient from "./KindaGlowClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

const TITLE = "Kinda glow｜好きな人に会う前に、自分を整える";
const DESCRIPTION =
  "美容室・フォトスタジオ・サロンを Kinda ふたりへが厳選してご紹介。お見合いやデートの前に、自分のコンディションを整える時間を見つけよう。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/kinda-glow` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/kinda-glow`,
    siteName: "Kinda ふたりへ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Kinda glow は「好きな人に会う前に、自分を整える」ための場所。
 * 美容室・フォトスタジオ・（将来）ネイル・眉毛・エステ。
 */
const GLOW_CATEGORY_LABELS = new Set(["美容室", "フォトスタジオ"]);

export default function KindaGlowPage() {
  const places = placesHomeData.filter((p) => GLOW_CATEGORY_LABELS.has(p.categoryLabel));

  return (
    <div className="kt-page" data-section="glow">
      <Header />

      <main style={{ background: "transparent" }}>
        <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kinda glow" }]} />

        {/* ─── ヒーロー ─── */}
        <section className="kt-hero">
          <div className="kt-hero-bg-image kt-hero-fade-in" aria-hidden>
            {/* 既存の section-beauty 画像を流用。専用画像できたら差し替え */}
            <img
              src="/images/section-beauty-n2.png.jpg"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
            />
          </div>
          <div className="kt-hero-tint" aria-hidden />
          <div className="kt-hero-overlay" aria-hidden />
          <div className="kt-hero-inner">
            <div className="kt-hero-card">
              <div className="kt-hero-eyebrow">Kinda glow</div>
              <h1 className="kt-hero-title">
                Kinda <em>glow</em>
              </h1>
              <div className="kt-hero-sub">自分を、整える時間</div>

              <div className="kt-hero-divider" />
              <p className="kt-hero-copy">
                好きな人に会う前に、
                <br />
                鏡を見て「これでいい」と思える時間を。
              </p>

              <Link href="#places" className="kt-hero-cta">
                お店を見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 2v10M2 7l5 5 5-5" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 選び方ガイド ─── */}
        <section className="kt-guide">
          <div className="kt-guide-inner">
            <div className="kt-guide-eyebrow">how we pick</div>
            <div className="kt-guide-divider" />
            <h2
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 18,
                color: "var(--ink)",
                fontWeight: 500,
                margin: "12px 0",
              }}
            >
              Kinda ふたりへの選定基準
            </h2>
            <div className="kt-guide-divider" />

            <p className="kt-guide-text">
              整える時間は、施術の上手さだけでは決まりません。
              <br />
              Kinda ふたりへは、次の 4 つの基準で取材・厳選しています。
            </p>

            <div className="ka-criteria-grid">
              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c4 0 6-3 9-3s5 3 9 3" />
                    <path d="M3 17c4 0 6-3 9-3s5 3 9 3" />
                  </svg>
                </div>
                <div className="ka-criterion-label">落ち着いた雰囲気</div>
                <div className="ka-criterion-desc">緊張せず過ごせる空間</div>
              </div>

              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                    <path d="M5 14a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4" />
                  </svg>
                </div>
                <div className="ka-criterion-label">プライバシー配慮</div>
                <div className="ka-criterion-desc">他のお客さんとの距離感</div>
              </div>

              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
                <div className="ka-criterion-label">通いやすさ</div>
                <div className="ka-criterion-desc">駅近・予約しやすい時間</div>
              </div>

              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L9 9l-7 .8 5 5L5.5 22 12 18l6.5 4L17 14.8l5-5L15 9z" />
                  </svg>
                </div>
                <div className="ka-criterion-label">担当者の丁寧さ</div>
                <div className="ka-criterion-desc">話を聞いて施術してくれる</div>
              </div>
            </div>

            <p className="kt-guide-text">
              「取材済み」のバッジは、運営スタッフが現地で確認したお店。
              <br />
              「相談所おすすめ」は、現役カウンセラーが推薦する場所です。
            </p>
          </div>
        </section>

        {/* ─── 一覧（クライアント。useSearchParams 利用のため Suspense 必須） ─── */}
        <div id="places" />
        <Suspense fallback={<div style={{ minHeight: 400 }} />}>
          <KindaGlowClient places={places} />
        </Suspense>

        {/* ─── 注記：すべてサンプル表示 ─── */}
        <section
          style={{
            padding: "32px 20px 56px",
            background: "rgba(254,252,250,.18)",
          }}
        >
          <div
            style={{
              maxWidth: 540,
              margin: "0 auto",
              padding: "20px 24px",
              background: "rgba(255,255,255,.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px dashed rgba(138,102,176,.4)",
              borderRadius: 16,
              textAlign: "center",
              fontSize: 12,
              color: "var(--mid)",
              lineHeight: 1.85,
            }}
          >
            現在掲載中のお店はすべて<strong style={{ color: "var(--ink)" }}>サンプル表示</strong>です。
            <br />
            Kinda ふたりへが実際に取材した本物のお店は、これから順次公開予定です。
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
