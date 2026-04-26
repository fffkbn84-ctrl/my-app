"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Counselor } from "@/lib/data";
import { KINDA_TYPE_KEYS, KINDA_TYPES, KindaTypeKey } from "@/lib/kinda-types";
import CounselorReelCard from "@/components/kinda-talk/CounselorReelCard";
import CounselorReelModal from "@/components/kinda-talk/CounselorReelModal";

type SortKey = "match" | "rating" | "review" | "experience";

type Props = {
  counselors: Counselor[];
};

/**
 * エリアの定義。
 * 都道府県（一部、活動が多そうなエリア）とオンラインを並べる。
 * カウンセラー管理画面（futarive-counselor）の活動エリア入力時の選択肢と
 * 連動させる前提で、ここで列挙する prefecture 名は
 * counselor.area の先頭セグメント（"・"より前）と一致させる。
 */
const PREFECTURES = [
  "東京",
  "神奈川",
  "千葉",
  "埼玉",
  "大阪",
  "京都",
  "兵庫",
  "愛知",
  "福岡",
  "北海道",
  "オンライン",
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "match", label: "おすすめ順" },
  { key: "rating", label: "評価が高い順" },
  { key: "review", label: "レビューが多い順" },
  { key: "experience", label: "経験年数が長い順" },
];

/** カウンセラーの area 文字列から先頭の都道府県名を抽出 */
function extractPrefecture(area: string): string {
  if (!area) return "";
  // "東京・銀座" → "東京"、"オンライン" → "オンライン"
  return area.split(/[・\s]/)[0] ?? area;
}

export default function KindaTalkClient({ counselors }: Props) {
  const [openCounselor, setOpenCounselor] = useState<Counselor | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>("すべて");
  const [areaOpen, setAreaOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<KindaTypeKey | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const areaRef = useRef<HTMLDivElement>(null);

  /* 各都道府県のカウンセラー数 → 0 件はグレーアウト */
  const counselorCountByPrefecture = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of counselors) {
      const p = extractPrefecture(c.area);
      if (!p) continue;
      map.set(p, (map.get(p) ?? 0) + 1);
    }
    return map;
  }, [counselors]);

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
      list = list.filter((c) => extractPrefecture(c.area) === areaFilter);
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
                  padding: 8,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 6,
                  zIndex: 20,
                  minWidth: 280,
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
                  style={{ gridColumn: "1 / -1" }}
                >
                  すべて
                </button>
                {PREFECTURES.map((p) => {
                  const count = counselorCountByPrefecture.get(p) ?? 0;
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
                        position: "relative",
                      }}
                    >
                      {p}
                      {!disabled && (
                        <span
                          style={{
                            fontSize: 9,
                            opacity: 0.6,
                            marginLeft: 4,
                          }}
                        >
                          {count}
                        </span>
                      )}
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
