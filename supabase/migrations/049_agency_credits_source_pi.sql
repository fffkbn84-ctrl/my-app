-- 049: 充当に「元の課金（Stripe の PaymentIntent）」を持たせる（2026-10-17）
--
-- 048 では元の課金を予約（source_reservation_id）でしか辿れなかった。
-- 日程変更を了承すると Stripe の参照は新しい予約へ移る（039）ので、予約から辿ると次の2つで外れる。
-- - チャージバックが来たとき、その課金から生まれた未使用の充当を見つけて取り消す
-- - 充当で確定した予約が日程変更されたあとに、さらに例外を認めて充当を作るとき、お金を払った元を辿る
-- そこで充当を作る時点で元の課金の ID を写しておき、取り消しと返金はこの ID で行う。
--
-- Supabase の SQL Editor に貼るとドル記号が書き換わることがあるため、関数の本文は一重引用符で囲む。
-- 実行時に「RLS なしで表を作る」と警告が出たら「Run without RLS」を選ぶ（関数の中の変数を表と読み違えるため）。

ALTER TABLE public.agency_credits ADD COLUMN IF NOT EXISTS source_payment_intent_id text;
CREATE INDEX IF NOT EXISTS agency_credits_source_pi_idx
  ON public.agency_credits (source_payment_intent_id) WHERE source_payment_intent_id IS NOT NULL;

-- ── 充当を作る（運営）。関数の中では current_user が持ち主になるので、呼んだ人は session_user で見る。
-- 予約（日程変更の前の予約も含む）が充当で確定していたら、その充当の元（予約と課金）をそのまま引き継ぐ。
CREATE OR REPLACE FUNCTION public.grant_agency_credit(p_reservation_id uuid, p_reason text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS '
DECLARE
  v_agency uuid;
  v_source uuid;
  v_pi text;
  v_id uuid;
BEGIN
  IF auth.role() IS DISTINCT FROM ''service_role'' AND NOT public.is_admin() AND session_user NOT IN (''postgres'', ''supabase_admin'') THEN
    RAISE EXCEPTION ''forbidden'';
  END IF;

  SELECT agency_id INTO v_agency FROM reservations WHERE id = p_reservation_id;
  IF v_agency IS NULL THEN
    RAISE EXCEPTION ''reservation_not_found_or_no_agency'';
  END IF;

  WITH RECURSIVE chain AS (
    SELECT r.id, r.original_reservation_id, 0 AS depth FROM reservations r WHERE r.id = p_reservation_id
    UNION ALL
    SELECT r.id, r.original_reservation_id, c.depth + 1
      FROM reservations r JOIN chain c ON r.id = c.original_reservation_id
     WHERE c.depth < 20
  )
  SELECT ac.source_reservation_id, ac.source_payment_intent_id INTO v_source, v_pi
    FROM agency_credits ac JOIN chain c ON ac.used_reservation_id = c.id
   ORDER BY c.depth
   LIMIT 1;

  IF v_source IS NULL THEN
    v_source := p_reservation_id;
    SELECT stripe_payment_intent_id INTO v_pi FROM reservations WHERE id = p_reservation_id;
  END IF;

  INSERT INTO agency_credits (agency_id, source_reservation_id, source_payment_intent_id, reason)
  VALUES (v_agency, v_source, v_pi, p_reason)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
';

REVOKE ALL ON FUNCTION public.grant_agency_credit(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_agency_credit(uuid, text) TO service_role;
