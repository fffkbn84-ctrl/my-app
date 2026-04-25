"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Counselor } from "@/lib/data";
import { KINDA_TYPE_KEYS, KINDA_TYPES, KindaTypeKey } from "@/lib/kinda-types";
import CounselorReelCard from "@/components/kinda-talk/CounselorReelCard";
import CounselorReelModal from "@/components/kinda-talk/CounselorReelModal";

type SortKey = "match" | "rating" | "review" | "experience";

type Props = {
  counselors: Counselor[];
};

const AREA_OPTIONS = [
  "すべて",
  "東京",
  "大阪",
  "名古屋",
  "福岡",
  "オンライン",
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "match", label: "おすすめ順" },
  { key: "rating", label: "評価が高い順" },
  { key: "review", label: "レビューが多い順" },
  { key: "experience", label: "経験年数が長い順" },
];

export default function KindaTalkClient({ counselors }: Props) {
  const [openCounselor, setOpenCounselor] = useState<Counselor | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>("すべて");
  const [typeFilter, setTypeFilter] = useState<KindaTypeKey | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("match");

  const filtered = useMemo(() => {
    let list = counselors;
    if (areaFilter !== "すべて") {
      list = list.filter((c) => c.area.includes(areaFilter));
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
        <div className="kt-filter-scroll" role="tablist" aria-label="エリアフィルター">
          {AREA_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              className={`kt-pill ${areaFilter === a ? "is-active" : ""}`}
              onClick={() => setAreaFilter(a)}
            >
              {a}
            </button>
          ))}
          <span style={{ width: 8, flexShrink: 0 }} />
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
