import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCounselors } from "@/lib/data";
import FAQAccordion, { FAQItem } from "@/components/kinda-talk/FAQAccordion";
import KindaTalkClient from "./KindaTalkClient";

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "カウンセラーって、何人くらい比較すべきですか？",
    a: "Kinda では、3〜5人のリールをじっくり見ることをおすすめしています。会話の温度感や言葉の選び方は、写真と短い言葉から意外と伝わるもの。気になった人と一度話してみて、合うか確かめるのが近道です。",
  },
  {
    q: "リール画像から、何を読み取ればいいですか？",
    a: "「この人の前で、自分は素でいられそうか」を感じてみてください。キャッチコピーの言葉づかい、写真の空気、3〜5枚の流れ。すべてカウンセラー本人が選んだもので、人柄が滲み出ています。",
  },
  {
    q: "Kinda の予約と、相談所への直接予約は何が違いますか？",
    a: "Kinda 経由の予約は、カウンセラー個人を指名できる点が違います。相談所に直接連絡すると、誰が担当になるかは相手次第。Kinda なら、リールで選んだその人が、最初の面談から担当します。",
  },
  {
    q: "診断（Kinda type）を受けないと使えませんか？",
    a: "いいえ、診断を受けなくても全機能をお使いいただけます。診断はあくまで「タイプの目安」を教えてくれるツール。直感で気になったカウンセラーから話してみるのも、Kinda の使い方です。",
  },
  {
    q: "レビューは本当に面談済みの人が書いていますか？",
    a: "はい。Kinda のレビューは、面談を完了した方だけが書ける仕組みになっています。面談後に発行される認証コード経由でしか投稿できないため、信頼できる声だけが並びます。",
  },
];

export default async function KindaTalkPage() {
  // Supabase からデータ取得（0件 / エラー時は mock COUNSELORS にフォールバック）
  const counselors = (await getCounselors()).sort((a, b) => {
    return (
      b.rating * Math.log(b.reviewCount + 2) - a.rating * Math.log(a.reviewCount + 2)
    );
  });

  // FAQ 構造化データ
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
    <div className="kt-page">
      <Header />

      <main style={{ background: "#FEFCFA" }}>
        {/* ─── ヒーロー（フルブリード画像 + カード式テキスト） ─── */}
        <section className="kt-hero">
          <div className="kt-hero-bg-image kt-hero-fade-in" aria-hidden>
            <Image
              src="/images/sections_talk-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="kt-hero-tint" aria-hidden />
          <div className="kt-hero-overlay" aria-hidden />
          <div className="kt-hero-inner">
            <div className="kt-hero-card">
              <div className="kt-hero-eyebrow">Kinda talk</div>
              <h1 className="kt-hero-title">
                Kinda <em>talk</em>
              </h1>
              <div className="kt-hero-sub">相談したい・迷っている</div>

              <div className="kt-hero-divider" />
              <p className="kt-hero-copy">
                「この人なら話せそう」を、
                <br />
                写真と言葉から見つけよう。
              </p>

              <Link href="/diagnosis" className="kt-hero-cta">
                あなたに合うタイプを知る（1〜3分）
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 選び方ガイド（ミニ版） ─── */}
        <section className="kt-guide">
          <div className="kt-guide-inner">
            <div className="kt-guide-eyebrow">how to choose</div>
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
              選び方のヒント
            </h2>
            <div className="kt-guide-divider" />

            <p className="kt-guide-text">
              カウンセラーは、あなたの婚活を支える&ldquo;人&rdquo;です。
              ロゴでもサービス名でもなく、生身の人間同士の対話で関係が進みます。
              だから Kinda では、
              カウンセラー個人を見て選んでほしい。
            </p>
            <p className="kt-guide-text">
              リールには、その人の言葉や空気が詰まっています。
              3〜5枚の写真と、20文字のキャッチコピー。
              それだけで、不思議と「この人なら話せそう」が見えてきます。
            </p>

            <Link href="/about" className="kt-guide-link">
              もっと詳しく
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ─── リール一覧（クライアント） ─── */}
        <KindaTalkClient counselors={counselors} />

        {/* ─── FAQ ─── */}
        <section className="kt-faq">
          <div className="kt-faq-inner">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div className="kt-section-divider" />
              <h2 className="kt-section-title">
                <em>faq</em>
              </h2>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
                よくある質問
              </div>
              <div className="kt-section-divider" />
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
