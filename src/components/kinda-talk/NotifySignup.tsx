"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Kinda talk のグリッド内に置く「厳選を続けています＋通知登録」パネル。
 * - 架空サンプルを隠した本番ビューで、空状態の代わりにメール獲得導線を出す。
 * - <form> は使わず onClick で送信（既存方針）。絵文字なし・中立トーン。
 * - 送信成功で GA4/Vercel に notify_signup を送る（trackEvent 経由）。
 * - 診断（Kinda type）は副次導線として下に残す。
 */
type Props = {
  /** ホームのリールカルーセルなど、9:16固定の枠に入れる時 true。高さ100%で中身を均等配置する。 */
  fill?: boolean;
};

export default function NotifySignup({ fill = false }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit() {
    const v = email.trim();
    if (!EMAIL_RE.test(v)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      trackEvent("notify_signup", { source: "talk_empty" });
    } catch {
      setState("error");
    }
  }

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid rgba(212,160,144,.35)",
        background: "rgba(255,251,244,.85)",
        display: "flex",
        flexDirection: "column",
        justifyContent: fill ? "space-between" : "center",
        textAlign: "center",
        padding: "22px 18px",
        gap: 12,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)",
        height: fill ? "100%" : undefined,
        boxSizing: "border-box",
      }}
    >
      <div>
        <strong
          style={{
            fontFamily: "'Shippori Mincho', serif",
            color: "var(--ink)",
            fontWeight: 500,
            fontSize: 14,
            display: "block",
            marginBottom: 6,
          }}
        >
          Kinda は厳選を続けています
        </strong>
        <span style={{ fontSize: 11.5, lineHeight: 1.8, color: "var(--mid)" }}>
          新しい相談所・カウンセラーは順番に公開していきます。
          <br />
          公開されたら、いちばんにお知らせします。
        </span>
      </div>

      {state === "done" ? (
        <p style={{ fontSize: 12, lineHeight: 1.8, color: "#6b5d52", margin: 0 }}>
          ありがとうございます。
          <br />
          新しく公開されたらお知らせします。
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            style={{
              width: "100%",
              borderRadius: 9,
              border: "1px solid #E3D7CA",
              background: "rgba(255,255,255,.8)",
              padding: "9px 11px",
              fontSize: 13,
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={state === "loading"}
            style={{
              width: "100%",
              borderRadius: 9,
              border: "none",
              background: "#D4A090",
              color: "#fff",
              padding: "9px 12px",
              fontSize: 13,
              fontWeight: 500,
              cursor: state === "loading" ? "default" : "pointer",
              opacity: state === "loading" ? 0.55 : 1,
              transition: "opacity .15s ease",
            }}
          >
            {state === "loading" ? "送信中…" : "お知らせを受け取る"}
          </button>
          {state === "error" && (
            <p style={{ fontSize: 11, color: "#b06a5a", margin: 0, lineHeight: 1.6 }}>
              メールアドレスをご確認のうえ、もう一度お試しください。
            </p>
          )}
          <p style={{ fontSize: 10, lineHeight: 1.7, color: "#9a8d80", margin: 0 }}>
            新しい相談所・カウンセラーが公開されたときのみご連絡します。
          </p>
        </div>
      )}

      <Link
        href="/kinda-type"
        style={{
          fontSize: 11.5,
          color: "var(--mid)",
          textDecoration: "none",
          borderTop: "1px solid rgba(212,160,144,.2)",
          paddingTop: 10,
        }}
      >
        あなたに合うタイプを知る（1〜3分で診断）→
      </Link>
    </div>
  );
}
