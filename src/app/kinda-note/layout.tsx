import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

// /kinda-note（着地ページ）は client component のため metadata を直接 export できない。
// SNS bio の着地先かつ SEO 入口なので、ここで自己参照 canonical と固有 title/description
// を付与する。openGraph/twitter は敢えて指定しない＝親(root layout)の og:image
// (OGP-hero.jpg) を継承させる（子で openGraph を上書きすると images が引き継がれず
// og:image が欠落するため）。
// 子セグメント（quiz / result）はそれぞれ canonical を上書きする。
export const metadata: Metadata = {
  title: "Kinda note｜気持ちを、天気の言葉で整理する",
  description:
    "言葉にならない今日の気持ちを、天気にする。3つ選ぶだけ・20秒・会員登録なし・無料。毎日の天気を並べて見られます。じっくり整理したいときは、相談するときにそのまま渡せる形にもできます。",
  alternates: { canonical: `${SITE_URL}/kinda-note` },
};

export default function KindaNoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
