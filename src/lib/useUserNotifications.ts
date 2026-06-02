"use client";

/**
 * useUserNotifications — 相談所からの「返信・お知らせ」の未読通知フック
 *
 * 通知の元データ（すべてカウンセラー / 相談所 → ユーザー方向）:
 *   1. reservations.agency_message      … 相談所からのメッセージ
 *   2. reservations.reschedule_status='requested' かつ requested_by='counselor'
 *                                        … カウンセラーからの日程変更提案（要対応）
 *   3. reviews.agency_reply             … 投稿した口コミへの相談所返信
 *
 * 「最後に確認した時刻」は profiles.notifications_seen_at に保存する（全端末同期）。
 * 最新通知がそれより新しければ未読(hasUnseen)。markSeen() で既読化し、
 * window イベントで他のインスタンス（BottomNav 等）に伝播する。
 */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

const CHANGED_EVENT = "kinda-notif-changed";

export function useUserNotifications() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [latestAt, setLatestAt] = useState<number>(0);
  const [seenAt, setSeenAt] = useState<number>(0);

  // 既読時刻を DB から取得
  const fetchSeenAt = useCallback(async (): Promise<number> => {
    if (!user || !supabase) return 0;
    const { data } = await supabase
      .from("profiles")
      .select("notifications_seen_at")
      .eq("id", user.id)
      .maybeSingle();
    const iso = (data as { notifications_seen_at: string | null } | null)?.notifications_seen_at;
    return iso ? new Date(iso).getTime() : 0;
  }, [user, supabase]);

  // 最新の通知時刻 + 既読時刻を取得
  const refresh = useCallback(async () => {
    if (!user || !supabase) {
      setLatestAt(0);
      setSeenAt(0);
      return;
    }
    let max = 0;

    // 予約由来（メッセージ / カウンセラー発の日程変更提案）
    const { data: resv } = await supabase
      .from("reservations")
      .select(
        "agency_message, agency_message_at, reschedule_status, reschedule_requested_by, reschedule_requested_at",
      );
    for (const r of (resv ?? []) as Array<{
      agency_message: string | null;
      agency_message_at: string | null;
      reschedule_status: string | null;
      reschedule_requested_by: string | null;
      reschedule_requested_at: string | null;
    }>) {
      if (r.agency_message && r.agency_message_at) {
        max = Math.max(max, new Date(r.agency_message_at).getTime());
      }
      if (
        r.reschedule_status === "requested" &&
        r.reschedule_requested_by === "counselor" &&
        r.reschedule_requested_at
      ) {
        max = Math.max(max, new Date(r.reschedule_requested_at).getTime());
      }
    }

    // 口コミへの相談所返信
    const { data: revs } = await supabase
      .from("reviews")
      .select("agency_reply, updated_at")
      .eq("user_id", user.id)
      .not("agency_reply", "is", null);
    for (const r of (revs ?? []) as Array<{
      agency_reply: string | null;
      updated_at: string | null;
    }>) {
      if (r.agency_reply && r.updated_at) {
        max = Math.max(max, new Date(r.updated_at).getTime());
      }
    }

    const seen = await fetchSeenAt();
    setLatestAt(max);
    setSeenAt(seen);
  }, [user, supabase, fetchSeenAt]);

  // 既読化（DB の profiles.notifications_seen_at を now に更新し、全端末で同期）
  const markSeen = useCallback(async () => {
    if (!user || !supabase) return;
    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, notifications_seen_at: nowIso }, { onConflict: "id" });
    if (error) return;
    setSeenAt(new Date(nowIso).getTime());
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CHANGED_EVENT));
    }
  }, [user, supabase]);

  // 初回 / ログイン状態変化で取得
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLatestAt(0);
      setSeenAt(0);
      return;
    }
    refresh();
  }, [authLoading, user, refresh]);

  // 他インスタンスでの既読化に追従（DB から既読時刻を読み直す）
  useEffect(() => {
    if (!user) return;
    const onChanged = () => {
      fetchSeenAt().then((s) => setSeenAt(s));
    };
    window.addEventListener(CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(CHANGED_EVENT, onChanged);
  }, [user, fetchSeenAt]);

  const hasUnseen = latestAt > 0 && latestAt > seenAt;
  return { hasUnseen, markSeen, fetchSeenAt };
}
