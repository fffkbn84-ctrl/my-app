import { columnsData, type ColumnArticle, type ColumnThumbVariant } from "@/lib/mock/columns";

/* ────────────────────────────────────────────────────────────
   サムネイル — グラデーション + SVGイラスト
──────────────────────────────────────────────────────────── */
function ColumnThumb({ variant }: { variant: ColumnThumbVariant }) {
  if (variant === "t1") {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <path d="M35 20c-2 3-5 8-4 14s6 10 8 16 1 12 5 14 10-2 12-8 0-12 4-16 8-6 8-12-4-10-10-10-8 4-10 2-11 0-13 0z" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.12)" />
        <path d="M55 30c3-2 8-4 10-2s2 8 0 10" stroke="#7A9E87" strokeWidth="1.3" strokeLinecap="round" opacity=".5" />
        <circle cx="44" cy="38" r="3" fill="#C8A97A" opacity=".8" />
        <circle cx="52" cy="45" r="2" fill="#C8A97A" opacity=".6" />
        <circle cx="36" cy="50" r="2.5" fill="#C8A97A" opacity=".5" />
        <path d="M30 65c8 2 20 2 28 0" stroke="#C8A97A" strokeWidth="1" strokeLinecap="round" opacity=".3" />
      </svg>
    );
  }
  if (variant === "t2") {
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M14 22h24l-2.5 18H16.5L14 22z" stroke="#C8877A" strokeWidth="1.5" fill="rgba(196,135,122,.1)" strokeLinejoin="round" />
        <path d="M38 26h3.5a3.5 3.5 0 010 7H38" stroke="#C8877A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 16c0-2.5 3.5-2.5 3.5-5M27 16c0-2.5 3.5-2.5 3.5-5" stroke="#C8877A" strokeWidth="1.3" strokeLinecap="round" opacity=".5" />
      </svg>
    );
  }
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="28" r="14" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.08)" />
      <path d="M24 34c2 3 10 3 12 0" stroke="#7A9E87" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="25" cy="26" r="2" fill="#7A9E87" opacity=".6" />
      <circle cx="35" cy="26" r="2" fill="#7A9E87" opacity=".6" />
      <path d="M16 44l4-4M44 44l-4-4M30 42v4" stroke="#7A9E87" strokeWidth="1.3" strokeLinecap="round" opacity=".4" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   カードコンポーネント
──────────────────────────────────────────────────────────── */
function ColumnCard({ article }: { article: ColumnArticle }) {
  return (
    <div className={`col-card${article.featured ? " col-card-featured" : ""}`}>
      <div className={`col-thumb col-${article.thumbVariant}`}>
        <ColumnThumb variant={article.thumbVariant} />
      </div>
      <div className="col-body">
        <span className="col-tag">{article.tag}</span>
        <div className="col-title">{article.title}</div>
        <div className="col-meta">
          <span className="col-author">
            <span
              className="col-av"
              style={{
                background: article.authorBg ?? "var(--adim)",
                color: article.authorColor ?? "var(--accent)",
                fontWeight: 500,
              }}
            >
              {article.authorInitial}
            </span>
            {article.author}
          </span>
          <span>{article.date}</span>
          {article.readTime && <span>{article.readTime}</span>}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   セクションコンポーネント
   articles prop で Supabase データへの差し替えに対応
──────────────────────────────────────────────────────────── */
export default function ColumnsSection({
  articles = columnsData,
}: {
  articles?: ColumnArticle[];
}) {
  return (
    <section className="section" style={{ background: "var(--pale)" }} id="columns">
      <div className="wrap">
        <div className="sec-label reveal">our column</div>
        <h2 className="sec-h reveal">
          全国に足を運んで、書いています
          <span className="sec-h-jp">運営スタッフによる取材コラム</span>
        </h2>
        <p className="sec-sub reveal">
          相談所・カフェ・レストランを実際に訪問取材。リアルな温度感をお届けします。
        </p>
        <div className="cols-grid reveal">
          {articles.map((article) => (
            <ColumnCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
