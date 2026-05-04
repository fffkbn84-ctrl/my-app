import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import AgenciesClient from "./AgenciesClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

const TITLE = "相談所を探す｜Kinda ふたりへ";
const DESCRIPTION =
  "あなたに合う結婚相談所を、エリア・種別・料金帯から探せます。仲人型・データ婚活・オンライン専門など、面談済みの口コミ付きで比較できる Kinda ふたりへの相談所一覧。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/agencies` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/agencies`,
    siteName: "Kinda ふたりへ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AgenciesPage() {
  return (
    <>
      <Header />
      <main className="agc-main">
        <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "相談所一覧" }]} />

        <section className="agc-hero">
          <p className="agc-hero-eyebrow">AGENCIES</p>
          <h1 className="agc-hero-title">相談所を探す</h1>
          <p className="agc-hero-sub">
            エリア・種別・料金帯から、自分に合う結婚相談所を見つけよう。
          </p>
        </section>

        <AgenciesClient />
      </main>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
