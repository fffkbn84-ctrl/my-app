import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import ReservationDetailClient from "./ReservationDetailClient";

/**
 * 予約詳細ページ（マイページから遷移）
 *
 * 表示内容:
 * - 予約日時 / 形式（対面・オンライン）
 * - カウンセラーへのリンク（プロフィール詳細へ）
 * - 相談所情報（住所 / アクセス / 営業時間 / 定休日 / 最寄駅からの行き方）
 * - Google Maps 埋め込み（住所クエリ。API キー不要の埋め込み形式）
 * - キャンセル可能ならキャンセルボタン、期限切れなら連絡先案内
 *
 * 認証ガード:
 * - 未ログインなら `/login?redirect=/mypage/reservations/{id}` に誘導
 * - RLS で他人の予約は引けないので、認証越しに自動的に絞られる
 */
export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="pt-16" style={{ background: "var(--white)", minHeight: "100vh" }}>
        <SectionSubHeader sectionName="マイページ" sectionRoot="/mypage" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "マイページ", href: "/mypage" },
            { label: "予約詳細" },
          ]}
        />
        <ReservationDetailClient reservationId={id} />
      </main>
      <Footer />
    </>
  );
}
