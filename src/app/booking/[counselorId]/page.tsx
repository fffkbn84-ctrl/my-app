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
        style={{ background: "var(--black)" }}
      >
        {/* ページヘッダー */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-12 pb-0">
          {/* eyebrow — RESERVATION */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="block w-8 h-px"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              Reservation
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl mb-2 text-white"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            面談を予約する
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
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
