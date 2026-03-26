import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import BookingFlow from "@/components/booking/BookingFlow";

/* ────────────────────────────────────────────────────────────
   モックデータ（後でSupabaseに差し替え）
──────────────────────────────────────────────────────────── */
const counselors: Record<string, { name: string; agency: string }> = {
  "1": { name: "田中 美咲", agency: "ブライダルサロン エクラン" },
  "2": { name: "佐藤 あかり", agency: "マリーナ結婚相談所" },
  "3": { name: "山本 花子", agency: "ローズブライダル" },
  "4": { name: "鈴木 恵", agency: "プレシャスマリッジ" },
  "5": { name: "伊藤 由美", agency: "ハーモニーブライダル" },
  "6": { name: "中村 涼子", agency: "ルシェルブライダル" },
};

/* ────────────────────────────────────────────────────────────
   ページ
──────────────────────────────────────────────────────────── */
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
      <main className="pt-16 min-h-screen bg-white">
        {/* ページヘッダー */}
        <div className="max-w-3xl mx-auto px-8 pt-12 pb-0">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            reservation
          </p>
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: "var(--font-mincho)", color: "var(--black)" }}
          >
            面談を予約する
          </h1>
          <p className="text-sm" style={{ color: "var(--mid)" }}>
            {counselor.name} · {counselor.agency}
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
