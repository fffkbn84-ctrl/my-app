import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "運営の透明性 | Kinda ふたりへ",
  description:
    "Kinda ふたりへ がどのように収益を得ているか、カウンセラー・相談所・お店の並び順をどう決めているかを明文化しています。広告で順位を操作しない、ユーザーファーストの設計です。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年5月14日";

export default function TransparencyPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kindaについて", href: "/about" },
            { label: "運営の透明性" },
          ]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">transparency</p>
            <h1 className="legal-title">運営の透明性</h1>
            <p className="legal-meta">最終更新日：{LAST_UPDATED}</p>
            <p className="legal-lead">
              Kinda ふたりへ が、どうやって収益を得ているのか。
              カウンセラーやお店の並び順を、どんな基準で決めているのか。
              ここを隠さないことが、ユーザーファーストを名乗る前提だと考えています。
            </p>
          </header>

          <section className="legal-section">
            <h2 className="legal-h2">1. Kinda がお金を得るしくみ</h2>
            <ul className="legal-ul">
              <li>ユーザーが Kinda を利用するのは<strong>完全に無料</strong>です。会員登録も、Kinda note も、コラムを読むことも、料金は一切かかりません。</li>
              <li>Kinda の収益は、<strong>結婚相談所からの送客料</strong>です。Kinda 経由で面談予約が成立したとき、相談所から 1 件あたり ¥5,000 をいただいています。</li>
              <li>サービス開始初期は、最初に提携する相談所の掲載料を一定期間無料にしています。最新の条件は{" "}
                <Link href="/partners" className="legal-link">
                  掲載のご相談
                </Link>{" "}
                のページに記載しています。
              </li>
              <li>ユーザーから料金を取らないのは、「お金を払った人ではなく、本当に必要な人に情報を届ける」ためです。</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. 並び順を、広告で操作しません</h2>
            <p className="legal-text">
              Kinda には「お金を多く払えば上に表示される」という枠はありません。
              カウンセラー・相談所・お店の表示順は、次のような要素で決まります。
            </p>
            <ul className="legal-ul">
              <li>検索条件（エリア・タイプなど）との一致度</li>
              <li>口コミの件数・内容（面談を完了した方が書いたもの）</li>
              <li>プロフィールやリールの充実度</li>
              <li>ユーザーが選んだ並び替え（おすすめ順／評価が高い順 など）</li>
            </ul>
            <p className="legal-text">
              送客料の金額によって順位を入れ替えることはしません。
              「広告に頼らない」というのは、Kinda の設計そのものです。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. お店のバッジの意味</h2>
            <p className="legal-text">
              お店に表示されるバッジは、Kinda との関係性を表すもので、優劣を表すものではありません。
            </p>
            <ul className="legal-ul">
              <li><strong>取材済み</strong>：Kinda 編集部が実際に足を運んで取材したお店</li>
              <li><strong>相談所おすすめ</strong>：提携している結婚相談所が推薦したお店</li>
              <li><strong>掲載店</strong>：情報として掲載しているお店</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. 口コミの信頼性について</h2>
            <ul className="legal-ul">
              <li>相談所・カウンセラーへの口コミは、Kinda 経由で面談を完了した方のみが投稿できます。</li>
              <li>運営が代理で入力した口コミには、必ず「代理掲載」バッジを表示します。</li>
              <li>相談所に不利な口コミを、運営の判断で削除・非表示にすることはありません（利用規約に反するものを除きます）。</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. 中立性についての考え方</h2>
            <p className="legal-text">
              Kinda は特定の相談所のグループ会社ではなく、独立した立場で運営しています。
              「どの相談所にも肩入れしない中立さ」と、「編集部が実際に取材して感じたことを正直に書く姿勢」の両方を、
              並び立てて持っていたいと考えています。記事の作り方の方針は{" "}
              <Link href="/about/editorial-policy" className="legal-link">
                編集ポリシー
              </Link>{" "}
              に明文化しています。
            </p>
          </section>

          <p className="legal-end">
            ここに書いた方針に反する運用を見つけた場合は、
            <Link href="/contact" className="legal-link">
              お問い合わせ
            </Link>
            からご連絡ください。
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}
