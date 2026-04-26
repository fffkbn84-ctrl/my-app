-- ふたりへ — Kinda talk 営業デモ用シードデータ
-- 002_kinda_talk_extensions.sql 実行後に実行してください
--
-- このシードは「他相談所への営業時にこう見える」を見せるためのサンプル。
-- 全て is_demo=true で、UI 側で「サンプル」バッジが表示される。
-- 実カウンセラー（Emma 所属など）はこの SQL では投入しない。
--
-- 注意: 同じ name のレコードがあれば INSERT をスキップしたい場合は、
--       ON CONFLICT 句を追加してください（現状は単純 INSERT）。

-- ===== ダミー相談所 2件 =====
INSERT INTO agencies (name, area, description, is_demo, is_published)
VALUES
  ('ブライダルハウス銀座（サンプル）', '東京・銀座',
   '営業説明用のサンプル相談所です。実在しません。', TRUE, TRUE),
  ('マリッジサポート梅田（サンプル）', '大阪・梅田',
   '営業説明用のサンプル相談所です。実在しません。', TRUE, TRUE);

-- ===== ダミーカウンセラー 5名 =====
-- agency_id は上で INSERT したダミー相談所を name で引いて参照
WITH ag AS (
  SELECT id, name FROM agencies WHERE is_demo = TRUE
)
INSERT INTO counselors (
  agency_id, name, area, role, bio, intro, quote, message,
  catchphrase, specialties, qualifications, fee,
  matching_types, years_of_experience,
  rating_avg, review_count, is_published, is_demo,
  reel_enabled, reel_order
)
VALUES
  ((SELECT id FROM ag WHERE name = 'ブライダルハウス銀座（サンプル）'),
   '藤村 詩織（サンプル）', '東京・銀座', 'シニアブライダルカウンセラー',
   '（サンプル表示）ブライダルハウス銀座で15年カウンセラーを務めています。',
   '（サンプル表示）30〜40代女性を中心に、再婚や仕事との両立など、人生のステージに合わせたサポートを大切にしています。',
   '焦らず、流されず、選ぶ', '（サンプル）あなたのペースで、丁寧に。',
   '丁寧に、納得のいく出会いを',
   ARRAY['再婚サポート','30〜40代女性','実績重視'],
   ARRAY['IBJ認定カウンセラー'],
   '入会金 110,000円 / 月会費 18,000円〜',
   ARRAY['anshin','restart'], 15, 4.9, 28, TRUE, TRUE, TRUE, 100),

  ((SELECT id FROM ag WHERE name = 'マリッジサポート梅田（サンプル）'),
   '吉岡 結衣（サンプル）', '大阪・梅田', 'ブライダルカウンセラー',
   '（サンプル表示）マリッジサポート梅田所属。',
   '（サンプル表示）8年間で「自分が本当は何を求めているのか」を一緒に見つけることを大切にしてきました。',
   '好きの輪郭が、相手を引き寄せる', '（サンプル）自分の軸を、一緒に見つけましょう。',
   'あなたの「好き」から始めよう',
   ARRAY['自分軸の発見','20〜30代','関西'],
   ARRAY['IBJ認定カウンセラー','心理カウンセラー資格'],
   '入会金 80,000円 / 月会費 13,000円〜',
   ARRAY['jibunjiku'], 8, 4.8, 19, TRUE, TRUE, TRUE, 101),

  ((SELECT id FROM ag WHERE name = 'マリッジサポート梅田（サンプル）'),
   '山本 健太（サンプル）', '福岡・天神', 'ブライダルカウンセラー',
   '（サンプル表示）天神マリッジセンター所属。',
   '（サンプル表示）12年間蓄積したデータをもとに、確率を上げる行動を一緒に設計します。',
   '感情と数字、両方で結婚する', '（サンプル）データに基づく戦略で、確実に。',
   'データで選ぶ、最短の道',
   ARRAY['戦略立案','データ分析','男性目線アドバイス'],
   ARRAY['IBJ認定カウンセラー','MBA'],
   '入会金 90,000円 / 月会費 14,000円〜',
   ARRAY['senryaku'], 12, 4.7, 31, TRUE, TRUE, TRUE, 102),

  ((SELECT id FROM ag WHERE name = 'ブライダルハウス銀座（サンプル）'),
   '中村 さくら（サンプル）', '名古屋・栄', 'ブライダルカウンセラー',
   '（サンプル表示）栄ブライダルカフェ所属。',
   '（サンプル表示）5年間、全力で寄り添うことを大切にしてきました。',
   '本気は、最強の武器', '（サンプル）二人三脚で、本気で婚活します。',
   '本気のあなたと、本気で走ります',
   ARRAY['全力サポート','明るい雰囲気','20〜30代'],
   ARRAY['IBJ認定カウンセラー'],
   '入会金 70,000円 / 月会費 11,000円〜',
   ARRAY['zenryoku'], 5, 4.9, 14, TRUE, TRUE, TRUE, 103),

  ((SELECT id FROM ag WHERE name = 'マリッジサポート梅田（サンプル）'),
   '高橋 玲奈（サンプル）', 'オンライン', 'ブライダルカウンセラー',
   '（サンプル表示）オンライン専門 RING 所属。',
   '（サンプル表示）10年間、忙しい方の婚活をサポート。',
   '無理なく続くことが、いちばんの近道', '（サンプル）忙しい毎日でも、無理なく続けられる婚活を。',
   '仕事も、婚活も、両立できる',
   ARRAY['オンライン専門','ライフスタイル両立','全国対応'],
   ARRAY['IBJ認定カウンセラー'],
   '入会金 60,000円 / 月会費 11,000円〜',
   ARRAY['lifestyle'], 10, 4.8, 22, TRUE, TRUE, TRUE, 104);

