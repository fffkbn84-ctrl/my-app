"use client";

/**
 * マイページを開いたら相談所からのお知らせを既読化し、
 * ボトムナビの通知ドットを消す（描画はしない裏方コンポーネント）。
 */
import { useEffect } from "react";
import { useUserNotifications } from "@/lib/useUserNotifications";

export default function NotificationsSeen() {
  const { markSeen } = useUserNotifications();
  useEffect(() => {
    markSeen();
  }, [markSeen]);
  return null;
}
