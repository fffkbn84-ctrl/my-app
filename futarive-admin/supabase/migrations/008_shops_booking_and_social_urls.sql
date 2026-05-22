-- L-2: お店の予約・SNS 導線フィールド追加
-- 適用日: 2026-05-22
--
-- カフェなど Instagram が主予約口のお店も含めて柔軟に対応できるよう
-- 3 種類の URL を持つ。詳細ページで booking_url > instagram_url > other_social_url
-- の優先順でメイン CTA を出し分け、設定されている他のリンクはサブアイコンとして並べる。

ALTER TABLE public.shops
  ADD COLUMN IF NOT EXISTS booking_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS other_social_url text;

COMMENT ON COLUMN public.shops.booking_url IS '予約サイト URL（最優先で表示するメイン CTA）';
COMMENT ON COLUMN public.shops.instagram_url IS 'Instagram プロフィール URL（DM 予約導線等）';
COMMENT ON COLUMN public.shops.other_social_url IS 'その他 SNS / 公式サイト URL';
