import WeatherSectionTitle from "./WeatherSectionTitle";
import { W, MAX_W } from "./styles";

export default function WeatherEssence({ body }: { body: string }) {
  return (
    <section style={{ padding: "32px 16px", background: W.bg }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <WeatherSectionTitle>この天気の正体</WeatherSectionTitle>
        <div
          style={{
            background: W.bgCard,
            borderRadius: 12,
            padding: "24px 20px",
            border: `1px solid ${W.borderSoft}`,
          }}
        >
          {body.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 15,
                lineHeight: 1.95,
                color: W.ink,
                margin: i === 0 ? "0 0 16px" : "16px 0 0",
                whiteSpace: "pre-line",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
