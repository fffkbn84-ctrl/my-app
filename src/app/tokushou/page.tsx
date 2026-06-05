import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | Kinda ふたりへ",
  description:
    "Kinda ふたりへ（kinda.jp）の特定商取引法に基づく表記。販売事業者、所在地、料金、返品・キャンセル等の情報。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年6月4日";

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
            <p className="legal-meta">最終更新日：{LAST_UPDATED}</p>
            <p className="legal-lead">
              特定商取引に関する法律 第11条（通信販売についての広告）に基づく表記です。
              本サービスは、現時点でユーザーから料金を徴収する有料機能を提供していませんが、
              特定商取引法に基づく通信販売事業者として、所定の情報を以下のとおり表示します。
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
                  <td>
                    [所在地]
                    <br />
                    <span className="legal-note-inline">
                      ※請求があれば、遅滞なく開示します。開示をご希望の場合は
                      <a href="/contact" className="legal-link">お問い合わせフォーム</a>
                      よりご請求ください。
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>電話番号</th>
                  <td>
                    [電話番号]
                    <br />
                    <span className="legal-note-inline">
                      ※請求があれば、遅滞なく開示します。お問い合わせは原則としてメールでお願いしています。
                      電話での対応が必要な場合は、
                      <a href="/contact" className="legal-link">お問い合わせフォーム</a>
                      よりご請求いただければ、折り返しご案内します。
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>メールアドレス</th>
                  <td>
                    <a href="mailto:hello@kinda.jp" className="legal-link">
                      hello@kinda.jp
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>お問い合わせ窓口</th>
                  <td>
                    <a href="/contact" className="legal-link">
                      お問い合わせページ
                    </a>
                    （24 時間受付、原則 3 営業日以内に返信）
                  </td>
                </tr>
                <tr>
                  <th>サービス名</th>
                  <td>Kinda ふたりへ（kinda.jp）</td>
                </tr>
                <tr>
                  <th>販売価格</th>
                  <td>
                    本サービスの基本機能（カウンセラー検索・閲覧・予約、口コミ閲覧、診断ツール、コラム閲覧等）は
                    <strong>無料</strong>でご利用いただけます。
                    <br />
                    <span className="legal-note-inline">
                      結婚相談所での面談料・入会金・月会費・お見合い料・成婚料等は、各相談所が定めるものであり、
                      当社が請求するものではありません。
                      <br />
                      ※当社が結婚相談所さまから受け取る送客手数料（成果報酬）は、相談所さまとの事業者間契約に基づくものであり、
                      ユーザーのみなさまにご負担いただくものではありません。
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>商品代金以外の必要料金</th>
                  <td>本サービスの利用に必要なインターネット通信費、通信機器の購入・維持費用、ソフトウェアの利用料金等は、利用者のご負担となります。</td>
                </tr>
                <tr>
                  <th>お支払い方法</th>
                  <td>本サービスは無料のため、現時点でお支払いは発生しません。将来的に有料機能を提供する場合は、その都度お支払い方法を明示します。</td>
                </tr>
                <tr>
                  <th>お支払い時期</th>
                  <td>該当なし（無料のため）。有料機能を提供する場合は、その都度お支払い時期を明示します。</td>
                </tr>
                <tr>
                  <th>サービス提供時期</th>
                  <td>アカウント登録完了後、即時ご利用いただけます。面談予約成立後の面談実施日時は、相談所・カウンセラーとの調整により確定します。</td>
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
                    なお、ユーザーの責めに帰すべき事由（虚偽情報の登録、不正利用、規約違反等）によりアカウントが停止・削除された場合、有料機能の利用料金についても返金されません。
                  </td>
                </tr>
                <tr>
                  <th>動作環境</th>
                  <td>
                    最新版の主要ブラウザ（Safari、Chrome、Edge、Firefox 等）を推奨します。
                    iOS / Android スマートフォン、デスクトップ PC からご利用いただけます。
                    一部古いバージョンのブラウザでは、正常に動作しない場合があります。
                  </td>
                </tr>
                <tr>
                  <th>特別条件</th>
                  <td>
                    結婚相談所に関する口コミは、Kinda 経由で面談を完了したユーザーのみが投稿できます。
                    投稿内容は当社の確認後に掲載される場合があり、利用規約・ガイドラインに反する投稿は掲載されないことがあります。
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-section">
            <p className="legal-text">
              本表記に関するお問い合わせは、
              <a href="/contact" className="legal-link">お問い合わせページ</a>
              からご連絡ください。
              関連する規定は、別途定める
              <a href="/terms" className="legal-link">利用規約</a>
              および
              <a href="/privacy" className="legal-link">プライバシーポリシー</a>
              も併せてご確認ください。
            </p>
          </section>

          <p className="legal-end">以上</p>
        </article>
      </main>

      <Footer />
    </>
  );
}
