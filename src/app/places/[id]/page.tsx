import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { places } from "@/lib/mock/places";
import type { Place } from "@/lib/mock/places";

/* ────────────────────────────────────────────────────────────
   サブコンポーネント
──────────────────────────────────────────────────────────── */

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
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

function CategoryIcon({ category, svgColor, size = 64 }: { category: string; svgColor: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 52 52",
    fill: "none" as const,
  };

  switch (category) {
    case "カフェ":
      return (
        <svg {...props}>
          <path
            d="M10 20h24l-2.5 18H12.5L10 20z"
            stroke={svgColor}
            strokeWidth="1.5"
            fill="rgba(200,169,122,.1)"
            strokeLinejoin="round"
          />
          <path
            d="M34 24h3a3.5 3.5 0 010 7h-3"
            stroke={svgColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 15c0-2.5 3-2.5 3-5M22 15c0-2.5 3-2.5 3-5"
            stroke={svgColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>
      );
    case "美容室":
      return (
        <svg {...props}>
          <circle cx="18" cy="18" r="7" stroke={svgColor} strokeWidth="1.5" fill="rgba(122,158,135,.1)" />
          <circle cx="18" cy="34" r="7" stroke={svgColor} strokeWidth="1.5" fill="rgba(122,158,135,.1)" />
          <path d="M23 21l14-8M23 31l14 8" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "ネイルサロン":
      return (
        <svg {...props}>
          <rect x="18" y="24" width="14" height="20" rx="3" stroke={svgColor} strokeWidth="1.5" fill="rgba(155,122,181,.1)" />
          <path d="M21 24v-7a4 4 0 018 0v7" stroke={svgColor} strokeWidth="1.5" />
          <path d="M21 32h8M21 37h8" stroke={svgColor} strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        </svg>
      );
    case "眉毛サロン":
      return (
        <svg {...props}>
          <circle cx="26" cy="26" r="14" stroke={svgColor} strokeWidth="1.5" fill="rgba(184,134,11,.08)" />
          <path d="M17 22c2-3 6-3 8-1" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M27 22c2-3 6-3 8-1" stroke={svgColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="29" r="2" fill={svgColor} opacity=".4" />
          <circle cx="31" cy="29" r="2" fill={svgColor} opacity=".4" />
          <path d="M21 35c2 2 9 2 10 0" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
        </svg>
      );
    case "フォトスタジオ":
      return (
        <svg {...props}>
          <rect x="8" y="16" width="36" height="26" rx="3" stroke={svgColor} strokeWidth="1.5" fill="rgba(107,143,191,.1)" />
          <circle cx="26" cy="29" r="7" stroke={svgColor} strokeWidth="1.5" fill="none" />
          <path d="M19 16l3-5h8l3 5" stroke={svgColor} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="38" cy="23" r="2" fill={svgColor} opacity=".5" />
        </svg>
      );
    case "レストラン":
    default:
      return (
        <svg {...props}>
          <path d="M14 10v32M22 10c0 8-4 10-4 16h8c0-6-4-8-4-16z" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 10v10a4 4 0 008 0V10" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M36 20v22" stroke={svgColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function BadgeChip({ badge }: { badge: Place["badge"] }) {
  if (badge === "certified") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(200,169,122,.12)",
          color: "var(--accent)",
          border: "1px solid rgba(200,169,122,.3)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <span
          className="rounded-full shrink-0"
          style={{ width: 5, height: 5, background: "var(--accent)", display: "inline-block" }}
        />
        ふたりへ取材済み
      </span>
    );
  }
  if (badge === "agency") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(107,143,191,.12)",
          color: "var(--blue)",
          border: "1px solid rgba(107,143,191,.3)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <span
          className="rounded-full shrink-0"
          style={{ width: 5, height: 5, background: "var(--blue)", display: "inline-block" }}
        />
        相談所おすすめ
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(160,160,160,.1)",
        color: "var(--muted)",
        border: "1px solid rgba(160,160,160,.25)",
      }}
    >
      <span
        className="rounded-full shrink-0"
        style={{ width: 5, height: 5, background: "var(--muted)", display: "inline-block" }}
      />
      掲載店
    </span>
  );
}

function PersonAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="var(--pale)" />
      <circle cx="18" cy="14" r="6" stroke="var(--muted)" strokeWidth="1.4" fill="none" />
      <path
        d="M6 30c0-6.6 5.4-12 12-12s12 5.4 12 12"
        stroke="var(--muted)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: "var(--ink)" }}>
        {value}
      </span>
    </div>
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
        {/* ─── ヒーローエリア ─── */}
        <div style={{ background: place.gradient }}>
          {/* パンくず */}
          <div className="max-w-6xl mx-auto px-6 pt-6 pb-0">
            <div className="flex items-center gap-1.5 flex-wrap" style={{ fontSize: 11, color: "rgba(0,0,0,.45)" }}>
              <Link href="/" className="hover:opacity-70 transition-opacity">ふたりへ</Link>
              <span>/</span>
              <Link href="/places" className="hover:opacity-70 transition-opacity">お店を探す</Link>
              <span>/</span>
              <span style={{ color: "rgba(0,0,0,.65)" }}>{place.name}</span>
            </div>
          </div>

          {/* ヒーロー本体 */}
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center text-center gap-5">
            {/* バッジ */}
            <BadgeChip badge={place.badge} />

            {/* カテゴリSVGアイコン */}
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: 96,
                height: 96,
                background: "rgba(255,255,255,.55)",
                backdropFilter: "blur(4px)",
              }}
            >
              <CategoryIcon category={place.category} svgColor={place.svgColor} size={56} />
            </div>

            {/* お店名 */}
            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(24px, 4vw, 44px)",
                color: "var(--black)",
                lineHeight: 1.25,
              }}
            >
              {place.name}
            </h1>

            {/* カテゴリ・エリア・シーン */}
            <div className="flex flex-wrap justify-center gap-2">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,.08)", color: "var(--ink)" }}
              >
                {place.category}
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,.08)", color: "var(--ink)" }}
              >
                {place.area}
              </span>
              {place.scenes.map((scene) => (
                <span
                  key={scene}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(200,169,122,.15)",
                    color: "var(--accent)",
                    border: "1px solid rgba(200,169,122,.25)",
                  }}
                >
                  {scene}
                </span>
              ))}
            </div>

            {/* 評価・口コミ件数 */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p
                  className="leading-none mb-1"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--black)" }}
                >
                  {avgRating.toFixed(1)}
                </p>
                <StarRating rating={Math.round(avgRating)} size={13} />
              </div>
              <div
                className="w-px self-stretch"
                style={{ background: "rgba(0,0,0,.15)" }}
              />
              <div className="text-center">
                <p
                  className="leading-none mb-1"
                  style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--black)" }}
                >
                  {place.reviewCount}
                </p>
                <p className="text-xs" style={{ color: "rgba(0,0,0,.5)" }}>口コミ</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2カラムレイアウト ─── */}
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div
            className="flex flex-col gap-10"
            style={{ alignItems: "flex-start" }}
          >
            {/* ラッパー: PC時はflex-row */}
            <div className="w-full flex flex-col lg:flex-row gap-10 items-start">

              {/* ─── 左カラム: メインコンテンツ ─── */}
              <div className="flex-1 min-w-0 space-y-10">

                {/* ① 基本情報グリッド */}
                <section>
                  <h2
                    className="text-lg pb-3 mb-5 border-b border-light"
                    style={{ fontFamily: "var(--font-mincho)", color: "var(--ink)" }}
                  >
                    基本情報
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <InfoRow label="エリア" value={place.area} />
                    <InfoRow label="アクセス" value={place.access} />
                    <InfoRow label="営業時間" value={place.hours} />
                    <InfoRow label="定休日" value={place.holiday} />
                    <InfoRow label="価格帯" value={place.priceRange} />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                        こんなシーンに
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {place.scenes.map((scene) => (
                          <span
                            key={scene}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              background: "rgba(200,169,122,.1)",
                              color: "var(--accent)",
                              border: "1px solid rgba(200,169,122,.25)",
                            }}
                          >
                            {scene}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ② 特徴タグ */}
                <section>
                  <h2
                    className="text-lg pb-3 mb-5 border-b border-light"
                    style={{ fontFamily: "var(--font-mincho)", color: "var(--ink)" }}
                  >
                    特徴・設備
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {place.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs rounded-full"
                        style={{
                          border: "1px solid var(--light)",
                          color: "var(--mid)",
                          padding: "5px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </section>

                {/* ③ お店からのメッセージ */}
                <section>
                  <h2
                    className="text-lg pb-3 mb-5 border-b border-light"
                    style={{ fontFamily: "var(--font-mincho)", color: "var(--ink)" }}
                  >
                    お店について
                  </h2>
                  <div
                    className="rounded-2xl p-6 text-sm leading-relaxed"
                    style={{
                      background: "var(--pale)",
                      borderLeft: "3px solid var(--accent)",
                      color: "var(--mid)",
                    }}
                  >
                    {place.description}
                  </div>
                </section>

                {/* ④ 口コミセクション */}
                <section>
                  <div className="flex items-end justify-between pb-3 mb-5 border-b border-light">
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-0.5"
                        style={{ color: "var(--muted)" }}
                      >
                        reviews
                      </p>
                      <h2
                        className="text-lg"
                        style={{ fontFamily: "var(--font-mincho)", color: "var(--ink)" }}
                      >
                        口コミ・評価
                      </h2>
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {place.reviews.length}件
                    </span>
                  </div>

                  {/* 口コミスコアカード */}
                  <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--pale)" }}>
                    <div className="flex items-center gap-6">
                      <div className="text-center shrink-0">
                        <p
                          className="leading-none mb-2"
                          style={{ fontFamily: "var(--font-serif)", fontSize: 48, color: "var(--ink)" }}
                        >
                          {avgRating.toFixed(1)}
                        </p>
                        <StarRating rating={Math.round(avgRating)} size={16} />
                        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                          {place.reviews.length}件の評価
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-xs mt-4 pt-4"
                      style={{
                        color: "var(--muted)",
                        borderTop: "1px solid var(--light)",
                      }}
                    >
                      ※ 口コミはふたりへ経由で利用した方のみ投稿できます
                    </p>
                  </div>

                  {/* 口コミ一覧 */}
                  <div className="space-y-4">
                    {place.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl p-6"
                        style={{
                          background: "white",
                          border: "1px solid var(--light)",
                        }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <PersonAvatar />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                                {review.user}
                              </p>
                              <p className="text-xs" style={{ color: "var(--muted)" }}>
                                {review.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} size={12} />
                              <span
                                className="inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5"
                                style={{
                                  background: "rgba(122,158,135,.1)",
                                  color: "var(--green)",
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                  <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 00-.7.7l2.1 2.1a.5.5 0 00.7 0l3.2-3.2a.5.5 0 00-.7-.6z" />
                                </svg>
                                利用済み
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--mid)" }}>
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* ─── 右カラム: スティッキーサイドバー ─── */}
              <aside className="w-full lg:w-[340px] shrink-0">
                <div className="lg:sticky space-y-4" style={{ top: 72 }}>
                  {/* ① お店情報カード */}
                  <div
                    className="rounded-2xl space-y-5"
                    style={{
                      padding: 28,
                      background: "white",
                      border: "1px solid var(--light)",
                    }}
                  >
                    {/* 価格帯 */}
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>
                        価格帯
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 24,
                          color: "var(--ink)",
                          lineHeight: 1.2,
                        }}
                      >
                        {place.priceRange}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* お店のサイトを見るボタン */}
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full rounded-xl text-sm tracking-wide transition-all duration-200 hover:opacity-90"
                        style={{
                          padding: "14px 24px",
                          background: "var(--accent)",
                          color: "white",
                          boxShadow: "0 6px 20px rgba(200,169,122,0.3)",
                        }}
                      >
                        お店のサイトを見る
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M6 2H2v10h10V8M8 2h4v4M6 8l5-5"
                            stroke="white"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>

                      {/* 口コミを書くボタン */}
                      <Link
                        href="/reviews/new"
                        className="flex items-center justify-center w-full rounded-xl text-sm tracking-wide transition-all duration-200 hover:opacity-80"
                        style={{
                          padding: "14px 24px",
                          background: "transparent",
                          color: "var(--ink)",
                          border: "1.5px solid var(--light)",
                        }}
                      >
                        口コミを書く
                      </Link>
                    </div>

                    {/* 注記 */}
                    <p
                      className="text-center"
                      style={{ fontSize: 11, color: "var(--muted)" }}
                    >
                      口コミはふたりへ経由で利用した方のみ投稿できます
                    </p>
                  </div>

                  {/* ② 基本情報ミニカード */}
                  <div
                    className="rounded-xl space-y-3.5"
                    style={{
                      background: "var(--pale)",
                      padding: 20,
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" className="mt-0.5 shrink-0">
                        <circle cx="7" cy="7" r="5.5" />
                        <path d="M7 4v3.5l2 1.5" />
                      </svg>
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>営業時間</p>
                        <p className="text-xs" style={{ color: "var(--ink)" }}>{place.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" className="mt-0.5 shrink-0">
                        <rect x="2" y="3" width="10" height="9" rx="1.5" />
                        <path d="M5 2v2M9 2v2M2 7h10" />
                      </svg>
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>定休日</p>
                        <p className="text-xs" style={{ color: "var(--ink)" }}>{place.holiday}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" className="mt-0.5 shrink-0">
                        <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5S11.5 9.5 11.5 6c0-2.5-2-4.5-4.5-4.5z" />
                        <circle cx="7" cy="6" r="1.5" />
                      </svg>
                      <div>
                        <p className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>アクセス</p>
                        <p className="text-xs" style={{ color: "var(--ink)" }}>{place.access}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (min-width: 1024px) {
          .place-sidebar-sticky {
            position: sticky;
            top: 72px;
          }
          .place-layout-right {
            width: 340px;
          }
        }
      `}</style>
    </>
  );
}
