import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { placesHomeData } from "@/lib/mock/places-home";
import KindaActClient from "./KindaActClient";

/**
 * Kinda act はお見合い・デートで使う「カフェ・レストラン」のみ。
 * 美容室・ネイル・眉毛・フォトスタジオは Kinda glow へ分離する想定。
 */
const ACT_CATEGORY_LABELS = new Set(["カフェ", "レストラン"]);

export default function KindaActPage() {
  // モックデータから act 対象カテゴリのみ抽出（Supabase 連携時は getPlaces({ scope: 'act' }) に差し替える）
  const places = placesHomeData.filter((p) => ACT_CATEGORY_LABELS.has(p.categoryLabel));

  return (
    <div className="kt-page">
      <Header />

      <main style={{ background: "transparent" }}>
        {/* ─── ヒーロー（フルブリード画像 + パステルピンク被せ） ─── */}
        <section className="kt-hero">
          <div className="kt-hero-bg-image" aria-hidden>
            <Image
              src="/images/section-cafe-pastel.png.PNG"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
          <div className="kt-hero-tint" aria-hidden />
          <div className="kt-hero-overlay" aria-hidden />
          <div className="kt-hero-inner">
            <div className="kt-hero-eyebrow">Kinda act</div>
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
              「取材済み」のバッジは、運営スタッフが現地で確認したお店。
              <br />
              「相談所おすすめ」は、現役カウンセラーが推薦する場所です。
            </p>
          </div>
        </section>

        {/* ─── 一覧（クライアント） ─── */}
        <div id="places" />
        <KindaActClient places={places} />

        {/* ─── 注記：すべてサンプル表示 ─── */}
        <section
          style={{
            padding: "32px 20px 56px",
            background: "var(--pale)",
          }}
        >
          <div
            style={{
              maxWidth: 540,
              margin: "0 auto",
              padding: "20px 24px",
              background: "rgba(255,255,255,.7)",
              border: "1px dashed rgba(184,110,104,.4)",
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
