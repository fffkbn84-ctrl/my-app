import Image from "next/image";
import type { WeatherKey } from "../data/weatherDescriptions";

/**
 * ポラロイド風 天気カード。
 *
 * - 白いフレーム + 上品な多層シャドウ
 * - 画像は object-fit: contain で構図を保持（切らない）
 * - フレーム下部に英名を配置（例: FLOWER OVERCAST）
 * - tiltAngle で 3% のレア傾き演出を反映
 *
 * 結果画面（モバイル）と ShareCard（800x1000px の保存画像）の両方で使用。
 * variant prop でサイズを切り替える。
 */

type Props = {
  weather: WeatherKey;
  /** カード下部に表示する英名 */
  nameEn: string;
  /** 例: "rotate(-1.2deg)"。デフォルト "rotate(0deg)" */
  tiltAngle?: string;
  /** 表示サイズ。result = 結果画面（モバイル）, share = 800x1000 ShareCard 内 */
  variant?: "result" | "share";
};

const IMAGE_PATHS: Record<WeatherKey, string> = {
  morning_mist: "/images/w_morning_mist.webp",
  pre_dawn: "/images/w_pre_dawn.webp",
  flower_overcast: "/images/w_flower_overcast.webp",
  light_rain_start: "/images/w_light_rain_start.webp",
  light_rain: "/images/w_light_rain.webp",
  rain_cloud: "/images/w_rain_cloud.jpg",
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
  // dissonance_wind = uneasy_wind（main 側のファイル名差分の吸収）
  dissonance_wind: "/images/w_uneasy_wind.webp",
  quiet_overcast: "/images/w_quiet_overcast.webp",
  mist: "/images/w_mist.webp",
};

export default function PolaroidWeatherCard({
  weather,
  nameEn,
  tiltAngle = "rotate(0deg)",
  variant = "result",
}: Props) {
  const isShare = variant === "share";
  const cardWidth = isShare ? 480 : "min(85vw, 340px)";
  const cardPaddingTop = isShare ? 24 : 16;
  const cardPaddingX = isShare ? 24 : 16;
  // 本物のポラロイドらしさを出すため、下フレームを写真の 20% 前後の太さに。
  // 上 16px / 下 56px の差で「下が明らかに太い」シルエットを作る。
  const cardPaddingBottom = isShare ? 80 : 56;
  const nameFontSize = isShare ? 16 : 11;
  // 下フレームの中で英名は「上から1/3〜中央」に置く。
  const nameMarginTop = isShare ? 28 : 20;
  const innerImagePixelSize = isShare ? 480 - cardPaddingX * 2 : 360;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: isShare ? 0 : 32,
        marginBottom: isShare ? 0 : 32,
        paddingLeft: isShare ? 0 : 16,
        paddingRight: isShare ? 0 : 16,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          padding: `${cardPaddingTop}px ${cardPaddingX}px ${cardPaddingBottom}px ${cardPaddingX}px`,
          borderRadius: 4,
          boxShadow: `0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.08)`,
          width: cardWidth,
          maxWidth: "100%",
          transform: tiltAngle,
          transition: "transform 0.6s ease",
          boxSizing: "border-box",
        }}
      >
        {/* 画像本体（正方形を維持、object-fit: contain で切り取らない） */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background: "#FAF6F0",
          }}
        >
          <Image
            src={IMAGE_PATHS[weather]}
            alt=""
            width={innerImagePixelSize}
            height={innerImagePixelSize}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            priority
          />
        </div>

        {/* フレーム下部の英名 */}
        <div
          style={{
            marginTop: nameMarginTop,
            textAlign: "center",
            fontFamily: '"Georgia", serif',
            fontSize: nameFontSize,
            letterSpacing: "0.3em",
            color: "#8B7E73",
            textTransform: "uppercase",
          }}
        >
          {nameEn}
        </div>
      </div>
    </div>
  );
}
