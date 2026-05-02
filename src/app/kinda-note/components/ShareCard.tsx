"use client";

import { forwardRef } from "react";
import WeatherIcon from "./WeatherIcon";
import type { TypeContent } from "../data/typeContent";
import type { WeatherDescription } from "../data/weatherDescriptions";

/**
 * 画像保存用カード。html2canvas でキャプチャされる。
 *
 * 800×1000px を意識した縦長カードで、結果画面の主要な情報だけをまとめる。
 * ・ロゴ
 * ・タイプ名
 * ・天気アイコン + 解説
 * ・summary
 * ・選んだ項目の主要部分（最大8件）
 * ・日付
 *
 * 画面表示用ではなく、オフスクリーン（visibility: hidden 相当）で
 * レンダリングし、html2canvas で取り出して PNG にする。
 */

type Props = {
  type: TypeContent;
  weather: WeatherDescription;
  /** 選んだ項目（ラベル）。長すぎる場合は呼び出し側で絞り込む */
  selectedLabels: string[];
  /** 自由記述（あれば） */
  freeText?: string;
};

const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { type, weather, selectedLabels, freeText },
  ref
) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${pad(today.getMonth() + 1)}.${pad(today.getDate())}`;

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
        gap: 32,
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
        Kinda note
      </div>

      {/* タイプ名 + 天気アイコン */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ flexShrink: 0 }}>
          <WeatherIcon weather={weather.key} size={140} color={type.color} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', serif",
              fontSize: 14,
              letterSpacing: "0.12em",
              color: "#A0A0A0",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {weather.name_en}
          </div>
          <div
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 40,
              fontWeight: 500,
              color: "#2A2A2A",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
            }}
          >
            {type.fullName}
          </div>
        </div>
      </div>

      {/* summary */}
      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 26,
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "#2A2A2A",
        }}
      >
        {type.summary}
      </div>

      {/* 天気の解説 */}
      <div
        style={{
          background: "#F5EEE6",
          padding: "24px 28px",
          borderRadius: 16,
          fontFamily: "'Georgia', serif",
          fontSize: 17,
          lineHeight: 2,
          whiteSpace: "pre-line",
          color: "#2A2A2A",
          letterSpacing: "0.02em",
        }}
      >
        {weather.description}
      </div>

      {/* 選んだ項目 */}
      {selectedLabels.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.12em",
              color: "#A0A0A0",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Your Notes
          </div>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {selectedLabels.slice(0, 8).map((label, i) => (
              <li
                key={i}
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#2A2A2A",
                  paddingLeft: 16,
                  borderLeft: `3px solid ${type.color}`,
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 自由記述 */}
      {freeText && freeText.trim().length > 0 && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #EAE0D8",
            borderRadius: 12,
            padding: "20px 24px",
            fontSize: 14,
            lineHeight: 2,
            color: "#3A2E26",
            fontFamily:
              "'Hiragino Mincho ProN', 'Shippori Mincho', serif",
            fontStyle: "italic",
          }}
        >
          「{freeText}」
        </div>
      )}

      {/* フッター */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 12, color: "#A0A0A0", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em" }}>
          {dateStr} · kinda.futarive.jp
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#A0A0A0",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          Generated by Kinda
        </div>
      </div>
    </div>
  );
});

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export default ShareCard;
