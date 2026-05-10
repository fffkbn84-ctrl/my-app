import type { Metadata } from "next";
import { AGENCIES, COUNSELORS, getCounselors, type Counselor } from "@/lib/data";
import { placesHomeData } from "@/lib/mock/places-home";
import AuthCard from "./AuthCard";
import SavedSection from "./SavedSection";
import NoteHistorySection from "./NoteHistorySection";
import DiagnosisTypeHistorySection from "./DiagnosisTypeHistorySection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "マイページ | Kinda ふたりへ",
  description: "マイページ — お気に入り・予約履歴・口コミ投稿を管理できます。",
};

const featureItems = [
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

        {/* Kinda note 履歴（天気予報風 横スクロール） */}
        <NoteHistorySection />

        {/* Kinda type 履歴（最新1件ヒーロー表示） */}
        <DiagnosisTypeHistorySection />

        {/* 気になる一覧（保存があれば表示、なければ自動的に hidden） */}
        <div style={{ marginTop: 32 }}>
          <SavedSection
            allCounselors={allCounselors}
            allAgencies={AGENCIES}
            allPlaces={placesHomeData}
          />
        </div>

        {/* 機能紹介リスト */}
        <div
          style={{
            marginTop: 32,
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
