import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "お問い合わせ | Kinda ふたりへ",
  description:
    "Kinda ふたりへ のサービスに関するご質問・ご要望はこちらから。メール または LINE 公式アカウントでお受けしています。",
};

const SUPPORT_EMAIL = "hello@kinda-futari.app"; // TODO: 本番運用開始時に正式アドレスに差し替え

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="legal-page">
        <Breadcrumb
          items={[{ label: "ホーム", href: "/" }, { label: "お問い合わせ" }]}
        />

        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">contact</p>
            <h1 className="legal-title">お問い合わせ</h1>
            <p className="legal-lead">
              ご質問・ご要望、サービスについてのご相談は、以下からお気軽にどうぞ。
            </p>
          </header>

          <section className="legal-section">
            <h2 className="legal-h2">メールで問い合わせる</h2>
            <p className="legal-text">
              いただいた内容にあわせて、担当から直接ご返信します。
              通常 2〜3 営業日以内にお返事しています。
            </p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="legal-cta-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 3h10v8H2zM2 3l5 4 5-4" />
              </svg>
              {SUPPORT_EMAIL}
            </a>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">
              LINE で問い合わせる
              <span className="legal-badge-soon">準備中</span>
            </h2>
            <p className="legal-text">
              LINE 公式アカウントからのお問い合わせも近日公開します。
              お急ぎの場合は上記メールアドレスへどうぞ。
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">よくあるご質問</h2>
            <p className="legal-text">
              サービスの基本的な内容については、各 Kinda ページの末尾「よくある質問」にもまとめています。
            </p>
            <ul className="legal-list">
              <li>
                <a href="/kinda-talk" className="legal-link">
                  Kinda talk のよくある質問
                </a>
              </li>
              <li>
                <a href="/kinda-act" className="legal-link">
                  Kinda act のよくある質問
                </a>
              </li>
              <li>
                <a href="/columns" className="legal-link">
                  Kinda voices（コラム）のよくある質問
                </a>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-h2">掲載をご希望の事業者様</h2>
            <p className="legal-text">
              相談所オーナー・お店オーナー様の掲載に関するお問い合わせは、専用ページからどうぞ。
            </p>
            <a href="/partners" className="legal-cta-ghost">
              掲載のご相談を見る
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </a>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
