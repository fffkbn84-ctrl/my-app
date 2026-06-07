"use client";

import { useState } from "react";

/**
 * 口コミへのカウンセラー（相談所）からの返信表示。
 * 既定では「返信あり」のマークのみを出し、ユーザーがタップ／クリックした時に
 * 返信本文を展開する。常時表示にすると口コミ一覧が縦長になり読みづらいため、
 * 控えめなマーク → 展開の二段構えにしている。
 */
export default function ReviewReply({
  counselorName,
  reply,
}: {
  counselorName: string;
  reply: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          border: "1px solid var(--accent)",
          borderRadius: 20,
          background: open ? "var(--adim, rgba(200,169,122,.12))" : "transparent",
          color: "var(--accent)",
          fontSize: 12,
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          transition: "background .2s",
        }}
      >
        {/* 吹き出しアイコン */}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5h10a.8.8 0 01.8.8v6a.8.8 0 01-.8.8H8L6.5 11 5 9.1H1.5a.8.8 0 01-.8-.8v-6a.8.8 0 01.8-.8z"
            stroke="currentColor"
            strokeWidth="1.1"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
        {counselorName}カウンセラーからの返信
        {/* シェブロン（開閉で回転） */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            marginTop: 10,
            padding: "12px 14px",
            background: "var(--pale, #F7F1E8)",
            borderRadius: 12,
            borderLeft: "3px solid var(--accent)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>
            {counselorName}カウンセラーからの返信
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--ink)", margin: 0, whiteSpace: "pre-line" }}>
            {reply}
          </p>
        </div>
      )}
    </div>
  );
}
