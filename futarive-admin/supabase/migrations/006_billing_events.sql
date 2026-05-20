-- 006_billing_events.sql
-- 課金イベント基盤（Zocdoc 型「予約成立から24h grace」モデル）
--
-- ビジネスモデル:
--   ユーザー → 相談所 : 面談料 0円（無料面談）
--   相談所 → Kinda   : 予約成立で 10,000円（集客代行費）
--
-- 課金判定ルール（全相談所共通・プラットフォーム規約として固定）:
--   - 予約成立で billing_events を pending 作成
--   - 予約成立から 24h 以内のユーザーキャンセル → voided（healthy cancellation window）
--   - 24h 超過のキャンセル / no-show          → confirmed（課金維持）
--   - 相談所都合キャンセルは管理画面で運営が voided へ
--   - 面談時刻 + 24h 経過した pending は自動 confirmed（pg_cron 10分ごと）
--
-- 安全性:
--   - 相談所側は SELECT と「異議申し立て（disputed 化）」のみ可能。status を直接書き換え不可
--   - 異議の解決は service_role 経由の RPC（resolve_billing_dispute）のみ
--   - billing_events.reservation_id は UNIQUE。同一予約への二重課金不可
--
-- 既存スキーマ前提（2026-05-20 時点で確認済）:
--   reservations: status ('active'|'completed'|'canceled'), agency_id, counselor_id, start_at
--   agencies:     owner_user_id
--   counselors:   owner_user_id, agency_id
--
-- 注: このファイルは futarive-counselor 側の 025_billing_events.sql と同一内容。
--     どちらか一方で SQL Editor から手動実行すれば DB 反映される（冪等）。

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE TABLE IF NOT EXISTS billing_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id    UUID NOT NULL UNIQUE REFERENCES reservations(id) ON DELETE RESTRICT,
  agency_id         UUID NOT NULL REFERENCES agencies(id) ON DELETE RESTRICT,
  counselor_id      UUID REFERENCES counselors(id) ON DELETE SET NULL,
  amount_jpy        INTEGER NOT NULL DEFAULT 10000,
  status            TEXT    NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','voided','disputed')),
  grace_until       TIMESTAMPTZ NOT NULL,
  reservation_at    TIMESTAMPTZ NOT NULL,
  void_reason       TEXT,
  confirmed_at      TIMESTAMPTZ,
  voided_at         TIMESTAMPTZ,
  dispute_note      TEXT,
  dispute_at        TIMESTAMPTZ,
  admin_resolved_by UUID REFERENCES auth.users(id),
  admin_resolved_at TIMESTAMPTZ,
  admin_note        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_agency_status ON billing_events(agency_id, status);
CREATE INDEX IF NOT EXISTS idx_billing_events_created       ON billing_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_events_pending_due   ON billing_events(reservation_at) WHERE status = 'pending';

CREATE OR REPLACE FUNCTION billing_events_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_billing_events_updated_at ON billing_events;
CREATE TRIGGER trg_billing_events_updated_at
BEFORE UPDATE ON billing_events
FOR EACH ROW EXECUTE FUNCTION billing_events_touch_updated_at();

CREATE OR REPLACE FUNCTION billing_events_create_from_reservation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_agency_id      UUID;
  v_reservation_at TIMESTAMPTZ;
