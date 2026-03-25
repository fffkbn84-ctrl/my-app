/* ────────────────────────────────────────────────────────────
   コラムセクション
   データ部分（columnArticles）は将来 Supabase の columns テーブルに差し替え可
──────────────────────────────────────────────────────────── */

/* ── 型定義 ────────────────────────────────────────────── */
export type ColumnArticle = {
  id: string;
  featured: boolean;
  tag: string;
  title: string;
  author: string;
  authorInitial: string;
  /** アバター背景色。未指定時は var(--pale) */
  authorBg?: string;
  /** アバター文字色。未指定時は var(--accent) */
  authorColor?: string;
  date: string;
  readTime?: string;
  /** col-t1 | col-t2 | col-t3 */
  thumbVariant: "t1" | "t2" | "t3";
};

/* ── モックデータ（Supabase差し替え時はここを fetch に変更）── */
export const columnArticles: ColumnArticle[] = [
  {
    id: "1",
    featured: true,
    tag: "取材レポート",
    title: "全国47都道府県の結婚相談所を取材して気づいた、「いいカウンセラー」の共通点",
    author: "編集部 みづき",
    authorInitial: "M",
    date: "2025.03.15",
    readTime: "読了 8分",
    thumbVariant: "t1",
  },
  {
    id: "2",
    featured: false,
    tag: "お見合い準備",
    title: "お見合いに使いたい東京カフェ、スタッフが実際に行ってみた12選",
    author: "あかり",
    authorInitial: "A",
    authorBg: "#FCE8E5",
    authorColor: "#C4877A",
    date: "2025.02.28",
    thumbVariant: "t2",
  },
  {
    id: "3",
    featured: false,
    tag: "デートプラン",
    title: "1回目・2回目・3回目、それぞれのデートで使えるお店の選び方",
    author: "みづき",
    authorInitial: "M",
    date: "2025.02.10",
    thumbVariant: "t3",
  },
];

/* ── サムネイルSVGイラスト（デザイン固定）────────────────── */
function ThumbIllustration({ variant }: { variant: ColumnArticle["thumbVariant"] }) {
  if (variant === "t1") {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <path d="M35 20c-2 3-5 8-4 14s6 10 8 16 1 12 5 14 10-2 12-8 0-12 4-16 8-6 8-12-4-10-10-10-8 4-10 2-11 0-13 0z" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.12)"/>
        <path d="M55 30c3-2 8-4 10-2s2 8 0 10" stroke="#7A9E87" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
        <circle cx="44" cy="38" r="3" fill="#C8A97A" opacity=".8"/>
        <circle cx="52" cy="45" r="2" fill="#C8A97A" opacity=".6"/>
        <circle cx="36" cy="50" r="2.5" fill="#C8A97A" opacity=".5"/>
        <path d="M30 65c8 2 20 2 28 0" stroke="#C8A97A" strokeWidth="1" strokeLinecap="round" opacity=".3"/>
      </svg>
    );
  }
  if (variant === "t2") {
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M14 22h24l-2.5 18H16.5L14 22z" stroke="#C8877A" strokeWidth="1.5" fill="rgba(196,135,122,.1)" strokeLinejoin="round"/>
        <path d="M38 26h3.5a3.5 3.5 0 010 7H38" stroke="#C8877A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 16c0-2.5 3.5-2.5 3.5-5M27 16c0-2.5 3.5-2.5 3.5-5" stroke="#C8877A" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
      </svg>
    );
  }
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="28" r="14" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.08)"/>
      <path d="M24 34c2 3 10 3 12 0" stroke="#7A9E87" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="25" cy="26" r="2" fill="#7A9E87" opacity=".6"/>
      <circle cx="35" cy="26" r="2" fill="#7A9E87" opacity=".6"/>
      <path d="M16 44l4-4M44 44l-4-4M30 42v4" stroke="#7A9E87" strokeWidth="1.3" strokeLinecap="round" opacity=".4"/>
    </svg>
  );
}

/* ── カードコンポーネント ──────────────────────────────── */
function ColumnCard({ article }: { article: ColumnArticle }) {
  return (
    <div className={`col-card${article.featured ? " col-card-featured" : ""}`}>
      <div className={`col-thumb col-${article.thumbVariant}`}>
        <ThumbIllustration variant={article.thumbVariant} />
      </div>
      <div className="col-body">
        <span className="col-tag">{article.tag}</span>
        <div className="col-title">{article.title}</div>
        <div className="col-meta">
          <span className="col-author">
            <span
              className="col-av"
              style={{
                background: article.authorBg ?? "var(--pale)",
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

/* ── セクションコンポーネント ────────────────────────────── */
export default function ColumnsSection({
  articles = columnArticles,
}: {
  articles?: ColumnArticle[];
}) {
  return (
    <section className="py-24 md:py-32" style={{ background: "var(--pale)" }} id="columns">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">
          our column
        </p>
        <h2
          className="text-3xl md:text-4xl text-ink mb-2"
          style={{ fontFamily: "var(--font-mincho)" }}
        >
          全国に足を運んで、書いています
          <span className="block text-base md:text-lg text-mid mt-2" style={{ fontFamily: "var(--font-mincho)" }}>
            運営スタッフによる取材コラム
          </span>
        </h2>
        <p className="text-sm text-mid leading-relaxed mt-4 mb-10">
          相談所・カフェ・レストランを実際に訪問取材。リアルな温度感をお届けします。
        </p>
        <div className="cols-grid">
          {articles.map((article) => (
            <ColumnCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
