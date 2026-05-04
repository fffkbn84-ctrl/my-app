import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 301 リダイレクト
   * /search → /kinda-talk へ統一（カウンセラー検索の主要 UI を一本化）
   * /search?tab=agency → /agencies（相談所一覧の専用ページ）
   * SEO 評価を新ページに引き継ぐため permanent: true で 301 を返す。
   */
  async redirects() {
    return [
      {
        source: "/search",
        has: [{ type: "query", key: "tab", value: "agency" }],
        destination: "/agencies",
        permanent: true,
      },
      {
        source: "/search",
        destination: "/kinda-talk",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
