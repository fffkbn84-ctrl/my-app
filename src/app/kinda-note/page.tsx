"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function KindaNotePage() {
  const router = useRouter();
  const [btnPressed, setBtnPressed] = useState(false);

  const steps = [
    {
      num: 1,
      title: "今の状態を選ぶ",
      desc: "入会前〜交際中、今どこにいても使えます",
    },
    {
      num: 2,
      title: "気持ちに答える",
      desc: "なんとなくでいい。選ぶだけです",
    },
    {
      num: 3,
      title: "整理された状態を受け取る",
      desc: "そのままカウンセラーに渡せます",
    },
  ];

  return (
    <div style={{ background: "#F5EEE6", minHeight: "100vh" }}>

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

      {/* コンテンツ */}
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "0 24px",
          paddingBottom: 80,
        }}
      >

        {/* ② ヒーローセクション */}
        <div style={{ padding: "32px 0 28px" }}>

          {/* 装飾エリア（将来クレイ風イラスト差し替え予定） */}
          <div
            style={{
              height: 180,
              borderRadius: 24,
              background: "linear-gradient(135deg, #F0D8D0, #F5EEE6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
              overflow: "hidden",
            }}
          >
            {/* ハートSVG（将来クレイ風ノートイラストに差し替え） */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              opacity="0.35"
            >
              <path
                d="M30 50C30 50 6 35 6 20C6 13.4 11.4 8 18 8C22 8 25.6 10 28 13.2C30.4 10 34 8 38 8C44.6 8 50 13.4 50 20C50 35 30 50 30 50Z"
                fill="#D4A090"
              />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 24,
              fontWeight: 500,
              color: "#3A2E26",
              letterSpacing: "0.04em",
              lineHeight: 1.7,
              marginBottom: 12,
            }}
          >
            なんとなく、を整理する。
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#7A6A5A",
              lineHeight: 1.9,
              marginBottom: 18,
            }}
          >
            今の気持ちをそのままでいい。
            <br />
            1分くらいで終わるよ。
          </p>

          {/* バッジ */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "white",
              border: "1px solid #EAE0D8",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 11,
              color: "#B0A090",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#D4A090" strokeWidth="1.2" />
              <path d="M5.5 3v2.5l1.5 1.5" stroke="#D4A090" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            会員登録なし・約1分・無料
          </div>
        </div>

        {/* ③ 説明カード 2枚横並び */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 36,
          }}
        >
          {/* カード1：気持ちを整理できる */}
          <div
            style={{
              background: "#F0D8D0",
              borderRadius: 20,
              padding: "22px 14px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              {/* ノートSVG */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="2" width="13" height="17" rx="2" stroke="#C4876A" strokeWidth="1.4" />
                <path d="M7 6h6M7 9.5h6M7 13h4" stroke="#C4876A" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M3 6h2M3 9.5h2M3 13h2" stroke="#C4876A" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#3A2E26",
                lineHeight: 1.7,
              }}
            >
              気持ちを
              <br />
              整理できる
            </p>
          </div>

          {/* カード2：そのままカウンセラーへ */}
          <div
            style={{
              background: "#E8F4E4",
              borderRadius: 20,
              padding: "22px 14px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              {/* カウンセラー（人+矢印）SVG */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="8" cy="6.5" r="2.5" stroke="#5A8A6A" strokeWidth="1.4" />
                <path
                  d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5"
                  stroke="#5A8A6A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M15 9l3 3-3 3"
                  stroke="#5A8A6A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M18 12h-5" stroke="#5A8A6A" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#3A2E26",
                lineHeight: 1.7,
              }}
            >
              そのまま
              <br />
              カウンセラーへ
            </p>
          </div>
        </div>

        {/* ④ 使い方ステップ */}
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "#D4A090",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            HOW IT WORKS
          </p>

          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: "#FDFAF7",
                border: "1.5px solid #EAE0D8",
                borderRadius: 16,
                padding: "16px 18px",
                marginBottom: 10,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              {/* ステップ番号バッジ */}
              <div
                style={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#D4A090",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {step.num}
              </div>

              {/* テキスト */}
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#3A2E26",
                    marginBottom: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#7A6A5A",
                    lineHeight: 1.7,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ⑤ 装飾スペース */}
        <div
          style={{
            height: 120,
            borderRadius: 20,
            background: "linear-gradient(135deg, #F5EEE6, #F0D8D0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          {/* 装飾ハートSVG 3つ */}
          <div style={{ display: "flex", gap: 12, opacity: 0.3 }}>
            {[18, 24, 18].map((size, i) => (
              <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21C12 21 2 14 2 8C2 5.2 4.2 3 7 3C9 3 10.8 4.2 12 6C13.2 4.2 15 3 17 3C19.8 3 22 5.2 22 8C22 14 12 21 12 21Z"
                  fill="#D4A090"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* ⑥ CTAボタン */}
        <div style={{ marginBottom: 12 }}>
          <Link
            href="/kinda-note/quiz"
            onMouseDown={() => setBtnPressed(true)}
            onMouseUp={() => setBtnPressed(false)}
            onMouseLeave={() => setBtnPressed(false)}
            onTouchStart={() => setBtnPressed(true)}
            onTouchEnd={() => setBtnPressed(false)}
            style={{
              display: "block",
              width: "100%",
              background: "#D4A090",
              color: "white",
              textDecoration: "none",
              borderRadius: 999,
              padding: "18px",
              fontSize: 16,
              fontWeight: 500,
              textAlign: "center",
              cursor: "pointer",
              boxShadow: btnPressed ? "0 2px 0 #B8806E" : "0 5px 0 #B8806E",
              transform: btnPressed ? "translateY(3px)" : "translateY(0)",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
              letterSpacing: "0.04em",
              userSelect: "none",
            }}
          >
            はじめる
          </Link>
        </div>

        <p
          style={{
            fontSize: 11,
            color: "#B0A090",
            textAlign: "center",
          }}
        >
          会員登録・ログイン不要です
        </p>

      </div>
    </div>
  );
}
