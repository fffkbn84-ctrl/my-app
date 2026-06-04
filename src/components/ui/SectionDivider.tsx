import Image from "next/image";

/**
 * セクション間の視覚的な区切り。中央に小さなシンボル + 両サイドに細線。
 * 装飾用なので aria-hidden。
 *
 * デフォルトは「日の出」シンボル（細線・accent 色・フラット）。
 * シーズン演出や記事末用に starfish 画像版も切り替え可能。
 *
 * デザイン方針（2026-05-17 リデザイン）:
 *   - 旧: もちもち 3D ハート（44px・ぷっくり gradient）
 *   - 新: シンプルな線画シンボル（小さめ・フラット・ブランド色）
 *   トップページの他要素（細い文字組み、フラットなカードボーダー）と調和させる。
 * 2026-06-04: 噴水（意味が読み取りづらい）→「日の出」へ。
 *   天気メタファー＆「上から差し込むやわらかい光」と一致。KindaLoader と共通。
 */
type OrnamentKey = "sunrise" | "starfish";

/**
 * 日の出シンボル（線画・フラット）。
 *  - 水平線の上に半円の太陽
 *  - 上方へ広がるやわらかい光線
 * 「夜明け＝これからの日々」を表す。
 */
function SunriseIcon({ size }: { size: number }) {
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
      {/* 光線 */}
      <path d="M 12 9.6 L 12 6" />
      <path d="M 8.9 10.3 L 7.2 7.6" />
      <path d="M 15.1 10.3 L 16.8 7.6" />
      <path d="M 6.5 12 L 4.2 10.2" />
      <path d="M 17.5 12 L 19.8 10.2" />
      {/* 太陽（半円・やわらかい fill） */}
      <path d="M 7.2 17 A 4.8 4.8 0 0 1 16.8 17" fill="currentColor" stroke="none" opacity="0.14" />
      <path d="M 7.2 17 A 4.8 4.8 0 0 1 16.8 17" />
      {/* 水平線 */}
      <path d="M 3.6 17 L 20.4 17" />
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
  ornament = "sunrise",
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
      {ornament === "starfish" ? <StarfishImage size={size} /> : <SunriseIcon size={size} />}
      <div style={{ flex: 1, height: 1, background: "var(--light)" }} />
    </div>
  );
}
