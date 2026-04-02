"use client";

import { useState } from "react";

type Props = {
  title: string;
  slug: string;
};

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/columns/${slug}`
      : `/columns/${slug}`;

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/columns/${slug}`
        : `/columns/${slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {/* Xでシェア */}
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          border: "1px solid var(--light)",
          borderRadius: "24px",
          fontSize: "12px",
          color: "var(--mid)",
          fontFamily: "var(--font-sans)",
          textDecoration: "none",
          transition: "border-color 0.2s, color 0.2s",
          background: "transparent",
          cursor: "pointer",
        }}
        className="share-btn"
      >
        {/* X (Twitter) SVG */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Xでシェア
      </a>

      {/* リンクをコピー */}
      <button
        onClick={handleCopy}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          border: copied ? "1px solid var(--accent)" : "1px solid var(--light)",
          borderRadius: "24px",
          fontSize: "12px",
          color: copied ? "var(--accent)" : "var(--mid)",
          fontFamily: "var(--font-sans)",
          background: "transparent",
          cursor: "pointer",
          transition: "border-color 0.2s, color 0.2s",
        }}
        className="share-btn"
      >
        {/* Link SVG */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? "コピーしました" : "リンクをコピー"}
      </button>
    </div>
  );
}
