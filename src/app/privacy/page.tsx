import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Kinda ふたりへ",
  description: "Kinda ふたりへ における個人情報の取り扱いについて。取得情報・利用目的・第三者提供・お問い合わせ窓口。",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026年5月10日";

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
              [会社名]（以下「当社」といいます）は、Kinda ふたりへ（以下「本サービス」といいます）における
              利用者の個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
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
            <p className="legal-text">取得した個人情報は、以下の目的で利用します。</p>
            <ul className="legal-ul">
              <li>本サービスの提供・運営</li>
              <li>面談予約の成立およびそれに伴う相談所・カウンセラーへの情報連携</li>
              <li>本人確認、認証、不正利用防止</li>
              <li>お問い合わせへの回答</li>
              <li>サービスに関する重要なお知らせ、利用規約等の変更通知</li>
              <li>サービス改善、新機能開発のための分析（個人を識別しない統計データを含む）</li>
              <li>マーケティング、メールマガジン送信（本人の同意を得た場合）</li>
              <li>法令に基づく対応</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">3. 第三者提供</h2>
            <p className="legal-text">
              当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="legal-ul">
              <li>本人の同意がある場合</li>
              <li>面談予約の成立に伴い、予約された相談所・カウンセラーに対し、面談に必要な範囲で予約情報（氏名、連絡先、希望日時、アンケート回答等）を提供する場合</li>
              <li>法令に基づく場合（裁判所、警察等からの正当な要請を含む）</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合</li>
              <li>合併、事業譲渡その他の事由により事業が承継される場合</li>
              <li>あらかじめ次の事項を通知または公表し、本人が反対しない場合（第三者提供に係るオプトアウト）</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">4. 業務委託先</h2>
            <p className="legal-text">
              当社は、本サービスの提供にあたり、以下の業務委託先を利用しています。
              これらの委託先には、必要かつ適切な監督を行います。
            </p>
            <ul className="legal-ul">
              <li>Supabase（データベース・認証）— Supabase Inc.</li>
              <li>Vercel（Web ホスティング・ログ解析）— Vercel Inc.</li>
              <li>Google Analytics（アクセス解析）— Google LLC</li>
              <li>Google Fonts（フォント配信）— Google LLC</li>
              <li>メール配信サービス（運用開始後に追記予定）</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">5. Cookie および類似技術の使用</h2>
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
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">6. 安全管理措置</h2>
            <p className="legal-text">
              当社は、取得した個人情報の漏洩、滅失、毀損の防止その他の安全管理のため、以下を含む適切な措置を講じます。
            </p>
            <ul className="legal-ul">
              <li>パスワード等の認証情報のハッシュ化保存</li>
              <li>HTTPS 通信による暗号化</li>
              <li>データベースへのアクセス権限の最小化（Row Level Security 等）</li>
              <li>従業者・委託先に対する適切な監督</li>
              <li>セキュリティに関する教育・啓発</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">7. 個人情報の開示・訂正・削除</h2>
            <p className="legal-text">
              ユーザーは、当社の保有する自己の個人情報について、開示、訂正、追加、削除、利用停止、消去および第三者への提供の停止を請求することができます。
              請求方法は以下のとおりです。
            </p>
            <ol className="legal-ol">
              <li>マイページから可能な範囲でセルフサービスにより操作してください。</li>
              <li>セルフサービスでは対応できない請求は、
                <a href="/contact" className="legal-link">お問い合わせページ</a>
                からご連絡ください。本人確認の上、合理的な範囲で速やかに対応します。
              </li>
            </ol>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">8. 未成年者の個人情報</h2>
            <p className="legal-text">
              本サービスは、結婚相談所への面談予約等を扱う性質上、原則として 20 歳以上の方のご利用を想定しています。
              未成年者が本サービスを利用する場合は、保護者の同意を得てください。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">9. プライバシーポリシーの変更</h2>
            <p className="legal-text">
              当社は、必要に応じて本ポリシーを変更できるものとします。
              重要な変更がある場合は、本サービス上での通知またはメールにより事前にお知らせします。
              変更後の本ポリシーは、本ページに掲示された時点で効力を生じます。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">10. お問い合わせ窓口</h2>
            <div className="legal-info-box">
              <p>事業者名：[会社名]</p>
              <p>所在地：[所在地]</p>
              <p>個人情報保護管理者：[氏名]</p>
              <p>
                お問い合わせ：
                <a href="/contact" className="legal-link">お問い合わせページ</a>
                からご連絡ください
              </p>
            </div>
          </section>

          <p className="legal-end">以上</p>
        </article>
      </main>

      <Footer />
    </>
  );
}
