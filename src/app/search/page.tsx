import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchContent from "./SearchContent";

export const metadata = {
  title: "相談所・カウンセラーを探す | ふたりへ",
  description: "エリア・得意分野・料金帯などで絞り込んで、あなたにぴったりの相談所・カウンセラーを見つけましょう。",
};

export default function SearchPage() {
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
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
