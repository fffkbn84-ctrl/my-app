import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FAQAccordion, { FAQItem } from "@/components/kinda-talk/FAQAccordion";
import { getAllColumns } from "@/lib/columns";
import ColumnsClient from "./ColumnsClient";

export const metadata: Metadata = {
  title: "Kinda voices | ふたりを見守る人たち | Kinda ふたりへ",
  description:
    "Kinda voices は、結婚相談所のカウンセラーやスタッフへの取材レポート、編集部のコラム。実際に足を運んで書いた、ふたりを見守る人たちの声です。",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Kinda voices に載る記事は誰が書いていますか？",
    a: "Kinda 編集部が、全国の結婚相談所・カフェ・レストランに実際に足を運び、自分たちの言葉で書いています。広告記事ではなく、編集部の目で見た本音の温度感をお届けします。",
  },
  {
    q: "取材を受けたいカウンセラー・お店はどう連絡すれば？",
    a: "現在は編集部から取材の依頼をしています。「ぜひ取材してほしい」というお声があれば、運営にお問い合わせいただけると順次検討します。",
  },
  {
    q: "コラムは婚活初心者向けですか？",
    a: "活動段階に応じて読めるよう、「お見合い準備」「デートプラン」「取材レポート」のカテゴリを分けています。これから始める方も、活動中の方も、それぞれ役立つ内容を揃えています。",
  },
];

export default async function ColumnsPage() {
  const columns = await getAllColumns();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="kv-page">
      <Header />

      <main style={{ background: "#FCF8F2" }}>
        {/* ─── ヒーロー（セピアグラデーション） ─── */}
        <section className="kv-hero">
          <div className="kv-hero-bg" aria-hidden />
          <div className="kv-hero-overlay" aria-hidden />
          <div className="kv-hero-inner">
            <div className="kv-hero-eyebrow">Kinda voices</div>
            <h1 className="kv-hero-title">
              Kinda <em>voices</em>
            </h1>
            <div className="kv-hero-sub">ふたりを見守る人たち</div>

            <div className="kv-hero-divider" />
            <p className="kv-hero-copy">
              全国に足を運んで、本人の口から聞いた話。
              <br />
              編集部の目で書いた、本音の温度感。
            </p>
          </div>
        </section>

        {/* パンくず */}
        <div style={{ background: "#FCF8F2" }}>
          <Breadcrumb
            items={[{ label: "ホーム", href: "/" }, { label: "Kinda voices" }]}
          />
        </div>

        {/* ─── イントロ ─── */}
        <section className="kv-intro">
          <div className="kv-intro-inner">
            <div className="kv-intro-eyebrow">about kinda voices</div>
            <div className="kv-intro-divider" />
            <h2 className="kv-intro-title">広告ではなく、足で書いた記事</h2>
            <div className="kv-intro-divider" />
            <p className="kv-intro-text">
              相談所・カフェ・レストランに、編集部が実際に行く。
              カウンセラーに会って話を聞く。そうして集めた声を、整えてお届けします。
              うまくいった人の自慢でも、検索結果のまとめでもなく、
              ふたりを見守る人たちのリアルな言葉として読めるように。
            </p>
          </div>
        </section>

        {/* 一覧（クライアント：フィルタ + グリッド） */}
        <ColumnsClient columns={columns} />

        {/* CTA */}
        <section className="kv-cta">
          <div className="kv-cta-inner">
            <p className="kv-cta-eyebrow">next step</p>
            <h2 className="kv-cta-title">記事を読んだあとに、人に会う</h2>
            <p className="kv-cta-text">
              気になったカウンセラーがいれば、
              <br />
              その人のリールから直接予約できます。
            </p>
            <div className="kv-cta-actions">
              <Link href="/kinda-talk" className="kv-cta-btn kv-cta-btn-primary">
                カウンセラーを見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
              <Link href="/kinda-story" className="kv-cta-btn kv-cta-btn-ghost">
                ふたりの物語も読む
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="kv-faq">
          <div className="kv-faq-inner">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div className="kv-section-divider" />
              <h2 className="kv-section-title">
                <em>faq</em>
              </h2>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
                よくある質問
              </div>
              <div className="kv-section-divider" />
            </div>
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </main>

      <Footer />
    </div>
  );
}
