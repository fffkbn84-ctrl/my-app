-- Kinda — reservations / agencies 拡張（マイページ予約履歴・キャンセル機能のため）
-- 006 の次に実行してください。
--
-- 目的:
--   1. 認証ユーザーと紐付けてマイページから自分の予約一覧・キャンセルを行えるようにする
--   2. キャンセル期限の機械判定（agencies.cancel_deadline_hours）と、
--      期限切れ時の連絡先案内（agencies.phone / email）に必要なカラムを追加
--   3. Step1Calendar が現状モック slot を吐いているため、
--      reservations を半スタンドアロン化（slot_id を nullable にし、start_at/end_at を直接保持）。
--      本物の UUID slot の場合のみ排他制御 UPDATE を効かせる運用にする。

-- ============================================================
-- 1. reservations: 認証・状態・スタンドアロン化のためのカラム追加
-- ============================================================
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status         TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'canceled', 'completed')),
  ADD COLUMN IF NOT EXISTS canceled_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_reason  TEXT,
  ADD COLUMN IF NOT EXISTS start_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_type   TEXT
    CHECK (meeting_type IS NULL OR meeting_type IN ('対面', 'オンライン')),
  ADD COLUMN IF NOT EXISTS agency_id      UUID REFERENCES agencies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS counselor_name TEXT,
  ADD COLUMN IF NOT EXISTS agency_name    TEXT;

-- モック slot の場合は slot_id が無いため nullable に変更
ALTER TABLE reservations ALTER COLUMN slot_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reservations_user_status_start
  ON reservations(user_id, status, start_at DESC);

-- ============================================================
-- 2. agencies: キャンセル期限・連絡先カラム
-- ============================================================
ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS phone                  TEXT,
  ADD COLUMN IF NOT EXISTS email                  TEXT,
  ADD COLUMN IF NOT EXISTS cancel_deadline_hours  INTEGER NOT NULL DEFAULT 24,
  ADD COLUMN IF NOT EXISTS cancel_policy          TEXT;

COMMENT ON COLUMN agencies.cancel_deadline_hours IS
  '面談開始時刻から何時間前までキャンセル可能か。0=当日まで可、24=24時間前まで';

-- ============================================================
-- 3. RLS（reservations）
-- ============================================================
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own reservations" ON reservations;
CREATE POLICY "users read own reservations" ON reservations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users insert own reservations" ON reservations;
CREATE POLICY "users insert own reservations" ON reservations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users update own reservations" ON reservations;
CREATE POLICY "users update own reservations" ON reservations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 削除は許可しない（履歴は status='canceled' で論理削除）
