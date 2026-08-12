"use client";

import { useState } from "react";

/**
 * コピーボタン付きのテキストブロック。
 * 押下後に「コピーしました」に変わり、2秒で元に戻る。
 *
 * クリップボード API が使えない環境（古い WebView・非 HTTPS など）向けに
 * textarea + execCommand のフォールバックを持つ。相手側の環境を選べないため。
 */
export default function CopyBlock({
  label,
  hint,
  text,
  mono = false,
}: {
  label: string;
  hint?: string;
  text: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // コピーに失敗しても本文は選択できる状態にあるため、黙って何もしない
    }
  }

  return (
    <section
      style={{
        border: "1px solid var(--light)",
        borderRadius: 14,
        background: "var(--white)",
        padding: "18px 20px 20px",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: hint ? 6 : 12,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 400,
            color: "var(--black)",
            margin: 0,
          }}
        >
          {label}
        </h3>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          style={{
            flexShrink: 0,
            border: "1px solid var(--accent)",
            background: copied ? "var(--accent)" : "transparent",
            color: copied ? "#fff" : "var(--accent)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            borderRadius: 999,
            padding: "7px 16px",
            cursor: "pointer",
            transition: "background .2s, color .2s",
          }}
        >
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>

      {hint && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 300,
            color: "var(--muted)",
            lineHeight: 1.8,
            margin: "0 0 12px",
          }}
        >
          {hint}
        </p>
      )}

      <pre
        style={{
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, monospace"
            : "var(--font-sans)",
          fontSize: mono ? 11.5 : 13,
          fontWeight: 300,
          lineHeight: mono ? 1.7 : 2,
          color: "var(--ink)",
          background: "var(--pale)",
          borderRadius: 10,
          padding: "14px 16px",
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowX: "auto",
        }}
      >
        {text}
      </pre>
    </section>
  );
}
