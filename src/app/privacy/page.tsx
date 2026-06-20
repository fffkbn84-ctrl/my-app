import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Kinda ふたりへ",
  description: "Kinda ふたりへ における個人情報の取り扱いについて。取得情報・利用目的・第三者提供・お問い合わせ窓口。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年5月23日";

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[{ label: "ホーム", href: "/" }, { label: "プライバシーポリシー" }]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">privacy policy</p>
            <h1 className="legal-title">プライバシーポリシー</h1>
            <p className="legal-meta">最終更新日：{LAST_UPDATED}</p>
            <p className="legal-lead">
              株式会社AGOGLIFE（以下「当社」といいます）は、Kinda ふたりへ（以下「本サービス」といいます）における
              利用者の個人情報の取り扱いについて、個人情報の保護に関する法律（以下「個人情報保護法」といいます）その他関係法令を遵守し、
              以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
            </p>
          </header>

          <section className="legal-section">
            <h2 className="legal-h2">1. 取得する個人情報</h2>
            <p className="legal-text">当社は、本サービスの提供にあたり、以下の個人情報を取得します。</p>
            <ul className="legal-ul">
              <li>アカウント登録時：メールアドレス、パスワード（ハッシュ化して保存）</li>
              <li>面談予約時：氏名、ふりがな、メールアドレス、電話番号、希望日時、簡単なアンケート回答</li>
              <li>口コミ投稿時：投稿内容、評価、年代・属性等の任意項目</li>
              <li>診断ツール（Kinda type / Kinda note）利用時：選択した回答内容</li>
              <li>お問い合わせ時：お名前、メールアドレス、お問い合わせ内容</li>
              <li>本サービスの閲覧時：IP アドレス、Cookie、ブラウザ情報、OS 情報、アクセス日時、閲覧ページ等のログ情報</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">2. 利用目的</h2>
            <p className="legal-text">取得した個人情報は、以下の目的の範囲内で利用します。</p>
            <ul className="legal-ul">
              <li>本サービスの提供・運営・維持</li>
              <li>面談予約の成立およびそれに伴う相談所・カウンセラーへの情報連携</li>
              <li>本人確認、認証、不正利用防止</li>
              <li>お問い合わせへの回答、ユーザーサポートの提供</li>
              <li>本サービスに関する重要なお知らせ、利用規約等の変更通知（取引関係通知）</li>
              <li>サービス改善、新機能開発、ユーザー動向の分析（個人を識別しない統計データを含む）</li>
              <li>マーケティング・メールマガジン送信、キャンペーン情報の案内（本人があらかじめ同意した場合に限ります）</li>
              <li>法令に基づく対応、関係官公庁からの要請への対応</li>
              <li>その他、上記利用目的に付随する目的</li>
            </ul>
            <p className="legal-text">
              当社は、上記の利用目的の範囲を超えて個人情報を利用する必要が生じた場合、あらかじめ本人の同意を得るものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. 第三者提供</h2>
            <p className="legal-text">
              当社は、以下の場合を除き、あらかじめ本人の同意を得ずに、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="legal-ul">
              <li>面談予約の成立に伴い、予約された相談所・カウンセラーに対し、面談に必要な範囲で予約情報（氏名、連絡先、希望日時、アンケート回答等）を提供する場合（本サービスの主要な機能として、ユーザーが面談予約を行う行為自体が当該提供に対する同意を構成します）</li>
              <li>法令に基づく場合（裁判所、警察、検察、税務当局等からの正当な要請を含む）</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
              <li>合併、会社分割、事業譲渡その他の事由により事業が承継される場合</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. 業務委託先</h2>
            <p className="legal-text">
              当社は、本サービスの提供にあたり、以下の業務を外部の事業者に委託し、当該委託先に個人情報の取り扱いを委託する場合があります。
              当社は、委託先に対し、個人情報を適切に取り扱うよう、必要かつ適切な監督を行います。
            </p>
            <ul className="legal-ul">
              <li>Supabase（データベース・認証基盤）— Supabase Inc.（米国）</li>
              <li>Vercel（Web ホスティング・ログ解析）— Vercel Inc.（米国）</li>
              <li>Google Analytics / Google Fonts（アクセス解析・フォント配信）— Google LLC（米国）</li>
              <li>メール配信サービス（運用開始後に追記予定）</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. 外国にある第三者への個人データの提供</h2>
            <p className="legal-text">
              前項「4. 業務委託先」に記載のとおり、当社は、本サービスの提供にあたり、外国（主に米国）に所在する事業者に個人データの取り扱いを委託しています。
              個人情報保護法第28条に定める同意取得の対象となる第三者提供には該当しない取り扱い（同法第27条第5項各号に定める業務委託等）であっても、外国にある第三者に個人データを取り扱わせる場合があることを以下のとおり明示します。
            </p>
            <ul className="legal-ul">
              <li>提供先の所在する外国：アメリカ合衆国（その他、各サービス提供事業者のデータセンター所在国を含みます）</li>
              <li>当該外国の個人情報の保護に関する制度：個人情報保護委員会のウェブサイト「外国における個人情報の保護に関する制度等の調査」をご参照ください。アメリカ合衆国には、日本の個人情報保護法に相当する包括的な連邦法は存在せず、分野別の連邦法および州法によって個人情報保護が図られています。</li>
              <li>提供先が講ずる個人情報保護のための措置：各提供先は、自社のプライバシーポリシーおよびデータ処理契約（DPA）に基づき、適切なセキュリティ措置（暗号化、アクセス制御、監査ログ等）を講じています。</li>
            </ul>
            <p className="legal-text">
              外国にある第三者への提供に関する詳細な情報を必要とされる場合は、「10. お問い合わせ窓口」までご請求ください。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. Cookie および類似技術の使用</h2>
            <p className="legal-text">
              本サービスは、利便性向上およびアクセス解析のために Cookie および類似技術を使用しています。
              主な利用目的は以下のとおりです。
            </p>
            <ul className="legal-ul">
              <li>ログイン状態の維持</li>
              <li>表示設定（テーマ・言語等）の保持</li>
              <li>お気に入り保存（未ログイン時の localStorage 保存を含む）</li>
              <li>アクセス解析・サービス改善（Google Analytics、Vercel Analytics、Vercel Speed Insights 等）</li>
            </ul>
            <p className="legal-text">
              ブラウザの設定により Cookie の受け入れを拒否することができますが、その場合、本サービスの一部機能をご利用いただけなくなる可能性があります。
              Google Analytics による情報収集を無効にしたい場合は、Google が提供する
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                オプトアウトアドオン
              </a>
              をご利用ください。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. 安全管理措置</h2>
            <p className="legal-text">
              当社は、取得した個人情報の漏えい、滅失、毀損の防止その他の安全管理のため、以下を含む適切な措置を講じます。
            </p>
            <ul className="legal-ul">
              <li>パスワード等の認証情報のハッシュ化保存</li>
              <li>HTTPS 通信による暗号化</li>
              <li>データベースへのアクセス権限の最小化（Row Level Security 等）</li>
              <li>個人情報を取り扱う従業者・委託先に対する適切な監督</li>
              <li>セキュリティに関する教育・啓発</li>
              <li>不正アクセス・改ざん・漏えい等のインシデント発生時の対応手順の整備</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. 保有個人データの開示等の請求</h2>
            <p className="legal-text">
              ユーザーは、個人情報保護法に基づき、当社の保有する自己の個人情報について、利用目的の通知、開示、訂正、追加、削除、利用停止、消去および第三者への提供の停止（以下「開示等の請求」といいます）を請求することができます。
              請求方法は以下のとおりです。
            </p>
            <ol className="legal-ol">
              <li>マイページから対応可能な範囲（登録情報の表示・編集・削除、口コミの削除、退会等）は、セルフサービスによりご操作ください。</li>
              <li>セルフサービスでは対応できない請求は、
                <a href="/contact" className="legal-link">お問い合わせページ</a>
                からご連絡ください。当社は、本人確認（登録メールアドレスからの送信、回答用メールへの返信確認、その他当社が定める方法）を行ったうえで、合理的な範囲で速やかに対応します。
              </li>
              <li>開示等の請求の手数料は、原則として無料とします。ただし、利用目的の通知または開示の請求については、書面の郵送等により対応する場合、別途実費（郵送料等）をご負担いただく場合があります。</li>
              <li>請求内容が法令の要件を満たさない場合、または当該請求に応じることにより本人もしくは第三者の生命、身体、財産その他の権利利益を害するおそれがある場合等、個人情報保護法に定める事由に該当する場合は、開示等の請求の全部または一部に応じられないことがあります。この場合、当社はその理由をユーザーに通知します。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. 未成年者の個人情報</h2>
            <p className="legal-text">
              本サービスは、結婚相談所への面談予約等を扱う性質上、原則として 18 歳以上の方のご利用を想定しています。
              未成年者（18 歳未満）が本サービスを利用する場合は、必ず親権者その他の法定代理人の同意を得てください。
              親権者等の同意なくなされたサービス利用については、当社は法令に従い適切に対応します。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. 個人情報の保有期間</h2>
            <p className="legal-text">
              当社は、利用目的の達成に必要な範囲で個人情報を保有し、不要となった個人情報は、合理的な期間内に削除または匿名化します。
              ただし、法令上保存が義務付けられている情報、紛争対応のために必要な情報、安全管理上必要な情報（アクセスログ等）については、それぞれ必要な期間保有することがあります。
              退会後の個人情報の取り扱いは、本ポリシーに従って削除または匿名化の措置を講じますが、退会前に投稿された口コミ等のコンテンツについては、利用規約第7条に基づき、匿名化のうえ引き続き掲載される場合があります。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">11. プライバシーポリシーの変更</h2>
            <p className="legal-text">
              当社は、法令の変更、サービス内容の変更その他の事情に応じて、本ポリシーを変更できるものとします。
              重要な変更がある場合は、本サービス上での通知またはメールにより、変更内容および変更の効力発生日を事前にお知らせします。
              変更後の本ポリシーは、本ページに掲示された時点（または当社が指定する効力発生日）から効力を生じます。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">12. お問い合わせ窓口</h2>
            <div className="legal-info-box">
              <p>事業者名：株式会社AGOGLIFE</p>
              <p>所在地：〒104-0061 東京都中央区銀座1-12-4 N&amp;E BLD.6F</p>
              <p>個人情報保護管理者：船田剛</p>
              <p>
                お問い合わせ：
                <a href="/contact" className="legal-link">お問い合わせページ</a>
                からご連絡ください
              </p>
            </div>
            <p className="legal-text">
              当社の個人情報の取り扱いについて、苦情・ご意見等がある場合は、上記窓口までお問い合わせください。
              また、認定個人情報保護団体への申し出も可能です。
            </p>
          </section>

          <p className="legal-end">以上</p>
        </article>
      </main>

      <Footer />
    </>
  );
}
