"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Counselor } from "@/lib/data";
import { KINDA_TYPE_KEYS, KINDA_TYPES, KindaTypeKey } from "@/lib/kinda-types";
import {
  REGIONS,
  ONLINE_OPTION,
  OTHER_OPTION,
  extractAreaKey,
  matchesAreaFilter,
  prefecturesInRegion,
} from "@/lib/areas";
import CounselorReelCard from "@/components/kinda-talk/CounselorReelCard";
import CounselorReelModal from "@/components/kinda-talk/CounselorReelModal";

type SortKey = "match" | "rating" | "review" | "experience";

type Props = {
  counselors: Counselor[];
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "match", label: "おすすめ順" },
  { key: "rating", label: "評価が高い順" },
  { key: "review", label: "レビューが多い順" },
  { key: "experience", label: "経験年数が長い順" },
];

export default function KindaTalkClient({ counselors }: Props) {
  const [openCounselor, setOpenCounselor] = useState<Counselor | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>("すべて");
  const [areaOpen, setAreaOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<KindaTypeKey | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const areaRef = useRef<HTMLDivElement>(null);

  /* 各都道府県のカウンセラー数（カウンセラーが「関東」のように地域名で登録している場合も拾う） */
  const counselorCountByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of counselors) {
      const k = extractAreaKey(c.area);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [counselors]);

  /** ある地域のカウンセラー総数（各都道府県の合計 + 地域名で登録された人）*/
  const countForRegion = (region: string): number => {
    const directCount = counselorCountByKey.get(region) ?? 0;
    const prefectureCount = prefecturesInRegion(region).reduce(
      (sum, p) => sum + (counselorCountByKey.get(p) ?? 0),
      0
    );
    return directCount + prefectureCount;
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
    let list = counselors;
    if (areaFilter !== "すべて") {
      list = list.filter((c) => matchesAreaFilter(c.area, areaFilter));
    }
    if (typeFilter !== "all") {
      list = list.filter((c) => (c.matchingTypes ?? []).includes(typeFilter));
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "review") return b.reviewCount - a.reviewCount;
      if (sortKey === "experience") return b.experience - a.experience;
      // match: rating × review density
      return b.rating * Math.log(b.reviewCount + 2) - a.rating * Math.log(a.reviewCount + 2);
    });
    return sorted;
  }, [counselors, areaFilter, typeFilter, sortKey]);

  return (
    <>
      {/* sticky フィルターバー */}
      <div className="kt-filter-bar">
        {/* エリア（トグル式） + Kinda type ピル */}
        <div
          className="kt-filter-scroll"
          role="region"
          aria-label="エリアと Kinda type で絞り込み"
          style={{ overflow: "visible" }}
        >
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
                aria-label="活動エリア"
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

                {/* 地域 + 都道府県（地域見出しの下に都道府県を 3 列でぶら下げる） */}
                {REGIONS.map((r) => {
                  const regionCount = countForRegion(r.region);
                  const regionDisabled = regionCount === 0;
                  const regionActive = areaFilter === r.region;
                  return (
                    <div key={r.region} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {/* 地域カテゴリ自体（広域選択用ピル） */}
                      <button
                        type="button"
                        role="option"
                        aria-selected={regionActive}
                        aria-disabled={regionDisabled}
                        disabled={regionDisabled}
                        onClick={() => {
                          if (regionDisabled) return;
                          setAreaFilter(r.region);
                          setAreaOpen(false);
                        }}
                        className={`kt-pill ${regionActive ? "is-active" : ""}`}
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                          opacity: regionDisabled ? 0.35 : 1,
                          cursor: regionDisabled ? "not-allowed" : "pointer",
                          fontWeight: 500,
                          background: regionActive ? "var(--accent)" : "var(--pale)",
                          borderColor: regionActive ? "var(--accent)" : "var(--pale)",
                          color: regionActive ? "white" : "var(--ink)",
                        }}
                      >
                        <span>{r.region}</span>
                        {!regionDisabled && (
                          <span style={{ fontSize: 10, opacity: 0.7 }}>{regionCount}</span>
                        )}
                      </button>
                      {/* 都道府県（3列グリッド） */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 4,
                          paddingLeft: 4,
                        }}
                      >
                        {r.prefectures.map((p) => {
                          const count = counselorCountByKey.get(p) ?? 0;
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
                  );
                })}

                {/* オンライン・その他（地域には属さない選択肢） */}
                {[ONLINE_OPTION, OTHER_OPTION].map((opt) => {
                  const count = counselorCountByKey.get(opt) ?? 0;
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
              </div>
            )}
          </div>

          <span style={{ width: 8, flexShrink: 0 }} />

          {/* Kinda type フィルター */}
          <button
            type="button"
            className={`kt-pill ${typeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setTypeFilter("all")}
          >
            すべてのタイプ
          </button>
          {KINDA_TYPE_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={`kt-pill ${typeFilter === k ? "is-active" : ""}`}
              onClick={() => setTypeFilter(k)}
            >
              {KINDA_TYPES[k].shortName}
            </button>
          ))}
        </div>

        {/* 並び替え */}
        <div className="kt-filter-scroll" style={{ marginTop: 8 }} aria-label="並び替え">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              className={`kt-pill ${sortKey === o.key ? "is-active" : ""}`}
              onClick={() => setSortKey(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* セクション見出し */}
      <div className="kt-section-head">
        <div className="kt-section-divider" />
        <h2 className="kt-section-title">
          <em>find your counselor</em>
        </h2>
        <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
          在籍カウンセラー <span style={{ color: "var(--accent)" }}>{filtered.length}</span> 名
        </div>
        <div className="kt-section-divider" />
      </div>

      {/* グリッド */}
      <div className="kt-grid-wrap">
        <div className="kt-grid">
          {filtered.map((c) => (
            <CounselorReelCard key={c.id} counselor={c} onOpen={setOpenCounselor} />
          ))}
          <div className="kt-grid-tease">
            <strong>Kinda は厳選を続けています</strong>
            <span>
              新しい相談所・カウンセラーは
              <br />
              順番に公開していきます。
            </span>
          </div>
          <Link
            href="/diagnosis"
            className="kt-grid-tease"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            <strong>あなたに合うタイプを知る</strong>
            <span style={{ color: "var(--mid)" }}>1〜3分で診断 →</span>
          </Link>
        </div>
      </div>

      <CounselorReelModal counselor={openCounselor} onClose={() => setOpenCounselor(null)} />
    </>
  );
}
