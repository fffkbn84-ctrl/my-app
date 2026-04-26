import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinda act | お見合い・デートのお店 | Kinda ふたりへ",
  description:
    "お見合いやデート、婚活前の美容まで、ふたりが実際に会う場所を選ぶ。Kinda actは、取材済みのカフェ・レストラン・サロンを Kinda ふたりへが厳選してお届けします。",
};

export default function KindaActLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="act" style={{ position: "relative", minHeight: "100vh" }}>
      {/* ページ最奥背景：村のミニチュア画像 + 強ブラー + パステルピンク被せ
          ヒーローは独自の背景画像を持つので覆い隠される。
          ヒーロー以降のセクションは半透明にして、この背景がふわっと透けて見える。 */}
      <div className="ka-village-bg" aria-hidden />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

