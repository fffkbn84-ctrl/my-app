"use client";

import { useEffect, useState } from "react";

/**
 * Kinda story 記事内のシェアバー（X / LINE / リンクコピー）。
 * 記事ページ末尾に置く。URL は実際の表示 URL（window.location）から取得する。
 * モバイルで Web Share API が使える場合は「共有」ボタンも出す。
 */
export default function StoryShareBar({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const shareText = `${title} | Kinda story`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard 不可環境は無視 */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: shareText, url });
    } catch {
      /* キャンセル時は無視 */
    }
  };

  return (
    <div className="story-share">
      <span className="story-share-label">この物語をシェアする</span>
      <div className="story-share-row">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="story-share-btn"
          aria-label="X でシェア"
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
          className="story-share-btn"
          aria-label="LINE でシェア"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 5.81 2 10.5c0 4.21 3.6 7.74 8.46 8.4.33.07.78.21.89.49.1.25.07.65.03.9 0 0-.12.71-.14.86-.04.25-.2.99.87.54 1.07-.45 5.78-3.4 7.89-5.83C21.34 14.16 22 12.41 22 10.5 22 5.81 17.52 2 12 2z" />
          </svg>
          <span>LINE</span>
        </a>
        <button type="button" className="story-share-btn" onClick={copyLink} aria-label="リンクをコピー">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? "コピー済み" : "リンク"}</span>
        </button>
        {canNativeShare && (
          <button type="button" className="story-share-btn" onClick={nativeShare} aria-label="その他で共有">
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
