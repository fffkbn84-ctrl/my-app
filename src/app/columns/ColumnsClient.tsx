"use client";

import { useState } from "react";
import Link from "next/link";
import type { ColumnMeta } from "@/lib/columns";
import WeatherColumnThumb from "@/components/columns/WeatherColumnThumb";
import type { WeatherKey } from "@/app/kinda-note/data/weatherDescriptions";

const CATEGORIES = ["すべて", "結婚相談所の選び方", "気持ちの整理", "取材レポート", "お見合い準備", "デートプラン", "お見合いと交際のこと"] as const;
type CategoryKey = (typeof CATEGORIES)[number];

/** カテゴリ別表示順（「すべて」モードでセクションを並べる順番） */
const CATEGORY_ORDER: Exclude<CategoryKey, "すべて">[] = [
  "結婚相談所の選び方",
  "気持ちの整理",
  "取材レポート",
  "お見合い準備",
  "デートプラン",
  "お見合いと交際のこと",
];

/** 「すべて」モードでカテゴリセクションにカードで出す最大件数。
    超えた分は下の `.kv-more-links` にテキストリンクで並べる（全件が必ずどちらかに出る）。 */
const SECTION_PREVIEW_COUNT = 6;

/* ============================================================================
   TODO（恒久対応）: カテゴリアーカイブ + ページネーションへの移行
   ----------------------------------------------------------------------------
   いまの `.kv-more-links`（プレビュー6枚に入らなかった記事のテキストリンク一覧）は
   GSC のインデックス停滞を止めるための **応急処置** であって、恒久的な設計ではない。

   【なぜ応急処置なのか】
   記事が増えるほどテキストリンクが一方的に伸びる。スマホは1カラムなので、
   「気持ちの整理」が 40 本になった時点でリンクだけで画面数スクロール分になる。

   【なぜ今これで良いのか】
   2026-09-13 時点で GSC の未登録 84 件の内訳が「検出 - インデックス未登録」78 件
   ＝ 未クロールの渋滞だった。そこに新規 URL を足すのは順序が逆なので、
   **新規 URL 0 本**で全記事を深さ2に引き上げるこの方法を先に採った。

   【移行の引き金】次のどちらか早いほう
     - GSC の登録済みページ数が 50 本を超えたら（＝クロールが回り始めた証拠）
     - どれか1カテゴリの `items.length - SECTION_PREVIEW_COUNT` が 25 を超えたら

   【移行先の形】
     /columns                        ハブ（各カテゴリのプレビュー6枚）
       └ /columns/category/[slug]    アーカイブ1ページ目（24本・カードのグリッド）
           └ /columns/category/[slug]/2, /3 ...

   【Google の要件（3点だけ）】
     1. ページ送りは必ず `<a href>`。onClick でのクライアント状態切り替えは不可
        （まさにこの一覧の「もっと見る」がそれで、15本が深さ3に沈んでいた）
     2. 各ページは自己参照 canonical。2ページ目を1ページ目に canonical しない
        （やると2ページ目以降の記事がインデックスから消える）
     3. rel="next" / rel="prev" は不要（Google が2019年にサポート廃止を公表）

   【移行したら消すもの】
     - この TODO ブロック
     - 下の `hasMore && (<nav className="kv-more-links">...)` ブロック
     - globals.css の `.kv-more-links*` 一式
   ========================================================================== */

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
  // 「気持ちの整理」カテゴリ (= weatherKey あり) はポラロイド風サムネを使う。
  // それ以外（実務コラム）はサムネが無地のグラデーションで中身が読めなかったため、
  // タイトルを組んだ活字カードにする。タイトルは記事ごとに違うので一覧が単調にならない。
  const hasWeatherKey = !!column.weatherKey;
  const isTypographic = !hasWeatherKey;

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
        {isTypographic && (
          <div className="kv-thumb-type">
            {/* 地のグラデーションが濃い記事でも文字が沈まないよう、薄い白のヴェールを敷く */}
            <span className="kv-thumb-veil" aria-hidden />
            <p
              className={`kv-thumb-title ${
                pickup ? "kv-thumb-title-featured" : ""
              }`}
            >
              {column.title}
            </p>
          </div>
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

      {/* テキストエリア。
          カテゴリはカード外の見出し（「すべて」モードのセクション見出し／
          個別カテゴリモードのピル）で既に示されているため、通常のカードには出さない。
          カテゴリが混ざる Editor's Pick の枠でだけ意味を持つので、そこだけ残す。 */}
      <div className={`kv-card-body ${isTypographic ? "kv-card-body-slim" : ""}`}>
        {pickup && <span className="kv-card-tag">{column.category}</span>}

        {/* 活字カードはサムネ側でタイトルを見せているので、ここでは繰り返さない */}
        {!isTypographic && <p className="kv-card-title">{column.title}</p>}

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
          {/* カード内の唯一のアクション。トップページのコラムカードと同じ作法。
              説明文（description）は検索スニペット用に書かれた80〜110字で、
              カード内で2行に切ると文の途中で切れるため置かない。 */}
          <span className="kv-card-cta">
            読む
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7h8M7 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
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

                  {/* プレビュー6枚に入らなかった記事へのテキストリンク。
                      「もっと見る」は onClick でクライアント状態を切り替えるだけの
                      ボタンなのでクローラーからはリンクが存在せず、
                      「気持ちの整理」の16本などがトップから深さ3のページになっていた。
                      ここに実リンクを置いて全記事を深さ2に引き上げる（2026-09-13）。 */}
                  {hasMore && (
                    <nav
                      className="kv-more-links"
                      aria-label={`${cat}の他の記事`}
                    >
                      <p className="kv-more-links-label">このカテゴリの他の記事</p>
                      <ul className="kv-more-links-list">
                        {items.slice(SECTION_PREVIEW_COUNT).map((col) => (
                          <li key={col.slug}>
                            <Link href={`/columns/${col.slug}`}>{col.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
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
