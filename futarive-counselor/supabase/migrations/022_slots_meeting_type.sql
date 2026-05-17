-- 022_slots_meeting_type.sql
-- 予約枠ごとの面談形式（事前指定）を保持するカラムを追加。
-- NULL = ユーザー側で選択可（従来通り）
-- '対面' / 'オンライン' = 形式固定（ユーザー側では選択肢が固定される）

ALTER TABLE slots
  ADD COLUMN IF NOT EXISTS meeting_type TEXT;

ALTER TABLE slots
  DROP CONSTRAINT IF EXISTS slots_meeting_type_check;

ALTER TABLE slots
  ADD CONSTRAINT slots_meeting_type_check
  CHECK (meeting_type IS NULL OR meeting_type IN ('対面', 'オンライン'));

COMMENT ON COLUMN slots.meeting_type IS '面談形式の事前指定。NULL = ユーザー選択可（両方OK）、対面 / オンライン = 形式固定';
