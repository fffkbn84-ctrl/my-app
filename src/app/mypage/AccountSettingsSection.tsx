"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * マイページ「アカウント設定」セクション。
 * - ニックネーム編集（profiles.nickname upsert）
 * - メール変更（Supabase Auth updateUser + 確認メール）
 * - パスワード変更（current-password 再入力）
 *
 * 未ログイン時は何も表示しない（AuthCard が促進カードを出すため）。
 */
export default function AccountSettingsSection() {
  const { user, loading, supabase } = useAuth();

  if (loading) return null;
  if (!user || !supabase) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <SectionHeader />

      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <NicknameRow />
        <Divider />
        <EmailRow currentEmail={user.email ?? ""} />
        <Divider />
        <PasswordRow currentEmail={user.email ?? ""} />
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <div style={{ marginBottom: 14 }}>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: ".14em",
          color: "var(--muted)",
          marginBottom: 4,
        }}
      >
        ACCOUNT
      </p>
      <h2
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: 18,
          fontWeight: 500,
          color: "var(--ink)",
        }}
      >
        アカウント設定
      </h2>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--pale)" }} />;
}

/* ──────────────────────────────────────────────
   ニックネーム
────────────────────────────────────────────── */
function NicknameRow() {
  const { user, supabase } = useAuth();
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // 初期値ロード
  useEffect(() => {
    if (!user || !supabase) return;
    let active = true;
    (async () => {
      const res = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      const data = res.data as { nickname: string | null } | null;
      const initial = data?.nickname ?? "";
      setNickname(initial);
      setOriginalNickname(initial);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user, supabase]);

  const trimmed = nickname.trim();
  const isDirty = trimmed !== originalNickname.trim();
  const isValid = trimmed.length === 0 || (trimmed.length >= 1 && trimmed.length <= 30);

  const handleSave = async () => {
    if (!user || !supabase || !isValid || !isDirty || status === "saving") return;
    setStatus("saving");
    setErrorMsg("");
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          nickname: trimmed === "" ? null : trimmed,
        },
        { onConflict: "id" },
      );
    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "保存に失敗しました");
      return;
    }
    setOriginalNickname(trimmed);
    setStatus("saved");
    setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
  };

  return (
    <div style={rowStyle}>
      <div style={rowLabelStyle}>
        <span style={labelTextStyle}>ニックネーム</span>
        <span style={labelHintStyle}>
          口コミに表示されます（未設定なら「ゲスト」表示）
        </span>
      </div>
      <div style={rowControlStyle}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            if (status === "saved" || status === "error") setStatus("idle");
          }}
          placeholder={loading ? "読み込み中…" : "例: あかり"}
          disabled={loading}
          maxLength={30}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid || !isDirty || status === "saving"}
          style={{
            ...primaryBtnStyle,
            opacity: isValid && isDirty && status !== "saving" ? 1 : 0.45,
            cursor: isValid && isDirty && status !== "saving" ? "pointer" : "not-allowed",
          }}
        >
          {status === "saving" ? "保存中…" : "保存"}
        </button>
      </div>
      {status === "saved" && <Hint kind="ok">保存しました</Hint>}
      {status === "error" && <Hint kind="error">{errorMsg}</Hint>}
    </div>
  );
}

/* ──────────────────────────────────────────────
   メール変更
────────────────────────────────────────────── */
function EmailRow({ currentEmail }: { currentEmail: string }) {
  const { supabase } = useAuth();
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isValid =
    newEmail.trim().length > 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim()) &&
    newEmail.trim().toLowerCase() !== currentEmail.toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isValid || status === "saving") return;
    setStatus("saving");
    setErrorMsg("");
    setSuccessMsg("");
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message || "メール変更に失敗しました");
      return;
    }
    setStatus("saved");
    setSuccessMsg(
      "確認メールを送信しました。新しいメールアドレスに届いたリンクから確定してください。",
    );
    setNewEmail("");
    // 開きっぱなしで成功メッセージを表示
  };

  return (
    <div style={rowStyle}>
      <div style={rowLabelStyle}>
        <span style={labelTextStyle}>メールアドレス</span>
        <span style={labelHintStyle}>{currentEmail || "—"}</span>
      </div>
      {!open ? (
        <div style={rowControlStyle}>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setSuccessMsg("");
              setStatus("idle");
            }}
            style={secondaryBtnStyle}
          >
            変更する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={rowControlStyle}>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="新しいメールアドレス"
              autoComplete="email"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={!isValid || status === "saving"}
              style={{
                ...primaryBtnStyle,
                opacity: isValid && status !== "saving" ? 1 : 0.45,
                cursor: isValid && status !== "saving" ? "pointer" : "not-allowed",
              }}
            >
              {status === "saving" ? "送信中…" : "確認メールを送る"}
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setNewEmail("");
                setStatus("idle");
              }}
              style={ghostBtnStyle}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
      {successMsg && <Hint kind="ok">{successMsg}</Hint>}
      {status === "error" && <Hint kind="error">{errorMsg}</Hint>}
    </div>
  );
}

