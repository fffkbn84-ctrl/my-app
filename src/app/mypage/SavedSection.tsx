"use client";

import Link from "next/link";
import { useFavoritesList } from "@/hooks/useFavorites";
import type { Counselor, Agency } from "@/lib/data";
import CounselorReelCard from "@/components/kinda-talk/CounselorReelCard";
import CounselorReelModal from "@/components/kinda-talk/CounselorReelModal";
import { useState } from "react";

type Props = {
  allCounselors: Counselor[];
  allAgencies: Agency[];
};

/**
 * マイページの「気になる」一覧セクション。
 * - useFavoritesList でログインユーザー or localStorage の保存を取得
 * - allCounselors / allAgencies と target_id で突き合わせて表示用データに変換
 * - 0 件 / 認証ロード中は何も描画しない
 */
export default function SavedSection({ allCounselors, allAgencies }: Props) {
  const { favorites, loading } = useFavoritesList();
  const [openCounselor, setOpenCounselor] = useState<Counselor | null>(null);

  if (loading) return null;

  const counselorById = new Map<string, Counselor>(
    allCounselors.map((c) => [String(c.id), c]),
  );
  const agencyById = new Map<string, Agency>(
    allAgencies.map((a) => [String(a.id), a]),
  );

  const savedCounselors = favorites
    .filter((f) => f.target_type === "counselor")
    .map((f) => counselorById.get(f.target_id))
    .filter((c): c is Counselor => Boolean(c));

  const savedAgencies = favorites
    .filter((f) => f.target_type === "agency")
    .map((f) => agencyById.get(f.target_id))
    .filter((a): a is Agency => Boolean(a));

  if (savedCounselors.length === 0 && savedAgencies.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: 24 }}>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: ".18em",
          color: "var(--muted)",
          textTransform: "uppercase",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        my saved
      </div>
      <h2
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: 18,
          fontWeight: 500,
          color: "var(--ink)",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        気になる
      </h2>

      {savedCounselors.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader
            label="担当"
            count={savedCounselors.length}
            href="/kinda-talk"
            hrefLabel="さらに探す"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
            }}
          >
            {savedCounselors.map((c) => (
              <CounselorReelCard key={c.id} counselor={c} onOpen={setOpenCounselor} />
            ))}
          </div>
        </div>
      )}

      {savedAgencies.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader
            label="相談所"
            count={savedAgencies.length}
            href="/search?tab=agency"
            hrefLabel="さらに探す"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedAgencies.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.id}`}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 12,
                  background: "var(--pale)",
                  border: "1px solid var(--light)",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "var(--ink)",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: a.gradient ?? "var(--accent-dim)",
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mincho)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {a.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--mid)", marginTop: 2 }}>
                    {a.area} · ★{a.rating.toFixed(1)} ({a.reviewCount})
                  </div>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "var(--mid)" }}
                >
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      <CounselorReelModal counselor={openCounselor} onClose={() => setOpenCounselor(null)} />
    </section>
  );
}

function SectionHeader({
  label,
  count,
  href,
  hrefLabel,
}: {
  label: string;
  count: number;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 10,
        padding: "0 4px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mincho)", fontSize: 14, color: "var(--ink)" }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "var(--accent)",
          }}
        >
          {count}
        </span>
      </div>
      <Link
        href={href}
        style={{
          fontSize: 11,
          color: "var(--mid)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {hrefLabel}
      </Link>
    </div>
  );
}
