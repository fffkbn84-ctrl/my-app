"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AGENCIES, COUNSELORS, type Counselor, type Agency } from "@/lib/data";
import Pagination from "@/components/ui/Pagination";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

const ITEMS_PER_PAGE = 12;

/* ────────────────────────────────────────────────────────────
   ユーティリティ
──────────────────────────────────────────────────────────── */
function formatPrice(n: number) {
  return n.toLocaleString("ja-JP") + "円";
}

function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12">
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
   カウンセラーカード
──────────────────────────────────────────────────────────── */
function CounselorCard({ c }: { c: Counselor }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/counselors/${c.id}`)}
      style={{
        background: "var(--white)",
        border: "1px solid var(--light)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "transform .25s, box-shadow .25s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 56px rgba(0,0,0,.09)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* キャンペーンバナー */}
      {c.campaign && (
        <div
          style={{
            background: "rgba(200,169,122,.12)",
            borderBottom: "1px solid rgba(200,169,122,.25)",
            padding: "7px 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1.1 3.4H10L7.5 6.6l.9 3L6 8.1l-2.4 1.5.9-3L2 5.4h2.9z" fill="var(--accent)" />
          </svg>
          <span style={{ fontSize: 11, color: "var(--accent)", letterSpacing: ".04em" }}>
            {c.campaign}
          </span>
        </div>
      )}
      {/* トップ */}
      <div
        style={{
          background: c.gradient,
          padding: "28px 20px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* SVGアバター */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(255,255,255,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="5" fill={c.svgColor} opacity=".65" />
            <path
              d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9"
              stroke={c.svgColor}
              strokeWidth="1.2"
              fill="none"
              opacity=".45"
            />
          </svg>
        </div>

        {/* 名前 */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: 17,
              color: "var(--ink)",
              letterSpacing: ".04em",
            }}
          >
            {c.name}
          </p>
          <p style={{ fontSize: 10, color: "var(--mid)", marginTop: 2 }}>{c.kana}</p>
        </div>

        {/* 所属・エリア */}
        <p style={{ fontSize: 11, color: "var(--mid)", textAlign: "center" }}>
          {c.agencyName}
          <span style={{ margin: "0 4px", color: "var(--light)" }}>|</span>
          {c.area}
        </p>

        {/* 経験年数バッジ */}
        <span
          style={{
            fontSize: 10,
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: 20,
            padding: "2px 10px",
            letterSpacing: ".05em",
            background: "rgba(200,169,122,.08)",
          }}
        >
          経験 {c.experience}年
        </span>

        {/* オンライン対応 */}
        {c.online && (
          <span
            style={{
              fontSize: 10,
              color: "var(--green)",
              border: "1px solid var(--green)",
              borderRadius: 20,
              padding: "2px 10px",
              background: "rgba(122,158,135,.08)",
            }}
          >
            オンライン対応可
          </span>
        )}
      </div>

      {/* ボディ */}
      <div style={{ padding: "16px 20px 20px" }}>
        {/* タグ */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {c.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                color: "var(--mid)",
                border: "1px solid var(--light)",
                borderRadius: 20,
                padding: "3px 9px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* メッセージ */}
        <p
          style={{
            fontSize: 12,
            color: "var(--mid)",
            lineHeight: 1.7,
            borderLeft: "2px solid var(--accent)",
            paddingLeft: 10,
            marginBottom: 12,
            fontStyle: "italic",
          }}
        >
          {c.message}
        </p>

        {/* 評価 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <StarRating rating={c.rating} />
          <span style={{ fontSize: 13, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
            {c.rating}
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>（{c.reviewCount}件）</span>
        </div>

        {/* 料金目安 */}
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 16 }}>
          入会金 {formatPrice(c.minAdmission)}〜 / 月額 {formatPrice(c.monthlyFrom)}〜
        </p>

        {/* CTAボタン */}
        <Link
          href={`/counselors/${c.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: "100%",
            padding: "11px 0",
            background: "var(--black)",
            color: "var(--white)",
            borderRadius: 50,
            fontSize: 12,
            letterSpacing: ".08em",
            fontFamily: "var(--font-sans)",
            transition: "opacity .2s",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = ".8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
        >
          面談を予約する
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   相談所カード
──────────────────────────────────────────────────────────── */
function AgencyCard({ a }: { a: Agency }) {
  const router = useRouter();
  const minAdmission = Math.min(...a.plans.map((p) => p.admission));
  const counselorCount = COUNSELORS.filter((c) => c.agencyId === a.id).length;

  return (
    <div
      onClick={() => router.push(`/agencies/${a.id}`)}
      style={{
        background: "var(--white)",
        border: "1px solid var(--light)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "transform .25s, box-shadow .25s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 56px rgba(0,0,0,.09)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* キャンペーンバナー */}
      {a.campaign && (
        <div
          style={{
            background: "rgba(200,169,122,.12)",
            borderBottom: "1px solid rgba(200,169,122,.25)",
            padding: "7px 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1.1 3.4H10L7.5 6.6l.9 3L6 8.1l-2.4 1.5.9-3L2 5.4h2.9z" fill="var(--accent)" />
          </svg>
          <span style={{ fontSize: 11, color: "var(--accent)", letterSpacing: ".04em" }}>
            {a.campaign}
          </span>
        </div>
      )}
      {/* サムネイル */}
      <div
        style={{
          height: 140,
          background: a.gradient,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          position: "relative",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M8 44V20L24 8l16 12v24H32V30H16v14H8z"
            stroke="rgba(255,255,255,.6)"
            strokeWidth="1.5"
            fill="rgba(255,255,255,.1)"
            strokeLinejoin="round"
          />
        </svg>

        {/* 種別タグ */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", padding: "0 12px" }}>
          {a.type.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 9,
                letterSpacing: ".18em",
                color: "rgba(0,0,0,.5)",
                border: "1px solid rgba(0,0,0,.2)",
                borderRadius: 20,
                padding: "2px 8px",
                background: "rgba(255,255,255,.5)",
                textTransform: "uppercase",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ボディ */}
      <div style={{ padding: "16px 18px 20px" }}>
        <p
          style={{
            fontFamily: "Noto Sans JP, sans-serif",
            fontWeight: 400,
            fontSize: 15,
            color: "var(--ink)",
            marginBottom: 4,
          }}
        >
          {a.name}
        </p>
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{a.area}</p>
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
          入会金 {formatPrice(minAdmission)}〜
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <StarRating rating={a.rating} />
          <span style={{ fontSize: 13, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
            {a.rating}
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>（{a.reviewCount}件）</span>
        </div>

        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14 }}>
          在籍カウンセラー {counselorCount}名
        </p>

        <Link
          href={`/agencies/${a.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: ".04em",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          詳細を見る
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   フィルターSelect
──────────────────────────────────────────────────────────── */
const filterSelectStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid var(--light)",
  borderRadius: 8,
  fontFamily: "Noto Sans JP, sans-serif",
  fontSize: 13,
  color: "var(--ink)",
  background: "white",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23A0A0A0' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 32,
};

const filterInputStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid var(--light)",
  borderRadius: 8,
  fontFamily: "Noto Sans JP, sans-serif",
  fontSize: 13,
  color: "var(--ink)",
  background: "white",
  outline: "none",
  width: "100%",
};

/* ────────────────────────────────────────────────────────────
   メインコンテンツ
──────────────────────────────────────────────────────────── */
export default function SearchContent() {
  const searchParams = useSearchParams();

  /* タブ初期値（URL param から） */
  const initialTab = searchParams.get("tab") === "agency" ? "agency" : "counselor";
  const initialAgency = searchParams.get("agency") ?? "";

  const [activeTab, setActiveTab] = useState<"counselor" | "agency">(initialTab);

  /* カウンセラーフィルター */
  const [cQuery, setCQuery] = useState("");
  const [cArea, setCArea] = useState("");
  const [cSpecialty, setCSpecialty] = useState("");
  const [cPrice, setCPrice] = useState("");
  const [cOnline, setCOnline] = useState(false);
  const [cSort, setCSort] = useState("rating");
  const [cAgencyId, setCAgencyId] = useState(initialAgency);

  /* 相談所フィルター */
  const [aQuery, setAQuery] = useState("");
  const [aArea, setAArea] = useState("");
  const [aType, setAType] = useState("");
  const [aPrice, setAPrice] = useState("");
  const [aSort, setASort] = useState("rating");

  /* ページネーション */
  const [cPage, setCPage] = useState(1);
  const [aPage, setAPage] = useState(1);

  /* URL param変化に追従 */
  useEffect(() => {
    const tab = searchParams.get("tab");
    const agency = searchParams.get("agency") ?? "";
    if (tab === "agency") setActiveTab("agency");
    else if (tab === "counselor") setActiveTab("counselor");
    setCAgencyId(agency);
  }, [searchParams]);

  /* フィルター変更時にページをリセット */
  useEffect(() => { setCPage(1); }, [cQuery, cArea, cSpecialty, cPrice, cOnline, cSort, cAgencyId]);
  useEffect(() => { setAPage(1); }, [aQuery, aArea, aType, aPrice, aSort, activeTab]);

  /* カウンセラーフィルタリング */
  const filteredCounselors = useMemo(() => {
    let list = [...COUNSELORS];

    if (cAgencyId) list = list.filter((c) => c.agencyId === Number(cAgencyId));

    if (cQuery) {
      const q = cQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.includes(q) ||
          c.kana.includes(q) ||
          c.agencyName.includes(q) ||
          c.tags.some((t) => t.includes(q))
      );
    }

    if (cArea) list = list.filter((c) => c.area.includes(cArea));

    if (cSpecialty) list = list.filter((c) => c.tags.some((t) => t.includes(cSpecialty)));

    if (cPrice === "low") list = list.filter((c) => c.minAdmission < 80000);
    else if (cPrice === "mid") list = list.filter((c) => c.minAdmission >= 80000 && c.minAdmission < 120000);
    else if (cPrice === "high") list = list.filter((c) => c.minAdmission >= 120000);

    if (cOnline) list = list.filter((c) => c.online);

    if (cSort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (cSort === "reviews") list.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (cSort === "experience") list.sort((a, b) => b.experience - a.experience);

    return list;
  }, [cQuery, cArea, cSpecialty, cPrice, cOnline, cSort, cAgencyId]);

  /* 相談所フィルタリング */
  const filteredAgencies = useMemo(() => {
    let list = [...AGENCIES];

    if (aQuery) {
      const q = aQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.includes(q) ||
          a.description.includes(q) ||
          a.features.some((f) => f.includes(q))
      );
    }

    if (aArea) list = list.filter((a) => a.area.includes(aArea));

    if (aType) list = list.filter((a) => a.type.includes(aType));

    if (aPrice === "low") list = list.filter((a) => Math.min(...a.plans.map((p) => p.admission)) < 80000);
    else if (aPrice === "mid")
      list = list.filter((a) => {
        const min = Math.min(...a.plans.map((p) => p.admission));
        return min >= 80000 && min < 120000;
      });
    else if (aPrice === "high")
      list = list.filter((a) => Math.min(...a.plans.map((p) => p.admission)) >= 120000);

    if (aSort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (aSort === "reviews") list.sort((a, b) => b.reviewCount - a.reviewCount);

    return list;
  }, [aQuery, aArea, aType, aPrice, aSort]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* ページヘッダー */}
      <section
        style={{
          background: "var(--pale)",
          borderBottom: "1px solid var(--light)",
          padding: "88px 0 40px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".28em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Search
          </p>
          <h1
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "clamp(26px,4vw,40px)",
              color: "var(--ink)",
              fontWeight: 400,
            }}
          >
            相談所・カウンセラーを探す
          </h1>
        </div>
      </section>

      {/* タブ */}
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "32px 24px 0",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            background: "var(--pale)",
            borderRadius: 12,
            padding: 4,
            gap: 2,
            marginBottom: 32,
          }}
        >
          {(
            [
              { key: "counselor", label: "カウンセラーから探す" },
              { key: "agency", label: "相談所から探す" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 24px",
                borderRadius: 9,
                fontSize: 13,
                fontFamily: "Noto Sans JP, sans-serif",
                border: "none",
                cursor: "pointer",
                transition: "all .2s",
                background: activeTab === tab.key ? "var(--white)" : "transparent",
                color: activeTab === tab.key ? "var(--ink)" : "var(--mid)",
                boxShadow: activeTab === tab.key ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                fontWeight: activeTab === tab.key ? 500 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ カウンセラータブ ═══ */}
        {activeTab === "counselor" && (
          <>
            {/* フィルター */}
            <div
              style={{
                background: "var(--pale)",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 32,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {/* テキスト検索 */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ position: "relative" }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="1.4"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <circle cx="6.5" cy="6.5" r="4.5" />
                    <path d="M10 10l3 3" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="名前・タグ・相談所名で検索"
                    value={cQuery}
                    onChange={(e) => setCQuery(e.target.value)}
                    style={{ ...filterInputStyle, paddingLeft: 36 }}
                  />
                </div>
              </div>

              <select value={cArea} onChange={(e) => setCArea(e.target.value)} style={filterSelectStyle}>
                <option value="">すべてのエリア</option>
                <option value="東京">東京</option>
                <option value="大阪">大阪</option>
                <option value="名古屋">名古屋</option>
              </select>

              <select value={cSpecialty} onChange={(e) => setCSpecialty(e.target.value)} style={filterSelectStyle}>
                <option value="">得意分野：すべて</option>
                <option value="傾聴が得意">傾聴が得意</option>
                <option value="再婚OK">再婚OK</option>
                <option value="20代対応">20代対応</option>
                <option value="40代サポート">40代サポート</option>
                <option value="男性カウンセラー">男性カウンセラー</option>
              </select>

              <select value={cPrice} onChange={(e) => setCPrice(e.target.value)} style={filterSelectStyle}>
                <option value="">料金帯：すべて</option>
                <option value="low">〜8万円</option>
                <option value="mid">8〜12万円</option>
                <option value="high">12万円〜</option>
              </select>

              <select value={cSort} onChange={(e) => setCSort(e.target.value)} style={filterSelectStyle}>
                <option value="rating">口コミ評価が高い順</option>
                <option value="reviews">口コミ件数が多い順</option>
                <option value="experience">経験年数が長い順</option>
              </select>

              {/* オンライントグル */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setCOnline(!cOnline)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: "none",
                    background: cOnline ? "var(--green)" : "var(--light)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background .2s",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: cOnline ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "white",
                      transition: "left .2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                    }}
                  />
                </button>
                <span style={{ fontSize: 12, color: "var(--mid)" }}>オンライン対応のみ</span>
              </div>

              {/* agencyフィルター表示 */}
              {cAgencyId && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                      borderRadius: 20,
                      padding: "3px 10px",
                      background: "rgba(200,169,122,.08)",
                    }}
                  >
                    {AGENCIES.find((a) => a.id === Number(cAgencyId))?.name ?? ""}
                  </span>
                  <button
                    onClick={() => setCAgencyId("")}
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    解除
                  </button>
                </div>
              )}
            </div>

            {/* 件数 */}
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
              {filteredCounselors.length}名のカウンセラーが見つかりました
            </p>

            {/* カウンセラーグリッド */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
                paddingBottom: 32,
              }}
            >
              {filteredCounselors.length > 0 ? (
                filteredCounselors.slice((cPage - 1) * ITEMS_PER_PAGE, cPage * ITEMS_PER_PAGE).map((c) => <CounselorCard key={c.id} c={c} />)
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "80px 0",
                    color: "var(--muted)",
                    fontSize: 14,
                  }}
                >
                  条件に合うカウンセラーが見つかりませんでした。
                  <br />
                  <span style={{ fontSize: 12 }}>フィルターを変更してお試しください。</span>
                </div>
              )}
            </div>
            <Pagination
              page={cPage}
              total={filteredCounselors.length}
              perPage={ITEMS_PER_PAGE}
              onChange={setCPage}
            />
          </>
        )}

        {/* ═══ 相談所タブ ═══ */}
        {activeTab === "agency" && (
          <>
            {/* フィルター */}
            <div
              style={{
                background: "var(--pale)",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 32,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ position: "relative" }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="1.4"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <circle cx="6.5" cy="6.5" r="4.5" />
                    <path d="M10 10l3 3" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="相談所名・特徴で検索"
                    value={aQuery}
                    onChange={(e) => setAQuery(e.target.value)}
                    style={{ ...filterInputStyle, paddingLeft: 36 }}
                  />
                </div>
              </div>

              <select value={aArea} onChange={(e) => setAArea(e.target.value)} style={filterSelectStyle}>
                <option value="">すべてのエリア</option>
                <option value="東京">東京</option>
                <option value="大阪">大阪</option>
                <option value="名古屋">名古屋</option>
              </select>

              <select value={aType} onChange={(e) => setAType(e.target.value)} style={filterSelectStyle}>
                <option value="">種別：すべて</option>
                <option value="仲人型">仲人型</option>
                <option value="データ婚活">データ婚活</option>
                <option value="オンライン専門">オンライン専門</option>
              </select>

              <select value={aPrice} onChange={(e) => setAPrice(e.target.value)} style={filterSelectStyle}>
                <option value="">料金帯：すべて</option>
                <option value="low">〜8万円</option>
                <option value="mid">8〜12万円</option>
                <option value="high">12万円〜</option>
              </select>

              <select value={aSort} onChange={(e) => setASort(e.target.value)} style={filterSelectStyle}>
                <option value="rating">口コミ評価が高い順</option>
                <option value="reviews">口コミ件数が多い順</option>
              </select>
            </div>

            {/* 件数 */}
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
              {filteredAgencies.length}件の相談所が見つかりました
            </p>

            {/* 相談所グリッド */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
                paddingBottom: 32,
              }}
            >
              {filteredAgencies.length > 0 ? (
                filteredAgencies.slice((aPage - 1) * ITEMS_PER_PAGE, aPage * ITEMS_PER_PAGE).map((a) => <AgencyCard key={a.id} a={a} />)
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "80px 0",
                    color: "var(--muted)",
                    fontSize: 14,
                  }}
                >
                  条件に合う相談所が見つかりませんでした。
                  <br />
                  <span style={{ fontSize: 12 }}>フィルターを変更してお試しください。</span>
                </div>
              )}
            </div>
            <Pagination
              page={aPage}
              total={filteredAgencies.length}
              perPage={ITEMS_PER_PAGE}
              onChange={setAPage}
            />
          </>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
}
