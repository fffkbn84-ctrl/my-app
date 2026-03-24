"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Shop, BadgeType } from "@/lib/mock/shops";

/* ────────────────────────────────────────────────────────────
   バッジ設定
──────────────────────────────────────────────────────────── */
const BADGE_CONFIG: Record<BadgeType, { label: string; color: string; bg: string }> = {
  certified: { label: "ふたりへ取材済み", color: "var(--accent)", bg: "color-mix(in srgb, var(--accent) 12%, transparent)" },
  agency:    { label: "相談所おすすめ",   color: "var(--blue)",   bg: "color-mix(in srgb, var(--blue) 12%, transparent)" },
  listed:    { label: "掲載店",           color: "var(--muted)",  bg: "color-mix(in srgb, var(--muted) 12%, transparent)" },
};

function ShopBadge({ badge }: { badge: BadgeType }) {
  const cfg = BADGE_CONFIG[badge];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {badge === "certified" && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 00-.7.7l2.1 2.1a.5.5 0 00.7 0l3.2-3.2a.5.5 0 00-.7-.6z" />
        </svg>
      )}
      {cfg.label}
    </span>
  );
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 12 12"
          fill={star <= Math.round(rating) ? "var(--accent)" : "var(--light)"}>
          <path d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z" />
        </svg>
      ))}
    </div>
  );
}

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      href={`/shops/${shop.id}`}
      className="group bg-white rounded-2xl border border-light hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden"
    >
      {/* 画像プレースホルダー */}
      <div className="aspect-[3/2] bg-pale flex items-center justify-center relative">
        <div className="text-4xl opacity-20 select-none">🍽</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <ShopBadge badge={shop.badge} />
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs px-2 py-1 rounded-full bg-white/80 text-mid backdrop-blur-sm">
            {shop.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <h3
            className="text-base text-ink leading-tight"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            {shop.name}
          </h3>
          <span className="text-xs text-muted shrink-0 ml-2">{shop.priceRange}</span>
        </div>

        <p className="text-xs text-muted mb-3 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 1C3.3 1 2 2.3 2 4c0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" />
            <circle cx="5" cy="4" r="1" />
          </svg>
          {shop.area}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={shop.rating} />
          <span className="text-xs font-medium text-ink">{shop.rating}</span>
          <span className="text-xs text-muted">({shop.reviewCount}件)</span>
        </div>

        <p className="text-xs text-mid leading-relaxed flex-1 line-clamp-2 mb-3">
          {shop.intro}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-light">
          {shop.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-pale text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   フィルター定義
──────────────────────────────────────────────────────────── */
const BADGE_FILTERS = [
  { value: "all",       label: "すべて" },
  { value: "certified", label: "取材済み" },
  { value: "agency",    label: "相談所おすすめ" },
  { value: "listed",    label: "掲載店" },
] as const;

const CATEGORIES = ["すべて", "レストラン", "カフェ", "カフェ・甘味", "和食", "ホテルラウンジ"];
const AREAS      = ["すべて", "東京・表参道", "東京・銀座", "東京・青山", "東京・南青山", "東京・丸の内", "東京・麻布十番", "東京・汐留"];

/* ────────────────────────────────────────────────────────────
   ShopSearch（クライアントコンポーネント）
──────────────────────────────────────────────────────────── */
export default function ShopSearch({ shops }: { shops: Shop[] }) {
  const [query, setQuery]       = useState("");
  const [badge, setBadge]       = useState<"all" | BadgeType>("all");
  const [category, setCategory] = useState("すべて");
  const [area, setArea]         = useState("すべて");

  const filtered = useMemo(() => {
    return shops.filter((s) => {
      const matchQ    = query === "" || s.name.includes(query) || s.area.includes(query) || s.tags.some((t) => t.includes(query));
      const matchB    = badge === "all" || s.badge === badge;
      const matchC    = category === "すべて" || s.category === category;
      const matchA    = area === "すべて" || s.area === area;
      return matchQ && matchB && matchC && matchA;
    });
  }, [shops, query, badge, category, area]);

  return (
    <>
      {/* バッジフィルター（タブ形式） */}
      <section className="bg-white border-b border-light">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* バッジタブ */}
            <div className="flex gap-2 flex-wrap">
              {BADGE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setBadge(f.value as typeof badge)}
                  className={`px-4 py-2 rounded-full text-xs transition-all duration-200 ${
                    badge === f.value
                      ? "bg-accent text-white"
                      : "border border-light text-mid hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 md:ml-auto">
              {/* カテゴリ */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-xs border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>

              {/* エリア */}
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="px-3 py-2 text-xs border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink"
              >
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>

              {/* テキスト検索 */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="12" height="12"
                  viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="5.5" cy="5.5" r="3.5" />
                  <path d="M9 9l2 2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="店名・エリアで検索"
                  className="pl-8 pr-3 py-2 text-xs border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 placeholder:text-muted w-36"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* バッジ説明 */}
      {badge === "all" && (
        <section className="bg-pale border-b border-light">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-4">
            {(Object.entries(BADGE_CONFIG) as [BadgeType, typeof BADGE_CONFIG[BadgeType]][]).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2 text-xs text-mid">
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ color: cfg.color, background: cfg.bg }}
                >
                  {cfg.label}
                </span>
                <span>
                  {key === "certified" && "ふたりへスタッフが実際に訪問・取材したお店"}
                  {key === "agency"    && "提携相談所がおすすめするお店"}
                  {key === "listed"    && "ユーザー口コミで掲載されたお店"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 一覧 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs text-muted mb-6">{filtered.length}件表示中</p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((s) => (
                <ShopCard key={s.id} shop={s} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-muted text-sm">
              条件に一致するお店が見つかりませんでした。
            </div>
          )}
        </div>
      </section>
    </>
  );
}
