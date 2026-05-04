/**
 * GA4 カスタムイベント送信ヘルパー
 *
 * window.gtag が未定義 (SSR / GA未設定 / アドブロッカー等) の場合は
 * 何もせず安全に通過する。
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}
