# notify-stale-profiles

90 日以上プロフィール情報を更新していない counselor / agency オーナーに、Resend 経由で「更新しませんか？」メールを送る Supabase Edge Function。

**現状：デプロイ済み・cron 未設定（手動でしか動かない）。サイトが動き出してから cron を有効化する想定。**

---

## 仕組み

1. counselors / agencies で `updated_at < 90 日前` のレコードを抽出
2. 直近 30 日以内にアラートを送っていないレコードに絞る（`last_freshness_alert_sent_at` ベース）
3. `owner_user_id` から `auth.users.email` を引き、Resend で送信
4. 成功したら `last_freshness_alert_sent_at = now()` を書き込む（クールダウン開始）

---

## 必要な Function Secrets

Supabase ダッシュボード → Project Settings → Edge Functions → Secrets で設定する。

| キー | 必須 | 説明 |
|---|---|---|
| `RESEND_API_KEY` | ◯ | Resend ダッシュボードで発行した API キー |
| `STALE_NOTIFY_TOKEN` | ◯ | 任意の固定トークン（例: `openssl rand -hex 32` で生成）。Authorization ヘッダで認可 |
| `RESEND_FROM` | △ | 差出人。検証済みドメインのアドレス（例: `Kinda <noreply@kinda.jp>`） |
| `KINDA_COUNSELOR_URL` | △ | カウンセラー管理画面のベース URL。メール文面のリンクに使う |
| `STALE_DAYS` | △ | 何日経過から対象か（既定 90） |
| `COOLDOWN_DAYS` | △ | 連続送信防止のクールダウン（既定 30） |
| `DRY_RUN` | △ | `1` にすると Resend 呼び出しと DB 更新をスキップしてログだけ出す（動作確認用） |

`SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` は Supabase Functions ランタイムが自動注入するので設定不要。

---

## 動作確認の手順

### 1. ドライラン（送信せず対象を数える）

Function Secret に `DRY_RUN=1` をセット → 下のコマンドで叩く：

```bash
curl -i -X POST \
  -H "Authorization: Bearer <STALE_NOTIFY_TOKEN の値>" \
  "https://<project-ref>.functions.supabase.co/notify-stale-profiles"
```

レスポンスの `processed` 件数で対象が拾えているか確認。`errors` に "owner has no email" 等が出ていればその件もわかる。

### 2. 本送信を1人だけ試す

特定の counselor の `updated_at` を 91 日前に書き換えて、自分のテストアカウントだけが対象になる状態を作る：

```sql
UPDATE counselors
  SET updated_at = now() - interval '95 days',
      last_freshness_alert_sent_at = NULL
  WHERE id = '<test-counselor-id>';
```

`DRY_RUN=0` にして、もう一度 curl を叩く。受信ボックスを確認。

### 3. cron で定期実行する（サイトが動き出したら）

`pg_cron` と `pg_net` を有効化したうえで、下記 SQL を 1 回だけ実行する：

```sql
SELECT cron.schedule(
  'notify-stale-profiles-weekly',
  '0 0 * * 1', -- 毎週月曜 09:00 JST（= 00:00 UTC）
  $$
  SELECT net.http_post(
    url := 'https://<project-ref>.functions.supabase.co/notify-stale-profiles',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.stale_notify_token'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

`app.stale_notify_token` は事前に `ALTER DATABASE postgres SET app.stale_notify_token = '<token>'` で仕込んでおく。停めたいときは `SELECT cron.unschedule('notify-stale-profiles-weekly')`。

---

## 運用ルール

- **オーナーアカウントのメールアドレスは「リマインダーが届く前提」で、本人が確実に確認するアドレスを登録する。**契約時にその旨を明記する（CLAUDE.md 8 節参照）。
- `MAX_PER_RUN = 50` で1回あたりの送信上限を切ってある。母数が増えたら見直す。
- ドライランは Function Secret の `DRY_RUN` を切り替えるだけで本番に影響なし。

---

## 失敗時のリトライ

このバッチは「対象がいる限り何度叩いても安全」になっている：
- 送信成功 → `last_freshness_alert_sent_at` がセットされ、以降クールダウン期間は対象外
- 送信失敗 → DB は更新されないので、次回実行時に再度対象になる

cron が止まっていても、復旧したら自動的に積み残しを拾える。
