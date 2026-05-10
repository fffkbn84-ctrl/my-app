import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "利用規約 | Kinda ふたりへ",
  description: "Kinda ふたりへ の利用規約。サービスの利用条件・禁止事項・免責事項などを定めています。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年5月10日";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[{ label: "ホーム", href: "/" }, { label: "利用規約" }]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">terms of service</p>
            <h1 className="legal-title">利用規約</h1>
            <p className="legal-meta">最終更新日：{LAST_UPDATED}</p>
            <p className="legal-lead">
              この利用規約（以下「本規約」といいます）は、[会社名]（以下「当社」といいます）が提供する
              「Kinda ふたりへ」（以下「本サービス」といいます）の利用に関する条件を定めるものです。
              本サービスをご利用いただくすべての方（以下「ユーザー」といいます）は、本規約に同意の上、ご利用ください。
            </p>
          </header>

          <section className="legal-section">
            <h2 className="legal-h2">第1条（適用）</h2>
            <ol className="legal-ol">
              <li>本規約は、本サービスの提供条件およびユーザーと当社との間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスに関わる一切の関係に適用されます。</li>
              <li>本サービスに関して当社が掲載する個別規定、ガイドライン、注意書き等（以下「個別規定」といいます）は、本規約の一部を構成するものとします。</li>
              <li>本規約と個別規定の内容が異なる場合、個別規定の定めが優先するものとします。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第2条（定義）</h2>
            <p className="legal-text">本規約において使用する用語の定義は、以下のとおりとします。</p>
            <ul className="legal-ul">
              <li>「本サービス」：当社が運営する Kinda ふたりへ（kinda-futari.app）および関連する Web サービスの総称</li>
              <li>「ユーザー」：本規約に同意の上、本サービスを利用する個人</li>
              <li>「カウンセラー」：本サービスに登録された結婚相談所の婚活カウンセラー</li>
              <li>「相談所」：カウンセラーが所属する結婚相談所</li>
              <li>「掲載店」：本サービスに掲載されている飲食店・サロン等の事業者</li>
              <li>「コンテンツ」：本サービス上でユーザー・カウンセラー・相談所・掲載店が投稿または公開する文章・画像・動画・口コミ等の一切の情報</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第3条（規約の同意・変更）</h2>
            <ol className="legal-ol">
              <li>ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。</li>
              <li>当社は、ユーザーへの事前通知なく本規約を変更できるものとします。変更後の本規約は、当社所定の場所に掲示された時点で効力を生じるものとします。</li>
              <li>変更後にユーザーが本サービスを継続して利用した場合、変更後の本規約に同意したものとみなされます。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第4条（アカウント登録）</h2>
            <ol className="legal-ol">
              <li>ユーザーは、本サービスの一部機能（マイページ・予約・口コミ投稿等）を利用するために、当社所定の方法によりアカウントを登録するものとします。</li>
              <li>ユーザーは、登録に際して真実、正確かつ最新の情報を提供するものとします。</li>
              <li>ユーザーは、自己のアカウント情報の管理責任を負うものとし、第三者に利用させてはなりません。</li>
              <li>当社は、ユーザーが本規約に違反した場合、事前通知なくアカウントを停止または削除できるものとします。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第5条（禁止事項）</h2>
            <p className="legal-text">ユーザーは、本サービスの利用に際して、以下の行為をしてはなりません。</p>
            <ul className="legal-ul">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの内容、または本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為</li>
              <li>当社、他のユーザー、カウンセラー、相談所、掲載店、その他第三者の権利・名誉・プライバシー等を侵害する行為</li>
              <li>事実に反する口コミの投稿、または面談・利用していない事業者についての口コミ投稿</li>
              <li>営業・宣伝・広告・勧誘その他営利を目的とする利用（当社が認めたものを除く）</li>
              <li>他のユーザーまたは第三者になりすます行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセス、過度な負荷をかける行為、リバースエンジニアリング等</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第6条（口コミ・コンテンツの取り扱い）</h2>
            <ol className="legal-ol">
              <li>ユーザーが本サービスに投稿した口コミその他のコンテンツの著作権は、当該ユーザーに帰属します。ただし、ユーザーは、当社に対し、当該コンテンツを本サービスの提供・運営・宣伝に必要な範囲で無償で利用（複製・公衆送信・翻案等を含む）することを許諾するものとします。</li>
              <li>当社は、ユーザーが投稿したコンテンツが本規約に違反すると判断した場合、事前通知なく削除・非表示にできるものとします。</li>
              <li>結婚相談所に関する口コミは、Kinda 経由で面談を完了したユーザーのみが投稿できるものとします。</li>
              <li>当社が運営として代理掲載する口コミについては、その旨を明示します（景品表示法に基づく表示）。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第7条（カウンセラー予約・キャンセル）</h2>
            <ol className="legal-ol">
              <li>ユーザーは、本サービスを通じてカウンセラーとの面談を予約できます。</li>
              <li>予約のキャンセルポリシーは、各相談所・カウンセラーごとに定められ、当該予約画面に表示されます。</li>
              <li>面談の内容、結果、面談前後の連絡については、当社は責任を負わず、ユーザーと相談所・カウンセラーの間で解決するものとします。</li>
              <li>ダブルブッキング等のシステム上の不具合が発生した場合、当社は速やかに対応するよう努めますが、それにより生じた損害について責任を負わないものとします。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第8条（料金）</h2>
            <ol className="legal-ol">
              <li>本サービスの基本機能（カウンセラー閲覧・口コミ閲覧・面談予約・診断ツール等）は、ユーザーに対して無料で提供されます。</li>
              <li>当社は、有料機能を将来的に提供する場合があります。その場合の料金・支払方法は、別途定めるものとします。</li>
              <li>結婚相談所での面談料、入会金、月会費、お見合い料、成婚料等は、各相談所が定めるものであり、当社の関与する金銭ではありません。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第9条（知的財産権）</h2>
            <p className="legal-text">
              本サービスに関する知的財産権は、当社または当社にライセンスを許諾している正当な権利者に帰属します。
              本規約に基づくユーザーへの本サービスの提供は、本サービスに関する当社または正当な権利者の知的財産権の使用許諾を意味するものではありません。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第10条（サービスの変更・停止）</h2>
            <p className="legal-text">
              当社は、ユーザーへの事前通知なく、本サービスの内容を変更し、または提供を停止・終了できるものとします。
              これによりユーザーまたは第三者に生じた損害について、当社は一切責任を負わないものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第11条（免責事項）</h2>
            <ol className="legal-ol">
              <li>当社は、本サービスに関して、その完全性・正確性・有用性・安全性、特定目的への適合性等について一切保証しません。</li>
              <li>当社は、本サービス上のコンテンツ（口コミ・カウンセラー情報・お店情報・コラム等）の正確性について保証せず、ユーザーは自己の責任において判断・利用するものとします。</li>
              <li>当社は、本サービスの利用により生じたユーザーと第三者（カウンセラー・相談所・掲載店・他のユーザー等）との間の紛争について一切関与せず、責任を負わないものとします。</li>
              <li>当社は、ユーザーが本サービスを利用することにより生じた損害について、当社の故意または重過失による場合を除き、一切責任を負わないものとします。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第12条（個人情報の取り扱い）</h2>
            <p className="legal-text">
              当社による個人情報の取り扱いについては、別途定める「
              <a href="/privacy" className="legal-link">プライバシーポリシー</a>
              」によるものとし、ユーザーは当該プライバシーポリシーに従って当社が個人情報を取り扱うことに同意するものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">第13条（準拠法・裁判管轄）</h2>
            <ol className="legal-ol">
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>本サービスに関して紛争が生じた場合、当社の本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">お問い合わせ</h2>
            <p className="legal-text">
              本規約に関するお問い合わせは、
              <a href="/contact" className="legal-link">お問い合わせページ</a>
              からご連絡ください。
            </p>
          </section>

          <p className="legal-end">以上</p>
        </article>
      </main>

      <Footer />
    </>
  );
}
