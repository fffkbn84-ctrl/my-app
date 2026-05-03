import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import AgencyBookingFlow from "@/components/booking/AgencyBookingFlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import { AGENCIES, COUNSELORS } from "@/lib/data";

export default async function CounselorBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ agencyId?: string }>;
}) {
  const { agencyId } = await searchParams;
  if (!agencyId) notFound();

  const agency = AGENCIES.find((a) => String(a.id) === String(agencyId));
  if (!agency) notFound();

  const counselors = COUNSELORS.filter((c) => String(c.agencyId) === String(agencyId));

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen" style={{ background: "var(--white)" }}>
        <SectionSubHeader sectionName="相談所" sectionRoot={`/agencies/${agencyId}`} />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda talk", href: "/kinda-talk" },
            { label: agency.name, href: `/agencies/${agencyId}` },
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
            {agency.name}
          </p>
        </div>

        <AgencyBookingFlow
          agencyId={String(agencyId)}
          agencyName={agency.name}
          counselors={counselors}
        />
      </main>
    </>
  );
}
