-- 025_reservations_shared_kinda_note_freetext.sql
-- Kinda note の「your words」（最終問の自由記述）を予約に同梱するためのカラム。
-- shared_kinda_note_key と同時にスナップショット保存される。

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS shared_kinda_note_freetext TEXT;

COMMENT ON COLUMN reservations.shared_kinda_note_freetext IS 'Kinda note 結果画面で「結果に含める」を ON にしていたユーザーの自由記述本文（your words）。スナップショット方式。NULL = 共有なし or OFF にしていた';

-- diagnosis_results.answers に shareFreeText フラグを記録する運用に切り替えるため、
-- スキーマ変更は不要（JSONB 内のキー追加で対応）。
