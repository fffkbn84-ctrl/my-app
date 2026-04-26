"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { mergeLocalFavoritesToSupabase } from "@/hooks/useFavorites";

type Mode = "signin" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/mypage";

  const { supabase } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("認証サービスが利用できません。時間をおいて再度お試しください。");
      return;
    }
    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(translateAuthError(error.message));
          return;
        }
        if (data.user) {
          // localStorage の保存を Supabase へマージ
          await mergeLocalFavoritesToSupabase(supabase, data.user.id);
        }
        router.push(redirect);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          setError(translateAuthError(error.message));
          return;
        }
        if (data.user && data.session) {
          // メール確認 OFF の場合はそのままログイン状態
          await mergeLocalFavoritesToSupabase(supabase, data.user.id);
          router.push(redirect);
          router.refresh();
        } else {
          setInfo(
            "確認メールを送信しました。メール内のリンクから登録を完了してください。",
          );
        }
      }
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--pale)",
        border: "1px solid var(--light)",
        borderRadius: 18,
        padding: 24,
      }}
    >
      {/* タブ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          background: "white",
          padding: 4,
          borderRadius: 999,
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setInfo(null);
          }}
          style={tabStyle(mode === "signin")}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setInfo(null);
          }}
          style={tabStyle(mode === "signup")}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label htmlFor="email" style={labelStyle}>
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password" style={labelStyle}>
            パスワード
            {mode === "signup" && (
              <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: 8 }}>
                （8文字以上）
              </span>
            )}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && (
          <div
            style={{
              background: "#FCE7E7",
              color: "#A8413A",
              fontSize: 12,
              padding: "10px 12px",
              borderRadius: 10,
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}
        {info && (
          <div
            style={{
              background: "#E8F4E4",
              color: "#3F6535",
              fontSize: 12,
              padding: "10px 12px",
              borderRadius: 10,
              lineHeight: 1.6,
            }}
          >
            {info}
          </div>
        )}

        <button type="submit" disabled={submitting} style={primaryBtnStyle(submitting)}>
          {submitting
            ? "送信中..."
            : mode === "signin"
              ? "ログインする"
              : "新規登録する"}
        </button>
      </form>

      {mode === "signin" && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link
            href="#"
            style={{
              fontSize: 12,
              color: "var(--mid)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
            onClick={(e) => {
              e.preventDefault();
              setInfo("パスワードリセットは準備中です。");
            }}
          >
            パスワードをお忘れの方
          </Link>
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: "1px solid var(--light)",
          fontSize: 11,
          color: "var(--muted)",
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >
        登録すると<Link href="/about" style={{ color: "var(--accent)", textDecoration: "underline" }}>利用規約・プライバシーポリシー</Link>に同意したものとみなされます。
      </div>
    </div>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--accent)" : "transparent",
    color: active ? "white" : "var(--mid)",
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all .15s ease",
  };
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "var(--ink)",
  marginBottom: 6,
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 14,
  background: "white",
  border: "1px solid var(--light)",
  borderRadius: 10,
  color: "var(--ink)",
  fontFamily: "inherit",
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "var(--muted)" : "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "13px",
    fontSize: 14,
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    marginTop: 4,
  };
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "メールアドレスまたはパスワードが違います。";
  }
  if (message.includes("Email not confirmed")) {
    return "メールアドレスが未確認です。確認メールのリンクから完了してください。";
  }
  if (message.includes("User already registered")) {
    return "すでに登録されているメールアドレスです。ログインタブからログインしてください。";
  }
  if (message.includes("Password should be at least")) {
    return "パスワードは 8 文字以上で設定してください。";
  }
  if (message.includes("rate limit")) {
    return "リクエストが多すぎます。少し時間をおいてお試しください。";
  }
  return message;
}
