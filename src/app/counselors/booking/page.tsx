import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import AgencyBookingFlow from "@/components/booking/AgencyBookingFlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import {
  AGENCIES,
  COUNSELORS,
  getAgencyById,
  getCounselors,
  type Counselor,
} from "@/lib/data";

export default async function CounselorBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ agencyId?: string }>;
}) {
  const { agencyId } = await searchParams;
  if (!agencyId) notFound();

  // mock を最優先（1〜6）。無ければ Supabase から取得して同じ shape にマップする。
  // Supabase オンリー相談所（UUID）で notFound にならないようにするため。
  const mockAgency = AGENCIES.find((a) => String(a.id) === String(agencyId));
  let agencyName = mockAgency?.name;
  if (!agencyName) {
    const supabaseAgency = await getAgencyById(agencyId);
    if (supabaseAgency) {
      agencyName = supabaseAgency.name;
    }
  }
  if (!agencyName) notFound();

  // 在籍カウンセラー: mock を最優先、Supabase なら getCounselors で agency_id 一致を抽出
  let counselors: Counselor[] = COUNSELORS.filter(
    (c) => String(c.agencyId) === String(agencyId),
  );
  if (counselors.length === 0) {
    const all = await getCounselors();
    counselors = all.filter((c) => String(c.agencyId) === String(agencyId));
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen" style={{ background: "var(--white)" }}>
        <SectionSubHeader sectionName="相談所" sectionRoot={`/agencies/${agencyId}`} />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda talk", href: "/kinda-talk" },
            { label: agencyName, href: `/agencies/${agencyId}` },
            { label: "予約" },
          ]}
        />
        {/* ページヘッダー */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "60px 24px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span
              style={{
                display: "block",
                width: 20,
                height: 1,
                background: "var(--accent)",
                flexShrink: 0,
              }}
            />
            reservation
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-.02em",
              color: "var(--black)",
              marginBottom: 10,
            }}
          >
            面談を予約する
          </h1>
          <p style={{ fontSize: 13, color: "var(--mid)", lineHeight: 2 }}>
            {agencyName}
          </p>
        </div>

        <AgencyBookingFlow
          agencyId={String(agencyId)}
          agencyName={agencyName}
          counselors={counselors}
        />
      </main>
    </>
  );
}
