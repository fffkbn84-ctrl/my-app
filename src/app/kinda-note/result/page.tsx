import ResultContent from "./ResultContent";

export const metadata = {
  title: "Kinda note 結果",
};

// 結果画面は localStorage の回答データに依存するクライアント主導のページ。
// 静的 prerender ではなく、リクエストごとにサーバが route だけ受け渡しする。
// Vercel 上で稀に prerender 結果と useSearchParams の不整合が起きて
// iOS Safari が「This page couldn't load」を出す事象を回避するため。
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ route?: string }>;

export default async function KindaNoteResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { route } = await searchParams;
  return <ResultContent initialRoute={route ?? null} />;
}
