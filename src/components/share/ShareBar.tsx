"use client";

import { useEffect, useState } from "react";

/**
 * サイト共通のインライン・シェアバー（Kinda story 仕様）。
 * X / LINE / リンクコピー（モバイルで Web Share API 対応なら「共有」も）。
 *
 * - url 省略時は表示中ページの URL（window.location.href）を使う。
 * - onShare はトラッキング等の任意フック（method を受け取る）。
 */
type ShareMethod = "x" | "line" | "copy" | "native";

export default function ShareBar({
  title,
  label = "この記事をシェアする",
  url,
  shareText: shareTextProp,
  onShare,
}: {
  title: string;
  label?: string;
  url?: string;
  /** SNS 投稿テキストを上書き（省略時は「{title} | Kinda」）。ハッシュタグ等に使う。 */
  shareText?: string;
  onShare?: (method: ShareMethod) => void;
}) {
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!url) setResolvedUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, [url]);

  const shareText = shareTextProp ?? `${title} | Kinda`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(resolvedUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resolvedUrl)}&text=${encodeURIComponent(shareText)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      onShare?.("copy");
    } catch {
      /* clipboard 不可環境は無視 */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: shareText, url: resolvedUrl });
      onShare?.("native");
    } catch {
      /* キャンセル時は無視 */
    }
  };

  return (
    <div className="share-bar">
      <span className="share-bar-label">{label}</span>
      <div className="share-bar-row">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="share-bar-btn"
          aria-label="X でシェア"
          onClick={() => onShare?.("x")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="share-bar-btn"
          aria-label="LINE でシェア"
          onClick={() => onShare?.("line")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 5.81 2 10.5c0 4.21 3.6 7.74 8.46 8.4.33.07.78.21.89.49.1.25.07.65.03.9 0 0-.12.71-.14.86-.04.25-.2.99.87.54 1.07-.45 5.78-3.4 7.89-5.83C21.34 14.16 22 12.41 22 10.5 22 5.81 17.52 2 12 2z" />
          </svg>
          <span>LINE</span>
        </a>
        <button type="button" className="share-bar-btn" onClick={copyLink} aria-label="リンクをコピー">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? "コピー済み" : "リンク"}</span>
        </button>
        {canNativeShare && (
          <button type="button" className="share-bar-btn" onClick={nativeShare} aria-label="その他で共有">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            <span>共有</span>
          </button>
        )}
      </div>
    </div>
  );
}
