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
      <div className="mypage-container">
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

        {/* PC: 左サイドバー（ナビ）＋ 右メイン。モバイル: サイドバー非表示で単一カラム */}
        <div className="mypage-layout">
          <aside className="mypage-side">
            <nav className="mypage-nav" aria-label="マイページ内ナビ">
              <a href="#notifications">お知らせ</a>
              <a href="#reservations">予約履歴</a>
              <a href="#saved">気になる</a>
              <a href="#sympathy">共感した</a>
              <a href="#reviews">投稿した口コミ</a>
              <a href="#diagnoses">診断の履歴</a>
              <a href="#account">アカウント設定</a>
            </nav>
          </aside>

          <div className="mypage-main">
            {/* ログイン状態カード（未ログイン: 促進 / ログイン済: メール+気になる件数） */}
            <AuthCard />

            {/* クイックリンク（サマリーカード） */}
            <div className="mypage-summary">
              <a href="/kinda-type">
                <span className="mypage-summary-title">診断する</span>
                <span className="mypage-summary-sub">合うカウンセラーを見つける</span>
              </a>
              <a href="#reservations">
                <span className="mypage-summary-title">予約履歴</span>
                <span className="mypage-summary-sub">面談の予定・履歴</span>
              </a>
              <a href="#saved">
                <span className="mypage-summary-title">気になる</span>
                <span className="mypage-summary-sub">保存した相談所・お店</span>
              </a>
            </div>

            {/* 相談所からのお知らせ */}
            <div id="notifications" className="mypage-section">
              <NotificationsSection />
            </div>

            {/* 診断の履歴（Kinda note 横スクロール ＋ Kinda type 最新） */}
            <div id="diagnoses" className="mypage-section">
              <NoteHistorySection />
              <DiagnosisTypeHistorySection />
            </div>

            {/* 予約履歴（ログイン時のみ表示） */}
            <div id="reservations" className="mypage-section">
              <ReservationsSection />
            </div>

            {/* 気になる一覧（保存があれば表示、なければ自動的に hidden） */}
            <div id="saved" className="mypage-section">
              <SavedSection
                allCounselors={allCounselors}
                allAgencies={AGENCIES}
                allPlaces={placesHomeData}
              />
            </div>

            {/* 共感した（Kinda story / Kinda voices） */}
            <div id="sympathy" className="mypage-section">
              <SympathySavedSection allColumns={allColumns} />
            </div>

            {/* 投稿した口コミ（ログイン時かつ投稿がある時のみ） */}
            <div id="reviews" className="mypage-section">
              <ReviewHistorySection />
            </div>

            {/* アカウント設定（ニックネーム / メール / パスワード）— 最下部 collapse */}
            <div id="account" className="mypage-section">
              <AccountSettingsSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
