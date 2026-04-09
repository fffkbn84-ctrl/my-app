-- ふたりへ — スキーマ追加マイグレーション
-- Supabase SQL Editor で実行してください

-- counselors に必要なカラムを追加
ALTER TABLE counselors
  ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS diagnosis_type TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS quote TEXT,
  ADD COLUMN IF NOT EXISTS experience_label TEXT;

-- reviews に必要なカラムを追加
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewer_age_range TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_gender TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_area TEXT;

-- shops に必要なカラムを追加
ALTER TABLE shops
  ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stage TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS features TEXT[],
  ADD COLUMN IF NOT EXISTS hours TEXT,
  ADD COLUMN IF NOT EXISTS holiday TEXT,
  ADD COLUMN IF NOT EXISTS access TEXT,
  ADD COLUMN IF NOT EXISTS scenes TEXT[];

-- episodes を再設計（既存テーブルにカラム追加）
ALTER TABLE episodes
  ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES agencies(id),
  ADD COLUMN IF NOT EXISTS counselor_id UUID REFERENCES counselors(id),
  ADD COLUMN IF NOT EXISTS period TEXT,
  ADD COLUMN IF NOT EXISTS year TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS story TEXT[],
  ADD COLUMN IF NOT EXISTS quote TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS sympathy_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS person1_initial TEXT,
  ADD COLUMN IF NOT EXISTS person1_age INTEGER,
  ADD COLUMN IF NOT EXISTS person1_color TEXT,
  ADD COLUMN IF NOT EXISTS person2_initial TEXT,
  ADD COLUMN IF NOT EXISTS person2_age INTEGER,
  ADD COLUMN IF NOT EXISTS person2_color TEXT;

-- diagnosis_results テーブルを新規作成
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  result_type TEXT NOT NULL,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

-- diagnosis_results: 誰でも INSERT 可能（匿名診断）
CREATE POLICY IF NOT EXISTS "Anyone can insert diagnosis results"
  ON diagnosis_results FOR INSERT WITH CHECK (true);

-- diagnosis_results: 自分のセッションのみ SELECT 可能
CREATE POLICY IF NOT EXISTS "Users can read own diagnosis results"
  ON diagnosis_results FOR SELECT USING (true);
