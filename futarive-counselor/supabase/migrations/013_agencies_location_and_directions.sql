-- ============================================================
-- 013_agencies_location_and_directions.sql
-- agencies に「会場へのアクセス」表示用カラム3つを追加
-- ============================================================
-- 目的：
-- ユーザー画面（カウンセラー詳細・予約完了・マイページ予約詳細）で
-- 「所在地 / アクセス / 最寄駅からの行き方」を表示できるよう、
-- 相談所が自分で編集できるテキストフィールドを agencies に追加する。
--
-- 既存:
--   business_hours_text (営業時間 自由記述) … user-site で hours として表示
--   closed_weekdays (定休日 曜日配列)        … user-site で holiday として表示
--
-- 今回追加:
--   address    所在地（例: 東京都中央区銀座4-12-3 ビル4F）
--   access     最寄駅からのアクセス概要（例: 東銀座駅 徒歩3分）
--   directions 最寄駅からの行き方（複数行、地図と併用してユーザーが迷わないよう案内）
--
-- 使い方：Supabase ダッシュボード > SQL Editor で本ファイルを実行。
-- ============================================================

alter table public.agencies
  add column if not exists address text,
  add column if not exists access text,
  add column if not exists directions text;

comment on column public.agencies.address    is '所在地（フリーテキスト）';
comment on column public.agencies.access     is '最寄駅などの簡潔なアクセス（例：銀座駅 徒歩3分）';
comment on column public.agencies.directions is '最寄駅からの行き方（フリーテキスト、改行可）';
