"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DIAGNOSIS_TYPES, DiagnosisTypeId } from "@/lib/diagnosis";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  fetchDiagnosisHistory,
  type DiagnosisHistoryItem,
} from "@/lib/kinda/diagnosisHistory";

const TYPE_IDS: DiagnosisTypeId[] = ["A", "B", "C", "D"];

function isTypeId(s: string): s is DiagnosisTypeId {
  return (TYPE_IDS as readonly string[]).includes(s);
}

function formatDate(iso: string): string {
  if (!iso) return "----/--/--";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "----/--/--";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
  } catch {
    return "----/--/--";
  }
}

/**
 * Kinda type 履歴セクション（最新1件のヒーロー表示）。
 * - ログイン済 + 履歴あり: 最新1件をヒーローカードで表示 +「もう一度チェックする」リンク
 * - ゲスト + 履歴あり:    localStorage の最新1件を同形式で表示
 * - 履歴なし:             ぼかしプレビュー + ログイン誘導 / Kinda type 誘導
 */
export default function DiagnosisTypeHistorySection() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<DiagnosisHistoryItem[] | null>(null);

  useEffect(() => {
    if (authLoading) return;
    // 未ログイン時はマイページに履歴を表示しない。
    // localStorage の保存は維持され、ログイン時に
    // mergeLocalDiagnosisToSupabase で Supabase に移される。
    if (!user) {
      setHistory([]);
      return;
    }
    let active = true;
    (async () => {
      const items = await fetchDiagnosisHistory({
        supabase,
        userId: user.id,
        kind: "type",
        limit: 1,
      });
      if (!active) return;
      setHistory(items);
    })();
    return () => {
      active = false;
    };
  }, [authLoading, supabase, user]);

  if (history === null) return null;

  return (
    <section style={{ marginTop: 32 }}>
      <SectionHeader />
      {history.length > 0 ? (
        <LatestHero item={history[0]} />
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
            color: "#5A7FAF",
          }}
        >
          type
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
        あなたに合うカウンセラーのタイプ
      </p>
    </div>
  );
}

/* ─────────── 最新1件ヒーロー ─────────── */
function LatestHero({ item }: { item: DiagnosisHistoryItem }) {
  const tid = isTypeId(item.result_key) ? item.result_key : null;
  const dt = tid ? DIAGNOSIS_TYPES[tid] : null;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: dt?.gradient ?? "var(--pale)",
          padding: "28px 24px 24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,.25)",
            backdropFilter: "blur(10px)",
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            fontStyle: "italic",
            color: "white",
            marginBottom: 12,
          }}
          aria-hidden="true"
        >
          {tid ?? "?"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 22,
            fontWeight: 500,
            marginBottom: 4,
            textShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          {dt?.name ?? "Kinda type"}
        </div>
        <div
          style={{
            fontSize: 12,
            opacity: 0.92,
            letterSpacing: ".06em",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
          }}
        >
          {dt?.label ?? ""}
        </div>
      </div>
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--muted)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: ".04em",
          }}
        >
          {formatDate(item.created_at)}
        </span>
        <Link
          href={tid ? `/kinda-type/result?type=${tid}` : "/kinda-type"}
          style={{
            fontSize: 12,
            padding: "8px 16px",
            borderRadius: 20,
            background: "var(--pale)",
            color: "var(--ink)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: ".04em",
            textDecoration: "none",
            border: "1px solid var(--light)",
          }}
        >
          結果を見る →
        </Link>
      </div>
      <div
        style={{
          padding: "0 20px 20px",
          textAlign: "center",
        }}
      >
        <Link
          href="/kinda-type"
          style={{
            display: "inline-block",
            fontSize: 12,
            color: "var(--mid)",
            fontFamily: "var(--font-sans)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          もう一度チェックする
        </Link>
      </div>
    </div>
  );
}

/* ─────────── 履歴ゼロ時 ─────────── */
function EmptyState({ loggedIn }: { loggedIn: boolean }) {
  const previewType = DIAGNOSIS_TYPES.A;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: previewType.gradient,
          padding: "28px 24px 24px",
          textAlign: "center",
          color: "white",
          opacity: 0.5,
          filter: "blur(3px)",
          userSelect: "none",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,.25)",
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            fontStyle: "italic",
            marginBottom: 12,
          }}
        >
          ?
        </div>
        <div
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 22,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          ＿＿タイプ
        </div>
        <div style={{ fontSize: 12, opacity: 0.92 }}>＿＿＿＿＿＿＿＿＿＿</div>
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
              まだ相性チェックの履歴がありません。
              <br />
              気軽に試してみてください。
            </>
          ) : (
            <>
              マイページに登録すると、
              <br />
              相性チェックの結果がここに残ります。
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
          {loggedIn ? (
            <Link
              href="/kinda-type"
              style={{
                fontSize: 12,
                padding: "9px 20px",
                borderRadius: 24,
                background: "#5A7FAF",
                color: "white",
                boxShadow: "0 4px 16px rgba(90,127,175,.32)",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: ".05em",
                textDecoration: "none",
              }}
            >
              相性をチェックする
            </Link>
          ) : (
            <>
              <Link
                href="/login?mode=signup"
                style={{
                  fontSize: 12,
                  padding: "9px 20px",
                  borderRadius: 24,
                  background: "#5A7FAF",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(90,127,175,.32)",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: ".05em",
                  textDecoration: "none",
                }}
              >
                新規登録
              </Link>
              <Link
                href="/login"
                style={{
                  fontSize: 12,
                  padding: "9px 20px",
                  borderRadius: 24,
                  background: "white",
                  color: "var(--ink)",
                  border: "1px solid var(--light)",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: ".05em",
                  textDecoration: "none",
                }}
              >
                ログイン
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
