// futarive-counselor 共通設定
//
// FRONTSITE_URL: 口コミ受付 URL や「サイトを見る」リンクで使うフロントサイト
// （my-app-rp9u プロジェクト）の URL。
//
// 環境変数 NEXT_PUBLIC_FRONTSITE_URL を Vercel に設定すれば上書き可能。
// 未設定の場合は下のフォールバック（my-app-rp9u プロジェクトの production alias）。
//
// 注:
// - production alias は main ブランチの最新 deploy を常に指すので URL が壊れにくい
// - main マージ後の本番ドメイン（独自ドメイン）が決まったらここを書き換える
export const FRONTSITE_URL =
  process.env.NEXT_PUBLIC_FRONTSITE_URL ||
  'https://my-app-rp9u.vercel.app'
