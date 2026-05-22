"use client";

import { useEffect, useState } from "react";
import type { PlaceHome } from "@/lib/mock/places-home";
import PlaceBadge from "./PlaceBadge";
import DemoBadge from "@/components/kinda-talk/DemoBadge";
import { PLACE_CATEGORY_ICON } from "./placeIcons";

const GRADIENT_BG: Record<string, string> = {
  cafe: "linear-gradient(135deg,#FAEAE5,#F0D8D0)",
  lounge: "linear-gradient(135deg,#F5E5E1,#ECC8C5)",
  hair: "linear-gradient(135deg,#E8F4E4,#C8E0C0)",
  nail: "linear-gradient(135deg,#EDE0F4,#DCC5E8)",
  brow: "linear-gradient(135deg,#FAF3DE,#F4E8C4)",
  "photo-studio": "linear-gradient(135deg,#E0ECF8,#C4D8EC)",
};

const AUTO_SLIDE_INTERVAL_MS = 5000;

type Props = {
  place: PlaceHome;
  onOpen: (place: PlaceHome) => void;
};

export default function PlaceReelCard({ place, onOpen }: Props) {
  const bg = GRADIENT_BG[place.thumbVariant] ?? "linear-gradient(135deg,#FAEAE5,#F0D8D0)";
  // images に統合済み（photo_url + shop_media）。後方互換で photoUrl 単発も拾う
  const images = place.images && place.images.length > 0
    ? place.images
    : place.photoUrl
      ? [place.photoUrl]
      : [];
  const hasPhoto = images.length > 0;

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const reduced = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = window.setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <button
      type="button"
      className="kt-reel-card"
      aria-label={`${place.name} のリールを開く`}
      onClick={() => onOpen(place)}
    >
      {hasPhoto ? (
        // 全レイヤーを重ねて opacity でクロスフェード
        images.map((url, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`${url}-${i}`}
            src={url}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            className="kt-reel-card-bg"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: "opacity .8s ease",
            }}
          />
        ))
      ) : (
        <>
          <div className="kt-reel-card-bg" style={{ background: bg }} aria-hidden />
          <div
            className="ka-reel-icon"
            aria-hidden
            style={{
              position: "absolute",
              top: "32%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.35,
              zIndex: 1,
            }}
          >
            {PLACE_CATEGORY_ICON[place.thumbVariant]}
          </div>
        </>
      )}
      <div className="kt-reel-card-overlay" aria-hidden />

      {/* 複数枚あれば下部に小さな進捗ドット */}
      {images.length > 1 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 4,
            zIndex: 2,
          }}
        >
          {images.map((_, i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 16,
                height: 2,
                borderRadius: 1,
                background: i === idx ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.35)",
                transition: "background .3s",
              }}
            />
          ))}
        </div>
      )}

      <div className="kt-reel-card-top">
        <PlaceBadge type={place.badgeType} />
        <DemoBadge />
      </div>

      <div className="kt-reel-card-bottom">
        <div
          style={{
            fontSize: 9.5,
            color: "rgba(255,255,255,.85)",
            letterSpacing: ".08em",
            marginBottom: 4,
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            textShadow: "0 1px 4px rgba(0,0,0,.3)",
          }}
        >
          {place.stage}
        </div>
        <div
          className="kt-reel-catchphrase"
          style={{ marginBottom: 6 }}
        >
          {place.name}
        </div>
        <div className="kt-reel-meta" style={{ marginBottom: 4 }}>
          {place.location}
        </div>
        <div
          className="kt-reel-rating"
          aria-label={`平均評価 ${place.rating.toFixed(1)}、レビュー ${place.reviewCount}件`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span aria-hidden="true">
            {place.rating.toFixed(1)} ({place.reviewCount})
          </span>
        </div>
      </div>
    </button>
  );
}
