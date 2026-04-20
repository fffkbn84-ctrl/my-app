-- counselorsテーブルにリール表示用カラムを追加
ALTER TABLE counselors
  ADD COLUMN IF NOT EXISTS catchphrase TEXT,
  ADD COLUMN IF NOT EXISTS reel_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS reel_order INTEGER DEFAULT 0;

-- リール用メディアテーブル（1カウンセラー複数画像/動画）
CREATE TABLE IF NOT EXISTS counselor_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',  -- 'image' | 'video'
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_counselor_media_counselor
  ON counselor_media(counselor_id, display_order);

-- RLS: 公開カウンセラーのメディアは誰でも閲覧可、書き込みは認証ユーザーのみ
ALTER TABLE counselor_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published counselor media"
  ON counselor_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM counselors
      WHERE counselors.id = counselor_media.counselor_id
        AND counselors.is_published = true
        AND counselors.reel_enabled = true
    )
  );

CREATE POLICY "authenticated full access counselor media"
  ON counselor_media FOR ALL
  USING (auth.role() = 'authenticated');
