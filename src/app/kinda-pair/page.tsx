import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import NotifySignup from "@/components/kinda-talk/NotifySignup";
import { jsonLdStringify } from "@/lib/jsonld";
import { PAIR_LAYERS, PAIR_TOPICS } from "@/lib/pair/topics";

/**
 * /kinda-pair — Kinda pair の LP。
 *
 * ブランドルール：
 * - ヒーロー・CTA で「中立」「婚活」「結婚」「ゴール」「診断」を使わない
 * - 「相性」「スコア」「％」を書かない
 * - 絵文字を使わない（アイコンが要る場合は細い SVG）
 * - CTA は2つだけ（/kinda-pair/solo と /kinda-pair/topics）
 *
 * 構造化データは WebApplication + BreadcrumbList のみ。
 * aggregateRating / Review は付けない（既存方針）。
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

const DESCRIPTION =
  "話したことと、まだ話していないこと。ふたりの会話がいまどこまで来ているかを、28の話題で並べます。登録なし・端末内に保存。";

export const metadata: Metadata = {
  title: "お見合い・交際で話すこと｜Kinda pair",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/kinda-pair` },
};

const STEPS = [
  {
    num: 1,
    title: "話題を1枚ずつ送る",
    desc: `${PAIR_TOPICS.length}の話題が、1画面に1つずつ出てきます`,
  },
  {
    num: 2,
    title: "3つのうちから選ぶ",
    desc: "もう話した／まだ／いまは置いておく。それだけです",
  },
  {
    num: 3,
    title: "まだ話していないことを受け取る",
    desc: "そのまま口に出せる聞き方が、話題ごとに並びます",
  },
];

export default function KindaPairPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kinda pair",
    url: `${SITE_URL}/kinda-pair`,
    description: DESCRIPTION,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "ja",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    publisher: {
      "@type": "Organization",
      name: "Kinda",
      url: SITE_URL,
    },
  };

  return (
    <div className="kt-page">
      <Header />

      <main className="kp-lp">
        <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kinda pair" }]} />

        {/* ─── ヒーロー ─── */}
        <section className="kp-lp-hero">
          <p className="kp-eyebrow">kinda pair</p>
          <h1 className="kp-lp-h1">
            話したことと、
            <br />
            まだ話していないこと。
          </h1>
          <p className="kp-lp-hero-lead">
            ふたりの会話が、いま、どこまで来ているか。
            <br />
            3分で並べてみます。
          </p>

          <div className="kp-btn-col kp-btn-col--hero">
            <Link href="/kinda-pair/solo" className="kp-btn-primary kp-btn-inline">
              まだ話していないことを並べる
            </Link>
            <Link href="/kinda-pair/topics" className="kp-btn-outline kp-btn-inline">
              {PAIR_TOPICS.length}の話題を見る
            </Link>
          </div>

          <p className="kp-lp-meta">
            登録は要りません。選んだ内容は、お使いの端末の中だけに保存されます。
          </p>
        </section>

        {/* ─── 何をするページか ─── */}
        <section className="kp-lp-section">
          <h2 className="kp-lp-h2">会話が続かないのは、話題がないからではない</h2>
          <p className="kp-lp-text">
            初めて会った日から何度か会うようになると、不思議なもので、
            だんだん同じ話に戻ってくることがあります。天気の話、仕事の話、週末の話。
            話題が尽きたわけではなく、どこまで話したかを覚えていられないだけ、ということが少なくありません。
          </p>
          <p className="kp-lp-text">
            相手のことを知りたい気持ちはあるのに、いざ会うと何から聞けばいいのか分からなくなる。
            聞きそびれたまま時間だけが過ぎて、あとになって「そういえば、あの話をしていなかった」と気づく。
            会話の中身より、会話の地図がないことのほうが、しんどかったりします。
          </p>
          <p className="kp-lp-text">
            Kinda pair がするのは、その地図を1枚つくることだけです。
            話題を一つずつ見て、もう話したか、まだかを分けていく。
            それだけで、次に会うときに聞きたいことが、自分の言葉で並びます。
            うまく話す方法は載せていません。並べ替えるだけのページです。
          </p>
        </section>

        {/* ─── 3ステップ ─── */}
        <section className="kp-lp-section">
          <h2 className="kp-lp-h2">使い方</h2>
          <ol className="kp-steps">
            {STEPS.map((s) => (
              <li key={s.num} className="kp-step">
                <span className="kp-step-num">{s.num}</span>
                <div>
                  <p className="kp-step-title">{s.title}</p>
                  <p className="kp-step-desc">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="kp-lp-text">
            最後まで送らなくても構いません。層の区切りごとに、そこまでの結果を見られます。
            途中でページを閉じても、次に開いたときは続きから始められます。
          </p>
        </section>

        {/* ─── 4つの層 ─── */}
        <section className="kp-lp-section">
          <h2 className="kp-lp-h2">{PAIR_TOPICS.length}の話題は、4つの層に分かれています</h2>
          <p className="kp-lp-text">
            会って間もない時期に聞きやすいことと、しばらく経ってからのほうが話しやすいことがあります。
            順番に進む必要はありませんが、手前の層から見ていくと、話が急に重くなりません。
          </p>
          <ul className="kp-layer-cards">
            {PAIR_LAYERS.map((l) => (
              <li key={l.key} className="kp-layer-card">
                <p className="kp-layer-card-name">{l.label}</p>
                <p className="kp-layer-card-lead">{l.lead}</p>
              </li>
            ))}
          </ul>
          <Link href="/kinda-pair/topics" className="kp-textlink">
            {PAIR_TOPICS.length}の話題と聞き方をすべて見る
          </Link>
        </section>

        {/* ─── 端末内保存 ─── */}
        <section className="kp-lp-section">
          <h2 className="kp-lp-h2">選んだ内容は、どこにも送られません</h2>
          <p className="kp-lp-text">
            選んだ内容は、お使いの端末の中にだけ保存しています。
            当社のサーバーには送信していません。ブラウザの保存データを削除すると、記録も消えます。
            誰かに見せたいときだけ、コピーか画像で持ち出せます。
          </p>
        </section>

        {/* ─── ふたりで使う機能 ─── */}
        <section className="kp-lp-section">
          <h2 className="kp-lp-h2">ふたりで使う機能は準備中です</h2>
          <p className="kp-lp-text">
            いまはひとりで並べるところまでです。準備ができたらお知らせします。
          </p>
          <div className="kp-notify">
            <NotifySignup
              source="pair_lp"
              heading="ふたりで使う機能を準備しています"
              body={
                <>
                  ふたりで使える機能は、整い次第お知らせします。
                  <br />
                  公開されたら、いちばんにお知らせします。
                </>
              }
              footnote="Kinda pair の新しい機能が公開されたときのみご連絡します。"
              secondaryHref="/kinda-pair/topics"
              secondaryLabel={`${PAIR_TOPICS.length}の話題を見る`}
            />
          </div>
        </section>

        <div className="kp-topics-cta">
          <p className="kp-topics-cta-lead">まずは、ひとりで並べるところから。</p>
          <Link href="/kinda-pair/solo" className="kp-btn-primary kp-btn-inline">
            まだ話していないことを並べる
          </Link>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdStringify(appJsonLd) }}
      />
    </div>
  );
}
