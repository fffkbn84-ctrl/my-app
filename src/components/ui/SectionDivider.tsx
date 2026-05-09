import Image from "next/image";

/**
 * セクション間の視覚的な区切り。中央にクレイ風のオーナメント、
 * 両サイドに細線。装飾用なので aria-hidden。
 *
 * 既定はハート（ornamental-heartwopal）。将来シーズン演出で
 * starfish2 等に切り替えられるよう ornament prop を受け取る。
 *
 * 画像はポートレート比率（700:1500）のため、object-fit: cover で
 * ハート部分だけクロップして見せる。object-position は経験則で
 * ハートが中央に来る値を指定。
 */
type OrnamentKey = "heart" | "starfish";

const ORNAMENT_CONFIG: Record<
  OrnamentKey,
  { src: string; objectPosition: string }
> = {
  heart: {
    src: "/images/ornamental-heartwopal.webp",
    objectPosition: "center 40%",
  },
  starfish: {
    src: "/images/ornamental-starfish2.webp",
    objectPosition: "center 50%",
  },
};

export default function SectionDivider({
  ornament = "heart",
  size = 44,
}: {
  ornament?: OrnamentKey;
  size?: number;
}) {
  const config = ORNAMENT_CONFIG[ornament];
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
          overflow: "hidden",
        }}
      >
        <Image
          src={config.src}
          alt=""
          fill
          sizes={`${size}px`}
          style={{
            objectFit: "cover",
            objectPosition: config.objectPosition,
          }}
        />
      </div>
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
    </div>
  );
}
