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
   * リダイレクト
   * /search → /kinda-talk へ統一（カウンセラー検索の主要 UI を一本化）
   * /search?tab=agency → /agencies（相談所一覧の専用ページ）
   *   ↑ SEO 評価を新ページに引き継ぐため permanent: true で 301。
   *
   * /note → /kinda-note（SNS bio 着地用の短縮パス）
   *   Instagram 等の bio リンクは短い /note を貼り、診断ランディング /kinda-note へ送る。
   *   UTM 等のクエリ（?utm_source=instagram&utm_medium=bio&utm_campaign=launch）は
   *   Next.js が自動で引き継ぐため、GA4 の流入分類はリダイレクト後の /kinda-note 上で成立する。
   *   将来 bio 着地先を変える可能性があるため permanent: false（307・恒久キャッシュさせない）。
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
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
      {
        source: "/note",
        destination: "/kinda-note",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
