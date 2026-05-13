import Link from "next/link";
import { W, MAX_W } from "./styles";

export default function WeatherCTA() {
  return (
    <section style={{ padding: "40px 16px 56px", background: W.bg }}>
      <div
        style={{
          maxWidth: MAX_W,
          margin: "0 auto",
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAF3EC 100%)",
          borderRadius: 16,
          padding: "32px 24px",
          textAlign: "center",
          border: `1px solid ${W.borderSoft}`,
          boxShadow: "0 4px 24px rgba(180,140,110,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: "0.2em",
            color: W.accentDeep,
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          KINDA NOTE
        </p>
        <h2
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 20,
            fontWeight: 500,
            color: W.ink,
            margin: "0 0 12px",
            lineHeight: 1.6,
          }}
        >
          いまの気持ちを、60秒で確かめる
        </h2>
        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 14,
            lineHeight: 1.9,
            color: W.inkSub,
            margin: "0 0 24px",
          }}
        >
          選ぶだけで、今日のあなたの天気がわかります。
          <br />
          そのまま、カウンセラーに渡せるかたちで。
        </p>
        <Link
          href="/kinda-note"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: W.accent,
            color: "#fff",
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 500,
            fontSize: 15,
            padding: "14px 28px",
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(212,160,144,0.35)",
          }}
        >
          気持ちを整理する
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 7h10M7 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
