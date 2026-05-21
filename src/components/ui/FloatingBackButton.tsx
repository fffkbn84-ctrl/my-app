"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * 全ページ共通のフローティング「一つ前へ戻る」ボタン。
 *
 * - 画面右下に固定（ページトップへ戻るボタンの真上）
 * - ホーム（/）では非表示
 * - 履歴がない（直リンクで開いた）場合も非表示
 * - タップで router.back()
 * - root layout から呼ばれるので、追加の page-level 実装は不要
 */
export default function FloatingBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // history.length は最低 1（現在のページ）。直リンクで開いた場合は 1 のまま。
    // ある程度の判定として >1 でかつ document.referrer が空でなければ「戻れる」扱い。
    // SSR と CSR で値が違うので mount 後に判定。
    if (typeof window === "undefined") return;
    const hasHistory = window.history.length > 1;
    setCanGoBack(hasHistory);
  }, [pathname]);

  // ホーム / ログイン直後など、戻る先が無いケースは非表示
  // 診断フロー中（Kinda type / Kinda note）は画面内に専用の戻る UI があるため非表示
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/kinda-type/quiz" ||
    pathname === "/kinda-note/quiz" ||
    !canGoBack
  )
    return null;

  return (
    <button
      type="button"
      onClick={() => {
        // ブラウザに戻り先があれば router.back、無ければ "/"
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      aria-label="一つ前のページへ戻る"
      className="floating-back"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* 左向き矢印 */}
        <path d="M14 9H4M9 4L4 9l5 5" />
      </svg>
    </button>
  );
}
