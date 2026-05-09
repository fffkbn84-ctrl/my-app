import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQAccordion, { FAQItem } from "@/components/kinda-talk/FAQAccordion";
import { STORIES } from "@/lib/mock/stories";
import KindaStoryClient from "./KindaStoryClient";

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "ここに載っている物語は、本当に本人が書いていますか？",
    a: "はい。Kinda story は、面談を経たご本人にお話を伺い、ご本人の確認を取った上で掲載しています。広告や創作ではなく、実際にあった一人ひとりの言葉です。",
  },
  {
    q: "成婚した人の話だけを読みたいです",
    a: "ページ上部のフィルターから「成婚」を選んでください。交際中・活動中の物語は別タブで読めます。途中段階の声も「いま続けている人がいる」という安心になるよう、同じ重さで紹介しています。",
  },
  {
    q: "自分の物語も載せられますか？",
    a: "はい。Kinda 経由で活動を始めた方には、節目のタイミングで取材のお声がけをしています。「これから婚活する誰かに話を聞かせたい」と思っていただけたら、担当カウンセラーまでお伝えください。",
  },
  {
    q: "物語に出てくるカウンセラーに予約できますか？",
    a: "はい。各物語の最後に、担当カウンセラー・所属相談所のリンクが付いています。「この人なら自分も話せそう」と感じたら、リールページから直接予約できます。",
  },
  {
    q: "うまくいった人の話ばかり読むと、焦りませんか？",
    a: "Kinda story は「うまくいった人の自慢」ではなく、「迷いながら続けた人の記録」として載せています。中には『まだ途中だけど続けられている』という声もあります。読むだけで完結する、整理のための物語として使ってください。",
  },
];

export default function KindaStoryPage() {
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
    <div className="ks-page">
      <Header />

      <main style={{ background: "#FBFCF8" }}>
        {/* ─── ヒーロー（フルブリード画像） ─── */}
        <section className="ks-hero">
          <div className="ks-hero-bg-image" aria-hidden>
            <Image
              src="/images/section-story-new.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="ks-hero-tint" aria-hidden />
          <div className="ks-hero-overlay" aria-hidden />
          <div className="ks-hero-inner">
            <div className="ks-hero-eyebrow">Kinda story</div>
            <h1 className="ks-hero-title">
              Kinda <em>story</em>
            </h1>
            <div className="ks-hero-sub">続いている、ふたりの物語</div>

            <div className="ks-hero-divider" />
            <p className="ks-hero-copy">
              成婚した先輩も、迷いながら続けている人も。
              <br />
              ぜんぶ、本人の言葉のまま。
            </p>
          </div>
        </section>

        {/* ─── イントロ ─── */}
        <section className="ks-intro">
          <div className="ks-intro-inner">
            <div className="ks-intro-eyebrow">about kinda story</div>
            <div className="ks-intro-divider" />
            <h2 className="ks-intro-title">うまくいった人の話、だけじゃない</h2>
            <div className="ks-intro-divider" />
            <p className="ks-intro-text">
              ここに載っているのは、面談を経た本人たちが、自分の言葉で語ってくれた物語です。
              成婚した人の話もあれば、まだ途中の人の話もあります。
              焦らせるためではなく、「続けてる人がいる」と知るための場所として。
            </p>
          </div>
        </section>

        {/* ─── 一覧（クライアント：フィルタ + グリッド） ─── */}
        <KindaStoryClient stories={STORIES} />

        {/* ─── カウンセラーCTA ─── */}
        <section className="ks-cta">
          <div className="ks-cta-inner">
            <p className="ks-cta-eyebrow">next step</p>
            <h2 className="ks-cta-title">あなたの物語を、ここから始める</h2>
            <p className="ks-cta-text">
              読んでいる中で「この人なら話せそう」と感じたら、
              <br />
              そのカウンセラーに直接予約できます。
            </p>
            <div className="ks-cta-actions">
              <Link href="/kinda-talk" className="ks-cta-btn ks-cta-btn-primary">
                カウンセラーを見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
              <Link href="/diagnosis" className="ks-cta-btn ks-cta-btn-ghost">
                合うタイプを知る（1〜3分）
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="ks-faq">
          <div className="ks-faq-inner">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div className="ks-section-divider" />
              <h2 className="ks-section-title">
                <em>faq</em>
              </h2>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
                よくある質問
              </div>
              <div className="ks-section-divider" />
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
