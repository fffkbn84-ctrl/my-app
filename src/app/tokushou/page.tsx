import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | Kinda ふたりへ",
  description:
    "Kinda ふたりへ（kinda-futari.app）の特定商取引法に基づく表記。販売事業者、所在地、料金、返品・キャンセル等の情報。",
  robots: { index: true, follow: true },
};

export default function TokushouPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "特定商取引法に基づく表記" },
          ]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">legal notice</p>
            <h1 className="legal-title">特定商取引法に基づく表記</h1>
            <p className="legal-lead">
              特定商取引に関する法律 第11条（通信販売についての広告）に基づく表記です。
            </p>
          </header>

          <section className="legal-section">
            <table className="legal-table">
              <tbody>
                <tr>
                  <th>販売事業者</th>
                  <td>[会社名]</td>
                </tr>
                <tr>
                  <th>運営統括責任者</th>
                  <td>[代表者氏名]</td>
                </tr>
                <tr>
                  <th>所在地</th>
                  <td>[所在地]</td>
                </tr>
                <tr>
                  <th>電話番号</th>
                  <td>
                    [電話番号]
                    <br />
                    <span className="legal-note-inline">
                      ※お問い合わせは原則としてメールでお願いしています。
                      電話でのお問い合わせをご希望の場合、
                      <a href="/contact" className="legal-link">お問い合わせフォーム</a>
                      よりご請求いただければ、折り返しご案内します。
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>メールアドレス</th>
                  <td>
                    <a href="mailto:hello@kinda-futari.app" className="legal-link">
                      hello@kinda-futari.app
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>サービス名</th>
                  <td>Kinda ふたりへ（kinda-futari.app）</td>
                </tr>
                <tr>
                  <th>販売価格</th>
                  <td>
                    本サービスの基本機能（カウンセラー検索・閲覧・予約、口コミ閲覧、診断ツール、コラム閲覧等）は
                    <strong>無料</strong>でご利用いただけます。
                    <br />
                    <span className="legal-note-inline">
                      結婚相談所での面談料・入会金・月会費・成婚料等は、各相談所が定めるものであり、
                      当社が請求するものではありません。
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>商品代金以外の必要料金</th>
                  <td>本サービス利用に必要なインターネット通信費、ソフトウェアの利用料金等は、利用者負担となります。</td>
                </tr>
                <tr>
                  <th>お支払い方法</th>
                  <td>本サービスは無料のため、現時点でお支払いは発生しません。有料機能を提供する場合は別途定めます。</td>
                </tr>
                <tr>
                  <th>サービス提供時期</th>
                  <td>アカウント登録後、即時ご利用いただけます。</td>
                </tr>
                <tr>
                  <th>面談予約のキャンセル</th>
                  <td>
                    各相談所・カウンセラーごとに定められたキャンセルポリシーに従います。
                    予約画面および予約完了メールに記載されたキャンセル期限・方法をご確認ください。
                  </td>
                </tr>
                <tr>
                  <th>返品・返金</th>
                  <td>
                    本サービスは無料のため、原則として返金はありません。
                    将来的に有料機能を提供する場合は、その都度返金条件を明示します。
                  </td>
                </tr>
                <tr>
                  <th>動作環境</th>
                  <td>
                    最新版の主要ブラウザ（Safari、Chrome、Edge、Firefox 等）を推奨します。
                    iOS / Android スマートフォン、デスクトップ PC からご利用いただけます。
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <p className="legal-end">以上</p>
        </article>
      </main>

      <Footer />
    </>
  );
}
