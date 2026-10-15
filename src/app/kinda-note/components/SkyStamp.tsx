import type { SkyCity } from "../data/skyCities";

/**
 * 空の手帳のスタンプ（2026-10-15）。観光スタンプのような丸い二重枠を CSS だけで描く（画像なし）。
 * 枠の色は、はじめて行った日の天気の色。傾きは街ごとに決まった値にして、押した感じを出す。
 * city が null のときは、まだ行っていない街の「？」の枠（どこかは伏せる）。
 */

function tiltOf(key: string): number {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ((h % 13) - 6) * 1.2;
}

function fmt(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function SkyStamp({
  city,
  color,
  date,
  size = 92,
}: {
  city: SkyCity | null;
  color?: string;
  date?: Date;
  size?: number;
}) {
  if (!city) {
    return (
      <div
        aria-label="まだ行っていない街"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "1.5px dashed #D8CCC0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#C8BCB0",
          fontFamily: "'Shippori Mincho', serif",
          fontSize: size * 0.26,
          flexShrink: 0,
        }}
      >
        ？
      </div>
    );
  }

  const c = color ?? "#D4A090";
  const nameSize = Math.min(size * 0.2, (size * 0.72) / Math.max(city.name.length, 1));

  return (
    <div
      role="img"
      aria-label={`${city.name}のスタンプ${date ? ` ${fmt(date)}` : ""}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${c}`,
        padding: 3,
        transform: `rotate(${tiltOf(city.key)}deg)`,
        flexShrink: 0,
        boxSizing: "border-box",
        opacity: 0.92,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `1px solid ${c}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: c,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: Math.min(size * 0.075, (size * 0.6) / (city.en.length * 0.72)),
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
          }}
        >
          {city.en}
        </span>
        <span
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: nameSize,
            fontWeight: 600,
            margin: "2px 0",
            whiteSpace: "nowrap",
          }}
        >
          {city.name}
        </span>
        {date && (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: Math.max(size * 0.08, 7),
              letterSpacing: "0.04em",
            }}
          >
            {fmt(date)}
          </span>
        )}
      </div>
    </div>
  );
}
