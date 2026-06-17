-- 040: 予約フォームの氏名/フリガナを本人だけが読み書きできる形で保存（次回以降の自動入力用）。
-- profiles は public read のため本名を置けない → owner 限定の専用テーブルにする。
CREATE TABLE IF NOT EXISTS public.user_booking_defaults (
  user_id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      text,
  full_name_kana text,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_booking_defaults ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own booking defaults select" ON public.user_booking_defaults;
CREATE POLICY "own booking defaults select" ON public.user_booking_defaults
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "own booking defaults insert" ON public.user_booking_defaults;
CREATE POLICY "own booking defaults insert" ON public.user_booking_defaults
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "own booking defaults update" ON public.user_booking_defaults;
CREATE POLICY "own booking defaults update" ON public.user_booking_defaults
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
