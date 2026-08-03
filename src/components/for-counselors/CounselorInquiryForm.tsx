"use client";

import { useState } from "react";
import { ALL_PREFECTURES } from "@/lib/areas";

const SUPPORT_EMAIL = "hello@kinda.jp";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CounselorInquiryForm() {
  const [agencyName, setAgencyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [companyUrl, setCompanyUrl] = useState(""); // ハニーポット（人間は触らない）

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");

    if (!agencyName.trim()) {
      setError("相談所名をご入力ください。");
      return;
    }
    if (!contactName.trim()) {
      setError("ご担当者名をご入力ください。");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("メールアドレスを正しくご入力ください。");
      return;
    }
    if (!agreed) {
      setError("プライバシーポリシーへの同意が必要です。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/for-counselors/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agency_name: agencyName.trim(),
          contact_name: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          prefecture,
          website: website.trim(),
          message: message.trim(),
          company_url: companyUrl,
        }),
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
      <div className="fci-done">
        お問い合わせを受け付けました。3営業日以内に、運営よりご返信いたします。
        <br />
        ご入力のメールアドレス宛に確認メールをお送りしています。届かない場合は迷惑メールフォルダもご確認ください。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="fci-form">
      {/* ハニーポット（視覚・支援技術から隠す） */}
      <input
        type="text"
        name="company_url"
        value={companyUrl}
        onChange={(e) => setCompanyUrl(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="fci-hp"
      />

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-agency">
          相談所名<span className="fci-req">*</span>
        </label>
        <input
          id="fci-agency"
          type="text"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
          required
          className="fci-input"
        />
      </div>

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-contact">
          ご担当者名<span className="fci-req">*</span>
        </label>
        <input
          id="fci-contact"
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          className="fci-input"
        />
      </div>

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-email">
          メールアドレス<span className="fci-req">*</span>
        </label>
        <input
          id="fci-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          required
          className="fci-input"
        />
      </div>

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-phone">
          電話番号（任意）
        </label>
        <input
          id="fci-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="fci-input"
        />
      </div>

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-pref">
          所在地（任意）
        </label>
        <select
          id="fci-pref"
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="fci-input"
        >
          <option value="">選択してください</option>
          {ALL_PREFECTURES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-website">
          ウェブサイト URL（任意）
        </label>
        <input
          id="fci-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://"
          className="fci-input"
        />
      </div>

      <div className="fci-field">
        <label className="fci-label" htmlFor="fci-message">
          ご質問・ご要望（任意）
        </label>
        <textarea
          id="fci-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="fci-input fci-textarea"
        />
      </div>

      <label className="fci-consent">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="fci-link">
            プライバシーポリシー
          </a>
          に同意します
        </span>
      </label>

      {error && <p className="fci-error">{error}</p>}

      <button type="submit" disabled={submitting} className="fci-submit">
        {submitting ? "送信中…" : "この内容で送信する"}
      </button>

      <p className="fci-fallback">
        うまく送信できない場合は {SUPPORT_EMAIL} まで直接ご連絡ください。
      </p>

      <style>{`
        .fci-form { display: flex; flex-direction: column; gap: 16px; }
        .fci-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .fci-field { display: flex; flex-direction: column; }
        .fci-label { font-size: 12px; color: var(--mid); margin-bottom: 6px; }
        .fci-req { color: var(--rose); margin-left: 4px; }
        .fci-input {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border: 1px solid var(--light);
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: var(--ink);
          font-family: var(--font-sans);
          box-sizing: border-box;
        }
        .fci-input:focus { border-color: var(--accent); }
        .fci-textarea { min-height: 120px; resize: vertical; line-height: 1.8; }
        .fci-consent {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--mid);
          line-height: 1.7;
        }
        .fci-consent input { margin-top: 3px; flex: none; }
        .fci-link { color: var(--accent); text-decoration: underline; }
        .fci-error { font-size: 13px; color: var(--rose); line-height: 1.7; margin: 0; }
        .fci-submit {
          align-self: flex-start;
          padding: 14px 32px;
          border: none;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 22px var(--accent-shadow, rgba(212,160,144,.5));
          transition: transform .2s ease, background .2s ease;
        }
        .fci-submit:disabled { opacity: .6; cursor: not-allowed; box-shadow: none; }
        .fci-submit:not(:disabled):hover { transform: translateY(-1px); background: var(--accent-deep, #B8806E); }
        .fci-fallback { font-size: 11px; color: var(--muted); line-height: 1.7; margin: 0; }
        .fci-done {
          padding: 20px 22px;
          background: var(--pale, #F7F1E8);
          border: 1px solid var(--accent);
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.9;
          color: var(--ink);
        }
      `}</style>
    </form>
  );
}
