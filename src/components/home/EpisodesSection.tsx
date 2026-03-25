import Link from "next/link";
import type { ReactNode } from "react";
import { episodesData, type Episode, type EpisodeThumbVariant } from "@/lib/mock/episodes";

/* ────────────────────────────────────────────────────────────
   サムネイル — グラデーション + SVGアイコン
──────────────────────────────────────────────────────────── */
function EpisodeThumb({
  variant,
  featured,
}: {
  variant: EpisodeThumbVariant;
  featured?: boolean;
}) {
  const gradientClass: Record<EpisodeThumbVariant, string> = {
    warm:  "et-1",
    cool:  "et-2",
    green: "et-3",
  };

  const icons: Record<EpisodeThumbVariant, ReactNode> = {
    warm: (
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
        <circle cx="26" cy="35" r="18" stroke="#C8A97A" strokeWidth="2" fill="rgba(200,169,122,.1)" />
        <circle cx="44" cy="35" r="18" stroke="#B8956A" strokeWidth="2" fill="rgba(184,149,106,.08)" />
      </svg>
    ),
    cool: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <circle cx="18" cy="25" r="13" stroke="#6B8FBF" strokeWidth="1.8" fill="rgba(107,143,191,.1)" />
        <circle cx="32" cy="25" r="13" stroke="#5A7EAF" strokeWidth="1.8" fill="rgba(90,126,175,.08)" />
      </svg>
    ),
    green: (
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <circle cx="18" cy="25" r="13" stroke="#7A9E87" strokeWidth="1.8" fill="rgba(122,158,135,.1)" />
        <circle cx="32" cy="25" r="13" stroke="#6A8E77" strokeWidth="1.8" fill="rgba(106,142,119,.08)" />
      </svg>
    ),
  };

  return (
    <div className={`ep-thumb ${gradientClass[variant]}`} style={featured ? { height: 240 } : undefined}>
      {icons[variant]}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   カップルアバター
──────────────────────────────────────────────────────────── */
const avatarColors: Record<EpisodeThumbVariant, [string, string]> = {
  warm:  ["#C8A97A", "#7A9E87"],
  cool:  ["#9B7AB5", "#6B8FBF"],
  green: ["#7A9E87", "#C8A97A"],
};

function CoupleAvatars({ variant }: { variant: EpisodeThumbVariant }) {
  const [c1, c2] = avatarColors[variant];
  return (
    <div className="ep-avs">
      {[c1, c2].map((color, i) => (
        <div key={i} className="ep-av">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="4" r="2.5" fill={color} opacity=".6" />
            <path d="M1 11c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke={color} strokeWidth="1" fill="none" opacity=".4" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   矢印アイコン
──────────────────────────────────────────────────────────── */
function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 5.5h7M5.5 2l3.5 3.5L5.5 9" stroke="#C8A97A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   エピソードカード
──────────────────────────────────────────────────────────── */
function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <div className={`ep-card${episode.featured ? " ep-card-ft" : ""}`}>
      <EpisodeThumb variant={episode.thumbVariant} featured={episode.featured} />
      <div className="ep-body">
        <div className="ep-tag-row">
          <span className="ep-atag">{episode.agencyName}</span>
          <span className="ep-period">{episode.period}</span>
        </div>
        <div className="ep-title">{episode.title}</div>
        {episode.excerpt && (
          <div className="ep-excerpt">{episode.excerpt}</div>
        )}
        <div className="ep-footer">
          <div className="ep-couple">
            <CoupleAvatars variant={episode.thumbVariant} />
            <span className="ep-couple-l">{episode.coupleLabel}</span>
          </div>
          <Link href={episode.agencyHref} className="ep-link">
            相談所を見る <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   EpisodesSection
──────────────────────────────────────────────────────────── */
export default function EpisodesSection() {
  return (
    <section className="ep-sec" id="episodes">
      <div className="ep-inner">
        <div className="sec-label">success stories</div>
        <h2 className="sec-h">
          ここから始まった、ふたり。
          <span className="sec-h-jp">相談所を通じて結ばれた方々のエピソード</span>
        </h2>
        <div className="ep-grid">
          {episodesData.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </section>
  );
}
