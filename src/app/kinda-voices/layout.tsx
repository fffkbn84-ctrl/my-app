import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinda voices | カウンセラー取材記 | ふたりへ",
  description:
    "Kinda voicesは、結婚相談所のカウンセラー個人に取材したインタビュー記事。どんな人が、どんな思いで伴走しているのか。入会前に「人」を知るための読みものです。",
};

export default function KindaVoicesLayout({ children }: { children: React.ReactNode }) {
  return <div data-section="voices">{children}</div>;
}
