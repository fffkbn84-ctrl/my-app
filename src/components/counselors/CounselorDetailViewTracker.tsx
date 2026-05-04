"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * /counselors/[id] が Server Component のため、
 * useEffect で page_view 系の counselor_detail_view を発火させる小物。
 */
export default function CounselorDetailViewTracker({
  counselorId,
}: {
  counselorId: string;
}) {
  useEffect(() => {
    trackEvent("counselor_detail_view", { counselor_id: counselorId });
  }, [counselorId]);

  return null;
}
