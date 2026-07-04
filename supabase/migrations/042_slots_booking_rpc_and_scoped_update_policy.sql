-- ============================================================
-- slots の状態遷移を RPC 経由に統一し、直接 UPDATE の全開放ポリシーを撤廃
-- （2026-07-04 セキュリティ診断 §4）
--
-- 背景：
--   これまで会員の予約確定は client から
--     UPDATE slots SET status='booked' WHERE id=? AND status IN('open','locked')
--   を直接叩いていたため、slots の UPDATE ポリシーが USING(true)/CHECK(true) で
--   全開放されていた。結果、任意のログイン会員が他人の枠を書き換え可能だった。
--
--   キャンセル・undo・reschedule は既に SECURITY DEFINER RPC 経由で slot を
--   内部操作しており、直接 UPDATE に依存していたのは「予約確定」だけ。
--
-- 対応：
--   1) 予約確定（枠確保＋reservation INSERT）を単一トランザクションの
--      SECURITY DEFINER 関数 create_reservation_rpc に集約。
--   2) slots の UPDATE ポリシーを owner / agency owner / admin スコープへ置換。
--
-- ※ 本番 DB には MCP 経由で適用済み（2026-07-04）。このファイルは source of truth。
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_reservation_rpc(
  p_slot_id uuid,
  p_start_at timestamptz,
  p_end_at timestamptz,
  p_meeting_type text,
  p_counselor_id uuid,
  p_counselor_name text,
  p_agency_id uuid,
  p_agency_name text,
  p_user_name text,
  p_user_email text,
  p_notes text DEFAULT NULL,
  p_shared_kinda_type_key text DEFAULT NULL,
  p_shared_kinda_type_at timestamptz DEFAULT NULL,
  p_shared_kinda_note_key text DEFAULT NULL,
  p_shared_kinda_note_at timestamptz DEFAULT NULL,
  p_shared_kinda_note_freetext text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_slot_ok boolean := true;
  v_reservation_id uuid;
BEGIN
  -- 認証必須（ログインユーザーが自分の予約としてのみ作成できる）
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'auth_required');
  END IF;

  -- 本物の slot が指定されていれば排他確保（open/locked のときだけ booked に）
  IF p_slot_id IS NOT NULL THEN
    UPDATE slots
      SET status = 'booked', updated_at = now()
      WHERE id = p_slot_id AND status IN ('open', 'locked');
    IF NOT FOUND THEN
      v_slot_ok := false;
    END IF;
    IF NOT v_slot_ok THEN
      RETURN jsonb_build_object('ok', false, 'error', 'slot_unavailable');
    END IF;
  END IF;

  -- 予約作成（user_id は必ず auth.uid()）。status='active' で billing 生成トリガー発火。
  -- INSERT 失敗時は関数ごとロールバックされ、上の枠確保も自動で戻る
  -- （別途 release RPC を作らないことで「他人の枠を解放する」攻撃面を排除）。
  INSERT INTO reservations (
    user_id, slot_id, counselor_id, counselor_name, agency_id, agency_name,
    user_name, user_email, notes, start_at, end_at, meeting_type, status,
    shared_kinda_type_key, shared_kinda_type_at,
    shared_kinda_note_key, shared_kinda_note_at, shared_kinda_note_freetext
  ) VALUES (
    v_uid, p_slot_id, p_counselor_id, p_counselor_name, p_agency_id, p_agency_name,
    p_user_name, p_user_email, p_notes, p_start_at, p_end_at, p_meeting_type, 'active',
    p_shared_kinda_type_key, p_shared_kinda_type_at,
    p_shared_kinda_note_key, p_shared_kinda_note_at, p_shared_kinda_note_freetext
  )
  RETURNING id INTO v_reservation_id;

  RETURN jsonb_build_object('ok', true, 'reservation_id', v_reservation_id);
END;
$function$;

-- anon には実行させない（会員のみ）
REVOKE ALL ON FUNCTION public.create_reservation_rpc(
  uuid, timestamptz, timestamptz, text, uuid, text, uuid, text, text, text,
  text, text, timestamptz, text, timestamptz, text
) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_reservation_rpc(
  uuid, timestamptz, timestamptz, text, uuid, text, uuid, text, text, text,
  text, text, timestamptz, text, timestamptz, text
) TO authenticated;

-- ---- slots UPDATE ポリシーを owner/agency/admin スコープへ置換 ----
DROP POLICY IF EXISTS "slots_update_authed" ON public.slots;

CREATE POLICY "slots_update_owner_admin" ON public.slots
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM counselors c
      WHERE c.id = slots.counselor_id AND c.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM counselors c
      JOIN agencies a ON a.id = c.agency_id
      WHERE c.id = slots.counselor_id AND a.owner_user_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM counselors c
      WHERE c.id = slots.counselor_id AND c.owner_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM counselors c
      JOIN agencies a ON a.id = c.agency_id
      WHERE c.id = slots.counselor_id AND a.owner_user_id = auth.uid()
    )
    OR public.is_admin()
  );
