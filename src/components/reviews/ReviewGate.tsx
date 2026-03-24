"use client";

import { useState, useEffect } from "react";
import type { ReviewToken } from "@/types/review";
import ReviewForm from "./ReviewForm";

/* ────────────────────────────────────────────────────────────
   モック：有効なトークン一覧（後で Supabase に差し替え）

  本番では:
  1. 予約確定時に Supabase の review_tokens テーブルにレコード挿入
  2. expires_at = 面談日から30日後、used = false
  3. ユーザーへのメールに /reviews/new?token=XXXX を記載
──────────────────────────────────────────────────────────── */
const MOCK_TOKENS: Record<string, ReviewToken> = {
  "TKN-2026-DEMO1": {
    token: "TKN-2026-DEMO1",
    counselorId: "1",
    counselorName: "田中 美咲",
    agencyName: "ブライダルサロン エクラン",
    meetingDate: "2026-03-10",
    expiresAt: "2099-01-01T00:00:00Z", // デモ用に無期限
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
    counselorName: "田中 美咲",
    agencyName: "ブライダルサロン エクラン",
    meetingDate: "2026-02-20",
    expiresAt: "2099-01-01T00:00:00Z",
    used: true, // 投稿済み
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
  await new Promise((r) => setTimeout(r, 600)); // ネットワーク遅延を模擬

  const data = MOCK_TOKENS[token.trim().toUpperCase()];
  if (!data) return { ok: false, reason: "not_found" };
  if (new Date(data.expiresAt) < new Date()) return { ok: false, reason: "expired" };
  if (data.used) return { ok: false, reason: "used" };
  return { ok: true, data };
}

/* ────────────────────────────────────────────────────────────
   エラーメッセージ
──────────────────────────────────────────────────────────── */
const ERROR_MESSAGES: Record<string, string> = {
  not_found:
    "認証コードが見つかりません。メールに記載のコードをご確認ください。",
  expired:
    "認証コードの有効期限が切れています。面談から30日以内に投稿してください。",
  used:
    "このコードはすでに使用済みです。口コミは1面談につき1回投稿できます。",
};

/* ────────────────────────────────────────────────────────────
   コード入力フォーム
──────────────────────────────────────────────────────────── */
function TokenInputForm({
  onVerified,
}: {
  onVerified: (data: ReviewToken) => void;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorReason, setErrorReason] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus("loading");
    setErrorReason("");

    const result = await verifyToken(code);
    if (result.ok) {
      onVerified(result.data);
    } else {
      setStatus("error");
      setErrorReason(result.reason);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* 説明 */}
      <div className="bg-pale rounded-2xl p-6 border border-light mb-8">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="6" />
              <path d="M7 4v3.5l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-ink mb-1">
              面談後に届いた認証コードが必要です
            </p>
            <p className="text-xs text-mid leading-relaxed">
              ふたりへ経由で面談が完了すると、登録メールアドレスに認証コードが届きます。
              そのコードを入力することで口コミを投稿できます。
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block text-xs text-mid mb-2">
          認証コード <span className="text-rose ml-1">*</span>
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStatus("idle");
          }}
          placeholder="例：TKN-2026-XXXXX"
          className={`w-full px-4 py-3.5 text-sm border rounded-xl focus:outline-none transition-colors duration-150 tracking-wider font-mono bg-white placeholder:text-muted placeholder:font-sans placeholder:tracking-normal ${
            status === "error"
              ? "border-rose/50 focus:border-rose/70"
              : "border-light focus:border-accent/60"
          }`}
          autoComplete="off"
          spellCheck={false}
        />

        {status === "error" && (
          <div className="flex items-start gap-2 mt-3 text-xs text-rose">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="shrink-0 mt-0.5"
            >
              <circle cx="7" cy="7" r="6" />
              <path d="M7 4.5v3M7 9.5v.5" strokeLinecap="round" />
            </svg>
            <p>{ERROR_MESSAGES[errorReason] ?? "エラーが発生しました。"}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!code.trim() || status === "loading"}
          className="mt-4 w-full py-3.5 bg-accent text-white rounded-xl text-sm tracking-wide hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            boxShadow:
              code.trim() && status !== "loading"
                ? "0 4px 16px rgba(200,169,122,0.3)"
                : "none",
          }}
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              確認中...
            </>
          ) : (
            "認証コードを確認する"
          )}
        </button>
      </form>

      {/* デモ用ヒント */}
      <div className="mt-8 pt-6 border-t border-light">
        <p className="text-xs text-muted mb-2">デモ用の認証コード（開発環境のみ）</p>
        <div className="flex flex-wrap gap-2">
          {["TKN-2026-DEMO1", "TKN-2026-DEMO2"].map((t) => (
            <button
              key={t}
              onClick={() => setCode(t)}
              className="text-xs px-3 py-1.5 rounded-lg border border-light hover:border-accent/40 text-muted hover:text-accent transition-all duration-150 font-mono"
            >
              {t}
            </button>
          ))}
        </div>
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

  // 自動検証中のローディング画面
  if (autoVerifyState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-light border-t-accent animate-spin" />
        <p className="text-sm text-muted">認証コードを確認しています...</p>
      </div>
    );
  }

  // 投稿完了
  if (submitted && tokenData) {
    return <ThankYouScreen counselorName={tokenData.counselorName} />;
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
        <div className="max-w-md mx-auto mb-6 px-4 py-3.5 rounded-xl border border-rose/30 bg-rose/5 text-xs text-rose flex items-start gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="shrink-0 mt-0.5"
          >
            <circle cx="7" cy="7" r="6" />
            <path d="M7 4.5v3M7 9.5v.5" strokeLinecap="round" />
          </svg>
          URLの認証コードが無効です。以下に正しいコードを入力してください。
        </div>
      )}
      <TokenInputForm onVerified={setTokenData} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   投稿完了画面
──────────────────────────────────────────────────────────── */
function ThankYouScreen({ counselorName }: { counselorName: string }) {
  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
        style={{
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        >
          <path
            d="M6 16l7 7 13-13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        className="text-2xl text-ink mb-3"
        style={{ fontFamily: "var(--font-mincho)" }}
      >
        口コミを投稿しました
      </h2>
      <p className="text-sm text-mid leading-relaxed mb-2">
        {counselorName} カウンセラーへの口コミをありがとうございます。
      </p>
      <p className="text-sm text-mid leading-relaxed mb-10">
        あなたの声が、次の婚活をする方の参考になります。
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/counselors"
          className="px-6 py-3 border border-light text-mid rounded-full text-sm hover:border-ink hover:text-ink transition-all duration-200"
        >
          カウンセラー一覧へ
        </a>
        <a
          href="/"
          className="px-6 py-3 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity duration-200"
        >
          トップへ戻る
        </a>
      </div>
    </div>
  );
}
