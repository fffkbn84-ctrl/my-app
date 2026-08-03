import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CounselorInquiryForm from "@/components/for-counselors/CounselorInquiryForm";
import { getAllColumns } from "@/lib/columns";
import { getAllWeathers } from "@/app/kinda-note/data/weatherDescriptions";

// 動的トラストシグナル（S2）は 1 時間キャッシュ。cookies を読まないため静的生成 + ISR が効く。
export const revalidate = 3600;

const SITE_URL = "https://kinda.jp";

export const metadata: Metadata = {
  title: "掲載をお考えの結婚相談所・カウンセラーの方へ | Kinda",
  description:
    "Kinda は、カウンセラー一人ひとりを口コミで選べる結婚相談所プラットフォームです。初期費用・月額費用は無料。面談予約が成立したときのみ送客料 ¥5,000 が発生します。",
  alternates: { canonical: `${SITE_URL}/for-counselors` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "掲載をお考えの結婚相談所・カウンセラーの方へ | Kinda",
    description:
      "カウンセラー一人ひとりを口コミで選べる結婚相談所プラットフォーム。初期費用・月額費用は無料。面談予約が成立したときだけ送客料 ¥5,000。",
    url: `${SITE_URL}/for-counselors`,
    type: "website",
    locale: "ja_JP",
    siteName: "Kinda ふたりへ",
  },
  twitter: {
    card: "summary_large_image",
    title: "掲載をお考えの結婚相談所・カウンセラーの方へ | Kinda",
    description:
      "カウンセラー個人を口コミで選べる結婚相談所プラットフォーム。初期費用・月額無料、成果報酬のみ。",
  },
};

type TrustStat = { label: string; value: number };

/**
 * S2 の動的トラストシグナル。
 * - counselors / agencies / reviews は Supabase から count を取得（cookies 不要の anon クライアント）。
 * - 取得失敗した項目は null にして「非表示」にする（0 と誤表示しない）。ページ全体は壊さない。
 * - 公開コラムは MDX + 天気ページの静的カウント（取得失敗しない）。
 */
async function getTrustStats(): Promise<TrustStat[]> {
  const stats: TrustStat[] = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    try {
      const supabase = createClient(url, anonKey);

      const safeCount = async (
        label: string,
        build: () => PromiseLike<{ count: number | null; error: unknown }>,
      ): Promise<{ label: string; count: number | null }> => {
        try {
          const r = await build();
          return { label, count: r.error ? null : r.count };
        } catch {
          return { label, count: null };
        }
      };

      const counts = await Promise.all([
        safeCount("掲載カウンセラー", () =>
          supabase
            .from("counselors")
            .select("*", { count: "exact", head: true })
            .eq("is_published", true)
            .eq("is_demo", false),
        ),
        safeCount("掲載相談所", () =>
          supabase
            .from("agencies")
            .select("*", { count: "exact", head: true })
            .eq("is_published", true)
            .eq("is_demo", false),
        ),
        safeCount("掲載中の口コミ", () =>
          supabase
            .from("reviews")
            .select("*", { count: "exact", head: true })
            .eq("is_published", true),
        ),
      ]);

      for (const c of counts) {
        if (typeof c.count === "number") stats.push({ label: c.label, value: c.count });
      }
    } catch {
      // Supabase 取得に失敗しても数値項目を出さないだけ（ページは壊さない）
    }
  }

  // 公開コラム = コラム MDX + 紐づく天気ページ（静的カウント・失敗しない）
  try {
    const columns = await getAllColumns();
    const weatherPages = getAllWeathers().filter((w) => !!w.column_slug).length;
    const columnTotal = columns.length + weatherPages;
    if (columnTotal > 0) stats.push({ label: "公開コラム", value: columnTotal });
  } catch {
    // コラム集計に失敗してもページは出す（その項目だけ非表示）
  }

  return stats;
}

const DIFF_CARDS = [
  {
    title: "カウンセラー個人のページを持てます",
    body: "相談所単位ではなく、カウンセラー一人ひとりにページがあります。経歴・考え方・写真をご自身で編集でき、口コミも個人に紐づきます。",
  },
  {
    title: "口コミは、実際に面談した方からのみ届きます",
    body: "Kinda 経由で面談を完了した方に発行される認証コードがないと投稿できません。第三者の書き込みは構造上できない仕組みです。",
  },
  {
    title: "費用は、予約が成立したときだけです",
    body: "初期費用・月額掲載料はいただきません。面談予約が成立した時点で送客料 ¥5,000 が発生します。予約がなければ費用は発生しません。",
  },
];

