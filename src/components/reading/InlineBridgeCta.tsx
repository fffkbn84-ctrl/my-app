import Link from "next/link";

type Variant = "story" | "voices";

/**
 * 記事本文の中盤に差し込む、押し付けない 1 行のサブ CTA。
 * 「読了する前に離脱しそうなライトリーダー」に対する自然な橋。
 *
 * - story 記事 → Kinda type（合う担当を見つける）
 * - voices 記事 → Kinda note（気持ちを整理する）
 *
 * 上下にうっすらした dash divider、accent カラーのテキストリンク。
 */
export default function InlineBridgeCta({ variant }: { variant: Variant }) {
  const isStory = variant === "story";
  const href = isStory ? "/kinda-type" : "/kinda-note";
  const label = isStory
    ? "自分の婚活スタイルも、見てみる"
    : "あなたの気持ちも、整理してみる";
  const accent = isStory ? "#5A7FAF" : "#D4A090";

  return (
    <div
      style={{
        margin: "28px auto",
        padding: "14px 0",
        borderTop: "1px dashed var(--light)",
        borderBottom: "1px dashed var(--light)",
        textAlign: "center",
      }}
    >
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: accent,
          fontFamily: "var(--font-mincho)",
          textDecoration: "none",
          lineHeight: 1.8,
          letterSpacing: ".04em",
        }}
      >
        ─── {label}
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 7h10M7 2l5 5-5 5" />
        </svg>
      </Link>
    </div>
  );
}