/* ──────────────────────────────────────────────
   パスワード変更
────────────────────────────────────────────── */
function PasswordRow({ currentEmail }: { currentEmail: string }) {
  const { supabase } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid =
    currentPwd.length >= 6 &&
    newPwd.length >= 8 &&
    newPwd === confirmPwd &&
    newPwd !== currentPwd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isValid || status === "saving") return;
    setStatus("saving");
    setErrorMsg("");

    // 1. current-password を使って reauth（signInWithPassword で検証）
    const reauth = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: currentPwd,
    });
    if (reauth.error) {
      setStatus("error");
      setErrorMsg("現在のパスワードが正しくありません");
      return;
    }

    // 2. updateUser でパスワード変更
    const upd = await supabase.auth.updateUser({ password: newPwd });
    if (upd.error) {
      setStatus("error");
      setErrorMsg(upd.error.message || "パスワード変更に失敗しました");
      return;
    }

    setStatus("saved");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setTimeout(() => {
      setOpen(false);
      setStatus("idle");
    }, 2000);
  };

  const validationMessage = (() => {
    if (currentPwd.length === 0 && newPwd.length === 0) return "";
    if (newPwd.length > 0 && newPwd.length < 8) return "新しいパスワードは8文字以上にしてください";
    if (newPwd && confirmPwd && newPwd !== confirmPwd) return "確認用パスワードが一致しません";
    if (newPwd && currentPwd && newPwd === currentPwd) return "現在のパスワードと違うものを設定してください";
    return "";
  })();

  return (
    <div style={rowStyle}>
      <div style={rowLabelStyle}>
        <span style={labelTextStyle}>パスワード</span>
        <span style={labelHintStyle}>定期的な変更をおすすめします</span>
      </div>
      {!open ? (
        <div style={rowControlStyle}>
          <span style={{ flex: 1 }} />
          <button type="button" onClick={() => setOpen(true)} style={secondaryBtnStyle}>
            変更する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="現在のパスワード"
            autoComplete="current-password"
            style={inputStyle}
          />
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="新しいパスワード（8文字以上）"
            autoComplete="new-password"
            style={inputStyle}
          />
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="新しいパスワード（確認）"
            autoComplete="new-password"
            style={inputStyle}
          />
          {validationMessage && <Hint kind="error">{validationMessage}</Hint>}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={!isValid || status === "saving"}
              style={{
                ...primaryBtnStyle,
                opacity: isValid && status !== "saving" ? 1 : 0.45,
                cursor: isValid && status !== "saving" ? "pointer" : "not-allowed",
              }}
            >
              {status === "saving" ? "変更中…" : "パスワードを変更"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setCurrentPwd("");
                setNewPwd("");
                setConfirmPwd("");
                setStatus("idle");
              }}
              style={ghostBtnStyle}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
      {status === "saved" && <Hint kind="ok">パスワードを変更しました</Hint>}
      {status === "error" && errorMsg && <Hint kind="error">{errorMsg}</Hint>}
    </div>
  );
}

/* ──────────────────────────────────────────────
   小コンポーネント
────────────────────────────────────────────── */
function Hint({ kind, children }: { kind: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p
      style={{
        marginTop: 8,
        fontSize: 11,
        color: kind === "ok" ? "var(--green)" : "var(--rose)",
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  );
}

const rowStyle: React.CSSProperties = {
  padding: "18px 20px",
};

const rowLabelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginBottom: 10,
};

const labelTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  color: "var(--ink)",
  fontWeight: 500,
};

const labelHintStyle: React.CSSProperties = {
  fontSize: 11,
  color: "var(--muted)",
  lineHeight: 1.6,
};

const rowControlStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "10px 12px",
  fontSize: 13,
  border: "1px solid var(--light)",
  borderRadius: 10,
  outline: "none",
  background: "white",
  color: "var(--ink)",
  fontFamily: "var(--font-sans)",
};

const primaryBtnStyle: React.CSSProperties = {
  background: "var(--accent)",
  color: "white",
  border: "none",
  borderRadius: 50,
  padding: "10px 18px",
  fontSize: 12,
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: ".04em",
  whiteSpace: "nowrap",
  transition: "opacity .2s",
};

const secondaryBtnStyle: React.CSSProperties = {
  background: "white",
  color: "var(--ink)",
  border: "1px solid var(--light)",
  borderRadius: 50,
  padding: "10px 18px",
  fontSize: 12,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const ghostBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--mid)",
  border: "none",
  fontSize: 12,
  cursor: "pointer",
  padding: "8px 0",
  textDecoration: "underline",
};
