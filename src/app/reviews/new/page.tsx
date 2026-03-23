import Header from "@/components/layout/Header";
import ReviewGate from "@/components/reviews/ReviewGate";

export const metadata = {
  title: "口コミを投稿する | ふたりへ",
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

      <main className="pt-16 min-h-screen bg-white">
        {/* ページヘッダー */}
        <div className="border-b border-light bg-pale">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <p className="text-xs tracking-[0.2em] text-accent uppercase mb-1">
              Review
            </p>
            <h1
              className="text-xl text-ink"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              口コミを投稿する
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">
          <ReviewGate urlToken={token} />
        </div>
      </main>
    </>
  );
}
