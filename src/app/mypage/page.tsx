import Link from "next/link";
import type { Metadata } from "next";
import { DIAGNOSIS_TYPES } from "@/lib/diagnosis";
import { AGENCIES, COUNSELORS, getCounselors, type Counselor } from "@/lib/data";
import AuthCard from "./AuthCard";
import SavedSection from "./SavedSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "マイページ | ふたりへ",
  description: "マイページ — お気に入り・予約履歴・口コミ投稿を管理できます。",
};

const featureItems = [
  {
    label: "診断タイプ・婚活スタイルの確認",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#C8A97A" strokeWidth="1.3" fill="none" />
        <path
          d="M9 5v1M9 12v1M5 9h1M12 9h1"
          stroke="#C8A97A"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity=".5"
        />
        <path
          d="M11 7l-2.5 2-1.5 2.5 2.5-2 1.5-2.5z"
          stroke="#C8A97A"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="rgba(200,169,122,.2)"
        />
      </svg>
    ),
  },
  {
    label: "お気に入りのカウンセラー・相談所を保存",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M4 2h10v15l-5-3-5 3V2z"
          stroke="#C8A97A"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "共感したエピソードを保存",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 15C9 15 2.5 10.5 2.5 6C2.5 4 4 2.5 6 2.5C7 2.5 8 3 9 4C10 3 11 2.5 12 2.5C14 2.5 15.5 4 15.5 6C15.5 10.5 9 15 9 15Z"
          stroke="#C8A97A"
          strokeWidth="1.3"
          fill="none"
        />
      </svg>
    ),
  },
  {
    label: "予約履歴の確認・キャンセル",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="3"
          width="14"
          height="13"
          rx="2"
          stroke="#C8A97A"
          strokeWidth="1.3"
        />
        <path
          d="M2 7h14M6 2v2M12 2v2"
          stroke="#C8A97A"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "口コミ投稿履歴",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M4 2h7l4 4v10H4V2z"
          stroke="#C8A97A"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M11 2v4h4M6 9h6M6 12h4"
          stroke="#C8A97A"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default async function MyPage() {
  // 「気になる」一覧の表示用に、Supabase + mock の両方からカウンセラーを集めて
  // 重複排除（古い localStorage 保存も拾えるようにするため）
  const supabaseCounselors = await getCounselors();
  const counselorById = new Map<string, Counselor>();
  for (const c of [...supabaseCounselors, ...COUNSELORS]) {
    counselorById.set(String(c.id), c);
  }
  const allCounselors = Array.from(counselorById.values());

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--white)",
        paddingTop: "60px",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
      }}
    >
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "マイページ" }]} />
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "0 20px 40px",
        }}
      >
        {/* ヘッダー */}
        <header style={{ paddingTop: "32px", marginBottom: "28px" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: ".14em",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            MY PAGE
          </p>
          <h1
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "26px",
              fontWeight: 500,
              color: "var(--ink)",
              lineHeight: 1.3,
            }}
          >
            マイページ
          </h1>
        </header>

        {/* ログイン状態カード（未ログイン: 促進 / ログイン済: メール+気になる件数） */}
        <AuthCard />

        {/* 気になる一覧（保存があれば表示、なければ自動的に hidden） */}
        <SavedSection allCounselors={allCounselors} allAgencies={AGENCIES} />

        {/* 機能紹介リスト */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {featureItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                borderBottom:
                  index < featureItems.length - 1
                    ? "1px solid var(--pale)"
                    : "none",
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "var(--ink)",
                  flex: 1,
                  lineHeight: 1.5,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  background: "var(--pale)",
                  color: "var(--muted)",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  marginLeft: "auto",
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: ".04em",
                }}
              >
                準備中
              </span>
            </div>
          ))}
        </div>

        {/*
          ────────────────────────────────────────
          診断結果の履歴プレビュー

          【Supabase連携時の実装方針】
          テーブル: diagnosis_results
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
            user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE
            result_type TEXT NOT NULL CHECK (result_type IN ('A','B','C','D'))
            answers     JSONB NOT NULL  -- Record<number, string>
            created_at  TIMESTAMPTZ DEFAULT now()

          RLS: ユーザーは自分の行のみ SELECT/INSERT 可
          取得: SELECT * FROM diagnosis_results
                WHERE user_id = auth.uid()
                ORDER BY created_at DESC
                LIMIT 20

          未ログイン時: このプレビュー表示をそのまま維持する
          ──────────────────────────────────────── */}
        <div style={{ marginTop: 24 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".12em",
              color: "var(--accent)",
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 12,
            }}
          >
            DIAGNOSIS HISTORY
          </p>

          {/* 履歴カード（未ログイン時プレビュー／ログイン後は diagnosis_results から取得） */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* ぼかしプレビュー（4タイプのうち3件分） */}
            {Object.values(DIAGNOSIS_TYPES).slice(0, 3).map((dt, i, arr) => (
              <div
                key={dt.id}
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderBottom: i < arr.length - 1 ? "1px solid var(--pale)" : "none",
                  opacity: 0.45,
                  filter: "blur(3px)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {/* タイプ識別円 */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: dt.gradient,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: dt.color,
                  }}
                >
                  {dt.id}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mincho)",
                      fontSize: 14,
                      color: "var(--black)",
                      marginBottom: 2,
                    }}
                  >
                    {dt.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {dt.label}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  ----/--/--
                </div>
              </div>
            ))}

            {/* ログイン促進オーバーレイ */}
            <div
              style={{
                padding: "20px",
                background: "var(--pale)",
                borderTop: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--mid)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  marginBottom: 12,
                  lineHeight: 1.7,
                }}
              >
                ログインすると、過去の診断結果を
                <br />
                いつでも確認できます。
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {/* TODO: Supabase Auth 実装後に href を差し替え */}
                <a
                  href="#"
                  style={{
                    fontSize: 12,
                    padding: "9px 20px",
                    borderRadius: 24,
                    background: "var(--black)",
                    color: "white",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: ".05em",
                    textDecoration: "none",
                  }}
                >
                  ログイン
                </a>
                <Link
                  href="/diagnosis"
                  style={{
                    fontSize: 12,
                    padding: "9px 20px",
                    borderRadius: 24,
                    background: "white",
                    color: "var(--ink)",
                    border: "1px solid var(--light)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: ".05em",
                    textDecoration: "none",
                  }}
                >
                  診断する
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
