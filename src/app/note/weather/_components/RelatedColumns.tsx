import Link from "next/link";
import { COLUMN_META, type ColumnSlug } from "@/lib/columnSlugs";
import WeatherSectionTitle from "./WeatherSectionTitle";
import { W, MAX_W } from "./styles";

export default function RelatedColumns({ slugs }: { slugs?: string[] }) {
  if (!slugs || !slugs.length) return null;

  // 公開済みコラムのみ表示。published: false はリンクごと非表示。
  const published = slugs.filter(
    (s): s is ColumnSlug => s in COLUMN_META && COLUMN_META[s as ColumnSlug].published,
  );
  if (!published.length) return null;

  return (
    <section style={{ padding: "32px 16px", background: W.bg }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <WeatherSectionTitle>この気持ちにいるあなたへ</WeatherSectionTitle>

        <div style={{ display: "grid", gap: 12 }}>
          {published.map((slug) => {
            const meta = COLUMN_META[slug];
            return (
              <Link
                key={slug}
                href={`/columns/${slug}`}
                style={{
                  display: "block",
                  background: W.bgCard,
                  borderRadius: 12,
                  padding: "18px 18px",
                  border: `1px solid ${W.borderSoft}`,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: W.ink,
                    margin: "0 0 6px",
                    lineHeight: 1.6,
                  }}
                >
                  {meta.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: 13,
                    lineHeight: 1.8,
                    color: W.inkSub,
                    margin: 0,
                  }}
                >
                  {meta.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
