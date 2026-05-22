-- L-1 拡張: お店の写真アップロード基盤
-- 適用日: 2026-05-22
--
-- 1. shop_media テーブル（ギャラリー写真・SEO 用 caption/alt_text 持つ）
-- 2. shop-media Storage バケット
-- 3. RLS ポリシー（公開読み取り + authenticated 全操作）
--
-- 注意: お店のプロフィール画像（メイン1枚）は既存 shops.photo_url に保存。
-- ギャラリーは shop_media に複数行で保存し、display_order で並び替え可能。

-- ============================================
-- 1. shop_media テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS public.shop_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_media_shop_id_order_idx
  ON public.shop_media(shop_id, display_order);

-- ============================================
-- 2. RLS for shop_media
-- ============================================
ALTER TABLE public.shop_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon read shop_media" ON public.shop_media;
CREATE POLICY "anon read shop_media"
  ON public.shop_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "auth all shop_media" ON public.shop_media;
CREATE POLICY "auth all shop_media"
  ON public.shop_media FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ============================================
-- 3. Storage bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shop-media',
  'shop-media',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- 4. Storage RLS（shop-media バケット）
-- ============================================
DROP POLICY IF EXISTS "shop-media public read" ON storage.objects;
CREATE POLICY "shop-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-media');

DROP POLICY IF EXISTS "shop-media auth insert" ON storage.objects;
CREATE POLICY "shop-media auth insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'shop-media');

DROP POLICY IF EXISTS "shop-media auth update" ON storage.objects;
CREATE POLICY "shop-media auth update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'shop-media')
  WITH CHECK (bucket_id = 'shop-media');

DROP POLICY IF EXISTS "shop-media auth delete" ON storage.objects;
CREATE POLICY "shop-media auth delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'shop-media');
