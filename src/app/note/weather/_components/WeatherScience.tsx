import WeatherSectionTitle from "./WeatherSectionTitle";
import { W, MAX_W } from "./styles";

export default function WeatherScience({ body }: { body: string }) {
  return (
    <section style={{ padding: "32px 16px", background: W.bg }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <WeatherSectionTitle>気持ちを言葉にすると、なにが起きるか</WeatherSectionTitle>
        <div
          style={{
            background: "#FAF3EC",
            borderRadius: 12,
            padding: "24px 20px",
            border: `1px solid ${W.borderSoft}`,
            borderLeft: `3px solid ${W.accent}`,
          }}
        >
          {body.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 14.5,
                lineHeight: 2,
                color: W.ink,
                margin: i === 0 ? "0 0 14px" : "14px 0 0",
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
