import Header from "@/components/layout/Header";
import ReviewReservationGate from "@/components/reviews/ReviewReservationGate";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";

export const metadata = {
  title: "口コミを書く | Kinda ふたりへ",
  description: "面談後の口コミを投稿してください。あなたの声が次の方の婚活の参考になります。",
};

export default async function ReviewNewPage({
  searchParams,
}: {
  searchParams: Promise<{ reservation?: string }>;
}) {
  const { reservation } = await searchParams;

  return (
    <>
      <Header />

      <main
        className="pt-16 min-h-screen"
        style={{ background: "var(--white)" }}
      >
        <SectionSubHeader sectionName="ホーム" sectionRoot="/" />
        <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "口コミ投稿" }]} />
        {/* ページヘッダー */}
        <div style={{ padding: "56px 0 36px" }}>
          <div
            style={{
              maxWidth: 680,
              margin: "0 auto",
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--accent)", fontFamily: "'DM Sans', sans-serif" }}
            >
              write a review
            </p>
            <h1
              className="text-3xl mb-4"
              style={{
                fontFamily: "var(--font-mincho)",
                color: "var(--ink)",
                fontWeight: 400,
              }}
            >
              口コミを書く
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--mid)" }}
            >
              体験をシェアして、次に悩む誰かの背中を押してください。
            </p>
          </div>
        </div>

        {/* コンテンツ（中央寄せ＋左右余白＋下ナビ分のクリアランス） */}
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: "0 24px",
            paddingBottom: "calc(96px + env(safe-area-inset-bottom))",
          }}
        >
          <ReviewReservationGate reservationId={reservation} />
        </div>
      </main>
    </>
  );
}
