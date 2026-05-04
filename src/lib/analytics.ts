import { track as vercelTrack } from "@vercel/analytics";

/**
 * 統合カスタムイベント送信ヘルパー
 *
 * - GA4 (window.gtag) と Vercel Analytics の両方に送信する
 * - SSR / GA未設定 / アドブロッカー / 環境変数なし などは defensive に no-op
 *
 * 使い方：
 *   trackEvent("kinda_type_quiz_complete", { result_type: "C" });
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;

  // GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }

  // Vercel Analytics（@vercel/analytics の track）
  // params の値は string | number | boolean | null に絞られているので
  // そのまま渡せる。失敗時は内部で no-op になる。
  try {
    vercelTrack(eventName, params);
  } catch {
    // 環境未対応 / SDK 未読込時の保険
  }
}
