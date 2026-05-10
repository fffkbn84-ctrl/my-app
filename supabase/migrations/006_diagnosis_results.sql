-- Kinda — diagnosis_results（診断履歴）テーブル新規作成
-- 005 の次に実行してください
--
-- Kinda type（A/B/C/D 相性チェック）と Kinda note（天気メタファー）の
-- 両方の結果をユーザーごとに保存する。
-- 未ログイン時は localStorage に保存し、ログイン時に DB へ同期する想定。

-- ===== diagnosis_results テーブル =====
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  /** 'type' = Kinda type 相性チェック / 'note' = Kinda note 天気 */
  kind        TEXT NOT NULL CHECK (kind IN ('type', 'note')),
  /**
   * type の場合: 'A' | 'B' | 'C' | 'D'
   * note の場合: weatherKey（'morning_mist' / 'sun_break' 等。phase4 で使用）
   */
  result_key  TEXT NOT NULL,
  /** 回答内容（type: Record<questionId, optionType> / note: ルート別の任意構造） */
  answers     JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_user_kind
  ON diagnosis_results(user_id, kind, created_at DESC);

-- ===== Row Level Security =====
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

-- 自分の履歴のみ参照可
DROP POLICY IF EXISTS "users read own diagnosis" ON diagnosis_results;
CREATE POLICY "users read own diagnosis" ON diagnosis_results
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 自分の行のみ INSERT 可
DROP POLICY IF EXISTS "users insert own diagnosis" ON diagnosis_results;
CREATE POLICY "users insert own diagnosis" ON diagnosis_results
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 自分の行のみ DELETE 可
DROP POLICY IF EXISTS "users delete own diagnosis" ON diagnosis_results;
CREATE POLICY "users delete own diagnosis" ON diagnosis_results
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
