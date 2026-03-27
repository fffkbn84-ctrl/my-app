"use client";

export default function ScrollToTopButton() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "48px 0 40px",
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 28px",
          border: "1px solid var(--light)",
          borderRadius: 50,
          background: "var(--white)",
          color: "var(--mid)",
          fontSize: 12,
          letterSpacing: ".08em",
          fontFamily: "Noto Sans JP, sans-serif",
          cursor: "pointer",
          transition: "border-color .2s, color .2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--light)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--mid)";
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        ページトップへ戻る
      </button>
    </div>
  );
}
