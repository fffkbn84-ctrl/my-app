"use client";
import { useState, useEffect } from "react";

/**
 * カウンセラー・相談所の保存状態をローカルで管理するフック。
 * Supabase連携後はDBへの読み書きに差し替える。
 */
export function useSaved(type: "counselor" | "agency", id: string | number) {
  const key = `saved_${type}_${id}`;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(localStorage.getItem(key) === "1");
  }, [key]);

  const toggle = () => {
    const next = !saved;
    setSaved(next);
    if (next) {
      localStorage.setItem(key, "1");
    } else {
      localStorage.removeItem(key);
    }
  };

  return { saved, toggle };
}
