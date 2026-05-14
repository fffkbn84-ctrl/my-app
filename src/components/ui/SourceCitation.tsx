import type { PublicDataSource } from "@/lib/publicData";

/**
 * 公的データの出典セクション。
 * YMYL 領域の記事末尾に置き、一次情報の出典リンクを明記する（E-E-A-T 対応）。
 * 外部リンクは新規タブ + rel="noopener noreferrer"。
 */
export default function SourceCitation({
  sources,
}: {
  sources: PublicDataSource[];
}) {
  if (sources.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 48,
        paddingTop: 32,
        borderTop: "1px solid var(--pale)",
      }}
      aria-label="出典・参考にした公的データ"
    >
      <p
        style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: 11,
          letterSpacing: "0.18em",
          color: "#8B7355",
          marginBottom: 12,
          textTransform: "lowercase",
        }}
      >
        sources
      </p>
      <h2
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: "clamp(18px, 2.5vw, 22px)",
          fontWeight: 500,
          color: "var(--black)",
          margin: "0 0 8px",
        }}
      >
        出典・参考にした公的データ
      </h2>
      <p
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 12,
          lineHeight: 1.9,
          color: "var(--mid)",
          fontWeight: 300,
          margin: "0 0 20px",
        }}
      >
        この記事でふれた数値は、公的機関が公表している統計にもとづいています。
      </p>

      <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
        {sources.map((s) => (
          <li
            key={s.id}
            style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 13,
                lineHeight: 1.9,
                color: "var(--ink)",
                fontWeight: 400,
                margin: "0 0 6px",
              }}
            >
              {s.fact}
            </p>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 11.5,
                lineHeight: 1.8,
                color: "var(--mid)",
                fontWeight: 300,
                margin: 0,
              }}
            >
              {s.org}「
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#8B7355", textDecoration: "underline" }}
              >
                {s.surveyName}
              </a>
              」（{s.year}）／編集部参照日 {s.retrieved}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
