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
- **本セッションでは未修正（あえて止めた／専用セッションに回す決定＝2026-07-04）**。

#### なぜ「ビューを足すだけ」では直らないか（重要な制約）
RLS は行単位で、列だけを条件付き（`user_info_visible` の値による）にマスクできない。さらに調査の結果、**counselor アプリの inbox / dashboard は `reservations` テーブルを Supabase Realtime（`postgres_changes`）で購読**していることが判明した（`futarive-counselor/app/(main)/inbox/page.tsx` ほか、いずれも `select('*')`）。ここが効いてくる：
- Realtime はテーブルの **RLS（行可視性）に依存**する。相談所オーナー／カウンセラーから基底 `reservations` の SELECT を剥がすと、**inbox のライブ更新が停止して壊れる**。
- Realtime は **列マスクができない**。基底 SELECT を残す限り、マスキングビューを足しても Realtime / REST 直叩きで PII は依然読めるため、**セキュリティ改善はゼロ**（アプリ UI 上で隠しているだけの現状と変わらない）。

#### severity の再評価
- 漏れるのは **自社宛て予約のみ**（他社予約は RLS で不可＝クロステナント漏洩ではない）。相談所は ¥5,000 決済すれば正規に受け取る情報。
- 実害は「決済前に見込み客へ接触される」という **規約迂回・収益保護** の問題であり、無関係ユーザーの情報流出ではない。→ **「中：計画的に直すべき運用リスク」**。当面は現状維持で許容し、専用セッションで恒久対応する（2026-07-04 判断）。

#### 恒久対応の計画（専用セッションで実施）
基底 `reservations` の PII 列（user_name / user_email / user_phone）を、決済前は相談所オーナー／カウンセラーから隠す。会員本人（行オーナー）と admin の自分の PII 読み取りは維持する。段階手順（各段でビルド・動作検証し、壊れない順序を厳守）：
1. **マスキング用のデータ経路を用意**（追加のみ・無破壊）：SECURITY DEFINER 関数／ビュー `counselor_reservations`（自社スコープに限定＋`user_info_visible=true`（＋Stripe 導入前 legacy grandfather）のときだけ PII を返し、それ以外は NULL）。
2. **リアルタイム inbox の作り替え**：基底テーブルの `postgres_changes` 購読をやめ、(a) マスキング経路のポーリング、または (b) Realtime broadcast チャネル（PII を載せない通知トリガー）へ移行。inbox / dashboard / detail / calendar の全読み取りを新経路へ。
3. **段階デプロイ**：2 を counselor 本番（1clpG）へ反映し、ライブ更新・表示が従来どおり動くことを確認。
4. **RLS 締め**：確認後、`agency owner reads own reservations` / `agency_owner_select_reservations` から PII 列参照を断つ（＝相談所／カウンセラーの基底 `reservations` 直接 SELECT を廃止し、新経路に一本化）。`users read own reservations`（会員本人）と admin ポリシーは残す。
5. **検証**：決済前は相談所が REST 直叩き／Realtime で PII を取得できないこと、決済後は開示されること、会員本人は自分の PII を読めること、をシミュレート認証テストで確認。

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
