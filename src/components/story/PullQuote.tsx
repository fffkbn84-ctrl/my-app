import type { ReactNode } from "react";

export default function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote
      style={{
        margin: "40px 0",
        padding: "24px 28px",
        background: "var(--pale)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "0 12px 12px 0",
        position: "relative",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 12,
          left: 18,
          fontFamily: "DM Serif Display, serif",
          fontSize: 40,
          color: "var(--accent)",
          lineHeight: 1,
          opacity: 0.4,
          userSelect: "none",
        }}
      >
        &ldquo;
      </span>
      <p
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: "clamp(16px, 2.2vw, 20px)",
          lineHeight: 1.9,
          color: "var(--ink)",
          margin: 0,
          paddingLeft: 12,
          fontWeight: 500,
        }}
      >
        {children}
      </p>
    </blockquote>
  );
}
