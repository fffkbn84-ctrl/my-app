"use client";

/**
 * 相談所詳細ヒーロー直下に置く「ミニリール」。
 *
 * 役割：相談所の店内・カウンセリングルーム・スタッフ等の写真を、
 * Kinda talk のリールと同じ世界観（1 枚ずつスワイプ）で見せる。
 *
 * 設計：CounselorReelMini と同等。共通化も可能だが、今は相談所/カウンセラーで
 * 微妙にデザイン要件が変わる可能性があるため、別ファイルで複製しておく。
 */
import { useEffect, useRef, useState } from "react";

type ReelImage = { bg: string; caption?: string };

export default function AgencyReelMini({ images }: { images: ReelImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActive(Math.max(0, Math.min(images.length - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <section
      style={{
        background: "var(--pale)",
        borderTop: "1px solid var(--light)",
        borderBottom: "1px solid var(--light)",
        padding: "16px 0",
      }}
      aria-label="相談所のリール"
    >
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 20px" }}>
        {/* 進捗バー */}
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
              aria-label={`相談所写真 ${idx + 1} / ${images.length}${img.caption ? `：${img.caption}` : ""}`}
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
