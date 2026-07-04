# セキュリティ診断レポート（2026-07-04）

対象：kinda.jp（ユーザーサイト `src/`）／ futarive-counselor ／ futarive-admin ／ Supabase（DB・Storage・RPC）

## 総評

API ルート（Stripe 課金・返金・Webhook・問い合わせ・cron）は認証・所有者チェック・署名検証・冪等化が正しく実装されており、全体として堅牢。シークレットのリポジトリ混入なし（`.env.example` のみ、docs はプレースホルダのみ）。service_role キーの使用はサーバーサイド（API Route）に限定されている。

重大な問題は DB レイヤーに 2 件あり、**本診断内で修正済み**。

---

## 修正済み（本診断で対応）

### 1.【重大・修正済み】監査ログ集計ビューが未ログインでも閲覧可能だった

- `audit_suspicious_access` / `audit_auth_failures_recent` / `audit_counselor_activity` は SECURITY DEFINER ビュー（audit_logs の RLS をバイパス）でありながら、`anon` / `authenticated` に SELECT 権限が付与されていた。
- 未ログインの誰でも（サイトに埋め込まれた公開 anon キーで）**IP アドレス・ユーザーID・操作履歴**を読める状態。APPI（個人情報保護法）上も問題。
- **対応**：マイグレーション `security_lockdown_audit_views_and_counselor_media` で anon / authenticated から REVOKE。アプリコードはこれらのビューを参照していないことを全ブランチで確認済み（影響なし）。service_role / ダッシュボードからは引き続き閲覧可。

### 2.【重大・修正済み】counselor_media が「ログイン済みなら誰でも」書き換え可能だった

- 旧ポリシー `authenticated full access counselor media` は、一般会員を含む全ログインユーザーに他人のカウンセラーのリール画像行の INSERT / UPDATE / DELETE を許していた（改ざん・削除・荒らしが可能）。
- **対応**：同マイグレーションで削除し、`counselor_media_write_owner_or_admin`（本人 owner_user_id ／ 所属相談所オーナー ／ admin のみ）に置換。書き込み箇所は counselor アプリの reel ページのみ（本人スコープ）で、公開読み取りポリシーは不変。**既存フローは壊れない。**

### 3.【中・修正済み】JSON-LD 経由の stored XSS（kinda.jp コード）

- `/counselors/[id]` の構造化データに**口コミ本文（ユーザー投稿）とカウンセラーの自己紹介文**が `JSON.stringify` のまま `<script>` タグへ埋め込まれていた。本文に `</script>` を含めるとタグを閉じて任意スクリプトを注入できる。
- **対応**：`src/lib/jsonld.ts` の `jsonLdStringify()`（`<` を Unicode エスケープ `u003c` 形式に置換）を追加し、`/counselors/[id]` と `Breadcrumb` の JSON-LD に適用。他ページの JSON-LD は静的・編集部管理データのみのため据え置き（新規実装では本ヘルパーを使うこと）。

---

## 未修正・要判断（壊れる可能性があるため説明のみ）

### 4.【重大・修正済み】slots テーブルの UPDATE が全ログインユーザーに無制限だった

- ポリシー `slots_update_authed` が `USING(true) WITH CHECK(true)`。一般会員のアカウントがあれば、全カウンセラーの全スロットを直接 UPDATE できた（例：全部 `booked` にして予約を止める、他人の `locked` を `open` に戻して横取りする等）。
- 原因：会員の予約確定が client から slots を直接 UPDATE（`open/locked→booked`）していたため、ポリシーを絞れなかった。キャンセル・undo・reschedule は既に SECURITY DEFINER RPC 経由で slot を内部操作しており、直接 UPDATE に依存していたのは「予約確定」だけだった。
- **対応**（マイグレーション `042_slots_booking_rpc_and_scoped_update_policy.sql`・本番適用済み）：
  1. 予約確定（枠確保＋reservation INSERT）を単一トランザクションの SECURITY DEFINER 関数 `create_reservation_rpc` に集約。`user_id := auth.uid()` で固定（成りすまし予約を防止）、枠確保は `open/locked→booked` の条件付き UPDATE で二重予約を排他、INSERT 失敗時は関数ごとロールバック（別途 release RPC を作らないことで「他人の枠を解放する」攻撃面も排除）。CLAUDE.md §6「状態遷移は RPC 経由のみ」に準拠。
  2. `slots_update_authed` を削除し、`slots_update_owner_admin`（counselor 本人 / 所属相談所オーナー / admin のみ）に置換。counselor カレンダー・admin スロット管理は従来どおり動作。
  3. client（`src/lib/reservations.ts` の `createReservation`）を RPC 呼び出しに変更。デッドコードだった直接版 `cancelReservation` も削除。
