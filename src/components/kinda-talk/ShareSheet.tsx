"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  onClose: () => void;
};

export default function ShareSheet({ url, title, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="kt-share-sheet" onClick={onClose} role="presentation">
      <div className="kt-share-sheet-inner" onClick={(e) => e.stopPropagation()}>
        <div className="kt-share-sheet-title">共有する</div>
        <div className="kt-share-sheet-grid">
          <a href={xUrl} target="_blank" rel="noopener noreferrer" className="kt-share-sheet-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X でシェア
          </a>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="kt-share-sheet-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.81 2 10.5c0 4.21 3.6 7.74 8.46 8.4.33.07.78.21.89.49.1.25.07.65.03.9 0 0-.12.71-.14.86-.04.25-.2.99.87.54 1.07-.45 5.78-3.4 7.89-5.83C21.34 14.16 22 12.41 22 10.5 22 5.81 17.52 2 12 2z" />
            </svg>
            LINE でシェア
          </a>
          <button type="button" className="kt-share-sheet-btn" onClick={copyLink}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "コピーしました" : "リンクをコピー"}
          </button>
        </div>
        <button type="button" className="kt-share-sheet-cancel" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
