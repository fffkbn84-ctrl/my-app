import type { NextConfig } from "next";

// Supabase Storage を next/image で扱えるよう remotePatterns に登録する。
// NEXT_PUBLIC_SUPABASE_URL から hostname を抽出してホワイトリスト化。
const supabaseHostname = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname || "";
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [{
            protocol: "https" as const,
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          }]
        : []),
      // env 未設定でもビルドが通るよう、汎用 *.supabase.co もホワイトリストする
      {
        protocol: "https" as const,
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
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
