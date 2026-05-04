"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import type { PlaceHome } from "@/lib/mock/places-home";
import { useFavorites } from "@/hooks/useFavorites";
import { PLACE_CATEGORY_ICON } from "./placeIcons";
import PlaceBadge from "./PlaceBadge";
import DemoBadge from "@/components/kinda-talk/DemoBadge";
import ShareSheet from "@/components/kinda-talk/ShareSheet";

type Props = {
  place: PlaceHome | null;
  onClose: () => void;
};

const NULL_ID = "__none__";

/** お店のリール画像 — 現状はカテゴリ別グラデ + キャプション。将来は実写画像に差し替え。 */
function getReelSlides(place: PlaceHome) {
  const baseGrad: Record<string, string[]> = {
    cafe: [
      "linear-gradient(135deg,#FAEAE5,#F0D8D0)",
      "linear-gradient(160deg,#F0E5D6,#E0D0BC)",
      "linear-gradient(135deg,#FAF3DE,#F4E8C4)",
    ],
    lounge: [
      "linear-gradient(135deg,#F5E5E1,#ECC8C5)",
      "linear-gradient(160deg,#FAEAE5,#F0D8D0)",
      "linear-gradient(135deg,#E8D8EE,#D4C0E2)",
    ],
    hair: [
      "linear-gradient(135deg,#E8F4E4,#C8E0C0)",
      "linear-gradient(160deg,#FAEAE5,#F0D8D0)",
    ],
    nail: [
      "linear-gradient(135deg,#EDE0F4,#DCC5E8)",
      "linear-gradient(160deg,#F5E5E1,#ECC8C5)",
    ],
    brow: [
      "linear-gradient(135deg,#FAF3DE,#F4E8C4)",
      "linear-gradient(160deg,#FAEAE5,#F0D8D0)",
    ],
    "photo-studio": [
      "linear-gradient(135deg,#E0ECF8,#C4D8EC)",
      "linear-gradient(160deg,#EDE0F4,#DCC5E8)",
    ],
  };

  const grads = baseGrad[place.thumbVariant] ?? ["linear-gradient(135deg,#FAEAE5,#F0D8D0)"];
  const captions = [place.name, place.stage, place.features?.[0] ?? place.description.slice(0, 24)];

  return grads.map((bg, i) => ({
    bg,
    caption: captions[i] ?? place.name,
  }));
}

export default function PlaceReelModal({ place, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const { saved: favored, toggle: toggleFavorite } = useFavorites(
    "place",
    place?.id ?? NULL_ID,
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (place) {
      setImgIndex(0);
      setShareOpen(false);
    }
  }, [place]);

  useEffect(() => {
    if (!place) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 100);
    const slides = getReelSlides(place);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImgIndex((i) => Math.min(i + 1, slides.length - 1));
      if (e.key === "ArrowLeft") setImgIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [place, onClose]);

  const slides = place ? getReelSlides(place) : [];

  const handlePrev = useCallback(() => setImgIndex((i) => Math.max(0, i - 1)), []);
  const handleNext = useCallback(() => {
    setImgIndex((i) => Math.min(i + 1, slides.length - 1));
  }, [slides.length]);

  if (!mounted) return null;

  const currentSlide = slides[imgIndex];
  const shareUrl = place
    ? typeof window !== "undefined"
      ? `${window.location.origin}/places/${place.id}`
      : `/places/${place.id}`
    : "";

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {place && (
          <motion.div
            className="kt-reel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <motion.div
              className="kt-reel-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`ka-reel-title-${place.id}`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="kt-reel-modal-progress" aria-hidden>
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`kt-reel-modal-progress-seg ${
                      i < imgIndex ? "is-done" : i === imgIndex ? "is-current" : ""
                    }`}
                  >
                    <div className="kt-reel-modal-progress-fill" />
                  </div>
                ))}
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="kt-reel-modal-close"
                onClick={onClose}
                aria-label="閉じる"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="kt-reel-modal-stage">
                <div
                  className="kt-reel-modal-image"
                  style={{ background: currentSlide?.bg ?? "" }}
                />
                {/* カテゴリアイコンを薄くオーバーレイ */}
                <div
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
              </div>

              <div className="kt-reel-modal-tap-zone is-left" onClick={handlePrev} aria-hidden />
              <div className="kt-reel-modal-tap-zone is-right" onClick={handleNext} aria-hidden />

              <div className="kt-reel-modal-actions">
                <button
                  type="button"
                  className={`kt-reel-modal-action ${favored ? "is-active" : ""}`}
                  onClick={toggleFavorite}
                  aria-label="気になる"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favored ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="kt-reel-modal-action"
                  onClick={() => {
                    window.location.href = `/places/${place.id}#reviews`;
                  }}
                  aria-label="口コミを見る"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="kt-reel-modal-action"
                  onClick={() => setShareOpen(true)}
                  aria-label="共有"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>

              <div className="kt-reel-modal-bottom">
                <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                  <PlaceBadge type={place.badgeType} />
                  <DemoBadge />
                </div>
                <div className="kt-reel-modal-catchphrase" id={`ka-reel-title-${place.id}`}>
                  {currentSlide?.caption ?? place.name}
                </div>
                <div className="kt-reel-modal-name">{place.name}</div>
                <div className="kt-reel-modal-meta">
                  {place.stage} · {place.location} · ★{place.rating.toFixed(1)} ({place.reviewCount})
                </div>

                <div className="kt-reel-modal-cta-row">
                  <Link
                    href={`/places/${place.id}`}
                    className="kt-reel-modal-cta is-secondary"
                  >
                    詳細を見る
                  </Link>
                  <Link
                    href={`/places/${place.id}#reviews`}
                    className="kt-reel-modal-cta is-primary"
                  >
                    口コミを見る
                  </Link>
                </div>
              </div>
            </motion.div>

            {shareOpen && (
              <ShareSheet
                url={shareUrl}
                title={`${place.name} | Kinda ふたりへ`}
                onClose={() => setShareOpen(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
