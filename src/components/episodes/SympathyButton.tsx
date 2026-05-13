"use client";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface SympathyButtonProps {
  initialCount: number;
  /** 共感対象の種類。"story"（Kinda story）/ "voice"（Kinda voices）。 */
  targetType?: "story" | "voice";
  /** 共感対象の ID。指定があれば favorites と連携する */
  targetId?: string | number;
  /** ボタンに表示するラベル。デフォルト「共感した」 */
  label?: string;
  /** 押す前のサブテキスト。デフォルトは Supabase 連携の案内 */
  hint?: string;
  /** コンパクトサイズ（コラム内のミニ表示用など） */
  size?: "default" | "sm";
}

/**
 * 共感ボタン（atHome 方式）。
 * - 押すまで件数は非表示
 * - 押した瞬間「あなたを含む N 人が共感」を初めて開示
 * - targetType + targetId が指定された場合 favorites と連携：
 *   - ログイン時：Supabase favorites に保存
 *   - 未ログイン時：localStorage に保存
 * - 再訪問時に保存済みなら、最初から「共感しました」状態で開く
 */
export default function SympathyButton({
  initialCount,
  targetType,
  targetId,
  label = "共感した",
  hint = "押すとマイページに保存できます",
  size = "default",
}: SympathyButtonProps) {
  const linked = !!(targetType && targetId !== undefined && targetId !== null);

  // favorites と連携する場合は useFavorites の状態を参照
  // 連携しない場合は (linked=false) 内部 state のみ
  const fav = useFavorites(
    targetType ?? "story",
    targetId ?? "noop",
  );
  const [localPressed, setLocalPressed] = useState(false);

  const pressed = linked ? fav.saved : localPressed;
  const revealedCount = pressed ? initialCount + (linked && !fav.saved ? 1 : linked ? 0 : 1) : null;
  // ↑ 表示の意図：
  // - linked + 保存済みで開いた時：すでに自分は数に含まれているので initialCount + 0
  //   （ただし、initialCount はモック値で自分の保存と無関係なため、簡略化して +1 とする）
  // - 簡略化：押された後は initialCount + 1 を表示
  const displayCount = pressed ? initialCount + 1 : null;

  const handleClick = () => {
    if (pressed) return;
    if (linked) {
      fav.toggle();
    } else {
      setLocalPressed(true);
    }
  };

  const isSm = size === "sm";

  return (
    <div style={{ textAlign: "center", margin: isSm ? "20px 0 8px" : "40px 0" }}>
      <button
        onClick={handleClick}
        disabled={pressed}
        aria-pressed={pressed}
        style={{
          border: pressed ? "1.5px solid var(--accent)" : "1.5px solid var(--light)",
          background: pressed ? "var(--adim)" : "white",
          color: pressed ? "var(--accent)" : "var(--ink)",
          borderRadius: 50,
          padding: isSm ? "10px 22px" : "14px 32px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          cursor: pressed ? "default" : "pointer",
          fontSize: isSm ? 13 : 14,
          fontFamily: "var(--font-sans)",
          transition: "all .2s",
        }}
      >
        <svg width={isSm ? 16 : 18} height={isSm ? 16 : 18} viewBox="0 0 18 18" fill="none">
          <path
            d="M9 15C9 15 2.5 10.5 2.5 6C2.5 4 4 2.5 6 2.5C7 2.5 8 3 9 4C10 3 11 2.5 12 2.5C14 2.5 15.5 4 15.5 6C15.5 10.5 9 15 9 15Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill={pressed ? "var(--accent)" : "none"}
          />
        </svg>
        {pressed ? "共感しました" : label}
        {displayCount !== null && (
          <span style={{ color: "var(--accent)", fontSize: 13 }}>
            {displayCount}
          </span>
        )}
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: isSm ? 8 : 12 }}>
        {pressed
          ? linked
            ? "マイページから一覧できます"
            : "あなたを含む共感の数が表示されています"
          : hint}
      </p>
    </div>
  );
}
