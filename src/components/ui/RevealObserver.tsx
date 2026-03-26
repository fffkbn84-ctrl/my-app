'use client';

import { useEffect } from 'react';

/**
 * スクロール時に .reveal 要素へ .vis クラスを付与する
 * futarive-v4.html の IntersectionObserver 実装に準拠
 */
export default function RevealObserver() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.07 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
