-- Kinda ふたりへ — profiles（ユーザープロフィール）テーブル
-- マイグレーション 017 の後に実行
--
-- ニックネームを口コミに表示するための最小プロフィール。
-- 認証ユーザーごとに 1 行（id = auth.users.id）。
-- 他者からも nickname だけは見えるようにする（口コミ表示用）。

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE profiles IS 'ユーザーのプロフィール。ニックネームは口コミ表示で使用。';

-- 更新時に updated_at を自動更新
CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- auth.users に新規登録された時、profiles 行を自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 既存ユーザーぶんも profiles を埋める（idempotent）
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ===== Row Level Security =====
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 全員が SELECT 可（口コミ表示で nickname が必要なため）
DROP POLICY IF EXISTS "profiles public read" ON profiles;
CREATE POLICY "profiles public read" ON profiles
  FOR SELECT
  USING (true);

-- 自分の行のみ UPDATE 可
DROP POLICY IF EXISTS "users update own profile" ON profiles;
CREATE POLICY "users update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 自分の行のみ INSERT 可（トリガで自動作成されるが念のため）
DROP POLICY IF EXISTS "users insert own profile" ON profiles;
CREATE POLICY "users insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
