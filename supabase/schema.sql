-- ふたりへ データベーススキーマ
-- Supabase SQL Editorで実行してください

-- ===== ENUM型 =====
CREATE TYPE slot_status AS ENUM ('open', 'locked', 'booked');
CREATE TYPE review_source_type AS ENUM ('face_to_face', 'proxy');
CREATE TYPE shop_badge_type AS ENUM ('certified', 'agency', 'listed');

-- ===== agencies（相談所）=====
CREATE TABLE agencies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  logo_url    TEXT,
  website_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== counselors（カウンセラー）=====
CREATE TABLE counselors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id           UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  bio                 TEXT,
  photo_url           TEXT,
  specialties         TEXT[],
  years_of_experience INT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== slots（予約枠）=====
CREATE TABLE slots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
  start_at     TIMESTAMPTZ NOT NULL,
  end_at       TIMESTAMPTZ NOT NULL,
  status       slot_status NOT NULL DEFAULT 'open',
  locked_until TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_slots_counselor_status ON slots(counselor_id, status);
CREATE INDEX idx_slots_start_at ON slots(start_at);

-- ===== reservations（予約）=====
CREATE TABLE reservations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id           UUID NOT NULL REFERENCES slots(id) ON DELETE RESTRICT,
  counselor_id      UUID NOT NULL REFERENCES counselors(id) ON DELETE RESTRICT,
  user_name         TEXT NOT NULL,
  user_email        TEXT NOT NULL,
  user_phone        TEXT,
  notes             TEXT,
  review_token      TEXT UNIQUE,
  review_code       TEXT,
  review_token_used BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== reviews（口コミ）=====
CREATE TABLE reviews (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id   UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body           TEXT NOT NULL,
  source_type    review_source_type NOT NULL DEFAULT 'face_to_face',
  agency_reply   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_counselor ON reviews(counselor_id);

-- ===== shops（お店）=====
CREATE TABLE shops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID REFERENCES agencies(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  category    TEXT,
  description TEXT,
  address     TEXT,
  photo_url   TEXT,
  badge_type  shop_badge_type NOT NULL DEFAULT 'listed',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== columns（コラム記事）=====
CREATE TABLE columns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  body          TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== episodes（成婚エピソード）=====
CREATE TABLE episodes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  body          TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== updated_at 自動更新トリガー =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agencies_updated_at    BEFORE UPDATE ON agencies    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_counselors_updated_at  BEFORE UPDATE ON counselors  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_slots_updated_at       BEFORE UPDATE ON slots       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated_at     BEFORE UPDATE ON reviews     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_shops_updated_at       BEFORE UPDATE ON shops       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_columns_updated_at     BEFORE UPDATE ON columns     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_episodes_updated_at    BEFORE UPDATE ON episodes    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== ロック期限切れ自動解放（pg_cron）=====
-- SupabaseダッシュボードのDatabase → Extensions で pg_cron を有効にしてから実行
-- SELECT cron.schedule('release-expired-locks', '* * * * *', $$
--   UPDATE slots SET status = 'open', locked_until = NULL
--   WHERE status = 'locked' AND locked_until < now();
-- $$);

-- ===== Row Level Security =====
ALTER TABLE agencies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops       ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes    ENABLE ROW LEVEL SECURITY;

-- 公開読み取りポリシー（誰でも閲覧可）
CREATE POLICY "public read agencies"    ON agencies    FOR SELECT USING (true);
CREATE POLICY "public read counselors"  ON counselors  FOR SELECT USING (true);
CREATE POLICY "public read slots"       ON slots       FOR SELECT USING (true);
CREATE POLICY "public read reviews"     ON reviews     FOR SELECT USING (true);
CREATE POLICY "public read shops"       ON shops       FOR SELECT USING (true);
CREATE POLICY "public read columns"     ON columns     FOR SELECT USING (true);
CREATE POLICY "public read episodes"    ON episodes    FOR SELECT USING (true);

-- 書き込みはservice_role（バックエンドAPIのみ）
-- reservations, reviews の INSERT はAPI Route経由で service_role キーを使って行う
