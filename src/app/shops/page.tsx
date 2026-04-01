import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShopSearch from "@/components/shops/ShopSearch";

export const metadata: Metadata = {
  title: "お店を探す | ふたりへ",
  description: "取材済み・相談所おすすめのお店を、実際に利用した方の口コミで探せます。",
};

export default function ShopsPage() {
  return (
    <>
      <Header />

      <main className="pt-16">
        {/* ページヘッダー */}
        <section className="bg-pale border-b border-light" style={{ paddingTop: 88, paddingBottom: 48 }}>
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs tracking-[0.3em] text-accent uppercase mb-3">
              PLACES
            </p>
            <h1
              className="text-3xl md:text-4xl text-ink mb-3"
              style={{ fontFamily: "var(--font-mincho)" }}
            >
              お店を探す
            </h1>
            <p className="text-sm text-mid">
              取材済み・相談所おすすめのお店を、実際に利用した方の口コミで探せます
            </p>
          </div>
        </section>

        <ShopSearch />
      </main>

      <Footer />
    </>
  );
}
