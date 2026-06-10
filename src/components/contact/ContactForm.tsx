"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

const SUPPORT_EMAIL = "hello@kinda.jp";

export default function ContactForm() {
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // ハニーポット（人間は触らない）
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // ログイン中はメールアドレスを初期表示（編集可）
  const effectiveEmail = email || (user?.email ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError("お問い合わせ内容を5文字以上ご入力ください。");
      return;
    }
    if (!effectiveEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) {
      setError("ご返信用のメールアドレスを正しくご入力ください。");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: effectiveEmail, message: trimmed, company }),
      });
      if (!res.ok) {
        setError(
          `送信に失敗しました。お手数ですが ${SUPPORT_EMAIL} まで直接ご連絡ください。`,
        );
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError(
        `送信に失敗しました。お手数ですが ${SUPPORT_EMAIL} まで直接ご連絡ください。`,
      );
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        style={{
          padding: "18px 20px",
          background: "var(--pale, #F7F1E8)",
          border: "1px solid var(--accent)",
          borderRadius: 14,
          fontSize: 14,
          lineHeight: 1.8,
          color: "var(--ink)",
        }}
      >
        お問い合わせを受け付けました。通常 2〜3 営業日以内にご返信します。
        <br />
        ご入力のメールアドレス宛にお返事しますので、しばらくお待ちください。
      </div>
    );
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    border: "1px solid var(--light)",
    borderRadius: 10,
    outline: "none",
    background: "white",
    color: "var(--ink)",
    fontFamily: "var(--font-sans)",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    color: "var(--mid)",
    marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ハニーポット（視覚・支援技術から隠す） */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div>
        <label style={labelStyle} htmlFor="contact-name">
          お名前（任意）
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="お名前またはニックネーム"
          style={fieldStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-email">
          メールアドレス<span style={{ color: "var(--rose)", marginLeft: 4 }}>*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={effectiveEmail}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          required
          style={fieldStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="contact-message">
          お問い合わせ内容<span style={{ color: "var(--rose)", marginLeft: 4 }}>*</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="ご質問・ご要望をご記入ください。"
          required
          style={{ ...fieldStyle, minHeight: 140, resize: "vertical", lineHeight: 1.8 }}
        />
      </div>

      {/* ログイン中であることの透明性（会員/カウンセラー区分も運営に伝わる旨） */}
      {!loading && user && (
        <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
          ログイン中のため、スムーズなご対応のためアカウント情報（会員・カウンセラーの区分等）もあわせて運営に共有されます。
        </p>
      )}

      {error && (
        <p style={{ fontSize: 13, color: "var(--rose)", lineHeight: 1.7, margin: 0 }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="legal-cta-primary"
        style={{ alignSelf: "flex-start", opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer", border: "none" }}
      >
        {submitting ? "送信中…" : "この内容で送信する"}
      </button>

      <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
        うまく送信できない場合は {SUPPORT_EMAIL} まで直接ご連絡ください。
      </p>
    </form>
  );
}
