import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import BookingFlow from "@/components/booking/BookingFlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { AGENCIES, getAgencyById, getCounselorById } from "@/lib/data";
import { isUuid } from "@/lib/reservations";

// カウンセラー情報・所属相談所のキャンセル情報は頻繁には変わらない。
// 60 秒の ISR でリール→予約 への遷移を高速化。
export const revalidate = 60;

const counselors: Record<string, { name: string; agency: string }> = {
  "1": { name: "田中 美紀", agency: "Atelier Mariage 銀座" },
  "2": { name: "山田 健太郎", agency: "Atelier Mariage 銀座" },
  "3": { name: "佐藤 綾乃", agency: "Wedding Note 渋谷" },
  "6": { name: "林 俊介", agency: "Marry Hub 新宿" },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ counselorId: string }>;
}) {
  const { counselorId } = await params;

  // mock を最優先（1〜6）。無ければ Supabase から取得して同じ shape に
  // マッピングする（小山楓華のような UUID カウンセラーで 404 にならないように）。
  let counselor: { name: string; agency: string } | undefined = counselors[counselorId];
  let agencyCancelInfo: { policy?: string; phone?: string; email?: string } | undefined;
  // Supabase 由来カウンセラーの UUID を予約 INSERT 時に使うため保持しておく
  let supabaseCounselorId: string | null = null;
  let supabaseAgencyId: string | null = null;
  if (!counselor) {
    const sc = await getCounselorById(counselorId);
    if (sc) {
      counselor = { name: sc.name, agency: sc.agencyName ?? "" };
      if (isUuid(String(sc.id))) supabaseCounselorId = String(sc.id);
      // Supabase 由来のカウンセラー：所属相談所を取得して cancel 情報を引く
      if (sc.agencyId) {
        if (isUuid(String(sc.agencyId))) supabaseAgencyId = String(sc.agencyId);
        const ag = await getAgencyById(String(sc.agencyId));
        if (ag) {
          agencyCancelInfo = { policy: ag.cancelPolicy, phone: ag.phone, email: ag.email };
        }
      }
    }
  } else {
    // mock カウンセラー：名前で mock 相談所を引く
    const mockAg = AGENCIES.find((a) => a.name === counselor!.agency);
    if (mockAg) {
      agencyCancelInfo = { policy: mockAg.cancelPolicy, phone: mockAg.phone, email: mockAg.email };
    }
  }
  if (!counselor) notFound();

  return (
    <>
      <Header />
      <main
        className="pt-16 min-h-screen"
        style={{ background: "var(--white)" }}
      >
        <SectionSubHeader sectionName="カウンセラー" sectionRoot={`/counselors/${counselorId}`} />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda talk", href: "/kinda-talk" },
            { label: counselor.name, href: `/counselors/${counselorId}` },
            { label: "予約" },
          ]}
        />
        {/* ページヘッダー */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8" style={{ paddingTop: 56, paddingBottom: 36 }}>
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
          supabaseCounselorId={supabaseCounselorId}
          supabaseAgencyId={supabaseAgencyId}
          agencyCancelInfo={agencyCancelInfo}
        />
      </main>
    </>
  );
}
