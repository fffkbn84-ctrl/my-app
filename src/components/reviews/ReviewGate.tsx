"use client";

import { useState, useEffect } from "react";
import type { ReviewToken } from "@/types/review";
import ReviewForm from "./ReviewForm";

/* ────────────────────────────────────────────────────────────
   モック：有効なトークン一覧（後で Supabase に差し替え）
──────────────────────────────────────────────────────────── */
const MOCK_TOKENS: Record<string, ReviewToken> = {
  "TKN-2026-DEMO1": {
    token: "TKN-2026-DEMO1",
    counselorId: "1",
    counselorName: "田中 美紀",
    agencyName: "ブライダルハウス東京",
    meetingDate: "2025-06-14",
    expiresAt: "2099-01-01T00:00:00Z",
    used: false,
  },
  "TKN-2026-DEMO2": {
    token: "TKN-2026-DEMO2",
    counselorId: "2",
    counselorName: "佐藤 あかり",
    agencyName: "マリーナ結婚相談所",
    meetingDate: "2026-03-15",
    expiresAt: "2099-01-01T00:00:00Z",
    used: false,
  },
  "TKN-USED-001": {
    token: "TKN-USED-001",
    counselorId: "1",
    counselorName: "田中 美紀",
    agencyName: "ブライダルハウス東京",
    meetingDate: "2026-02-20",
    expiresAt: "2099-01-01T00:00:00Z",
    used: true,
  },
};

/* ────────────────────────────────────────────────────────────
   トークン検証（後で Supabase RPC に差し替え）
──────────────────────────────────────────────────────────── */
type TokenResult =
  | { ok: true; data: ReviewToken }
  | { ok: false; reason: "not_found" | "expired" | "used" };

async function verifyToken(token: string): Promise<TokenResult> {
  // TODO: Supabase RPC `verify_review_token(token)` に差し替え
  await new Promise((r) => setTimeout(r, 600));
  const data = MOCK_TOKENS[token.trim().toUpperCase()];
  if (!data) return { ok: false, reason: "not_found" };
  if (new Date(data.expiresAt) < new Date()) return { ok: false, reason: "expired" };
  if (data.used) return { ok: false, reason: "used" };
  return { ok: true, data };
}

/* ────────────────────────────────────────────────────────────
   認証ゲート画面（tokenなしの場合）
──────────────────────────────────────────────────────────── */
function AuthGate({ onVerified }: { onVerified: (data: ReviewToken) => void }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    const result = await verifyToken(code);
    if (result.ok) {
      onVerified(result.data);
    } else {
      setStatus("error");
      const msgs: Record<string, string> = {
        not_found: "認証コードが見つかりません。メールに記載のコードをご確認ください。",
        expired: "認証コードの有効期限が切れています。面談から30日以内に投稿してください。",
        used: "このコードはすでに使用済みです。口コミは1面談につき1回投稿できます。",
      };
      setErrorMsg(msgs[result.reason] ?? "エラーが発生しました。");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "64px 0" }}>
      {/* シールドアイコン */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 4L6 14v20c0 14.36 10.28 27.8 26 31 15.72-3.2 26-16.64 26-31V14L32 4z"
            stroke="#C8A97A"
            strokeWidth="1.5"
            fill="rgba(200,169,122,.06)"
          />
          <path
            d="M22 32l8 8 14-16"
            stroke="#C8A97A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 見出し */}
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 24,
          color: "var(--ink)",
          fontWeight: 400,
          marginBottom: 16,
        }}
      >
        面談済み確認
      </h2>

      {/* 説明文 */}
      <p
        style={{
          fontSize: 13,
          color: "var(--mid)",
          lineHeight: 2,
          maxWidth: 380,
          margin: "0 auto 32px",
        }}
      >
        口コミは、ふたりへ経由で面談を予約・完了した方のみ投稿できます。
        <br />
        面談完了後にお送りしたメール内のURLからアクセスしてください。
      </p>

      {/* 認証コード入力 */}
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 400, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
          className="auth-input-row"
        >
          <style>{`
            .auth-input-row { flex-direction: row; }
            @media (max-width: 480px) { .auth-input-row { flex-direction: column; } }
          `}</style>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="認証コード（メール記載）"
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              minWidth: 0,
              padding: "12px 16px",
              fontSize: 14,
              border: `1px solid ${status === "error" ? "var(--rose)" : "var(--light)"}`,
              borderRadius: 10,
              outline: "none",
              background: "white",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
            }}
          />
          <button
            type="submit"
            disabled={!code.trim() || status === "loading"}
            style={{
              padding: "12px 20px",
              background: "var(--accent)",
              color: "white",
              fontSize: 14,
              border: "none",
              borderRadius: 10,
              cursor: code.trim() && status !== "loading" ? "pointer" : "not-allowed",
              opacity: code.trim() && status !== "loading" ? 1 : 0.6,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity .2s",
              fontFamily: "var(--font-sans)",
            }}
          >
            {status === "loading" ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,.3)",
                    borderTopColor: "white",
                    display: "inline-block",
                    animation: "spin .7s linear infinite",
                  }}
                />
                確認中…
              </>
            ) : (
              "確認する"
            )}
          </button>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        {/* エラー */}
        {status === "error" && errorMsg && (
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "var(--rose)",
              textAlign: "left",
            }}
          >
            {errorMsg}
          </p>
        )}

        {/* メールが届かない場合 */}
        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          メールが届かない場合は
          <a
            href="#"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            こちら
          </a>
        </p>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   投稿完了画面
