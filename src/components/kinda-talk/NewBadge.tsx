/**
 * 経験年数1年未満（つまり「新人カウンセラー」）に自動付与されるバッジ。
 * カード（CounselorReelCard）・リールモーダル・プロフィール詳細の
 * 3 箇所で同じ表示を使い回す。
 *
 * 判定ロジックは呼び出し側で行い、本コンポーネントは UI 表示のみ担当する。
 */
export default function NewBadge() {
  return <span className="kt-new-badge">新人</span>;
}
