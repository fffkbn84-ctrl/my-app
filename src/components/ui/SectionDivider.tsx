import Image from "next/image";

/**
 * セクション間の視覚的な区切り。中央にクレイ風のハートオーナメント、
 * 両サイドに細線。装飾用なので aria-hidden。
 *
 * 既定はハート（ornamental-heartwopal）。将来シーズン演出で
 * starfish2 等に切り替えられるよう ornament prop を受け取る。
 */
type OrnamentKey = "heart" | "starfish";

const ORNAMENT_SRC: Record<OrnamentKey, string> = {
  heart: "/images/ornamental-heartwopal.webp",
  starfish: "/images/ornamental-starfish2.webp",
};

export default function SectionDivider({
  ornament = "heart",
  size = 32,
}: {
  ornament?: OrnamentKey;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        maxWidth: 320,
        margin: "0 auto",
        padding: "8px 24px 24px",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
        }}
      >
        <Image
          src={ORNAMENT_SRC[ornament]}
          alt=""
          fill
          sizes={`${size}px`}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
    </div>
  );
}
