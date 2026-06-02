# TODO.md — タスク管理・次セッションへの引き継ぎ

> このファイルは **「次に何をやるか」「今どこまで進んでいるか」** を 1 枚で把握するためのもの。
> 完了した項目は履歴として残してよいが、行頭を `- [x]` にして本文を 1 行に圧縮する。
> 詳細な実装メモは `WORKLOG.md`、画像周りの監査は `docs/image-audit.md` を参照。

最終更新: 2026-06-01

---

### 🆕 2026-06-01 ユーザーサイト通知 / キャンセルUNDO / リール修正（main 反映済み・実機OK）

#### 完了（実機確認OK）
- [x] 相談所からの通知マーク：BottomNav マイページアイコンに未読ドット（`useUserNotifications`）。元データ = `agency_message` / カウンセラー発の `reschedule_status='requested'` / `reviews.agency_reply`。
- [x] 通知内容の可視化：マイページに `NotificationsSection`（メッセージ/日程変更提案/口コミ返信を一覧・新着バッジ）。開くと既読化するが一覧は残る。
- [x] 予約一覧カードに「日程変更の提案あり」バッジ追加。
- [x] キャンセルUNDO：新RPC `undo_cancel_reservation_rpc`（5分以内・本人・slot空きのみ）＋共通 `UndoToast`。予約詳細・予約一覧の両方。一覧キャンセルを RPC 方式へ統一。
- [x] リール真っ黒の修正：PC幅(≥768px・iPad横向き含む)でモーダルが0pxに潰れて不可視→ `height` 明示で解消。`ModalErrorBoundary` 安全網も追加。

#### 次にやること（残課題）
- [ ] `undo_cancel_reservation_rpc` を `supabase/migrations/` にファイル追記（現状 DB 適用のみ。migration 履歴が歯抜けなので整合は要検討）。
- [ ] 通知の「既読」を localStorage → DB 化するか検討（複数端末で既読同期したい場合）。今は端末ローカル。
- [x] カウンセラー側の日程変更ピッカー2段化（`dab1f92`）・キャンセルUNDO（`37c4903`）は、**カウンセラー本番ブランチ `claude/fix-profile-creation-1clpG` に既に反映済み**（main ではない）。取り込み作業は不要だった。※当初「main 系へ取り込み」と書いたのは誤り。counselor 本番は CLAUDE.md §10 の通り `claude/fix-profile-creation-1clpG`。
- [ ] リールが PC幅以外（モバイル縦/iPad縦）でも問題ないか継続確認。

---

### ⚠️ デプロイ運用ルール（2026-06-01 確定・厳守）

> 今回ユーザーサイトの作業を誤ったブランチ起点で始める / ローカル main を信用するミスをした。再発防止のため必ず以下に従う。

- **ローカル `main` は信用しない。常に `origin/main` を真とする。**（ローカル main が unrelated history の古い commit を指していることがある）
- **ブランチ系統は2つに分岐している**：
  - ユーザーサイト(`src/`) … Vercel `my-app-rp9u` / Production Branch = **`main`**
  - カウンセラー(`futarive-counselor/`) … `claude/fix-profile-creation-1clpG` 系統
  - → 作業対象に応じて正しい系統を起点にする。取り違えない。
- **ユーザーサイトの正しい手順**：
  1. `git fetch origin main`
  2. `git checkout -B <feature> origin/main`（必ず origin/main 起点）
  3. 実装 → `npm run build` で green 確認
  4. `git rev-list --count <feature>..origin/main` が 0（ff可能）を確認
  5. `git push origin <feature>:main` で反映
- **新セッションでデプロイを依頼されたら、Claude は着手前にふうかさんへ「前回使ったブランチ名と最新コミット（origin/main の HEAD 等）」を伝え、起点ブランチの確認を取ること。** いきなり実装を始めない。

---

### 🆕 2026-05-27 追加タスク（料金・課金フロー確定を受けて）

