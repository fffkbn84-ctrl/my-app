-- 046: カウンセラー・相談所の保護列を守る／kinda.jp の表示をカード登録済みの相談所に限る
--      ／お店画像の書き込みを運営だけに
--
-- 背景（2026-10-11 のセキュリティ点検・営業開始前）
--
-- (1) counselors / agencies の INSERT・UPDATE
--     ポリシーは「本人（owner_user_id）なら全列を書ける」形で、列 GRANT も全列に付いていた。
--     kinda.jp に会員登録しただけの人でも、PostgREST 経由で次ができた。
--       - 相談所とカウンセラーを自分で作る（is_published の既定が true なので即公開）
--       - 既存の相談所（Emma 等）の所属としてカウンセラーを作る（agency_id を自由に指定できた）
--       - rating_avg / review_count を書き換えて「★4.9（30件）」と表示させる
--       - is_demo / stripe_customer_id / owner_user_id の書き換え
--     045 の口コミと同じく、BEFORE トリガーで「誰が触ったか」によって分岐して守る。
--
--     045 と違い、通す条件を auth.uid() IS NULL ではなく current_user で見る。
--     口コミ集計（recalc_counselor_review_stats）や招待の受け取り（claim_counselor_by_token）は
--     SECURITY DEFINER 関数として「ログイン中のユーザーの操作の中で」走るため auth.uid() が入っている。
--     関数の中では current_user が関数の所有者（postgres）になるので、こちらで見分ける。
--     PostgREST から直接来た書き込みだけが current_user = authenticated / anon になる。
--
-- (2) kinda.jp の表示（案A・2026-10-11 ふうか決裁）
--     カード登録は契約の条件（CLAUDE.md §12）。カード登録済み（agencies.card_registered_at あり）の
--     相談所のカウンセラーだけを、ログインしていない人にも見える状態にする。
--     card_registered_at はカウンセラー管理画面の /api/stripe/set-default-pm が service role で書く。
--     サンプル（is_demo）は従来どおり見える（サイト側で出し分けている）。
--     本人・相談所オーナー・運営は、カード未登録でも自分の行を読める（管理画面が動くように）。
--
-- (3) storage の shop-media
--     ログインしていれば誰でもお店の画像を追加・上書き・削除できた。運営 admin だけにする。

-- ─────────────────────────────────────────────
-- (0) カード登録済みの印（本番には 2026-10-11 に agencies_card_registered_at として先に適用済み）
-- ─────────────────────────────────────────────

ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS card_registered_at timestamptz;
-- 既存：Stripe Customer があり、サンプルでない相談所（当時は Emma のみ）を登録済み扱いにする
UPDATE public.agencies
   SET card_registered_at = now()
 WHERE stripe_customer_id IS NOT NULL
   AND coalesce(is_demo, false) = false
   AND card_registered_at IS NULL;

