import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinda act | お見合い・デートのお店 | Kinda ふたりへ",
  description:
    "お見合いやデート、婚活前の美容まで、ふたりが実際に会う場所を選ぶ。Kinda actは、取材済みのカフェ・レストラン・サロンを Kinda ふたりへが厳選してお届けします。",
};

export default function KindaActLayout({ children }: { children: React.ReactNode }) {
  return <div data-section="act">{children}</div>;
}
