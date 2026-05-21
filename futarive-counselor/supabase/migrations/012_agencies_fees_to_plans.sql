-- ============================================================
-- 012_agencies_fees_to_plans.sql
-- agencies.fees を多プラン構造に切替
-- ============================================================
-- 旧: [{label, amount, note}]
--     （フラット 1 プラン相当）
-- 新: [{name, popular?, items: [{label, amount, suffix?, note?}]}]
--     （複数プラン対応・各項目に表示サフィックス追加）
--
-- 既存データ（フラット形式）は「スタンダード」という名前の単一プランで
-- ラップする形に自動変換する。
-- 既に新形式（要素が "items" を持つ）の場合は何もしない。
--
-- suffix の意図:
--   '/月' '/回' '/年' 等の表示単位。
--   未指定（null）& amount > 0 なら user-side で「(税込)」を自動付与
--   amount === 0 なら「無料」と緑色で表示
--
-- 使い方: Supabase ダッシュボード > SQL Editor で実行
--         （MCP の apply_migration 経由で 2026-05-11 適用済み）
-- ============================================================

UPDATE agencies
SET fees = jsonb_build_array(
  jsonb_build_object(
    'name', 'スタンダード',
    'items', fees
  )
)
WHERE jsonb_typeof(fees) = 'array'
  AND jsonb_array_length(fees) > 0
  AND (fees->0 ? 'label')           -- 旧形式: 要素が label を持つ
  AND NOT (fees->0 ? 'items');      -- 既に新形式なら触らない

COMMENT ON COLUMN agencies.fees IS '料金プラン配列。要素は {name: string, popular?: boolean, items: [{label, amount, suffix?, note?}]}';
