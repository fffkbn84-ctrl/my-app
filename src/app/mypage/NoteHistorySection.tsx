"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  fetchDiagnosisHistory,
  type DiagnosisHistoryItem,
} from "@/lib/kinda/diagnosisHistory";
import { getTypeContent } from "@/app/kinda-note/data/typeContent";
import type {
  RouteKey,
  WeatherKey,
} from "@/app/kinda-note/data/weatherDescriptions";

/**
 * Kinda note 履歴セクション。
 * - ログイン済 + 履歴あり: Supabase の履歴を天気予報風タイルで横スクロール
 * - ゲスト + 履歴あり:    localStorage の履歴を同じ形式で横スクロール
 * - 履歴なし + ログイン:   「まだ天気がありません」 + Kinda note 誘導
 * - 履歴なし + 未ログイン: ぼかしプレビュー + ログイン誘導
 *
 * タイルタップ → answers を localStorage に書き戻し /kinda-note/result?route= へ遷移。
 */

const ROUTE_LABEL: Record<RouteKey, string> = {
  pre: "婚活前",
  waiting: "活動中",
  omiai: "お見合い後",
  date1: "デート後",
  kousai: "交際中",
  multiple: "複数の人",
};

// .webp に統一されているが rain_cloud だけ .jpg
function weatherImagePath(weather: WeatherKey): string {
  if (weather === "rain_cloud") return "/images/w_rain_cloud.jpg";
  return `/images/w_${weather}.webp`;
}

function formatMonthDay(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return "";
  }
}

type StoredAnswerShape = {
  route?: string;
  answers?: Record<string, string[]>;
  freeTexts?: Record<string, string>;
};

export default function NoteHistorySection() {
  const router = useRouter();
  const { user, supabase, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<DiagnosisHistoryItem[] | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      const items = await fetchDiagnosisHistory({
        supabase,
        userId: user?.id ?? null,
        kind: "note",
        limit: 5,
      });
      if (!active) return;
      setHistory(items);
    })();
    return () => {
      active = false;
    };
  }, [authLoading, supabase, user]);

  // 認証ロード中・履歴 fetch 中はチラつき防止のため何も出さない
  if (history === null) return null;

  const handleTileClick = (item: DiagnosisHistoryItem) => {
    const data = item.answers as StoredAnswerShape | undefined;
    const route = (data?.route ?? "omiai") as RouteKey;
    // 過去の回答を復元してから結果ページへ。
    // これにより layer2/3 の動的本文も当時のまま再表示される。
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "kinda-note-answers",
          JSON.stringify({
            phase: route,
            answers: data?.answers ?? {},
            freeTexts: data?.freeTexts ?? {},
          }),
        );
      }
    } catch {
      /* quota など無視 */
    }
    router.push(`/kinda-note/result?route=${route}`);
  };

  return (
    <section style={{ marginTop: 32 }}>
      <SectionHeader />
      {history.length > 0 ? (
        <ScrollList items={history} onItemClick={handleTileClick} />
      ) : (
        <EmptyState loggedIn={!!user} />
      )}
    </section>
  );
}

/* ─────────── Bパターンのセクション見出し ─────────── */
function SectionHeader() {
  return (
    <div style={{ marginBottom: 16 }}>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontWeight: 500,
          fontSize: 18,
          color: "var(--ink)",
          letterSpacing: ".06em",
          marginBottom: 4,
        }}
      >
        <span>Kinda </span>
        <span
          style={{
            fontStyle: "italic",
            fontFamily: "'DM Serif Display', serif",
            color: "#D4A090",
          }}
        >
          note
        </span>
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--mid)",
          fontFamily: "var(--font-sans)",
          fontWeight: 300,
          lineHeight: 1.7,
        }}
      >
        あなたの気持ちの天気予報
      </p>
    </div>
  );
}

/* ─────────── 横スクロールタイル列 ─────────── */
function ScrollList({
  items,
  onItemClick,
}: {
  items: DiagnosisHistoryItem[];
  onItemClick: (item: DiagnosisHistoryItem) => void;
}) {
  return (
    <div
      className="hide-scrollbar"
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        margin: "0 -20px",
        padding: "4px 20px",
      }}
    >
      {items.map((item) => {
        const weather = item.result_key as WeatherKey;
        const tc = getTypeContent(weather);
        const data = item.answers as StoredAnswerShape | undefined;
        const route = (data?.route ?? "omiai") as RouteKey;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onItemClick(item)}
            style={{
              flex: "0 0 auto",
              width: 124,
              scrollSnapAlign: "start",
              padding: 12,
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 16,
              boxShadow: "0 2px 10px rgba(180,140,90,.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              textAlign: "center",
            }}
            aria-label={`${tc?.fullName ?? "Kinda note"} の結果を再表示`}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 14,
                overflow: "hidden",
                background: "var(--pale)",
                position: "relative",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <Image
                src={weatherImagePath(weather)}
                alt=""
                fill
                sizes="76px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 13,
                color: "var(--ink)",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {tc?.typeName ?? "—"}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: ".04em",
              }}
            >
              {ROUTE_LABEL[route] ?? ""} · {formatMonthDay(item.created_at)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────── 履歴ゼロ時 ─────────── */
function EmptyState({ loggedIn }: { loggedIn: boolean }) {
  // ぼかしタイル4枚（プレビュー）
  const previewWeathers: WeatherKey[] = [
    "angels_ladder",
    "sunrise",
    "light_rain_start",
    "morning_mist",
  ];
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: 12,
          overflowX: "hidden",
          padding: "16px 20px",
          opacity: 0.5,
          filter: "blur(3px)",
          userSelect: "none",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {previewWeathers.map((w) => {
          const tc = getTypeContent(w);
          return (
            <div
              key={w}
              style={{
                flex: "0 0 auto",
                width: 100,
                padding: 10,
                background: "var(--pale)",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  background: "var(--light)",
                }}
              >
                <Image
                  src={weatherImagePath(w)}
                  alt=""
                  fill
                  sizes="60px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: 11,
                  color: "var(--ink)",
                }}
              >
                {tc?.typeName ?? "—"}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: 20,
          background: "var(--pale)",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: "var(--mid)",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
            marginBottom: 12,
            lineHeight: 1.7,
          }}
        >
          {loggedIn ? (
            <>
              まだ天気がありません。
              <br />
              気持ちが揺れたとき、何度でも。
            </>
          ) : (
            <>
              ログインすると、過去の天気を
              <br />
              ここに並べて見返せます。
            </>
          )}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {!loggedIn && (
            <Link
              href="/login"
              style={{
                fontSize: 12,
                padding: "9px 20px",
                borderRadius: 24,
                background: "var(--black)",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: ".05em",
                textDecoration: "none",
              }}
            >
              ログイン
            </Link>
          )}
          <Link
            href="/kinda-note"
            style={{
              fontSize: 12,
              padding: "9px 20px",
              borderRadius: 24,
              background: loggedIn ? "#D4A090" : "white",
              color: loggedIn ? "white" : "var(--ink)",
              border: loggedIn ? "none" : "1px solid var(--light)",
              boxShadow: loggedIn
                ? "0 4px 16px rgba(212,160,144,.32)"
                : "none",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: ".05em",
              textDecoration: "none",
            }}
          >
            気持ちを整理する
          </Link>
        </div>
      </div>
    </div>
  );
}
