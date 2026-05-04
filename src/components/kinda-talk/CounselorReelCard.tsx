"use client";

import { Counselor } from "@/lib/data";
import { KindaTypeKey } from "@/lib/kinda-types";
import { trackEvent } from "@/lib/analytics";
import KindaTypeBadge from "./KindaTypeBadge";
import DemoBadge from "./DemoBadge";

type Props = {
  counselor: Counselor;
  onOpen: (counselor: Counselor) => void;
  sourcePage?: string;
};

export default function CounselorReelCard({ counselor, onOpen, sourcePage = "kinda_talk" }: Props) {
  const cover = counselor.reelImages?.[0];
  const bg = cover?.bg ?? counselor.gradient;
  const catchphrase = counselor.catchphrase ?? counselor.message;
  const matchingTypes = (counselor.matchingTypes ?? []) as KindaTypeKey[];

  return (
    <button
      type="button"
      className="kt-reel-card"
      aria-label={`${counselor.name}のリールを開く`}
      onClick={() => {
        trackEvent("counselor_card_click", {
          counselor_id: String(counselor.id),
          source_page: sourcePage,
        });
        onOpen(counselor);
      }}
    >
      <div className="kt-reel-card-bg" style={{ background: bg }} aria-hidden />
      <div className="kt-reel-card-overlay" aria-hidden />

      <div className="kt-reel-card-top">
        <div className="kt-reel-card-types">
          {matchingTypes.slice(0, 2).map((t, i) => (
            <KindaTypeBadge key={t} type={t} manual={i === 1} />
          ))}
        </div>
        {counselor.isDemo && <DemoBadge />}
      </div>

      <div className="kt-reel-card-bottom">
        <div className="kt-reel-catchphrase">{catchphrase}</div>
        <div className="kt-reel-name">{counselor.name}</div>
        <div className="kt-reel-meta">
          {counselor.agencyName} · {counselor.area}
        </div>
        <div
          className="kt-reel-rating"
          aria-label={`平均評価 ${counselor.rating.toFixed(1)}、レビュー ${counselor.reviewCount}件`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span aria-hidden="true">{counselor.rating.toFixed(1)} ({counselor.reviewCount})</span>
        </div>
      </div>
    </button>
  );
}
