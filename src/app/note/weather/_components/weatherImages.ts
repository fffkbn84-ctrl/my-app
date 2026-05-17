import type { WeatherKey } from "@/app/kinda-note/data/weatherDescriptions";

/**
 * 各天気キーに対応する画像パス。
 * Kinda note の PolaroidWeatherCard と同じファイルを使用。
 */
export const WEATHER_IMAGE: Record<WeatherKey, string> = {
  morning_mist: "/images/w_morning_mist.webp",
  pre_dawn: "/images/w_pre_dawn.webp",
  flower_overcast: "/images/w_flower_overcast.webp",
  light_rain_start: "/images/w_light_rain_start.webp",
  light_rain: "/images/w_light_rain.webp",
  rain_cloud: "/images/w_rain_cloud.webp",
  thunderstorm: "/images/w_thunderstorm.webp",
  sun_break: "/images/w_sun_break.webp",
  angels_ladder: "/images/w_angels_ladder.webp",
  windy_day: "/images/w_windy_day.webp",
  light_sunrise: "/images/w_light_sunrise.webp",
  wandering_clouds: "/images/w_wandering_clouds.webp",
  cold_wind: "/images/w_cold_wind.webp",
  windy_sunshine: "/images/w_windy_sunshine.webp",
  faint_sunlight: "/images/w_faint_sunlight.webp",
  twilight: "/images/w_twilight.webp",
  sunrise: "/images/w_sunrise.webp",
  // dissonance_wind は kinda-note 側で uneasy_wind のファイル名を流用している
  dissonance_wind: "/images/w_uneasy_wind.webp",
  quiet_overcast: "/images/w_quiet_overcast.webp",
  mist: "/images/w_mist.webp",
};
