"use client";

import Link from "next/link";
import type { Agency } from "@/lib/data";

type Props = {
  agency: Agency | undefined;
  counselorCount: number;
  fallbackName: string;
  fallbackAddress: string;
};

export default function AgencyCardBlock({ agency, counselorCount, fallbackName, fallbackAddress }: Props) {
  if (!agency) {
    return (
      <div
        style={{
          background: "var(--pale)",
          borderRadius: 14,
          padding: "20px 24px",
          border: "1px solid var(--light)",
        }}
      >
        <p style={{ fontFamily: "var(--font-mincho)", fontSize: 15, color: "var(--ink)", marginBottom: 4 }}>
          {fallbackName}
        </p>
        <p style={{ fontSize: 11, color: "var(--muted)" }}>{fallbackAddress}</p>
      </div>
    );
  }

  const minAdmission = Math.min(...agency.plans.map((p) => p.admission));

  return (
    <Link
      href={`/agencies/${agency.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        background: "var(--white)",
        border: "1px solid var(--light)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "transform .25s, box-shadow .25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 48px rgba(0,0,0,.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
      }}
    >
      {/* キャンペーンバナー */}
      {agency.campaign && (
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
            {agency.campaign}
          </span>
        </div>
      )}

      {/* サムネイル */}
      <div
        style={{
          height: 100,
          background: agency.gradient,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
          <path
            d="M8 44V20L24 8l16 12v24H32V30H16v14H8z"
            stroke="rgba(255,255,255,.6)"
            strokeWidth="1.5"
            fill="rgba(255,255,255,.1)"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", padding: "0 12px" }}>
          {agency.type.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 9,
                letterSpacing: ".15em",
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
      <div style={{ padding: "16px 20px 20px" }}>
        <p
          style={{
            fontFamily: "Noto Sans JP, sans-serif",
            fontSize: 15,
            color: "var(--ink)",
            marginBottom: 4,
          }}
        >
          {agency.name}
        </p>
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{agency.area}</p>
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
          入会金 {minAdmission.toLocaleString("ja-JP")}円〜
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="11" height="11" viewBox="0 0 12 12">
                <path
                  d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z"
                  fill={s <= Math.round(agency.rating) ? "var(--accent)" : "var(--light)"}
                />
              </svg>
            ))}
          </span>
          <span style={{ fontSize: 13, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
            {agency.rating}
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>（{agency.reviewCount}件）</span>
        </div>

        <p style={{ fontSize: 11, color: "var(--muted)" }}>在籍カウンセラー {counselorCount}名</p>
      </div>
    </Link>
  );
}
