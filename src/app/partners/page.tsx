import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "掲載のご相談 | Kinda ふたりへ",
  description:
    "結婚相談所・カフェ・サロンなど、Kinda ふたりへ への掲載をお考えの事業者様へ。掲載プラン・料金・お申し込み方法のご案内。",
};

const SUPPORT_EMAIL = "hello@kinda-futari.app"; // TODO: 本番運用開始時に正式アドレスに差し替え

export default function PartnersPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[{ label: "ホーム", href: "/" }, { label: "掲載のご相談" }]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">for partners</p>
            <h1 className="legal-title">掲載のご相談</h1>
            <p className="legal-lead">
              Kinda ふたりへは、相談所・カフェ・サロン・スタジオなど、
              ふたりの時間を支える事業者様からの掲載相談を受け付けています。
              一緒に「人で選ばれる場所」をつくっていきませんか。
            </p>
          </header>

          {/* 相談所オーナー */}
          <section className="legal-section">
            <h2 className="legal-h2">結婚相談所オーナーの方へ</h2>
            <p className="legal-text">
              Kinda は、相談所のロゴではなく <strong>カウンセラー個人</strong> を見て選ばれる仕組みです。
              所属するカウンセラーが、自分の言葉と写真で語る「リール」を載せ、
              ユーザーは気になる人に直接予約できます。
            </p>

            <ul className="legal-feature-list">
              <li>
                <strong>カウンセラー個別のリール掲載</strong>
                <span>キャッチコピー・写真3〜10枚・自己紹介を、カウンセラー本人がスマホで編集できます。</span>
              </li>
              <li>
                <strong>面談予約の自動化</strong>
                <span>カレンダーで空き枠を出すだけ。ダブルブッキング防止のロックも自動。</span>
              </li>
              <li>
                <strong>口コミの信頼性担保</strong>
                <span>面談を経た方のみが書けるレビュー設計。1度きりの返信機能で誠実なやり取りを保ちます。</span>
              </li>
            </ul>
          </section>

          {/* お店オーナー */}
          <section className="legal-section">
            <h2 className="legal-h2">カフェ・サロン・スタジオオーナーの方へ</h2>
            <p className="legal-text">
              お見合い・デート・婚活前の美容など、
              <strong>ふたりが「ここで会いたい」と思える場所</strong> を取材して掲載しています。
            </p>

            <ul className="legal-feature-list">
              <li>
                <strong>編集部の取材掲載</strong>
                <span>編集部が実際に訪問し、雰囲気・座席・接客を見てから掲載します。広告色のない記事として残ります。</span>
              </li>
              <li>
                <strong>シーン別の露出</strong>
                <span>「お見合い向け」「デート 1 回目」「婚活前の美容」など、ユーザーの目的別に表示されます。</span>
              </li>
              <li>
                <strong>取材済みバッジ</strong>
                <span>ふたりへ取材済みのお店には信頼バッジが付き、検索結果でも目立ちます。</span>
              </li>
            </ul>
          </section>

          {/* 料金 */}
          <section className="legal-section">
            <h2 className="legal-h2">料金</h2>
            <div className="legal-pricing-card">
              <div className="legal-pricing-row">
                <span className="legal-pricing-label">相談所掲載</span>
                <span className="legal-pricing-value">面談予約 1 件あたり ¥5,000</span>
              </div>
              <div className="legal-pricing-row">
                <span className="legal-pricing-label">初期費用・月額費用</span>
                <span className="legal-pricing-value">¥0（成果報酬のみ）</span>
              </div>
              <div className="legal-pricing-row">
                <span className="legal-pricing-label">先行掲載キャンペーン</span>
                <span className="legal-pricing-value">最初の 100 社は 1 年間 完全無料</span>
              </div>
              <p className="legal-pricing-note">
                お店掲載は現在、編集部からのお声がけのみで進めています。
                ご希望の場合はお気軽にご相談ください。
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="legal-section">
            <h2 className="legal-h2">お申し込み・ご質問</h2>
            <p className="legal-text">
              下記のメールアドレスに、屋号・所在地・ご相談内容をお知らせください。
              担当より 2〜3 営業日以内にご返信します。
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=【掲載相談】`} className="legal-cta-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 3h10v8H2zM2 3l5 4 5-4" />
              </svg>
              {SUPPORT_EMAIL} に相談する
            </a>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
