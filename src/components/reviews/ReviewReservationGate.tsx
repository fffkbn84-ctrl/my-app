"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import ReviewForm from "./ReviewForm";
import KindaLoader from "@/components/ui/KindaLoader";
import type { ReviewReservationContext } from "@/types/review";

/**
 * 予約起点の口コミ投稿ゲート（認証コード制は廃止）。
 * ログイン本人の completed 予約だけ ReviewForm を表示する。
 * 実際の検証・挿入はサーバの submit_review RPC で行うため、ここは UX 上の門番。
 */
type Gate =
  | { state: "loading" }
  | { state: "need_login" }
  | { state: "error"; message: string }
  | { state: "done" }
  | { state: "ready"; context: ReviewReservationContext };

const WINDOW_DAYS = 30;

export default function ReviewReservationGate({
  reservationId,
}: {
  reservationId?: string;
}) {
  const { user, supabase, loading: authLoading } = useAuth();
  const [gate, setGate] = useState<Gate>({ state: "loading" });

  useEffect(() => {
    if (authLoading) return;
    if (!reservationId) {
      setGate({
        state: "error",
        message:
          "口コミは、マイページの「面談完了」した予約から投稿してください。",
      });
      return;
    }
    if (!user || !supabase) {
      setGate({ state: "need_login" });
      return;
    }

    let cancelled = false;
    (async () => {
      // RLS により本人の予約しか取得できない
      const { data: res, error } = await supabase
        .from("reservations")
        .select(
          "id, status, completed_at, counselor_id, counselor_name, agency_name, start_at",
        )
        .eq("id", reservationId)
        .maybeSingle();

      if (cancelled) return;

      if (error || !res) {
        setGate({
          state: "error",
          message: "対象の予約が見つかりませんでした。マイページからお試しください。",
        });
        return;
      }
      if (res.status !== "completed") {
        setGate({
          state: "error",
          message: "この面談はまだ完了していないため、口コミを投稿できません。",
        });
        return;
      }
      if (
        !res.completed_at ||
        new Date(res.completed_at).getTime() <
          Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000
      ) {
        setGate({
          state: "error",
          message: `口コミの投稿期間（面談完了から${WINDOW_DAYS}日）を過ぎています。`,
        });
        return;
      }

      // 既に投稿済みか（自分の投稿は RLS で閲覧可）
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("reservation_id", reservationId)
        .limit(1);
      if (cancelled) return;
      if (existing && existing.length > 0) {
        setGate({
          state: "error",
          message: "この面談の口コミはすでに投稿済みです（1面談につき1回）。",
        });
        return;
      }

      if (!res.counselor_id) {
        setGate({
          state: "error",
          message: "担当カウンセラー情報が見つからないため投稿できません。",
        });
        return;
      }

      setGate({
        state: "ready",
        context: {
          reservationId: res.id,
          counselorId: res.counselor_id,
          counselorName: res.counselor_name ?? "担当カウンセラー",
          agencyName: res.agency_name ?? "",
          meetingDate: res.start_at ?? res.completed_at,
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, supabase, reservationId]);

  if (gate.state === "loading") {
    return <KindaLoader variant="page" label="予約を確認しています…" />;
  }

  if (gate.state === "need_login") {
    const redirect = encodeURIComponent(
      `/reviews/new?reservation=${reservationId ?? ""}`,
    );
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ fontSize: 14, color: "var(--mid)", marginBottom: 20, lineHeight: 1.9 }}>
          口コミは、Kinda ふたりへ経由で面談を予約・完了した方のみ投稿できます。
          <br />
          ログインして、ご自身の予約からお進みください。
        </p>
        <Link
          href={`/login?redirect=${redirect}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "white",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ログイン / 新規登録
        </Link>
      </div>
    );
  }

  if (gate.state === "error") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ fontSize: 14, color: "var(--mid)", marginBottom: 20, lineHeight: 1.9 }}>
          {gate.message}
        </p>
        <Link
          href="/mypage"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 999,
            border: "1px solid var(--light)",
            color: "var(--mid)",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          マイページへ
        </Link>
      </div>
    );
  }

  if (gate.state === "done") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ fontSize: 16, color: "var(--ink)", marginBottom: 12, fontFamily: "var(--font-mincho)" }}>
          口コミを投稿しました。ありがとうございます。
        </p>
        <p style={{ fontSize: 13, color: "var(--mid)", marginBottom: 24, lineHeight: 1.9 }}>
          内容を確認のうえ、公開させていただきます。
        </p>
        <Link
          href="/mypage"
          style={{
            display: "inline-flex",
            padding: "12px 28px",
            borderRadius: 999,
            border: "1px solid var(--light)",
            color: "var(--mid)",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          マイページへ
        </Link>
      </div>
    );
  }

  return (
    <ReviewForm
      context={gate.context}
      onSubmitted={() => setGate({ state: "done" })}
    />
  );
}
