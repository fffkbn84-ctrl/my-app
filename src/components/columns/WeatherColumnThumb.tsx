import Image from "next/image";
import type { WeatherKey } from "@/app/kinda-note/data/weatherDescriptions";
import { WEATHER_DESCRIPTIONS } from "@/app/kinda-note/data/weatherDescriptions";
import { WEATHER_IMAGE } from "@/app/note/weather/_components/weatherImages";

/**
 * 「気持ちの整理」コラム（20 記事）用のポラロイド風サムネ。
 *
 * Kinda note の結果画面（PolaroidWeatherCard）の世界観を、横長 16:9
 * サムネに最適化した版。淡セピア背景 + 中央配置のポラロイド + 軽いランダム傾き。
 *
 *  - featured カード（260px tall）→ ポラロイド ~210px tall
 *  - normal  カード（160px tall）→ ポラロイド ~130px tall
 *
 * 傾きは slug ハッシュで決定論的に決める（毎回同じ）。
 */
type Props = {
  weatherKey: WeatherKey;
  /** 一覧の featured 大型カードなら true */
  featured?: boolean;
  /** 傾きを決定論的にするための seed（記事 slug） */
  slug: string;
  /** カード本体の高さを上書きしたい場合（例: 詳細ページの 240px） */
  height?: number;
};

/** slug を seed にした -1.8deg 〜 +1.8deg のランダムだが決定論的な傾き */
function tiltFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  const deg = ((Math.abs(h) % 37) - 18) / 10; // 整数 0..36 → -1.8 .. +1.8
  return deg;
}

export default function WeatherColumnThumb({
  weatherKey,
  featured = false,
  slug,
  height,
}: Props) {
  const wd = WEATHER_DESCRIPTIONS[weatherKey];
  const imageSrc = WEATHER_IMAGE[weatherKey];
  const nameEn = (wd?.name_en ?? weatherKey).toUpperCase();

  // 親要素の height を尊重（fallback で featured 260 / normal 160）
  const wrapperHeight = height ?? (featured ? 260 : 160);
  // ポラロイドカードのサイズ感（写真は正方形、下に英名バンド）
  const cardWidth = featured ? 190 : 122;
  const photoSize = featured ? 158 : 100;
  const padX = featured ? 12 : 8;
  const padTop = featured ? 12 : 8;
  const bandHeight = featured ? 32 : 22;
  const fontEn = featured ? 11 : 8;
  const tilt = tiltFromSlug(slug);

  return (
    <div
      style={{
        width: "100%",
        height: wrapperHeight,
        background: "#F4ECE0",
        // 淡いセピアの斜光（scrapbook ふう）
        backgroundImage:
          "radial-gradient(ellipse at 25% 20%, rgba(212,182,142,.20) 0%, rgba(244,236,224,0) 60%), radial-gradient(ellipse at 80% 80%, rgba(180,148,108,.16) 0%, rgba(244,236,224,0) 55%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: cardWidth,
          background: "#FFFFFF",
          padding: `${padTop}px ${padX}px ${bandHeight + padTop / 2}px`,
          boxShadow:
            "0 8px 24px rgba(180,140,90,.18), 0 2px 6px rgba(0,0,0,.06)",
          transform: `rotate(${tilt}deg)`,
          transformOrigin: "center center",
          position: "relative",
        }}
      >
        {/* 天気写真（正方形） */}
        <div
          style={{
            position: "relative",
            width: photoSize,
            height: photoSize,
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes={`${photoSize}px`}
            style={{ objectFit: "cover" }}
          />
        </div>
        {/* 英名バンド（ポラロイド下フレーム中央） */}
        <p
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: featured ? 10 : 6,
            margin: 0,
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: fontEn,
            letterSpacing: ".18em",
            color: "#8B7355",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {nameEn}
        </p>
      </div>
    </div>
  );
}
