import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPublishedVoices, VOICE_FALLBACK_GRADIENT } from "@/lib/mock/voices";

export default function KindaVoicesPage() {
  const voices = getPublishedVoices();

  return (
    <div className="ks-page">
      <Header />

      <main style={{ background: "#FBFCF8" }}>
        {/* ─── イントロ（story のイントロと同じ ks-intro 意匠） ─── */}
        <section className="ks-intro" style={{ paddingTop: 96 }}>
          <div className="ks-intro-inner">
            <div className="ks-intro-eyebrow">Kinda voices</div>
            <div className="ks-intro-divider" />
            <h1 className="ks-intro-title">伴走する人に、先に会っておく</h1>
            <div className="ks-intro-divider" />
            <p className="ks-intro-text">
              結婚相談所を選ぶとき、最後に隣を歩くのはひとりのカウンセラーです。
              Kinda voices は、そのカウンセラー個人に取材したインタビュー。
              どんな人が、どんな思いで伴走しているのかを、入会を決める前に読めるように。
            </p>
          </div>
        </section>

        {/* ─── 一覧 or 準備中 ─── */}
        {voices.length === 0 ? (
          <section style={{ textAlign: "center", padding: "24px 24px 72px" }}>
            <p style={{ fontSize: 14, color: "var(--mid)", lineHeight: 2 }}>
              最初の取材記事を、いま準備しています。
              <br />
              公開までのあいだは、実際に会った人の口コミからカウンセラーを知ることができます。
            </p>
            <div style={{ marginTop: 24 }}>
              <Link href="/kinda-talk" className="ks-cta-btn ks-cta-btn-primary">
                カウンセラーを見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
            </div>
          </section>
        ) : (
          <section className="ks-related" style={{ paddingTop: 8 }}>
            <div className="ks-related-inner">
              <div className="ks-related-grid">
                {voices.map((v) => (
                  <Link key={v.slug} href={`/kinda-voices/${v.slug}`} className="ks-card">
                    <div
                      style={{
                        height: 120,
                        borderRadius: 12,
                        marginBottom: 12,
                        background: v.heroImage
                          ? `url('${v.heroImage}') center/cover no-repeat`
                          : VOICE_FALLBACK_GRADIENT,
                      }}
                      aria-hidden
                    />
                    <div className="ks-card-meta">
                      <span className="ks-card-stage">{v.area}</span>
                      <span className="ks-card-period">{v.agencyName}</span>
                    </div>
                    <p className="ks-card-quote">{v.title}</p>
                    <div className="ks-card-foot">
                      <span className="ks-card-author">— {v.counselorName} さん</span>
                      <span className="ks-card-link">
                        読む
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2 7h10M7 2l5 5-5 5" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="ks-cta">
          <div className="ks-cta-inner">
            <p className="ks-cta-eyebrow">next step</p>
            <h2 className="ks-cta-title">話してみたい人を、口コミから探す</h2>
            <p className="ks-cta-text">
              記事で気になった人がいてもいなくても。
              <br />
              実際に面談した人の口コミから、カウンセラー個人を知ることができます。
            </p>
            <div className="ks-cta-actions">
              <Link href="/kinda-talk" className="ks-cta-btn ks-cta-btn-primary">
                カウンセラーを見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
              <Link href="/kinda-type" className="ks-cta-btn ks-cta-btn-ghost">
                合うタイプを知る（1〜3分）
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
