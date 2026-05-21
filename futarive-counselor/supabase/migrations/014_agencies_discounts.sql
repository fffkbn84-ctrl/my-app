-- ============================================================
-- 014_agencies_discounts.sql
-- agencies テーブルに「割引一覧」JSONB カラムを追加
-- ============================================================
-- 目的：
-- U30割引・乗り換え割引・キャンペーン割引など、プラン横断の
-- 割引情報を管理する。料金プラン（fees）とは独立した「お得情報」枠。
--
-- 構造（TypeScript）:
--   type Discount = {
--     label: string         例: "U30割引" "乗り換え割" "学割"
--     condition?: string    例: "29歳以下の方"
--     amount?: number       例: 20000（円） or null（%表記時）
--     percent?: number      例: 20（%）or null（円表記時）
--     note?: string         例: "他キャンペーンと併用不可"
--   }
--
-- 使い方：Supabase ダッシュボード > SQL Editor で本ファイルを実行。
-- ============================================================

alter table public.agencies
  add column if not exists discounts jsonb not null default '[]'::jsonb;

comment on column public.agencies.discounts is
  '割引一覧。{label, condition?, amount?, percent?, note?} の配列。料金プラン横断のお得情報枠。';
