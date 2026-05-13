"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

type ReviewRow = {
  id: string;
  counselor_id: string;
  rating: number;
  body: string;
  is_published: boolean | null;
  created_at: string;
  source_type: string;
};

type CounselorMini = {
  id: string;
  name: string | null;
};

/**
 * マイページ「口コミ履歴」。
 * 自分が投稿した reviews（user_id = auth.uid()）を時系列で表示。
 * - is_published=false（運営承認待ち）も含めて見せる
 * - カウンセラー名は別クエリで取得（JOIN は型推論を壊すため）
 * - 投稿 0 件なら何も描画しない
 */
export default function ReviewHistorySection() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [counselorById, setCounselorById] = useState<Record<string, CounselorMini>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const r = await supabase
        .from("reviews")
        .select(
          "id, counselor_id, rating, body, is_published, created_at, source_type",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!active) return;
      const list = ((r.data ?? []) as unknown as ReviewRow[]) || [];
      setReviews(list);

      // カウンセラー名を別クエリで取得
      const counselorIds = Array.from(new Set(list.map((x) => x.counselor_id)));
      if (counselorIds.length > 0) {
        const c = await supabase
          .from("counselors")
          .select("id, name")
          .in("id", counselorIds);
        if (!active) return;
        const data = (c.data ?? []) as unknown as CounselorMini[];
        const map: Record<string, CounselorMini> = {};
        for (const row of data) {
          map[row.id] = row;
        }
        setCounselorById(map);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user, supabase, authLoading]);

  if (authLoading || loading) return null;
  if (!user) return null;
  if (reviews.length === 0) return null;

  return (
    <section style={{ marginTop: 32 }}>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: ".18em",
          color: "var(--muted)",
          textTransform: "uppercase",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        my reviews
      </div>
      <h2
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: 18,
          fontWeight: 500,
          color: "var(--ink)",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        投稿した口コミ
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reviews.map((r) => {
          const counselor = counselorById[r.counselor_id];
          const counselorName = counselor?.name ?? "—";
          return (
            <article
              key={r.id}
              style={{
                background: "white",
                border: "1px solid var(--light)",
                borderRadius: 14,
                padding: "16px 18px",
              }}
            >
              <header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  {counselor?.id ? (
                    <Link
                      href={`/counselors/${counselor.id}`}
                      style={{
                        fontFamily: "var(--font-mincho)",
                        fontSize: 14,
                        color: "var(--ink)",
                        textDecoration: "none",
                      }}
                    >
                      {counselorName} カウンセラー
                    </Link>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-mincho)",
                        fontSize: 14,
                        color: "var(--ink)",
                      }}
                    >
                      {counselorName} カウンセラー
                    </span>
                  )}
                  <span style={{ color: "var(--accent)", fontSize: 13 }}>
                    {"★".repeat(r.rating)}
                  </span>
                </div>
                <StatusBadge isPublished={r.is_published} />
              </header>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--mid)",
                  lineHeight: 1.8,
                  marginBottom: 8,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {r.body}
              </p>
              <time
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {formatDate(r.created_at)}
              </time>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StatusBadge({ isPublished }: { isPublished: boolean | null }) {
  if (isPublished) {
    return (
      <span
        style={{
          fontSize: 10,
          color: "var(--green)",
          background: "rgba(122,158,135,.12)",
          padding: "3px 10px",
          borderRadius: 20,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: ".04em",
        }}
      >
        公開中
      </span>
    );
  }
  return (
    <span
      style={{
        fontSize: 10,
        color: "var(--mid)",
        background: "var(--pale)",
        padding: "3px 10px",
        borderRadius: 20,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: ".04em",
      }}
    >
      公開待ち
    </span>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  } catch {
    return "";
  }
}
