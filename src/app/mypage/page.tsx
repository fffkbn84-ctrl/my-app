import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ | ふたりへ",
  description: "マイページ — お気に入り・予約履歴・口コミ投稿を管理できます。",
};

const featureItems = [
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

export default function MyPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--white)",
        paddingTop: "60px",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom))",
      }}
    >
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

        {/* ログイン促進カード */}
        <div
          style={{
            background: "var(--black)",
            borderRadius: "20px",
            padding: "36px 28px",
            marginBottom: "24px",
          }}
        >
          {/* 鍵アイコン */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect
                x="8"
                y="18"
                width="24"
                height="18"
                rx="3"
                stroke="#C8A97A"
                strokeWidth="1.5"
                fill="rgba(200,169,122,.1)"
              />
              <path
                d="M13 18v-5a7 7 0 0114 0v5"
                stroke="#C8A97A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="27" r="2" fill="#C8A97A" />
            </svg>
          </div>

          {/* テキスト */}
          <p
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "18px",
              color: "white",
              textAlign: "center",
              margin: "20px 0 28px",
              lineHeight: 1.7,
            }}
          >
            ログイン・会員登録すると
            <br />
            使えるようになります
          </p>

          {/* ボタン群 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* ログインボタン — Supabase Auth実装後に差し替え */}
            <a
              href="#"
              style={{
                display: "block",
                width: "100%",
                borderRadius: "50px",
                background: "var(--accent)",
                color: "var(--black)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: ".06em",
                textAlign: "center",
                padding: "14px 0",
                textDecoration: "none",
                transition: "opacity .2s",
              }}
            >
              ログイン
            </a>

            {/* 新規登録ボタン — Supabase Auth実装後に差し替え */}
            <a
              href="#"
              style={{
                display: "block",
                width: "100%",
                borderRadius: "50px",
                background: "white",
                color: "var(--ink)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: ".06em",
                textAlign: "center",
                padding: "14px 0",
                textDecoration: "none",
                border: "1px solid var(--light)",
                transition: "opacity .2s",
              }}
            >
              新規会員登録（無料）
            </a>
          </div>
        </div>

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
      </div>
    </main>
  );
}
