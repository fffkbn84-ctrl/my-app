"use client";

import { useMemo, useState } from "react";
import type { PlaceHome } from "@/lib/mock/places-home";
import PlaceReelCard from "@/components/kinda-act/PlaceReelCard";
import PlaceReelModal from "@/components/kinda-act/PlaceReelModal";

type Props = {
  places: PlaceHome[];
};

/**
 * Kinda act はお見合い・デートで使うカフェ・レストラン専用。
 * 美容系（美容室・ネイル・眉毛・フォト）は Kinda glow に分離。
 */
const CATEGORIES = ["すべて", "カフェ", "レストラン"];
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
  const [openPlace, setOpenPlace] = useState<PlaceHome | null>(null);

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
          Kinda ふたりへが選んだお店 <span style={{ color: "var(--accent)" }}>{filtered.length}</span> 軒
        </div>
        <div className="kt-section-divider" />
      </div>

      <div className="kt-grid-wrap">
        <div className="kt-grid">
          {filtered.map((p) => (
            <PlaceReelCard key={p.id} place={p} onOpen={setOpenPlace} />
          ))}
        </div>
      </div>

      <PlaceReelModal place={openPlace} onClose={() => setOpenPlace(null)} />
    </>
  );
}
