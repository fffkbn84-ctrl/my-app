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
 * Kinda type 診断履歴セクション。
 * - ログイン済 + 履歴あり → Supabase の履歴を一覧表示
 * - ゲスト + 履歴あり → localStorage の履歴を一覧表示
 * - 履歴なし → 既存の促進プレビュー（ぼかしモック + ログイン誘導）
 */
export default function DiagnosisTypeHistorySection() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<DiagnosisHistoryItem[] | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      const items = await fetchDiagnosisHistory({
        supabase,
        userId: user?.id ?? null,
        kind: "type",
        limit: 20,
      });
      if (!active) return;
      setHistory(items);
    })();
    return () => {
      active = false;
    };
  }, [authLoading, supabase, user]);

  // 認証ロード中・履歴 fetch 中は何も出さない（チラつき防止）
  if (history === null) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: ".12em",
          color: "var(--accent)",
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 12,
        }}
      >
        DIAGNOSIS HISTORY
      </p>

      {history.length > 0 ? (
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {history.map((item, i) => {
            const tid = isTypeId(item.result_key) ? item.result_key : null;
            const dt = tid ? DIAGNOSIS_TYPES[tid] : null;
            return (
              <Link
                key={item.id}
                href={
                  tid
                    ? `/kinda-type/result?type=${tid}`
                    : "/kinda-type/result"
                }
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderBottom:
                    i < history.length - 1 ? "1px solid var(--pale)" : "none",
                  textDecoration: "none",
                  color: "var(--ink)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: dt?.gradient ?? "var(--pale)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: dt?.color ?? "var(--mid)",
                  }}
                  aria-hidden="true"
                >
                  {tid ?? "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mincho)",
                      fontSize: 14,
                      color: "var(--black)",
                      marginBottom: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {dt?.name ?? "Kinda type"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {dt?.label ?? ""}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {formatDate(item.created_at)}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <DiagnosisHistoryPromo loggedIn={!!user} />
      )}
    </div>
  );
}

/* ───────── 履歴ゼロ時の促進プレビュー（既存 mypage の表示を移植） ───────── */
function DiagnosisHistoryPromo({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {Object.values(DIAGNOSIS_TYPES)
        .slice(0, 3)
        .map((dt, i, arr) => (
          <div
            key={dt.id}
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderBottom: i < arr.length - 1 ? "1px solid var(--pale)" : "none",
              opacity: 0.45,
              filter: "blur(3px)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: dt.gradient,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: dt.color,
              }}
            >
              {dt.id}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-mincho)",
                  fontSize: 14,
                  color: "var(--black)",
                  marginBottom: 2,
                }}
              >
                {dt.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {dt.label}
              </div>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                fontFamily: "'DM Sans', sans-serif",
                flexShrink: 0,
              }}
            >
              ----/--/--
            </div>
          </div>
        ))}

      <div
        style={{
          padding: "20px",
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
              ログインすると、過去の相性チェック結果を
              <br />
              いつでも確認できます。
            </>
          )}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
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
            href="/kinda-type"
            style={{
              fontSize: 12,
              padding: "9px 20px",
              borderRadius: 24,
              background: loggedIn ? "var(--black)" : "white",
              color: loggedIn ? "white" : "var(--ink)",
              border: loggedIn ? "none" : "1px solid var(--light)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: ".05em",
              textDecoration: "none",
            }}
          >
            相性チェックする
          </Link>
        </div>
      </div>
    </div>
  );
}
