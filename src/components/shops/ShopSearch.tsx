"use client";

import { useState, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  placesHomeData,
  type PlaceHome,
  type ThumbVariant,
} from "@/lib/mock/places-home";

/* ────────────────────────────────────────────────────────────
   フィルター定義
──────────────────────────────────────────────────────────── */
const BADGE_FILTERS = [
  { value: "all",       label: "すべて" },
  { value: "certified", label: "取材済み" },
  { value: "agency",    label: "相談所おすすめ" },
] as const;

type BadgeFilter = typeof BADGE_FILTERS[number]["value"];

const CATEGORIES = ["すべて", "カフェ", "レストラン", "美容室", "ネイルサロン", "眉毛サロン", "フォトスタジオ"];
const AREAS      = ["すべて", "東京", "大阪", "名古屋"];

/* ────────────────────────────────────────────────────────────
   サムネイル — グラデーション + SVGアイコン
──────────────────────────────────────────────────────────── */
function PlaceThumb({ variant }: { variant: ThumbVariant }) {
  const gradientClass: Record<ThumbVariant, string> = {
    cafe:           "pt-cafe",
    lounge:         "pt-rest",
    hair:           "pt-hair",
    nail:           "pt-nail",
    brow:           "pt-brow",
    "photo-studio": "pt-photo",
  };

  const icons: Record<ThumbVariant, ReactNode> = {
    cafe: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path
          d="M10 20h24l-2.5 18H12.5L10 20z"
          stroke="#C8A97A"
          strokeWidth="1.5"
          fill="rgba(200,169,122,.1)"
          strokeLinejoin="round"
        />
        <path d="M34 24h3a3.5 3.5 0 010 7h-3" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M16 15c0-2.5 3-2.5 3-5M22 15c0-2.5 3-2.5 3-5"
          stroke="#C8A97A"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity=".5"
        />
      </svg>
    ),
    lounge: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="14" stroke="#C4877A" strokeWidth="1.5" fill="rgba(196,135,122,.1)" />
        <path d="M18 32c2 3 14 3 16 0" stroke="#C4877A" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="24" r="2" fill="#C4877A" opacity=".5" />
        <circle cx="31" cy="24" r="2" fill="#C4877A" opacity=".5" />
      </svg>
    ),
    hair: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="18" cy="18" r="7" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.1)" />
        <circle cx="18" cy="34" r="7" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.1)" />
        <path d="M23 21l14-8M23 31l14 8" stroke="#7A9E87" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    nail: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="16" y="14" width="20" height="26" rx="4" stroke="#B88FC8" strokeWidth="1.5" fill="rgba(184,143,200,.1)" />
        <path d="M20 22h12M20 28h8" stroke="#B88FC8" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      </svg>
    ),
    brow: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M14 24c4-4 10-4 14-2s10 3 14-1" stroke="#A89878" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M14 30c4-4 10-4 14-2s10 3 14-1" stroke="#A89878" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".4" />
      </svg>
    ),
    "photo-studio": (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="8" y="16" width="36" height="26" rx="3" stroke="#6B8FBF" strokeWidth="1.5" fill="rgba(107,143,191,.1)" />
        <circle cx="26" cy="29" r="7" stroke="#6B8FBF" strokeWidth="1.5" fill="none" />
        <path d="M19 16l3-5h8l3 5" stroke="#6B8FBF" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="38" cy="23" r="2" fill="#6B8FBF" opacity=".5" />
      </svg>
    ),
  };

  return (
    <div className={`place-thumb ${gradientClass[variant]}`} style={{ height: 200 }}>
      {icons[variant]}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   星評価
──────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="pt-stars">
      {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(rating) ? "★" : "☆")).join("")}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   お店カード
