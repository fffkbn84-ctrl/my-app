-- 023_reservations_agency_message.sql
-- 相談所側から予約者へ送る単方向メッセージ
-- 「事前に伝えたいこと」への返答や、面談前の連絡事項を 1 メッセージで添える

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS agency_message TEXT,
  ADD COLUMN IF NOT EXISTS agency_message_at TIMESTAMPTZ;

COMMENT ON COLUMN reservations.agency_message IS '相談所からのメッセージ本文（カウンセラー管理画面から送信）';
COMMENT ON COLUMN reservations.agency_message_at IS '相談所メッセージの送信時刻';
