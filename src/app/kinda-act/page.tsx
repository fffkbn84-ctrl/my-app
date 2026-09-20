import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import KindaLoader from "@/components/ui/KindaLoader";
import { getShops } from "@/lib/data";
import { ACT_THUMB_VARIANTS } from "@/lib/placeSections";
import PlacesDataNotice from "@/components/places/PlacesDataNotice";
import KindaActClient from "./KindaActClient";

/**
 * Kinda act はお見合い・デートで使う「食事系」のみ。
 * Supabase の thumb_variant が cafe / lounge のお店を表示する。
 * 美容室・ネイル・眉毛・エステ・フォトスタジオは Kinda glow へ分離。
 */
/**
 * Supabase の shops は静的生成のままだと新規掲載が反映されないため ISR にする。
 * 掲載・取り下げが本番へ出るまで最大 5 分。
 */
export const revalidate = 300;

export default async function KindaActPage() {
  // F-3 (2026-05-21): Supabase 経由に統一。
  // 以前は placesHomeData (mock) を直接 filter していたため、
  // Supabase 9 件構成と Kinda act 表示 10 件がズレていた。
  const allPlaces = await getShops();
  const places = allPlaces.filter((p) => ACT_THUMB_VARIANTS.has(p.thumbVariant));

  return (
    <div className="kt-page">
      <Header />

      <main style={{ background: "transparent" }}>
        <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kinda act" }]} />
        {/* ─── ヒーロー（フルブリード画像 + ふんわりフェードイン + パステルピンクtint） ─── */}
        <section className="kt-hero">
          <div className="kt-hero-bg-image kt-hero-bg-image--desktop kt-hero-fade-in" aria-hidden>
            <Image
              src="/images/kinda-act-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
          <div className="kt-hero-bg-image kt-hero-bg-image--mobile kt-hero-fade-in" aria-hidden>
            <Image
              src="/images/kinda-act-hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 32%" }}
            />
          </div>
          <div className="kt-hero-tint" aria-hidden />
          <div className="kt-hero-overlay" aria-hidden />
          <div className="kt-hero-inner">
            <div className="kt-hero-card">
              <h1 className="kt-hero-title">
                Kinda <em>act</em>
              </h1>
              <div className="kt-hero-sub">実際に会う場所を、選ぶ</div>

              <div className="kt-hero-divider" />
              <p className="kt-hero-copy">
                お見合いも、デートも。
                <br />
                ふたりの行動に、安心できる場所を。
              </p>

              <Link href="#places" className="kt-hero-cta">
                お店を見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
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
              お見合いやデートで使うお店は、空気で決まります。
              <br />
              Kinda ふたりへは、次の 4 つの基準で取材・厳選しています。
            </p>

            {/* 4つの選定基準カード（2×2 グリッド） */}
            <div className="ka-criteria-grid">
              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                </div>
                <div className="ka-criterion-label">話しやすい音量</div>
                <div className="ka-criterion-desc">大声を出さず会話できる空間</div>
              </div>

              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 18v3M20 18v3" />
                    <path d="M2 14h20l-1 4H3z" />
                    <path d="M5 14V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6" />
                  </svg>
                </div>
                <div className="ka-criterion-label">座席の距離</div>
                <div className="ka-criterion-desc">隣との適度な間が取れるか</div>
              </div>

              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                    <path d="M16 4l4 4M20 4l-4 4" opacity=".5" />
                  </svg>
                </div>
                <div className="ka-criterion-label">店員の干渉</div>
                <div className="ka-criterion-desc">過度な接客がないか</div>
              </div>

              <div className="ka-criterion">
                <div className="ka-criterion-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" />
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                    <circle cx="14" cy="12" r="1" fill="currentColor" />
                  </svg>
                </div>
                <div className="ka-criterion-label">入店のしやすさ</div>
                <div className="ka-criterion-desc">気軽に予約・入店できるか</div>
              </div>
            </div>

            <p className="kt-guide-text">
              「行って確かめた」のバッジは、運営スタッフが実際に足を運んで確かめたお店。
              <br />
              「相談所おすすめ」は、現役カウンセラーが推薦する場所です。
            </p>
          </div>
        </section>

        {/* ─── 一覧（クライアント。useSearchParams 利用のため Suspense 必須） ─── */}
        <div id="places" />
        <Suspense fallback={<KindaLoader variant="page" />}>
          <KindaActClient places={places} />
        </Suspense>

        <PlacesDataNotice places={places} borderColor="rgba(184,110,104,.4)" />
      </main>

      <Footer />
    </div>
  );
}
