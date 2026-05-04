"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DIAGNOSIS_TYPES, type DiagnosisTypeId } from "@/lib/diagnosis";
import Link from "next/link";

const DIAGNOSIS_KEYS: DiagnosisTypeId[] = ["A", "B", "C", "D"];
import { extractAreaKey, matchesAreaFilter } from "@/lib/areas";
import { COUNSELORS } from "@/lib/data";
import { placesHomeData } from "@/lib/mock/places-home";
import AreaOptions, { buildAreaCountMap } from "@/components/ui/AreaOptions";

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

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--mid)",
  display: "block",
  marginBottom: 8,
};

type Tab = "counselor" | "act" | "glow";

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("counselor");

  // Counselor (結婚相談所)
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [keyword, setKeyword] = useState("");

  // Act (デートの場所 = お見合い・デートで使うカフェ・レストラン)
  const [placeArea, setPlaceArea] = useState("");
  const [placeUse, setPlaceUse] = useState("");
  const [placePrice, setPlacePrice] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [placeKeyword, setPlaceKeyword] = useState("");

  // Glow (美容店 = 美容室・眉毛サロン・ネイルサロン・エステ)
  // NOTE: 「予約タイミング」(glowReserve) は Kinda 経由予約が未実装のためサイト非表示中。
  // 将来 Kinda 経由予約を実装した際に state と UI（下部にコメントアウト済み）を復活させる。
  const [glowArea, setGlowArea] = useState("");
  const [glowUse, setGlowUse] = useState("");
  const [glowPrice, setGlowPrice] = useState("");
  const [glowKeyword, setGlowKeyword] = useState("");

  /* 各タブごとのエリア件数マップ（0 件のエリアは <select> でグレーアウト） */
  const counselorAreaCount = useMemo(
    () => buildAreaCountMap(COUNSELORS as { area: string | null }[]),
    []
  );
  const actAreaCount = useMemo(
    () =>
      buildAreaCountMap(
        placesHomeData
          .filter((p) => p.categoryLabel === "カフェ" || p.categoryLabel === "レストラン")
          .map((p) => ({ areaLabel: p.areaLabel }))
      ),
    []
  );
  const glowAreaCount = useMemo(
    () =>
      buildAreaCountMap(
        placesHomeData
          .filter((p) =>
            ["美容室", "ネイルサロン", "眉毛サロン", "エステ"].includes(p.categoryLabel)
          )
          .map((p) => ({ areaLabel: p.areaLabel }))
      ),
    []
  );

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
    const params = new URLSearchParams();
    let target = "/kinda-talk";

    if (activeTab === "counselor") {
      if (area) params.set("area", area);
      if (price) params.set("price", price);
      if (type) params.set("type", type);
      if (keyword) params.set("keyword", keyword);
      target = "/kinda-talk";
    } else if (activeTab === "act") {
      if (placeArea) params.set("area", placeArea);
      if (placeUse) params.set("use", placeUse);
      if (placePrice) params.set("price", placePrice);
      if (atmosphere) params.set("atmosphere", atmosphere);
      if (placeKeyword) params.set("keyword", placeKeyword);
      target = "/kinda-act";
    } else {
      // glow（美容店）
      // NOTE: 予約タイミング(reserve) は未実装のため URL パラメータも付与しない
      if (glowArea) params.set("area", glowArea);
      if (glowUse) params.set("use", glowUse);
      if (glowPrice) params.set("price", glowPrice);
      if (glowKeyword) params.set("keyword", glowKeyword);
      target = "/kinda-glow";
    }

    const qs = params.toString();
    router.push(`${target}${qs ? `?${qs}` : ""}`);
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
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
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
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 4,
            marginBottom: 28,
            background: "var(--pale)",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {(
            [
              ["counselor", "カウンセラー"],
              ["act", "デートの場所"],
              ["glow", "美容店"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 4px",
                borderRadius: 10,
                border: "none",
                background: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "white" : "var(--mid)",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                cursor: "pointer",
                transition: "all .2s",
                letterSpacing: ".02em",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Counselor タブ — エリア / タイプ / 価格 / キーワード */}
        {activeTab === "counselor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>エリア</label>
              <select value={area} onChange={(e) => setArea(e.target.value)} style={selectStyle}>
                <AreaOptions countMap={counselorAreaCount} />
              </select>
            </div>
            <div>
              <label style={labelStyle}>タイプ（Kinda type）</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
                <option value="">すべて</option>
                {DIAGNOSIS_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {DIAGNOSIS_TYPES[k].name} — {DIAGNOSIS_TYPES[k].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>価格</label>
              <select value={price} onChange={(e) => setPrice(e.target.value)} style={selectStyle}>
                <option value="">すべて</option>
                <option value="low">〜20,000円</option>
                <option value="mid">20,000〜30,000円</option>
                <option value="high">30,000円〜</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>キーワード</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="相談所名、カウンセラー名など"
                style={inputStyle}
              />
            </div>
            {/* 相談所一覧への分岐リンク（カウンセラーではなく相談所単位で見たい人向け） */}
            <Link
              href="/agencies"
              onClick={onClose}
              style={{
                fontSize: 12,
                color: "var(--mid)",
                textAlign: "center",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                fontFamily: "var(--font-sans)",
                marginTop: 4,
              }}
            >
              相談所一覧から探す →
            </Link>
          </div>
        )}

        {/* Act タブ — エリア / 用途 / 価格 / 雰囲気 / キーワード */}
        {activeTab === "act" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>エリア</label>
              <select
                value={placeArea}
                onChange={(e) => setPlaceArea(e.target.value)}
                style={selectStyle}
              >
                <AreaOptions countMap={actAreaCount} />
              </select>
            </div>
            <div>
              <label style={labelStyle}>用途</label>
              <select
                value={placeUse}
                onChange={(e) => setPlaceUse(e.target.value)}
                style={selectStyle}
              >
                <option value="">すべて</option>
                <option value="cafe">カフェ</option>
                <option value="restaurant">レストラン</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>価格（1人あたり目安）</label>
              <select
                value={placePrice}
                onChange={(e) => setPlacePrice(e.target.value)}
                style={selectStyle}
              >
                <option value="">すべて</option>
                <option value="under-1000">〜1,000円</option>
                <option value="under-3000">〜3,000円</option>
                <option value="under-5000">〜5,000円</option>
                <option value="over-5000">5,000円〜</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>雰囲気</label>
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
              <label style={labelStyle}>キーワード</label>
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

        {/* Glow タブ — 美容店（美容室・眉毛サロン・ネイルサロン・エステ）*/}
        {activeTab === "glow" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>エリア</label>
              <select
                value={glowArea}
                onChange={(e) => setGlowArea(e.target.value)}
                style={selectStyle}
              >
                <AreaOptions countMap={glowAreaCount} />
              </select>
            </div>
            <div>
              <label style={labelStyle}>用途</label>
              <select
                value={glowUse}
                onChange={(e) => setGlowUse(e.target.value)}
                style={selectStyle}
              >
                <option value="">すべて</option>
                <option value="hair">美容室</option>
                <option value="brow">眉毛サロン</option>
                <option value="nail">ネイルサロン</option>
                <option value="esthe">エステ</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>価格</label>
              <select
                value={glowPrice}
                onChange={(e) => setGlowPrice(e.target.value)}
                style={selectStyle}
              >
                <option value="">すべて</option>
                <option value="under-3000">〜3,000円</option>
                <option value="under-5000">〜5,000円</option>
                <option value="under-10000">〜10,000円</option>
                <option value="under-20000">〜20,000円</option>
                <option value="over-20000">20,000円〜</option>
              </select>
            </div>
            {/*
              「予約タイミング（将来 Kinda 経由予約）」フィールド
              現時点では Kinda 経由予約機能が未実装のため、サイト上は非表示。
              将来 Kinda 経由予約を実装した際にこのブロックを復活させる。
              （URL クエリ ?reserve= も利用しないので handleSearch の glowReserve も握りつぶされる）
            */}
            {/*
            <div>
              <label style={labelStyle}>予約タイミング（将来 Kinda 経由予約）</label>
              <select
                value={glowReserve}
                onChange={(e) => setGlowReserve(e.target.value)}
                style={selectStyle}
              >
                <option value="">指定なし</option>
                <option value="today">今日予約できる</option>
                <option value="tomorrow">明日予約できる</option>
                <option value="this-week">今週中に予約できる</option>
                <option value="date">日付を指定する</option>
              </select>
            </div>
            */}
            <div>
              <label style={labelStyle}>キーワード</label>
              <input
                type="text"
                value={glowKeyword}
                onChange={(e) => setGlowKeyword(e.target.value)}
                placeholder="店名、メニュー、エリアなど"
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
