"use client";

import { forwardRef } from "react";
import type { PairTopic } from "@/lib/pair/topics";

/**
 * 画像保存用カード。html2canvas でキャプチャされる。
 * Kinda note の ShareCard.tsx と同じ作法：
 * 800px 幅でオフスクリーンにレンダリングし、PNG として取り出す。
 *
 * 絵文字は使わない。％も出さない（実数のみ）。
 */

type Props = {
  /** まだ話していないこと（want）。多すぎる場合は呼び出し側で絞る */
  topics: PairTopic[];
  /** 触れた話題の実数（talked） */
  talkedCount: number;
  /** 全話題数 */
  totalCount: number;
};

const PairShareCard = forwardRef<HTMLDivElement, Props>(function PairShareCard(
  { topics, talkedCount, totalCount },
  ref
) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${pad(today.getMonth() + 1)}.${pad(
    today.getDate()
  )}`;

  return (
    <div
      ref={ref}
      style={{
        width: 800,
        minHeight: 1000,
        background: "#FAFAF8",
        padding: 64,
        boxSizing: "border-box",
        fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
        color: "#2A2A2A",
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}
    >
      {/* ロゴ */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 18,
          letterSpacing: "0.16em",
          color: "#A0A0A0",
          textTransform: "uppercase",
        }}
      >
        Kinda pair
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "0.04em",
            marginBottom: 14,
          }}
        >
          まだ話していないこと
        </div>
        <div style={{ fontSize: 17, color: "#7d7168", letterSpacing: "0.02em" }}>
          {totalCount}のうち{talkedCount}に触れています
        </div>
      </div>

      <div style={{ height: 1, background: "#EAE0D8" }} />

      {/* まだ話していないこと */}
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {topics.length === 0 ? (
          <div style={{ fontSize: 19, lineHeight: 1.9, color: "#7d7168" }}>
            いまのところ、ありません。
          </div>
        ) : (
          topics.map((t) => (
            <div key={t.key}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: 8,
                  letterSpacing: "0.02em",
                }}
              >
                {t.title}
              </div>
              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.9,
                  color: "#6b5d52",
                  paddingLeft: 16,
                  borderLeft: "2px solid #D4A090",
                }}
              >
                「{t.ask}」
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "1px solid #EAE0D8",
          paddingTop: 20,
          fontSize: 15,
          color: "#A0A0A0",
          letterSpacing: "0.06em",
        }}
      >
        <span>{dateStr}</span>
        <span>kinda.jp/kinda-pair</span>
      </div>
    </div>
  );
});

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export default PairShareCard;
