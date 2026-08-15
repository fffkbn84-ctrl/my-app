import NotifySignup from "./NotifySignup";

/**
 * カウンセラー一覧が0件のときの表示。
 *
 * 営業デモ（is_demo）をユーザー向け画面から外した結果、エリア別・タイプ別の
 * ページは実データが埋まるまで0件になる。ここを一行の「いません」で終わらせると
 * 検索から来た人にとって行き止まりになるため、既存の NotifySignup（公開通知）を
 * 空状態の受け皿として置く。
 *
 * 文言の方針：
 * - 「準備中」「近日公開」のように期待を煽る言い方をしない
 * - 「いません」ではなく「まだ公開していません」。供給が無いのではなく、
 *   Kinda がまだ出していない、という事実に寄せる（主語を Kinda 側に置く）
 * - 件数の水増しをしない
 */
export default function CounselorEmptyState({
  message,
  source,
}: {
  /** 状態の一行説明（例: このエリアのカウンセラーは、まだ公開していません。） */
  message: string;
  /** GA4 notify_signup の source（設置場所ごとに変える） */
  source: string;
}) {
  return (
    <div className="kt-empty-state">
      <p className="kt-empty-message">{message}</p>
      <div className="kt-empty-notify">
        <NotifySignup source={source} />
      </div>
    </div>
  );
}
