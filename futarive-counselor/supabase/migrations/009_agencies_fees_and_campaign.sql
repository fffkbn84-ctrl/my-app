-- ============================================================
-- 009_agencies_fees_and_campaign.sql
-- agencies に料金プラン配列とキャンペーン情報を追加
-- ============================================================
-- カウンセラー管理画面（agency 編集）から相談所が編集できる
-- 料金プランとキャンペーンを格納する。
--
-- fees: 料金プラン配列 [{label, amount, note}]
--   label: '入会金' '月会費' '成婚料' or 独自名
--   amount: 円単位の整数（0 = 無料）
--   note: 補足説明（任意） ex 'ご希望者のみ'
-- campaign_text: キャンペーン本文 ex '5/31までの入会で入会金0円!'
-- campaign_expires_at: 有効期限（NULL = 無期限／期限切れは UI で非表示）
--
-- 使い方: Supabase ダッシュボード > SQL Editor で実行
--         （MCP の apply_migration 経由で 2026-05-11 適用済み）
-- ============================================================

ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS fees JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS campaign_text TEXT,
  ADD COLUMN IF NOT EXISTS campaign_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN agencies.fees IS '料金プラン配列。要素は {label: string, amount: number, note: string|null}';
COMMENT ON COLUMN agencies.campaign_text IS 'キャンペーン本文（例：5/31までの入会で入会金0円!）';
COMMENT ON COLUMN agencies.campaign_expires_at IS 'キャンペーン有効期限。NULL なら無期限';
