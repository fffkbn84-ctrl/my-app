import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FAQAccordion, { FAQItem } from "@/components/kinda-talk/FAQAccordion";
import { getAllColumns } from "@/lib/columns";
import ColumnsClient from "./ColumnsClient";

export const metadata: Metadata = {
  title: "コラム | 気持ちの整理と、相談所の選び方 | Kinda ふたりへ",
  description:
    "結婚相談所の選び方、お見合いやデートの準備、揺れる気持ちの整理。Kinda 編集部が書いた読みものです。カウンセラー個人への取材記事は Kinda voices にあります。",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "コラムは誰が書いていますか？",
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
            <div className="kv-hero-eyebrow">column</div>
            <h1 className="kv-hero-title">コラム</h1>
            <div className="kv-hero-sub">読みながら、整理する</div>

            <div className="kv-hero-divider" />
            <p className="kv-hero-copy">
              決めきれない日も、比べたくなる日もある。
              <br />
              そのままの順番で考えるための読みもの。
            </p>
          </div>
        </section>

        {/* パンくず */}
        <div style={{ background: "#FCF8F2" }}>
          <Breadcrumb
            items={[{ label: "ホーム", href: "/" }, { label: "コラム" }]}
          />
        </div>

        {/* ─── イントロ ─── */}
        <section className="kv-intro">
          <div className="kv-intro-inner">
            <div className="kv-intro-eyebrow">about column</div>
            <div className="kv-intro-divider" />
            <h2 className="kv-intro-title">答えを急がないための読みもの</h2>
            <div className="kv-intro-divider" />
            <p className="kv-intro-text">
              相談所の選び方、はじめての面談、揺れたときの気持ちの置き場所。
              編集部が調べたことと、実際に見聞きしたことをもとに書いています。
              うまくいった人の自慢でも、検索結果のまとめでもなく、
              自分のペースで考えるための材料として読めるように。
              カウンセラー個人への取材記事は Kinda voices にあります。
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
