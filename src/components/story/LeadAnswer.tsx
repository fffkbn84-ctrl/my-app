import type { ReactNode } from "react";

export default function LeadAnswer({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="この物語の要点"
      style={{
        background: "linear-gradient(135deg, #FBF7F1 0%, #F4ECE0 100%)",
        border: "1px solid #E5DCC8",
        borderLeft: "3px solid var(--accent)",
        borderRadius: 12,
        padding: "20px 22px",
        marginBottom: 36,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "var(--accent-deep, #B8806E)",
          margin: "0 0 8px",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        Story / この物語
      </p>
      <p
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 15,
          lineHeight: 1.95,
          color: "var(--ink)",
          margin: 0,
          fontWeight: 400,
        }}
      >
        {children}
      </p>
    </aside>
  );
}
