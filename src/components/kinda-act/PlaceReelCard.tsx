"use client";

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

type Props = {
  place: PlaceHome;
  onOpen: (place: PlaceHome) => void;
};

export default function PlaceReelCard({ place, onOpen }: Props) {
  const bg = GRADIENT_BG[place.thumbVariant] ?? "linear-gradient(135deg,#FAEAE5,#F0D8D0)";

  return (
    <button
      type="button"
      className="kt-reel-card"
      aria-label={`${place.name} のリールを開く`}
      onClick={() => onOpen(place)}
    >
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
      <div className="kt-reel-card-overlay" aria-hidden />

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