#### 最優先・ふうかさん本人作業（外部要因／Claude不可）
- [ ] 独自ドメイン取得（kinda.jp 等）。SEO施策の前提。空き状況確認 → 取得 → Vercel接続。年¥数千・作業1h程度。
- [ ] Stripeアカウント開設・本人確認・APIキー取得（個人事業主で可）。決済自動化の前提。
- [ ] 法人設立／屋号の確定（契約書・規約のプレースホルダ実値化、Stripe法人化の前提）。

#### 課金フロー実装（「前払い＋情報ロック」方式）
- [ ] Supabase `reservations` テーブルに `payment_status` 等のカラム追加（スキーマ設計から）。
- [ ] Stripe Webhook 受信 → `payment_status` 更新 → 管理画面アンロックの実装。
- [ ] カウンセラー管理画面「予約者を見る」バーのロック/アンロックUI実装。
- [ ] 予約者情報の二層化（即時開示＝メッセージ・希望日時・ニックネーム・テーマ／入金後＝本名・連絡先・詳細）。
- [ ] 予約完了画面のタイムライン明示UI。
- [ ] 予約の最短実施日「3日後」バリデーション（短縮可能な設計に）。
- [ ] 入金前メッセージの抜け駆け防止制御（連絡先交換・日程最終確定は入金後に制限）。

#### 契約・法務（課金フロー変更に伴う改訂）
- [ ] 送客契約書・規約 第6条（課金条件）を「面談完了」→「前払い＋情報ロック」方式に改訂。
- [ ] 顧問弁護士レビュー（課金フロー変更箇所）。

#### 営業（シード営業・初期から必須）
- [ ] 営業資料の初版作成（初見の人に見せてチグハグを洗い出す目的）：リーフレット／提案スライド／FAQ／口頭台本／コールドメール／リスト戦略。
- [ ] 具体的な営業対象の相談所リスト化（提携0社からのシード獲得対象）。

#### 入金遅延対応（要相談 → ルール確定後にタスク化）
- [ ] 相談所の入金対応が遅れた場合の運用ルール確定（次セッションで論点整理済み。決定後に実装タスク化）。

#### 契約相談所が決まったら
- [ ] 相談所向け「使い方ガイド」作成（契約後の相談所が対象）。

#### 集客（SEO軸）
- [ ] 2026-05-14 SEO診断レポートの10施策から着手対象を選定 → Claude Code指示書化（ドメイン取得後）。

#### 料金プラン後続（フェーズ2移行に向けて）
- [ ] フェーズ2 掲載課金（月額 ¥11,000 / モニター ¥5,500）への切り替え提案ロジックを設計
  - 集計対象：Kinda 経由面談が月平均 3 件超 の相談所
  - 集計・通知方法（admin ダッシュボード列追加 or 月次バッチ）の決定
- [ ] PR枠・広告枠（仮 ¥30,000）の UI（バッジ・順位調整）と表示透明性の設計

#### UI 微調整・実機確認待ち（2026-05-27 完了分の振り返り対象）
- [ ] /about のセクション② カード（村背景透け）の実機判断 → 必要なら装飾画像追加
- [ ] PC ヒーロー全幅シネマティック型でシール位置・グラデ濃度・テキスト位置の微調整
- [ ] 季節ごとのヒーロー画像差替運用ルールを README 化（命名規則・サイズ規格）

#### 将来の検討事項（ブランド認知が育ってから）
- [ ] ヘッダーロゴの中央配置 A/B テスト（Lemme / Kourtney 系ブティックスタイル）
  - 2026-05-27 セッションで判断保留：今は左寄せ（convention 優先）
  - 指名検索が増えてブランド認知が育った段階で再検討
  - その時の判断材料：直帰率・ブランド指名検索数・第一印象アンケート

---

## ✅ Task 3: 鮮度管理 — 既存の組み合わせでカバー済み（2026-05-22 確認）

**結論：** 専用 `last_reviewed_at` カラムやダッシュボード UI は新設せず、既にある仕組みで充足する判断。

**カバー手段：**

