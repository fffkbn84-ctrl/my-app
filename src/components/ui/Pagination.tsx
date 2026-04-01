"use client";

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, perPage, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  /* ページ番号リスト（省略記号付き） */
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const baseBtn: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 50,
    border: "1px solid var(--light)",
    background: "var(--white)",
    color: "var(--mid)",
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .2s",
    fontFamily: "var(--font-sans)",
    flexShrink: 0,
  };

  const activeBtn: React.CSSProperties = {
    ...baseBtn,
    background: "var(--black)",
    color: "var(--white)",
    border: "1px solid var(--black)",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, padding: "32px 0 16px", flexWrap: "wrap" }}>
      {/* 前へ */}
      <button
        style={{ ...baseBtn, opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "default" : "pointer" }}
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        aria-label="前のページ"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dot-${i}`} style={{ fontSize: 13, color: "var(--muted)", width: 20, textAlign: "center" }}>
            …
          </span>
        ) : (
          <button
            key={p}
            style={p === page ? activeBtn : baseBtn}
            onClick={() => onChange(p as number)}
            onMouseEnter={(e) => {
              if (p !== page) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }
            }}
            onMouseLeave={(e) => {
              if (p !== page) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--light)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--mid)";
              }
            }}
          >
            {p}
          </button>
        )
      )}

      {/* 次へ */}
      <button
        style={{ ...baseBtn, opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? "default" : "pointer" }}
        onClick={() => page < totalPages && onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="次のページ"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
