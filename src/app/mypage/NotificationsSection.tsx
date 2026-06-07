"use client";

/**
 * マイページ：相談所からのお知らせ一覧
 * - 相談所/カウンセラー → ユーザー方向の通知を一覧表示する
 *   1. reservations.agency_message            … 相談所からのメッセージ
 *   2. reschedule_status='requested' & by='counselor' … カウンセラー発の日程変更提案
 *   （口コミへの相談所返信 reviews.agency_reply は意図的に通知対象外。
 *     返信はカウンセラー詳細ページで確認できる。理由は useUserNotifications 参照）
 * - 「前回確認した時刻」より新しいものには「新着」バッジを付ける
 * - 表示後に既読化（markSeen）してボトムナビのドットを消す。
 *   ただし一覧自体は残るので「何の通知だったか」が分かる。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useUserNotifications } from "@/lib/useUserNotifications";

type NotiKind = "message" | "reschedule";

type NotiItem = {
  id: string;
  kind: NotiKind;
  at: number; // epoch ms
  atIso: string;
  title: string;
  body: string;
  href: string;
};

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${w[d.getDay()]}） ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function snippet(text: string, max = 60): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

const KIND_LABEL: Record<NotiKind, string> = {
  message: "相談所からのメッセージ",
  reschedule: "日程変更の提案",
};

export default function NotificationsSection() {
  const { user, loading: authLoading, supabase } = useAuth();
  const { markSeen, fetchSeenAt } = useUserNotifications();
  const [items, setItems] = useState<NotiItem[] | null>(null);
  // 「新着」判定用に、マウント時点の既読時刻を固定でキャプチャ（markSeen 前）
  const priorSeenRef = useRef<number>(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !supabase) {
      setItems([]);
      return;
    }
    let cancelled = false;
    (async () => {
      // markSeen で更新する前の既読時刻（DB）を新着判定の基準にする
      priorSeenRef.current = await fetchSeenAt();
      if (cancelled) return;
      const list: NotiItem[] = [];

      const { data: resv } = await supabase
        .from("reservations")
        .select(
          "id, counselor_name, agency_name, agency_message, agency_message_at, reschedule_status, reschedule_requested_by, reschedule_requested_at, reschedule_proposed_start",
        );
      for (const r of (resv ?? []) as Array<{
        id: string;
        counselor_name: string | null;
        agency_name: string | null;
        agency_message: string | null;
        agency_message_at: string | null;
        reschedule_status: string | null;
        reschedule_requested_by: string | null;
        reschedule_requested_at: string | null;
        reschedule_proposed_start: string | null;
      }>) {
        if (r.agency_message && r.agency_message_at) {
          list.push({
            id: `msg-${r.id}`,
            kind: "message",
            at: new Date(r.agency_message_at).getTime(),
            atIso: r.agency_message_at,
            title: `${r.agency_name ?? "相談所"}からのメッセージ`,
            body: snippet(r.agency_message),
            href: `/mypage/reservations/${r.id}`,
          });
        }
        if (
          r.reschedule_status === "requested" &&
          r.reschedule_requested_by === "counselor" &&
          r.reschedule_requested_at
        ) {
          list.push({
            id: `resc-${r.id}`,
            kind: "reschedule",
            at: new Date(r.reschedule_requested_at).getTime(),
            atIso: r.reschedule_requested_at,
            title: `${r.counselor_name ?? "カウンセラー"}から日程変更の提案`,
            body: r.reschedule_proposed_start
              ? `希望日時：${fmtDateTime(r.reschedule_proposed_start)}`
              : "予約詳細から内容をご確認ください",
            href: `/mypage/reservations/${r.id}`,
          });
        }
      }

      list.sort((a, b) => b.at - a.at);
      if (cancelled) return;
      setItems(list.slice(0, 6));
      // 表示できたので既読化（ドットを消す）。一覧は残る。
      markSeen();
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, supabase, markSeen, fetchSeenAt]);

  const priorSeen = priorSeenRef.current;
  const hasItems = (items?.length ?? 0) > 0;

  // 表示するものが無ければセクションごと隠す
  const visible = useMemo(() => !authLoading && user && hasItems, [authLoading, user, hasItems]);
  if (!visible) return null;

  return (
    <section style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ fontFamily: "var(--font-mincho)", fontSize: 18, fontWeight: 500, color: "var(--ink)" }}>
          相談所からのお知らせ
        </h2>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          notifications
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(items ?? []).map((n) => {
          const isNew = n.at > priorSeen;
          return (
            <Link
              key={n.id}
              href={n.href}
              style={{
                display: "block",
                background: "white",
                border: isNew ? "1px solid var(--accent)" : "1px solid var(--border)",
                borderLeft: isNew ? "3px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 14,
                padding: "14px 16px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--accent)",
                    background: "rgba(200,169,122,.12)",
                    padding: "2px 8px",
                    borderRadius: 20,
                    flexShrink: 0,
                  }}
                >
                  {KIND_LABEL[n.kind]}
                </span>
                {isNew && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "white",
                      background: "var(--rose)",
                      padding: "2px 8px",
                      borderRadius: 20,
                      flexShrink: 0,
                    }}
                  >
                    新着
                  </span>
                )}
                <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)", flexShrink: 0 }}>
                  {fmtDateTime(n.atIso)}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-mincho)", fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>
                {n.title}
              </p>
              <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.7 }}>{n.body}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
