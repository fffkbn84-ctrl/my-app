/**
 * Kinda 全体共通のローダー。SectionDivider と同じ「日の出」シンボルを脈動させる。
 * 太陽がやわらかく昇り、光線が呼吸する（天気メタファー＝上から差し込む光）。
 *
 * variant:
 *   - "page"   : Suspense fallback 用。大きめ + 文言付き + minHeight 確保
 *   - "inline" : 短い待ち向け。小さめ・文言なし
 *
 * @keyframes は globals.css に集約（kinda-loader-sun / kinda-loader-ray）。
 */

type Variant = "inline" | "page";

export default function KindaLoader({
  variant = "inline",
  label = "読み込み中…",
  minHeight,
}: {
  variant?: Variant;
  label?: string;
  minHeight?: number;
}) {
  const isPage = variant === "page";
  const iconSize = isPage ? 44 : 26;
  const block = minHeight ?? (isPage ? 400 : 80);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isPage ? 14 : 8,
        minHeight: block,
        padding: "16px 0",
        color: "var(--accent)",
      }}
    >
      <SunrisePulse size={iconSize} />
      {isPage && (
        <span
          style={{
            color: "var(--mid)",
            fontSize: 13,
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function SunrisePulse({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block", color: "var(--accent)" }}
    >
      {/* 光線（呼吸する・staggered） */}
      <g className="kinda-loader-ray">
        <path d="M 12 9.6 L 12 6" />
      </g>
      <path d="M 8.9 10.3 L 7.2 7.6" className="kinda-loader-ray kinda-loader-ray-2" />
      <path d="M 15.1 10.3 L 16.8 7.6" className="kinda-loader-ray kinda-loader-ray-3" />
      <path d="M 6.5 12 L 4.2 10.2" className="kinda-loader-ray kinda-loader-ray-4" />
      <path d="M 17.5 12 L 19.8 10.2" className="kinda-loader-ray kinda-loader-ray-5" />
      {/* 太陽（半円・やわらかく昇る） */}
      <g className="kinda-loader-sun">
        <path d="M 7.2 17 A 4.8 4.8 0 0 1 16.8 17" fill="currentColor" stroke="none" opacity="0.14" />
        <path d="M 7.2 17 A 4.8 4.8 0 0 1 16.8 17" />
      </g>
      {/* 水平線 */}
      <path d="M 3.6 17 L 20.4 17" />
    </svg>
  );
}
