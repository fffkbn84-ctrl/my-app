import type { Scene } from "@/app/kinda-note/data/weatherDescriptions";
import WeatherSectionTitle from "./WeatherSectionTitle";
import { W, MAX_W } from "./styles";

export default function WeatherScenes({ scenes }: { scenes: Scene[] }) {
  return (
    <section style={{ padding: "32px 16px", background: W.bg }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <WeatherSectionTitle>こんな時にこの天気になる</WeatherSectionTitle>

        <div style={{ display: "grid", gap: 16 }}>
          {scenes.map((s, i) => (
            <div
              key={i}
              style={{
                background: W.bgCard,
                borderRadius: 12,
                padding: "20px 18px",
                border: `1px solid ${W.borderSoft}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  color: W.accentDeep,
                  margin: "0 0 8px",
                }}
              >
                SCENE {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: 16,
                  fontWeight: 500,
                  color: W.ink,
                  margin: "0 0 10px",
                  lineHeight: 1.6,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: W.inkSub,
                  margin: 0,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
