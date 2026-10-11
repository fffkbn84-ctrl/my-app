import Image from "next/image";
import KindaTypeBadge from "@/components/kinda-talk/KindaTypeBadge";
import { SAMPLE_COUNSELOR } from "./sampleCounselor";

/**
 * /for-counselors の「掲載イメージ」。スマホ枠の中に、Kinda talk のリール画面と
 * カウンセラーページの上部を再現する（見た目だけ・操作はできない）。
 * 架空のカウンセラーで作る。評価・口コミ数は見本でも出さない（2026-08 の決定）。
 */
export default function ListingPreview() {
  const c = SAMPLE_COUNSELOR;
  return (
    <figure className="fc-preview" aria-label="カウンセラーページの掲載イメージ（架空のカウンセラー）">
      <div className="fc-preview-phones">
        {/* 1. リール画面 */}
        <div className="fc-preview-item">
          <div className="fc-phone" aria-hidden="true">
            <div className="fc-phone-screen fc-reel">
              <Image
                src="/images/for-counselors/sample-counselor-reel.webp"
                alt=""
                fill
                sizes="(min-width: 720px) 260px, 70vw"
                className="fc-reel-img"
              />
              <div className="fc-reel-overlay" />
              <div className="fc-reel-progress">
                <span className="is-current" />
                <span />
                <span />
              </div>
              <span className="fc-reel-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
              <div className="fc-reel-actions">
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </span>
              </div>
              <div className="fc-reel-bottom">
                <KindaTypeBadge type={c.diagnosisType} />
                <p className="fc-reel-catch">{c.catchphrase}</p>
                <p className="fc-reel-name">{c.name}</p>
                <p className="fc-reel-meta">
                  {c.agencyName} · {c.area}
                </p>
                <div className="fc-reel-cta">
                  <span className="is-secondary">プロフィールを見る</span>
                  <span className="is-primary">予約する</span>
                </div>
              </div>
            </div>
          </div>
          <figcaption className="fc-preview-cap">
            <span className="fc-preview-cap-num">1</span>
            Kinda talk のリール。利用者が最初に目にする画面です。
          </figcaption>
        </div>

        {/* 2. カウンセラーページ */}
        <div className="fc-preview-item">
          <div className="fc-phone" aria-hidden="true">
            <div className="fc-phone-screen fc-detail">
              <div className="fc-detail-hero">
                <Image
                  src="/images/for-counselors/sample-counselor-room.webp"
                  alt=""
                  fill
                  sizes="(min-width: 720px) 260px, 70vw"
                  className="fc-detail-hero-img"
                />
              </div>
              <div className="fc-detail-head">
                <div className="fc-detail-avatar">
                  <Image
                    src="/images/for-counselors/sample-counselor-reel.webp"
                    alt=""
                    fill
                    sizes="56px"
                    className="fc-detail-avatar-img"
                  />
                </div>
                <div>
                  <p className="fc-detail-name">{c.name}</p>
                  <p className="fc-detail-role">
                    {c.agencyName} · {c.area}
                  </p>
                </div>
              </div>
              <div className="fc-detail-tags">
                {c.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="fc-detail-book">初回面談を予約する</div>
              <p className="fc-detail-h">プロフィール</p>
              <p className="fc-detail-text">{c.profile}</p>
              <p className="fc-detail-h">メッセージ</p>
              <p className="fc-detail-quote">&ldquo;{c.message}&rdquo;</p>
            </div>
          </div>
          <figcaption className="fc-preview-cap">
            <span className="fc-preview-cap-num">2</span>
            カウンセラーページ。経歴・考え方・写真はご自身で編集できます。
          </figcaption>
        </div>
      </div>
      <p className="fc-preview-note">掲載イメージ・架空のカウンセラーです。</p>
    </figure>
  );
}
