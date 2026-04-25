-- ============================================================
-- slots テーブルに end_time カラムを追加
-- ============================================================
-- カウンセラー管理画面では SlotForm で開始時刻と終了時刻を入力するが、
-- DB の slots テーブルに end_time が無いと PGRST204 エラーで予約枠を
-- 追加できない。本マイグレーションでカラムを追加する。
--
-- Supabase ダッシュボード > SQL Editor で実行するか、
-- supabase db push で適用する。
-- ============================================================

-- 1. カラム追加（既にあれば何もしない）
alter table public.slots
  add column if not exists end_time timestamptz;

-- 2. 既存行で null になっていれば start_time + 1時間で埋める
update public.slots
set end_time = start_time + interval '1 hour'
where end_time is null;

-- 3. 今後 NOT NULL を強制（任意。安全のため推奨）
alter table public.slots
  alter column end_time set not null;

-- 4. （任意）整合性制約：終了時刻は開始時刻より後
alter table public.slots
  drop constraint if exists slots_end_after_start;
alter table public.slots
  add constraint slots_end_after_start check (end_time > start_time);