| 要件 | 既存の手段 |
|---|---|
| いつ最後に更新されたか | `counselors.updated_at` / `agencies.updated_at`（`trg_*_updated_at` BEFORE UPDATE トリガーで全 UPDATE 時に自動更新） |
| 変更履歴 | `trg_audit_*`（INSERT / UPDATE / DELETE の監査ログ） |
| 古いレコードの検知 | Edge Function `notify-stale-profiles`（90 日経過 → 本人にメール） |
| 連続通知の抑止 | `last_freshness_alert_sent_at` + 30 日クールダウン |
| 鮮度リセット | admin が編集保存 → `updated_at` 自動再付与 → 90 日クロックが再スタート |

**自己ループ：** admin 編集 → updated_at リセット → 90 日後にリマインダーメール → 本人が更新 / admin が編集 → リセット。

**意識的に作らなかったもの（後で必要になったら追加）：**
- admin 一覧の「最終更新」列やソート（updated_at は DB にあるので追加コストは小）
- admin top の「古いレコード N 件」ウィジェット
- 「点検済み」専用ボタン（編集と区別する必要が出たら追加）

---

## 🟡 リリース前 must（残）

`docs/image-audit.md` §7 より、未着手項目を転記：

- [x] **#4 `not-found.tsx` 新設 + イラスト 1 枚**（2026-05-22、`w_morning_mist.webp` 流用）
- [x] **#5 `KindaLoader` コンポーネント新設**（2026-05-22、Suspense fallback 5 箇所差替済 — agencies / kinda-act / kinda-talk / kinda-glow / login）

### 鮮度アラート（Resend 経由メール通知）— インフラ完了・有効化待ち

`claude/claude-md-constitution-jPCIz` で `supabase/functions/notify-stale-profiles` を実装・deploy 済み。
仕組みは持ったが、サイト稼働まで cron は意図的に未設定。**ローンチ準備の際にここをチェック。**

- [x] **マイグレーション**：`counselors` / `agencies` に `last_freshness_alert_sent_at timestamptz` 追加（クールダウン基準）
- [x] **Edge Function deploy**：`notify-stale-profiles`（90日未更新 → Resend で本人宛メール、30日クールダウン、DRY_RUN 対応）
- [x] **CLAUDE.md §8**：連絡用メアドは「リマインダー届く前提」で `auth.users.email` 固定とする運用ルールを追記
- [ ] **Resend 契約 + ドメイン検証**（リリース近くで実施。`Kinda <noreply@<検証済みドメイン>>` を確保）
- [ ] **Supabase Function Secrets 投入**：`RESEND_API_KEY` / `STALE_NOTIFY_TOKEN`（`openssl rand -hex 32`）/ `RESEND_FROM` / `KINDA_COUNSELOR_URL`
- [ ] **DRY_RUN=1 で動作確認**（送信せず対象件数だけ確認）→ 本送信 1 件テスト → 本番有効化
- [ ] **pg_cron スケジュール登録**：READMEに置いた SQL を 1 回実行（既定：毎週月曜 09:00 JST）。サイト稼働後に有効化する判断
- [ ] **契約フローへの反映**：カウンセラー／相談所オーナーに「ログイン用メアド = 運用リマインダーの宛先」を契約時に明示

> 詳細手順は `supabase/functions/notify-stale-profiles/README.md`。
> いつでも開始でき、開始した瞬間から自動で機能する状態。

### サンプルデータの整理（admin / DB 連携の未完部分）— 2026-05-23 確認、すべて完了済

`counselors` 側はサンプル名・isDemo フラグでほぼ揃っているが、`agencies` と admin UI に整理漏れあり、と前回までの認識だったが、2026-05-23 後半セッションで Supabase 実データを SELECT して確認した結果、**全て解消済み**だった：

