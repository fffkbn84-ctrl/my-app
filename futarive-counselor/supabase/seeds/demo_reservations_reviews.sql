-- ────────────────────────────────────────────────────────────────────
-- デモデータ投入: 予約 & 口コミ
-- ────────────────────────────────────────────────────────────────────
-- 使い方:
--   1) Supabase ダッシュボード → SQL Editor を開く
--   2) このファイル全体をコピペして「Run」
--   3) ログイン中のカウンセラーレコード（owner_user_id = auth.uid()）に
--      面談済み予約 3件・口コミ 4件（うち 1件は未返信、★3 含む）を生成
--
-- 想定されるユースケース:
--   - 統括管理画面・カウンセラー管理画面の表示確認
--   - ダッシュボード「未返信レビュー」「平均評価」「今月の予約」の数字確認
--   - レビュー画面のフィルター（未返信 / ★4以上 / ★3以下）の挙動確認
--
-- 後始末:
--   下部にある「ROLLBACK」セクションのコメントを外して実行すれば
--   投入したデモデータだけきれいに削除できる。
-- ────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_user_id   uuid := auth.uid();
  v_counselor counselors%ROWTYPE;
  v_agency_id uuid;
  v_slot1     uuid;
  v_slot2     uuid;
  v_slot3     uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '認証セッションが見つかりません。Supabase ダッシュボードにログインした状態で実行してください';
  END IF;

  -- ログイン中のオーナーが管理しているカウンセラー1件を取得
  SELECT *
    INTO v_counselor
    FROM counselors
   WHERE owner_user_id = v_user_id
      OR agency_id IN (SELECT id FROM agencies WHERE owner_user_id = v_user_id)
   ORDER BY created_at
   LIMIT 1;

  IF v_counselor.id IS NULL THEN
    RAISE EXCEPTION '対象のカウンセラーが見つかりません。先にプロフィールを作成してください';
  END IF;

  v_agency_id := v_counselor.agency_id;

  RAISE NOTICE 'Seeding for counselor: % (id=%)', v_counselor.name, v_counselor.id;

  -- ── 予約済みスロット 3つ作成（過去/今日/今週末） ─────────────
  INSERT INTO slots (counselor_id, start_time, end_time, status)
  VALUES
    (v_counselor.id, (now() - interval '7 days')::date + time '14:00',
                     (now() - interval '7 days')::date + time '15:00', 'booked')
  RETURNING id INTO v_slot1;

  INSERT INTO slots (counselor_id, start_time, end_time, status)
  VALUES
    (v_counselor.id, (now() - interval '3 days')::date + time '10:30',
                     (now() - interval '3 days')::date + time '11:30', 'booked')
  RETURNING id INTO v_slot2;

  INSERT INTO slots (counselor_id, start_time, end_time, status)
  VALUES
    (v_counselor.id, (now() + interval '2 days')::date + time '16:00',
                     (now() + interval '2 days')::date + time '17:00', 'booked')
  RETURNING id INTO v_slot3;

  -- ── 予約 3件 ───────────────────────────────────────────────
  INSERT INTO reservations (
    slot_id, counselor_id, user_name, user_email, user_phone, memo,
    review_token, review_code
  ) VALUES
    (v_slot1, v_counselor.id, '佐藤 美穂', 'demo-miho@example.com', '090-1234-5678',
     '初めての面談です。緊張していますが、よろしくお願いします。',
     'demo-token-' || substr(md5(random()::text), 1, 8),
     upper(substr(md5(random()::text), 1, 6))),
    (v_slot2, v_counselor.id, '田中 麻衣', 'demo-mai@example.com', '080-2345-6789',
     '婚活を始めて半年、リブートしたい気持ちです。',
     'demo-token-' || substr(md5(random()::text), 1, 8),
     upper(substr(md5(random()::text), 1, 6))),
    (v_slot3, v_counselor.id, '鈴木 香織', 'demo-kaori@example.com', null,
     null, null, null);

  -- ── 口コミ 4件 ─────────────────────────────────────────────
  -- (1) ★5 返信済み
  INSERT INTO reviews (
    counselor_id, agency_id, rating, body, source_type,
    is_published, agency_reply, agency_replied_at,
    author_age_range, author_gender, author_area, created_at
  ) VALUES (
    v_counselor.id, v_agency_id, 5,
    '初回の面談で緊張していたのですが、こちらのペースに合わせて寄り添ってくださって、安心してお話しできました。今後の活動に前向きになれました。',
    'face_to_face', true,
    'こちらこそ、お話を聞かせていただき本当にありがとうございました。これからもふたりで楽しく進めていきましょう。',
    now() - interval '5 days',
    '20代後半', '女性', '東京都',
    now() - interval '7 days'
  );

  -- (2) ★4 返信済み
  INSERT INTO reviews (
    counselor_id, agency_id, rating, body, source_type,
    is_published, agency_reply, agency_replied_at,
    author_age_range, author_gender, author_area, created_at
  ) VALUES (
    v_counselor.id, v_agency_id, 4,
    '丁寧に話を聞いてくださったのが印象的でした。こちらの希望を尊重しつつ、客観的なアドバイスもいただけて参考になりました。',
    'face_to_face', true,
    '貴重なフィードバックをありがとうございます。これからも安心してご利用いただけるよう努めます。',
    now() - interval '2 days',
    '30代前半', '女性', '神奈川県',
    now() - interval '4 days'
  );

  -- (3) ★5 未返信（リスト先頭で目立つはず）
  INSERT INTO reviews (
    counselor_id, agency_id, rating, body, source_type,
    is_published, author_age_range, author_gender, author_area, created_at
  ) VALUES (
    v_counselor.id, v_agency_id, 5,
    '最初の一歩を踏み出すきっかけをくれた面談でした。まだ何も決めきれていない段階でも、否定せずに一緒に考えてくれる姿勢が印象に残っています。',
    'face_to_face', true,
    '30代前半', '女性', '東京都',
    now() - interval '1 day'
  );

  -- (4) ★3 未返信（urgent タグの確認用）
  INSERT INTO reviews (
    counselor_id, agency_id, rating, body, source_type,
    is_published, author_age_range, author_gender, author_area, created_at
  ) VALUES (
    v_counselor.id, v_agency_id, 3,
    '面談自体は丁寧でしたが、もう少し具体的なステップの提案があると嬉しかったです。次回の面談に期待しています。',
    'face_to_face', true,
    '20代後半', '女性', '埼玉県',
    now() - interval '6 hours'
  );

  -- カウンセラーの集計値を更新
  UPDATE counselors
     SET review_count = COALESCE((
            SELECT COUNT(*) FROM reviews
             WHERE counselor_id = v_counselor.id
               AND is_published = true), 0),
         rating_avg = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)::float FROM reviews
             WHERE counselor_id = v_counselor.id
               AND is_published = true), 0)
   WHERE id = v_counselor.id;

  RAISE NOTICE 'Seed complete: 3 reservations, 4 reviews';
END $$;

-- ────────────────────────────────────────────────────────────────────
-- ROLLBACK（投入したデモデータだけ消したい時）
-- ────────────────────────────────────────────────────────────────────
-- 以下のコメントを外して実行する。
-- 安全のため demo- で始まる review_token を持つ予約とそのスロット、
-- および本文に「面談自体は丁寧でしたが」など固有フレーズを含む口コミを削除する。
--
-- DELETE FROM reviews
--  WHERE body LIKE '初回の面談で緊張していたのですが%'
--     OR body LIKE '丁寧に話を聞いてくださったのが%'
--     OR body LIKE '最初の一歩を踏み出すきっかけ%'
--     OR body LIKE '面談自体は丁寧でしたが%';
--
-- DELETE FROM slots
--  WHERE id IN (
--    SELECT slot_id FROM reservations WHERE review_token LIKE 'demo-token-%' OR user_email LIKE 'demo-%@example.com'
--  );
--
-- DELETE FROM reservations
--  WHERE review_token LIKE 'demo-token-%'
--     OR user_email LIKE 'demo-%@example.com';
