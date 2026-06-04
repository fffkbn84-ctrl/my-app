# TODO / WORKLOG 反映まとめ（2026-06-04 決済・Voices・Whisperセッション）

> このファイルの内容を TODO.md と WORKLOG.md に転記してください。
> 転記後このファイルは破棄して構いません。

---

## WORKLOG.md に追記する内容

### 2026-06-04（決済設計確定・Kinda voices設計・Whisperセットアップ）

#### 確定事項

##### 1. Stripe決済設計（確定）

- 支払い手段：クレジットカード登録制のみ（銀行振込は対応しない・例外なし）
- 課金タイミング：予約成立時に即時前払い ¥5,000
- 使用機能：Payment Intents + Customers + Webhook + Refund API
- Billing・Invoicing は使用しない（手数料3.6%のみで最小コスト）
- クレカなし相談所は契約不可として断る（例外設計はしない）

##### 2. Resend（確定）

- Freeプランで開始（3,000通/月）
- 有料移行はユーザー増加後

##### 3. Kinda voices 記事テンプレート・取材ワークフロー（確定）

- 記事単位：カウンセラー個人単位
- 構成：8セクション（リード→プロフィール→4本文→CTA）
- 推奨文字数：3,000〜4,500字
- SEO：相談所名＋カウンセラー名＋地域名をtitleに
- 拡散設計：セクション7の印象的な一言を引用ブロックで目立たせる
- 内部リンク：記事末尾→カウンセラー詳細ページ
- ダブル使い：Kinda voices一覧 ＋ カウンセラー詳細ページからの双方向リンク
- Emma取材用質問リスト20問を作成済み

##### 4. Whisperセットアップ（MacBook Neo・完了）

- Homebrew・ffmpeg・openai-whisper（Python3.9）インストール済み
- PATH設定済み（~/.zprofile）
- 取材音声ファイル→文字起こしまで無料・ローカルで完結
- 使用コマンド：`whisper ~/Desktop/ファイル名.m4a --language ja --model medium`

---

## TODO.md に追記・修正する内容

### 🆕 追加タスク（2026-06-04 確定分）

#### 最優先（Stripe実装のブロッカー）

- [ ] **特商法表記ページ作成**
  - Stripe審査通過の必須条件
  - 記載必須項目：販売業者名・責任者名・所在地・電話番号・メールアドレス・サービス内容・料金・支払方法・サービス提供時期・返金ポリシー

- [ ] **Stripeアカウント開設**
  - 必要書類：身分証・銀行口座（名義一致）・特商法表記URL
  - ビジネス説明：「結婚相談所の口コミ・送客プラットフォーム、成果報酬型、¥5,000/件」
  - 審査：即日〜2営業日

- [ ] **Resendアカウント開設**
  - resend.comでメール登録
  - DNSドメイン認証（Vercel経由）
  - APIキー発行

#### Stripe実装（アカウント開設後）

- [ ] **Stripe実装（Claude Code渡し）**
  - 相談所カード登録フロー（Stripe Customers）
  - 予約成立時の即時課金（Payment Intents）
  - 決済成功Webhook → ユーザー情報自動開示
  - 24時間以内キャンセル時のRefund API
  - 日程変更申請時の返金→再課金フロー

#### Kinda voices

- [ ] **Emma取材の実施（Kinda voices 1本目）**
  - 質問リスト20問は作成済み（handoff-summary-2026-06-04.md参照）
  - iPhoneボイスメモで録音→AirDrop→Whisper→Claude記事化

- [ ] **Kinda voices記事一覧UIの実装設計**
  - カード型一覧ページ
  - カウンセラー詳細ページへの内部リンク

- [ ] **CLAUDE.mdにKinda voices運用フロー追記**（本セッション作成分をmainにpush）