- [x] **agencies の is_demo フラグ修正**：`（サンプル）` 名 8 件すべて is_demo=true（前回懸念の 6 件 → 8 件に増えて全て true）
- [x] **agencies 重複登録の整理**：重複ゼロ（Emma〜系も解消済み）
- [x] **`counselors` 中の "山田孝之"** ：DB から既に消えている（削除 or 改名済み）
- [x] **admin に `is_demo` 列表示 + トグル**：`claude/futarive-admin-dashboard-iKBfw` の `6adae8dd` で counselors / agencies に実装済（shops は DB に is_demo 列がないため badge_type 運用継続で対象外）
- [x] **未使用 Next.js scaffolding SVG 削除**：`d27cd1f` で削除済

---

## ✅ 完了（2026-05-23 後半セッション）— サブアプリ運用方針整理

- [x] **futarive-counselor を Production Branch 切替運用に変更**
  - Production Branch: `main` → `claude/fix-profile-creation-1clpG`
  - Deployment Protection (Vercel Authentication): Disabled
  - 新 production URL: `https://futarive-counselor.vercel.app/`（外部カウンセラーに案内可能）
  - iPhone Safari プライベートモードで未認証アクセス確認済（Supabase Auth ログインまで素直に到達）
- [x] **futarive-admin は手付かず**（user 一人運用のため preview URL のままで実害なし。将来複数人運用になったら counselor と同じ手順を踏襲する想定）

詳細は `WORKLOG.md` の「2026-05-23 続き（深夜セッション）」参照。

---

## ✅ 完了（2026-05-22 セッション）

- [x] Kinda note intro hero に clay 装飾画像（`kinda-note-deco-1.webp`）を採用（`0e8eb4a`）
- [x] CTA 直前の deco-2 は配置せず保留、アセットは保全（`61f14a4`）
- [x] ロゴ 2 枚を webp 化＋コード差替＋旧 PNG 削除（`ba6cfe2`、-1.17MB）
- [x] 重複 .jpg 2 件削除（`b2b34d4`、-383KB）
- [x] `docs/image-audit.md` rev. 2 / rev. 3 更新（オーファン誤検出修正、完了タスクの状態反映）

---

## 📌 ロードマップ（2026-05-23 後半セッション時点）

本番リリースまでの大枠と現状：

| Phase | 期間目安 | 内容 | 現状 |
|---|---|---|---|
| A：機能拡充 | — | admin / counselor / user-site の主要機能 | ✅ 完了 |
| B：コンテンツ整備 | 1〜2 週 | 画像監査・実カウンセラー投入・鮮度管理 | 🟢 大半完了（画像監査 ✅ / 鮮度管理は既存で充足判定 ✅ / 残：実カウンセラー投入のみ） |
| **C：法務・契約** | **1 週** | **利用規約・特商法表記の本番値差替・規約レビュー** | **✅ 主要フェーズ完了（2026-05-23 クローズ）：PR #6-16 で規約・プライバシー・特商法・明示同意 UI・モバイル UI・SNS 抜け駆け禁止条項・契約書テンプレ・admin オーナー一括作成 UI 完備。残：実値差替・弁護士レビュー（外部要因待ち）** |
| D：リリース前準備 | 数日 | Resend 契約・Auth Confirm ON・本番ドメイン取得・Vercel 本番設定 | ⬜ 鮮度アラート Edge Function は実装済、Resend 契約待ち |
| C 完了後並走：営業準備 | 数日〜 | 結婚相談所への営業資料・台本・メーリングリスト構築 | ⬜ Phase C 完了後に着手（user 指示・2026-05-23） |
| E：リリース直後 | 継続 | GA4・PWA・ユーザー導線分析 | ⬜ 未着手 |

### 次セッションの優先順

1. **Phase C 残作業**（外部要因待ち）
   - 法人設立完了後、プレースホルダ実値差替を 1 コミットで実施
     - my-app：terms / privacy / tokushou の `[会社名]` `[所在地]` `[代表者氏名]` `[電話番号]` `[氏名]`
     - counselor：terms / privacy の `[会社名]` `[所在地]` `[氏名]`
     - 送客契約書テンプレ `docs/contracts/agency-agreement.md` の「甲」欄
     - サポートメール `hello@kinda-futari.app` の確定（Phase D ドメイン取得と連動）
   - 顧問弁護士レビュー（任意・営業前リスク低減のため推奨）
   - ✅ 2026-05-23 完了：PR #6 〜 PR #17（規約整備・明示同意・モバイル UI・契約書テンプレ・admin オーナー一括作成 UI）

