"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import {
  placesHomeData,
  placeTabs,
  type PlaceHome,
  type PlaceTabCategory,
  type ThumbVariant,
} from "@/lib/mock/places-home";

/* ────────────────────────────────────────────────────────────
   サムネイル — グラデーション + SVGアイコン
──────────────────────────────────────────────────────────── */
function PlaceThumb({ variant }: { variant: ThumbVariant }) {
  const gradientClass: Record<ThumbVariant, string> = {
    cafe:           "pt-cafe",
    lounge:         "pt-rest",
    hair:           "pt-hair",
    "photo-studio": "pt-photo",
  };

  const icons: Record<ThumbVariant, ReactNode> = {
    cafe: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path
          d="M10 20h24l-2.5 18H12.5L10 20z"
          stroke="#C8A97A"
          strokeWidth="1.5"
          fill="rgba(200,169,122,.1)"
          strokeLinejoin="round"
        />
        <path d="M34 24h3a3.5 3.5 0 010 7h-3" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M16 15c0-2.5 3-2.5 3-5M22 15c0-2.5 3-2.5 3-5"
          stroke="#C8A97A"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity=".5"
        />
      </svg>
    ),
    lounge: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="14" stroke="#C4877A" strokeWidth="1.5" fill="rgba(196,135,122,.1)" />
        <path d="M18 32c2 3 14 3 16 0" stroke="#C4877A" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="24" r="2" fill="#C4877A" opacity=".5" />
        <circle cx="31" cy="24" r="2" fill="#C4877A" opacity=".5" />
      </svg>
    ),
    hair: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="18" cy="18" r="7" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.1)" />
        <circle cx="18" cy="34" r="7" stroke="#7A9E87" strokeWidth="1.5" fill="rgba(122,158,135,.1)" />
        <path d="M23 21l14-8M23 31l14 8" stroke="#7A9E87" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    "photo-studio": (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="8" y="16" width="36" height="26" rx="3" stroke="#6B8FBF" strokeWidth="1.5" fill="rgba(107,143,191,.1)" />
        <circle cx="26" cy="29" r="7" stroke="#6B8FBF" strokeWidth="1.5" fill="none" />
        <path d="M19 16l3-5h8l3 5" stroke="#6B8FBF" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="38" cy="23" r="2" fill="#6B8FBF" opacity=".5" />
      </svg>
    ),
  };

  return (
    <div className={`place-thumb ${gradientClass[variant]}`}>
      {icons[variant]}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   バッジ
──────────────────────────────────────────────────────────── */
function PlaceBadge({ type }: { type: PlaceHome["badgeType"] }) {
  const map = {
    certified: { cls: "rt-certified", label: "取材済み" },
    agency:    { cls: "rt-agency",    label: "相談所おすすめ" },
    listed:    { cls: "rt-listed",    label: "掲載店" },
  } as const;
  const { cls, label } = map[type];
  return <span className={`pt-review-type ${cls}`}>{label}</span>;
}

/* ────────────────────────────────────────────────────────────
   星評価
──────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="pt-stars">
      {[1, 2, 3, 4, 5].map((n) => (n <= rating ? "★" : "☆")).join("")}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   PlacesSection
──────────────────────────────────────────────────────────── */
export default function PlacesSection() {
  const [activeTab, setActiveTab] = useState<PlaceTabCategory>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const filtered =
    activeTab === "all"
      ? placesHomeData
      : placesHomeData.filter((p) => p.category === activeTab);

  /* ドラッグスクロール */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft.current - (x - startX.current);
    };
    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <section className="places-sec" id="places">
      <div className="places-inner">
        <div className="sec-label">selected places</div>
        <h2 className="sec-h">
          ふたりへが選んだお店
          <span className="sec-h-jp">
            取材済み・相談所おすすめ・口コミで集まったお店を掲載しています
          </span>
        </h2>
        <p className="sec-sub" style={{ marginBottom: 0 }}>
          運営が現地取材したお店、相談所・カウンセラーが推薦するお店を中心に掲載しています。口コミは利用後なら誰でも書けます。
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20, marginBottom: 32 }}>
          <span className="pt-review-type rt-certified" style={{ fontSize: 10, padding: "5px 12px" }}>
            ふたりへ取材済み
          </span>
          <span className="pt-review-type rt-agency" style={{ fontSize: 10, padding: "5px 12px" }}>
            相談所おすすめ
          </span>
          <span className="pt-review-type rt-listed" style={{ fontSize: 10, padding: "5px 12px" }}>
            掲載店
          </span>
        </div>
        <div className="place-tabs">
          {placeTabs.map((tab) => (
            <button
              key={tab.value}
              className={`pt-btn${activeTab === tab.value ? " on" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="places-scroll" ref={scrollRef} id="pScroll">
        <div className="places-track">
          {filtered.map((place) => (
            <div key={place.id} className="place-card">
              <PlaceThumb variant={place.thumbVariant} />
              <div className="pt-body">
                <div className="pt-stage">{place.stage}</div>
                <div className="pt-name">{place.name}</div>
                <div className="pt-loc">📍 {place.location}</div>
                <div className="pt-bottom">
                  <div className="pt-rating">
                    <Stars rating={place.rating} />
                    <span className="pt-cnt">口コミ {place.reviewCount}件</span>
                  </div>
                  <PlaceBadge type={place.badgeType} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
