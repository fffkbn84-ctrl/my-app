import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchContent from "./SearchContent";
import { getCounselors, getAgencies, type Counselor, type Agency } from "@/lib/data";

export const metadata = {
  title: "相談所・カウンセラーを探す | Kinda ふたりへ",
  description: "エリア・得意分野・料金帯などで絞り込んで、あなたにぴったりの相談所・カウンセラーを見つけましょう。",
};

export default async function SearchPage() {
  const [counselors, agencies] = await Promise.all([
    getCounselors(),
    getAgencies(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-16">
        <Suspense
          fallback={
            <div
              style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                fontSize: 14,
              }}
            >
              読み込み中...
            </div>
          }
        >
          <SearchContent
            counselors={counselors as Counselor[]}
            agencies={agencies as Agency[]}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
