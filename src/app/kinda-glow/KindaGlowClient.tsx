"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
 * Kinda glow は「好きな人に会う前に、自分を整える」時間。
 * 美容室・フォトスタジオ・（将来）ネイル・眉毛・エステの一覧。
 *
 * NOTE: 現状データには 美容室 / フォトスタジオ のみ。
 * 眉毛・ネイル・エステは Supabase 連携時に追加。
 */
const CATEGORIES = ["すべて", "美容室", "フォトスタジオ"];
const BADGE_FILTERS = [
  { value: "all", label: "すべて" },
  { value: "certified", label: "取材済み" },
  { value: "agency", label: "相談所おすすめ" },
] as const;

type BadgeFilter = (typeof BADGE_FILTERS)[number]["value"];

export default function KindaGlowClient({ places }: Props) {
  /* URL params から初期値（SearchModal「美容店」タブからの遷移に対応）
     use=beauty → 美容室 にマッピング。
     eyebrow / nail / esthetic は現状データなしのため "すべて" に解決。 */
  const searchParams = useSearchParams();
  const useParam = searchParams.get("use");
  const initialCategory = useParam === "beauty" ? "美容室" : "すべて";

  const [category, setCategory] = useState<string>(initialCategory);
  const [areaFilter, setAreaFilter] = useState<string>(searchParams.get("area") ?? "すべて");
  const [areaOpen, setAreaOpen] = useState(false);
  const [badge, setBadge] = useState<BadgeFilter>("all");
  const [openPlace, setOpenPlace] = useState<PlaceHome | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  /* キー単位の店舗数 */
  const placeCountByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of places) {
      const k = extractAreaKey(p.areaLabel);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [places]);

  const countForBroadRegion = (name: string): number => {
    const direct = placeCountByKey.get(name) ?? 0;
    const sum = prefecturesInBroadRegion(name).reduce(
      (s, p) => s + (placeCountByKey.get(p) ?? 0),
      0,
    );
    return direct + sum;
  };

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

        <div className="kt-filter-scroll" style={{ marginTop: 8 }} aria-label="カテゴリとエリア">
          {/* エリアトグル */}
          <div className="kt-area-trigger-wrap" ref={areaRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={areaOpen}
              onClick={() => setAreaOpen((v) => !v)}
              className={`kt-pill ${areaFilter !== "すべて" ? "is-active" : ""}`}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M6 1.5C3.7 1.5 2 3.2 2 5.5c0 3 4 5 4 5s4-2 4-5c0-2.3-1.7-4-4-4z" />
                <circle cx="6" cy="5.5" r="1.4" />
              </svg>
              エリア{areaFilter !== "すべて" ? `: ${areaFilter}` : ""}
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>

            {areaOpen && (
              <div className="kt-area-dropdown" role="listbox">
                {/* 全国 / オンライン */}
                <div className="kt-area-section">
                  <div className="kt-area-section-label">広域・オンライン</div>
                  <div className="kt-area-pill-grid">
                    {[NATIONAL_OPTION, ONLINE_OPTION].map((opt) => {
                      const active = areaFilter === opt;
                      const count =
                        opt === NATIONAL_OPTION
                          ? places.length
                          : placeCountByKey.get(ONLINE_OPTION) ?? 0;
                      const disabled = count === 0;
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
                            textAlign: "center",
                            fontSize: 11,
                            padding: "5px 8px",
                          }}
                        >
                          {opt}
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

                {/* すべて */}
                <button
                  type="button"
                  role="option"
                  aria-selected={areaFilter === "すべて"}
                  onClick={() => {
                    setAreaFilter("すべて");
                    setAreaOpen(false);
                  }}
                  className={`kt-pill ${areaFilter === "すべて" ? "is-active" : ""}`}
                  style={{ width: "100%", textAlign: "center", marginBottom: 8 }}
                >
                  すべて
                </button>

                {/* 広域エリア */}
                <div className="kt-area-section">
                  <div className="kt-area-section-label">エリア（広域）</div>
                  <div className="kt-area-pill-grid">
                    {BROAD_REGIONS.map((r) => {
                      const count = countForBroadRegion(r.name);
                      const active = areaFilter === r.name;
                      const disabled = count === 0;
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
                            textAlign: "center",
                            fontSize: 11,
                            padding: "5px 8px",
                          }}
                        >
                          {r.name}
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

                {/* 都道府県（地域別） */}
                {PREFECTURE_GROUPS.map((g) => (
                  <div className="kt-area-section" key={g.label}>
                    <div className="kt-area-section-label">{g.label}</div>
                    <div className="kt-area-pill-grid">
                      {g.prefectures.map((p) => {
                        const count = placeCountByKey.get(p) ?? 0;
                        const active = areaFilter === p;
                        const disabled = count === 0;
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

          <span style={{ width: 8, flexShrink: 0 }} />

          {/* カテゴリ */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`kt-pill ${category === cat ? "is-active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 件数 */}
      <div style={{ padding: "16px 20px 0", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--mid)" }}>
          {filtered.length}件のお店
        </p>
      </div>

      {/* グリッド */}
      <div className="kt-reel-grid">
        {filtered.length > 0 ? (
          filtered.map((place) => (
            <PlaceReelCard
              key={place.id}
              place={place}
              onOpen={(p) => setOpenPlace(p)}
            />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "80px 20px",
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            条件に合うお店が見つかりませんでした。
          </div>
        )}
      </div>

      {/* モーダル */}
      {openPlace && (
        <PlaceReelModal place={openPlace} onClose={() => setOpenPlace(null)} />
      )}
    </>
  );
}
