import { ImageResponse } from "next/og";
import { getVoiceBySlug } from "@/lib/voices";

export const runtime = "nodejs";
export const alt = "Kinda voices 取材記事";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * /voices/[slug]/opengraph-image
 *
 * 取材記事ごとに 1200x630 の OGP 画像を動的生成する。
 * - 上部にカウンセラー名・相談所名・地域（取材記事であることが一目で分かる情報）
 * - 中央にタイトル
 * - フォントは @vercel/og 同梱の Geist(欧文)。日本語は @vercel/og が実行時に
 *   Google Fonts から必要なグリフのみ取得してフォールバックする（fonts 未指定でも描画される）。
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next 16 では params は Promise。await せずに .slug を読むと undefined になる。
  const { slug } = await params;

  let voice;
  try {
    voice = await getVoiceBySlug(slug);
  } catch {
    voice = null;
  }

  const title = voice?.title ?? "Kinda voices";
  const background =
    voice?.thumbnail || "linear-gradient(135deg, #FBF7F1 0%, #F4ECE0 100%)";
  const meta = [voice?.area, voice?.agencyName].filter(Boolean).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background,
        }}
      >
        {/* 上部：取材対象の識別情報 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {meta && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 22,
                color: "#3A2E26",
                letterSpacing: "0.06em",
              }}
            >
              {meta}
            </div>
          )}
        </div>

        {/* タイトル */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.78)",
            borderRadius: 24,
            padding: "44px 48px",
            boxShadow: "0 8px 32px rgba(80,55,30,0.10)",
          }}
        >
          <div
            style={{
              fontSize: 54,
              lineHeight: 1.4,
              color: "#231A12",
              letterSpacing: "0.02em",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        {/* 下部：ロゴライン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 36, color: "#231A12", letterSpacing: "0.04em" }}>
              Kinda
            </div>
            <div style={{ fontSize: 32, color: "#8B7355" }}>·</div>
            <div style={{ fontSize: 26, color: "#6B5538", letterSpacing: "0.06em" }}>
              ふたりへ
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(58,46,38,0.6)",
              letterSpacing: "0.16em",
            }}
          >
            KINDA VOICES
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
