import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "見つかりませんでした | Kinda ふたりへ",
  description:
    "お探しのページは、いまここにはないようです。Kinda ふたりへのホームから別の道で探してみてください。",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px 64px",
          textAlign: "center",
          color: "var(--ink)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(420px, 80vw)",
            aspectRatio: "4 / 3",
            marginBottom: 28,
          }}
        >
          <Image
            src="/images/w_morning_mist.webp"
            alt=""
            fill
            sizes="(min-width: 640px) 420px, 80vw"
            style={{
              objectFit: "contain",
              borderRadius: 12,
            }}
            priority
          />
        </div>

        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.24em",
            color: "var(--mid)",
            margin: 0,
            marginBottom: 12,
          }}
        >
          404 — NOT FOUND
        </p>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            lineHeight: 1.7,
            margin: 0,
            marginBottom: 14,
          }}
        >
          お探しのページは、
          <br />
          いまここにはないようです。
        </h1>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.9,
            color: "var(--mid)",
            margin: 0,
            marginBottom: 32,
            maxWidth: 420,
          }}
        >
          URL が変わったか、しばらく前に閉じられたページかもしれません。
          <br />
          ホームに戻って、別の道から探してみてください。
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 28px",
              borderRadius: 999,
              background: "var(--accent)",
              color: "#fff",
              fontSize: 14,
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            ホームに戻る
          </Link>
          <Link
            href="/kinda-talk"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 28px",
              borderRadius: 999,
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              fontSize: 14,
              textDecoration: "none",
              background: "transparent",
              letterSpacing: "0.04em",
            }}
          >
            カウンセラーを探す
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
