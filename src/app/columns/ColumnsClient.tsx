"use client";

import { useState } from "react";
import Link from "next/link";
import type { ColumnMeta } from "@/lib/columns";
import WeatherColumnThumb from "@/components/columns/WeatherColumnThumb";
import type { WeatherKey } from "@/app/kinda-note/data/weatherDescriptions";

const CATEGORIES = ["すべて", "気持ちの整理", "取材レポート", "お見合い準備", "デートプラン"] as const;
type CategoryKey = (typeof CATEGORIES)[number];

/** カテゴリ別表示順（「すべて」モードでセクションを並べる順番） */
const CATEGORY_ORDER: Exclude<CategoryKey, "すべて">[] = [
  "気持ちの整理",
  "取材レポート",
  "お見合い準備",
  "デートプラン",
];

/** 「すべて」モードでカテゴリセクションに出す最大件数。超えたら「もっと見る →」を出す */
const SECTION_PREVIEW_COUNT = 6;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function ColumnCard({
  column,
  pickup = false,
}: {
  column: ColumnMeta;
  /** 編集部おすすめの太枠スタイル */
  pickup?: boolean;
}) {
  // 「気持ちの整理」カテゴリ (= weatherKey あり) はポラロイド風サムネを使う
  const hasWeatherKey = !!column.weatherKey;

  return (
    <Link
      href={`/columns/${column.slug}`}
      className={`kv-card ${pickup ? "kv-card-pickup" : ""}`}
    >
      {/* サムネイル */}
      <div
        className="kv-card-thumb"
        style={{
          background: hasWeatherKey
            ? undefined
            : column.thumbnail
              ? column.thumbnail
              : "url('/images/Kinda-voices-nouse.webp') center/cover no-repeat",
          height: "160px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {hasWeatherKey && (
          <WeatherColumnThumb
            weatherKey={column.weatherKey as WeatherKey}
            slug={column.slug}
            height={160}
          />
        )}
        {pickup && (
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "3px 10px",
              borderRadius: 20,
              background: "rgba(255,255,255,.96)",
              color: "#8B7355",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              fontWeight: 500,
              boxShadow: "0 2px 6px rgba(180,140,90,.18)",
            }}
          >
            Editor&apos;s Pick
          </span>
        )}
      </div>

      {/* テキストエリア */}
      <div className="kv-card-body">
        <span className="kv-card-tag">{column.category}</span>

        <p className="kv-card-title">{column.title}</p>

        <div className="kv-card-meta">
          <div
            className="kv-card-avatar"
            style={{ background: column.authorColor }}
          >
            {column.authorInitial}
          </div>
          <span className="kv-card-author">{column.author}</span>
          <span className="kv-card-dot">·</span>
          <span className="kv-card-date">{formatDate(column.publishedAt)}</span>
          {column.readTime > 0 && (
            <>
              <span className="kv-card-dot">·</span>
              <span className="kv-card-read">{column.readTime} min</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

/** カテゴリ別セクション見出し（「気持ちの整理」「取材レポート」等） */
function CategorySectionHeader({
  category,
  count,
  onSeeAll,
  showSeeAll,
}: {
  category: string;
  count: number;
  onSeeAll: () => void;
  showSeeAll: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 32,
        marginBottom: 14,
        paddingBottom: 8,
        borderBottom: "1px solid var(--pale)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h3
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 17,
            color: "var(--ink)",
            fontWeight: 500,
            margin: 0,
            letterSpacing: ".04em",
          }}
        >
          {category}
        </h3>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: "#8B7355",
            letterSpacing: ".1em",
          }}
        >
          {count} 件
        </span>
      </div>
      {showSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          style={{
            background: "none",
            border: "none",
            color: "#8B7355",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: ".06em",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          もっと見る
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 7h10M7 2l5 5-5 5" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function ColumnsClient({ columns }: { columns: ColumnMeta[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("すべて");

  // 「すべて」モード用：featured ピックアップ + カテゴリ別グルーピング
  const featuredPicks = columns.filter((c) => c.featured).slice(0, 3);
  const byCategory: Record<string, ColumnMeta[]> = {};
  for (const col of columns) {
    if (!byCategory[col.category]) byCategory[col.category] = [];
    byCategory[col.category].push(col);
  }

  // 個別カテゴリモード用：フラットフィルタ結果
  const filtered =
    activeCategory === "すべて"
      ? columns
      : columns.filter((c) => c.category === activeCategory);

  const isAllMode = activeCategory === "すべて";

  return (
    <>
      {/* セクション見出し */}
      <div className="kv-section-head">
        <div className="kv-section-divider" />
        <h2 className="kv-section-title">
          <em>read all</em>
        </h2>
        <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
          記事 <span style={{ color: "#8B7355" }}>{columns.length}</span> 件
        </div>
        <div className="kv-section-divider" />
      </div>

      {/* カテゴリピル */}
      <div className="kv-filter-bar">
        <div className="kv-filter-row" role="tablist" aria-label="カテゴリフィルター">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`kv-pill ${activeCategory === cat ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="kv-grid-wrap">
        {isAllMode ? (
          /* 「すべて」モード：ピックアップ枠 + カテゴリ別セクション */
          <>
            {featuredPicks.length > 0 && (
              <section>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      letterSpacing: ".22em",
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Editor&apos;s Pick
                  </h3>
                  <span style={{ fontSize: 11, color: "var(--mid)", fontFamily: "var(--font-mincho)" }}>
                    編集部おすすめ
                  </span>
                </div>
                <div
                  className="kv-grid"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  }}
                >
                  {featuredPicks.map((col) => (
                    <ColumnCard key={`pick-${col.slug}`} column={col} pickup />
                  ))}
                </div>
              </section>
            )}

            {CATEGORY_ORDER.map((cat) => {
              const items = byCategory[cat] ?? [];
              if (items.length === 0) return null;
              const preview = items.slice(0, SECTION_PREVIEW_COUNT);
              const hasMore = items.length > SECTION_PREVIEW_COUNT;
              return (
                <section key={cat}>
                  <CategorySectionHeader
                    category={cat}
                    count={items.length}
                    showSeeAll={hasMore}
                    onSeeAll={() => {
                      setActiveCategory(cat);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                  <div
                    className="kv-grid"
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    }}
                  >
                    {preview.map((col) => (
                      <ColumnCard key={col.slug} column={col} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        ) : (
          /* 個別カテゴリモード：フラットなグリッド */
          <>
            {filtered.length === 0 ? (
              <div className="kv-empty">
                <p>該当する記事が見つかりませんでした。</p>
                <button
                  type="button"
                  className="kv-pill"
                  onClick={() => setActiveCategory("すべて")}
                >
                  フィルターをリセット
                </button>
              </div>
            ) : (
              <div
                className="kv-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                }}
              >
                {filtered.map((col) => (
                  <ColumnCard key={col.slug} column={col} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
