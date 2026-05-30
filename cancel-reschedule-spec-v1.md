# キャンセル・日程変更フロー 実装指示書 v1

> 作成日：2026-05-30
> 対象：ユーザーサイト（`src/`）・カウンセラー管理画面（`futarive-counselor/`）・Supabase
> 参照ブランチ：CLAUDE.md §10 に従い作業前に確認すること

---

## 1. 確定したキャンセルポリシー（実装の前提）

| ケース | 送客料 |
|---|---|
| 予約成立から24時間以内のキャンセル（誰都合でも） | 返金 |
| 24時間以降・ユーザー都合キャンセル | 課金（返金なし） |
| 24時間以降・相談所都合キャンセル → 別日面談が了承された | 返金 |
| 24時間以降・ユーザーが日程変更申請 → 別日面談が了承された | 返金 |
| 上記以外の面談不成立 | 課金（返金なし） |

**返金・課金はStripe経由で処理する。銀行振込は使わない。**

---

## 2. Supabase スキーマ変更

### 2-1. `reservations` テーブルへのカラム追加

```sql
ALTER TABLE reservations
  ADD COLUMN cancelled_by       text,          -- 'user' | 'counselor' | 'system'
  ADD COLUMN cancel_reason      text,          -- 任意入力
  ADD COLUMN reschedule_status  text,          -- NULL | 'requested' | 'approved' | 'expired'
  ADD COLUMN reschedule_requested_by text,     -- 'user' | 'counselor'
  ADD COLUMN reschedule_requested_at timestamptz,
  ADD COLUMN reschedule_approved_at  timestamptz,
  ADD COLUMN reschedule_expires_at   timestamptz, -- requested_at + 7日（期間未確定・変更可能な設計にする）
  ADD COLUMN original_reservation_id uuid REFERENCES reservations(id); -- 日程変更後の新予約と元予約を紐付け
```

### 2-2. `payment_status` カラム（既存タスクと統合）

既存の `payment_status` カラム追加タスク（TODO記載）と合わせて以下の値を定義する：

```
pending         → 支払い待ち（予約成立・24h猶予中）
paid            → 入金確認済み
refunded        → 返金済み
refund_pending  → 返金処理中
cancelled       → キャンセル（課金なし）
```

---

## 3. ユーザーサイト（`src/`）の実装

### 3-1. マイページ 予約詳細画面

**追加するUI要素：**

- 「キャンセル」ボタン（既存 or 新規）
- 「日程変更」ボタン（新規追加）

**表示条件：**

| ボタン | 表示条件 |
|---|---|
| キャンセル | `reservation.status === 'confirmed'` かつ `reschedule_status` が NULL |
| 日程変更 | `reservation.status === 'confirmed'` かつ `reschedule_status` が NULL |
| 了承ボタン | `reschedule_status === 'requested'` かつ `reschedule_requested_by !== 'user'`（相手側が申請した場合のみ表示） |

**キャンセルボタン押下時のフロー：**

```
確認モーダル表示（「キャンセルしますか？24時間以内は返金されます。以降は返金されません。」）
→ 確認 → reservations.status を 'cancelled' に更新
→ cancelled_by = 'user' を記録
→ 24時間以内かを確認（created_at から計算）
  → 以内：payment_status = 'refund_pending' → Stripe返金API呼び出し
  → 以降：payment_status はそのまま（課金維持）
→ 個人情報の自動非表示トリガー（§5参照）
→ 双方に通知
```

**日程変更ボタン押下時のフロー：**

```
希望日時入力モーダル表示
→ 送信 → reschedule_status = 'requested'
→ reschedule_requested_by = 'user'
→ reschedule_requested_at = now()
→ reschedule_expires_at = now() + interval '7 days'（期間は定数化して変更しやすくする）
→ payment_status = 'refund_pending' → Stripe返金API呼び出し（一旦返金）
→ カウンセラー側に通知（「日程変更のリクエストが届いています」）
```

**了承ボタン押下時のフロー（カウンセラーが日程変更申請した場合、ユーザー側に表示）：**

```
了承 → reschedule_status = 'approved'
→ reschedule_approved_at = now()
→ 新しい日程で予約レコードを新規作成（original_reservation_id に元の予約IDを紐付け）
→ 新予約に対して再課金（Stripe）
→ 双方に通知（「日程変更が確定しました」）
```

---

## 4. カウンセラー管理画面（`futarive-counselor/`）の実装

