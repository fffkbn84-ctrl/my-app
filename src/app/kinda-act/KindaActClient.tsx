"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import type { PlaceHome } from "@/lib/mock/places-home";
import PlaceReelCard from "@/components/kinda-act/PlaceReelCard";
import PlaceReelModal from "@/components/kinda-act/PlaceReelModal";
import {
  PREFECTURE_GROUPS,
  BROAD_REGIONS,
  NATIONAL_OPTION,
  ONLINE_OPTION,
  extractAreaKey,
  matchesAreaFilter,
  prefecturesInBroadRegion,
} from "@/lib/areas";

type Props = {
  places: PlaceHome[];
};

/**
 * Kinda act はお見合い・デートで使うカフェ・レストラン専用。
 * 美容系（美容室・ネイル・眉毛・フォト）は Kinda glow に分離。
 */
const CATEGORIES = ["すべて", "カフェ", "レストラン"];
const BADGE_FILTERS = [
  { value: "all", label: "すべて" },
  { value: "certified", label: "取材済み" },
  { value: "agency", label: "相談所おすすめ" },
] as const;

type BadgeFilter = (typeof BADGE_FILTERS)[number]["value"];

export default function KindaActClient({ places }: Props) {
  const [category, setCategory] = useState<string>("すべて");
  const [areaFilter, setAreaFilter] = useState<string>("すべて");
  const [areaOpen, setAreaOpen] = useState(false);
  const [badge, setBadge] = useState<BadgeFilter>("all");
  const [openPlace, setOpenPlace] = useState<PlaceHome | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  /* キー単位の店舗数（都道府県名・広域名・オンライン → 件数）*/
  const placeCountByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of places) {
      const k = extractAreaKey(p.areaLabel);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [places]);

  /** ある広域エリアの店舗総数 */
  const countForBroadRegion = (name: string): number => {
    const direct = placeCountByKey.get(name) ?? 0;
    const sum = prefecturesInBroadRegion(name).reduce(
      (s, p) => s + (placeCountByKey.get(p) ?? 0),
      0
    );
    return direct + sum;
  };

  /* エリアトグル外クリックで閉じる */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!areaOpen) return;
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        setAreaOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [areaOpen]);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      const matchC = category === "すべて" || p.categoryLabel === category;
      const matchA = matchesAreaFilter(p.areaLabel, areaFilter);
      const matchB = badge === "all" || p.badgeType === badge;
      return matchC && matchA && matchB;
    });
  }, [places, category, areaFilter, badge]);

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
        <div
          className="kt-filter-scroll"
          style={{ marginTop: 8, overflow: "visible" }}
          aria-label="カテゴリ・エリアで絞り込み"
        >
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

          {/* エリアトグル */}
          <div ref={areaRef} style={{ position: "relative", flexShrink: 0 }}>
            <button
              type="button"
              className={`kt-pill ${areaFilter !== "すべて" ? "is-active" : ""}`}
              aria-expanded={areaOpen}
              aria-haspopup="listbox"
              onClick={() => setAreaOpen((v) => !v)}
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              エリア{areaFilter !== "すべて" ? `: ${areaFilter}` : ""}
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                  transform: areaOpen ? "rotate(180deg)" : "none",
                  transition: "transform .15s ease",
                }}
              >
                <path d="M3 5l4 4 4-4" />
              </svg>
            </button>
            {areaOpen && (
              <div
                role="listbox"
                aria-label="エリア"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  background: "white",
                  border: "1px solid var(--light)",
                  borderRadius: 14,
                  boxShadow: "0 8px 24px rgba(184,128,110,.12), 0 2px 8px rgba(0,0,0,.06)",
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  zIndex: 20,
                  minWidth: 320,
                  maxWidth: 360,
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={areaFilter === "すべて"}
                  onClick={() => {
                    setAreaFilter("すべて");
                    setAreaOpen(false);
                  }}
                  className={`kt-pill ${areaFilter === "すべて" ? "is-active" : ""}`}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  すべて
                </button>

                <div className="kt-area-section-label">広域・オンライン</div>
                {[NATIONAL_OPTION, ONLINE_OPTION].map((opt) => {
                  const count =
                    opt === NATIONAL_OPTION
                      ? places.length
                      : placeCountByKey.get(opt) ?? 0;
                  const disabled = count === 0;
                  const active = areaFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={active}
                      aria-disabled={disabled}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setAreaFilter(opt);
                        setAreaOpen(false);
                      }}
                      className={`kt-pill ${active ? "is-active" : ""}`}
                      style={{
                        opacity: disabled ? 0.35 : 1,
                        cursor: disabled ? "not-allowed" : "pointer",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{opt}</span>
                      {!disabled && <span style={{ fontSize: 10, opacity: 0.6 }}>{count}</span>}
                    </button>
                  );
                })}

                <div className="kt-area-section-label">エリア（広域）</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
                  {BROAD_REGIONS.map((r) => {
                    const count = countForBroadRegion(r.name);
                    const disabled = count === 0;
                    const active = areaFilter === r.name;
                    return (
                      <button
                        key={r.name}
                        type="button"
                        role="option"
                        aria-selected={active}
                        aria-disabled={disabled}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setAreaFilter(r.name);
                          setAreaOpen(false);
                        }}
                        className={`kt-pill ${active ? "is-active" : ""}`}
                        style={{
                          opacity: disabled ? 0.35 : 1,
                          cursor: disabled ? "not-allowed" : "pointer",
                          fontSize: 11,
                          padding: "6px 10px",
                          textAlign: "center",
                          background: active ? "var(--accent)" : "var(--pale)",
                          borderColor: active ? "var(--accent)" : "var(--pale)",
                          color: active ? "white" : "var(--ink)",
                        }}
                      >
                        {r.name}
                        {!disabled && (
                          <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 3 }}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {PREFECTURE_GROUPS.map((g) => (
                  <div key={g.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div className="kt-area-section-label">{g.label}</div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 4,
                      }}
                    >
                      {g.prefectures.map((p) => {
                        const count = placeCountByKey.get(p) ?? 0;
                        const disabled = count === 0;
                        const active = areaFilter === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            role="option"
                            aria-selected={active}
                            aria-disabled={disabled}
                            disabled={disabled}
                            onClick={() => {
                              if (disabled) return;
                              setAreaFilter(p);
                              setAreaOpen(false);
                            }}
                            className={`kt-pill ${active ? "is-active" : ""}`}
                            style={{
                              opacity: disabled ? 0.35 : 1,
                              cursor: disabled ? "not-allowed" : "pointer",
                              textAlign: "center",
                              fontSize: 11,
                              padding: "5px 8px",
                            }}
                          >
                            {p}
                            {!disabled && (
                              <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 3 }}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
