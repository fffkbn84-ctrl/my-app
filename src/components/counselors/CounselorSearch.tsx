"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type Counselor = {
  id: string;
  name: string;
  nameKana: string;
  agency: string;
  area: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  yearsExp: number;
  intro: string;
  nextAvailable: string;
  fee: string;
};

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill={star <= rating ? "var(--accent)" : "var(--light)"}
        >
          <path d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z" />
        </svg>
      ))}
    </div>
  );
}

function CounselorCard({ counselor }: { counselor: Counselor }) {
  return (
    <Link
      href={`/counselors/${counselor.id}`}
      onClick={() =>
        trackEvent("counselor_card_click", {
          counselor_id: String(counselor.id),
          source_page: "counselor_list",
        })
      }
      className="group bg-white rounded-2xl overflow-hidden border border-light hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* アバター */}
      <div className="aspect-[3/2] bg-pale flex items-center justify-center relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white"
          style={{ background: "var(--accent)", fontFamily: "var(--font-mincho)" }}
        >
          {counselor.name.slice(-1)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/80 text-mid backdrop-blur-sm">
            {counselor.area}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3
              className="text-base text-ink leading-tight"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              {counselor.name}
            </h3>
            <p className="text-xs text-muted mt-0.5">{counselor.nameKana}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <StarRating rating={Math.round(counselor.rating)} />
              <span className="text-xs font-medium text-ink">{counselor.rating}</span>
            </div>
            <p className="text-xs text-muted">{counselor.reviewCount}件</p>
          </div>
        </div>

        <p className="text-xs text-muted mb-3">{counselor.agency}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {counselor.specialties.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-0.5 rounded-full border text-accent"
              style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            >
              {s}
            </span>
          ))}
        </div>

        <p className="text-xs text-mid leading-relaxed flex-1 line-clamp-2">
          {counselor.intro}
        </p>

        <div className="mt-4 pt-4 border-t border-light flex items-center justify-between">
          <div className="text-xs text-muted">
            経験 <span className="text-ink">{counselor.yearsExp}年</span>
            <span className="mx-2">·</span>
            次の空き <span className="text-ink">{counselor.nextAvailable}</span>
          </div>
          <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
            予約する
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

const AREAS = ["すべて", "東京", "神奈川", "大阪", "愛知", "その他"];
const SPECIALTIES = ["すべて", "初婚", "再婚", "20代", "30代", "40代", "キャリア女性"];
const SORTS = [
  { label: "口コミ評価が高い順", value: "rating" },
  { label: "口コミ件数が多い順", value: "reviewCount" },
  { label: "経験年数が長い順", value: "yearsExp" },
] as const;

type SortKey = (typeof SORTS)[number]["value"];

export default function CounselorSearch({ counselors }: { counselors: Counselor[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("すべて");
  const [specialty, setSpecialty] = useState("すべて");
  const [sort, setSort] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let result = counselors.filter((c) => {
      const matchQuery =
        query === "" ||
        c.name.includes(query) ||
        c.nameKana.includes(query) ||
        c.agency.includes(query);
      const matchArea = area === "すべて" || c.area.includes(area);
      const matchSpecialty =
        specialty === "すべて" || c.specialties.includes(specialty);
      return matchQuery && matchArea && matchSpecialty;
    });

    result = [...result].sort((a, b) => b[sort] - a[sort]);
    return result;
  }, [counselors, query, area, specialty, sort]);

  return (
    <>
      {/* 検索・フィルター */}
      <section className="bg-white border-b border-light sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="M11 11l2.5 2.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="カウンセラー名・相談所名で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 placeholder:text-muted"
              />
            </div>

            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="px-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink min-w-[130px]"
            >
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink min-w-[150px]"
            >
              {SPECIALTIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-4 py-2.5 text-sm border border-light rounded-xl focus:outline-none focus:border-accent/50 bg-pale/50 text-ink min-w-[140px]"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* カウンセラー一覧 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs text-muted mb-6">{filtered.length}件表示中</p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => (
                <CounselorCard key={c.id} counselor={c} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-muted text-sm">
              条件に一致するカウンセラーが見つかりませんでした。
            </div>
          )}
        </div>
      </section>
    </>
  );
}
