-- ============================================================
-- 010_agencies_founded_at.sql
-- agencies に「創業日」を手入力できるカラムを追加
-- ============================================================
-- 既存の created_at は Supabase 登録日（プラットフォーム参加日）であり、
-- 相談所自体の創業日とは異なるため別カラムとして管理する。
-- 「新店舗」バッジの判定はこの founded_at を使う
-- （NULL の場合はバッジ非表示）。
--
-- 使い方: Supabase ダッシュボード > SQL Editor で実行
--         （MCP の apply_migration 経由で 2026-05-11 適用済み）
-- ============================================================

ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS founded_at DATE;

COMMENT ON COLUMN agencies.founded_at IS '相談所の創業日（手入力）。「新店舗」バッジ判定の基準日。NULL ならバッジ非表示';