### 4-1. 予約詳細画面

**追加するUI要素：**

- 「日程変更を提案する」ボタン（新規追加）
- 了承ボタン（ユーザーが日程変更申請した場合に表示）

**日程変更提案ボタン押下時のフロー：**

```
希望日時入力モーダル表示
→ 送信 → reschedule_status = 'requested'
→ reschedule_requested_by = 'counselor'
→ reschedule_requested_at = now()
→ reschedule_expires_at = now() + interval '7 days'
→ payment_status = 'refund_pending' → Stripe返金API（一旦返金）
→ ユーザー側に通知（「カウンセラーから日程変更のリクエストが届いています」）
```

**了承ボタン押下時のフロー（ユーザーが申請した場合、カウンセラー側に表示）：**

```
了承 → reschedule_status = 'approved'
→ 新予約レコード作成・再課金（ユーザー側と同様）
→ 双方に通知
```

---

## 5. 個人情報の自動非表示（キャンセル確定時）

キャンセルが確定した時点（`status = 'cancelled'` かつ 日程変更了承なし）で、カウンセラー管理画面上のユーザー個人情報（本名・連絡先・詳細プロフィール）を非表示にする。

**実装方法（推奨）：**

Supabase の RLS ポリシーで制御する。`reservations.status = 'cancelled'` かつ `reschedule_status` が NULL または `'expired'` の場合、カウンセラーロールからユーザーの個人情報カラムへのアクセスを拒否する。

```sql
-- 例：カウンセラーが予約に紐づくユーザー詳細を読める条件
CREATE POLICY "counselor_can_read_user_detail"
ON user_details FOR SELECT
TO counselor_role
USING (
  EXISTS (
    SELECT 1 FROM reservations r
    WHERE r.user_id = user_details.user_id
      AND r.counselor_id = auth.uid()
      AND r.status != 'cancelled'
      AND (r.reschedule_status IS NULL OR r.reschedule_status = 'approved')
  )
);
```

---

## 6. 期限切れの自動キャンセル処理

`reschedule_expires_at` を過ぎても了承されなかった場合、自動でキャンセル処理する。

**実装方法：**

Supabase Edge Function または pg_cron で定期実行（1日1回推奨）：

```sql
UPDATE reservations
SET
  status = 'cancelled',
  cancelled_by = 'system',
  reschedule_status = 'expired'
WHERE
  reschedule_status = 'requested'
  AND reschedule_expires_at < now();
```

期限切れ時の通知：双方（ユーザー・カウンセラー）にメール通知（Resend経由）。
文面：「日程変更の期限が切れたため、予約は自動的にキャンセルされました。」

---

## 7. 通知一覧

| イベント | 通知先 |
|---|---|
| ユーザーがキャンセル | カウンセラー |
| カウンセラーが日程変更提案 | ユーザー |
| ユーザーが日程変更申請 | カウンセラー |
| 日程変更が了承された | 双方 |
| 日程変更の期限切れ → 自動キャンセル | 双方 |

通知手段：Resend経由メール（鮮度アラートと同じインフラ）。
期限切れまでの中間通知（例：期限2日前に催促）は将来対応でよい。

---

## 8. 実装の分割推奨（ストリームタイムアウト対策）

複雑なため、以下の順に分割して実装する：

1. **Pass 1**：Supabaseスキーマ変更（§2のALTER TABLE）
2. **Pass 2**：ユーザーサイト キャンセルフロー（§3 キャンセルボタンのみ）
3. **Pass 3**：ユーザーサイト 日程変更フロー（§3 日程変更ボタン）
4. **Pass 4**：カウンセラー管理画面 日程変更フロー（§4）
5. **Pass 5**：個人情報自動非表示 RLSポリシー（§5）
6. **Pass 6**：期限切れ自動キャンセル Edge Function（§6）

---

## 9. 未確定事項（実装前に確認）

- [ ] 日程変更の了承期限：現状7日（`interval '7 days'`）。確定後に定数を更新する
- [ ] 日程変更申請時の返金タイミング：申請時即時返金 vs 期限切れ時返金。現指示書は「申請時即時返金」で設計
- [ ] 再課金のタイミング：了承時即時 vs 新しい予約の24h猶予後。現指示書は「了承時即時」で設計
- [ ] Stripe APIキー：ふうかさん本人がStripeアカウント開設後に環境変数に投入

