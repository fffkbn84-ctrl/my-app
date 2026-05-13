import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  findWeatherBySlug,
  getAllWeatherSlugs,
} from "@/app/kinda-note/data/weatherDescriptions";

import WeatherHero from "../_components/WeatherHero";
import WeatherEssence from "../_components/WeatherEssence";
import WeatherScenes from "../_components/WeatherScenes";
import WeatherScience from "../_components/WeatherScience";
import WeatherActions from "../_components/WeatherActions";
import RelatedWeathers from "../_components/RelatedWeathers";
import RelatedColumns from "../_components/RelatedColumns";
import WeatherCTA from "../_components/WeatherCTA";
import { W } from "../_components/styles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

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
  const ogImage = `${SITE_URL}/og/weather/${weather.slug}.png`;

  return {
    title,
    description: weather.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: weather.meta_description,
      url,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      siteName: "Kinda",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: weather.meta_description,
      images: [ogImage],
    },
  };
}

export default async function WeatherDetailPage({ params }: Props) {
  const { slug } = await params;
  const weather = findWeatherBySlug(slug);
  if (!weather) notFound();

  const pageUrl = `${SITE_URL}/note/weather/${weather.slug}`;
  const ogImage = `${SITE_URL}/og/weather/${weather.slug}.png`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Kinda ${weather.name_ja} ｜ ${weather.sub_title}`,
    description: weather.meta_description,
    image: ogImage,
    author: {
      "@type": "Organization",
      name: "Kinda",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Kinda",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: "2026-05-13",
    dateModified: "2026-05-13",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

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

  const hasFullBody =
    !!weather.body_essence && !!weather.body_scenes && !!weather.body_science && !!weather.body_actions;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
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

        {weather.body_essence && <WeatherEssence body={weather.body_essence} />}
        {weather.body_scenes && weather.body_scenes.length > 0 && (
          <WeatherScenes scenes={weather.body_scenes} />
        )}
        {weather.body_science && <WeatherScience body={weather.body_science} />}
        {weather.body_actions && weather.body_actions.length > 0 && (
          <WeatherActions actions={weather.body_actions} />
        )}

        {!hasFullBody && (
          <section style={{ padding: "24px 16px", background: W.bg }}>
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
              いまの気持ちを整理したい方は、下のKinda noteからどうぞ。
            </p>
          </section>
        )}

        <RelatedWeathers keys={weather.related_weather_keys} />
        <RelatedColumns slugs={weather.related_columns} />

        <WeatherCTA />
      </main>

      <Footer />
    </>
  );
}
