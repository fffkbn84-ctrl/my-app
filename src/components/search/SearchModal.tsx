"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  background: "var(--white)",
  border: "1px solid var(--light)",
  borderRadius: 12,
  padding: "0 12px",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  color: "var(--ink)",
  outline: "none",
  cursor: "pointer",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  background: "var(--white)",
  border: "1px solid var(--light)",
  borderRadius: 12,
  padding: "0 12px",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  color: "var(--ink)",
  outline: "none",
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"counselor" | "place">("counselor");

  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [keyword, setKeyword] = useState("");

  const [placeArea, setPlaceArea] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [placeKeyword, setPlaceKeyword] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSearch = () => {
    if (activeTab === "counselor") {
      const params = new URLSearchParams();
      if (area) params.set("area", area);
      if (price) params.set("price", price);
      if (keyword) params.set("keyword", keyword);
      const qs = params.toString();
      router.push(`/kinda-talk${qs ? `?${qs}` : ""}`);
    } else {
      const params = new URLSearchParams();
      if (placeArea) params.set("area", placeArea);
      if (atmosphere) params.set("atmosphere", atmosphere);
      if (placeKeyword) params.set("keyword", placeKeyword);
      const qs = params.toString();
      router.push(`/kinda-meet${qs ? `?${qs}` : ""}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FEFCFA",
          borderRadius: "24px 24px 0 0",
          padding: "24px 24px calc(48px + env(safe-area-inset-bottom))",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <button
            onClick={onClose}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--pale)",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              color: "var(--mid)",
            }}
            aria-label="閉じる"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: 22,
            color: "var(--ink)",
            textAlign: "center",
            marginBottom: 24,
            letterSpacing: ".05em",
          }}
        >
          なにをさがしますか？
        </h2>

        {/* Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            marginBottom: 28,
            background: "var(--pale)",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {(
            [
              ["counselor", "結婚相談所"],
              ["place", "お見合いの場所"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 8px",
                borderRadius: 10,
                border: "none",
                background: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "white" : "var(--mid)",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                cursor: "pointer",
                transition: "all .2s",
                letterSpacing: ".03em",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Fields */}
        {activeTab === "counselor" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--mid)", display: "block", marginBottom: 8 }}>
                エリア
              </label>
              <select value={area} onChange={(e) => setArea(e.target.value)} style={selectStyle}>
                <option value="">すべて</option>
                <option value="tokyo">東京都</option>
                <option value="kanagawa">神奈川県</option>
                <option value="chiba">千葉県</option>
                <option value="saitama">埼玉県</option>
                <option value="osaka">大阪府</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--mid)", display: "block", marginBottom: 8 }}>
                価格
              </label>
              <select value={price} onChange={(e) => setPrice(e.target.value)} style={selectStyle}>
                <option value="">すべて</option>
                <option value="low">〜20,000円</option>
                <option value="mid">20,000〜30,000円</option>
                <option value="high">30,000円〜</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--mid)", display: "block", marginBottom: 8 }}>
                キーワード
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="相談所名、カウンセラー名など"
                style={inputStyle}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--mid)", display: "block", marginBottom: 8 }}>
                エリア
              </label>
              <select value={placeArea} onChange={(e) => setPlaceArea(e.target.value)} style={selectStyle}>
                <option value="">すべて</option>
                <option value="tokyo">東京都</option>
                <option value="kanagawa">神奈川県</option>
                <option value="chiba">千葉県</option>
                <option value="saitama">埼玉県</option>
                <option value="osaka">大阪府</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--mid)", display: "block", marginBottom: 8 }}>
                雰囲気
              </label>
              <select
                value={atmosphere}
                onChange={(e) => setAtmosphere(e.target.value)}
                style={selectStyle}
              >
                <option value="">すべて</option>
                <option value="semi-private">半個室</option>
                <option value="quiet">静か</option>
                <option value="lively">にぎやか</option>
                <option value="private">個室</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--mid)", display: "block", marginBottom: 8 }}>
                キーワード
              </label>
              <input
                type="text"
                value={placeKeyword}
                onChange={(e) => setPlaceKeyword(e.target.value)}
                placeholder="店名、エリア、雰囲気など"
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Search button */}
        <button
          onClick={handleSearch}
          style={{
            marginTop: 24,
            width: "100%",
            height: 48,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 999,
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          さがす
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 9h12M9 3l6 6-6 6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
