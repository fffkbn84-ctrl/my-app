"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AGENCIES, COUNSELORS, type Counselor, type Agency } from "@/lib/data";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 12;

function formatPrice(n: number) {
  return n.toLocaleString("ja-JP") + "円";
}

function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z"
            fill={s <= Math.round(rating) ? "var(--accent)" : "var(--light)"}
          />
        </svg>
      ))}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   相談所カード
──────────────────────────────────────────────────────────── */
function AgencyCard({ a, counselors }: { a: Agency; counselors: Counselor[] }) {
  const router = useRouter();
  const minAdmission = Math.min(...a.plans.map((p) => p.admission));
  const counselorCount = counselors.filter((c) => c.agencyId === a.id).length;

  return (
    <article
      className="agc-card"
      onClick={() => router.push(`/agencies/${a.id}`)}
      role="link"
      tabIndex={0}
      aria-label={`${a.name}の詳細を見る`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/agencies/${a.id}`);
        }
      }}
    >
      {a.campaign && (
        <div className="agc-campaign">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1l1.1 3.4H10L7.5 6.6l.9 3L6 8.1l-2.4 1.5.9-3L2 5.4h2.9z" fill="var(--accent)" />
          </svg>
          <span>{a.campaign}</span>
        </div>
      )}

      <div className="agc-thumb" style={{ background: a.gradient }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M8 44V20L24 8l16 12v24H32V30H16v14H8z"
            stroke="rgba(255,255,255,.6)"
            strokeWidth="1.5"
            fill="rgba(255,255,255,.1)"
            strokeLinejoin="round"
          />
        </svg>
        <div className="agc-types">
          {a.type.map((t) => (
            <span key={t} className="agc-type-pill">{t}</span>
          ))}
        </div>
      </div>

      <div className="agc-body">
        <p className="agc-name">{a.name}</p>
        <p className="agc-meta">{a.area}</p>
        <p className="agc-meta">入会金 {formatPrice(minAdmission)}〜</p>

        <div className="agc-rating">
          <StarRating rating={a.rating} />
          <span className="agc-rating-num">{a.rating}</span>
          <span className="agc-rating-count">（{a.reviewCount}件）</span>
        </div>

        <p className="agc-meta agc-counselor-count">在籍カウンセラー {counselorCount}名</p>

        <Link
          href={`/agencies/${a.id}`}
          className="agc-detail-link"
          onClick={(e) => e.stopPropagation()}
        >
          詳細を見る
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────
   メイン
──────────────────────────────────────────────────────────── */
export default function AgenciesClient({
  agencies = AGENCIES,
  counselors = COUNSELORS,
}: {
  agencies?: Agency[];
  counselors?: Counselor[];
}) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, area, type, price, sort]);

  const filtered = useMemo(() => {
    let list = [...agencies];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.includes(q) ||
          a.description.includes(q) ||
          a.features.some((f) => f.includes(q))
      );
    }
    if (area) list = list.filter((a) => a.area.includes(area));
    if (type) list = list.filter((a) => a.type.includes(type));
    if (price === "low") list = list.filter((a) => Math.min(...a.plans.map((p) => p.admission)) < 80000);
    else if (price === "mid")
      list = list.filter((a) => {
        const min = Math.min(...a.plans.map((p) => p.admission));
        return min >= 80000 && min < 120000;
      });
    else if (price === "high")
      list = list.filter((a) => Math.min(...a.plans.map((p) => p.admission)) >= 120000);

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") list.sort((a, b) => b.reviewCount - a.reviewCount);

    return list;
  }, [agencies, query, area, type, price, sort]);

  return (
    <div className="agc-page">
      {/* フィルター */}
      <div className="agc-filters">
        <div className="agc-search-wrap">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="1.4"
            className="agc-search-icon"
            aria-hidden="true"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <path d="M10 10l3 3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="相談所名・特徴で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="相談所を検索"
            className="agc-search-input"
          />
        </div>

        <div className="agc-filter-row">
          <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="エリア" className="agc-select">
            <option value="">すべてのエリア</option>
            <option value="東京">東京</option>
            <option value="大阪">大阪</option>
            <option value="名古屋">名古屋</option>
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="種別" className="agc-select">
            <option value="">種別：すべて</option>
            <option value="仲人型">仲人型</option>
            <option value="データ婚活">データ婚活</option>
            <option value="オンライン専門">オンライン専門</option>
          </select>

          <select value={price} onChange={(e) => setPrice(e.target.value)} aria-label="料金帯" className="agc-select">
            <option value="">料金帯：すべて</option>
            <option value="low">〜8万円</option>
            <option value="mid">8〜12万円</option>
            <option value="high">12万円〜</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="並び順" className="agc-select">
            <option value="rating">口コミ評価が高い順</option>
            <option value="reviews">口コミ件数が多い順</option>
          </select>
        </div>
      </div>

      {/* 件数 */}
      <p className="agc-count">{filtered.length}件の相談所が見つかりました</p>

      {/* グリッド */}
      <div className="agc-grid">
        {filtered.length > 0 ? (
          filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((a) => (
            <AgencyCard key={a.id} a={a} counselors={counselors} />
          ))
        ) : (
          <div className="agc-empty">
            条件に合う相談所が見つかりませんでした。
            <br />
            <span>フィルターを変更してお試しください。</span>
          </div>
        )}
      </div>

      <Pagination page={page} total={filtered.length} perPage={ITEMS_PER_PAGE} onChange={setPage} />
    </div>
  );
}
