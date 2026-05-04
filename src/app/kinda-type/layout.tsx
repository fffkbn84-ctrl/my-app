import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kinda.futarive.jp";

const TITLE = "Kinda type｜あなたに合うカウンセラーを見つける";
const DESCRIPTION =
  "8つの質問に1〜3分で答えるだけ。あなたに合うカウンセラータイプと、相性の良いカウンセラーが見つかります。Kinda ふたりへの相性チェック。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/kinda-type` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/kinda-type`,
    siteName: "Kinda ふたりへ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function KindaTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
