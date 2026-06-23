import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  findWeatherBySlug,
  getAllWeatherSlugs,
} from "@/app/kinda-note/data/weatherDescriptions";
import { getColumnBySlug } from "@/lib/columns";

import WeatherHero from "../_components/WeatherHero";
import RelatedWeathers from "../_components/RelatedWeathers";
import WeatherCTA from "../_components/WeatherCTA";
import { W, MAX_W } from "../_components/styles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllWeatherSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const weather = findWeatherBySlug(slug);
  if (!weather) return {};

  const title = `Kinda ${weather.name_ja} ｜ ${weather.sub_title} - Kinda note`;
  const url = `${SITE_URL}/note/weather/${weather.slug}`;

  // 紐づくコラムが無いページ（15件）は noindex で除外。
  // ドメイン全体の E-E-A-T を毀損しないため。
  const noindex = !weather.column_slug;

  return {
    title,
    description: weather.meta_description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description: weather.meta_description,
      url,
      type: "article",
      siteName: "Kinda",
      locale: "ja_JP",
      // 各天気ページが openGraph を上書きするため、images を明示しないと
      // 親(layout)のデフォルト og:image を継承できず SNS シェア画像が欠落する。
      // 当面はブランド共通の OGP-hero.jpg をフォールバックとして使う。
      images: [
        {
          url: `${SITE_URL}/images/OGP-hero.jpg`,
          width: 1200,
          height: 632,
          alt: "Kinda（カインダ）— 気持ちを、天気の言葉で。",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: weather.meta_description,
      images: [`${SITE_URL}/images/OGP-hero.jpg`],
    },
  };
}

export default async function WeatherDetailPage({ params }: Props) {
  const { slug } = await params;
  const weather = findWeatherBySlug(slug);
  if (!weather) notFound();

  const pageUrl = `${SITE_URL}/note/weather/${weather.slug}`;

  // 紐づくコラム（あれば取得）
  let linkedColumn = null;
  if (weather.column_slug) {
    try {
      linkedColumn = await getColumnBySlug(weather.column_slug);
    } catch {
      linkedColumn = null;
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Kinda note", item: `${SITE_URL}/kinda-note` },
      { "@type": "ListItem", position: 3, name: "天気タイプ", item: `${SITE_URL}/note/weather` },
      {
        "@type": "ListItem",
        position: 4,
        name: weather.name_ja,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Header />

      <main style={{ background: W.bg, minHeight: "100vh" }}>
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "Kinda note", href: "/kinda-note" },
            { label: "天気タイプ", href: "/note/weather" },
            { label: weather.name_ja },
          ]}
        />

        <WeatherHero weather={weather} />

        {/* コラムがある天気：濃いコラムへ誘導カードを表示 */}
        {linkedColumn ? (
          <section style={{ padding: "16px 16px 32px", background: W.bg }}>
            <Link
              href={`/columns/${linkedColumn.slug}`}
              style={{
                display: "block",
                maxWidth: MAX_W,
                margin: "0 auto",
                background: "linear-gradient(135deg,#FFFFFF 0%,#FAF3EC 100%)",
                border: `1px solid ${W.borderSoft}`,
                borderRadius: 16,
                padding: "24px 22px",
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 4px 24px rgba(180,140,110,0.10)",
                transition: "transform .2s, box-shadow .2s",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: W.accentDeep,
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                }}
              >
                READ THE FULL ARTICLE
              </p>
              <h2
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: "clamp(17px, 2.6vw, 20px)",
                  fontWeight: 500,
                  color: W.ink,
                  margin: "0 0 10px",
                  lineHeight: 1.6,
                }}
              >
                {linkedColumn.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.9,
                  color: W.inkSub,
                  margin: "0 0 14px",
                }}
              >
                {linkedColumn.description}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 13,
                  color: W.accentDeep,
                  fontWeight: 500,
                }}
              >
                Kinda voices で深く読む
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M2 7h10M7 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </section>
        ) : (
          // コラム未連携 (= noindex 対象) のページには簡潔な近日公開メッセージ
          <section style={{ padding: "16px 16px 24px", background: W.bg }}>
            <p
              style={{
                maxWidth: 520,
                margin: "0 auto",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 13,
                lineHeight: 1.9,
                color: W.inkSub,
                textAlign: "center",
              }}
            >
              この天気の詳しい解説は、近日公開予定です。
              <br />
              いまの気持ちを整理したい方は、下の Kinda note からどうぞ。
            </p>
          </section>
        )}

        <RelatedWeathers keys={weather.related_weather_keys} />

        <WeatherCTA />
      </main>

      <Footer />
    </>
  );
}
