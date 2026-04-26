import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "パスワード再設定 | Kinda ふたりへ",
  description: "Kinda ふたりへのパスワード再設定ページ。",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "100dvh",
          background: "var(--white)",
          paddingTop: 88,
          paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
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
            reset password
          </div>
          <h1
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: 24,
              color: "var(--ink)",
              fontWeight: 500,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            パスワードを再設定
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--mid)",
              textAlign: "center",
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            新しいパスワードを入力してください。
          </p>

          <ResetPasswordForm />
        </div>
      </main>
    </>
  );
}
