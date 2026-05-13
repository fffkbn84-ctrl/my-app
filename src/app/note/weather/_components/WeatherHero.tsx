import Image from "next/image";
import type { WeatherDescription } from "@/app/kinda-note/data/weatherDescriptions";
import { WEATHER_IMAGE } from "./weatherImages";
import { W, MAX_W } from "./styles";

export default function WeatherHero({ weather }: { weather: WeatherDescription }) {
  return (
    <section
      style={{
        padding: "32px 16px 24px",
        background: W.bg,
      }}
    >
      <div style={{ maxWidth: MAX_W, margin: "0 auto", textAlign: "center" }}>
        {/* アイコン */}
        <div
          style={{
            width: 200,
            height: 200,
            margin: "0 auto 20px",
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            background: "#FAF6F0",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src={WEATHER_IMAGE[weather.key]}
            alt={`${weather.name_ja}（${weather.name_en}）の天気イラスト`}
            fill
            sizes="200px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            letterSpacing: "0.18em",
            color: W.accentDeep,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {weather.name_en}
        </p>

        <h1
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 28,
            fontWeight: 500,
            color: W.ink,
            margin: "0 0 16px",
            lineHeight: 1.5,
          }}
        >
          Kinda {weather.name_ja}
        </h1>

        <p
          style={{
            fontFamily: "Georgia, 'Shippori Mincho', serif",
            fontSize: 15,
            lineHeight: 1.9,
            color: W.inkSub,
            whiteSpace: "pre-line",
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {weather.description}
        </p>
      </div>
    </section>
  );
}
