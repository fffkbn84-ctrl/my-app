import type { Metadata } from "next";
import { headers } from "next/headers";
import ResultContent from "./ResultContent";
import {
  getWeatherDescription,
  type WeatherKey,
} from "../data/weatherDescriptions";

// preview / production / カスタムドメインに自動追従するため request header から導出。
async function deriveSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host && !host.includes("localhost")) {
    const protocol = h.get("x-forwarded-proto") ?? "https";
    return `${protocol}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";
}

const WEATHER_KEYS: WeatherKey[] = [
  "morning_mist", "pre_dawn", "flower_overcast", "light_rain_start",
  "light_rain", "rain_cloud", "thunderstorm", "sun_break",
  "angels_ladder", "windy_day", "light_sunrise", "wandering_clouds",
  "cold_wind", "windy_sunshine", "faint_sunlight", "twilight",
  "sunrise", "dissonance_wind", "quiet_overcast", "mist",
];

// dissonance_wind は画像ファイル名が w_uneasy_wind.webp（PolaroidWeatherCard の対応に揃える）
function imageFileFor(key: WeatherKey): string {
  return key === "dissonance_wind" ? "w_uneasy_wind" : `w_${key}`;
}

type SearchParams = Promise<{ route?: string; replay?: string; weather?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { weather } = await searchParams;
  const key = (weather && WEATHER_KEYS.includes(weather as WeatherKey))
    ? (weather as WeatherKey)
    : null;

  if (!key) {
    return {
      title: "Kinda note 結果",
    };
  }

  const w = getWeatherDescription(key);
  const siteUrl = await deriveSiteUrl();
  const title = `${w.name_ja}｜Kinda note 結果`;
  const description = w.meta_description || w.description;
  const imageUrl = `${siteUrl}/images/${imageFileFor(key)}.webp`;
  const pageUrl = `${siteUrl}/kinda-note/result?weather=${key}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Kinda ふたりへ",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1254,
          height: 1254,
          alt: `${w.name_ja}を表すミニチュアシーン`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// 結果画面は localStorage の回答データに依存するクライアント主導のページ。
// 静的 prerender ではなく、リクエストごとにサーバが route だけ受け渡しする。
// Vercel 上で稀に prerender 結果と useSearchParams の不整合が起きて
// iOS Safari が「This page couldn't load」を出す事象を回避するため。
export const dynamic = "force-dynamic";

export default async function KindaNoteResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { route, replay } = await searchParams;
  return (
    <ResultContent
      initialRoute={route ?? null}
      isReplay={replay === "1"}
    />
  );
}
