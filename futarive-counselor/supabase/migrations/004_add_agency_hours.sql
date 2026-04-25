-- ============================================================
-- agencies テーブルに営業時間・面談可能時間・定休日カラムを追加
-- ============================================================
-- 相談所プロフィールで管理する情報を増やし、カウンセラー管理画面の
-- 予約枠カレンダーに自動反映させるために以下のカラムを追加する。
--
-- 使い方：Supabase ダッシュボード > SQL Editor で本ファイルを実行。
-- ============================================================

alter table public.agencies
  add column if not exists business_hours_text       text,         -- 自由記述の営業時間（表示用）
  add column if not exists consultation_start_time   time,         -- 面談可能 開始時刻（例 10:00:00）
  add column if not exists consultation_end_time     time,         -- 面談可能 終了時刻（例 19:00:00）
  add column if not exists closed_weekdays           smallint[];   -- 定休日の曜日配列 0=日,1=月,...,6=土

-- 終了が開始より後であることを保証
alter table public.agencies
  drop constraint if exists agencies_consultation_time_check;
alter table public.agencies
  add constraint agencies_consultation_time_check
  check (
    consultation_start_time is null
    or consultation_end_time is null
    or consultation_end_time > consultation_start_time
  );

-- 既存行のデフォルト値（任意。空のままでもOK）
update public.agencies
set
  consultation_start_time = coalesce(consultation_start_time, '10:00'::time),
  consultation_end_time = coalesce(consultation_end_time, '19:00'::time)
where consultation_start_time is null or consultation_end_time is null;
