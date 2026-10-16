import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  alternates: { canonical: "/tokushou" },
  title: "特定商取引法に基づく表記 | Kinda ふたりへ",
  description:
    "Kinda ふたりへ（kinda.jp）の特定商取引法に基づく表記。販売事業者、所在地、料金、返品・キャンセル等の情報。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年10月13日";

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
                  <td>株式会社AGOGLIFE</td>
                </tr>
                <tr>
                  <th>運営統括責任者</th>
                  <td>船田剛</td>
                </tr>
                <tr>
                  <th>所在地</th>
                  <td>
                    〒104-0061 東京都中央区銀座1-12-4 N&amp;E BLD.6F
                  </td>
                </tr>
                <tr>
                  <th>電話番号</th>
                  <td>
                    <span className="legal-note-inline">
                      請求があれば、遅滞なく開示します。お問い合わせは原則としてメールでお願いしています。
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
            <h2 className="legal-h2">結婚相談所さま向け（送客サービス）</h2>
            <p className="legal-text">
              当社が結婚相談所さま・カウンセラー（以下「掲載事業者」）に提供する送客サービスに関する表記です。
              販売事業者・所在地・連絡先は上記と同じです。ユーザーのみなさまにご負担いただくものではありません。
            </p>
            <table className="legal-table">
              <tbody>
                <tr>
                  <th>サービス名</th>
                  <td>Kinda 送客サービス（カウンセラー管理画面）</td>
                </tr>
                <tr>
                  <th>役務の内容</th>
                  <td>掲載事業者のプロフィール・口コミの掲載、およびユーザーからの面談予約の送客（媒介）</td>
                </tr>
                <tr>
                  <th>販売価格</th>
                  <td>
                    送客 1 件あたり 5,500 円（税込）の成果報酬（税別 5,000 円）。
                    掲載費・初期費用・月額固定費は無料です。
                  </td>
                </tr>
                <tr>
                  <th>商品代金以外の必要料金</th>
                  <td>インターネット通信費、通信機器の購入・維持費用等は掲載事業者のご負担となります。</td>
                </tr>
                <tr>
                  <th>お支払い方法</th>
                  <td>クレジットカード決済のみ（決済代行：Stripe）。銀行振込その他の方法は取り扱っておりません。</td>
                </tr>
                <tr>
                  <th>お支払い時期</th>
                  <td>予約が確定した時点で、ご登録のクレジットカードに即時課金します（後払い・猶予期間はありません）。</td>
                </tr>
                <tr>
                  <th>役務の提供時期</th>
                  <td>
                    掲載は、利用規約への同意およびアカウント発行後すみやかに開始します。
                    送客（ユーザーの連絡先の開示）は、予約確定に係る決済の完了後ただちに行います。
                  </td>
                </tr>
                <tr>
                  <th>キャンセル・返金</th>
                  <td>
                    送客料は予約確定をもって確定し、以後のキャンセル、当日のキャンセル、ユーザーの面談不参加、日程変更のいずれの場合も、原則として返金いたしません。
                    <span className="legal-note-inline">
                      天災その他やむを得ない事情がある場合は、
                      <a href="mailto:hello@kinda.jp" className="legal-link">運営事務局</a>
                      にご相談ください。運営が認めた場合は、その送客料を次回以降のご予約1件分の送客料に充てます（充てる期限はありません）。充てる前にご解約された場合は、残っている分を返金します。
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>関連する規定</th>
                  <td>
                    <a href="https://futarive-counselor.vercel.app/terms" className="legal-link">Kinda カウンセラー管理画面 利用規約</a>
                    および送客契約書によります。
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
