"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import NoteIntro from "./components/NoteIntro";

export default function KindaNotePage() {
  const router = useRouter();

  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "Kinda note" }]} />

      {/* ① ミニヘッダー */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "#F5EEE6",
          borderBottom: "1px solid #EAE0D8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 56,
          padding: "0 16px",
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="戻る"
          style={{
            position: "absolute",
            left: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 4L6 10L12 16"
              stroke="#3A2E26"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span
          style={{
            fontFamily: "'Shippori Mincho', serif",
            fontSize: 20,
            fontWeight: 500,
            color: "#3A2E26",
            letterSpacing: "0.04em",
          }}
        >
          Kinda note
        </span>
      </div>

      <NoteIntro />
    </div>
  );
}
