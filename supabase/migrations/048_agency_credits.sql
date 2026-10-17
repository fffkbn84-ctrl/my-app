-- 048: 充当（返金に代えて、次の予約の送客料1件分に充てる）
--
-- 方針（ふうか確定 2026-10-15 / 10-17）：設計は docs/ops/refund-credit-slide-2026-10.md §4・§7
-- - 充当は「送客料1件分」で持つ（金額の列は持たない）。期限なし。解約時に未使用分を返金する
-- - 予約確定のとき、未使用の充当があれば Stripe で課金せず、充当を1件使う（/api/stripe/charge）
-- - 充当で確定した予約にさらに例外が認められたら、もう1件作ってよい。
--   source_reservation_id は「最初にお金を払った予約」のまま引き継ぐ（解約時の返金先を1つにするため）
-- - 作るのは運営だけ（当面は Claude が SQL で grant_agency_credit を呼ぶ）
-- - 元の課金にチャージバックが来たら、未使用の分は revoked にする（webhook）

CREATE TABLE IF NOT EXISTS public.agency_credits (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id             uuid NOT NULL REFERENCES public.agencies(id),
  -- お金を払った元の予約（返金はこの予約の課金へ戻す）
  source_reservation_id uuid NOT NULL REFERENCES public.reservations(id),
  -- 運営が認めた事情のメモ（相談所にも見える）
  reason                text,
  status                text NOT NULL DEFAULT 'available'
                          CHECK (status IN ('available', 'used', 'refunded', 'revoked')),
  used_reservation_id   uuid REFERENCES public.reservations(id),
  used_at               timestamptz,
  refunded_at           timestamptz,
  refund_method         text CHECK (refund_method IN ('card', 'bank')),
  revoked_at            timestamptz,
  admin_note            text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'used') = (used_reservation_id IS NOT NULL))
);

-- 1つの予約に充当を2件使わない（課金 API が同時に2回呼ばれても）
CREATE UNIQUE INDEX IF NOT EXISTS agency_credits_used_reservation_uniq
  ON public.agency_credits (used_reservation_id) WHERE used_reservation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS agency_credits_agency_available_idx
  ON public.agency_credits (agency_id, created_at) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS agency_credits_source_idx
  ON public.agency_credits (source_reservation_id);

-- RLS：読むのは相談所の持ち主と運営だけ。書き込みのポリシーは作らない（service role と下の関数だけが書く）
ALTER TABLE public.agency_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS agency_credits_read_owner ON public.agency_credits;
CREATE POLICY agency_credits_read_owner ON public.agency_credits
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.agencies a
    WHERE a.id = agency_credits.agency_id AND a.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS agency_credits_admin_select ON public.agency_credits;
CREATE POLICY agency_credits_admin_select ON public.agency_credits
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

REVOKE ALL ON public.agency_credits FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.agency_credits FROM authenticated;
GRANT SELECT ON public.agency_credits TO authenticated;

-- ── 充当を使う（課金の手前で呼ぶ）。使えたら充当の id、無ければ NULL ──
-- 同じ予約で2回呼ばれても、2件目は使わずに1件目の id を返す。
-- 古い順に1件を行ロックで取り、同じ相談所の予約がほぼ同時に入っても同じ充当を2回使わない。
CREATE OR REPLACE FUNCTION public.consume_agency_credit(p_agency_id uuid, p_reservation_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id FROM agency_credits WHERE used_reservation_id = p_reservation_id;
  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  SELECT id INTO v_id
    FROM agency_credits
   WHERE agency_id = p_agency_id AND status = 'available'
   ORDER BY created_at
   LIMIT 1
   FOR UPDATE SKIP LOCKED;
  IF v_id IS NULL THEN
    RETURN NULL;
  END IF;

  BEGIN
    UPDATE agency_credits
       SET status = 'used', used_reservation_id = p_reservation_id, used_at = now(), updated_at = now()
     WHERE id = v_id;
  EXCEPTION WHEN unique_violation THEN
    -- 同じ予約の別の呼び出しが先に使った
    SELECT id INTO v_id FROM agency_credits WHERE used_reservation_id = p_reservation_id;
  END;
  RETURN v_id;
END;
$function$;

-- ── 充当を作る（運営）。元の予約が充当で確定していたら、お金を払った予約まで遡る ──
CREATE OR REPLACE FUNCTION public.grant_agency_credit(p_reservation_id uuid, p_reason text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_agency uuid;
  v_source uuid;
  v_id uuid;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_admin() AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT agency_id INTO v_agency FROM reservations WHERE id = p_reservation_id;
  IF v_agency IS NULL THEN
    RAISE EXCEPTION 'reservation_not_found_or_no_agency';
  END IF;

  SELECT source_reservation_id INTO v_source
    FROM agency_credits WHERE used_reservation_id = p_reservation_id;
  v_source := COALESCE(v_source, p_reservation_id);

  INSERT INTO agency_credits (agency_id, source_reservation_id, reason)
  VALUES (v_agency, v_source, p_reason)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_agency_credit(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_agency_credit(uuid, uuid) TO service_role;
REVOKE ALL ON FUNCTION public.grant_agency_credit(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_agency_credit(uuid, text) TO authenticated, service_role;
