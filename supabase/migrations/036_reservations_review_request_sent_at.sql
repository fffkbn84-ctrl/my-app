-- 口コミ促進メール（面談完了 completed 契機・運営名義）を
-- 「1予約につき1回だけ」送るための送信記録カラム。
-- user-site の cron API /api/cron/send-review-requests が、completed かつ
-- このカラムが NULL の予約に送信し、成功したら now() を書き込む（冪等化）。
alter table public.reservations add column if not exists review_request_sent_at timestamptz;
