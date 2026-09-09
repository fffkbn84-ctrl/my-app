-- 045: 口コミの保護列を守る＋未ログインから叩けた RPC の実行権限を剥奪
--
-- 背景（2026-09-09 のセキュリティ点検）
--
-- (1) reviews の UPDATE
--     ポリシー reviews_update_admin_or_owner は、対象カウンセラー本人とその相談所オーナーにも
--     UPDATE を許可している。返信（agency_reply）を書くための権限だが、RLS はポリシー単位でしか
--     効かず列を絞れないうえ、列 GRANT も body / rating / is_published を含む全列に付いていた。
--     つまり「自分に付いた口コミの本文・点数を書き換える」「非公開にする」ことが
--     PostgREST 経由で可能だった。Kinda の「面談した人だけが書ける・やらせは構造上できない」
--     という前提と正面から矛盾するため塞ぐ。
--
--     列 GRANT の剥奪ではなく BEFORE UPDATE トリガーで守る。理由は、運営 admin 画面が
--     同じ authenticated ロールで is_published を切り替えており、列 GRANT を落とすと
--     公開・非公開の操作まで巻き込んで壊れるため。トリガーなら「誰が触ったか」で分岐できる。
--
-- (2) SECURITY DEFINER 関数の実行権限
--     billing_events_auto_confirm_past_due() と auto_cancel_expired_reschedules() は
--     PUBLIC に EXECUTE が付いており、未ログインでも /rest/v1/rpc/... から呼べていた。
--     前者は請求行を pending → confirmed に、後者は期限切れ予約をキャンセルにできる。
--     どちらも pg_cron が postgres 権限で回しているため、外部からの実行権限は不要。

-- ─────────────────────────────────────────────
-- (1) 口コミの保護列
-- ─────────────────────────────────────────────

-- SECURITY INVOKER（既定）のまま。NEW/OLD の比較と is_admin() の呼び出ししかせず、
-- 昇格した権限を必要としない。トリガー関数は起動時に呼び出し元の EXECUTE 権限を
-- 検査されないため、これで返信フローは従来どおり動く。
CREATE OR REPLACE FUNCTION public.reviews_guard_protected_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- サーバー側（service_role / マイグレーション / pg_cron）はエンドユーザーのセッションを
  -- 持たず auth.uid() が null。従来どおり全列更新できる。
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- 運営 admin は公開・非公開の切り替えと訂正を行うため全列更新できる。
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- それ以外（＝カウンセラー本人・相談所オーナー）が触ってよいのは
  -- agency_reply / agency_replied_at / updated_at だけ。
  IF NEW.body               IS DISTINCT FROM OLD.body
     OR NEW.rating             IS DISTINCT FROM OLD.rating
     OR NEW.is_published       IS DISTINCT FROM OLD.is_published
     OR NEW.source_type        IS DISTINCT FROM OLD.source_type
     OR NEW.counselor_id       IS DISTINCT FROM OLD.counselor_id
     OR NEW.reservation_id     IS DISTINCT FROM OLD.reservation_id
     OR NEW.user_id            IS DISTINCT FROM OLD.user_id
     OR NEW.good_tags          IS DISTINCT FROM OLD.good_tags
     OR NEW.reviewer_age_range IS DISTINCT FROM OLD.reviewer_age_range
     OR NEW.reviewer_gender    IS DISTINCT FROM OLD.reviewer_gender
     OR NEW.reviewer_area      IS DISTINCT FROM OLD.reviewer_area
     OR NEW.created_at         IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION '口コミの本文・評価・公開状態は、書かれた側からは変更できません（変更できるのは返信のみ）';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reviews_guard_protected_columns ON public.reviews;
CREATE TRIGGER trg_reviews_guard_protected_columns
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.reviews_guard_protected_columns();

-- ─────────────────────────────────────────────
-- (2) 外部から叩けた RPC の実行権限を剥奪
-- ─────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.billing_events_auto_confirm_past_due()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_cancel_expired_reschedules()
  FROM PUBLIC, anon, authenticated;

-- pg_cron は postgres で実行される。service_role からの手動実行は残す。
GRANT EXECUTE ON FUNCTION public.billing_events_auto_confirm_past_due() TO service_role;
GRANT EXECUTE ON FUNCTION public.auto_cancel_expired_reschedules() TO service_role;
