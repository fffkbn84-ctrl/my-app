import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.jp";

// /kinda-note/quiz は client component のため metadata を直接 export できない。
// 親の既定を継承して canonical が不在だったため、ここで自己参照 canonical と
// 固有 title/description を付与する。openGraph は親の og:image を継承させるため未指定。
export const metadata: Metadata = {
  title: "Kinda note｜なんとなくを整理する（約1分）",
  description:
    "今の気持ちに、選ぶだけで答える。約1分で、いまの状態が天気の言葉で整理されます。会員登録・ログイン不要。",
  alternates: { canonical: `${SITE_URL}/kinda-note/quiz` },
};

export default function KindaNoteQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