const STEPS = [
  {
    title: "お問い合わせ",
    body: "下のフォームからご連絡ください。運営（ふうか）から3営業日以内にご返信します。",
  },
  {
    title: "オンラインで15分ほどお話しします",
    body: "Kinda の仕組み・費用・掲載範囲をご説明します。この時点でお断りいただいても構いません。",
  },
  {
    title: "専用アカウントを発行します",
    body: "ご相談所専用の管理画面アカウントをお渡しします。プロフィール・写真の入力はカウンセラーご自身が行い、いつでも編集できます。",
  },
  {
    title: "公開",
    body: "ページが公開されます。掲載の停止はいつでも可能で、違約金はありません。",
  },
];

const LISTING_CARDS = [
  {
    title: "Kinda talk への掲載",
    body: "カウンセラー個人のページ。プロフィール・対応エリア・料金・口コミが並びます。",
  },
  {
    title: "Kinda type への掲載",
    body: "ユーザーがカウンセラーとの相性を確認できる仕組みです。6タイプに沿ってご自身の傾向を登録いただきます。",
  },
  {
    title: "Kinda voices（取材記事）",
    body: "ご希望とタイミングが合えば、運営がインタビューして記事を制作します。ご相談所名・カウンセラー名・地域名で検索したときに見つかる記事になります。全員にお約束できるものではありません。",
  },
  {
    title: "これまでの口コミの代理掲載",
    body: "Kinda に掲載する前からお持ちの体験談・お客様の声を、テキストでお送りいただければ運営が入力して掲載します。「代理掲載」のバッジが必ず表示されます。",
  },
];

const FAQ_ITEMS = [
  {
    q: "悪い口コミを書かれたら、削除できますか？",
    a: "運営側での削除はお受けできません。ただし、虚偽・誹謗中傷・個人情報の記載など、ガイドライン違反の口コミは審査のうえ削除します。「評価が低い」という理由だけでの削除には応じられませんが、相談所側からの返信機能（公開コメント）を用意しており、誤解への説明や対応の姿勢を示すことができます。口コミの健全性を保つことが、プラットフォーム全体の信頼につながると考えて運用しています。",
  },
  {
    q: "競合の相談所から嫌がらせの口コミを書かれるリスクはありませんか？",
    a: "構造上、できません。口コミは、Kinda 経由でログインし、実際に面談を完了したご自身の予約に紐づけて初めて投稿できます。第三者が成りすまして書くことはできません。面談の実績に紐づいた口コミのみが掲載される仕組みです。",
  },
  {
    q: "口コミがゼロの状態では、ユーザーに選ばれないのではないですか？",
    a: "Kinda には「代理掲載」という仕組みがあります。Kinda 登録前にすでにお持ちの実績（自社サイトの体験談・お客様からいただいた感想文など）を、テキストでお送りいただければ、運営が代わりに入力して掲載します。代理掲載には専用のバッジを表示し、透明性を担保しています。口コミがゼロの状態でも、これまでの実績を資産として活かすことができます。また、口コミは面談のたびに積み上がる資産でもあり、早い時期に参加した相談所ほど実績が先行して蓄積されます。",
  },
  {
    q: "掲載をやめたくなったら、どうすればいいですか？",
    a: "いつでも停止できます。違約金や解約手数料はいただきません。運営にご連絡いただければ、掲載を停止します。最低利用期間の縛りもありません。",
  },
];

