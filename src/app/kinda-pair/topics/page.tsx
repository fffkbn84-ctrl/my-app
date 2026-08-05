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
 * 本文の正本は `kinda-pair-topics-copy-v1.md`。テキストは一字一句そのまま入れる。
 * 言い回しの改善・要約・言い換えを行わないこと（原稿の指示）。
 * 原稿内の改行は段落の区切り（空行）のみ再現し、段落内の折り返しはブラウザに任せる。
 *
 * - 認証の後ろに隠さない。全 28 件を公開する。
 * - h3 / 聞き方の例 / about は必ず src/lib/pair/topics.ts から生成する
 *   （ページに文言をハードコードしない＝二重管理を作らない）。
 * - 構造化データは Article + FAQPage + BreadcrumbList のみ。
 *   Review / AggregateRating は使わない（既存方針）。
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

const PAGE_PATH = "/kinda-pair/topics";
const H1 = "お見合いと交際で話しておきたい28のこと";
const DESCRIPTION =
  "お見合いと交際で話しておきたい28の話題を、そのまま口に出せる聞き方の例つきで公開しています。話す内容を探すのではなく、まだ話していないことを並べる方法です。";
const ATOMIC_ANSWER =
  "お見合いの会話は、話す内容を探すより「まだ話していないこと」を先に並べると続きます。";

