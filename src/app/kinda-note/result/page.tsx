import { Suspense } from "react";
import ResultContent from "./ResultContent";

export const metadata = {
  title: "Kinda note 結果",
};

// 静的 prerender ではなく、リクエストごとに動的レンダリングする。
// 結果は localStorage と URL 検索パラメータから生成されるため、ビルド時に
// 静的 HTML をキャッシュしても意味がない。Vercel 上で稀に prerender 結果と
// クライアント状態がミスマッチして「This page couldn't load」になる事象を回避。
export const dynamic = "force-dynamic";

export default function KindaNoteResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F5EEE6" }} />}>
      <ResultContent />
    </Suspense>
  );
}
