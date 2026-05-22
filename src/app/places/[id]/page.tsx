import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import Footer from "@/components/layout/Footer";
import InfoTooltip from "@/components/ui/InfoTooltip";
import {
  PlacePriceTooltipContent,
  PlaceHoursTooltipContent,
} from "@/lib/policyMessages";
import { getShopById, type ShopDetail } from "@/lib/data";
import type { PlaceReview, Place } from "@/lib/mock/places";

/* ────────────────────────────────────────────────────────────
   Supabase ShopDetail → Place 型互換オブジェクトに変換
   F-3 (2026-05-21): mock places.ts を廃止し Supabase 一本化したが、
   既存 UI コンポーネントが Place 型に依存しているため
   shape adapter として変換する。
──────────────────────────────────────────────────────────── */
const THUMB_VARIANT_GRADIENTS: Record<string, string> = {
  cafe: "linear-gradient(135deg,#F5E8D8,#EDD8C0)",
  lounge: "linear-gradient(135deg,#E8E0D4,#D8CCB8)",
  hair: "linear-gradient(135deg,#E8DCEA,#D4C0DC)",
  nail: "linear-gradient(135deg,#FCE8E5,#F0D0CC)",
  brow: "linear-gradient(135deg,#F0E5D6,#E0D0BC)",
  "photo-studio": "linear-gradient(135deg,#E8F0EC,#C8E0D4)",
  esthetic: "linear-gradient(135deg,#F4E5E1,#E8C8C5)",
};
const THUMB_VARIANT_SVG_COLORS: Record<string, string> = {
  cafe: "#C8A97A",
  lounge: "#9B8772",
  hair: "#9B7AB5",
  nail: "#C89090",
  brow: "#B0A090",
  "photo-studio": "#7AC8A9",
  esthetic: "#C49890",
};

function buildPlaceFromShop(shop: ShopDetail): Place & { reviews: PlaceReview[] } {
  return {
    // Supabase の id は UUID 文字列だが、Place 型は number。
    // UI 側で id は文字列比較しないので、表示用に Number 変換を避けて 0 を入れる。
    // /places/[id] への URL は string UUID として動く（Next.js の [id] route）。
    id: 0,
    name: shop.name,
    category: shop.categoryLabel || "カフェ",
    stage: shop.stage,
    area: shop.location,
    badge: shop.badgeType,
    gradient:
      THUMB_VARIANT_GRADIENTS[shop.thumbVariant] ?? THUMB_VARIANT_GRADIENTS.cafe,
    svgColor:
      THUMB_VARIANT_SVG_COLORS[shop.thumbVariant] ?? THUMB_VARIANT_SVG_COLORS.cafe,
    rating: shop.rating,
    reviewCount: shop.reviewCount,
    priceRange: shop.priceRange ?? "-",
    hours: shop.hours ?? "営業時間はお店にお問合せください",
    holiday: shop.holiday ?? "-",
    access: shop.access ?? "-",
    description: shop.description,
    features: shop.features,
    scenes: shop.scenes ?? [],
    // Supabase shop_reviews テーブル未実装のため空配列を返す。
    // 将来的に shop_reviews を作る or reviews テーブルに place_id 追加で対応。
    reviews: [],
  };
}

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

/* ────────────────────────────────────────────────────────────
   SNS 予約導線
   booking_url > instagram_url > other_social_url の優先順で
   メイン CTA を出し、残りはサブアイコンとして並べる。
──────────────────────────────────────────────────────────── */
type SnsLink = {
  kind: "booking" | "instagram" | "other";
  url: string;
  primaryLabel: string;
  iconAriaLabel: string;
};

function pickSnsLinks(shop: ShopDetail): { primary: SnsLink | null; subs: SnsLink[] } {
  const list: SnsLink[] = [];
  if (shop.bookingUrl)
    list.push({
      kind: "booking",
      url: shop.bookingUrl,
      primaryLabel: "予約サイトを見る",
      iconAriaLabel: "予約サイト",
    });
  if (shop.instagramUrl)
    list.push({
      kind: "instagram",
      url: shop.instagramUrl,
      primaryLabel: "Instagram を見る",
      iconAriaLabel: "Instagram",
    });
  if (shop.otherSocialUrl)
    list.push({
      kind: "other",
      url: shop.otherSocialUrl,
      primaryLabel: "公式サイトを見る",
      iconAriaLabel: "公式サイト",
    });
  return { primary: list[0] ?? null, subs: list.slice(1) };
}

