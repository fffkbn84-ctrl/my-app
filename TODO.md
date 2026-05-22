# TODO.md — タスク管理・次セッションへの引き継ぎ

> このファイルは **「次に何をやるか」「今どこまで進んでいるか」** を 1 枚で把握するためのもの。
> 完了した項目は履歴として残してよいが、行頭を `- [x]` にして本文を 1 行に圧縮する。
> 詳細な実装メモは `WORKLOG.md`、画像周りの監査は `docs/image-audit.md` を参照。

最終更新: 2026-05-22

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

### サンプルデータの整理（admin / DB 連携の未完部分）

`counselors` 側はサンプル名・isDemo フラグでほぼ揃っているが、`agencies` と admin UI に整理漏れあり：

- [ ] **agencies の is_demo フラグ修正**：DB に `（サンプル）` 名が 6 件あるのに `is_demo=false` のまま。
  単発 SQL で `UPDATE agencies SET is_demo = true WHERE name LIKE '%（サンプル）%'`
- [ ] **agencies 重複登録の整理**：`Emma〜そろそろ結婚してみようかな〜` が 2 件（owner あり / owner なし）。owner なしの方を削除
- [ ] **`counselors` 中の "山田孝之"（is_demo=false / owner なし）** の処遇判断（サンプル化 or 削除）
- [ ] **admin に `is_demo` 列表示 + トグル**：`futarive-admin/app/admin/counselors/page.tsx` および `shops/page.tsx`（shops はそもそも is_demo 列が DB にない。badge_type で運用するなら admin/agencies/page.tsx 含めて方針統一）
- [ ] **未使用 Next.js scaffolding SVG 削除**：`public/{next,window,file,globe,vercel}.svg`（参照 0 件・5 ファイル）

---

## ✅ 完了（今セッション、2026-05-22）

- [x] Kinda note intro hero に clay 装飾画像（`kinda-note-deco-1.webp`）を採用（`0e8eb4a`）
- [x] CTA 直前の deco-2 は配置せず保留、アセットは保全（`61f14a4`）
- [x] ロゴ 2 枚を webp 化＋コード差替＋旧 PNG 削除（`ba6cfe2`、-1.17MB）
- [x] 重複 .jpg 2 件削除（`b2b34d4`、-383KB）
- [x] `docs/image-audit.md` rev. 2 / rev. 3 更新（オーファン誤検出修正、完了タスクの状態反映）

---

## 📌 ロードマップ（参考）

前セッションで決めた本番リリースまでの大枠：

| Phase | 期間目安 | 内容 |
|---|---|---|
| A：機能拡充 | ほぼ完了 | admin / counselor / user-site の主要機能 |
| B：コンテンツ整備 | 1〜2 週 | 画像監査・実カウンセラー投入・**鮮度管理**（← 次） |
| C：法務・契約 | 1 週 | 利用規約・特商法表記の本番値差替・規約レビュー |
| D：リリース前準備 | 数日 | SMTP / Auth Confirm ON / 本番ドメイン / Vercel Production Branch=main |
| E：リリース直後 | 継続 | GA4・PWA・ユーザー導線分析 |

次セッションの優先順（前セッションの計画）：
1. ~~画像監査タスク（小）— docs/image-audit.md 作成。loading-state 候補 + 不足画像リスト + オーナメント候補~~ ✅
2. ~~last_reviewed_at + 鮮度管理ダッシュボード（中）~~ ✅ 既存 updated_at + Resend Edge Function でカバー済みと判定（2026-05-22）
3. SNS 流入対策（小）— カウンセラー管理画面の SNS フィールド表示制限ロジックを futarive-counselor で実装。利用規約案文章は `/terms` を更新

---

## 🟢 サイト稼働後・初期営業（タイミングを見て着手）

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
  - **特定電子メール法**：オプトイン取得 or 「事業者向けの取引提案」例外を満たす運用設計が必要（要法務確認）
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
