"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getCardWeather } from "../data/daily";
import {
  SKY_MAP_JAPAN,
  SKY_MAP_JAPAN_ON_WORLD,
  SKY_MAP_WORLD,
  getSkyCity,
  type SkyCity,
} from "../data/skyCities";
import type { SkyStamp } from "../lib/storage";

/**
 * 空の手帳の地図（v1-b・2026-10-16）。設計は docs/research/2026-10-12-shohyo-tokyo-ugoki.md §5
 * - 地図に出すのは行った街の点だけ。行っていない街は出さない（どの辺かが分かると「どこかは伏せる」が崩れる）
 * - 日本の街は世界地図では重なるので、日本の点を押すと日本地図へズームして替わる。「世界に戻る」で逆再生
 * - 動きを減らす設定の端末では、ズームせずに切り替えだけ
 * - 重なった点を押すと、近くの街を並べて出す（10/16 ふうか決定・案A）
 * - 点を押したときに出す一言は親（手帳ページ）の OpenedStamp に任せる
 */

const ACCENT = "#D4A090";
const INK = "#3A2E26";
const SUB = "#7A6A5A";

/** 画面上でこれより近い点は「重なっている」とみなす（px） */
const NEAR_PX = 18;
/** 日本へのズームの倍率（世界地図の日本が日本地図とおおよそ重なる手前まで） */
const ZOOM = 8;
/**
 * ズームしながら日本を枠のまん中へ寄せる量（世界地図の幅・高さに対する％）。
 * 縦は、枠が日本地図の高さまで伸びたあとのまん中に合わせる
 */
const WORLD_TO_JAPAN_H =
  SKY_MAP_JAPAN.h / SKY_MAP_JAPAN.w / (SKY_MAP_WORLD.h / SKY_MAP_WORLD.w);
const SHIFT_X = 50 - SKY_MAP_JAPAN_ON_WORLD.x;
const SHIFT_Y = 50 * WORLD_TO_JAPAN_H - SKY_MAP_JAPAN_ON_WORLD.y;

type Pin = { city: SkyCity; color: string };

