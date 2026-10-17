"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { loadKindaNoteHistory } from "../lib/storage";

const noSubscribe = () => () => {};

/**
 * Kinda note の説明（絵・見出し・できること・3ステップ・はじめる）。
 * /kinda-note と、今日の天気をはじめてつける人の1問目の前（2026-10-17）で同じものを出す。
 * onStart があればボタンで呼び、なければ /kinda-note/today へのリンクにする。
 */
export default function NoteIntro({ onStart }: { onStart?: () => void }) {
  const [btnPressed, setBtnPressed] = useState(false);
  // 空の手帳の入口は、一度でも街に行った端末にだけ出す（行っていない人には中身が空なので）
  const hasSky = useSyncExternalStore(
    noSubscribe,
    () => loadKindaNoteHistory().some((it) => it.sky_city),
    () => false,
  );

  const steps = [
    {
      num: 1,
      title: "今日の気持ちを選ぶ",
      desc: "なんとなくでいい。3つ選ぶだけです",
    },
    {
      num: 2,
      title: "天気を受け取る",
      desc: "言葉にならない気持ちが、天気の名前になります",
    },
    {
      num: 3,
      title: "毎日、並べる",
      desc: "明日また来ると、これまでの天気と並べて見られます",
    },
  ];

  const ctaStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    background: "#D4A090",
    color: "white",
    textDecoration: "none",
    border: "none",
    borderRadius: 999,
    padding: "18px",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "inherit",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: btnPressed ? "0 2px 0 #B8806E" : "0 5px 0 #B8806E",
    transform: btnPressed ? "translateY(3px)" : "translateY(0)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
    letterSpacing: "0.04em",
    userSelect: "none",
  };
  const pressHandlers = {
    onMouseDown: () => setBtnPressed(true),
    onMouseUp: () => setBtnPressed(false),
    onMouseLeave: () => setBtnPressed(false),
    onTouchStart: () => setBtnPressed(true),
    onTouchEnd: () => setBtnPressed(false),
  };

  return (
    <div
      className="pc-readable"
      style={{
        padding: "0 24px",
        paddingBottom: 80,
      }}
    >
      {/* ② ヒーローセクション */}
      <div style={{ padding: "32px 0 28px" }}>
        {/* 装飾エリア（クレイ風イラスト） */}
        <Image
          src="/images/kinda-note-deco-1.webp"
          alt=""
          width={1254}
          height={1254}
          priority
          sizes="(max-width: 480px) 100vw, 432px"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 24,
            marginBottom: 28,
            display: "block",
          }}
        />

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
          今日の気持ちを、天気にする。
          <br />
          20秒で終わるよ。
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
          会員登録なし・20秒・無料
        </div>
      </div>

      {/* ③ できることリスト（チップではなく、説明文として読ませる） */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#3A2E26" }}>
          <span aria-hidden="true" style={{ display: "inline-flex", flexShrink: 0, color: "#C4876A" }}>
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="2" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 6h6M7 9.5h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          気持ちを整理できる
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#3A2E26" }}>
          <span aria-hidden="true" style={{ display: "inline-flex", flexShrink: 0, color: "#5A8A6A" }}>
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <circle cx="8" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M15 9l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 12h-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          誰かに相談するとき、そのまま渡せる
        </li>
      </ul>

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

        {/* ステップは「カード」ではなく軽量な縦リスト
            （カード風 = タップできそう問題を回避） */}
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {steps.map((step, idx) => (
            <li
              key={step.num}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 4px",
                borderTop: idx === 0 ? "none" : "1px dashed #EAE0D8",
              }}
            >
              {/* ステップ番号：小ぶり・透明背景・テキストカラー（押せそう感を抑える） */}
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: ".1em",
                  color: "#D4A090",
                  minWidth: 18,
                  lineHeight: "22px",
                }}
              >
                {String(step.num).padStart(2, "0")}
              </span>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#3A2E26",
                    marginBottom: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#7A6A5A",
                    lineHeight: 1.7,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ⑥ CTAボタン */}
      <div style={{ marginBottom: 12 }}>
        {onStart ? (
          <button type="button" onClick={onStart} {...pressHandlers} style={ctaStyle}>
            はじめる
          </button>
        ) : (
          <Link href="/kinda-note/today" {...pressHandlers} style={ctaStyle}>
            はじめる
          </Link>
        )}
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

      {hasSky && (
        <p style={{ textAlign: "center", margin: "20px 0 0", fontSize: 12.5 }}>
          <Link
            href="/kinda-note/sky"
            style={{ color: "#7A6A5A", textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            空の手帳を見る
          </Link>
        </p>
      )}

      {/* 段階の note（じっくり整理・カウンセラーに渡せる）。主役は今日の天気、こちらは控えめに */}
      <p style={{ textAlign: "center", margin: "28px 0 0", fontSize: 12.5, lineHeight: 1.8 }}>
        <Link href="/kinda-note/quiz" style={{ color: "#7A6A5A", textDecoration: "underline", textUnderlineOffset: 3 }}>
          じっくり整理する（60秒）
        </Link>
        <br />
        <span style={{ fontSize: 11, color: "#B0A090" }}>
          いまいる場所に合わせて整理し、相談するときにそのまま渡せます
        </span>
      </p>
    </div>
  );
}