BEGIN
  v_agency_id := NEW.agency_id;
  IF v_agency_id IS NULL AND NEW.counselor_id IS NOT NULL THEN
    SELECT c.agency_id INTO v_agency_id
    FROM counselors c WHERE c.id = NEW.counselor_id;
  END IF;

  IF v_agency_id IS NULL THEN
    RAISE NOTICE 'billing_event skipped: reservation % has no resolvable agency', NEW.id;
    RETURN NEW;
  END IF;

  v_reservation_at := NEW.start_at;
  IF v_reservation_at IS NULL AND NEW.slot_id IS NOT NULL THEN
    SELECT s.start_at INTO v_reservation_at
    FROM slots s WHERE s.id = NEW.slot_id;
  END IF;

  IF EXISTS (SELECT 1 FROM billing_events WHERE reservation_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  INSERT INTO billing_events (
    reservation_id, agency_id, counselor_id,
    amount_jpy, status,
    grace_until, reservation_at
  ) VALUES (
    NEW.id, v_agency_id, NEW.counselor_id,
    10000, 'pending',
    now() + interval '24 hours',
    COALESCE(v_reservation_at, now() + interval '24 hours')
  );

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_billing_events_create ON reservations;
CREATE TRIGGER trg_billing_events_create
AFTER INSERT ON reservations
FOR EACH ROW
WHEN (NEW.status = 'active')
EXECUTE FUNCTION billing_events_create_from_reservation();

CREATE OR REPLACE FUNCTION billing_events_handle_cancellation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_grace_until TIMESTAMPTZ;
BEGIN
  IF NEW.status = 'canceled' AND OLD.status IS DISTINCT FROM 'canceled' THEN
    SELECT grace_until INTO v_grace_until
    FROM billing_events WHERE reservation_id = NEW.id;

    IF v_grace_until IS NULL THEN
      RETURN NEW;
    END IF;

    IF now() <= v_grace_until THEN
      UPDATE billing_events
        SET status      = 'voided',
            void_reason = 'user_cancel_within_grace',
            voided_at   = now()
        WHERE reservation_id = NEW.id AND status = 'pending';
    ELSE
      UPDATE billing_events
        SET status       = 'confirmed',
            confirmed_at = now()
        WHERE reservation_id = NEW.id AND status = 'pending';
    END IF;
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_billing_events_cancel ON reservations;
CREATE TRIGGER trg_billing_events_cancel
AFTER UPDATE OF status ON reservations
FOR EACH ROW EXECUTE FUNCTION billing_events_handle_cancellation();

CREATE OR REPLACE FUNCTION billing_events_auto_confirm_past_due()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE billing_events
    SET status = 'confirmed', confirmed_at = now()
    WHERE status = 'pending'
      AND reservation_at + interval '24 hours' < now();
END $$;

DO $$
DECLARE v_jobid int;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'billing_events_auto_confirm';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

SELECT cron.schedule(
  'billing_events_auto_confirm',
  '*/10 * * * *',
  $$ SELECT billing_events_auto_confirm_past_due() $$
);

ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "billing_events_read_owner"      ON billing_events;
DROP POLICY IF EXISTS "billing_events_read_counselor"  ON billing_events;
DROP POLICY IF EXISTS "billing_events_admin_select"    ON billing_events;
DROP POLICY IF EXISTS "billing_events_admin_modify"    ON billing_events;

CREATE POLICY "billing_events_read_owner" ON billing_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agencies a
      WHERE a.id = billing_events.agency_id
        AND a.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "billing_events_read_counselor" ON billing_events
  FOR SELECT TO authenticated
  USING (
    counselor_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM counselors c
      WHERE c.id = billing_events.counselor_id
        AND c.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "billing_events_admin_select" ON billing_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "billing_events_admin_modify" ON billing_events
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION submit_billing_dispute(p_event_id UUID, p_note TEXT)
RETURNS billing_events LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_event billing_events;
BEGIN
  SELECT * INTO v_event FROM billing_events WHERE id = p_event_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'billing_event not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM agencies a
    WHERE a.id = v_event.agency_id AND a.owner_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF v_event.status = 'voided' THEN
    RAISE EXCEPTION 'already voided';
  END IF;

  IF v_event.dispute_at IS NOT NULL THEN
    RAISE EXCEPTION 'dispute already submitted';
  END IF;

  IF char_length(coalesce(p_note,'')) < 5 THEN
    RAISE EXCEPTION 'dispute note too short';
  END IF;

  UPDATE billing_events
    SET status       = 'disputed',
        dispute_note = p_note,
        dispute_at   = now()
    WHERE id = p_event_id
    RETURNING * INTO v_event;

  RETURN v_event;
END $$;

GRANT EXECUTE ON FUNCTION submit_billing_dispute(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION resolve_billing_dispute(
  p_event_id   UUID,
  p_decision   TEXT,
  p_admin_note TEXT
) RETURNS billing_events LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  v_event billing_events;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_users u
    WHERE u.id = auth.uid() AND u.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'not authorized: admin only';
  END IF;

  IF p_decision NOT IN ('void','confirm') THEN
    RAISE EXCEPTION 'invalid decision';
  END IF;

  UPDATE billing_events
    SET status            = CASE WHEN p_decision = 'void' THEN 'voided' ELSE 'confirmed' END,
        voided_at         = CASE WHEN p_decision = 'void'    THEN now() ELSE voided_at END,
        confirmed_at      = CASE WHEN p_decision = 'confirm' THEN now() ELSE confirmed_at END,
        void_reason       = CASE WHEN p_decision = 'void' THEN 'admin_resolved_dispute' ELSE void_reason END,
        admin_resolved_by = auth.uid(),
        admin_resolved_at = now(),
        admin_note        = p_admin_note
    WHERE id = p_event_id
    RETURNING * INTO v_event;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'billing_event not found';
  END IF;

  RETURN v_event;
END $$;

GRANT EXECUTE ON FUNCTION resolve_billing_dispute(UUID, TEXT, TEXT) TO authenticated;

-- 注意事項:
-- 1. admin_users テーブルが未作成の場合は admin 系ポリシー / RPC がエラー。先に作成すること
-- 2. pg_cron は Supabase Dashboard > Database > Extensions で事前に有効化
-- 3. 冪等。再実行しても既存データ・job は破壊しない