export default function SkyMap({
  stamps,
  open,
  onOpen,
}: {
  stamps: SkyStamp[];
  open: string | null;
  onOpen: (city: string | null) => void;
}) {
  const [view, setView] = useState<"world" | "japan">("world");
  const [near, setNear] = useState<string[] | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const pins: Pin[] = stamps.flatMap((s) => {
    const city = getSkyCity(s.city);
    return city
      ? [{ city, color: getCardWeather(s.weather)?.color ?? ACCENT }]
      : [];
  });
  const worldPins = pins.filter((p) => p.city.map.on === "world");
  const japanPins = pins.filter((p) => p.city.map.on === "japan");
  const inJapan = view === "japan";

  const pickWorld = (key: string) => {
    const box = boxRef.current?.getBoundingClientRect();
    const me = getSkyCity(key);
    if (!box || !me) return;
    const close = worldPins.filter(({ city }) => {
      const dx = ((city.map.x - me.map.x) / 100) * box.width;
      const dy = ((city.map.y - me.map.y) / 100) * box.height;
      return Math.hypot(dx, dy) < NEAR_PX;
    });
    if (close.length > 1) {
      setNear(close.map((p) => p.city.key));
      onOpen(null);
    } else {
      setNear(null);
      onOpen(open === key ? null : key);
    }
  };

  const go = (to: "world" | "japan") => {
    setNear(null);
    onOpen(null);
    setView(to);
  };

  // 入るとき：世界を拡大してから日本を出す。戻るとき：日本を先に消してから世界を縮める
  const worldTransition = inJapan
    ? "transform 0.8s cubic-bezier(.45,0,.55,1), opacity 0.3s ease 0.55s"
    : "transform 0.7s cubic-bezier(.25,1,.5,1) 0.1s, opacity 0.3s ease 0.1s";
  const japanTransition = inJapan
    ? "opacity 0.35s ease 0.6s, transform 0.45s ease 0.6s"
    : "opacity 0.25s ease, transform 0.25s ease";

  return (
    <div style={{ marginBottom: 20 }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .sky-map, .sky-map * { transition: none !important; }
        }
      `}</style>
      <div
        ref={boxRef}
        className="sky-map"
        style={{
          position: "relative",
          width: "100%",
          paddingTop: `${((inJapan ? SKY_MAP_JAPAN.h / SKY_MAP_JAPAN.w : SKY_MAP_WORLD.h / SKY_MAP_WORLD.w) * 100).toFixed(2)}%`,
          transition: "padding-top 0.7s ease",
          overflow: "hidden",
        }}
      >
        {/* 世界 */}
        <div
          aria-hidden={inJapan}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            aspectRatio: `${SKY_MAP_WORLD.w} / ${SKY_MAP_WORLD.h}`,
            transformOrigin: `${SKY_MAP_JAPAN_ON_WORLD.x}% ${SKY_MAP_JAPAN_ON_WORLD.y}%`,
            transform: inJapan
              ? `translate(${SHIFT_X}%, ${SHIFT_Y}%) scale(${ZOOM})`
              : "none",
            opacity: inJapan ? 0 : 1,
            pointerEvents: inJapan ? "none" : "auto",
            transition: worldTransition,
          }}
        >
          <Image
            src={SKY_MAP_WORLD.src}
            alt="クレイの世界地図"
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            style={{ objectFit: "contain" }}
          />
          {/* 点はズームといっしょに大きくならないよう、ズームの始めに消す */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: inJapan ? 0 : 1,
              transition: inJapan
                ? "opacity 0.12s ease"
                : "opacity 0.3s ease 0.6s",
            }}
          >
            {worldPins.map(({ city, color }) => (
              <MapPin
                key={city.key}
                x={city.map.x}
                y={city.map.y}
                color={color}
                label={city.name}
                active={
                  open === city.key || (near?.includes(city.key) ?? false)
                }
                tabIndex={inJapan ? -1 : 0}
                onClick={() => pickWorld(city.key)}
              />
            ))}
            {japanPins.length > 0 && (
              <JapanPin
                count={japanPins.length}
                tabIndex={inJapan ? -1 : 0}
                onClick={() => go("japan")}
              />
            )}
          </div>
        </div>

        {/* 日本 */}
        <div
          aria-hidden={!inJapan}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            opacity: inJapan ? 1 : 0,
            transform: inJapan ? "scale(1)" : "scale(0.85)",
            pointerEvents: inJapan ? "auto" : "none",
            transition: japanTransition,
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
              aspectRatio: `${SKY_MAP_JAPAN.w} / ${SKY_MAP_JAPAN.h}`,
            }}
          >
            <Image
              src={SKY_MAP_JAPAN.src}
              alt="クレイの日本地図"
              fill
              sizes="(max-width: 480px) 100vw, 480px"
              style={{ objectFit: "contain" }}
            />
            {japanPins.map(({ city, color }) => (
              <MapPin
                key={city.key}
                x={city.map.x}
                y={city.map.y}
                color={color}
                label={city.name}
                active={open === city.key}
                tabIndex={inJapan ? 0 : -1}
                onClick={() => onOpen(open === city.key ? null : city.key)}
              />
            ))}
          </div>
          <button
            onClick={() => go("world")}
            tabIndex={inJapan ? 0 : -1}
            style={{
              position: "absolute",
              top: 4,
              left: 0,
              background: "#FDFAF7",
              border: "1px solid #EAE0D8",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 12,
              color: SUB,
              cursor: "pointer",
            }}
          >
            世界に戻る
          </button>
        </div>
      </div>

      {near && (
        <div style={{ margin: "12px 0 0" }}>
          <p style={{ fontSize: 11.5, color: SUB, margin: "0 0 8px" }}>
            このあたりの街
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {near.map((key) => (
              <button
                key={key}
                onClick={() => onOpen(open === key ? null : key)}
                aria-pressed={open === key}
                style={{
                  background: open === key ? "#FDFAF7" : "transparent",
                  border: `1px solid ${open === key ? ACCENT : "#EAE0D8"}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  color: INK,
                  cursor: "pointer",
                }}
              >
                {getSkyCity(key)?.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MapPin({
  x,
  y,
  color,
  label,
  active,
  tabIndex,
  onClick,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  active: boolean;
  tabIndex: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      tabIndex={tabIndex}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: 28,
        height: 28,
        transform: "translate(-50%, -50%)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: active ? 15 : 12,
          height: active ? 15 : 12,
          borderRadius: "50%",
          background: color,
          border: "2px solid #FDFAF7",
          boxShadow: active
            ? `0 0 0 3px ${color}55, 0 1px 3px rgba(58,46,38,.3)`
            : "0 1px 3px rgba(58,46,38,.3)",
          transition: "width .15s, height .15s",
        }}
      />
    </button>
  );
}

/** 世界地図の上の「日本」。日本の街に1つでも行っていれば出す。押すと日本地図へ */
function JapanPin({
  count,
  tabIndex,
  onClick,
}: {
  count: number;
  tabIndex: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`日本の地図を開く（行った街 ${count}）`}
      tabIndex={tabIndex}
      style={{
        position: "absolute",
        left: `${SKY_MAP_JAPAN_ON_WORLD.x}%`,
        top: `${SKY_MAP_JAPAN_ON_WORLD.y}%`,
        transform: "translate(-50%, -50%)",
        background: "#FDFAF7",
        border: `1.5px solid ${ACCENT}`,
        borderRadius: 999,
        padding: "3px 9px",
        fontFamily: "'Shippori Mincho', serif",
        fontSize: 11,
        color: INK,
        whiteSpace: "nowrap",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(58,46,38,.25)",
      }}
    >
      日本 {count}
    </button>
  );
}
