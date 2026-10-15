import type { Metadata } from "next";
import SkyTechoContent from "./SkyTechoContent";

// 中身は端末ごとの記録なので検索には出さない
export const metadata: Metadata = {
  title: "空の手帳｜Kinda note",
  description: "今日の天気を出すと、同じ空の街へあなたの空が旅をします。行った街がスタンプになってたまっていきます。",
  robots: { index: false, follow: true },
};

export default function KindaNoteSkyPage() {
  return <SkyTechoContent />;
}
