import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CounselorInquiryForm from "@/components/for-counselors/CounselorInquiryForm";
import { getAllColumns, type ColumnMeta } from "@/lib/columns";
import { getAllWeathers } from "@/app/kinda-note/data/weatherDescriptions";

// 動的トラストシグナルは 1 時間キャッシュ。cookies を読まないため静的生成 + ISR が効く。
// 取材ファースト構成（S1-S10）。
export const revalidate = 3600;

const SITE_URL = "https://kinda.jp";

// 件数が少ないうちは数字を出さない（0 や 1 の表示は B2B 獲得ページで不利になるため）
const MIN_DISPLAY = 5;

export const metadata: Metadata = {
  title: "カウンセラー取材と掲載のご案内｜結婚相談所の方へ | Kinda",
  description:
    "Kinda は結婚相談所のカウンセラーお一人ずつに取材し、記事として公開しています。取材は無料で、Kinda への掲載は条件ではありません。掲載をご希望の場合も初期費用・月額費用は無料、面談予約が成立したときのみ送客料 ¥5,000 です。",
  alternates: { canonical: `${SITE_URL}/for-counselors` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "カウンセラー取材と掲載のご案内｜結婚相談所の方へ | Kinda",
    description:
      "結婚相談所のカウンセラーお一人ずつに取材し、記事として公開しています。取材は無料・掲載は条件ではありません。",
    url: `${SITE_URL}/for-counselors`,
    type: "website",
    locale: "ja_JP",
    siteName: "Kinda ふたりへ",
  },
  twitter: {
    card: "summary_large_image",
    title: "カウンセラー取材と掲載のご案内｜結婚相談所の方へ | Kinda",
    description:
      "カウンセラー個人を取材し、記事として公開しています。取材は無料・掲載は条件ではありません。",
  },
};

type TrustStat = { label: string; value: number };

/**
 * トラストシグナル。
 * - counselors / agencies / reviews は Supabase から count を取得（cookies 不要の anon クライアント）。
 * - 件数が MIN_DISPLAY 未満、または取得失敗した項目は push しない（0 や 1 を出さない）。
 * - 「公開している記事」は MDX + 天気ページの静的カウント（閾値対象外・取得失敗しない）。
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
        // 閾値未満（0 / 1 など）は出さない
        if (typeof c.count === "number" && c.count >= MIN_DISPLAY) {
          stats.push({ label: c.label, value: c.count });
        }
      }
    } catch {
      // Supabase 取得に失敗しても数値項目を出さないだけ（ページは壊さない）
    }
  }

  // 公開している記事 = コラム MDX + 紐づく天気ページ（静的カウント・閾値対象外）
  try {
    const columns = await getAllColumns();
    const weatherPages = getAllWeathers().filter((w) => !!w.column_slug).length;
    const articleTotal = columns.length + weatherPages;
    if (articleTotal > 0) stats.push({ label: "公開している記事", value: articleTotal });
  } catch {
    // 記事集計に失敗してもページは出す（その項目だけ非表示）
  }

  return stats;
}

const PRIORITY_COLUMN_SLUGS = [
  "counselor-de-erabu-soudanjo",
  "kekkon-soudanjo-ryokin-no-mikata",
  "shokai-mendan-de-miru-koto",
];

/** S6 に並べる記事3本。優先スラッグ→先頭フォールバック。取得失敗時は空配列（セクション非表示）。 */
async function getExampleColumns(): Promise<ColumnMeta[]> {
  let all: ColumnMeta[];
  try {
    all = await getAllColumns();
  } catch {
    return [];
  }

  const picked: ColumnMeta[] = [];
  for (const slug of PRIORITY_COLUMN_SLUGS) {
    const found = all.find((c) => c.slug === slug);
    if (found) picked.push(found);
  }
  if (picked.length < 3) {
    for (const c of all) {
      if (picked.length >= 3) break;
      if (!picked.some((p) => p.slug === c.slug)) picked.push(c);
    }
  }
  return picked.slice(0, 3);
}

// S2 取材について（定義リスト）
const INTERVIEW_ITEMS = [
  { term: "費用", desc: "無料です。こちらから費用をいただくことも、お支払いすることもありません。" },
  { term: "方法", desc: "オンライン（Google Meet）で60分ほどです。日程はご都合に合わせます。" },
  { term: "聞き手", desc: "運営のふうかが伺います。同じく結婚相談所のカウンセラーです。" },
  { term: "掲載との関係", desc: "Kinda への掲載は条件ではありません。取材だけでも構いません。" },
  { term: "原稿の確認", desc: "公開前に必ず原稿をご確認いただきます。表現の修正も、公開の取りやめもできます。" },
  { term: "写真", desc: "顔写真は任意です。ご提供がない場合はイラストで対応します。" },
  { term: "公開後", desc: "記事はご自身のサイトや SNS で自由に引用・リンクしていただけます。公開後の取り下げもいつでもお受けします。" },
];

