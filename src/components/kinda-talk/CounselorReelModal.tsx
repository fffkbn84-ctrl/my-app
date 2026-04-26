"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Counselor } from "@/lib/data";
import { KindaTypeKey } from "@/lib/kinda-types";
import { useFavorites } from "@/hooks/useFavorites";
import KindaTypeBadge from "./KindaTypeBadge";
import ShareSheet from "./ShareSheet";

type Props = {
  counselor: Counselor | null;
  onClose: () => void;
};

const NULL_ID = "__none__";

export default function CounselorReelModal({ counselor, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [demoNoticeOpen, setDemoNoticeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hooks は top-level で呼ぶ必要があるため、counselor が null の時は
  // sentinel ID を渡して effect 側で reflect させない
  const { saved: favored, toggle: toggleFavorite } = useFavorites(
    "counselor",
    counselor?.id ?? NULL_ID,
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (counselor) {
      setImgIndex(0);
      setShareOpen(false);
      setDemoNoticeOpen(false);
    }
  }, [counselor]);

  useEffect(() => {
    if (!counselor) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImgIndex((i) => Math.min(i + 1, (counselor.reelImages?.length ?? 1) - 1));
      if (e.key === "ArrowLeft") setImgIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [counselor, onClose]);

  const handlePrev = useCallback(() => setImgIndex((i) => Math.max(0, i - 1)), []);
  const handleNext = useCallback(() => {
    if (!counselor) return;
    const max = (counselor.reelImages?.length ?? 1) - 1;
    setImgIndex((i) => Math.min(i + 1, max));
  }, [counselor]);

  const toggleFav = () => {
    if (!counselor) return;
    if (counselor.isDemo) {
      setDemoNoticeOpen(true);
      return;
    }
    toggleFavorite();
  };

  const handleBook = () => {
    if (!counselor) return;
    if (counselor.isDemo) {
      setDemoNoticeOpen(true);
      return;
    }
    window.location.href = `/booking/${counselor.id}`;
  };

  if (!mounted) return null;

  const images = counselor?.reelImages ?? [];
  const currentImage = images[imgIndex];
  const matchingTypes = (counselor?.matchingTypes ?? []) as KindaTypeKey[];
  const shareUrl = counselor
    ? typeof window !== "undefined"
      ? `${window.location.origin}/counselors/${counselor.id}`
      : `/counselors/${counselor.id}`
    : "";

  return createPortal(
    <AnimatePresence>
      {counselor && (
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
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="kt-reel-modal-progress" aria-hidden>
              {images.map((_, i) => (
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
                style={{ background: currentImage?.bg ?? counselor.gradient }}
              />
            </div>

            <div className="kt-reel-modal-tap-zone is-left" onClick={handlePrev} aria-hidden />
            <div className="kt-reel-modal-tap-zone is-right" onClick={handleNext} aria-hidden />

            <div className="kt-reel-modal-actions">
              <button
                type="button"
                className={`kt-reel-modal-action ${favored ? "is-active" : ""}`}
                onClick={toggleFav}
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
                  if (counselor.isDemo) {
                    setDemoNoticeOpen(true);
                    return;
                  }
                  window.location.href = `/counselors/${counselor.id}#reviews`;
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
                {matchingTypes.slice(0, 2).map((t, i) => (
                  <KindaTypeBadge key={t} type={t} manual={i === 1} />
                ))}
              </div>
              <div className="kt-reel-modal-catchphrase">
                {currentImage?.caption ?? counselor.catchphrase ?? counselor.message}
              </div>
              <div className="kt-reel-modal-name">
                {counselor.name}
                {counselor.isDemo && (
                  <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.7 }}>サンプル</span>
                )}
              </div>
              <div className="kt-reel-modal-meta">
                {counselor.agencyName} · {counselor.area} · ★{counselor.rating.toFixed(1)} ({counselor.reviewCount})
              </div>

              <div className="kt-reel-modal-cta-row">
                <Link
                  href={`/counselors/${counselor.id}`}
                  className="kt-reel-modal-cta is-secondary"
                  onClick={(e) => {
                    if (counselor.isDemo) {
                      e.preventDefault();
                      setDemoNoticeOpen(true);
                    }
                  }}
                >
                  プロフィールを見る
                </Link>
                <button type="button" className="kt-reel-modal-cta is-primary" onClick={handleBook}>
                  予約する
                </button>
              </div>
            </div>
          </motion.div>

          {shareOpen && (
            <ShareSheet
              url={shareUrl}
              title={`${counselor.name} ${counselor.agencyName} | Kinda ふたりへ`}
              onClose={() => setShareOpen(false)}
            />
          )}

          {demoNoticeOpen && (
            <div
              className="kt-demo-modal-overlay"
              onClick={() => setDemoNoticeOpen(false)}
              role="presentation"
            >
              <div className="kt-demo-modal" onClick={(e) => e.stopPropagation()}>
                <div className="kt-demo-modal-title">これはサンプル表示です</div>
                <div className="kt-demo-modal-text">
                  Kinda talk に実際に掲載されているカウンセラーではありません。
                  <br />
                  <br />
                  掲載をご検討の相談所さまへ：このフォームからお問い合わせください。
                </div>
                <button
                  type="button"
                  className="kt-reel-modal-cta is-primary"
                  style={{ width: "100%" }}
                  onClick={() => setDemoNoticeOpen(false)}
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
