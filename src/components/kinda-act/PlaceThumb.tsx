import type { ReactNode } from "react";
import type { ThumbVariant } from "@/lib/mock/places-home";

const GRADIENT_CLASS: Record<ThumbVariant, string> = {
  cafe: "ka-thumb-cafe",
  lounge: "ka-thumb-rest",
  hair: "ka-thumb-hair",
  nail: "ka-thumb-nail",
  brow: "ka-thumb-brow",
  "photo-studio": "ka-thumb-photo",
};

const ICONS: Record<ThumbVariant, ReactNode> = {
  cafe: (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M10 20h24l-2.5 18H12.5L10 20z" stroke="#B86E68" strokeWidth="1.5" fill="rgba(184,110,104,.1)" strokeLinejoin="round" />
      <path d="M34 24h3a3.5 3.5 0 010 7h-3" stroke="#B86E68" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 15c0-2.5 3-2.5 3-5M22 15c0-2.5 3-2.5 3-5" stroke="#B86E68" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
    </svg>
  ),
  lounge: (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="14" stroke="#B86E68" strokeWidth="1.5" fill="rgba(184,110,104,.1)" />
      <path d="M18 32c2 3 14 3 16 0" stroke="#B86E68" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21" cy="24" r="2" fill="#B86E68" opacity=".5" />
      <circle cx="31" cy="24" r="2" fill="#B86E68" opacity=".5" />
    </svg>
  ),
  hair: (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="7" stroke="#5A8050" strokeWidth="1.5" fill="rgba(90,128,80,.1)" />
      <circle cx="18" cy="34" r="7" stroke="#5A8050" strokeWidth="1.5" fill="rgba(90,128,80,.1)" />
      <path d="M23 21l14-8M23 31l14 8" stroke="#5A8050" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  nail: (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect x="16" y="14" width="20" height="26" rx="4" stroke="#8A66B0" strokeWidth="1.5" fill="rgba(138,102,176,.1)" />
      <path d="M20 22h12M20 28h8" stroke="#8A66B0" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      <circle cx="26" cy="36" r="2" fill="#8A66B0" />
    </svg>
  ),
  brow: (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M14 22c4-6 20-6 24 0" stroke="#B89A4A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M14 32c4-3 20-3 24 0" stroke="#B89A4A" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  ),
  "photo-studio": (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect x="10" y="16" width="32" height="22" rx="3" stroke="#5A7FAF" strokeWidth="1.5" fill="rgba(90,127,175,.1)" />
      <circle cx="26" cy="27" r="6" stroke="#5A7FAF" strokeWidth="1.5" />
      <rect x="14" y="13" width="8" height="3" rx="1" fill="#5A7FAF" opacity=".5" />
    </svg>
  ),
};

export default function PlaceThumb({ variant }: { variant: ThumbVariant }) {
  return (
    <div className={`ka-card-thumb ${GRADIENT_CLASS[variant]}`}>
      <div className="ka-card-thumb-overlay">{ICONS[variant]}</div>
    </div>
  );
}

export function getPlaceThumbGradientClass(variant: ThumbVariant): string {
  return GRADIENT_CLASS[variant];
}
