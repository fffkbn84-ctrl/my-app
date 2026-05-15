-- 021_counselor_campaign_agency_documents.sql
-- カウンセラー個別キャンペーン + 相談所の入会時提出書類・全体注意事項
-- ※ プランオプションは fees JSONB 内の options[] として持つため別マイグレーション不要

-- カウンセラー個別キャンペーン（既存 user-site の Counselor.campaign と shape 合わせる）
ALTER TABLE counselors
  ADD COLUMN IF NOT EXISTS campaign_label TEXT,
  ADD COLUMN IF NOT EXISTS campaign_detail TEXT,
  ADD COLUMN IF NOT EXISTS campaign_expiry TEXT;

-- 相談所の入会時提出書類（複数可）と全体注意事項
ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS required_documents TEXT[],
  ADD COLUMN IF NOT EXISTS general_notes TEXT;

COMMENT ON COLUMN counselors.campaign_label IS 'カウンセラー個別キャンペーンの見出し（例：春の婚活応援キャンペーン）';
COMMENT ON COLUMN counselors.campaign_detail IS 'カウンセラー個別キャンペーンの説明';
COMMENT ON COLUMN counselors.campaign_expiry IS 'カウンセラー個別キャンペーンの期限表記（例：〜2026-06-30）';
COMMENT ON COLUMN agencies.required_documents IS '入会時に提出が必要な書類リスト（独身証明書、住民票 など）';
COMMENT ON COLUMN agencies.general_notes IS '相談所全体に適用される注意事項（複数行）';