-- ─────────────────────────────────────────────
-- (1) 保護列のガード
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.guard_counselor_agency_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  -- service_role・マイグレーション・pg_cron・SECURITY DEFINER 関数（集計・招待の受け取り）は通す
  IF current_user NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;
  -- 運営 admin は全列を扱える
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'counselors' THEN
    IF TG_OP = 'INSERT' THEN
      -- 集計値とサンプル印は本人が決められない
      NEW.rating_avg   := 0;
      NEW.review_count := 0;
      NEW.is_demo      := false;
      IF NEW.owner_user_id IS NOT NULL AND NEW.owner_user_id IS DISTINCT FROM v_uid THEN
        RAISE EXCEPTION 'カウンセラーの持ち主は自分以外に設定できません';
      END IF;
      IF NEW.agency_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM agencies a WHERE a.id = NEW.agency_id AND a.owner_user_id = v_uid
      ) THEN
        RAISE EXCEPTION '所属相談所は、自分が持ち主の相談所だけを指定できます';
      END IF;
    ELSE
      IF NEW.rating_avg    IS DISTINCT FROM OLD.rating_avg
      OR NEW.review_count  IS DISTINCT FROM OLD.review_count
      OR NEW.is_demo       IS DISTINCT FROM OLD.is_demo
      OR NEW.owner_user_id IS DISTINCT FROM OLD.owner_user_id THEN
        RAISE EXCEPTION '口コミの集計・サンプル設定・持ち主は変更できません';
      END IF;
      IF NEW.agency_id IS DISTINCT FROM OLD.agency_id AND NEW.agency_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM agencies a WHERE a.id = NEW.agency_id AND a.owner_user_id = v_uid
      ) THEN
        RAISE EXCEPTION '所属相談所は、自分が持ち主の相談所だけを指定できます';
      END IF;
      -- 招待トークンの発行・差し替えは相談所オーナーだけ
      IF NEW.invite_token IS DISTINCT FROM OLD.invite_token AND NOT EXISTS (
        SELECT 1 FROM agencies a WHERE a.id = NEW.agency_id AND a.owner_user_id = v_uid
      ) THEN
        RAISE EXCEPTION '招待の発行は相談所オーナーだけができます';
      END IF;
    END IF;

  ELSIF TG_TABLE_NAME = 'agencies' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_demo            := false;
      NEW.stripe_customer_id := NULL;
      NEW.card_registered_at := NULL;
    ELSE
      IF NEW.is_demo            IS DISTINCT FROM OLD.is_demo
      OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
      OR NEW.card_registered_at IS DISTINCT FROM OLD.card_registered_at
      OR NEW.owner_user_id      IS DISTINCT FROM OLD.owner_user_id THEN
        RAISE EXCEPTION 'サンプル設定・お支払い情報・持ち主は変更できません';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_counselors_guard_columns ON public.counselors;
CREATE TRIGGER trg_counselors_guard_columns
  BEFORE INSERT OR UPDATE ON public.counselors
  FOR EACH ROW EXECUTE FUNCTION public.guard_counselor_agency_columns();

DROP TRIGGER IF EXISTS trg_agencies_guard_columns ON public.agencies;
CREATE TRIGGER trg_agencies_guard_columns
  BEFORE INSERT OR UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION public.guard_counselor_agency_columns();

-- ─────────────────────────────────────────────
-- (2) 公開範囲：カード登録済みの相談所だけ
--     本番では DROP/CREATE ではなく ALTER POLICY で中身だけ差し替えた（名前・対象ロールは従来のまま）
-- ─────────────────────────────────────────────

ALTER POLICY agencies_select ON public.agencies
  USING (
    (is_published = true AND (coalesce(is_demo, false) = true OR card_registered_at IS NOT NULL))
    OR owner_user_id = auth.uid()
    OR is_admin()
  );

ALTER POLICY counselors_select ON public.counselors
  USING (
    (
      is_published = true
      AND (
        coalesce(is_demo, false) = true
        OR EXISTS (
          SELECT 1 FROM agencies a
          WHERE a.id = counselors.agency_id AND a.card_registered_at IS NOT NULL
        )
      )
    )
    OR owner_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM agencies a
      WHERE a.id = counselors.agency_id AND a.owner_user_id = auth.uid()
    )
    OR is_admin()
  );

-- ─────────────────────────────────────────────
-- (3) shop-media は運営だけが書き込める（ポリシー名は従来のまま）
-- ─────────────────────────────────────────────

ALTER POLICY "shop-media auth insert" ON storage.objects
  WITH CHECK (bucket_id = 'shop-media' AND public.is_admin());
ALTER POLICY "shop-media auth update" ON storage.objects
  USING (bucket_id = 'shop-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'shop-media' AND public.is_admin());
ALTER POLICY "shop-media auth delete" ON storage.objects
  USING (bucket_id = 'shop-media' AND public.is_admin());

-- 適用時の確認（2026-10-11・最後に例外を投げて取り消す DO ブロックで実施）
--   管理者でない会員として：自作カウンセラーの rating_avg / review_count / is_demo 変更 → 拒否、
--   自作相談所の stripe_customer_id / card_registered_at 変更 → 拒否、Emma への所属変更・新規作成 → 拒否、
--   bio・is_published・description の通常更新 → 通る、自分の相談所での招待発行 → 通る、
--   INSERT 時の rating 4.9/30・is_demo・stripe_customer_id の指定 → 0/0・false・null に置き換わる、
--   未ログインからは、カード未登録の相談所とそのカウンセラーが見えない。
--   注意：小山楓華のアカウントは admin_users にも入っているため、ガードは素通りする（運営として正しい）。
