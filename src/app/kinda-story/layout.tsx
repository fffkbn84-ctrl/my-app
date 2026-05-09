import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinda story | ふたりの物語 | ふたりへ",
  description:
    "Kinda storyは、面談を経た本人たちが語る婚活の物語。成婚した先輩・交際中・活動中の声が、これからのあなたのヒントになります。",
};

export default function KindaStoryLayout({ children }: { children: React.ReactNode }) {
  return <div data-section="story">{children}</div>;
}
