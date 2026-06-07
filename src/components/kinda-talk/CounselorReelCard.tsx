"use client";

import { Counselor, isNewShop, isCounselorCampaignActive } from "@/lib/data";
import { KindaTypeKey } from "@/lib/kinda-types";
import { trackEvent } from "@/lib/analytics";
import KindaTypeBadge from "./KindaTypeBadge";
import DemoBadge from "./DemoBadge";
import NewBadge from "./NewBadge";

type Props = {
  counselor: Counselor;
  onOpen: (counselor: Counselor) => void;
  sourcePage?: string;
};

export default function CounselorReelCard({ counselor, onOpen, sourcePage = "kinda_talk" }: Props) {
  const cover = counselor.reelImages?.[0];
  // bg は url() か linear-gradient() の文字列。background shorthand を使うと
  // CSS 側の background-size: cover が上書きされて画像が原寸表示されるため、
  // backgroundImage に分離して渡す。
  const bgImage = cover?.bg ?? counselor.gradient;
  const catchphrase = counselor.catchphrase ?? counselor.message;
  const matchingTypes = (counselor.matchingTypes ?? []) as KindaTypeKey[];
  const showAgencyNewShop = isNewShop(counselor.agencyFoundedAt);

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
      <div className="kt-reel-card-bg" style={{ backgroundImage: bgImage }} aria-hidden />
      <div className="kt-reel-card-overlay" aria-hidden />

      <div className="kt-reel-card-top">
        <div className="kt-reel-card-types">
          {matchingTypes.slice(0, 2).map((t, i) => (
            <KindaTypeBadge key={t} type={t} manual={i === 1} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {showAgencyNewShop && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 9,
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: ".12em",
                fontWeight: 500,
                padding: "2px 7px",
                borderRadius: 20,
                background: "rgba(255,255,255,.92)",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
              title="所属相談所が創業から1年以内"
            >
              新店舗
            </span>
          )}
          {/* 経験年数 1 年未満は「新人」を自動付与（サンプルとは独立したフラグ）*/}
          {counselor.experience < 1 && <NewBadge />}
          {counselor.isDemo && <DemoBadge />}
        </div>
      </div>

      <div className="kt-reel-card-bottom">
        {/* カウンセラー個別キャンペーンバッジ（任意） — campaignLabel は有効期限切れなら非表示。
            旧 campaign 文字列（モック・期限なし）はそのまま表示 */}
        {(counselor.campaignLabel
          ? isCounselorCampaignActive(counselor.campaignLabel, counselor.campaignExpiry)
          : !!counselor.campaign) && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 9px",
              borderRadius: 20,
              background: "rgba(200,169,122,.92)",
              color: "#fff",
              fontSize: 10,
              fontFamily: "Noto Sans JP, sans-serif",
              fontWeight: 500,
              letterSpacing: ".04em",
              marginBottom: 6,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(200,169,122,.35)",
            }}
            title={
              counselor.campaignDetail ??
              counselor.campaignLabel ??
              counselor.campaign ??
              ""
            }
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.1 3.4H10L7.5 6.6l.9 3L6 8.1l-2.4 1.5.9-3L2 5.4h2.9z" fill="currentColor" />
            </svg>
            {counselor.campaignLabel ?? counselor.campaign}
          </div>
        )}
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
