"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useFavoritesList } from "@/hooks/useFavorites";

/**
 * マイページの「ログイン状態」カード。
 * - 未ログイン：従来の「ログイン・会員登録すると...」カード（/login へ）
 * - ログイン済み：メール + ログアウト + 気になる件数のカード
 */
export default function AuthCard() {
  const { user, loading } = useAuth();
  const { favorites } = useFavoritesList();
  const router = useRouter();

  if (loading) {
    return <div style={{ height: 260 }} />;
  }

  if (!user) {
    return <GuestCard />;
  }

  return (
    <LoggedInCard
      email={user.email ?? ""}
      counselorCount={favorites.filter((f) => f.target_type === "counselor").length}
      agencyCount={favorites.filter((f) => f.target_type === "agency").length}
      onSignOut={() => router.refresh()}
    />
  );
}

function GuestCard() {
  return (
    <div
      style={{
        background: "var(--black)",
        borderRadius: "20px",
        padding: "36px 28px",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="8" y="18" width="24" height="18" rx="3" stroke="#C8A97A" strokeWidth="1.5" fill="rgba(200,169,122,.1)" />
          <path d="M13 18v-5a7 7 0 0114 0v5" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="27" r="2" fill="#C8A97A" />
        </svg>
      </div>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "18px",
          color: "white",
          textAlign: "center",
          margin: "20px 0 28px",
          lineHeight: 1.7,
        }}
      >
        ログイン・会員登録すると
        <br />
        使えるようになります
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link
          href="/login"
          style={{
            display: "block",
            width: "100%",
            borderRadius: "50px",
            background: "var(--accent)",
            color: "var(--black)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: ".06em",
            textAlign: "center",
            padding: "14px 0",
            textDecoration: "none",
          }}
        >
          ログイン
        </Link>
        <Link
          href="/login?mode=signup"
          style={{
            display: "block",
            width: "100%",
            borderRadius: "50px",
            background: "white",
            color: "var(--ink)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            letterSpacing: ".06em",
            textAlign: "center",
            padding: "14px 0",
            textDecoration: "none",
            border: "1px solid var(--light)",
          }}
        >
          新規会員登録（無料）
        </Link>
      </div>
    </div>
  );
}

function LoggedInCard({
  email,
  counselorCount,
  agencyCount,
  onSignOut,
}: {
  email: string;
  counselorCount: number;
  agencyCount: number;
  onSignOut: () => void;
}) {
  const { supabase } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    onSignOut();
  };

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #FAEAE5, #FAF3DE 80%)",
        border: "1px solid var(--light)",
        borderRadius: "20px",
        padding: "28px 24px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: ".18em",
          color: "var(--mid)",
          textTransform: "uppercase",
          marginBottom: 6,
          textAlign: "center",
        }}
      >
        signed in
      </div>
      <div
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: 17,
          color: "var(--ink)",
          textAlign: "center",
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        ようこそ、Kindaへ
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--mid)",
          textAlign: "center",
          marginBottom: 20,
          wordBreak: "break-all",
        }}
      >
        {email}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Stat label="気になる担当" count={counselorCount} />
        <Stat label="気になる相談所" count={agencyCount} />
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        style={{
          width: "100%",
          background: "transparent",
          border: "1px solid rgba(0,0,0,.18)",
          borderRadius: 50,
          padding: "11px 0",
          fontSize: 12,
          color: "var(--mid)",
          fontFamily: "inherit",
          cursor: signingOut ? "not-allowed" : "pointer",
        }}
      >
        {signingOut ? "ログアウト中..." : "ログアウト"}
      </button>
    </div>
  );
}

function Stat({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.7)",
        borderRadius: 14,
        padding: "12px 8px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 22,
          fontWeight: 400,
          color: "var(--ink)",
        }}
      >
        {count}
      </div>
      <div style={{ fontSize: 10, color: "var(--mid)", marginTop: 2 }}>{label}</div>
    </div>
  );
}