// S5 Kinda が大切にしている3つのこと（3枚目を取材ファースト版に差し替え）
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
    title: "書かれた記事が、資産として残ります",
    body: "Kinda は検索から人が訪れるサイトです。取材記事も、コラムも、相談所名やカウンセラー名で調べた方に届きます。広告枠ではなく、読まれる文章として残ります。",
  },
];

// S4 取材から公開までの流れ
const STEPS = [
  {
    title: "お問い合わせ",
    body: "下のフォームからご連絡ください。運営から3営業日以内にご返信します。",
  },
  {
    title: "日程の調整",
    body: "オンライン（Google Meet）で60分ほどお時間をいただきます。ご都合のよい日時をお知らせください。",
  },
  {
    title: "取材",
    body: "面談で大切にしていること、これまでのご経験などを伺います。Kinda の仕組みについてもご説明しますが、その場でご返答いただく必要はありません。",
  },
  {
    title: "原稿の確認",
    body: "記事にまとめて、公開前にお送りします。事実の誤りや表現のご希望があれば直します。公開を取りやめることもできます。",
  },
  {
    title: "公開",
    body: "Kinda 上に公開します。記事のURLはご自身のサイトや SNS で自由にお使いください。",
  },
];

// S7-1 掲載いただける内容（4枚→3枚。取材記事カードは S2 に移動したため削除）
const LISTING_CARDS = [
  {
    title: "Kinda talk への掲載",
    body: "カウンセラー個人のページ。プロフィール・対応エリア・料金・口コミが並びます。プロフィールと写真はカウンセラーご自身が管理画面から編集でき、いつでも変更できます。",
  },
  {
    title: "Kinda type への掲載",
    body: "ユーザーがカウンセラーとの相性を確認できる仕組みです。4タイプに沿ってご自身の傾向を登録いただきます。",
  },
  {
    title: "これまでの口コミの代理掲載",
    body: "Kinda に掲載する前からお持ちの体験談・お客様の声を、テキストでお送りいただければ運営が入力して掲載します。「代理掲載」のバッジが必ず表示されます。",
  },
];

// S7-3 掲載までの流れ（独立番号）
const LISTING_STEPS = [
  {
    title: "ご相談",
    body: "下のフォームで「掲載について聞きたい」を選んでご連絡ください。",
  },
  {
    title: "ご説明",
    body: "オンラインで15分ほど、仕組み・費用・掲載範囲をご説明します。この時点でお断りいただいて構いません。",
  },
  {
    title: "アカウント発行",
    body: "ご相談所専用の管理画面アカウントをお渡しします。プロフィール・写真の入力はカウンセラーご自身が行い、いつでも編集できます。",
  },
  {
    title: "公開",
    body: "ページが公開されます。掲載の停止はいつでも可能で、違約金はありません。",
  },
];