-- ===== ダミーリール画像（counselor_media）=====
-- 各ダミーカウンセラーごとに 2〜3 枚ずつ。
-- 本番では media_url に Supabase Storage の画像 URL を入れる。
-- ここではグラデーション fallback_bg のみ設定し、media_url はプレースホルダー透過 PNG。
WITH dc AS (
  SELECT id, name FROM counselors WHERE is_demo = TRUE
)
INSERT INTO counselor_media (counselor_id, media_url, media_type, caption, display_order, fallback_bg)
VALUES
  -- 藤村 詩織
  ((SELECT id FROM dc WHERE name = '藤村 詩織（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '丁寧に、納得のいく出会いを', 1, 'linear-gradient(135deg,#FAEAE5,#F0D8D0)'),
  ((SELECT id FROM dc WHERE name = '藤村 詩織（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '15年の実績でサポート', 2, 'linear-gradient(160deg,#F0E5D6,#E0D0BC)'),
  ((SELECT id FROM dc WHERE name = '藤村 詩織（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '再婚も、年齢も、関係なく', 3, 'linear-gradient(135deg,#FAF3DE,#F4E8C4)'),

  -- 吉岡 結衣
  ((SELECT id FROM dc WHERE name = '吉岡 結衣（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   'あなたの「好き」から始めよう', 1, 'linear-gradient(135deg,#E8EEF0,#D0DFE4)'),
  ((SELECT id FROM dc WHERE name = '吉岡 結衣（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '8年間、自分軸を一緒に探してきました', 2, 'linear-gradient(160deg,#FAEAE5,#F0D8D0)'),

  -- 山本 健太
  ((SELECT id FROM dc WHERE name = '山本 健太（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   'データで選ぶ、最短の道', 1, 'linear-gradient(135deg,#E0ECF8,#C4D8EC)'),
  ((SELECT id FROM dc WHERE name = '山本 健太（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '12年分のデータが、あなたを支える', 2, 'linear-gradient(160deg,#D8EAE0,#C0D8CA)'),

  -- 中村 さくら
  ((SELECT id FROM dc WHERE name = '中村 さくら（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '本気のあなたと、本気で走ります', 1, 'linear-gradient(135deg,#F5E5E1,#ECC8C5)'),
  ((SELECT id FROM dc WHERE name = '中村 さくら（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '全力で、結婚を一緒に取りに行く', 2, 'linear-gradient(160deg,#FAF3DE,#F4E8C4)'),

  -- 高橋 玲奈
  ((SELECT id FROM dc WHERE name = '高橋 玲奈（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '仕事も、婚活も、両立できる', 1, 'linear-gradient(135deg,#F0E5D6,#E0D0BC)'),
  ((SELECT id FROM dc WHERE name = '高橋 玲奈（サンプル）'),
   '/images/placeholders/transparent.png', 'image',
   '全国どこからでもオンラインで', 2, 'linear-gradient(160deg,#E0ECF8,#C4D8EC)');
