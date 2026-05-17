-- 024_reservations_shared_diagnosis.sql
-- 予約時にユーザーが「カウンセラーに共有する」と選んだ診断結果のスナップショット
-- スナップショット方式（diagnosis_results を直接参照しない）にしたのは:
--   - 共有時点の結果を固定したい（後で診断を受け直してもこの予約に紐付く結果は変わらない）
--   - RLS 設計を単純化（counselor は reservation 経由で直接読める）

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS shared_kinda_type_key TEXT
    CHECK (shared_kinda_type_key IS NULL OR shared_kinda_type_key IN ('A','B','C','D')),
  ADD COLUMN IF NOT EXISTS shared_kinda_type_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shared_kinda_note_key TEXT,
  ADD COLUMN IF NOT EXISTS shared_kinda_note_at TIMESTAMPTZ;

COMMENT ON COLUMN reservations.shared_kinda_type_key IS 'ユーザーが予約時に共有を選んだ Kinda type（A/B/C/D）。スナップショット方式。NULL = 共有なし';
COMMENT ON COLUMN reservations.shared_kinda_type_at IS '共有された Kinda type 結果の診断日時（カウンセラー側に「いつ受けたか」を伝えるため）';
COMMENT ON COLUMN reservations.shared_kinda_note_key IS 'ユーザーが予約時に共有を選んだ Kinda note の天気キー（angels_ladder 等）。NULL = 共有なし';
COMMENT ON COLUMN reservations.shared_kinda_note_at IS '共有された Kinda note 結果の診断日時';
