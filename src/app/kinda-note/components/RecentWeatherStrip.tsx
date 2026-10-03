import Image from "next/image";
import { cardImageFile, getCardWeather } from "../data/daily";
import type { KindaNoteHistoryItem } from "../lib/storage";

/**
 * これまでの天気（新しい順）。丸窓の小さな絵＋日付＋天気の名前を横に並べる。
 * 矢印・良い悪い・「変わっていない」は書かない（ブランドトーン「比較しない」）。
 *
 * 画像は next/image で 56px 表示（2x で 112px）に縮めて配信されるため、6枚並べても軽い。
 * 段階の note の結果画面と、今日の天気の結果画面の両方で使う。
 */
export default function RecentWeatherStrip({ items }: { items: KindaNoteHistoryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginBottom: 24 }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.16em",
          color: "#B0A090",
          margin: "0 0 12px",
          fontWeight: 500,
        }}
      >
        これまでの天気
      </p>
      <ul
        className="hide-scrollbar"
        style={{
          margin: 0,
          padding: "2px 2px 4px",
          listStyle: "none",
          display: "flex",
          gap: 14,
          overflowX: "auto",
        }}
      >
        {items.map((it) => {
          const w = getCardWeather(it.weather);
          if (!w) return null;
          return (
            <li
              key={it.id}
              style={{
                flex: "0 0 auto",
                width: 60,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#FAF6F0",
                  boxShadow: "0 0 0 2px #FFFFFF, 0 2px 6px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Image
                  src={`/images/${cardImageFile(w.key)}.webp`}
                  alt=""
                  width={56}
                  height={56}
                  sizes="56px"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </span>
              <span style={{ fontSize: 10.5, color: "#A0907A", lineHeight: 1.2 }}>{fmt(it.created_at)}</span>
              <span style={{ fontSize: 11.5, color: "#5A4A3E", lineHeight: 1.3, textAlign: "center" }}>
                {w.name_ja}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
}
