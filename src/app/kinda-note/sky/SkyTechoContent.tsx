"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { useAuth } from "@/lib/auth/AuthProvider";
import SkyStamp from "../components/SkyStamp";
import StorageHint from "../components/StorageHint";
import { getCardWeather } from "../data/daily";
import { SKY_CITIES, getSkyCity, getSkyLine } from "../data/skyCities";
import { loadSkyStamps, type SkyStamp as Stamp } from "../lib/storage";

/**
 * 空の手帳（2026-10-15）。設計は docs/research/2026-10-12-shohyo-tokyo-ugoki.md §5
 * - 行った街をスタンプで並べる（古い順）。まだ行っていない街は「？」の枠だけ（どこかは伏せる）
 * - 出す数字は行った街の数だけ。連続日数・皆勤・ランキングは出さない
 * - スタンプを押すと、はじめて行った日の一言を出す
 */

const INK = "#3A2E26";
const SUB = "#7A6A5A";
const FAINT = "#B0A090";
const ACCENT = "#D4A090";

export default function SkyTechoContent() {
  const { user, supabase } = useAuth();
  const [stamps, setStamps] = useState<Stamp[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void loadSkyStamps(user ? supabase : null, user?.id).then((s) => {
      if (alive) setStamps(s);
    });
    return () => {
      alive = false;
    };
  }, [user, supabase]);

  const visited = stamps ?? [];
  const rest = Math.max(SKY_CITIES.length - visited.length, 0);
  const opened = visited.find((s) => s.city === open) ?? null;

  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
      <SectionSubHeader sectionName="Kinda note" sectionRoot="/kinda-note" />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "Kinda note", href: "/kinda-note" },
          { label: "空の手帳" },
        ]}
      />

      <div className="pc-readable" style={{ padding: "28px 24px 80px" }}>
        <h1
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 26,
            fontWeight: 500,
            color: INK,
            margin: "0 0 12px",
            letterSpacing: "0.06em",
          }}
        >
          空の手帳
        </h1>
        <p style={{ fontSize: 13.5, lineHeight: 1.9, color: SUB, margin: "0 0 20px" }}>
          今日の天気を出すと、同じ空の街へあなたの空が旅をします。行った街はここにスタンプでたまっていきます。
        </p>

        {stamps !== null && (
          <p style={{ fontSize: 13, color: INK, margin: "0 0 18px" }}>
            行った街　<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18 }}>{visited.length}</span>
          </p>
        )}

        {/* 押したスタンプの一言は枠の上に出す（下だと「？」の枠に押し出されて見えない） */}
        {opened && <OpenedStamp stamp={opened} />}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))",
            gap: "18px 10px",
            justifyItems: "center",
            marginBottom: 20,
          }}
        >
          {visited.map((s) => (
            <button
              key={s.city}
              onClick={() => setOpen(open === s.city ? null : s.city)}
              aria-pressed={open === s.city}
              style={{
                background: "none",
                border: "none",
                padding: 4,
                cursor: "pointer",
                borderRadius: "50%",
                outline: open === s.city ? `2px solid ${ACCENT}55` : "none",
              }}
            >
              <SkyStamp
                city={getSkyCity(s.city)}
                color={getCardWeather(s.weather)?.color}
                date={new Date(s.first_at)}
              />
            </button>
          ))}
          {stamps !== null &&
            Array.from({ length: rest }, (_, i) => (
              <div key={`rest-${i}`} style={{ padding: 4 }}>
                <SkyStamp city={null} />
              </div>
            ))}
        </div>

        {stamps !== null && visited.length === 0 && (
          <p style={{ fontSize: 13, color: SUB, lineHeight: 1.9, margin: "0 0 20px" }}>
            まだどの街にも行っていません。今日の天気を出すと、最初のスタンプが押されます。
          </p>
        )}

        <p style={{ fontSize: 11.5, color: FAINT, lineHeight: 1.9, margin: "0 0 8px" }}>
          街の様子は Kinda が書いた小さな物語です。
        </p>
        <StorageHint color={FAINT} />

        <Link
          href="/kinda-note/today"
          style={{
            display: "block",
            textAlign: "center",
            background: ACCENT,
            borderRadius: 999,
            padding: "16px",
            fontSize: 14,
            fontWeight: 500,
            color: "white",
            textDecoration: "none",
            boxShadow: "0 4px 0 #B8806E",
          }}
        >
          今日の天気を出す
        </Link>
      </div>
    </div>
  );
}

function OpenedStamp({ stamp }: { stamp: Stamp }) {
  const c = getSkyCity(stamp.city);
  const w = getCardWeather(stamp.weather);
  const line = getSkyLine(stamp.weather, stamp.city);
  if (!c) return null;
  const d = new Date(stamp.first_at);

  return (
    <section
      style={{
        background: "#FDFAF7",
        border: `1px solid ${w?.color ?? ACCENT}55`,
        borderRadius: 16,
        padding: "16px 18px",
        marginBottom: 20,
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: "0.12em", color: FAINT, margin: "0 0 6px" }}>
        {d.getMonth() + 1}月{d.getDate()}日{w ? `　${w.name_ja}` : ""}
      </p>
      <p
        style={{
          fontFamily: "'Shippori Mincho', serif",
          fontSize: 17,
          fontWeight: 500,
          color: INK,
          margin: "0 0 8px",
        }}
      >
        {c.name}
      </p>
      {line && <p style={{ fontSize: 13.5, lineHeight: 1.9, color: INK, margin: 0 }}>{line}</p>}
    </section>
  );
}
