"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    nail:           "pt-nail",
    brow:           "pt-brow",
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
    nail: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="16" y="14" width="20" height="26" rx="4" stroke="#B88FC8" strokeWidth="1.5" fill="rgba(184,143,200,.1)" />
        <path d="M20 22h12M20 28h8" stroke="#B88FC8" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      </svg>
    ),
    brow: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M14 24c4-4 10-4 14-2s10 3 14-1" stroke="#A89878" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M14 30c4-4 10-4 14-2s10 3 14-1" stroke="#A89878" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".4" />
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
  if (type === "listed") return null;
  const map = {
    certified: { cls: "rt-certified", label: "取材済み" },
    agency:    { cls: "rt-agency",    label: "相談所おすすめ" },
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PlaceTabCategory>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

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
      dragDistance.current = 0;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const delta = x - startX.current;
      dragDistance.current = Math.abs(delta);
      el.scrollLeft = scrollLeft.current - delta;
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
            取材済み・相談所おすすめのお店を掲載しています
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
            <div
              key={place.id}
              className="place-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (dragDistance.current > 6) return;
                router.push(`/places/${place.id}`);
              }}
            >
              <PlaceThumb variant={place.thumbVariant} />
              <div className="pt-body">
                <div className="pt-stage">{place.stage}</div>
                <div className="pt-name">{place.name}</div>
                <div className="pt-loc" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                    <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5S11.5 9.5 11.5 6c0-2.5-2-4.5-4.5-4.5z" />
                    <circle cx="7" cy="6" r="1.5" />
                  </svg>
                  {place.location}
                </div>
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

      <div className="places-inner" style={{ paddingTop: 32, paddingBottom: 0 }}>
        <div style={{ textAlign: "center" }}>
          <Link href="/shops" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            すべて見る
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