2. **オーナー初期セットアップ運用** — admin から「相談所＋オーナー招待」モーダル (PR #16) で運用開始可能。
   - [x] **agencies.owner_user_id を admin から手動セットする UI**（2026-05-27 完了、`claude/futarive-admin-dashboard-iKBfw` の `eafaec8`）
   - [x] **counselor 側でオーナーが配下カウンセラーを招待する UI**（既存の `AddCounselorModal` で実装済を 2026-05-27 確認）

3. **営業準備**（実値差替完了後に着手）
   - 営業資料・台本・メーリングリスト（特定電子メール法対応は terms / privacy で根拠済）
   - 契約書 `docs/contracts/agency-agreement.md` を電子契約（クラウドサイン等）に取り込み判断

4. Phase D の Resend 契約・ドメイン取得は営業準備と並走可能
   - 配信メール本文末尾に**配信停止リンク**を必ず付与する API 実装（特電法第4条・user_metadata.marketing_emails_opt_in を false に書き戻し）

### ブランチ運用の参照先

新規セッション開始時は **CLAUDE.md §10「ブランチ運用」を最初に確認**すること。
過去の WORKLOG / TODO 内に登場する古いブランチ名（`claude/implement-kinda-talk-uDUoW` 等）は履歴情報で、現在の指定ではない。

---

## 🟢 Phase C 完了後・初期営業（順番厳守・2026-05-23 user 指示）

> **着手タイミング：Phase C（法務・契約）が完了してから。**
> 規約・特商法・特定電子メール法対応が整わないと営業活動自体が法的リスクになるため、順番を逆にしない。

ローンチに前後して並走するタスク群。プロダクト本体ではなく営業・対外発信。

- [ ] **結婚相談所への営業資料**：1 ページ概要 / 3〜5 ページの提案資料 / 料金表（送客料 ¥5,000・初期費用なし）
  - Kinda の差別化（口コミ × カウンセラー単位の選び方 / ユーザーファースト / クレイ風ビジュアル）を 1 スライドで伝える
  - 「掲載するだけ」「ご面談後の発生額のみ」のシンプルさを強調
- [ ] **営業台本（電話 / メール / 訪問）**：
  - 初回フック（30秒）／反論への返答（料金疑問・ステマ疑問・既存掲載先との違い）／クロージング
  - 「中立」と言わない・「ユーザーファースト」で押す（CLAUDE.md §1 準拠）
- [ ] **メーリングリスト構築**：
  - 結婚相談所オーナー連絡先の収集元（IBJ / BIU 加盟リスト / 公式サイト掘り起こし）
  - 送信ツールは Resend / SendGrid / Mailchimp のいずれか。鮮度アラートで Resend を使うなら統一が楽
  - **特定電子メール法**：オプトイン取得 or 「事業者向けの取引提案」例外を満たす運用設計が必要（要法務確認 → Phase C で整理）
  - 配信スケジュール（初回提案 → 1 週間後フォロー → 2 週間後最終 の 3 タッチが定番）

---

## 🗂 ドキュメントの使い分け（CLAUDE.md §9 より）

| ファイル | 役割 |
|---|---|
| `CLAUDE.md` | Kinda の憲法（世界観・トーン・ルール） |
| `WORKLOG.md` | 日々の作業ログ・実装メモ・ハマったこと |
| `TODO.md`（本ファイル） | タスク管理・次セッションへの引き継ぎ |
| `docs/image-audit.md` | 画像アセット監査の専用ドキュメント |
| `docs/*.md` | その他テーマ別の設計・実装ドキュメント |
