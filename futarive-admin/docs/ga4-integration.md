# GA4 Data API 統合手順（Phase B 用）

統括管理画面（`/admin`）のダッシュボードに「トレンド」セクションを追加するための、Google Analytics 4 (GA4) Data API 連携計画。

このドキュメントは Phase B 着手時の作業手順書を兼ねる。現時点（Phase A）では実コードは書かず、環境変数の枠とドキュメントだけを準備する。

---

## 必要な準備

### 1. Google Cloud Platform でサービスアカウントを作成

1. [GCP Console](https://console.cloud.google.com/) → 該当プロジェクトを開く
2. 「IAM と管理」→「サービス アカウント」→「サービス アカウントを作成」
3. 名前: `futarive-admin-ga4-reader`（任意）
4. ロール: 最小権限のため**特別なロールは付けない**（GA4 側で読み取り権限を付与する）
5. 作成後、サービスアカウントの「キー」タブ →「新しい鍵を作成」→ JSON 形式でダウンロード

### 2. GA4 プロパティにサービスアカウントを追加

1. [GA4 管理画面](https://analytics.google.com/) → 該当プロパティの「管理」
2. 「プロパティのアクセス管理」→ 「+」ボタン → 「ユーザーを追加」
3. メールアドレス: 上で作成したサービスアカウントのメール（`xxx@yyy.iam.gserviceaccount.com`）
4. **ロール: 「閲覧者」**（書き込み権限は不要）
5. 通知メール送信は OFF でよい

### 3. Vercel 環境変数に登録

Vercel Dashboard → futarive-admin プロジェクト → Settings → Environment Variables

| 変数名 | 値の取り方 |
|---|---|
| `GA4_PROPERTY_ID` | GA4 管理画面 → プロパティの詳細 → プロパティ ID（数字9桁） |
| `GA4_SERVICE_ACCOUNT_EMAIL` | ダウンロードした JSON の `client_email` フィールド |
| `GA4_SERVICE_ACCOUNT_PRIVATE_KEY` | ダウンロードした JSON の `private_key` フィールド（`-----BEGIN PRIVATE KEY-----` から `-----END PRIVATE KEY-----\n` まで含めて全文。改行は `\n` のままでよい） |

**Environment は Production / Preview / Development すべてに登録する**。

ローカル開発時は `.env.local` に同じ値を設定する（`.env.example` 参照、`.gitignore` 済み）。

---

## 実装予定の機能

統括ダッシュボード（`/admin`）の「③ トレンド」セクションで以下を表示する：

| 指標 | 取得方法 | 表示形式 |
|---|---|---|
| 直近 7 日間のサイト訪問数 | GA4: `activeUsers` ディメンション `date` | 折れ線グラフ |
| 診断完了率 | GA4 イベント: `kinda_note_start` ÷ `kinda_note_complete` | パーセンテージ + 推移 |
| カウンセラー別の詳細閲覧数ランキング | GA4 イベント: `view_counselor`（カスタムイベント） + `counselor_id` パラメータ | Top 10 テーブル |
| 流入元別のトラフィック内訳 | GA4: `sessionSource` × `sessionDefaultChannelGroup` | 円グラフ |

カウンセラー別ランキングは Supabase の `counselors` テーブルと突き合わせて、`counselor_id` から氏名・相談所名を解決する。

---

## 利用予定ライブラリ

```bash
npm install @google-analytics/data
```

- 公式 SDK: [`@google-analytics/data`](https://www.npmjs.com/package/@google-analytics/data)
- 認証: サービスアカウント + JWT（ライブラリが自動処理）

### サーバーサイドのみで使う

GA4 Data API の credentials を **絶対にクライアントに露出させない**。`futarive-admin/app/admin/page.tsx` は `'use client'` だが、データ取得は次のいずれかで分離する：

| 方式 | 採用判断 |
|---|---|
| **A. Route Handler**（`app/api/ga4/*` 配下に GET エンドポイント） | 推奨。クライアントから fetch で叩く |
| **B. Server Component** で取得 → Client Component に props で渡す | 構造変更が必要なら検討 |
| **C. Server Action** | 双方向通信が要らないので不要 |

---

## キャッシュ戦略（実装時の検討事項）

GA4 Data API は分単位の課金は無いが、レイテンシ（1-3 秒）とレートリミット（10 QPS / プロパティ）がある。ダッシュボードでは：

- ISR / Route Handler の `revalidate: 600`（10 分）で十分
- 大量アクセスがある画面ではないので、シンプルなインメモリキャッシュでも可

---

## エラー処理方針

- GA4 API がダウン / 認証失敗 → トレンドセクションだけ「データを取得できませんでした」と表示し、他のセクション（要対応・KPI・最近のアクティビティ）は通常通り表示
- 環境変数未設定の場合 → トレンドセクション自体を非表示（ローカル開発で env が空でも他は動くようにする）

---

## チェックリスト（Phase B 着手時）

- [ ] GCP でサービスアカウント作成 + JSON 鍵ダウンロード
- [ ] GA4 プロパティに閲覧者として追加
- [ ] Vercel 環境変数 3 つ登録（Production / Preview / Development すべて）
- [ ] ローカル `.env.local` にも同じ値を設定
- [ ] `npm install @google-analytics/data`
- [ ] `app/api/ga4/` に Route Handler を実装
- [ ] `app/admin/page.tsx` のトレンドセクションを実装
- [ ] エラー時のフォールバック動作を確認