──────────────────────────────────────────────────────────── */
function SuccessScreen() {
  return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      {/* 完了アイコン */}
      <div style={{ margin: "0 auto 24px", width: 72 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle
            cx="36"
            cy="36"
            r="34"
            stroke="#7A9E87"
            strokeWidth="1.5"
            fill="rgba(122,158,135,.06)"
          />
          <path
            d="M22 36l10 10 18-20"
            stroke="#7A9E87"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* タイトル */}
      <h2
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: 26,
          color: "var(--ink)",
          fontWeight: 400,
          marginBottom: 16,
        }}
      >
        口コミを投稿しました
      </h2>

      {/* サブテキスト */}
      <p
        style={{
          fontSize: 14,
          color: "var(--mid)",
          lineHeight: 2,
          marginBottom: 32,
        }}
      >
        ありがとうございます。あなたの声が、次に不安を抱える誰かの助けになります。
        <br />
        確認後、1〜3営業日以内に公開されます。
      </p>

      {/* ボタン2つ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); history.back(); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 28px",
            border: "1px solid var(--light)",
            borderRadius: 50,
            fontSize: 14,
            color: "var(--mid)",
            transition: "all .2s",
            textDecoration: "none",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--ink)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--light)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--mid)";
          }}
        >
          カウンセラーページに戻る
        </a>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 28px",
            background: "var(--accent)",
            borderRadius: 50,
            fontSize: 14,
            color: "white",
            textDecoration: "none",
            transition: "opacity .2s",
          }}
          onMouseOver={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")
          }
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
          }
        >
          トップに戻る
        </a>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ReviewGate — URL トークン自動検証 + 手動入力の切り替え
──────────────────────────────────────────────────────────── */
export default function ReviewGate({ urlToken }: { urlToken?: string }) {
  const [tokenData, setTokenData] = useState<ReviewToken | null>(null);
  const [autoVerifyState, setAutoVerifyState] = useState<
    "idle" | "loading" | "failed"
  >(urlToken ? "loading" : "idle");
  const [submitted, setSubmitted] = useState(false);

  // URLトークンが渡されたら自動検証
  useEffect(() => {
    if (!urlToken) return;
    verifyToken(urlToken).then((result) => {
      if (result.ok) {
        setTokenData(result.data);
        setAutoVerifyState("idle");
      } else {
        setAutoVerifyState("failed");
      }
    });
  }, [urlToken]);

  // 自動検証中のローディング
  if (autoVerifyState === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 0",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid var(--light)",
            borderTopColor: "var(--accent)",
            animation: "spin .7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>
          認証コードを確認しています…
        </p>
      </div>
    );
  }

  // 投稿完了
  if (submitted) {
    return <SuccessScreen />;
  }

  // 認証済み → フォーム表示
  if (tokenData) {
    return (
      <ReviewForm
        tokenData={tokenData}
        onSubmitted={() => setSubmitted(true)}
      />
    );
  }

  // 認証前 → コード入力画面
  return (
    <div>
      {autoVerifyState === "failed" && (
        <div
          style={{
            maxWidth: 400,
            margin: "0 auto 24px",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(196,135,122,.3)",
            background: "rgba(196,135,122,.05)",
            fontSize: 12,
            color: "var(--rose)",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <circle cx="7" cy="7" r="6" />
            <path d="M7 4.5v3M7 9.5v.5" strokeLinecap="round" />
          </svg>
          URLの認証コードが無効です。以下に正しいコードを入力してください。
        </div>
      )}
      <AuthGate onVerified={setTokenData} />
    </div>
  );
}
