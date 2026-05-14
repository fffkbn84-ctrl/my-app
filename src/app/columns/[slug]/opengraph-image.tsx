import { ImageResponse } from "next/og";
import { getColumnBySlug } from "@/lib/columns";

export const runtime = "nodejs";
export const alt = "Kinda ふたりへ コラム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * /columns/[slug]/opengraph-image
 *
 * SEO/SNS 拡散用に、各コラムごとに 1200x630 の OGP 画像を動的生成する。
 * - thumbnail のグラデーション文字列をそのまま背景に流用
 * - タイトル（最大 2 行）+ カテゴリ + Kinda ふたりへ ロゴ
 * - フォントは Next.js が同梱する Inter（日本語は OS 標準にフォールバック）
 *
 * Next.js Metadata Files API で /columns/[slug]/opengraph-image.png として配信される。
 */
export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  let column;
  try {
    column = await getColumnBySlug(params.slug);
  } catch {
    column = null;
  }

  const title = column?.title ?? "Kinda ふたりへ";
  const category = column?.category ?? "";
  const background =
    column?.thumbnail || "linear-gradient(135deg, #FBF7F1 0%, #F4ECE0 100%)";

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
          fontFamily:
            '"Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif',
        }}
      >
        {/* 上部：カテゴリラベル */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 22,
                color: "#3A2E26",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              {category}
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
              fontWeight: 500,
              letterSpacing: "0.02em",
              // 長文タイトル対策：5 行までに収める
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        {/* 下部：Kinda ロゴライン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#231A12",
                letterSpacing: "0.04em",
              }}
            >
              Kinda
            </div>
            <div
              style={{
                fontSize: 32,
                color: "#8B7355",
              }}
            >
              ·
            </div>
            <div
              style={{
                fontSize: 26,
                color: "#6B5538",
                letterSpacing: "0.06em",
              }}
            >
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
