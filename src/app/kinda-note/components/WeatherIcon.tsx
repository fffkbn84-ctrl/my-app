import Image from "next/image";
import type { WeatherKey } from "../data/weatherDescriptions";

/**
 * 天気アイコン。
 *
 * フェーズ1暫定の SVG プレースホルダーから、main ブランチで用意済みの
 * /images/w_*.webp に差し替え済み。
 *
 * 注意：v3 spec のキー名 `dissonance_wind`（違和感の風）に対応する画像は
 * main 側で `w_uneasy_wind.webp` として保存されているため、
 * 下記マッピングテーブルだけ別名を使用する。
 */

type Props = {
  weather: WeatherKey;
  size?: number;
  /** 互換用に残しているが、画像描画では使用しない */
  color?: string;
};

const IMAGE_PATHS: Record<WeatherKey, string> = {
  // pre
  morning_mist: "/images/w_morning_mist.webp",
  pre_dawn: "/images/w_pre_dawn.webp",
  flower_overcast: "/images/w_flower_overcast.webp",
  // waiting
  light_rain_start: "/images/w_light_rain_start.webp",
  light_rain: "/images/w_light_rain.webp",
  rain_cloud: "/images/w_rain_cloud.jpg",
  thunderstorm: "/images/w_thunderstorm.webp",
  // omiai
  sun_break: "/images/w_sun_break.webp",
  angels_ladder: "/images/w_angels_ladder.webp",
  windy_day: "/images/w_windy_day.webp",
  // date1
  light_sunrise: "/images/w_light_sunrise.webp",
  wandering_clouds: "/images/w_wandering_clouds.webp",
  cold_wind: "/images/w_cold_wind.webp",
  // multiple
  windy_sunshine: "/images/w_windy_sunshine.webp",
  faint_sunlight: "/images/w_faint_sunlight.webp",
  twilight: "/images/w_twilight.webp",
  // kousai
  sunrise: "/images/w_sunrise.webp",
  // dissonance_wind = uneasy_wind（main 側のファイル名）
  dissonance_wind: "/images/w_uneasy_wind.webp",
  quiet_overcast: "/images/w_quiet_overcast.webp",
  mist: "/images/w_mist.webp",
};

export default function WeatherIcon({ weather, size = 96 }: Props) {
  const src = IMAGE_PATHS[weather];
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
      }}
      priority
    />
  );
}