function SnsIcon({ kind }: { kind: SnsLink["kind"] }) {
  if (kind === "instagram") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "booking") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 9h18M8 3v4M16 3v4M7 13h4M7 17h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
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

  // F-3 (2026-05-21): Supabase shops 一本化。mock places.ts は廃止。
  const shop = await getShopById(id);
  if (!shop) notFound();
  const place = buildPlaceFromShop(shop);

  const avgRating =
    place.reviews.length > 0
      ? place.reviews.reduce((sum, r) => sum + r.rating, 0) / place.reviews.length
      : place.rating;

  // L-2 (2026-05-22): 予約・SNS 導線
  const { primary: primarySns, subs: subSns } = pickSnsLinks(shop);

  // L-1 (2026-05-22): photo_url + gallery
  const galleryImages: { url: string; alt: string; caption: string | null }[] = [
    ...(shop.photoUrl
      ? [{ url: shop.photoUrl, alt: shop.name, caption: null as string | null }]
      : []),
    ...shop.gallery.map((g, i) => ({
      url: g.mediaUrl,
      alt: g.altText ?? `${shop.name} の写真 ${i + 1}`,
      caption: g.caption,
    })),
  ];

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
            コンパクトヘッダー — グラデヒーロー廃止
            ギャラリーに目が行くようテキストのみシンプルに
        ═══════════════════════════════════════════════════ */}
        <div style={{ background: "var(--white)", paddingTop: 16, paddingBottom: 16 }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* バッジ + ステージタグ */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <BadgePill badge={place.badge} />
              <span
                className="d-tag featured"
                style={{
                  background: "rgba(200,169,122,.12)",
                  borderColor: "rgba(200,169,122,.35)",
                  color: "var(--accent)",
                  fontSize: 11,
                }}
              >
                {place.stage}
              </span>
            </div>

            {/* 店名 */}
            <h1
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "clamp(22px, 4.5vw, 30px)",
                fontWeight: 500,
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.35,
              }}
            >
              {place.name}
            </h1>

            {/* カテゴリ・エリア */}
            <p
              style={{
                fontSize: 13,
                color: "var(--mid)",
                margin: 0,
              }}
            >
              {place.category} · {place.area}
            </p>

            {/* 評価 + 口コミリンク */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.5l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.4l-3.6 2.1.7-4L2.2 5.7l4-.6z"
                      fill={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(0,0,0,.12)"}
                      stroke={star <= Math.round(avgRating) ? "var(--accent)" : "rgba(0,0,0,.12)"}
                      strokeWidth=".5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--ink)", marginLeft: 6 }}>
                  {avgRating.toFixed(1)}
                </span>
              </div>
              <Link
                href="#reviews"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--mid)",
                  textDecoration: "none",
                  padding: "4px 10px",
                  borderRadius: 14,
                  background: "rgba(0,0,0,.04)",
                  border: "1px solid rgba(0,0,0,.06)",
                }}
                aria-label="口コミセクションへ移動"
              >
                <svg
                  width="11"
                  height="11"
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
                {place.reviewCount}件の口コミ
              </Link>
            </div>

            {/* 他のシーンタグ（stage と重複しないもの） */}
            {place.scenes.filter((s) => s !== place.stage).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {place.scenes
                  .filter((scene) => scene !== place.stage)
                  .map((scene) => (
                    <span
                      key={scene}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 10px",
                        borderRadius: 14,
                        border: "1px solid rgba(0,0,0,.1)",
                        color: "var(--mid)",
                        fontSize: 11,
                      }}
                    >
                      {scene}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            ギャラリー — ヘッダー直下に prominent 表示
            横スクロール（多い時は自然にスワイプ可）
        ═══════════════════════════════════════════════════ */}
        {galleryImages.length > 0 && (
          <section
            aria-label={`${place.name} の写真`}
            style={{ background: "var(--white)", paddingBottom: 16 }}
          >
            <div
              className="places-gallery-scroll"
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                padding: "0 16px 8px",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {galleryImages.map((g, i) => (
                <figure
                  key={i}
                  style={{
                    margin: 0,
                    flexShrink: 0,
                    width: "min(78vw, 320px)",
                    scrollSnapAlign: "start",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.url}
                    alt={g.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      borderRadius: 14,
                      display: "block",
                      background: "var(--pale)",
                    }}
                  />
                  {g.caption && (
                    <figcaption
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginTop: 6,
                        paddingLeft: 2,
                      }}
                    >
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

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
                      <div className="clay-info-key" style={{ display: "inline-flex", alignItems: "center" }}>
                        営業時間
                        <InfoTooltip ariaLabel="営業時間の注意点を見る">
                          <PlaceHoursTooltipContent />
                        </InfoTooltip>
                      </div>
                      <div className="clay-info-val">{place.hours}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key">定休日</div>
                      <div className="clay-info-val">{place.holiday}</div>
                    </div>
                    <div className="clay-info-item">
                      <div className="clay-info-key" style={{ display: "inline-flex", alignItems: "center" }}>
                        価格帯
                        <InfoTooltip ariaLabel="価格帯の注意点を見る">
                          <PlacePriceTooltipContent />
                        </InfoTooltip>
                      </div>
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
                    {primarySns ? (
                      <>
                        <a
                          href={primarySns.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-book-main"
                        >
                          {primarySns.primaryLabel}
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                            <path d="M6 2H2v10h10V8M8 2h4v4M6 8l5-5"
                              stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                        {subSns.length > 0 && (
                          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                            {subSns.map((s) => (
                              <a
                                key={s.kind}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.iconAriaLabel}
                                title={s.primaryLabel}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  border: "1px solid var(--light)",
                                  color: "var(--ink)",
                                  background: "transparent",
                                }}
                              >
                                <SnsIcon kind={s.kind} />
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          textAlign: "center",
                          padding: "12px 16px",
                          background: "var(--pale)",
                          borderRadius: 10,
                        }}
                      >
                        予約導線は準備中です
                      </p>
                    )}
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

      {/* モバイル用固定CTA — 右端浮遊 pill ボタン */}
      {primarySns && (
        <div className="cta-mobile-bar">
          <a
            href={primarySns.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-mobile-btn"
            aria-label={primarySns.primaryLabel}
          >
            <span>{primarySns.kind === "instagram" ? "Instagram" : primarySns.kind === "booking" ? "予約する" : "サイトを見る"}</span>
            <svg className="cta-mobile-btn-arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      )}

      <Footer />
    </>
  );
}
