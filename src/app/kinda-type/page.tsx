import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

const STEPS = [
  {
    num: 1,
    title: "8つの質問に答える",
    desc: "感覚で選ぶだけ。1〜3分で終わります",
  },
  {
    num: 2,
    title: "自分のタイプがわかる",
    desc: "4つのタイプから1つ。あなたに合う担当者像が見えます",
  },
  {
    num: 3,
    title: "相性のいい担当者を紹介",
    desc: "そのまま予約までできます",
  },
];

export default function KindaTypeLandingPage() {
  return (
    <>
      <Header />
      <main className="ktl-page">
        <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kinda type" }]} />
        <div className="ktl-content">

          {/* ① ヒーロー */}
          <section className="ktl-hero">
            {/* 装飾エリア（ぴったり重なる円 = 相性メタファー） */}
            <div className="ktl-hero-deco" aria-hidden="true">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.5">
                <circle cx="32" cy="40" r="22" stroke="#A88858" strokeWidth="1.5" />
                <circle cx="48" cy="40" r="22" stroke="#A88858" strokeWidth="1.5" />
              </svg>
            </div>

            <h1 className="ktl-hero-title">
              これだ、と思える
              <br />
              担当者がいる。
            </h1>
            <p className="ktl-hero-sub">
              自分のタイプを、ちゃんと
              <br />
              見つけにいく。
            </p>

            {/* バッジ */}
            <div className="ktl-badge">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="var(--accent)" strokeWidth="1.2" />
                <path d="M5.5 3v2.5l1.5 1.5" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              会員登録なし · 1〜3分 · 無料
            </div>
          </section>

          {/* ② 価値訴求カード 2枚 */}
          <div className="ktl-cards">
            {/* 自分のタイプがわかる */}
            <div className="ktl-card ktl-card-gold">
              <div className="ktl-card-icon">
                {/* 鏡 / リフレクション SVG */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" stroke="#A88858" strokeWidth="1.4" />
                  <path d="M11 5v12M5 11h12" stroke="#A88858" strokeWidth="1.2" strokeLinecap="round" opacity=".4" />
                  <circle cx="11" cy="11" r="9" stroke="#A88858" strokeWidth="1" opacity=".5" />
                </svg>
              </div>
              <p className="ktl-card-text">
                自分のタイプが
                <br />
                わかる
              </p>
            </div>

            {/* ぴったりの担当者と出会える */}
            <div className="ktl-card ktl-card-sage">
              <div className="ktl-card-icon">
                {/* 重なる円（相性 / マッチング） SVG */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <circle cx="8" cy="11" r="5" stroke="#5A8A6A" strokeWidth="1.4" />
                  <circle cx="14" cy="11" r="5" stroke="#5A8A6A" strokeWidth="1.4" />
                </svg>
              </div>
              <p className="ktl-card-text">
                ぴったりの
                <br />
                担当者と出会える
              </p>
            </div>
          </div>

          {/* ③ 使い方ステップ */}
          <div className="ktl-steps">
            <p className="ktl-steps-eyebrow">HOW IT WORKS</p>
            {STEPS.map((step) => (
              <div key={step.num} className="ktl-step">
                <div className="ktl-step-num" aria-hidden="true">{step.num}</div>
                <div>
                  <p className="ktl-step-title">{step.title}</p>
                  <p className="ktl-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ④ CTA */}
          <div className="ktl-cta-wrap">
            <Link href="/kinda-type/quiz" className="ktl-cta">
              タイプを見つける →
            </Link>
          </div>
          <p className="ktl-cta-note">会員登録・ログイン不要です</p>

        </div>
      </main>
      <Footer />
    </>
  );
}