// S8 よくあるご質問（取材系4問 → 既存4問の順）
const FAQ_ITEMS = [
  {
    q: "取材を受けたら、Kinda に掲載しなければいけませんか？",
    a: "いいえ。掲載は取材の条件ではありません。取材だけを受けていただいても構いませんし、記事の公開後に掲載をお断りいただくこともできます。取材の場で掲載をご返答いただく必要もありません。",
  },
  {
    q: "取材に費用はかかりますか？",
    a: "かかりません。こちらから取材費用をいただくことも、お支払いすることもありません。オンライン（Google Meet）で60分ほどお時間をいただくだけです。",
  },
  {
    q: "取材記事を、自分のサイトや SNS で使えますか？",
    a: "はい。記事のURLへのリンク、一部の引用は自由にしていただけます。全文をそのまま転載される場合のみ、事前にご相談ください。",
  },
  {
    q: "公開した記事を、あとから削除できますか？",
    a: "できます。ご連絡いただければ非公開にします。理由を伺うこともありません。公開前の原稿確認の段階で取りやめていただくことも可能です。",
  },
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
  const [stats, exampleColumns] = await Promise.all([getTrustStats(), getExampleColumns()]);

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
          items={[{ label: "ホーム", href: "/" }, { label: "カウンセラーの方へ" }]}
        />

        {/* S1. ヒーロー（取材が主CTA） */}
        <section className="fc-hero">
          <p className="fc-eyebrow">for counselors</p>
          <h1 className="fc-hero-title">
            相談所ではなく、カウンセラーを取材しています。
          </h1>
          <p className="fc-hero-lead">
            Kinda は、結婚相談所を「どこ」ではなく「誰」で選ぶためのサイトです。
            いま、カウンセラーの方お一人ずつにお話を伺い、記事として公開しています。
            取材は無料で、Kinda への掲載は条件ではありません。
            記事はご自身のサイトや SNS でも自由に使っていただけます。
          </p>
          <div className="fc-hero-cta">
            <a href="#inquiry" className="fc-btn fc-btn-primary">
              取材について相談する
            </a>
            <a href="#listing" className="fc-btn fc-btn-ghost">
              掲載について知る
            </a>
          </div>
        </section>

        {/* S2. 取材について（ページの中核） */}
        <section className="fc-section">
          <h2 className="fc-h2">取材について</h2>
          <p className="fc-section-lead">
            面談で大切にしていること、どんなご相談が多いか、この仕事を選んだ理由。
            そういったことを伺って、記事にまとめます。
          </p>
          <dl className="fc-deflist">
            {INTERVIEW_ITEMS.map((item) => (
              <div key={item.term} className="fc-def">
                <dt className="fc-dt">{item.term}</dt>
                <dd className="fc-dd">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* S3. なぜ取材からなのか */}
        <section className="fc-section">
          <h2 className="fc-h2">なぜ、取材からお願いしているのか</h2>
          <div className="fc-prose">
            <p>
              Kinda は 2026 年に立ち上がったばかりのサイトです。
              いま掲載をお勧めしても、お渡しできる実績はまだ多くありません。
            </p>
            <p>
              だから先に、カウンセラーの方が考えていることを記事として残すことから始めています。
              記事は検索で見つかります。相談所名やお名前で調べた方が、
              広告ではない文章としてそれを読むことになります。
            </p>
            <p>掲載していただくかどうかは、そのあとで決めていただければ十分です。</p>
            <p className="fc-prose-note">
              早い時期に掲載いただいた相談所ほど、口コミが先に積み上がっていきます。
            </p>
          </div>
        </section>

        {/* S4. 取材から公開までの流れ */}
        <section className="fc-section">
          <h2 className="fc-h2">取材から公開までの流れ</h2>
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

        {/* S5. Kinda が大切にしている3つのこと */}
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

        {/* トラストシグナル（数値）— S6 の直前に小さく置く */}
        {stats.length > 0 && (
          <section className="fc-section fc-trust">
            <div
              className="fc-stat-grid"
              style={{ maxWidth: stats.length <= 1 ? 260 : 640 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="fc-stat">
                  <span className="fc-stat-value">{numberFmt.format(s.value)}</span>
                  <span className="fc-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* S6. 公開している記事の例 */}
        {exampleColumns.length > 0 && (
          <section className="fc-section">
            <h2 className="fc-h2">公開している記事の例</h2>
            <p className="fc-section-lead">
              Kinda では、結婚相談所やカウンセラー選びについての記事を公開しています。
              取材記事もこの中に並びます。
            </p>
            <div className="fc-card-grid fc-card-grid-3">
              {exampleColumns.map((c) => (
                <Link key={c.slug} href={`/columns/${c.slug}`} className="fc-article-card">
                  <h3 className="fc-article-title">{c.title}</h3>
                  {c.description && <p className="fc-article-desc">{c.description}</p>}
                  <span className="fc-article-more">記事を読む →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* S7. 掲載について */}
        <section id="listing" className="fc-section">
          <h2 className="fc-h2">掲載について</h2>
          <p className="fc-section-lead">
            取材とは別に、Kinda にカウンセラーページを掲載していただくこともできます。
            取材を受けた方に掲載をお願いすることはありません。ご希望があればご案内します。
          </p>

          {/* 7-1. 掲載いただける内容 */}
          <h3 className="fc-h3">掲載いただける内容</h3>
          <div className="fc-card-grid fc-card-grid-3">
            {LISTING_CARDS.map((c) => (
              <div key={c.title} className="fc-card">
                <h4 className="fc-card-title">{c.title}</h4>
                <p className="fc-card-body">{c.body}</p>
              </div>
            ))}
          </div>

          {/* 7-2. 費用 */}
          <h3 className="fc-h3">費用</h3>
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
            <li>取材は無料です。掲載していただかない場合も費用は発生しません。</li>
            <li>
              予約が成立した時点で送客料が発生します。以後のキャンセルは原則返金いたしませんが、やむを得ない事情の場合は運営事務局にご相談ください。
            </li>
          </ul>

          {/* 7-3. 掲載までの流れ */}
          <h3 className="fc-h3">掲載までの流れ</h3>
          <ol className="fc-steps">
            {LISTING_STEPS.map((s, i) => (
              <li key={s.title} className="fc-step">
                <span className="fc-step-num">{i + 1}</span>
                <div>
                  <h4 className="fc-step-title">{s.title}</h4>
                  <p className="fc-step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* S8. よくあるご質問 */}
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

        {/* S9. お問い合わせフォーム */}
        <section id="inquiry" className="fc-section fc-inquiry">
          <h2 className="fc-h2">お問い合わせ</h2>
          <p className="fc-inquiry-lead">
            取材のご相談も、掲載のご相談も、こちらからお願いします。
            運営から3営業日以内にご返信します。
          </p>
          <CounselorInquiryForm />
        </section>

        {/* S10. 運営者について */}
        <section className="fc-section fc-operator">
          <h2 className="fc-h2">運営者について</h2>
          <p className="fc-operator-body">
            Kinda の運営チームには、結婚相談所「Emma」の運営者も参加しています。
            Kinda では Emma を他の相談所と完全に同じ扱いで掲載しており、
            検索結果やおすすめで優遇することはありません。
          </p>
          <p className="fc-operator-link">
            <a href="/about">このサービスについて →</a>
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
          margin: 0 0 22px;
          text-align: center;
        }
        .fc-h3 {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.5;
          margin: 40px 0 18px;
          text-align: center;
        }
        .fc-section-lead {
          font-size: 14px;
          line-height: 1.95;
          color: var(--mid);
          text-align: center;
          max-width: 34em;
          margin: 0 auto 28px;
        }

        /* S2 定義リスト */
        .fc-deflist {
          max-width: 620px;
          margin: 0 auto;
          background: #fff;
          border-radius: 20px;
          padding: 10px 26px;
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 8px 24px rgba(26,19,14,.05);
        }
        .fc-def {
          padding: 18px 0;
          border-bottom: 1px solid var(--pale);
        }
        .fc-def:last-child { border-bottom: none; }
        .fc-dt { font-size: 13px; color: var(--mid); }
        .fc-dd { font-size: 14px; line-height: 1.95; margin: 4px 0 0; }

        /* S3 散文 */
        .fc-prose {
          max-width: 34em;
          margin: 0 auto;
        }
        .fc-prose p {
          font-size: 14px;
          line-height: 2;
          color: var(--mid);
          margin: 0 0 18px;
        }
        .fc-prose p:last-child { margin-bottom: 0; }
        .fc-prose-note {
          margin-top: 24px !important;
          padding-top: 20px;
          border-top: 1px solid var(--pale);
          color: var(--ink) !important;
        }

        /* トラスト数値 */
        .fc-trust { text-align: center; }
        .fc-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
          margin: 0 auto;
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

        /* カードグリッド（S5 / S7-1 / S6） */
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

        /* S6 記事カード（リンク） */
        .fc-article-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 20px;
          padding: 26px 24px;
          text-decoration: none;
          color: var(--ink);
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 8px 24px rgba(26,19,14,.05);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .fc-article-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 1px 2px rgba(26,19,14,.04), 0 14px 32px rgba(26,19,14,.08);
        }
        .fc-article-title {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .fc-article-desc {
          font-size: 13px;
          line-height: 1.85;
          color: var(--mid);
          margin: 0 0 16px;
          flex: 1;
        }
        .fc-article-more {
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
        }

        /* S4 / S7-3 ステップ */
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

        /* S7-2 費用 */
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

        /* S8 FAQ */
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

        /* S9 フォーム */
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

        /* S10 運営者 */
        .fc-operator-body {
          font-size: 14px;
          line-height: 2;
          color: var(--mid);
          max-width: 34em;
          margin: 0 auto;
          text-align: center;
        }
        .fc-operator-link {
          text-align: center;
          margin: 22px 0 0;
        }
        .fc-operator-link a {
          font-size: 13px;
          color: var(--accent);
          text-decoration: none;
        }
        .fc-operator-link a:hover { text-decoration: underline; }

        @media (min-width: 720px) {
          .fc-card-grid-3 { grid-template-columns: repeat(3, 1fr); }
          .fc-card-grid-2 { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