export const metadata: Metadata = {
  title: "お見合い・仮交際で話すこと28と、聞き方の例｜Kinda pair",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PAGE_PATH}` },
};

/* ── 本文（kinda-pair-topics-copy-v1.md より）───────────────────── */

const LEAD: string[] = [
  "お見合いは、およそ1時間です。仮交際に入れば、その後も何度か会うことになります。そのたびに「何を話そう」と考えるのは、そろそろ疲れているかもしれません。",
  "このページには、お見合いと交際のあいだに話しておきたい28の話題を、そのまま口に出せる聞き方の例といっしょに並べています。",
  "順番どおりに進める必要はありません。上から埋めていくものでもありません。いま自分が、どこまで話せていて、どこがまだなのか。それを見るためのものです。",
];

const WHY: string[] = [
  "会話が続かないとき、多くの人は「話題を増やそう」とします。けれど、話題が足りなくて止まることは、実はあまりありません。",
  "止まるのは、同じところを何度も回っているときです。",
  "お仕事のこと、住んでいるところ、休みの日のこと。この3つは、たいてい初回で話します。そして次に会ったとき、また同じ3つに戻ってしまう。婚活の期間が長い方ほど、この回り方が上手になってしまいます。",
  "必要なのは、新しい話題を探すことではなく、すでに話したことを一度どけて、残っているものを見ることです。",
  "残っているものが見えれば、次に何を聞けばいいかは自然に決まります。このページの28は、その「どける」ための並びです。",
];

const LAYERS_INTRO_BEFORE = "28の話題は、深さの順に4つの層に分けています。";
const LAYERS_INTRO_AFTER: string[] = [
  "下の層が埋まっていないと上に行けない、ということはありません。実際の会話は、そんなに順番よく進みません。",
  "そして、深い層まで進んでいることが良いわけでもありません。早く「描く」の話をしたから良い関係、ということはないからです。層は進み具合ではなく、深さの目安として使ってください。",
];

const LAYER_INTROS: Record<string, string[]> = {
  l1: [
    "最初の1時間は、この層だけで足ります。答えやすい話題から入ると、沈黙が生まれにくくなります。",
    "ここでの目的は、相手を知ることよりも、「この人とは話せる」という感覚をお互いに持つことです。",
  ],
  l2: [
    "交際に入ってから、少しずつ触れていく層です。",
    "ここは、好みのように答えがはっきりしていません。だからこそ、行き違いが起きるのもこの層です。連絡の頻度も、一人の時間の必要量も、多い少ないに良い悪いはありません。ただ、違うだけです。",
  ],
  l3: [
    "住む場所、家族との距離、お金の考え方。ふたりの生活が実際に重なっていく部分です。",
    "重い話題も含まれます。時期が来ていないと感じたら、置いておいてかまいません。置いておくことも、ひとつの答えです。",
  ],
  l4: [
    "この先どうしていきたいかを、言葉にしていく層です。",
    "ここまで来たら、遠回しな言い方はかえって伝わりません。急いで結論を出す必要はありませんが、言い換えて濁すよりは、そのままの言葉で置いたほうが、あとが楽になります。",
  ],
};

const SILENCE: string[] = [
  "沈黙が怖い、という声はとても多く聞きます。そして多くの場合、対策として「質問をたくさん用意する」が選ばれます。",
  "けれど質問を並べて持っていくと、今度は面接のようになります。聞く、答える、次を聞く。この形になると、沈黙は減っても会話にはなりません。",
  "用意しておくとよいのは、質問の数ではなく、順番です。",
  "先に「ふれる」の7つを見ておいてください。そのうち、まだ話していないものが3つあれば、1時間は十分に持ちます。沈黙が生まれても、次にどこへ行けばいいか分かっている状態は、質問を20個持っている状態より落ち着いていられます。",
  "もうひとつ。自分の側から先に答えるやり方も有効です。「わたしは家にいる方なんですが、どうですか」のように、自分の答えを先に置くと、相手は答えやすくなり、質問攻めにもなりません。",
];

const SAME_TALK: string[] = [
  "婚活の期間が長くなるほど、会話は上手になります。初対面の1時間を、そつなく持たせられるようになります。",
  "けれど同時に、毎回まったく同じ順番で、同じ話をするようになります。仕事、住んでいるところ、休みの日。この3つを回して1時間が終わる。悪いことではありませんが、それだと相手が変わっても、持ち帰るものがいつも同じになってしまいます。",
  "このとき効くのは、話題を増やすことではありません。「もう話した」を先に外すことです。",
  "このページの28を上から見て、すでに定番になっているものに印をつけてみてください。残ったところが、いつも触れていない領域です。たいていの場合、それは「知る」の層に固まっています。",
];

const FAQ_ITEMS = [
  {
    q: "お見合いで何を話せばいいですか？",
    a: "最初の1時間は「ふれる」の層で十分です。休みの日の過ごし方、好きな食べ物、落ち着く場所など、答えやすい話題から入ると、沈黙が生まれにくくなります。深い話に進もうとするより、この人とは話せる、という感覚をお互いが持てるほうが、次につながります。話題を20個用意するより、まだ話していないものを3つ知っているほうが、当日は落ち着いていられます。",
  },
  {
    q: "年収はプロフィールで分かっているのに、お金の話がしにくいのはなぜですか？",
    a: "知りたいのが金額ではなく、その金額でどう暮らすつもりかだからです。多くの場合、年収そのものはプロフィールに記載があり、お見合いの時点でおおよそ分かっています。それでも話しにくいのは、使い方や家計の考え方が書かれていないからです。ここは交際に入ってから、少しずつで問題ありません。なお、記載の細かさは加盟している連盟によって異なります。",
  },
  {
    q: "毎回同じ話になってしまいます。",
    a: "話した話題を一度書き出すと、まだ触れていない話題が見えます。婚活の期間が長い方ほど、初対面の1時間を上手に回せるようになり、その結果、毎回同じ順番で同じ話をするようになります。必要なのは話題を増やすことではなく、すでに話したものを外すことです。Kinda pair は、その並べ替えだけをするページです。",
  },
  {
    q: "仮交際に入ったら、何から話せばいいですか？",
    a: "連絡の頻度とテンポから置くことをおすすめします。交際のはじめに、いちばん行き違いが起きやすいのがここだからです。こまめに連絡がほしい方と、気にならない方がいて、どちらにも良い悪いはありません。相手のやり方を直す話ではなく、お互いの既定を確かめる話として切り出すと、角が立ちにくくなります。そのうえで「知る」の層を、会うたびに1つか2つずつ。",
  },
  {
    q: "相手にこのページを渡してもいいですか？",
    a: "交際に入って直接連絡が取れるようになってからであれば、問題ありません。お見合いの前は、連絡先を交換していないことが多いため、ご自身の準備としてお使いください。渡すときは、試すような文面にならないほうが受け取りやすくなります。",
  },
];

/** 連盟差の注記（固定文）。全ページ・全ドキュメントでこの2行に統一する */
const FEDERATION_NOTE = [
  "結婚相談所が加盟している連盟によって、ルールが異なる場合があります。",
  "詳しくは担当の方にご確認ください。",
];

const RELATED_LINKS = [
  {
    href: "/kinda-act",
    label: "会う場所を選ぶ（Kinda act）→",
    desc: "1時間ちょうどで自然に切り上げられるか、という視点でお店を見ています。",
  },
  {
    href: "/kinda-note",
    label: "いまの気持ちを整理する（Kinda note）→",
    desc: "うまく言葉にならない日の状態を、60秒で置いていけます。",
  },
  {
    href: "/columns/counselor-de-erabu-soudanjo",
    label: "結婚相談所は「どこ」より「誰」で選ぶ →",
    desc: "話せるかどうかは、担当との相性で決まります。",
  },
];

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p) => (
        <p key={p} className="kp-topics-p">
          {p}
        </p>
      ))}
    </>
  );
}

export default function KindaPairTopicsPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: H1,
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
            <h1 className="kp-topics-h1">{H1}</h1>
            <p className="kp-atomic">{ATOMIC_ANSWER}</p>
            <Prose paragraphs={LEAD} />
          </header>

          <section className="kp-topics-section">
            <h2 className="kp-topics-h2">
              なぜ「話す内容」ではなく「話していないこと」を並べるのか
            </h2>
            <Prose paragraphs={WHY} />

            <p className="kp-topics-p">{LAYERS_INTRO_BEFORE}</p>
            <ul className="kp-layer-legend">
              {PAIR_LAYERS.map((l) => (
                <li key={l.key}>
                  <span className="kp-layer-legend-name">{l.label}</span>
                  <span className="kp-layer-legend-lead">
                    {l.lead.replace(/。$/, "")}
                  </span>
                </li>
              ))}
            </ul>
            <Prose paragraphs={LAYERS_INTRO_AFTER} />
          </section>

          {PAIR_LAYERS.map((layer) => (
            <section key={layer.key} className="kp-topics-section">
              <h2 className="kp-topics-h2">
                {layer.label}{" "}
                <span className="kp-topics-h2-sub">
                  {`\u2014 ${layer.lead.replace(/。$/, "")}`}
                </span>
              </h2>
              <Prose paragraphs={LAYER_INTROS[layer.key] ?? []} />

              <div className="kp-topics-items">
                {topicsByLayer(layer.key).map((t) => (
                  <div key={t.key} className="kp-topics-item">
                    <h3 className="kp-topics-h3">{t.title}</h3>
                    <p className="kp-topics-ask">
                      <span className="kp-topics-ask-label">聞き方の例</span>
                      「{t.ask}」
                    </p>
                    <p className="kp-topics-about">{t.about}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="kp-topics-section">
            <h2 className="kp-topics-h2">
              沈黙が怖いときは、質問を増やすより順番を決める
            </h2>
            <Prose paragraphs={SILENCE} />
          </section>

          <section className="kp-topics-section">
            <h2 className="kp-topics-h2">毎回同じ話になってしまうときは</h2>
            <Prose paragraphs={SAME_TALK} />
          </section>

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
            <Link href="/kinda-pair/solo" className="kp-btn-primary kp-btn-inline">
              まだ話していないことを並べてみる
            </Link>
            <p className="kp-topics-cta-note">
              3分で終わります。登録は要りません。答えた内容はお使いの端末にだけ残ります。
            </p>
          </div>

          <section className="kp-topics-section">
            <ul className="kp-related">
              {RELATED_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="kp-related-link">
                    {l.label}
                  </Link>
                  <span className="kp-related-desc">{l.desc}</span>
                </li>
              ))}
            </ul>
          </section>
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
