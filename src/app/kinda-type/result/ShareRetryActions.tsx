"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import ShareBar from "@/components/share/ShareBar";

interface Props {
  /** 共有する URL（UTM 付き。シェア経由の着地を識別する） */
  pageUrl: string;
  /** SNS 投稿テキスト（ハッシュタグ込み） */
  shareText: string;
  /** native 共有のタイトル */
  shareTitle: string;
  resultType: string;
  /** シェア URL から来た（まだ診断していない）人か */
  isShared?: boolean;
}

export default function ShareRetryActions({
  pageUrl,
  shareText,
  shareTitle,
  resultType,
  isShared = false,
}: Props) {
  return (
    <div className="ktr-share-wrap">
      <ShareBar
        title={shareTitle}
        label="結果をシェアする"
        url={pageUrl}
        shareText={shareText}
        onShare={(method) =>
          trackEvent("kinda_type_share", { method, result_type: resultType })
        }
      />

      <div>
        <Link
          href="/kinda-type/quiz"
          className="ktr-retry-link"
          onClick={() =>
            trackEvent("kinda_type_retry", { from_type: resultType })
          }
        >
          {isShared ? "自分のタイプを見つける（60秒）" : "もう一度試す"}
        </Link>
      </div>
    </div>
  );
}
