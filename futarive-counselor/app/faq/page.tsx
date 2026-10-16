import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'よくある質問 | Kinda カウンセラー管理画面',
  description: 'Kinda カウンセラー管理画面の送客料・課金・返金についてのよくある質問。',
  robots: { index: false, follow: false },
}

const LAST_UPDATED = '2026年10月16日'

// 料金・返金の決まりの正は利用規約 第6条（/terms）。ここは同じ内容を質問の形で言い直したもの。
// 規約を変えたときはここも合わせて直すこと。
const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: '送客料はいつ課金されますか？',
    a: (
      <>
        ご予約が確定した時点で、登録いただいたクレジットカードに ¥5,500（税込）を課金します。
        決済が終わると、管理画面にユーザーのお名前と連絡先が表示されます。
        初期費用と月額費用はかかりません。
      </>
    ),
  },
  {
    q: 'カードは予約のたびに入力が必要ですか？',
    a: (
      <>
        最初に1回だけ登録していただければ大丈夫です。
        カードは Stripe（決済代行）に保管され、Kinda はカード番号を持ちません。
        カード登録の画面にメールアドレスの欄が出ることがありますが、入力は不要です。
      </>
    ),
  },
  {
    q: '日程変更のときも課金されますか？',
    a: <>課金されません。同じご予約のまま日時だけが変わります。課金されるのは新しいご予約が確定したときだけです。</>,
  },
  {
    q: 'キャンセルや当日の不参加のときは返金されますか？',
    a: (
      <>
        原則として返金はありません。連絡先をお渡しした時点でご紹介は完了しているためです。
        天災などやむを得ない事情がある場合は運営事務局にご相談ください。
      </>
    ),
  },
  {
    q: '運営が認めた場合はどうなりますか？',
    a: (
      <>
        その送客料を、次のご予約1件分の送客料に充てます。次のご予約では課金されません。
        充てる期限はありません。ご予約が入るまでそのまま残ります。
      </>
    ),
  },
  {
    q: '充てる前に退会したらどうなりますか？',
    a: (
      <>
        残っている分を返金します。ご登録のクレジットカードへの返金が原則です。
        カードを解約されているなどで返金できないときは、相談所名義の銀行口座へお振り込みします。
        振込手数料は Kinda が負担します。
      </>
    ),
  },
  {
    q: '返金はどのくらいで明細に反映されますか？',
    a: <>カード会社によって違いますが、数日〜10日ほどです。締め日を過ぎていると翌月以降の明細でマイナスとして反映されることもあります。</>,
  },
]

export default function CounselorFaqPage() {
  return (
    <main className="kc-legal-page">
      <article className="kc-legal-article">
        <header className="kc-legal-header">
          <p className="kc-legal-eyebrow">faq</p>
          <h1 className="kc-legal-title">よくある質問（送客料・返金）</h1>
          <p className="kc-legal-meta">最終更新日：{LAST_UPDATED}</p>
          <p className="kc-legal-lead">
            送客料の課金と返金についてまとめました。決まりの正は
            <Link href="/terms" className="kc-legal-link">利用規約</Link>
            の第6条です。
          </p>
        </header>

        {FAQS.map((f) => (
          <section key={f.q} className="kc-legal-section">
            <h2 className="kc-legal-h2">{f.q}</h2>
            <p className="kc-legal-text">{f.a}</p>
          </section>
        ))}

        <section className="kc-legal-section">
          <h2 className="kc-legal-h2">お問い合わせ</h2>
          <p className="kc-legal-text">
            ほかに分からないことがあれば
            <Link href="mailto:hello@kinda.jp" className="kc-legal-link">hello@kinda.jp</Link>
            までご連絡ください。
          </p>
        </section>
      </article>
    </main>
  )
}
