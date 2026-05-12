"use client";

/**
 * カウンセラー詳細ヒーロー直下に置く「ミニリール」。
 *
 * 役割：Kinda talk のリールから遷移してきた直後の世界観の連続性を保つこと。
 *
 * 設計：
 * - 1 枚ずつスワイプで切り替わる横スクロール（scroll-snap）
 * - 5 秒ごとに自動で次の画像へ進む（ユーザー操作中は休止）
 * - リール本体と同じ 9:16 比率
 * - 上部に進捗バー、下部にキャプションオーバーレイ
 * - prefers-reduced-motion / 画面外なら自動スワイプ OFF
 *
 * 共通ロジックは useAutoSwipeReel フックに切り出してある。
 */
import { useAutoSwipeReel } from "@/hooks/useAutoSwipeReel";

type ReelImage = { bg: string; caption?: string };

export default function CounselorReelMini({ images }: { images: ReelImage[] }) {
  const { sectionRef, scrollRef, active } = useAutoSwipeReel(images.length);

  if (images.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--pale)",
        borderTop: "1px solid var(--light)",
        borderBottom: "1px solid var(--light)",
        padding: "16px 0",
      }}
      aria-label="カウンセラーのリール"
    >
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 20px" }}>
        {/* 進捗バー（リール本体と同じ表現） */}
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {images.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: 2,
                borderRadius: 2,
                background: idx === active ? "var(--accent)" : "rgba(46,38,32,.12)",
                transition: "background .25s",
              }}
            />
          ))}
        </div>

        {/* 1 枚ずつ snap する横スクロール */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 0,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            borderRadius: 14,
            aspectRatio: "9 / 16",
            maxHeight: 540,
            background: "#EFE3CB",
          }}
          className="hide-scrollbar"
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              role="img"
              aria-label={`リール ${idx + 1} / ${images.length}${img.caption ? `：${img.caption}` : ""}`}
              style={{
                flexShrink: 0,
                width: "100%",
                height: "100%",
                scrollSnapAlign: "start",
                position: "relative",
                background: img.bg.startsWith("url(") ? "#EFE3CB" : img.bg,
                backgroundImage: img.bg.startsWith("url(") ? img.bg : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {img.caption && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "32px 18px 16px",
                    background: "linear-gradient(to top, rgba(0,0,0,.55), transparent)",
                    fontFamily: "var(--font-mincho)",
                    fontSize: 14,
                    color: "white",
                    lineHeight: 1.6,
                    textShadow: "0 1px 4px rgba(0,0,0,.4)",
                  }}
                >
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 枚数インジケーター（小さく） */}
        <p
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 11,
            color: "var(--muted)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: ".08em",
          }}
          aria-live="polite"
        >
          {active + 1} / {images.length}
        </p>
      </div>
    </section>
  );
}
