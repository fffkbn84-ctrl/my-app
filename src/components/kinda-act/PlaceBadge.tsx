import type { BadgeType } from "@/lib/mock/places-home";

const BADGE_INFO: Record<
  Exclude<BadgeType, "listed">,
  { label: string; color: string }
> = {
  certified: { label: "取材済み", color: "#B89A4A" },
  agency: { label: "相談所おすすめ", color: "#5A7FAF" },
};

export default function PlaceBadge({ type }: { type: BadgeType }) {
  if (type === "listed") return null;
  const info = BADGE_INFO[type];
  return (
    <span className="ka-place-badge">
      <span className="ka-place-badge-dot" style={{ background: info.color }} />
      {info.label}
    </span>
  );
}
