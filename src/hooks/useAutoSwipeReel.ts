"use client";

/**
 * ミニリール（CounselorReelMini / AgencyReelMini）の共通ロジック。
 *
 * 提供する機能：
 * - スクロール位置から active index を算出
 * - 5 秒ごとに自動で次の画像へスムーススクロール
 * - 以下の条件で自動スワイプを止める / 再開する：
 *   - ユーザーが指で操作したら 10 秒間休止
 *   - セクションが画面外にあれば停止（IntersectionObserver）
 *   - prefers-reduced-motion: reduce のユーザーは完全 OFF
 *   - 画像が 1 枚以下なら自動スワイプ自体しない
 * - 全画像レイヤーは呼び出し側で常時 DOM に置く前提（事前ロード）
 *
 * 使い方：
 *   const { sectionRef, scrollRef, active } = useAutoSwipeReel(images.length);
 *   <section ref={sectionRef}>
 *     ...
 *     <div ref={scrollRef} className="scroll-container">...</div>
 *   </section>
 */
import { useEffect, useRef, useState } from "react";

const AUTO_SWIPE_INTERVAL_MS = 5000;
const PAUSE_AFTER_INTERACTION_MS = 10000;
const SMOOTH_SCROLL_GUARD_MS = 1000;

export function useAutoSwipeReel(imagesLength: number) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // active を ref にもミラーしてエフェクトの依存を増やさず最新値で動かす
  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // ユーザー操作で一時停止する用のタイムスタンプ
  const pauseUntilRef = useRef(0);
  // 画面内可視性
  const isVisibleRef = useRef(true);
  // 自動スワイプ起因のスクロールイベントを区別するフラグ
  const autoScrollingRef = useRef(false);

  // スクロール → active 更新 + ユーザー操作なら pauseUntil 更新
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActive(Math.max(0, Math.min(imagesLength - 1, idx)));
      });
      // 自動スワイプ起因じゃないスクロールはユーザー操作と判断して一時停止
      if (!autoScrollingRef.current) {
        pauseUntilRef.current = Date.now() + PAUSE_AFTER_INTERACTION_MS;
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [imagesLength]);

  // IntersectionObserver で画面内のときだけ自動スワイプ
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 自動スワイプ本体
  useEffect(() => {
    if (imagesLength <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      if (!isVisibleRef.current) return;
      if (Date.now() < pauseUntilRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const next = (activeRef.current + 1) % imagesLength;
      autoScrollingRef.current = true;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      // スムーススクロール完了を待ってフラグ解除
      setTimeout(() => {
        autoScrollingRef.current = false;
      }, SMOOTH_SCROLL_GUARD_MS);
    }, AUTO_SWIPE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [imagesLength]);

  return { sectionRef, scrollRef, active };
}