- 検証：本番 DB 上でシミュレート認証により、枠確保 `booked`／`user_id=auth.uid()`／`status=active`（billing 発火）／二重予約 `slot_unavailable` を確認（テストはロールバックし副作用なし）。

### 5.【中・未修正／要コーディネート】予約の連絡先 PII が決済前でも相談所オーナーから直接読める

- アプリ上は `user_info_visible`（決済完了）で連絡先開示を制御しているが、RLS の `agency owner reads own reservations` / `agency_owner_select_reservations` には PII ガードがなく、**自社宛て予約なら決済前でも REST 直叩きで user_email / user_phone / user_name を読める**。
- ビジネスルール（¥5,000 決済後に開示）の迂回であり、収益保護の観点でも要対応。
- **本セッションでは未修正（あえて止めた）**。理由：RLS は行単位で、列だけを条件付き（`user_info_visible` の値による）にマスクできない。正しく塞ぐには
  1. 基底 `reservations` の PII 列（user_name / user_email / user_phone）への相談所オーナー／カウンセラーの直接 SELECT 経路を断ち、
  2. 相談所側の予約読み取りを **マスキング用の SECURITY DEFINER 関数／ビュー**（`user_info_visible=true` のときだけ PII を返す）に一本化する、
  という **counselor 実運用アプリ（1clpG）の複数の読み取り箇所（inbox / reservations 一覧 / 詳細 / dashboard セクション）を横断で差し替える変更**が必要。中途半端に基底ポリシーだけ絞ると相談所の予約画面が壊れる。破壊リスクがあるため、独立したセッションで計画的に実施する（会員本人＝行オーナーの自分の PII 読み取りは維持すること）。

### 6.【中・修正済み】futarive-admin の middleware が「ログイン済み」しか確認していない

- admin / counselor どちらの Supabase アカウントでも futarive-admin の画面に入れた（RLS により他人のデータの読み書きは概ね防がれるが、多層防御がなかった）。
- **対応**（`claude/futarive-admin-dashboard-iKBfw` に適用・ビルド検証済み）：middleware で `admin_users.role='admin'` を確認し、非 admin は `/login` へ戻す（無限リダイレクト防止のため `/login` からの自動遷移は admin 時のみ）。login ページ側でもサインイン後にロール検証し、非 admin はサインアウト＋「運営専用」メッセージ表示。admin_users は現状 role='admin' 1件のため正規管理者の締め出しは起きない。

### 7.【低】その他（Supabase アドバイザー指摘）

- **一部トリガー関数の search_path が可変**（update_updated_at 等 6関数）：**修正済み**（マイグレーション `harden_function_search_path`・`SET search_path = public` を付与）。
- **Leaked Password Protection が無効**：Supabase ダッシュボード → Authentication → Providers → Password で有効化推奨（**コードからは変更不可・ふうかのダッシュボード作業**）。
- **公開バケットの一覧列挙**（counselor-media / agency-media / shop-media）：広い SELECT ポリシーによりファイル一覧を列挙可能。画像はいずれも公開前提のため実害は小さいが、気になるなら list を防ぐポリシーに分割。
- **SECURITY DEFINER 関数が anon から実行可能**（アドバイザー多数 WARN）：いずれも関数内部で `auth.uid()` ベースの権限チェックがあり（未ログイン＝弾かれる）実害は小さいが、ハードニングとして `anon` からの EXECUTE 剥奪を検討可（新規の create_reservation_rpc は既に anon 剥奪済み）。
- **notify_signups は RLS 有効・ポリシーなし**（=全拒否、service_role のみ書き込み）：意図どおりで問題なし。

---

## 確認して問題がなかった点

- Stripe Webhook は署名検証あり（raw body）。課金 API は予約本人のみ・二重課金防止あり。返金 API は admin ロール必須。
- cron（口コミ依頼メール）は `CRON_SECRET` の Bearer 認証あり。送信上限・期間窓あり。
- 問い合わせ API はハニーポット・文字数制限・HTML エスケープあり。
- 課金台帳系 RPC（mark_billing_paid / resolve_billing_dispute / assign_monthly_invoice 等）は関数内部で admin チェックあり。dispute 提出は相談所オーナー本人のみ。予約系 RPC（cancel / reschedule / submit_review 等）も auth.uid() ベースの権限チェックあり。
- `.env` 系ファイルは Git 管理外。シークレット実値のコミットなし。
- profiles の公開読み取りは nickname 等のみで PII なし。
