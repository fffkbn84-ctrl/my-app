import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  getWeathersByRoute,
  ROUTE_LABELS,
  type RouteKey,
} from "@/app/kinda-note/data/weatherDescriptions";
import { WEATHER_IMAGE } from "./_components/weatherImages";
import { W, MAX_W } from "./_components/styles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

const ROUTE_ORDER: RouteKey[] = ["pre", "waiting", "omiai", "date1", "multiple", "kousai"];

export const metadata: Metadata = {
  title: "20の天気タイプ ｜ Kinda note - 気持ちを天気で表す",
  description:
    "Kinda noteは、いまの気持ちを20種類の天気で表します。あなたの今日の天気を見つけて、整理することからはじめましょう。",
  alternates: { canonical: `${SITE_URL}/note/weather` },
  openGraph: {
    title: "20の天気タイプ ｜ Kinda note",
    description:
      "Kinda noteは、いまの気持ちを20種類の天気で表します。あなたの今日の天気を見つけて、整理することからはじめましょう。",
    url: `${SITE_URL}/note/weather`,
    type: "website",
    siteName: "Kinda",
    locale: "ja_JP",
  },
};

export default function WeatherListPage() {
  return (
    <>
      <Header />

      <main style={{ background: W.bg, minHeight: "100vh" }}>
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda note", href: "/kinda-note" },
            { label: "天気タイプ" },
          ]}
        />

        {/* ヘッダー */}
        <section style={{ padding: "32px 16px 24px" }}>
          <div style={{ maxWidth: MAX_W, margin: "0 auto", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                color: W.accentDeep,
                textTransform: "uppercase",
                margin: "0 0 10px",
              }}
            >
              KINDA NOTE / WEATHER TYPES
            </p>
            <h1
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 28,
                fontWeight: 500,
                color: W.ink,
                margin: "0 0 14px",
                lineHeight: 1.5,
              }}
            >
              20の天気タイプ
            </h1>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14.5,
                lineHeight: 1.95,
                color: W.inkSub,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              Kinda noteの結果として現れる、20種類の天気を見ることができます。
              <br />
              いまの自分に近いものを、ゆっくり選んでみてください。
            </p>
          </div>
        </section>

        {/* ルート別グループ */}
        {ROUTE_ORDER.map((route) => {
          const list = getWeathersByRoute(route);
          if (!list.length) return null;
          return (
            <section key={route} style={{ padding: "24px 16px" }}>
              <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
                <h2
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 18,
                    fontWeight: 500,
                    color: W.ink,
                    margin: "0 0 16px",
                    paddingLeft: 12,
                    borderLeft: `3px solid ${W.accent}`,
                    lineHeight: 1.5,
                  }}
                >
                  {ROUTE_LABELS[route]}
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      color: W.inkFaint,
                      marginLeft: 10,
                    }}
                  >
                    {list.length} TYPES
                  </span>
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  {list.map((w) => {
                    const firstLine = w.description.split("\n")[0];
                    return (
                      <Link
                        key={w.key}
                        href={`/note/weather/${w.slug}`}
                        style={{
                          background: W.bgCard,
                          borderRadius: 12,
                          padding: "16px 12px",
                          border: `1px solid ${W.borderSoft}`,
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 90,
                            height: 90,
                            position: "relative",
                            borderRadius: 8,
                            overflow: "hidden",
                            background: "#FAF6F0",
                            marginBottom: 10,
                          }}
                        >
                          <Image
                            src={WEATHER_IMAGE[w.key]}
                            alt={`${w.name_ja}のイラスト`}
                            fill
                            sizes="90px"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <p
                          style={{
                            fontFamily: "'Shippori Mincho', serif",
                            fontSize: 15,
                            color: W.ink,
                            margin: "0 0 4px",
                            textAlign: "center",
                          }}
                        >
                          {w.name_ja}
                        </p>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            color: W.inkFaint,
                            margin: "0 0 8px",
                            textTransform: "uppercase",
                          }}
                        >
                          {w.name_en}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontSize: 12,
                            lineHeight: 1.7,
                            color: W.inkSub,
                            margin: 0,
                            textAlign: "center",
                          }}
                        >
                          {firstLine}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section style={{ padding: "32px 16px 56px" }}>
          <div
            style={{
              maxWidth: MAX_W,
              margin: "0 auto",
              background: "linear-gradient(135deg, #FFFFFF 0%, #FAF3EC 100%)",
              borderRadius: 16,
              padding: "28px 24px",
              textAlign: "center",
              border: `1px solid ${W.borderSoft}`,
              boxShadow: "0 4px 24px rgba(180,140,110,0.08)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 18,
                fontWeight: 500,
                color: W.ink,
                margin: "0 0 12px",
                lineHeight: 1.6,
              }}
            >
              今日の自分の天気を、確かめる
            </h2>
            <p
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 13.5,
                lineHeight: 1.9,
                color: W.inkSub,
                margin: "0 0 20px",
              }}
            >
              60秒の質問に答えるだけで、いまの気持ちが天気として現れます。
            </p>
            <Link
              href="/kinda-note"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: W.accent,
                color: "#fff",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 500,
                fontSize: 14.5,
                padding: "12px 26px",
                borderRadius: 999,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(212,160,144,0.35)",
              }}
            >
              気持ちを整理する
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
