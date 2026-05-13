import type { Action } from "@/app/kinda-note/data/weatherDescriptions";
import WeatherSectionTitle from "./WeatherSectionTitle";
import { W, MAX_W } from "./styles";

export default function WeatherActions({ actions }: { actions: Action[] }) {
  return (
    <section style={{ padding: "32px 16px", background: W.bg }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <WeatherSectionTitle>できる、小さなこと</WeatherSectionTitle>

        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 12,
          }}
        >
          {actions.map((a, i) => (
            <li
              key={i}
              style={{
                background: W.bgCard,
                borderRadius: 12,
                padding: "20px 18px",
                border: `1px solid ${W.borderSoft}`,
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 14,
                alignItems: "start",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: W.accent,
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                }}
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontSize: 16,
                    fontWeight: 500,
                    color: W.ink,
                    margin: "0 0 8px",
                    lineHeight: 1.6,
                  }}
                >
                  {a.title}
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
                  {a.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
