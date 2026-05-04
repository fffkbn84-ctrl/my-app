"use client";

import { useState } from "react";
import Link from "next/link";
import type { ColumnMeta } from "@/lib/columns";
import Breadcrumb from "@/components/ui/Breadcrumb";

const CATEGORIES = ["すべて", "取材レポート", "お見合い準備", "デートプラン"];

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
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        textDecoration: "none",
        transition: "box-shadow 0.2s, transform 0.2s",
        gridRow: featured ? "1 / 3" : undefined,
      }}
      className="col-card"
    >
      {/* サムネイル */}
      <div
        style={{
          background: column.thumbnail,
          height: featured ? "260px" : "160px",
          flexShrink: 0,
        }}
      />

      {/* テキストエリア */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {/* カテゴリタグ */}
        <span
          style={{
            display: "inline-block",
            border: "1px solid var(--accent)",
            borderRadius: "20px",
            padding: "3px 12px",
            fontSize: "10px",
            color: "var(--accent)",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.04em",
            width: "fit-content",
          }}
        >
          {column.category}
        </span>

        {/* タイトル */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: featured ? "16px" : "14px",
            lineHeight: 1.7,
            color: "var(--black)",
            flex: 1,
          }}
        >
          {column.title}
        </p>

        {/* 著者・日付・読了時間 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: column.authorColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#fff",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {column.authorInitial}
          </div>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            {column.author}
          </span>
          <span style={{ color: "var(--light)", fontSize: "10px" }}>·</span>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            {formatDate(column.publishedAt)}
          </span>
          <span style={{ color: "var(--light)", fontSize: "10px" }}>·</span>
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            {column.readTime} min
          </span>
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
    <div style={{ background: "var(--white)", minHeight: "100vh" }}>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "コラム" }]} />
      {/* ヘッダーセクション */}
      <section
        style={{
          padding: "80px 24px 56px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "var(--accent)",
            textTransform: "lowercase",
            marginBottom: "16px",
          }}
        >
          our column
        </p>
        <h1
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 400,
            color: "var(--black)",
            lineHeight: 1.5,
            marginBottom: "16px",
          }}
        >
          全国に足を運んで、書いています
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--mid)",
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          相談所・カフェ・レストランを実際に訪問取材。リアルな温度感をお届けします。
        </p>
      </section>

      {/* カテゴリフィルタータブ */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 24px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: activeCategory === cat ? "1px solid var(--accent)" : "1px solid var(--light)",
                background: activeCategory === cat ? "var(--accent)" : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--mid)",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 300,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 記事グリッド */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {filtered.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>
            記事がありません
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: featured
                ? "5fr 3fr"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
              alignItems: "start",
            }}
            className="cols-grid"
          >
            {featured && <ColumnCard column={featured} featured />}
            {rest.map((col) => (
              <ColumnCard key={col.slug} column={col} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .col-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .cols-grid {
            grid-template-columns: 1fr !important;
          }
          .col-card {
            grid-row: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
