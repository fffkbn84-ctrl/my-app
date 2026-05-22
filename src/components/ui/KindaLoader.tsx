/**
 * Kinda 全体共通のローダー。SectionDivider と同じ噴水シンボルを脈動させる。
 *
 * variant:
 *   - "page"   : Suspense fallback 用。大きめ + 文言付き + minHeight 確保
 *   - "inline" : 短い待ち向け。小さめ・文言なし
 *
 * @keyframes は globals.css に集約（kinda-loader-droplet / kinda-loader-flow）。
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
      <FountainPulse size={iconSize} />
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

function FountainPulse({ size }: { size: number }) {
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
      <ellipse
        cx="12"
        cy="4"
        rx="1.2"
        ry="1.6"
        fill="currentColor"
        stroke="none"
        className="kinda-loader-droplet"
      />
      <path d="M 12 6.4 L 12 12.2" className="kinda-loader-flow" />
      <path d="M 12 7 Q 7 11, 5.5 16" className="kinda-loader-flow kinda-loader-flow-2" />
      <path d="M 12 7 Q 17 11, 18.5 16" className="kinda-loader-flow kinda-loader-flow-3" />
      <path d="M 4 16.4 Q 12 19.6, 20 16.4" />
      <path d="M 6.4 17.6 Q 12 19.4, 17.6 17.6" opacity="0.45" />
    </svg>
  );
}
