import Image from "next/image";

/**
 * セクション間の視覚的な区切り。中央に小さなシンボル + 両サイドに細線。
 * 装飾用なので aria-hidden。
 *
 * デフォルトは「噴水」シンボル（細線・accent 色・フラット）。
 * シーズン演出や記事末用に starfish 画像版も切り替え可能。
 *
 * デザイン方針（2026-05-17 リデザイン）:
 *   - 旧: もちもち 3D ハート（44px・ぷっくり gradient）
 *   - 新: シンプルな線画シンボル（小さめ・フラット・ブランド色）
 *   トップページの他要素（細い文字組み、フラットなカードボーダー）と調和させる。
 */
type OrnamentKey = "fountain" | "starfish";

/**
 * 噴水シンボル（線画・フラット）。
 *  - 上に小さな水滴
 *  - 中央から左右に弧を描く水流
 *  - 下に basin（受け皿）の曲線
 * 「ふたつの流れが交わり、ひとところに集まる」イメージ。
 */
function FountainIcon({ size }: { size: number }) {
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
      style={{
        flexShrink: 0,
        display: "block",
        color: "var(--accent)",
      }}
    >
      {/* 上の水滴（accent fill） */}
      <ellipse cx="12" cy="4" rx="1.2" ry="1.6" fill="currentColor" stroke="none" />
      {/* 中央の細い水流 */}
      <path d="M 12 6.4 L 12 12.2" />
      {/* 左右に広がるアーチ状の水流 */}
      <path d="M 12 7 Q 7 11, 5.5 16" />
      <path d="M 12 7 Q 17 11, 18.5 16" />
      {/* basin（受け皿）の曲線 */}
      <path d="M 4 16.4 Q 12 19.6, 20 16.4" />
      {/* basin 下の薄い影線（水面の余韻） */}
      <path d="M 6.4 17.6 Q 12 19.4, 17.6 17.6" opacity="0.45" />
    </svg>
  );
}

/**
 * シーズン演出用：starfish 画像。WebP に透過あり。
 */
function StarfishImage({ size }: { size: number }) {
  return (
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
        src="/images/ornamental-starfish2.webp"
        alt=""
        fill
        sizes={`${size}px`}
        style={{
          objectFit: "cover",
          objectPosition: "center 50%",
        }}
      />
    </div>
  );
}

export default function SectionDivider({
  ornament = "fountain",
  size = 28,
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
        gap: 14,
        maxWidth: 280,
        margin: "0 auto",
        padding: "10px 24px 18px",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
      {ornament === "starfish" ? <StarfishImage size={size} /> : <FountainIcon size={size} />}
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
    </div>
  );
}
