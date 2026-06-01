import type { Metadata } from "next";
import { AGENCIES, COUNSELORS, getCounselors, type Counselor } from "@/lib/data";
import { placesHomeData } from "@/lib/mock/places-home";
import { getAllColumns } from "@/lib/columns";
import AuthCard from "./AuthCard";
import AccountSettingsSection from "./AccountSettingsSection";
import SavedSection from "./SavedSection";
import SympathySavedSection from "./SympathySavedSection";
import ReviewHistorySection from "./ReviewHistorySection";
import NoteHistorySection from "./NoteHistorySection";
import DiagnosisTypeHistorySection from "./DiagnosisTypeHistorySection";
import ReservationsSection from "./ReservationsSection";
import NotificationsSection from "./NotificationsSection";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "マイページ | Kinda ふたりへ",
  description: "マイページ — お気に入り・予約履歴・口コミ投稿を管理できます。",
};

export default async function MyPage() {
  // 「気になる」一覧の表示用に、Supabase + mock の両方からカウンセラーを集めて
  // 重複排除（古い localStorage 保存も拾えるようにするため）
  const supabaseCounselors = await getCounselors();
  const counselorById = new Map<string, Counselor>();
  for (const c of [...supabaseCounselors, ...COUNSELORS]) {
    counselorById.set(String(c.id), c);
  }
  const allCounselors = Array.from(counselorById.values());

  // コラム（Kinda voices）のメタデータを取得
  const allColumns = await getAllColumns();

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

        {/* 相談所からのお知らせ（メッセージ / 日程変更提案 / 口コミ返信）。開くと既読化 */}
        <NotificationsSection />

        {/* Kinda note 履歴（天気予報風 横スクロール） */}
        <NoteHistorySection />

        {/* Kinda type 履歴（最新1件ヒーロー表示） */}
        <DiagnosisTypeHistorySection />

        {/* 予約履歴（ログイン時のみ表示） */}
        <ReservationsSection />

        {/* 気になる一覧（保存があれば表示、なければ自動的に hidden） */}
        <div style={{ marginTop: 32 }}>
          <SavedSection
            allCounselors={allCounselors}
            allAgencies={AGENCIES}
            allPlaces={placesHomeData}
          />
        </div>

        {/* 共感した（Kinda story / Kinda voices） */}
        <SympathySavedSection allColumns={allColumns} />

        {/* 投稿した口コミ（ログイン時かつ投稿がある時のみ） */}
        <ReviewHistorySection />

        {/* アカウント設定（ニックネーム / メール / パスワード）— 最下部 collapse */}
        <AccountSettingsSection />
      </div>
    </main>
  );
}
