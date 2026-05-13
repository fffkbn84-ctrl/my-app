import Link from "next/link";
import Image from "next/image";
import {
  WEATHER_DESCRIPTIONS,
  type WeatherKey,
} from "@/app/kinda-note/data/weatherDescriptions";
import { WEATHER_IMAGE } from "./weatherImages";
import WeatherSectionTitle from "./WeatherSectionTitle";
import { W, MAX_W } from "./styles";

export default function RelatedWeathers({ keys }: { keys: WeatherKey[] }) {
  if (!keys.length) return null;

  return (
    <section style={{ padding: "32px 16px", background: W.bg }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <WeatherSectionTitle>近い気持ち</WeatherSectionTitle>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {keys.map((k) => {
            const w = WEATHER_DESCRIPTIONS[k];
            if (!w) return null;
            return (
              <Link
                key={k}
                href={`/note/weather/${w.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: W.bgCard,
                  borderRadius: 12,
                  padding: "16px 12px",
                  border: `1px solid ${W.borderSoft}`,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform .2s, box-shadow .2s",
                }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#FAF6F0",
                    marginBottom: 10,
                  }}
                >
                  <Image
                    src={WEATHER_IMAGE[k]}
                    alt={`${w.name_ja}のイラスト`}
                    fill
                    sizes="84px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 14,
                    color: W.ink,
                    margin: "0 0 2px",
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
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {w.name_en}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
