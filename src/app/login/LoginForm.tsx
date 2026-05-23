"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { mergeLocalFavoritesToSupabase } from "@/hooks/useFavorites";
import { mergeLocalDiagnosisToSupabase } from "@/lib/kinda/diagnosisHistory";

type Mode = "signin" | "signup" | "reset-request";

function getResetRedirectUrl(): string {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const base = envBase ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/auth/reset-password`;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/mypage";

  const { supabase } = useAuth();
  // 初期モードを URL クエリ ?mode=signup / signin / reset-request から読む
  const initialMode = ((): Mode => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "reset-request") return m;
    return "signin";
  })();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // signup モードでのみ規約同意を必須化
  const canSubmit = mode !== "signup" || termsAccepted;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("認証サービスが利用できません。時間をおいて再度お試しください。");
      return;
    }
    if (mode === "signup" && !termsAccepted) {
      setError("利用規約とプライバシーポリシーに同意してください。");
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
          await mergeLocalDiagnosisToSupabase(supabase, data.user.id);
        }
        router.push(redirect);
        router.refresh();
      } else if (mode === "signup") {
        const nowIso = new Date().toISOString();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              terms_accepted_at: nowIso,
              privacy_accepted_at: nowIso,
              marketing_emails_opt_in: marketingOptIn,
              marketing_emails_consented_at: marketingOptIn ? nowIso : null,
            },
          },
        });
        if (error) {
          setError(translateAuthError(error.message));
          return;
        }
        if (data.user && data.session) {
          await mergeLocalFavoritesToSupabase(supabase, data.user.id);
          await mergeLocalDiagnosisToSupabase(supabase, data.user.id);
          router.push(redirect);
          router.refresh();
        } else {
          setInfo(
            "確認メールを送信しました。メール内のリンクから登録を完了してください。",
          );
        }
      } else {
        // reset-request
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getResetRedirectUrl(),
        });
        if (error) {
          setError(translateAuthError(error.message));
          return;
        }
        setInfo(
          "パスワード再設定のメールを送信しました。メール内のリンクから手続きしてください。",
        );
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
          onClick={() => switchMode("signin")}
          style={tabStyle(mode === "signin")}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          style={tabStyle(mode === "signup")}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "reset-request" && (
          <div
            style={{
              fontSize: 12,
              color: "var(--mid)",
              lineHeight: 1.7,
              padding: "0 4px",
            }}
          >
            登録したメールアドレスを入力してください。再設定リンクをお送りします。
          </div>
        )}

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

        {mode !== "reset-request" && (
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
        )}

        {mode === "signup" && (
          <>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "12px 14px",
                background: "white",
                border: termsAccepted ? "1.5px solid var(--accent)" : "1.5px solid var(--light)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--ink)",
                lineHeight: 1.6,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                aria-required="true"
                style={{
                  flexShrink: 0,
                  marginTop: 2,
                  accentColor: "var(--accent)",
                  cursor: "pointer",
                }}
              />
              <span>
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  利用規約
                </Link>
                および
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)", textDecoration: "underline" }}
                >
                  プライバシーポリシー
                </Link>
                に同意します
                <span style={{ color: "var(--rose)", marginLeft: 4 }} aria-hidden="true">
                  必須
                </span>
              </span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 12px",
                background: "white",
                border: "1px solid var(--light)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--ink)",
                lineHeight: 1.6,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                style={{
                  flexShrink: 0,
                  marginTop: 2,
                  accentColor: "var(--accent)",
                  cursor: "pointer",
                }}
              />
              <span>
                新機能のお知らせやコラム配信、キャンペーン情報をメールで受け取る
                <span style={{ color: "var(--muted)", fontSize: 11, display: "block", marginTop: 2 }}>
                  予約完了通知や規約変更等の重要な連絡は、本設定にかかわらず登録メールに送信されます
                </span>
              </span>
            </label>
          </>
        )}

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

        <button
          type="submit"
          disabled={submitting || !canSubmit}
          aria-disabled={submitting || !canSubmit}
          style={primaryBtnStyle(submitting || !canSubmit)}
        >
          {submitting
            ? "送信中..."
            : mode === "signin"
              ? "ログインする"
              : mode === "signup"
                ? "新規登録する"
                : "再設定メールを送信する"}
        </button>
      </form>

      {mode === "signin" && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => switchMode("reset-request")}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 12,
              color: "var(--mid)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            パスワードをお忘れの方
          </button>
        </div>
      )}

      {mode === "reset-request" && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => switchMode("signin")}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 12,
              color: "var(--mid)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← ログイン画面に戻る
          </button>
        </div>
      )}

      {mode !== "signup" && (
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
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "underline" }}>利用規約</Link>
          {" / "}
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "underline" }}>プライバシーポリシー</Link>
        </div>
      )}
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
