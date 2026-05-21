"use client";

import Link from "next/link";
import { useFavoritesList } from "@/hooks/useFavorites";
import { STORIES, type Story } from "@/lib/mock/stories";
import type { ColumnMeta } from "@/lib/columns";

type Props = {
  allColumns: ColumnMeta[];
};

/**
 * マイページの「共感した」一覧。
 * - Kinda story（エピソード）
 * - Kinda voices（コラム）
 * favorites の target_type = 'story' / 'voice' を表示。
 * 0 件なら何も描画しない。
 */
export default function SympathySavedSection({ allColumns }: Props) {
  const { favorites, loading } = useFavoritesList();

  if (loading) return null;

  const storyById = new Map<string, Story>(STORIES.map((s) => [String(s.id), s]));
  const columnBySlug = new Map<string, ColumnMeta>(
    allColumns.map((c) => [c.slug, c]),
  );

  const savedStories = favorites
    .filter((f) => f.target_type === "story")
    .map((f) => storyById.get(f.target_id))
    .filter((s): s is Story => Boolean(s));

  const savedVoices = favorites
    .filter((f) => f.target_type === "voice")
    .map((f) => columnBySlug.get(f.target_id))
    .filter((c): c is ColumnMeta => Boolean(c));

  if (savedStories.length === 0 && savedVoices.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: 32 }}>
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
        my sympathy
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
        共感した
      </h2>

      {savedStories.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader
            eyebrow="KINDA STORY"
            label="ふたりの物語"
            count={savedStories.length}
            href="/kinda-story"
            hrefLabel="さらに読む"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedStories.map((s) => (
              <Link
                key={s.id}
                href={`/kinda-story/${s.id}`}
                style={cardLinkStyle}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: s.accentSoft ?? "var(--accent-dim)",
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={titleStyle}>{s.title}</div>
                  <div style={metaStyle}>
                    {s.author} · {s.stage}
                  </div>
                </div>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </div>
      )}

      {savedVoices.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHeader
            eyebrow="KINDA VOICES"
            label="気持ちの整理コラム"
            count={savedVoices.length}
            href="/columns"
            hrefLabel="さらに読む"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedVoices.map((c) => (
              <Link
                key={c.slug}
                href={`/columns/${c.slug}`}
                style={cardLinkStyle}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: c.thumbnail || "var(--accent-dim)",
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={titleStyle}>{c.title}</div>
                  <div style={metaStyle}>
                    {c.category} · {c.readTime}分
                  </div>
                </div>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SectionHeader({
  eyebrow,
  label,
  count,
  href,
  hrefLabel,
}: {
  /** Bパターン eyebrow（DM Sans uppercase）。例: "KINDA STORY" */
  eyebrow: string;
  /** 日本語の見出し（Shippori Mincho）。例: "ふたりの物語" */
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
        alignItems: "flex-end",
        marginBottom: 10,
        padding: "0 4px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: ".18em",
            color: "var(--accent)",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: 14,
              color: "var(--ink)",
            }}
          >
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

function ArrowIcon() {
  return (
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
  );
}

const cardLinkStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  padding: 12,
  background: "var(--pale)",
  border: "1px solid var(--light)",
  borderRadius: 14,
  textDecoration: "none",
  color: "var(--ink)",
  alignItems: "center",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-mincho)",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--ink)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const metaStyle: React.CSSProperties = {
  fontSize: 11,
  color: "var(--mid)",
  marginTop: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