──────────────────────────────────────────────────────────── */
function ShopCard({ place }: { place: PlaceHome }) {
  const router = useRouter();

  return (
    <div
      className="place-card"
      style={{ width: "auto", cursor: "pointer" }}
      onClick={() => router.push(`/places/${place.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 56px rgba(0,0,0,.09)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* サムネイル */}
      <div style={{ position: "relative" }}>
        <PlaceThumb variant={place.thumbVariant} />

        {/* 左上: バッジ */}
        {place.badgeType !== "listed" && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span
              className={`pt-review-type ${place.badgeType === "certified" ? "rt-certified" : "rt-agency"}`}
              style={{ fontSize: 9, padding: "3px 8px" }}
            >
              {place.badgeType === "certified" ? "取材済み" : "相談所おすすめ"}
            </span>
          </div>
        )}

        {/* 右上: カテゴリバッジ */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span
            style={{
              fontSize: 9,
              padding: "3px 8px",
              borderRadius: 20,
              background: "rgba(255,255,255,.88)",
              color: "var(--mid)",
              fontFamily: "var(--font-sans)",
              backdropFilter: "blur(4px)",
            }}
          >
            {place.categoryLabel}
          </span>
        </div>
      </div>

      {/* 本文 */}
      <div className="pt-body">
        <div className="pt-stage">{place.stage}</div>
        <div className="pt-name" style={{ fontSize: 15, marginBottom: 4 }}>{place.name}</div>
        <div className="pt-loc" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="var(--muted)" strokeWidth="1.5">
            <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5S11.5 9.5 11.5 6c0-2.5-2-4.5-4.5-4.5z" />
            <circle cx="7" cy="6" r="1.5" />
          </svg>
          {place.location}
        </div>

        {/* 説明文 */}
        <p
          style={{
            fontSize: 12,
            color: "var(--mid)",
            lineHeight: 1.8,
            marginBottom: 10,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {place.description}
        </p>

        {/* 特徴タグ */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {place.features.slice(0, 3).map((f) => (
            <span
              key={f}
              style={{
                fontSize: 10,
                border: "1px solid var(--light)",
                borderRadius: 20,
                padding: "3px 9px",
                color: "var(--mid)",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* 下部 */}
        <div className="pt-bottom">
          <div className="pt-rating">
            <Stars rating={place.rating} />
            <span className="pt-cnt">口コミ {place.reviewCount}件</span>
          </div>
          {place.badgeType !== "listed" && (
            <span
              className={`pt-review-type ${place.badgeType === "certified" ? "rt-certified" : "rt-agency"}`}
            >
              {place.badgeType === "certified" ? "取材済み" : "相談所おすすめ"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ShopSearch（クライアントコンポーネント）
──────────────────────────────────────────────────────────── */
export default function ShopSearch() {
  const [badge, setBadge]       = useState<BadgeFilter>("all");
  const [category, setCategory] = useState("すべて");
  const [area, setArea]         = useState("すべて");
  const [query, setQuery]       = useState("");

  const filtered = useMemo(() => {
    return placesHomeData.filter((p) => {
      const matchB = badge === "all" || p.badgeType === badge;
      const matchC = category === "すべて" || p.categoryLabel === category;
      const matchA = area === "すべて" || p.areaLabel === area;
      const matchQ = query === "" || p.name.includes(query) || p.location.includes(query);
      return matchB && matchC && matchA && matchQ;
    });
  }, [badge, category, area, query]);

  const selectStyle: React.CSSProperties = {
    padding: "9px 12px",
    fontSize: 12,
    border: "1px solid var(--light)",
    borderRadius: 10,
    background: "var(--white)",
    color: "var(--ink)",
    outline: "none",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  };

  return (
    <section style={{ padding: "32px 0 80px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>

        {/* ── フィルターエリア ── */}
        <div style={{ background: "var(--pale)", borderRadius: 14, padding: 20, marginBottom: 24 }}>

          {/* バッジタブ */}
          <div className="place-tabs" style={{ marginTop: 0, marginBottom: 16 }}>
            {BADGE_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`pt-btn${badge === f.value ? " on" : ""}`}
                onClick={() => setBadge(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* セレクト + テキスト検索 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select value={area} onChange={(e) => setArea(e.target.value)} style={selectStyle}>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="#A0A0A0" strokeWidth="1.3" />
                  <path d="M11 11l3 3" stroke="#A0A0A0" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="店名・エリアで検索"
                style={{
                  ...selectStyle,
                  paddingLeft: 34,
                  width: 180,
                }}
              />
            </div>
          </div>
        </div>

        {/* ── バッジ凡例 ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="pt-review-type rt-certified" style={{ fontSize: 10, padding: "4px 10px" }}>
              ふたりへ取材済み
            </span>
            <span style={{ fontSize: 12, color: "var(--mid)" }}>ふたりへスタッフが現地訪問・取材したお店</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="pt-review-type rt-agency" style={{ fontSize: 10, padding: "4px 10px" }}>
              相談所おすすめ
            </span>
            <span style={{ fontSize: 12, color: "var(--mid)" }}>提携相談所・カウンセラーがおすすめするお店</span>
          </div>
        </div>

        {/* ── 件数 ── */}
        <p style={{ fontSize: 13, color: "var(--mid)", marginBottom: 20 }}>
          {filtered.length}件表示中
        </p>

        {/* ── カードグリッド ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((place) => (
              <ShopCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "80px 0",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            条件に一致するお店が見つかりませんでした。
          </div>
        )}
      </div>
    </section>
  );
}
