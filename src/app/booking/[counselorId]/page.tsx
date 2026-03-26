import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import BookingFlow from "@/components/booking/BookingFlow";

const counselors: Record<string, { name: string; agency: string }> = {
  "1": { name: "田中 美咲", agency: "ブライダルサロン エクラン" },
  "2": { name: "佐藤 あかり", agency: "マリーナ結婚相談所" },
  "3": { name: "山本 花子", agency: "ローズブライダル" },
  "4": { name: "鈴木 恵", agency: "プレシャスマリッジ" },
  "5": { name: "伊藤 由美", agency: "ハーモニーブライダル" },
  "6": { name: "中村 涼子", agency: "ルシェルブライダル" },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ counselorId: string }>;
}) {
  const { counselorId } = await params;
  const counselor = counselors[counselorId];
  if (!counselor) notFound();

  return (
    <>
      <Header />
      <main
        className="pt-16 min-h-screen"
        style={{ background: "var(--white)" }}
      >
        {/* ページヘッダー */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8" style={{ padding: "60px 0 40px" }}>
          <div
            className="flex items-center gap-3 mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--accent)" }}
          >
            <span className="block" style={{ width: "20px", height: "1px", background: "var(--accent)", flexShrink: 0 }} />
            reservation
          </div>
          <h1
            className="mb-2.5"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.15, letterSpacing: "-.02em", color: "var(--black)" }}
          >
            面談を予約する
          </h1>
          <p style={{ fontSize: "13px", color: "var(--mid)", lineHeight: 2 }}>
            {counselor.name}カウンセラー · {counselor.agency}
          </p>
        </div>

        <BookingFlow
          counselorId={counselorId}
          counselorName={counselor.name}
          agencyName={counselor.agency}
        />
      </main>
    </>
  );
}