export default async function ForCounselorsPage() {
  const stats = await getTrustStats();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const numberFmt = new Intl.NumberFormat("ja-JP");

  return (
    <>
      <Header />

      <main className="fc-page">
        <Breadcrumb
          items={[{ label: "ホーム", href: "/" }, { label: "掲載をお考えの方へ" }]}
        />

        {/* S1. ヒーロー */}
        <section className="fc-hero">
          <p className="fc-eyebrow">for counselors</p>
          <h1 className="fc-hero-title">
            カウンセラー一人ひとりが、選ばれる場所をつくっています。
          </h1>
          <p className="fc-hero-lead">
            Kinda は、結婚相談所を「どこ」ではなく「誰」で選ぶためのプラットフォームです。
            実際に面談した方の口コミだけを掲載しています。
            初期費用・月額費用はいただきません。
          </p>
          <div className="fc-hero-cta">
            <a href="#inquiry" className="fc-btn fc-btn-primary">
              掲載について相談する
            </a>
            <a href="/" className="fc-btn fc-btn-ghost">
              Kinda を見てみる
            </a>
          </div>
        </section>

        {/* S2. 現在の Kinda（動的トラストシグナル） */}
        <section className="fc-section fc-trust">
          <h2 className="fc-h2">いまの Kinda</h2>
          {stats.length > 0 && (
            <div className="fc-stat-grid">
              {stats.map((s) => (
                <div key={s.label} className="fc-stat">
                  <span className="fc-stat-value">{numberFmt.format(s.value)}</span>
                  <span className="fc-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
          <p className="fc-trust-note">
            Kinda は 2026 年に立ち上がったばかりのプラットフォームです。
            掲載数も口コミ数も、これから積み上げていく段階にあります。
            だからこそ、早い時期に掲載いただいた方のページから口コミが溜まっていきます。
          </p>
        </section>

        {/* S3. Kinda が他と違う3点 */}
        <section className="fc-section">
          <h2 className="fc-h2">Kinda が大切にしている3つのこと</h2>
          <div className="fc-card-grid fc-card-grid-3">
            {DIFF_CARDS.map((c, i) => (
              <div key={c.title} className="fc-card">
                <span className="fc-card-num">{i + 1}</span>
                <h3 className="fc-card-title">{c.title}</h3>
                <p className="fc-card-body">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* S4. 掲載までの流れ */}
        <section className="fc-section">
          <h2 className="fc-h2">掲載までの流れ</h2>
          <ol className="fc-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="fc-step">
                <span className="fc-step-num">{i + 1}</span>
                <div>
                  <h3 className="fc-step-title">{s.title}</h3>
                  <p className="fc-step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* S5. 費用 */}
        <section className="fc-section">
          <h2 className="fc-h2">費用</h2>
          <div className="fc-price-card">
            <div className="fc-price-row">
              <span className="fc-price-label">初期費用</span>
              <span className="fc-price-value">無料</span>
            </div>
            <div className="fc-price-row">
              <span className="fc-price-label">月額掲載料</span>
              <span className="fc-price-value">無料</span>
            </div>
            <div className="fc-price-row">
              <span className="fc-price-label">送客料</span>
              <span className="fc-price-value">面談予約の成立ごとに ¥5,000</span>
            </div>
          </div>
          <ul className="fc-price-notes">
            <li>
              予約が成立した時点で送客料が発生します。以後のキャンセルは原則返金いたしませんが、やむを得ない事情の場合は運営事務局にご相談ください。
            </li>
            <li>
              将来的に定額掲載プランを選択肢としてご案内する予定です。切り替えは任意で、強制ではありません。
            </li>
          </ul>
        </section>

        {/* S6. 掲載いただける内容 */}
        <section className="fc-section">
          <h2 className="fc-h2">掲載いただける内容</h2>
          <div className="fc-card-grid fc-card-grid-2">
            {LISTING_CARDS.map((c) => (
              <div key={c.title} className="fc-card">
                <h3 className="fc-card-title">{c.title}</h3>
                <p className="fc-card-body">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* S7. よくあるご質問 */}
        <section className="fc-section">
          <h2 className="fc-h2">よくあるご質問</h2>
          <div className="fc-faq">
            {FAQ_ITEMS.map((f) => (
              <details key={f.q} className="fc-faq-item">
                <summary className="fc-faq-q">{f.q}</summary>
                <p className="fc-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* S8. お問い合わせフォーム */}
        <section id="inquiry" className="fc-section fc-inquiry">
          <h2 className="fc-h2">掲載について相談する</h2>
          <p className="fc-inquiry-lead">
            以下のフォームからお気軽にご連絡ください。運営（ふうか）から3営業日以内にご返信します。
          </p>
          <CounselorInquiryForm />
        </section>

        {/* S9. 運営者について */}
        <section className="fc-section fc-operator">
          <h2 className="fc-h2">運営者について</h2>
          <p className="fc-operator-body">
            Kinda を運営しているのは、ふうか（一人）です。
            自身も結婚相談所「Emma」を運営しています。
            Kinda では Emma を他の相談所と完全に同じ扱いで掲載しており、
            検索結果やおすすめで優遇することはありません。
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </main>

      <Footer />

      <style>{`
        .fc-page {
          background: #F5EEE6;
          color: var(--ink);
          padding-bottom: 80px;
        }
        .fc-page section {
          max-width: 920px;
          margin: 0 auto;
          padding-left: 22px;
          padding-right: 22px;
          box-sizing: border-box;
        }

        /* S1 ヒーロー */
        .fc-hero {
          padding-top: 40px;
          padding-bottom: 56px;
          text-align: center;
        }
        .fc-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 0 0 18px;
        }
        .fc-hero-title {
          font-family: var(--font-mincho, serif);
          font-size: clamp(26px, 5.4vw, 40px);
          line-height: 1.45;
          font-weight: 600;
          margin: 0 auto 22px;
          max-width: 20em;
        }
        .fc-hero-lead {
          font-size: 15px;
          line-height: 2;
          color: var(--mid);
          margin: 0 auto 34px;
          max-width: 34em;
        }
        .fc-hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
        }
        .fc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 30px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .fc-btn-primary {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 8px 22px var(--accent-shadow, rgba(212,160,144,.5));
        }
        .fc-btn-primary:hover { transform: translateY(-1px); background: var(--accent-deep, #B8806E); }
        .fc-btn-ghost {
          background: transparent;
          color: var(--ink);
          border: 1px solid var(--light);
        }
        .fc-btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

        /* 共通セクション */
        .fc-section {
          padding-top: 40px;
          padding-bottom: 40px;
        }
        .fc-h2 {
          font-family: var(--font-mincho, serif);
          font-size: clamp(20px, 4vw, 26px);
          font-weight: 600;
          line-height: 1.5;
          margin: 0 0 26px;
          text-align: center;
        }

        /* S2 トラスト */
        .fc-trust { text-align: center; }
        .fc-stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 26px;
        }
        .fc-stat {
          background: #fff;
          border-radius: 18px;
          padding: 26px 16px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 8px 24px rgba(26,19,14,.05);
        }
        .fc-stat-value {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(30px, 7vw, 42px);
          font-weight: 700;
          color: var(--accent);
          line-height: 1.1;
        }
        .fc-stat-label {
          display: block;
          margin-top: 8px;
          font-size: 13px;
          color: var(--mid);
        }
        .fc-trust-note {
          font-size: 14px;
          line-height: 2;
          color: var(--mid);
          max-width: 34em;
          margin: 0 auto;
          text-align: left;
        }

        /* カードグリッド（S3 / S6） */
        .fc-card-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        .fc-card {
          background: #fff;
          border-radius: 20px;
          padding: 28px 26px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 8px 24px rgba(26,19,14,.05);
        }
        .fc-card-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: var(--accent-dim, rgba(212,160,144,.12));
          color: var(--accent);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 14px;
        }
        .fc-card-title {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .fc-card-body {
          font-size: 14px;
          line-height: 1.95;
          color: var(--mid);
          margin: 0;
        }

        /* S4 ステップ */
        .fc-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .fc-step {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          background: #fff;
          border-radius: 18px;
          padding: 22px 22px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 6px 20px rgba(26,19,14,.045);
        }
        .fc-step-num {
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
        }
        .fc-step-title { font-size: 15px; font-weight: 600; margin: 4px 0 8px; line-height: 1.5; }
        .fc-step-body { font-size: 14px; line-height: 1.9; color: var(--mid); margin: 0; }

        /* S5 費用 */
        .fc-price-card {
          background: #fff;
          border-radius: 20px;
          padding: 12px 26px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 8px 24px rgba(26,19,14,.05);
          max-width: 560px;
          margin: 0 auto 20px;
        }
        .fc-price-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid var(--pale);
        }
        .fc-price-row:last-child { border-bottom: none; }
        .fc-price-label { font-size: 14px; color: var(--mid); }
        .fc-price-value { font-size: 16px; font-weight: 600; text-align: right; }
        .fc-price-notes {
          max-width: 560px;
          margin: 0 auto;
          padding-left: 1.1em;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.9;
        }
        .fc-price-notes li { margin-bottom: 6px; }

        /* S7 FAQ */
        .fc-faq {
          max-width: 660px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .fc-faq-item {
          background: #fff;
          border-radius: 16px;
          padding: 4px 22px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 6px 18px rgba(26,19,14,.04);
        }
        .fc-faq-q {
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.6;
          padding: 18px 0;
          list-style: none;
          position: relative;
          padding-right: 28px;
        }
        .fc-faq-q::-webkit-details-marker { display: none; }
        .fc-faq-q::after {
          content: "+";
          position: absolute;
          right: 2px;
          top: 16px;
          font-size: 20px;
          color: var(--accent);
          font-weight: 400;
        }
        .fc-faq-item[open] .fc-faq-q::after { content: "−"; }
        .fc-faq-a {
          font-size: 14px;
          line-height: 2;
          color: var(--mid);
          margin: 0;
          padding: 0 0 20px;
        }

        /* S8 フォーム */
        .fc-inquiry {
          background: #fff;
          border-radius: 24px;
          max-width: 720px;
          margin-top: 8px;
          margin-bottom: 8px;
          padding-top: 40px;
          padding-bottom: 40px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 10px 30px rgba(26,19,14,.06);
        }
        .fc-inquiry-lead {
          font-size: 14px;
          line-height: 1.95;
          color: var(--mid);
          text-align: center;
          max-width: 32em;
          margin: 0 auto 30px;
        }

        /* S9 運営者 */
        .fc-operator-body {
          font-size: 14px;
          line-height: 2;
          color: var(--mid);
          max-width: 34em;
          margin: 0 auto;
          text-align: center;
        }

        @media (min-width: 720px) {
          .fc-card-grid-3 { grid-template-columns: repeat(3, 1fr); }
          .fc-card-grid-2 { grid-template-columns: repeat(2, 1fr); }
          .fc-stat-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </>
  );
}
