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

function CategoryIcon({
  category,
  svgColor,
  size = 56,
}: {
  category: string;
  svgColor: string;
  size?: number;
}) {
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
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
        style={{
          background: "rgba(200,169,122,.12)",
          color: "var(--accent)",
          border: "1px solid rgba(200,169,122,.3)",
        }}
      >
        <span
          style={{ width: 5, height: 5, background: "var(--accent)", borderRadius: "50%", display: "inline-block", flexShrink: 0 }}
        />
        ふたりへ取材済み
      </span>
    );
  }
  if (badge === "agency") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
        style={{
          background: "rgba(107,143,191,.12)",
          color: "var(--blue)",
          border: "1px solid rgba(107,143,191,.3)",
        }}
      >
        <span
          style={{ width: 5, height: 5, background: "var(--blue)", borderRadius: "50%", display: "inline-block", flexShrink: 0 }}
        />
        相談所おすすめ
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(160,160,160,.1)",
        color: "var(--muted)",
        border: "1px solid rgba(160,160,160,.25)",
      }}
    >
      <span
        style={{ width: 5, height: 5, background: "var(--muted)", borderRadius: "50%", display: "inline-block", flexShrink: 0 }}
      />
      掲載店
    </span>
  );
}

function PersonAvatar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0">
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
        {/* ─── パンくずリスト ─── */}
        <div className="bg-pale border-b border-light">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-ink transition-colors">
              トップ
            </Link>
            <span>/</span>
            <Link href="/places" className="hover:text-ink transition-colors">
              お店を探す
            </Link>
            <span>/</span>
            <span className="text-ink">{place.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ─────────────────────────────────────────────────
                左カラム: 店舗カード（PC時スティッキー）
            ───────────────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-5">

                {/* 店舗カード */}
                <div className="bg-white rounded-2xl border border-light overflow-hidden">
                  {/* グラデーション＋アイコンエリア（カウンセラーのアバターに相当） */}
                  <div
                    className="aspect-square flex items-center justify-center"
                    style={{ background: place.gradient }}
                  >
                    <div
                      className="rounded-2xl flex items-center justify-center"
                      style={{
                        width: 96,
                        height: 96,
                        background: "rgba(255,255,255,.55)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <CategoryIcon
                        category={place.category}
                        svgColor={place.svgColor}
                        size={56}
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    {/* バッジ */}
                    <div className="mb-3">
                      <BadgeChip badge={place.badge} />
                    </div>

                    {/* 店舗名 */}
                    <h1
                      className="text-2xl text-ink mb-1"
                      style={{ fontFamily: "var(--font-mincho)" }}
                    >
                      {place.name}
                    </h1>
                    <p className="text-sm text-mid mb-1">{place.category}</p>
                    <p className="text-xs text-muted mb-4">{place.area}</p>

                    {/* 評価 */}
                    <div className="flex items-center gap-2 mb-5 pb-5 border-b border-light">
                      <StarRating rating={Math.round(avgRating)} size={16} />
                      <span className="text-lg font-medium text-ink">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted">
                        ({place.reviews.length}件)
                      </span>
                    </div>

                    {/* 数字 */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="text-center">
                        <p
                          className="text-base text-ink"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {place.priceRange.split("〜")[0]}〜
                        </p>
                        <p className="text-xs text-muted mt-0.5">価格帯</p>
                      </div>
                      <div className="text-center">
                        <p
                          className="text-base text-ink"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          {place.reviewCount}件
                        </p>
                        <p className="text-xs text-muted mt-0.5">口コミ</p>
                      </div>
                    </div>

                    {/* アクセス */}
                    <div className="flex items-center gap-2 text-sm text-mid mb-5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5S11.5 9.5 11.5 6c0-2.5-2-4.5-4.5-4.5z" />
                        <circle cx="7" cy="6" r="1.5" />
                      </svg>
                      {place.access}
                    </div>

                    {/* シーンタグ */}
                    <div className="flex flex-wrap gap-1.5">
                      {place.scenes.map((scene) => (
                        <span
                          key={scene}
                          className="text-xs px-2.5 py-1 rounded-full border text-accent"
                          style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
                        >
                          {scene}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* アクションカード */}
                <div className="bg-pale rounded-2xl border border-light p-5 space-y-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-center px-6 py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200"
                    style={{ boxShadow: "0 6px 20px rgba(200,169,122,0.3)" }}
                  >
                    お店のサイトを見る
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M6 2H2v10h10V8M8 2h4v4M6 8l5-5"
                        stroke="white"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <Link
                    href="/reviews/new"
                    className="block w-full text-center px-6 py-3.5 rounded-xl text-sm tracking-wide hover:opacity-80 transition-all duration-200"
                    style={{ border: "1.5px solid var(--light)", color: "var(--ink)" }}
                  >
                    口コミを書く
                  </Link>
                  <p className="text-xs text-muted text-center">
                    口コミはふたりへ経由で利用した方のみ投稿できます
                  </p>
                </div>

              </div>
            </aside>

            {/* ─────────────────────────────────────────────────
                右カラム: 詳細情報
            ───────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">

              {/* お店について */}
              <section>
                <h2
                  className="text-lg text-ink mb-4 pb-3 border-b border-light"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  お店について
                </h2>
                <div
                  className="bg-pale rounded-2xl p-6 border-l-4 text-sm text-mid leading-relaxed"
                  style={{ borderLeftColor: "var(--accent)" }}
                >
                  {place.description}
                </div>
              </section>

              {/* 基本情報 */}
              <section>
                <h2
                  className="text-lg text-ink mb-4 pb-3 border-b border-light"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  基本情報
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    { label: "エリア", value: place.area },
                    { label: "アクセス", value: place.access },
                    { label: "営業時間", value: place.hours },
                    { label: "定休日", value: place.holiday },
                    { label: "価格帯", value: place.priceRange },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wide text-muted">
                        {label}
                      </span>
                      <span className="text-sm text-ink">{value}</span>
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wide text-muted">
                      こんなシーンに
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {place.scenes.map((scene) => (
                        <span
                          key={scene}
                          className="text-xs px-2.5 py-1 rounded-full border text-accent"
                          style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
                        >
                          {scene}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 特徴・設備 */}
              <section>
                <h2
                  className="text-lg text-ink mb-4 pb-3 border-b border-light"
                  style={{ fontFamily: "var(--font-mincho)" }}
                >
                  特徴・設備
                </h2>
                <div className="flex flex-wrap gap-2">
                  {place.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs rounded-full border border-light text-mid"
                      style={{ padding: "5px 12px" }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </section>

              {/* 口コミ */}
              <section>
                <div className="flex items-end justify-between mb-4 pb-3 border-b border-light">
                  <h2
                    className="text-lg text-ink"
                    style={{ fontFamily: "var(--font-mincho)" }}
                  >
                    口コミ・評価
                  </h2>
                  <span className="text-xs text-muted">{place.reviews.length}件</span>
                </div>

                {/* 評価サマリー */}
                <div className="bg-pale rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center shrink-0">
                      <p
                        className="text-5xl text-ink leading-none mb-2"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {avgRating.toFixed(1)}
                      </p>
                      <StarRating rating={Math.round(avgRating)} size={16} />
                      <p className="text-xs text-muted mt-1">
                        {place.reviews.length}件の評価
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-4 pt-4 border-t border-light">
                    ※ 口コミはふたりへ経由で利用した方のみ投稿できます
                  </p>
                </div>

                {/* 口コミ一覧 */}
                <div className="space-y-4">
                  {place.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-2xl p-6 border border-light"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <PersonAvatar />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm font-medium text-ink">{review.user}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              <p className="text-xs text-muted">{review.date}</p>
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
                          <div className="mt-1">
                            <StarRating rating={review.rating} size={12} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-mid leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
