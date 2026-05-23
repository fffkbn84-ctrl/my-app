import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | Kinda カウンセラー管理画面',
  description: 'Kinda カウンセラー管理画面における個人情報の取り扱い。利用者情報・エンドユーザー情報の取り扱い、業務上の通知の送信根拠。',
  robots: { index: false, follow: false },
}

const LAST_UPDATED = '2026年5月23日'

export default function CounselorPrivacyPage() {
  return (
    <main className="kc-legal-page">
      <article className="kc-legal-article">
        <header className="kc-legal-header">
          <p className="kc-legal-eyebrow">privacy policy for counselors</p>
          <h1 className="kc-legal-title">Kinda カウンセラー管理画面 プライバシーポリシー</h1>
          <p className="kc-legal-meta">最終更新日：{LAST_UPDATED}</p>
          <p className="kc-legal-lead">
            [会社名]（以下「当社」といいます）は、Kinda カウンセラー管理画面（以下「本サービス」といいます）における
            利用者および本サービスを通じて取得するエンドユーザーの個人情報の取り扱いについて、
            個人情報の保護に関する法律（以下「個人情報保護法」といいます）その他関係法令を遵守し、
            以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
            本ポリシーで使用する用語の定義は、
            <Link href="/terms" className="kc-legal-link">本サービスの利用規約</Link>
            に従います。
          </p>
        </header>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">1. 取得する個人情報</h2>
          <h3 className="kc-legal-h3">(1) 利用者（カウンセラー・相談所オーナー）の情報</h3>
          <ul className="kc-legal-ul">
            <li>アカウント登録時：メールアドレス、パスワード（ハッシュ化して保存）</li>
            <li>プロフィール登録・編集時：氏名、所属相談所名、自己紹介文、対応エリア、料金プラン、保有資格、活動年数、プロフィール画像、SNS リンク等</li>
            <li>請求・支払関連：請求書送付先情報、支払口座情報、適格請求書発行事業者登録番号（インボイス対応時）</li>
            <li>お問い合わせ時：お問い合わせ内容</li>
            <li>本サービスの閲覧時：IP アドレス、Cookie、ブラウザ情報、OS 情報、アクセス日時、操作ログ等</li>
          </ul>
          <h3 className="kc-legal-h3">(2) 利用者を通じて取得するエンドユーザーの情報</h3>
          <p className="kc-legal-text">
            利用者がエンドユーザーから面談予約を受け付ける際、本サービス上で以下のエンドユーザー情報を閲覧・取得する場合があります。当該情報は、エンドユーザーが
            <Link href="https://kinda-futari.app/privacy" className="kc-legal-link" target="_blank" rel="noopener noreferrer">公開プラットフォームのプライバシーポリシー</Link>
            に同意のうえ提供したものです。
          </p>
          <ul className="kc-legal-ul">
            <li>氏名、ふりがな、メールアドレス、電話番号</li>
            <li>面談希望日時、簡単なアンケート回答</li>
            <li>口コミ投稿時の評価、年代・属性等の任意項目</li>
          </ul>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">2. 利用目的</h2>
          <p className="kc-legal-text">取得した個人情報は、以下の目的の範囲内で利用します。</p>
          <ul className="kc-legal-ul">
            <li>本サービスの提供・運営・維持</li>
            <li>利用者のプロフィール情報の公開プラットフォーム（kinda-futari.app）への掲載</li>
            <li>送客予約の成立、利用者への予約情報の連携</li>
            <li>本人確認、認証、不正利用防止</li>
            <li>送客手数料の請求・回収、領収書発行</li>
            <li>業務上の通知の送信（利用規約第8条に定めるもの。プロフィール更新リマインダー、予約成立通知、口コミ投稿通知、料金請求通知、システム障害通知、規約変更通知等を含みます）</li>
            <li>サービス改善、新機能開発、ユーザー動向の分析（個人を識別しない統計データを含む）</li>
            <li>営業案内通知の送信（利用者があらかじめ同意した場合に限ります）</li>
            <li>お問い合わせへの回答、サポートの提供</li>
            <li>法令に基づく対応、関係官公庁からの要請への対応</li>
          </ul>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">3. 業務上の通知の送信根拠</h2>
          <p className="kc-legal-text">
            当社は、本サービスの提供および利用契約の履行に必要な通知（以下「業務上の通知」といいます）を、利用者の事前同意を改めて取得することなく、登録メールアドレス宛に送信します。
            業務上の通知には、利用規約第8条第2項に列挙する通知（特に
            <strong>プロフィール情報の更新リマインダー（最終更新から 90 日以上経過した利用者宛）</strong>を含みます）が該当します。
          </p>
          <p className="kc-legal-text">
            これらの通知は、特定電子メールの送信の適正化等に関する法律（以下「特定電子メール法」といいます）第2条第2号に定める「営業上の広告又は宣伝」を目的とするものではなく、
            本サービスの役務提供契約に付随する取引上の通知です。したがって、特定電子メール法による事前同意取得義務の対象外として送信します。
          </p>
          <p className="kc-legal-text">
            一方、当社からの営業案内（新機能の宣伝、キャンペーン、業界動向ニュースレター等）は、利用者があらかじめ受信に同意した場合に限り送信し、各メール本文末尾の配信停止リンクからいつでも受信を停止できます。
          </p>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">4. 公開される情報と非公開情報</h2>
          <p className="kc-legal-text">
            本サービスにおける利用者の登録情報は、以下のとおり公開・非公開を区別して取り扱います。
          </p>
          <ul className="kc-legal-ul">
            <li><strong>公開される情報（公開プラットフォーム kinda-futari.app に掲載）</strong>：プロフィール画面で「公開」と表示される項目（氏名または活動名、所属相談所名、自己紹介文、対応エリア、料金プラン、プロフィール画像、保有資格、活動年数等）</li>
            <li><strong>非公開情報（当社内および利用者のみ閲覧）</strong>：ログイン用メールアドレス、パスワードのハッシュ、請求情報、支払口座情報、操作ログ、内部メモ、エンドユーザーの予約情報（当該予約の相手方カウンセラー以外には開示しません）</li>
          </ul>
          <p className="kc-legal-text">
            利用者は、本サービスの編集画面において、各項目の公開・非公開設定を確認・変更することができます。
          </p>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">5. 第三者提供</h2>
          <p className="kc-legal-text">
            当社は、以下の場合を除き、あらかじめ本人の同意を得ずに、個人情報を第三者に提供しません。
          </p>
          <ul className="kc-legal-ul">
            <li>送客予約の成立に伴い、予約された利用者に対し、面談に必要な範囲でエンドユーザーの予約情報（氏名、連絡先、希望日時、アンケート回答等）を提供する場合</li>
            <li>利用者の公開情報を公開プラットフォーム kinda-futari.app に掲載することによる事実上の公開（利用者の利用規約および本ポリシーへの同意により、当該掲載に同意したものとみなします）</li>
            <li>法令に基づく場合（裁判所、警察、検察、税務当局等からの正当な要請を含む）</li>
            <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
            <li>合併、会社分割、事業譲渡その他の事由により事業が承継される場合</li>
          </ul>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">6. 業務委託先</h2>
          <p className="kc-legal-text">
            当社は、本サービスの提供にあたり、以下の業務を外部の事業者に委託し、当該委託先に個人情報の取り扱いを委託する場合があります。
            当社は、委託先に対し、個人情報を適切に取り扱うよう、必要かつ適切な監督を行います。
          </p>
          <ul className="kc-legal-ul">
            <li>Supabase（データベース・認証基盤）— Supabase Inc.（米国）</li>
            <li>Vercel（Web ホスティング・ログ解析）— Vercel Inc.（米国）</li>
            <li>メール配信サービス（業務上の通知の送信。運用開始後に追記予定）</li>
            <li>請求・支払関連の処理業務（運用開始後に追記予定）</li>
          </ul>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">7. 外国にある第三者への個人データの提供</h2>
          <p className="kc-legal-text">
            前項「6. 業務委託先」に記載のとおり、当社は、本サービスの提供にあたり、外国（主に米国）に所在する事業者に個人データの取り扱いを委託しています。
            個人情報保護法第28条に定める同意取得の対象となる第三者提供には該当しない取り扱い（同法第27条第5項各号に定める業務委託等）であっても、外国にある第三者に個人データを取り扱わせる場合があることを以下のとおり明示します。
          </p>
          <ul className="kc-legal-ul">
            <li>提供先の所在する外国：アメリカ合衆国（その他、各サービス提供事業者のデータセンター所在国を含みます）</li>
            <li>当該外国の個人情報の保護に関する制度：個人情報保護委員会のウェブサイト「外国における個人情報の保護に関する制度等の調査」をご参照ください。アメリカ合衆国には、日本の個人情報保護法に相当する包括的な連邦法は存在せず、分野別の連邦法および州法によって個人情報保護が図られています。</li>
            <li>提供先が講ずる個人情報保護のための措置：各提供先は、自社のプライバシーポリシーおよびデータ処理契約（DPA）に基づき、適切なセキュリティ措置（暗号化、アクセス制御、監査ログ等）を講じています。</li>
          </ul>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">8. Cookie および類似技術の使用</h2>
          <p className="kc-legal-text">
            本サービスは、ログイン状態の維持および基本的な利便性向上のために Cookie および類似技術を使用しています。
            ブラウザの設定により Cookie の受け入れを拒否することができますが、その場合、本サービスにログインできない等、本サービスをご利用いただけなくなる可能性があります。
          </p>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">9. 安全管理措置</h2>
          <p className="kc-legal-text">
            当社は、取得した個人情報の漏えい、滅失、毀損の防止その他の安全管理のため、以下を含む適切な措置を講じます。
          </p>
          <ul className="kc-legal-ul">
            <li>パスワード等の認証情報のハッシュ化保存</li>
            <li>HTTPS 通信による暗号化</li>
            <li>データベースへのアクセス権限の最小化（Row Level Security 等）</li>
            <li>個人情報を取り扱う従業者・委託先に対する適切な監督</li>
            <li>セキュリティに関する教育・啓発</li>
            <li>不正アクセス・改ざん・漏えい等のインシデント発生時の対応手順の整備</li>
            <li>監査ログ（INSERT / UPDATE / DELETE）の記録による不正操作の検知</li>
          </ul>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">10. 利用者によるエンドユーザー情報の取り扱い義務</h2>
          <p className="kc-legal-text">
            利用者は、利用規約第12条に基づき、本サービスを通じて取得したエンドユーザーの個人情報を、面談実施および本サービスの目的の達成に必要な範囲においてのみ利用するものとします。
            利用者は、自らがエンドユーザーの個人情報を取り扱う立場として、個人情報保護法その他関係法令を遵守し、必要かつ適切な安全管理措置を講じる責任を負います。
            利用者が当該義務に違反したことにより当社が損害を被った場合、利用者は当社に対し、当該損害（合理的な弁護士費用を含みます）を賠償するものとします。
          </p>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">11. 保有個人データの開示等の請求</h2>
          <p className="kc-legal-text">
            利用者は、個人情報保護法に基づき、当社の保有する自己の個人情報について、利用目的の通知、開示、訂正、追加、削除、利用停止、消去および第三者への提供の停止（以下「開示等の請求」といいます）を請求することができます。
            請求方法は以下のとおりです。
          </p>
          <ol className="kc-legal-ol">
            <li>本サービスから対応可能な範囲（登録情報の表示・編集・削除、退会等）は、セルフサービスによりご操作ください。</li>
            <li>セルフサービスでは対応できない請求は、サポートメール
              <Link href="mailto:hello@kinda-futari.app" className="kc-legal-link">hello@kinda-futari.app</Link>
              までご連絡ください。当社は、本人確認を行ったうえで、合理的な範囲で速やかに対応します。
            </li>
            <li>請求内容が法令の要件を満たさない場合、または当該請求に応じることにより本人もしくは第三者の生命、身体、財産その他の権利利益を害するおそれがある場合等、個人情報保護法に定める事由に該当する場合は、開示等の請求の全部または一部に応じられないことがあります。この場合、当社はその理由を利用者に通知します。</li>
          </ol>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">12. 個人情報の保有期間</h2>
          <p className="kc-legal-text">
            当社は、利用目的の達成に必要な範囲で個人情報を保有し、不要となった個人情報は、合理的な期間内に削除または匿名化します。
            ただし、法令上保存が義務付けられている情報（請求・支払関連情報、適格請求書等）、紛争対応のために必要な情報、安全管理上必要な情報（アクセスログ・監査ログ等）については、それぞれ必要な期間保有することがあります。
            退会後の取り扱いは、利用規約第5条および本ポリシーに従い、原則として削除または匿名化の措置を講じますが、退会前に投稿された口コミについては、サービスの信頼性確保のため、匿名化のうえ引き続き掲載される場合があります。
          </p>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">13. プライバシーポリシーの変更</h2>
          <p className="kc-legal-text">
            当社は、法令の変更、サービス内容の変更その他の事情に応じて、本ポリシーを変更できるものとします。
            重要な変更がある場合は、本サービス上での通知またはメールにより、変更内容および変更の効力発生日を事前にお知らせします。
            変更後の本ポリシーは、本ページに掲示された時点（または当社が指定する効力発生日）から効力を生じます。
          </p>
        </section>

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">14. お問い合わせ窓口</h2>
          <div className="kc-legal-info-box">
            <p>事業者名：[会社名]</p>
            <p>所在地：[所在地]</p>
            <p>個人情報保護管理者：[氏名]</p>
            <p>
              お問い合わせ：
              <Link href="mailto:hello@kinda-futari.app" className="kc-legal-link">
                hello@kinda-futari.app
              </Link>
            </p>
          </div>
          <p className="kc-legal-text">
            当社の個人情報の取り扱いについて、苦情・ご意見等がある場合は、上記窓口までお問い合わせください。
          </p>
        </section>

        <p className="kc-legal-end">以上</p>
      </article>
    </main>
  )
}
