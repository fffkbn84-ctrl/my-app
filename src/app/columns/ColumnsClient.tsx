"use client";

import { useState } from "react";
import Link from "next/link";
import type { ColumnMeta } from "@/lib/columns";

const CATEGORIES = ["すべて", "気持ちの整理", "取材レポート", "お見合い準備", "デートプラン"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function ColumnCard({
  column,
  featured = false,
}: {
  column: ColumnMeta;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/columns/${column.slug}`}
      className={`kv-card ${featured ? "kv-card-featured" : ""}`}
    >
      {/* サムネイル */}
      <div
        className="kv-card-thumb"
        style={{
          background: column.thumbnail,
          height: featured ? "260px" : "160px",
        }}
      />

      {/* テキストエリア */}
      <div className="kv-card-body">
        <span className="kv-card-tag">{column.category}</span>

        <p className={`kv-card-title ${featured ? "kv-card-title-featured" : ""}`}>
          {column.title}
        </p>

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

export default function ColumnsClient({ columns }: { columns: ColumnMeta[] }) {
  const [activeCategory, setActiveCategory] = useState("すべて");

  const filtered =
    activeCategory === "すべて"
      ? columns
      : columns.filter((c) => c.category === activeCategory);

  const featured = filtered.find((c) => c.featured);
  const rest = filtered.filter((c) => !c.featured || c !== featured);

  return (
    <>
      {/* セクション見出し */}
      <div className="kv-section-head">
        <div className="kv-section-divider" />
        <h2 className="kv-section-title">
          <em>read all</em>
        </h2>
        <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 4 }}>
          記事 <span style={{ color: "#8B7355" }}>{filtered.length}</span> 件
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

      {/* 記事グリッド */}
      <div className="kv-grid-wrap">
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
              gridTemplateColumns: featured
                ? "5fr 3fr"
                : "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {featured && <ColumnCard column={featured} featured />}
            {rest.map((col) => (
              <ColumnCard key={col.slug} column={col} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
