-- Stripe 決済導入（TASK7）。additive・冪等。
-- 相談所(agencies)に Stripe Customer ID、予約(reservations)に決済関連カラムを追加。
-- 決済フロー：相談所がカード登録(SetupIntent)→ ユーザー予約成立で即時 ¥5,000 を
-- off_session 課金 → Webhook(payment_intent.succeeded) で paid_at / user_info_visible
-- を更新し、相談所にユーザー連絡先を開示する。
alter table public.agencies add column if not exists stripe_customer_id text;

alter table public.reservations
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_refund_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists refunded_at timestamptz,
  add column if not exists user_info_visible boolean default false;
