"use client";

import Link from "next/link";
import { isCampaignActive, isNewShop, type Agency, type FeePlan } from "@/lib/data";

/**
 * カウンセラー詳細の「所属相談所」枠で使うカード。
 * mock 相談所（フル Agency 型）と Supabase 相談所（Partial）の両方に対応。
 * 必須は id と name のみ。他は無ければ表示をスキップする。
 */
// id は mock (number) / Supabase (UUID string) の両対応
type AgencyCard = Omit<Partial<Agency>, "id"> & { id: number | string; name: string };

type Props = {
  agency: AgencyCard | undefined;
  fallbackName: string;
  fallbackAddress: string;
};

/**
 * 月会費の最低額を取り出す。
 * - mock 相談所は plans[].monthly から最小値
 * - Supabase 相談所は fees[].items[] から「月会費系」項目（suffix='/月' か
 *   ラベルに「月会費」「月額」を含む）の最小値
 * - 該当なし or 0 円のみなら null
 */
function getMonthlyMin(agency: AgencyCard): number | null {
  if (agency.plans && agency.plans.length > 0) {
    const candidates = agency.plans
      .map((p) => p.monthly)
      .filter((m) => Number.isFinite(m) && m > 0);
    if (candidates.length > 0) return Math.min(...candidates);
  }
  if (agency.fees && agency.fees.length > 0) {
    let min: number | null = null;
    for (const plan of agency.fees as FeePlan[]) {
      for (const item of plan.items) {
        const monthly =
          (item.suffix && item.suffix.includes("/月")) ||
          (item.label && /月会費|月額|マンスリー/i.test(item.label));
        if (monthly && item.amount > 0) {
          if (min === null || item.amount < min) min = item.amount;
        }
      }
    }
    return min;
  }
  return null;
}

export default function AgencyCardBlock({ agency, fallbackName, fallbackAddress }: Props) {
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

  const monthlyMin = getMonthlyMin(agency);
  // Supabase agency は gradient / type 等を持たないので汎用 fallback を用意
  const gradient = agency.gradient ?? "linear-gradient(135deg,#F4ECE0,#E8DCC8)";
  const types = agency.type ?? [];
  const rating = agency.rating ?? 0;
  const reviewCount = agency.reviewCount ?? 0;

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
      {/* キャンペーンバナー（campaignText 優先、期限切れは非表示） */}
      {(() => {
        const banner = isCampaignActive(agency.campaignText, agency.campaignExpiresAt)
          ? agency.campaignText
          : agency.campaign;
        if (!banner) return null;
        return (
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
              {banner}
            </span>
          </div>
        );
      })()}

      {/* サムネイル */}
      <div
        style={{
          height: 100,
          background: gradient,
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
          {isNewShop(agency.foundedAt) && (
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 9,
                letterSpacing: ".15em",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                borderRadius: 20,
                padding: "2px 8px",
                background: "rgba(255,255,255,.85)",
                fontWeight: 500,
              }}
              title="創業から1年以内の相談所"
            >
              新店舗
            </span>
          )}
          {types.map((t) => (
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
            marginBottom: 6,
          }}
        >
          {agency.name}
        </p>
        {/* エリア + 月会費（横並び・小さく） */}
        {(agency.area || monthlyMin !== null) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "var(--muted)",
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {agency.area && <span>{agency.area}</span>}
            {agency.area && monthlyMin !== null && (
              <span style={{ color: "var(--light)" }}>·</span>
            )}
            {monthlyMin !== null && (
              <span>月会費 {monthlyMin.toLocaleString("ja-JP")}円〜</span>
            )}
          </div>
        )}

        {reviewCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="11" height="11" viewBox="0 0 12 12">
                  <path
                    d="M6 1l1.5 3h3.2L8 6.2l.9 3.3L6 7.8l-2.9 1.7.9-3.3L1.3 4h3.2z"
                    fill={s <= Math.round(rating) ? "var(--accent)" : "var(--light)"}
                  />
                </svg>
              ))}
            </span>
            <span style={{ fontSize: 13, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
              {rating}
            </span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>（{reviewCount}件）</span>
          </div>
        )}
      </div>
    </Link>
  );
}
