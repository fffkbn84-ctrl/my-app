import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "編集ポリシー | Kinda ふたりへ",
  description:
    "Kinda ふたりへ の編集ポリシー。誰が、どんな方針で取材・執筆しているか。コラムの情報源、心理学研究の引用方針、口コミの扱い、訂正のルールを明文化しています。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年5月14日";

export default function EditorialPolicyPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kindaについて", href: "/about" },
            { label: "編集ポリシー" },
          ]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">editorial policy</p>
            <h1 className="legal-title">編集ポリシー</h1>
            <p className="legal-meta">最終更新日：{LAST_UPDATED}</p>
            <p className="legal-lead">
              Kinda ふたりへ に掲載するコラム・取材記事・気持ちの整理コンテンツが、
              誰によって、どんな方針で作られているかをまとめています。
              わたしたちは、広告のために書くのではなく、いま婚活をしている人の隣に立つために書いています。
            </p>
          </header>

          <section className="legal-section">
            <h2 className="legal-h2">1. 誰が書いているか</h2>
            <p className="legal-text">
              Kinda ふたりへ のコラム・取材記事は、すべて <strong>Kinda 編集部</strong> が制作しています。
              外部のライターに記事を外注したり、相談所・お店から提供された原稿をそのまま掲載することはありません。
              編集部の構成と担当領域は{" "}
              <Link href="/about" className="legal-link">
                Kindaについて
              </Link>{" "}
              のページで公開しています。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. 取材記事の方針</h2>
            <ul className="legal-ul">
              <li>結婚相談所・カフェ・レストラン・サロンの取材記事は、編集部が<strong>実際に足を運び、自分たちの目で見たこと</strong>をもとに書いています。</li>
              <li>取材費・掲載料の有無によって、記事の評価や論調を変えることはありません。</li>
              <li>広告であることを隠した記事（いわゆるステルスマーケティング）は掲載しません。</li>
              <li>取材先から事実確認の依頼があった場合は対応しますが、編集部の評価や感想の書き換えには応じません。</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. 気持ちの整理コラム（天気タイプ）の方針</h2>
            <p className="legal-text">
              「雨雲」「霧」「朝焼け」などの天気タイプで気持ちを言葉にするコラムは、次の方針で制作しています。
            </p>
            <ul className="legal-ul">
              <li>感情を「良い・悪い」で評価せず、いまの状態をそのまま受け止める書き方をします。</li>
              <li>「早く結婚しないと」と焦らせる表現、他人と比較させる表現は使いません。</li>
              <li>科学的な裏づけに触れる箇所では、実在する心理学研究（感情ラベリング、表出筆記の研究など）のみを引用し、存在しない研究やデータを作ることはしません。</li>
              <li>これらのコラムは気持ちを整理するための読みものであり、医療・心理療法の代わりではありません。強い不調が続く場合は専門機関への相談をご案内しています。</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. 口コミの扱い</h2>
            <ul className="legal-ul">
              <li>相談所・カウンセラーへの口コミは、Kinda 経由で<strong>面談を完了した方のみ</strong>が投稿できます。</li>
              <li>運営が代理で入力する口コミには、必ず「代理掲載」のバッジを表示します（景品表示法に基づく対応です）。</li>
              <li>編集部が口コミの星評価や本文を、相談所に有利・不利になるよう書き換えることはありません。</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. 更新と訂正</h2>
            <ul className="legal-ul">
              <li>記事には公開日と最終更新日を表示しています。内容を見直した際は更新日を改めます。</li>
              <li>事実に誤りがあることが分かった場合は、速やかに訂正し、必要に応じて訂正した旨を記載します。</li>
              <li>記事の内容に関するご指摘は{" "}
                <Link href="/contact" className="legal-link">
                  お問い合わせ
                </Link>{" "}
                から受け付けています。
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. 運営の透明性について</h2>
            <p className="legal-text">
              カウンセラー・相談所・お店の<strong>並び順のロジック</strong>や、Kinda がどのように収益を得ているかは、
              編集方針と切り離せないものです。これらは{" "}
              <Link href="/about/transparency" className="legal-link">
                運営の透明性
              </Link>{" "}
              のページで別途明文化しています。
            </p>
          </section>

          <p className="legal-end">
            Kinda ふたりへ は、これからもこの方針を守って制作を続けます。
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}
