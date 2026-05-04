import type { ReactNode } from "react";
import type { ThumbVariant } from "@/lib/mock/places-home";

/**
 * カテゴリ別の SVG アイコン。
 * - PlaceThumb（横長カード用）と PlaceReelCard（9:16 リール用）の両方で使用
 */
export const PLACE_CATEGORY_ICON: Record<ThumbVariant, ReactNode> = {
  cafe: (
    <svg width="120" height="120" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path
        d="M10 20h24l-2.5 18H12.5L10 20z"
        stroke="#fff"
        strokeWidth="1.6"
        fill="rgba(255,255,255,.15)"
        strokeLinejoin="round"
      />
      <path d="M34 24h3a3.5 3.5 0 010 7h-3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M16 15c0-2.5 3-2.5 3-5M22 15c0-2.5 3-2.5 3-5"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity=".8"
      />
    </svg>
  ),
  lounge: (
    <svg width="120" height="120" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="14" stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,.15)" />
      <path d="M18 32c2 3 14 3 16 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="21" cy="24" r="2" fill="#fff" opacity=".8" />
      <circle cx="31" cy="24" r="2" fill="#fff" opacity=".8" />
    </svg>
  ),
  hair: (
    <svg width="120" height="120" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="7" stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,.15)" />
      <circle cx="18" cy="34" r="7" stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,.15)" />
      <path d="M23 21l14-8M23 31l14 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  nail: (
    <svg width="120" height="120" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect x="16" y="14" width="20" height="26" rx="4" stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,.15)" />
      <path d="M20 22h12M20 28h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
      <circle cx="26" cy="36" r="2" fill="#fff" />
    </svg>
  ),
  brow: (
    <svg width="120" height="120" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M14 22c4-6 20-6 24 0" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path
        d="M14 32c4-3 20-3 24 0"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity=".8"
      />
    </svg>
  ),
  "photo-studio": (
    <svg width="120" height="120" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect x="10" y="16" width="32" height="22" rx="3" stroke="#fff" strokeWidth="1.6" fill="rgba(255,255,255,.15)" />
      <circle cx="26" cy="27" r="6" stroke="#fff" strokeWidth="1.6" />
      <rect x="14" y="13" width="8" height="3" rx="1" fill="#fff" opacity=".8" />
    </svg>
  ),
};
