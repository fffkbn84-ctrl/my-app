-- ふたりへ — Kinda talk 用 スキーマ拡張マイグレーション
-- Supabase SQL Editor で実行してください
-- 実行順: 001_add_columns.sql の次に実行する想定

-- ===== counselors に Kinda talk リール用カラムを追加 =====
ALTER TABLE counselors
  ADD COLUMN IF NOT EXISTS catchphrase    TEXT,           -- リール1枚目に表示、20字以内
  ADD COLUMN IF NOT EXISTS intro          TEXT,           -- 個別ページの自己紹介本文
  ADD COLUMN IF NOT EXISTS area           TEXT,           -- "東京・銀座" などの表示用エリア
  ADD COLUMN IF NOT EXISTS role           TEXT,           -- "シニアブライダルカウンセラー" など
  ADD COLUMN IF NOT EXISTS qualifications TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS fee            TEXT,           -- 料金の表示用文字列
  ADD COLUMN IF NOT EXISTS matching_types TEXT[] DEFAULT '{}',  -- Kinda type（最大2）
  ADD COLUMN IF NOT EXISTS is_demo        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reel_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS reel_order     INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS message        TEXT;           -- カード末尾のひと言メッセージ

-- インデックス
CREATE INDEX IF NOT EXISTS idx_counselors_published_demo
  ON counselors(is_published, is_demo);
CREATE INDEX IF NOT EXISTS idx_counselors_matching_types
  ON counselors USING GIN (matching_types);
CREATE INDEX IF NOT EXISTS idx_counselors_reel_order
  ON counselors(reel_order, rating_avg);

-- ===== counselor_media（リール画像）テーブル新規作成 =====
CREATE TABLE IF NOT EXISTS counselor_media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id  UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
  media_url     TEXT NOT NULL,                    -- Supabase Storage URL or 外部URL
  media_type    TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption       TEXT,                             -- リール画像下部に重ねるキャプション
  display_order INT NOT NULL DEFAULT 0,
  /** モック互換: 画像URLが無い時に背景グラデーションを使う場合の CSS gradient */
  fallback_bg   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_counselor_media_counselor_order
  ON counselor_media(counselor_id, display_order);

-- updated_at 自動更新トリガー
CREATE TRIGGER trg_counselor_media_updated_at
  BEFORE UPDATE ON counselor_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== Row Level Security =====
ALTER TABLE counselor_media ENABLE ROW LEVEL SECURITY;

-- 公開カウンセラーのメディアは誰でも参照可
DROP POLICY IF EXISTS "public read counselor_media" ON counselor_media;
CREATE POLICY "public read counselor_media" ON counselor_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM counselors
      WHERE counselors.id = counselor_media.counselor_id
        AND counselors.is_published = TRUE
    )
  );

-- ===== agencies に area カラム追加（既存サイトコードが期待しているが未追加だったため）=====
ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS area      TEXT,
  ADD COLUMN IF NOT EXISTS is_demo   BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;
