// futarive-counselor 共通設定
//
// FRONTSITE_URL: 口コミ受付 URL や「サイトを見る」リンクで使うフロントサイト
// （my-app-rp9u プロジェクト）の URL。
//
// 環境変数 NEXT_PUBLIC_FRONTSITE_URL を Vercel に設定すれば上書き可能。
// 未設定の場合は下のフォールバック URL（2026-05-21 時点でふうかさんが使ってる branch alias）。
//
// 注:
// - フロントサイトの deployment が変わると URL も変わるため、Vercel 環境変数で
//   管理するのが望ましい
// - main マージ後の本番ドメイン（独自ドメイン）が決まったらここを書き換える
export const FRONTSITE_URL =
  process.env.NEXT_PUBLIC_FRONTSITE_URL ||
  'https://my-app-rp9u-1lpidus3d-fffkbn84-4095s-projects.vercel.app'
