import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinda talk | カウンセラー一覧 | Kinda ふたりへ",
  description:
    "Kinda talkは、結婚相談所のロゴではなくカウンセラー個人を見て選べるリール型一覧。リールに込められた言葉と空気から、あなたの婚活を支える人を見つけてください。",
};

export default function KindaTalkLayout({ children }: { children: React.ReactNode }) {
  return <div data-section="talk">{children}</div>;
}
