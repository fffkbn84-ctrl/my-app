import Image from "next/image";

/**
 * セクション間の視覚的な区切り。中央にぷっくり丸みのあるハート（Kindaロゴ風の
 * もちもち感）、両サイドに細線。装飾用なので aria-hidden。
 *
 * 既定はハート（Mochi 系のSVG・完全透過・ブランド色で塗ってある）。
 * 将来シーズン演出で starfish 等の画像オーナメントに切り替えられるよう
 * ornament prop を受け取る。
 *
 * 旧: WebPの ornamental-heartwopal.webp を使っていたが、
 *      VP8 形式でアルファチャンネル無し → 透過されず灰色背景が出てしまう問題があり、
 *      SVG に置き換えた。
 */
type OrnamentKey = "heart" | "starfish";

/**
 * ぷっくり丸みのあるハート。
 * - radial gradient で 3D っぽい光沢
 * - 上部左に白いハイライトを2重に重ねて「もちもち」感
 * - 色は #D4A090 系（ヒーロー主CTAと統一）
 */
function MochiHeart({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      <defs>
        <radialGradient id="kinda-heart-mochi" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#F4CFC0" />
          <stop offset="55%" stopColor="#DCA897" />
          <stop offset="100%" stopColor="#B0866F" />
        </radialGradient>
      </defs>
      {/* もちもちハート本体（上部の谷を浅く・全体を寸詰まりに丸く） */}
      <path
        d="M50 88 C 20 76, 6 56, 6 32 C 6 18, 18 7, 30 7 C 40 7, 47 14, 50 22 C 53 14, 60 7, 70 7 C 82 7, 94 18, 94 32 C 94 56, 80 76, 50 88 Z"
        fill="url(#kinda-heart-mochi)"
      />
      {/* 大きめのソフトハイライト（左上の頬っぺた） */}
      <ellipse cx="32" cy="28" rx="9" ry="5" fill="white" opacity="0.42" />
      {/* 小さな艶の点（一段明るく） */}
      <ellipse cx="35" cy="30" rx="2.5" ry="1.5" fill="white" opacity="0.7" />
    </svg>
  );
}

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
  ornament = "heart",
  size = 44,
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
      {ornament === "heart" ? (
        <MochiHeart size={size} />
      ) : (
        <StarfishImage size={size} />
      )}
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
    </div>
  );
}
