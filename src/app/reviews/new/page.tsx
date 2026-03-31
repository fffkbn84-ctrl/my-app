import Header from "@/components/layout/Header";
import ReviewGate from "@/components/reviews/ReviewGate";

export const metadata = {
  title: "口コミを書く | ふたりへ",
  description: "面談後の口コミを投稿してください。あなたの声が次の方の婚活の参考になります。",
};

export default async function ReviewNewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <>
      <Header />

      <main
        className="pt-16 min-h-screen"
        style={{ background: "var(--white)" }}
      >
        {/* ページヘッダー */}
        <div style={{ padding: "60px 0 40px" }}>
          <div className="max-w-[640px] mx-auto px-6 text-center">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
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

        {/* コンテンツ */}
        <div className="max-w-[640px] mx-auto px-6 pb-20">
          <ReviewGate urlToken={token} />
        </div>
      </main>
    </>
  );
}
