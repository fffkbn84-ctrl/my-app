import Link from "next/link";
import Image from "next/image";
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
            {/* 装飾画像：4つの椅子（4タイプの暗喩） */}
            <div className="ktl-hero-img" aria-hidden="true">
              <Image
                src="/images/kinda-type-hero.webp"
                alt=""
                fill
                priority
                sizes="(max-width: 480px) 100vw, 480px"
                style={{ objectFit: "cover" }}
              />
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

          {/* ② できることリスト（カード風 = タップできそう問題を回避） */}
          <ul className="ktl-points">
            <li className="ktl-point">
              <span className="ktl-point-icon ktl-point-icon-gold" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1" opacity=".5" />
                </svg>
              </span>
              自分のタイプがわかる
            </li>
            <li className="ktl-point">
              <span className="ktl-point-icon ktl-point-icon-sage" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                  <circle cx="8" cy="11" r="5" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="14" cy="11" r="5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
              ぴったりの担当者と出会える
            </li>
          </ul>

          {/* ③ 使い方ステップ（カードではなく軽量縦リスト） */}
          <div className="ktl-steps">
            <p className="ktl-steps-eyebrow">HOW IT WORKS</p>
            <ol className="ktl-step-list">
              {STEPS.map((step) => (
                <li key={step.num} className="ktl-step-row">
                  <span className="ktl-step-num-plain" aria-hidden="true">
                    {String(step.num).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="ktl-step-title">{step.title}</p>
                    <p className="ktl-step-desc">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
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
