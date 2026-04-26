import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { placesHomeData } from "@/lib/mock/places-home";
import KindaActClient from "./KindaActClient";

export default function KindaActPage() {
  // モックデータをそのまま使用（Supabase 連携時は getPlaces() に差し替える）
  const places = placesHomeData;

  return (
    <div className="kt-page">
      <Header />

      <main style={{ background: "#FEFCFA" }}>
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
              お見合いも、デートも、婚活前の身支度も。
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
              ふたりへの選定基準
            </h2>
            <div className="kt-guide-divider" />

            <p className="kt-guide-text">
              お見合いやデートで使うお店は、空気で決まります。
              話しやすい音量、座席の距離、店員の干渉度合い、入店のしやすさ。
              ふたりへが実際に取材して、安心して会話に集中できる場所だけを掲載しています。
            </p>
            <p className="kt-guide-text">
              「取材済み」のバッジは、運営スタッフが現地で確認したお店。
              「相談所おすすめ」は、現役カウンセラーが推薦する場所。
              バッジで選び方の安心感を可視化しています。
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
            ふたりへが実際に取材した本物のお店は、これから順次公開予定です。
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
