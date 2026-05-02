"use client";

import type { WeatherKey } from "../data/weatherDescriptions";

/**
 * 天気アイコン（フェーズ1暫定 SVG プレースホルダー）。
 *
 * v3 設計書通り、後から画像（/images/weather/{weather}.webp）に
 * 差し替えできるよう、コンポーネント単位で抽象化している。
 *
 * スタイル方針：outline + soft fill で統一。色は呼び出し側から渡す。
 */

type Props = {
  weather: WeatherKey;
  size?: number;
  /** ストローク・線の主色（タイプテーマ色を渡す想定） */
  color?: string;
};

export default function WeatherIcon({
  weather,
  size = 96,
  color = "#7A6A5A",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      {renderWeather(weather, color)}
    </svg>
  );
}

function renderWeather(weather: WeatherKey, color: string) {
  const stroke = color;
  const soft = color + "22"; // 13% alpha 相当

  switch (weather) {
    // ─── pre ─────────────────────────────────────────
    case "morning_mist":
      return (
        <>
          <ellipse cx="50" cy="55" rx="34" ry="14" fill={soft} />
          <line x1="22" y1="50" x2="78" y2="50" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="28" y1="60" x2="72" y2="60" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="34" y1="70" x2="66" y2="70" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="50" cy="40" r="10" stroke={stroke} strokeWidth="1.4" fill="none" />
        </>
      );
    case "pre_dawn":
      return (
        <>
          <line x1="14" y1="72" x2="86" y2="72" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M14 72 Q50 50 86 72" stroke={stroke} strokeWidth="1.4" fill={soft} />
          <circle cx="68" cy="34" r="2" fill={stroke} />
        </>
      );
    case "flower_overcast":
      return (
        <>
          <path d="M30 50 Q24 38 36 36 Q42 24 56 30 Q70 28 72 42 Q82 46 74 56 L34 58 Q24 56 30 50 Z" stroke={stroke} strokeWidth="1.4" fill={soft} />
          {[
            { cx: 28, cy: 76 },
            { cx: 50, cy: 82 },
            { cx: 70, cy: 74 },
          ].map((p, i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx={p.cx}
                  cy={p.cy - 4}
                  rx="2.4"
                  ry="4"
                  fill={soft}
                  stroke={stroke}
                  strokeWidth="0.8"
                  transform={`rotate(${a} ${p.cx} ${p.cy})`}
                />
              ))}
            </g>
          ))}
        </>
      );

    // ─── waiting（雨の段階表現） ──────────────────────
    case "light_rain_start":
      return (
        <>
          {cloud(stroke, soft)}
          <line x1="48" y1="68" x2="46" y2="78" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
    case "light_rain":
      return (
        <>
          {cloud(stroke, soft)}
          {[36, 50, 64].map((x) => (
            <line key={x} x1={x} y1="64" x2={x - 2} y2="80" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          ))}
        </>
      );
    case "rain_cloud":
      return (
        <>
          {cloud(stroke, soft, 0.85)}
          {[30, 40, 50, 60, 70].map((x) => (
            <line key={x} x1={x} y1="62" x2={x - 2} y2="84" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          ))}
        </>
      );
    case "thunderstorm":
      return (
        <>
          {cloud(stroke, soft, 0.9)}
          <path d="M52 60 L42 76 L50 76 L46 86 L60 70 L52 70 Z" stroke={stroke} strokeWidth="1.4" fill={soft} strokeLinejoin="round" />
          {[28, 70].map((x) => (
            <line key={x} x1={x} y1="62" x2={x - 2} y2="80" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </>
      );

    // ─── omiai ───────────────────────────────────────
    case "sun_break":
      return (
        <>
          <circle cx="62" cy="40" r="14" stroke={stroke} strokeWidth="1.4" fill={soft} />
          <path d="M14 56 Q34 44 50 56 Q66 50 86 60 L86 70 L14 70 Z" stroke={stroke} strokeWidth="1.4" fill="white" />
          {[20, 32, 44].map((x, i) => (
            <line key={i} x1={x + 22} y1="78" x2={x + 16} y2="92" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          ))}
        </>
      );
    case "angels_ladder":
      return (
        <>
          {cloud(stroke, soft, 0.7, 8)}
          {[24, 38, 52, 66, 80].map((x) => (
            <line
              key={x}
              x1={x}
              y1="44"
              x2={x - 6}
              y2="92"
              stroke={stroke}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.45"
            />
          ))}
        </>
      );
    case "windy_day":
      return (
        <>
          <path d="M14 36 Q34 30 54 38 Q70 44 84 36" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M14 54 Q34 48 64 58 Q72 60 86 52" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M14 72 Q34 66 50 74 Q66 80 86 70" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </>
      );

    // ─── date1 ───────────────────────────────────────
    case "light_sunrise":
      return (
        <>
          <line x1="10" y1="68" x2="90" y2="68" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M22 68 A28 28 0 0 1 78 68 Z" fill={soft} stroke={stroke} strokeWidth="1.4" />
          {[36, 50, 64].map((x, i) => (
            <line key={i} x1={x} y1="76" x2={x} y2="84" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          ))}
        </>
      );
    case "wandering_clouds":
      return (
        <>
          {cloud(stroke, soft, 0.6, -10, -10)}
          {cloud(stroke, soft, 0.5, 18, 8)}
          {cloud(stroke, soft, 0.7, -2, 22)}
        </>
      );
    case "cold_wind":
      return (
        <>
          <path d="M14 32 Q44 26 60 34 Q72 40 84 32" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M14 52 Q34 46 64 56 Q72 58 86 50" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M14 72 Q34 66 56 74 Q66 78 86 70" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      );

    // ─── multiple ────────────────────────────────────
    case "windy_sunshine":
      return (
        <>
          <circle cx="50" cy="38" r="12" stroke={stroke} strokeWidth="1.4" fill={soft} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1="50"
              y1="20"
              x2="50"
              y2="14"
              stroke={stroke}
              strokeWidth="1.2"
              strokeLinecap="round"
              transform={`rotate(${a} 50 38)`}
            />
          ))}
          <path d="M14 64 Q40 58 64 66 Q72 68 86 60" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M14 80 Q40 74 64 82 Q72 84 86 76" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </>
      );
    case "faint_sunlight":
      return (
        <>
          {cloud(stroke, soft, 0.5, 0, -4)}
          <circle cx="62" cy="50" r="10" stroke={stroke} strokeWidth="1.4" fill={soft} opacity="0.6" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1="62"
              y1="36"
              x2="62"
              y2="32"
              stroke={stroke}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
              transform={`rotate(${a} 62 50)`}
            />
          ))}
        </>
      );
    case "twilight":
      return (
        <>
          <line x1="10" y1="60" x2="90" y2="60" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M22 60 A28 28 0 0 1 78 60 Z" fill={soft} stroke={stroke} strokeWidth="1.4" />
          <line x1="50" y1="60" x2="50" y2="84" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="50" cy="84" rx="24" ry="2" fill={soft} />
        </>
      );

    // ─── kousai ──────────────────────────────────────
    case "sunrise":
      return (
        <>
          <line x1="10" y1="68" x2="90" y2="68" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M16 68 A34 34 0 0 1 84 68 Z" fill={soft} stroke={stroke} strokeWidth="1.4" />
          {[28, 38, 50, 62, 72].map((x, i) => (
            <line key={i} x1={x} y1="76" x2={x} y2="86" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.55" />
          ))}
        </>
      );
    case "dissonance_wind":
      return (
        <>
          <path d="M14 30 Q40 30 50 40 Q60 50 86 36" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M14 50 Q34 60 54 50 Q70 42 86 56" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M14 70 Q40 64 56 76 Q70 84 86 70" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </>
      );
    case "quiet_overcast":
      return (
        <>
          {cloud(stroke, soft, 0.55, -8, -8)}
          {cloud(stroke, soft, 0.6, 6, 12)}
        </>
      );
    case "mist":
      return (
        <>
          <ellipse cx="50" cy="56" rx="36" ry="16" fill={soft} />
          <line x1="20" y1="44" x2="80" y2="44" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          <line x1="14" y1="56" x2="86" y2="56" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          <line x1="22" y1="68" x2="78" y2="68" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          <line x1="32" y1="78" x2="68" y2="78" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        </>
      );
  }
}

/**
 * 雲の汎用 SVG。サイズ/位置のオフセットを取れる。
 */
function cloud(
  stroke: string,
  fill: string,
  opacity = 1,
  dx = 0,
  dy = 0
) {
  return (
    <path
      d={`M${22 + dx} ${52 + dy} Q${22 + dx} ${40 + dy} ${36 + dx} ${40 + dy} Q${
        42 + dx
      } ${30 + dy} ${56 + dx} ${36 + dy} Q${72 + dx} ${34 + dy} ${72 + dx} ${
        46 + dy
      } Q${82 + dx} ${48 + dy} ${74 + dx} ${58 + dy} L${34 + dx} ${60 + dy} Q${
        22 + dx
      } ${58 + dy} ${22 + dx} ${52 + dy} Z`}
      stroke={stroke}
      strokeWidth="1.4"
      fill={fill}
      opacity={opacity}
    />
  );
}
