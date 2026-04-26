"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * パスワード再設定確定フォーム。
 *
 * Supabase の resetPasswordForEmail() からのメールリンクで遷移してきた時、
 * URL の hash fragment（#access_token=...）に session を埋め込んだ状態で
 * 開かれる。@supabase/ssr の createBrowserClient は detectSessionInUrl で
 * 自動的に session を確立してくれるので、ここでは新パスワードの送信のみ行う。
 */
export default function ResetPasswordForm() {
  const router = useRouter();
  const { supabase, user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // ハッシュフラグメントが残っている場合は URL 上から消す（履歴に access_token を残さない）
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  if (loading) {
    return <div style={{ height: 280 }} aria-hidden />;
  }

  if (!supabase) {
    return (
      <FormCard>
        <ErrorBox>認証サービスが利用できません。時間をおいて再度お試しください。</ErrorBox>
      </FormCard>
    );
  }

  // セッション確立が遅延する場合があるので user チェックは緩めにする
  // (Supabase は recovery トークンで一時的な session を作る)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("パスワードは 8 文字以上で設定してください。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(translateAuthError(error.message));
        return;
      }
      setDone(true);
      // 数秒後にマイページへ遷移
      setTimeout(() => {
        router.push("/mypage");
        router.refresh();
      }, 2000);
    } catch {
      setError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <FormCard>
        <div
          style={{
            background: "#E8F4E4",
            color: "#3F6535",
            fontSize: 13,
            padding: "14px 14px",
            borderRadius: 12,
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          パスワードを更新しました。
          <br />
          マイページへ移動します...
        </div>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {!user && (
          <div
            style={{
              background: "#FFF6E0",
              color: "#7A5C20",
              fontSize: 12,
              padding: "10px 12px",
              borderRadius: 10,
              lineHeight: 1.6,
            }}
          >
            メール内のリンクから開いた状態で操作してください。
            <br />
            リンクが古い場合は、もう一度
            <Link
              href="/login"
              style={{
                color: "var(--accent)",
                textDecoration: "underline",
                marginLeft: 4,
              }}
            >
              再設定メールを送信
            </Link>
            してください。
          </div>
        )}

        <div>
          <label htmlFor="new-password" style={labelStyle}>
            新しいパスワード
            <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: 8 }}>
              （8文字以上）
            </span>
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" style={labelStyle}>
            パスワード（確認）
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        <button type="submit" disabled={submitting} style={primaryBtnStyle(submitting)}>
          {submitting ? "更新中..." : "パスワードを更新する"}
        </button>
      </form>
    </FormCard>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--pale)",
        border: "1px solid var(--light)",
        borderRadius: 18,
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
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
  if (message.includes("New password should be different")) {
    return "現在のパスワードと同じものは設定できません。";
  }
  if (message.includes("Password should be at least")) {
    return "パスワードは 8 文字以上で設定してください。";
  }
  if (message.includes("Auth session missing") || message.includes("session_not_found")) {
    return "再設定セッションが切れています。もう一度メールから開き直してください。";
  }
  if (message.includes("rate limit")) {
    return "リクエストが多すぎます。少し時間をおいてお試しください。";
  }
  return message;
}
