"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PlaceHome } from "@/lib/mock/places-home";
import PlaceThumb from "@/components/kinda-act/PlaceThumb";
import PlaceBadge from "@/components/kinda-act/PlaceBadge";
import DemoBadge from "@/components/kinda-talk/DemoBadge";

type Props = {
  places: PlaceHome[];
};

const CATEGORIES = ["すべて", "カフェ", "レストラン", "美容室", "ネイルサロン", "眉毛サロン", "フォトスタジオ"];
const AREAS = ["すべて", "東京", "大阪", "名古屋"];
const BADGE_FILTERS = [
  { value: "all", label: "すべて" },
  { value: "certified", label: "取材済み" },
  { value: "agency", label: "相談所おすすめ" },
] as const;

type BadgeFilter = (typeof BADGE_FILTERS)[number]["value"];

export default function KindaActClient({ places }: Props) {
  const [category, setCategory] = useState<string>("すべて");
  const [area, setArea] = useState<string>("すべて");
  const [badge, setBadge] = useState<BadgeFilter>("all");

  const filtered = useMemo(() => {
    return places.filter((p) => {
      const matchC = category === "すべて" || p.categoryLabel === category;
      const matchA = area === "すべて" || p.areaLabel === area;
      const matchB = badge === "all" || p.badgeType === badge;
      return matchC && matchA && matchB;
    });
  }, [places, category, area, badge]);

  return (
    <>
      {/* sticky フィルターバー */}
      <div className="kt-filter-bar">
        <div className="kt-filter-scroll" aria-label="バッジで絞り込み">
          {BADGE_FILTERS.map((b) => (
            <button
              key={b.value}
              type="button"
              className={`kt-pill ${badge === b.value ? "is-active" : ""}`}
              onClick={() => setBadge(b.value)}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="kt-filter-scroll" style={{ marginTop: 8 }} aria-label="カテゴリで絞り込み">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`kt-pill ${category === c ? "is-active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
          <span style={{ width: 8, flexShrink: 0 }} />
          {AREAS.map((a) => (
            <button
              key={a}
              type="button"
              className={`kt-pill ${area === a ? "is-active" : ""}`}
              onClick={() => setArea(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* セクション見出し */}
      <div className="kt-section-head">
        <div className="kt-section-divider" />
        <h2 className="kt-section-title">
          <em>find your place</em>
        </h2>
        <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
          ふたりへが選んだお店 <span style={{ color: "var(--accent)" }}>{filtered.length}</span> 軒
        </div>
        <div className="kt-section-divider" />
      </div>

      <div className="ka-grid-wrap">
        <div className="ka-grid">
          {filtered.map((p) => (
            <Link key={p.id} href={`/places/${p.id}`} className="ka-card">
              <PlaceThumb variant={p.thumbVariant} />
              <div className="ka-card-badges">
                <PlaceBadge type={p.badgeType} />
                <DemoBadge />
              </div>
              <div className="ka-card-body">
                <div className="ka-card-stage">{p.stage}</div>
                <div className="ka-card-name">{p.name}</div>
                <div className="ka-card-meta">
                  <span>{p.location}</span>
                  <span style={{ color: "var(--light)" }}>·</span>
                  <span
                    className="ka-card-meta-rating"
                    aria-label={`平均評価 ${p.rating.toFixed(1)}、レビュー ${p.reviewCount}件`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {p.rating.toFixed(1)} ({p.reviewCount})
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
