import { permanentRedirect } from "next/navigation";

/**
 * 旧 URL `/episodes/[id]` から正規の `/kinda-story/[id]` へ 308 リダイレクト。
 *
 * 2026-05-10 セッションで Kinda story 一覧・詳細を `/kinda-story` に新設したが、
 * 旧 `/episodes/[id]` は同じ内容を別 URL で表示する重複ページとして残っていた。
 * SEO 観点（カノニカル統一）と保守性（同じデータを 2 ヶ所で扱わない）のため、
 * 旧 URL を恒久リダイレクトに変更。
 */
export default async function EpisodeRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  permanentRedirect(`/kinda-story/${id}`);
}
