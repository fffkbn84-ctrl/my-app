"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface Props {
  twitterUrl: string;
  resultType: string;
}

export default function ShareRetryActions({ twitterUrl, resultType }: Props) {
  return (
    <div className="ktr-share-wrap">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ktr-share-btn"
        onClick={() =>
          trackEvent("kinda_type_share", {
            method: "twitter",
            result_type: resultType,
          })
        }
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white" aria-hidden="true">
          <path d="M12.6 1h2.4L9.6 6.9 16 15h-4.8l-3.6-4.7L3.2 15H.8l5.8-6.6L0 1h4.9l3.3 4.3L12.6 1zM11.8 13.5h1.3L4.3 2.4H2.9l8.9 11.1z" />
        </svg>
        Xでシェアする
      </a>

      <div>
        <Link
          href="/kinda-type/quiz"
          className="ktr-retry-link"
          onClick={() =>
            trackEvent("kinda_type_retry", { from_type: resultType })
          }
        >
          もう一度試す
        </Link>
      </div>
    </div>
  );
}
