import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CounselorSearch from "@/components/counselors/CounselorSearch";
import { createClient } from "@/lib/supabase/server";

/* ────────────────────────────────────────────────────────────
   Supabaseからカウンセラー一覧を取得
──────────────────────────────────────────────────────────── */
async function getCounselors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("counselors")
    .select(`
      id, name, name_kana, area, specialties, years_of_experience, intro, fee,
      agencies!inner(name),
      reviews(rating)
    `);

  if (error || !data) return [];

  return data.map((c) => {
    const revs = (c.reviews as { rating: number }[]) ?? [];
    const rating =
      revs.length > 0
        ? Math.round((revs.reduce((s, r) => s + r.rating, 0) / revs.length) * 10) / 10
        : 0;
    return {
      id: c.id,
      name: c.name,
      nameKana: c.name_kana ?? "",
      agency: (c.agencies as { name: string }).name,
      area: c.area ?? "",
      specialties: c.specialties ?? [],
      rating,
      reviewCount: revs.length,
      yearsExp: c.years_of_experience ?? 0,
      intro: c.intro ?? "",
      nextAvailable: "近日公開",
      fee: c.fee ?? "無料",
    };
  });
}

/* ────────────────────────────────────────────────────────────
   ページ（Server Component）
──────────────────────────────────────────────────────────── */
export default async function CounselorsPage() {
  const counselors = await getCounselors();
  return (
    <>
      <Header />

      <main className="pt-16">
        {/* ページヘッダー */}
        <section className="bg-pale py-14 md:py-20 border-b border-light">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">
              Counselors
            </p>
            <h1
              className="text-3xl md:text-4xl text-ink mb-3"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              カウンセラーを探す
            </h1>
            <p className="text-sm text-mid">
              {counselors.length}名のカウンセラーが登録中
            </p>
          </div>
        </section>

        {/* 検索・フィルター＋一覧（クライアントコンポーネント） */}
        <CounselorSearch counselors={counselors} />
      </main>

      <Footer />
    </>
  );
}
