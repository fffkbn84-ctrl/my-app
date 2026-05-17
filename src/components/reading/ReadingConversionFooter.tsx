import Link from "next/link";

type Variant = "story" | "voices";

/**
 * 記事末尾の Conversion Footer。
 *
 * Kinda story (感情・共感ベース) / Kinda voices (情報・権威ベース) の
 * いずれの記事末尾でも使う「次のアクション」誘導ブロック。
 *
 * - story 記事 →「気持ちの整理 + 合うカウンセラーを探す」
 * - voices 記事 →「気持ちの整理 + カウンセラーを見る」
 *
 * 読了直後のユーザーの行き先を 2 つに絞り、ホーム主動線（Kinda note / type / talk）
 * に橋を架けることで「読了 → 離脱」を回収する。
 */
export default function ReadingConversionFooter({ variant }: { variant: Variant }) {
  const isStory = variant === "story";

  // 読み手の感情に寄せた、押し付けない見出しコピー
  const headline = isStory
    ? "この物語に、自分のいまを重ねたら"
    : "読んだ気持ちを、そのままにしないために";

  // タイプ別の 2 CTA
  // 1 つ目は両方とも Kinda note（最も軽い・整理）
  // 2 つ目は story は Kinda type（相性チェック）/ voices は Kinda talk（担当を見る）
  const primary = {
    label: "気持ちを整理する",
    href: "/kinda-note",
    bg: "#D4A090",
    glow: "0 6px 22px rgba(212,160,144,.45)",
  };
  const secondary = isStory
    ? {
        label: "自分に合うカウンセラーを見つける",
        href: "/kinda-type",
        bg: "#5A7FAF",
        glow: "0 6px 22px rgba(90,127,175,.32)",
      }
    : {
        label: "カウンセラーを見てみる",
        href: "/kinda-talk",
        bg: "#B89A4A",
        glow: "0 6px 22px rgba(184,154,74,.32)",
      };

  return (
    <section
      aria-label="次のアクション"
      style={{
        margin: "56px auto 0",
        maxWidth: 680,
        padding: "32px 24px 36px",
        background: "var(--pale)",
        border: "1px solid var(--light)",
        borderRadius: 20,
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: ".28em",
          color: "var(--accent)",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Next step
      </p>
      <h3
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "clamp(17px, 3.6vw, 21px)",
          color: "var(--ink)",
          fontWeight: 500,
          lineHeight: 1.6,
          marginBottom: 22,
        }}
      >
        {headline}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 340,
          margin: "0 auto",
        }}
      >
        <Link
          href={primary.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 22px",
            borderRadius: 50,
            background: primary.bg,
            color: "white",
            fontFamily: "var(--font-mincho)",
            fontSize: 14,
            letterSpacing: ".06em",
            textDecoration: "none",
            boxShadow: primary.glow,
            transition: "transform .2s, box-shadow .2s",
          }}
        >
          {primary.label}
          <Arrow />
        </Link>
        <Link
          href={secondary.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 22px",
            borderRadius: 50,
            background: "white",
            color: secondary.bg,
            border: `1px solid ${secondary.bg}`,
            fontFamily: "var(--font-mincho)",
            fontSize: 13,
            letterSpacing: ".06em",
            textDecoration: "none",
            transition: "background .2s",
          }}
        >
          {secondary.label}
          <Arrow color={secondary.bg} />
        </Link>
      </div>

      <p
        style={{
          fontSize: 11,
          color: "var(--muted)",
          marginTop: 18,
          lineHeight: 1.8,
        }}
      >
        どちらも 60 秒 · 登録不要 · 完全無料
      </p>
    </section>
  );
}

function Arrow({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7h10M7 2l5 5-5 5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
