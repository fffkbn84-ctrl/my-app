"use client";

import { useState } from "react";
import Link from "next/link";
import { Counselor } from "@/lib/data";
import CounselorReelCard from "@/components/kinda-talk/CounselorReelCard";
import CounselorReelModal from "@/components/kinda-talk/CounselorReelModal";

type Props = {
  counselors: Counselor[];
};

export default function HomeReelCarousel({ counselors }: Props) {
  const [openCounselor, setOpenCounselor] = useState<Counselor | null>(null);

  return (
    <>
      <div
        className="home-reel-scroll"
        role="region"
        aria-label="今いるカウンセラー（左右スクロール）"
        tabIndex={0}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          padding: "4px 20px 20px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {counselors.map((c) => (
          <div
            key={c.id}
            style={{
              flex: "0 0 auto",
              width: "min(60vw, 240px)",
              scrollSnapAlign: "start",
            }}
          >
            <CounselorReelCard counselor={c} onOpen={setOpenCounselor} sourcePage="home" />
          </div>
        ))}
        {/* 末尾「すべて見る」CTA カード */}
        <Link
          href="/kinda-talk"
          style={{
            flex: "0 0 auto",
            width: "min(60vw, 240px)",
            scrollSnapAlign: "start",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              aspectRatio: "9 / 16",
              borderRadius: 14,
              background: "linear-gradient(160deg,#FAEAE5 0%,#FAF3DE 60%,#F5E5E1 100%)",
              border: "1.5px dashed rgba(212,160,144,.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              color: "var(--ink)",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Shippori Mincho', serif",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              すべて見る
            </span>
            <span style={{ fontSize: 11, color: "var(--mid)", letterSpacing: ".04em" }}>
              在籍カウンセラー一覧
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginTop: 4 }}
            >
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </div>
        </Link>
      </div>

      <style>{`
        .home-reel-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <CounselorReelModal counselor={openCounselor} onClose={() => setOpenCounselor(null)} />
    </>
  );
}
