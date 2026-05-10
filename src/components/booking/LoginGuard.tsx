"use client";

/**
 * 予約フロー用ログインガード。
 * - 未ログインなら /login?redirect=... にリダイレクト
 * - ログイン状態のロード中は薄いローディング表示
 * - ログイン済みなら children をそのまま表示
 */
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginGuard({
  redirectTo,
  children,
}: {
  /** 未ログイン時にログイン後戻ってくる URL（pathname + search 推奨） */
  redirectTo: string;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) return;
    if (redirected) return;
    setRedirected(true);
    const target = `/login?redirect=${encodeURIComponent(redirectTo)}`;
    router.replace(target);
  }, [user, loading, router, redirectTo, redirected]);

  if (loading || (!user && !redirected)) {
    return <LoadingShim message="読み込み中..." />;
  }
  if (!user) {
    // リダイレクト中にユーザーが手動で戻る等のケースに備えた fallback
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "80px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 20,
            color: "var(--ink)",
            marginBottom: 16,
          }}
        >
          予約にはログインが必要です
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--mid)",
            lineHeight: 1.8,
            marginBottom: 28,
          }}
        >
          予約後にマイページから日時の確認・キャンセルができるようにするため、
          ログインまたは新規登録（無料）をお願いしています。
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "stretch",
          }}
        >
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="bk-btn bk-btn-accent bk-btn-lg"
          >
            ログイン / 新規登録
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 12,
              color: "var(--muted)",
              textDecoration: "underline",
              padding: "8px 0",
            }}
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function LoadingShim({ message }: { message: string }) {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "120px 24px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "2px solid var(--light)",
          borderTopColor: "var(--accent)",
          animation: "spin 0.8s linear infinite",
          marginBottom: 16,
        }}
      />
      <p style={{ fontSize: 12, color: "var(--muted)" }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
