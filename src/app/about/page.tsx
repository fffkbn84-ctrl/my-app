import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-pale pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-accent uppercase mb-4">
            About
          </p>
          <h1
            className="text-3xl md:text-5xl text-ink mb-6"
            style={{ fontFamily: "var(--font-mincho)" }}
          >
            ふたりへについて
          </h1>
          <p className="text-sm text-mid leading-relaxed">
            このページは準備中です。
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
