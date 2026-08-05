import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { jsonLdStringify } from "@/lib/jsonld";
import { PAIR_LAYERS, PAIR_TOPICS, topicsByLayer } from "@/lib/pair/topics";

/**
 * /kinda-pair/topics — 話題と聞き方の全公開ページ（SEO の本命）。
 *
 * - 認証の後ろに隠さない。全 {PAIR_TOPICS.length} 件を公開する。
 * - 文言は必ず src/lib/pair/topics.ts から生成する（二重管理を作らない）。
 * - 構造化データは Article + FAQPage + BreadcrumbList のみ。
 *   Review / AggregateRating は使わない（既存方針）。
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

const PAGE_PATH = "/kinda-pair/topics";
const TITLE = `お見合いと交際で話しておきたい${PAIR_TOPICS.length}のこと`;
const ATOMIC_ANSWER =
  "お見合いの会話は、話す内容を探すより「まだ話していないこと」を先に並べると続きます。";
const DESCRIPTION =
  "お見合いと交際で話しておきたい話題を、ふれる・知る・重なる・描くの4つの層に分けて全件公開しています。そのまま口に出せる聞き方の例つき。";

export const metadata: Metadata = {
  title: `${TITLE}｜Kinda pair`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
};

const FAQ_ITEMS = [
  {
    q: "お見合いで何を話せばいいですか？",
    a: "最初の1時間は「ふれる」の層で十分です。休みの過ごし方や好きな食べ物など、答えやすい話題から入ると、沈黙が生まれにくくなります。",
  },
  {
    q: "結婚観や年収は、いつ聞けばいいですか？",
    a: "お見合いの当日ではなく、交際に入ってからで問題ありません。相談所によっては担当の方が先に確認していることもあります。",
  },
  {
    q: "毎回同じ話になってしまいます。",
    a: "話した話題を書き出すと、まだ触れていない話題が見えます。Kinda pair は、その並べ替えだけをするページです。",
  },
  {
    q: "相手にこのページを渡してもいいですか？",
    a: "交際に入って直接連絡できるようになってからであれば、問題ありません。お見合いの前は、ご自身の準備としてお使いください。",
  },
];

const FEDERATION_NOTE = [
  "ここで触れている進め方は、コネクトシップ加盟の相談所を前提としています。",
  "IBJ など他の連盟では取り扱いが異なる場合があります。",
  "詳しくは担当の方にご確認ください。",
];

export default function KindaPairTopicsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    inLanguage: "ja",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${PAGE_PATH}` },
    author: { "@type": "Organization", name: "Kinda 編集部" },
    publisher: {
      "@type": "Organization",
      name: "Kinda",
      url: SITE_URL,
    },
  };

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

      <main className="kp-topics">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda pair", href: "/kinda-pair" },
            { label: "話しておきたいこと" },
          ]}
        />

        <article className="kp-topics-article">
          <header className="kp-topics-header">
            <p className="kp-eyebrow">kinda pair</p>
            <h1 className="kp-topics-h1">{TITLE}</h1>
            <p className="kp-atomic">{ATOMIC_ANSWER}</p>
            <p className="kp-topics-lead">
              お見合いの席でも、交際に入ってからでも、話題そのものより「どこまで話したか」を
              見失うほうが困ります。ここでは、ふたりのあいだで触れておきたい話題を
              ふれる・知る・重なる・描くの4つの層に分けて、{PAIR_TOPICS.length}件すべて公開しています。
              それぞれに、そのまま口に出せる聞き方の例をつけました。順番に進める必要はありません。
              いまのふたりに合う層から見てください。
            </p>
          </header>

          {PAIR_LAYERS.map((layer) => (
            <section key={layer.key} className="kp-topics-section">
              <h2 className="kp-topics-h2">
                {layer.label}
                <span className="kp-topics-h2-sub">
                  {layer.lead.replace(/。$/, "")}
                </span>
              </h2>
              <div className="kp-topics-items">
                {topicsByLayer(layer.key).map((t) => (
                  <div key={t.key} className="kp-topics-item">
                    <h3 className="kp-topics-h3">{t.title}</h3>
                    <p className="kp-topics-ask">
                      <span className="kp-topics-ask-label">聞き方の例</span>
                      「{t.ask}」
                    </p>
                    {t.note && <p className="kp-topics-note">{t.note}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="kp-topics-section">
            <h2 className="kp-topics-h2">よくある質問</h2>
            <div className="kp-topics-items">
              {FAQ_ITEMS.map((f) => (
                <div key={f.q} className="kp-topics-item">
                  <h3 className="kp-topics-h3">{f.q}</h3>
                  <p className="kp-topics-answer">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="kp-topics-section">
            <h2 className="kp-topics-h2">連盟による違いについて</h2>
            <div className="kp-topics-callout">
              {FEDERATION_NOTE.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>

          <div className="kp-topics-cta">
            <p className="kp-topics-cta-lead">
              話した話題と、まだ話していない話題を分けるところから。
            </p>
            <Link href="/kinda-pair/solo" className="kp-btn-primary kp-btn-inline">
              まだ話していないことを並べてみる
            </Link>
          </div>
        </article>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(faqJsonLd) }}
      />
    </div>
  );
}
