import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionSubHeader from "@/components/ui/SectionSubHeader";
import ShopSearch from "@/components/shops/ShopSearch";
import { getShops } from "@/lib/data";
import type { PlaceHome } from "@/lib/mock/places-home";

export const metadata: Metadata = {
  title: "お店を探す | Kinda ふたりへ",
  description: "行って確かめたお店・相談所おすすめのお店を、実際に利用した方の口コミで探せます。",
};

/**
 * Supabase の shops は静的生成のままだと新規掲載が反映されないため ISR にする。
 * 掲載・取り下げが本番へ出るまで最大 5 分。
 */
export const revalidate = 300;

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <>
      <Header />

      <main className="pt-16">
        <SectionSubHeader sectionName="Kinda act" sectionRoot="/kinda-act" />
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda act", href: "/kinda-act" },
            { label: "お店一覧" },
          ]}
        />
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
              行って確かめたお店・相談所おすすめのお店を、実際に利用した方の口コミで探せます
            </p>
          </div>
        </section>

        <ShopSearch initialShops={shops as unknown as PlaceHome[]} />
      </main>

      <Footer />
    </>
  );
}
