"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Counselor } from "@/lib/data";
import { KINDA_TYPE_KEYS, KINDA_TYPES, KindaTypeKey } from "@/lib/kinda-types";
import {
  PREFECTURE_GROUPS,
  BROAD_REGIONS,
  NATIONAL_OPTION,
  ONLINE_OPTION,
  extractAreaKey,
  matchesAreaFilter,
  prefecturesInBroadRegion,
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

  /* 各キー（都道府県名・広域名・オンライン）ごとのカウンセラー数 */
  const counselorCountByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of counselors) {
      const k = extractAreaKey(c.area);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [counselors]);

  /** ある広域エリアの総数（各都道府県 + その広域名で直接登録された人） */
  const countForBroadRegion = (name: string): number => {
    const directCount = counselorCountByKey.get(name) ?? 0;
    const prefCount = prefecturesInBroadRegion(name).reduce(
      (sum, p) => sum + (counselorCountByKey.get(p) ?? 0),
      0
    );
    return directCount + prefCount;
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
                  // talk のエリアトリガーは行頭にあるため left:0 で左から展開
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
                  // viewport - 24px でクランプして画面端を超えないように
                  width: "min(360px, calc(100vw - 24px))",
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                {/* すべて（リセット用） */}
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

                {/* 広域・オンライン（全国・オンライン）*/}
                <div className="kt-area-section-label">広域・オンライン</div>
                {[NATIONAL_OPTION, ONLINE_OPTION].map((opt) => {
                  // 全国は常に有効（カウンセラーが 1 人以上いれば押せる）
                  const count =
                    opt === NATIONAL_OPTION
                      ? counselors.length
                      : counselorCountByKey.get(opt) ?? 0;
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

                {/* エリア（広域）— 首都圏 / 関東 / 関西（近畿）/ etc. */}
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

                {/* 47 都道府県（北海道・東北 / 関東 / 中部 / 近畿 / 中国・四国 / 九州・沖縄） */}
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
                ))}
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
            href="/kinda-type"
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
