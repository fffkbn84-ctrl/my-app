"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * 退会セクション（アカウント設定 collapse 内の最下部に配置）。
 *
 * フロー:
 * 1. 「退会する」リンク → 2段階確認モーダル表示
 * 2. ユーザーが自分のメアドを入力（confirm）→ 「退会する」ボタンが有効化
 * 3. 確定 → Supabase Edge Function `delete-account` を呼ぶ
 *    （service role が auth.admin.deleteUser を実行）
 * 4. 成功 → サインアウト + ホームへリダイレクト
 *
 * FK は ON DELETE CASCADE / ON DELETE SET NULL を組み合わせて適切に設定済み:
 *   profiles / favorites / diagnosis_results  → CASCADE
 *   reservations.user_id / reviews.user_id    → SET NULL（履歴は残る）
 *   counselors.owner_user_id / agencies.owner_user_id → SET NULL
 */
export default function AccountDeleteSection() {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!user || !supabase) return null;

  const currentEmail = user.email ?? "";
  const isValid = confirmEmail.trim().toLowerCase() === currentEmail.toLowerCase() && currentEmail !== "";

  const handleDelete = async () => {
    if (!isValid || deleting) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      const { error: invokeErr } = await supabase.functions.invoke("delete-account", {
        method: "POST",
      });
      if (invokeErr) {
        setDeleting(false);
        setErrorMsg(invokeErr.message || "退会処理に失敗しました。しばらくしてからお試しください。");
        return;
      }
      // セッションを破棄してホームへ
      await supabase.auth.signOut();
      router.push("/?account_deleted=1");
    } catch (e) {
      setDeleting(false);
      setErrorMsg(e instanceof Error ? e.message : "退会処理に失敗しました。");
    }
  };

  return (
    <>
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--pale)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setConfirmEmail("");
            setErrorMsg("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--rose, #C4877A)",
            fontSize: 12,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
            letterSpacing: ".04em",
          }}
        >
          このアカウントを退会する
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleting) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,14,8,.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              width: "100%",
              background: "white",
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow: "0 24px 60px rgba(0,0,0,.25)",
            }}
          >
            <h2
              id="delete-confirm-title"
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: 18,
                color: "var(--ink)",
                marginTop: 0,
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              本当に退会しますか？
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "var(--mid)",
                lineHeight: 1.85,
                marginBottom: 16,
              }}
            >
              退会するとアカウントは削除され、元に戻せません。
            </p>

            <ul
              style={{
                fontSize: 12,
                color: "var(--ink)",
                background: "var(--pale)",
                padding: "12px 18px",
                borderRadius: 10,
                margin: "0 0 18px",
                lineHeight: 1.85,
                listStyle: "disc outside",
              }}
            >
              <li>保存中のカウンセラー・お店・物語・コラム</li>
              <li>診断結果（Kinda type / Kinda note）の履歴</li>
              <li>ニックネーム・アカウント情報</li>
            </ul>

            <p
              style={{
                fontSize: 11,
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: 18,
              }}
            >
              ※ 過去にご予約された面談記録と、投稿された口コミは「お名前が分からない状態」で残ります（相談所側の証跡保護のため）。
            </p>

            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--mid)",
                marginBottom: 6,
              }}
            >
              確認のため、ご登録メールアドレス（<strong>{currentEmail}</strong>）を入力してください
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder={currentEmail}
              autoComplete="off"
              autoFocus
              disabled={deleting}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 13,
                border: "1px solid var(--light)",
                borderRadius: 10,
                outline: "none",
                background: "white",
                color: "var(--ink)",
                marginBottom: 16,
              }}
            />

            {errorMsg && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--rose)",
                  marginBottom: 16,
                  lineHeight: 1.7,
                }}
              >
                {errorMsg}
              </p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => !deleting && setOpen(false)}
                disabled={deleting}
                style={{
                  background: "white",
                  color: "var(--ink)",
                  border: "1px solid var(--light)",
                  borderRadius: 50,
                  padding: "10px 18px",
                  fontSize: 12,
                  cursor: deleting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                やめておく
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isValid || deleting}
                style={{
                  background: isValid ? "var(--rose, #C4877A)" : "var(--light)",
                  color: "white",
                  border: "none",
                  borderRadius: 50,
                  padding: "10px 18px",
                  fontSize: 12,
                  cursor: isValid && !deleting ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-sans)",
                  opacity: deleting ? 0.7 : 1,
                  fontWeight: 500,
                }}
              >
                {deleting ? "退会処理中…" : "退会する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
