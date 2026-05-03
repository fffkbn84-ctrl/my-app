import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import Footer from "@/components/layout/Footer";
import { places } from "@/lib/mock/places";
import type { Place } from "@/lib/mock/places";

/* ────────────────────────────────────────────────────────────
   サブコンポーネント
──────────────────────────────────────────────────────────── */

function StarRatingLight({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill={star <= rating ? "var(--accent)" : "var(--light)"}
        >
          <path d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z" />
        </svg>
      ))}
    </div>
  );
}

function CategoryIcon({
  category,
  svgColor,
  size = 52,
}: {
  category: string;
  svgColor: string;
  size?: number;
}) {
  const p = { width: size, height: size, viewBox: "0 0 52 52", fill: "none" as const };

  switch (category) {
    case "カフェ":
      return (
        <svg {...p}>
          <path d="M10 20h24l-2.5 18H12.5L10 20z" stroke={svgColor} strokeWidth="1.5"
            fill="rgba(200,169,122,.15)" strokeLinejoin="round" />
          <path d="M34 24h3a3.5 3.5 0 010 7h-3" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 15c0-2.5 3-2.5 3-5M22 15c0-2.5 3-2.5 3-5" stroke={svgColor}
            strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        </svg>
      );
    case "美容室":
      return (
        <svg {...p}>
          <circle cx="18" cy="18" r="7" stroke={svgColor} strokeWidth="1.5" fill="rgba(122,158,135,.15)" />
          <circle cx="18" cy="34" r="7" stroke={svgColor} strokeWidth="1.5" fill="rgba(122,158,135,.15)" />
          <path d="M23 21l14-8M23 31l14 8" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "ネイルサロン":
      return (
        <svg {...p}>
          <rect x="18" y="24" width="14" height="20" rx="3" stroke={svgColor} strokeWidth="1.5"
            fill="rgba(155,122,181,.15)" />
          <path d="M21 24v-7a4 4 0 018 0v7" stroke={svgColor} strokeWidth="1.5" />
          <path d="M21 32h8M21 37h8" stroke={svgColor} strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        </svg>
      );
    case "眉毛サロン":
      return (
        <svg {...p}>
          <circle cx="26" cy="26" r="14" stroke={svgColor} strokeWidth="1.5" fill="rgba(184,134,11,.1)" />
          <path d="M17 22c2-3 6-3 8-1" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M27 22c2-3 6-3 8-1" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="29" r="2" fill={svgColor} opacity=".4" />
          <circle cx="31" cy="29" r="2" fill={svgColor} opacity=".4" />
          <path d="M21 35c2 2 9 2 10 0" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
        </svg>
      );
    case "フォトスタジオ":
      return (
        <svg {...p}>
          <rect x="8" y="16" width="36" height="26" rx="3" stroke={svgColor} strokeWidth="1.5"
            fill="rgba(107,143,191,.15)" />
          <circle cx="26" cy="29" r="7" stroke={svgColor} strokeWidth="1.5" fill="none" />
          <path d="M19 16l3-5h8l3 5" stroke={svgColor} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="38" cy="23" r="2" fill={svgColor} opacity=".5" />
        </svg>
      );
    default: /* レストラン */
      return (
        <svg {...p}>
          <path d="M14 10v32M22 10c0 8-4 10-4 16h8c0-6-4-8-4-16z" stroke={svgColor}
            strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 10v10a4 4 0 008 0V10" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M36 20v22" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function BadgePill({ badge }: { badge: Place["badge"] }) {
  if (badge === "certified") {
    return (
      <span className="rt-certified inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full">
        Kinda ふたりへ取材済み
      </span>
    );
  }
  if (badge === "agency") {
    return (
      <span className="rt-agency inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full">
        相談所おすすめ
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
      style={{ background: "rgba(160,160,160,.1)", color: "var(--muted)", border: "1px solid rgba(160,160,160,.2)" }}
    >
      掲載店
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = places.find((p) => p.id === Number(id));
  if (!place) notFound();

  const avgRating =
    place.reviews.length > 0
      ? place.reviews.reduce((sum, r) => sum + r.rating, 0) / place.reviews.length
      : place.rating;

  return (
    <>
      <Header />

      <main className="pt-16">
        <SectionSubHeader sectionName="Kinda act" sectionRoot="/kinda-act" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda act", href: "/kinda-act" },
            { label: place.name },
          ]}
        />
        {/* ═══════════════════════════════════════════════════
            ヒーローストリップ（お店グラデーション背景）
        ═══════════════════════════════════════════════════ */}
        <div style={{ background: place.gradient, paddingTop: 48, paddingBottom: 0 }}>
          <div className="detail-hero">

            {/* 左: パンくず・バッジ・アイコン・店名・タグ・統計 */}
            <div>
              {/* パンくず */}
              <div className="d-breadcrumb" style={{ color: "rgba(0,0,0,.4)" }}>
                <Link href="/" style={{ color: "rgba(0,0,0,.4)" }}>トップ</Link>
                <span>/</span>
                <Link href="/kinda-act" style={{ color: "rgba(0,0,0,.4)" }}>
                  Kinda act<span style={{ marginLeft: 4, fontSize: "0.85em" }}>（実際に会う場所を選ぶ）</span>
                </Link>
                <span>/</span>
                <span style={{ color: "rgba(0,0,0,.65)" }}>{place.name}</span>
              </div>

              {/* バッジ */}
              <div style={{ marginBottom: 20 }}>
                <BadgePill badge={place.badge} />
              </div>

              {/* アイコン + 店名 */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                {/* クレイ円形アイコン */}
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.6)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow:
                      "inset 0 2px 0 rgba(255,255,255,.95), 0 6px 20px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08)",
                  }}
                >
                  <CategoryIcon category={place.category} svgColor={place.svgColor} size={44} />
                </div>
                <div>
                  <div className="d-name" style={{ color: "var(--black)" }}>{place.name}</div>
                  <div className="d-role" style={{ color: "rgba(0,0,0,.5)" }}>
                    {place.category} · {place.area}
                  </div>
                </div>
              </div>

              {/* 評価行 */}
              <div className="d-rating-row">
                <div className="d-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1.5l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.4l-3.6 2.1.7-4L2.2 5.7l4-.6z"
                        fill={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(0,0,0,.15)"}
                        stroke={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(0,0,0,.15)"}
                        strokeWidth=".5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </div>
                <span className="d-rating-num" style={{ color: "var(--black)" }}>
                  {avgRating.toFixed(1)}
                </span>
                <span className="d-rating-sep" style={{ background: "rgba(0,0,0,.15)" }} />
                <Link
                  href="#reviews"
                  className="d-review-badge"
                  style={{
                    background: "rgba(0,0,0,.06)",
                    border: "1px solid rgba(0,0,0,.1)",
                    color: "rgba(0,0,0,.5)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  aria-label="口コミセクションへ移動"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {place.reviews.length}件の口コミ
                </Link>
              </div>

              {/* シーンタグ — stage と重複する scene は除外 */}
              <div className="d-tags">
                <span
                  className="d-tag featured"
                  style={{
                    background: "rgba(200,169,122,.15)",
                    borderColor: "rgba(200,169,122,.4)",
                    color: "var(--accent)",
                  }}
                >
                  {place.stage}
                </span>
                {place.scenes
                  .filter((scene) => scene !== place.stage)
                  .map((scene) => (
                    <span
                      key={scene}
                      className="d-tag"
                      style={{ borderColor: "rgba(0,0,0,.15)", color: "rgba(0,0,0,.5)" }}
                    >
                      {scene}
                    </span>
                  ))}
              </div>

              {/* 統計 */}
              <div className="d-stats" style={{ borderTopColor: "rgba(0,0,0,.1)" }}>
                <div className="d-stat-item">
                  <div className="d-stat-num" style={{ color: "var(--black)" }}>
                    {place.reviewCount}
                  </div>
                  <div className="d-stat-label" style={{ color: "rgba(0,0,0,.4)" }}>口コミ件数</div>
                </div>
                <div className="d-stat-item">
                  <div className="d-stat-num" style={{ color: "var(--black)" }}>
                    {avgRating.toFixed(1)}
                  </div>
                  <div className="d-stat-label" style={{ color: "rgba(0,0,0,.4)" }}>平均評価</div>
                </div>
              </div>
            </div>

            {/* 右: アクションカード（PCのみ） */}
            <div className="d-book-card">
              <div className="d-book-card-title">このお店について</div>
              <div className="d-book-card-sub">{place.area} · {place.access}</div>

              <div className="d-price-row">
                <span className="d-price-label">価格帯</span>
                <span
                  className="d-price"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}
                >
                  {place.priceRange}
                </span>
              </div>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-book-main"
                style={{ marginBottom: 10 }}
              >
                お店のサイトを見る
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 2H2v10h10V8M8 2h4v4M6 8l5-5"
                    stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link
                href="/reviews/new"
                className="block w-full text-center rounded-xl text-sm tracking-wide hover:opacity-80 transition-opacity"
                style={{
                  padding: "14px 20px",
                  border: "1.5px solid var(--light)",
                  color: "var(--ink)",
                }}
              >
                口コミを書く
              </Link>
              <p className="d-book-note">お店を利用した方ならどなたでも口コミを投稿できます</p>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            コンテンツエリア — クレイ背景
        ═══════════════════════════════════════════════════ */}
        <div className="detail-body" style={{ background: "#f7f3f0" }}>
          <div className="wrap">
            <div className="detail-grid">

              {/* ── 左カラム: クレイカード群 ── */}
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>

                {/* お店について */}
                <div className="clay-card">
                  <h2 className="clay-sec-h">お店について</h2>
                  <div className="clay-desc-block">
                    {place.description}
                  </div>
                </div>

                {/* 基本情報 */}
                <div className="clay-card">
                  <h2 className="clay-sec-h">基本情報</h2>
                  <div className="clay-info-grid">
                    <div className="clay-info-item">
                      <div className="clay-info-key">エリア</div>
                      <div className="clay-info-val">{place.area}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key">アクセス</div>
                      <div className="clay-info-val">{place.access}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key">営業時間</div>
                      <div className="clay-info-val">{place.hours}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key">定休日</div>
                      <div className="clay-info-val">{place.holiday}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key">価格帯</div>
                      <div className="clay-info-val">{place.priceRange}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key">こんなシーンに</div>
                      <div className="clay-info-val">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                          {place.scenes.map((scene) => (
                            <span key={scene} className="clay-scene-tag">{scene}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 特徴・設備 */}
                <div className="clay-card">
                  <h2 className="clay-sec-h">特徴・設備</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {place.features.map((feature) => (
                      <span key={feature} className="clay-tag">{feature}</span>
                    ))}
                  </div>
                </div>

                {/* 口コミ */}
                <div className="clay-card" id="reviews">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 className="clay-sec-h" style={{ marginBottom: 0 }}>口コミ・評価</h2>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{place.reviews.length}件</span>
                  </div>

                  {/* 評価サマリー */}
                  <div className="clay-rating-summary">
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: 48,
                            color: "var(--ink)",
                            lineHeight: 1,
                            marginBottom: 8,
                          }}
                        >
                          {avgRating.toFixed(1)}
                        </p>
                        <StarRatingLight rating={Math.round(avgRating)} size={16} />
                        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                          {place.reviews.length}件の評価
                        </p>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginTop: 16,
                        paddingTop: 14,
                        borderTop: "1px solid rgba(180,155,135,.15)",
                      }}
                    >
                      ※ お店を利用した方ならどなたでも口コミを投稿できます
                    </p>
                  </div>

                  {/* 口コミ一覧 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {place.reviews.map((review) => (
                      <div key={review.id} className="clay-rv-card">
                        <div className="rv-meta">
                          <span className="rv-date">{review.date}</span>
                          <span className="rv-verified">
                            <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor">
                              <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 00-.7.7l2.1 2.1a.5.5 0 00.7 0l3.2-3.2a.5.5 0 00-.7-.6z" />
                            </svg>
                            利用済み口コミ
                          </span>
                        </div>
                        <div className="rv-stars-row">
                          <StarRatingLight rating={review.rating} size={17} />
                          <span className="rv-rating-num">{review.rating}.0</span>
                        </div>
                        <p className="rv-text">{review.text}</p>
                        <div className="rv-footer">
                          <span className="rv-author">{review.user}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── 右カラム: スティッキーサイドバー ── */}
              <aside style={{ alignSelf: "start", position: "sticky", top: "72px" }}>

                {/* アクションカード — クレイ */}
                <div className="clay-sidebar-card" style={{ marginBottom: 16 }}>
                  <div style={{ padding: "24px 24px 0" }}>
                    <p className="clay-info-key" style={{ marginBottom: 6 }}>価格帯</p>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 24,
                        color: "var(--ink)",
                        marginBottom: 20,
                      }}
                    >
                      {place.priceRange}
                    </p>
                  </div>
                  <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-book-main"
                    >
                      お店のサイトを見る
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M6 2H2v10h10V8M8 2h4v4M6 8l5-5"
                          stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <Link
                      href="/reviews/new"
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "14px 20px",
                        borderRadius: 14,
                        border: "1.5px solid rgba(180,155,135,.3)",
                        color: "var(--ink)",
                        fontSize: 13,
                        letterSpacing: ".04em",
                        background: "linear-gradient(145deg, #fdf9f5, #f5f0ea)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,.85)",
                        transition: "opacity .2s",
                      }}
                    >
                      口コミを書く
                    </Link>
                    <p className="cta-book-main-note">
                      お店を利用した方ならどなたでも口コミを投稿できます
                    </p>
                  </div>
                </div>

                {/* Google Maps（営業時間/定休日/アクセスは上のメインカラムに記載済みのため、ここは地図に置換） */}
                <div
                  className="clay-card"
                  style={{ padding: 0, overflow: "hidden", marginTop: 16 }}
                >
                  <iframe
                    title={`${place.name} の地図`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${place.name} ${place.access}`,
                    )}&z=15&output=embed`}
                    width="100%"
                    height="280"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div
                    style={{
                      padding: "10px 14px",
                      fontSize: 11,
                      color: "var(--mid)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {place.access}
                  </div>
                </div>

              </aside>

            </div>
          </div>
        </div>
      </main>

      {/* モバイル用固定CTA — 右端浮遊ボタン */}
      <div className="cta-mobile-bar">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-mobile-btn"
        >
          <span>サイトを</span>
          <span>見る</span>
        </a>
      </div>

      <Footer />
    </>
  );
}
