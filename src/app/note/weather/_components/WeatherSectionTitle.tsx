import { W } from "./styles";

/** セクション見出し（h2 共通スタイル） */
export default function WeatherSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Shippori Mincho', serif",
        fontSize: 20,
        fontWeight: 500,
        color: W.ink,
        margin: "0 0 20px",
        lineHeight: 1.5,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </h2>
  );
}
