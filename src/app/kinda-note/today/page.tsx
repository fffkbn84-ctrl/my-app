import type { Metadata } from "next";
import TodayContent from "./TodayContent";
import {
  WEATHER_DESCRIPTIONS,
  getWeatherDescription,
  type WeatherKey,
} from "../data/weatherDescriptions";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

// dissonance_wind は画像ファイル名が w_uneasy_wind.webp（PolaroidWeatherCard の対応に揃える）
function imageFileFor(key: WeatherKey): string {
  return key === "dissonance_wind" ? "w_uneasy_wind" : `w_${key}`;
}

type SearchParams = Promise<{ weather?: string }>;

const BASE_TITLE = "今日の天気｜Kinda note";
const BASE_DESCRIPTION =
  "言葉にならない今日の気持ちを、天気にする。3つ選ぶだけ・20秒・会員登録なし。毎日の天気を並べて見られます。";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { weather } = await searchParams;
  const key =
    weather && weather in WEATHER_DESCRIPTIONS ? (weather as WeatherKey) : null;

  // シェアされた URL（?weather=）は天気別の og:image を出す。canonical は常に素の URL
  const canonical = `${SITE_URL}/kinda-note/today`;
  if (!key) {
    return {
      title: BASE_TITLE,
      description: BASE_DESCRIPTION,
      alternates: { canonical },
    };
  }

  const w = getWeatherDescription(key);
  const title = `今日は「${w.name_ja}」｜Kinda note`;
  return {
    title,
    description: BASE_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      title,
      description: BASE_DESCRIPTION,
      url: canonical,
      siteName: "Kinda ふたりへ",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/images/${imageFileFor(key)}.webp`,
          width: 1254,
          height: 1254,
          alt: `${w.name_ja}を表すミニチュアシーン`,
        },
      ],
    },
    twitter: { card: "summary", title, description: BASE_DESCRIPTION },
  };
}

export default function KindaNoteTodayPage() {
  return <TodayContent />;
}
