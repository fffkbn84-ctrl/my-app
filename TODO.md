# TODO.md — タスク管理・次セッションへの引き継ぎ

> このファイルは **「次に何をやるか」「今どこまで進んでいるか」** を 1 枚で把握するためのもの。
> 完了した項目は履歴として残してよいが、行頭を `- [x]` にして本文を 1 行に圧縮する。
> 詳細な実装メモは `WORKLOG.md`、画像周りの監査は `docs/image-audit.md` を参照。

最終更新: 2026-05-22

---

## 🔥 次セッションの優先タスク

### Task 3: `last_reviewed_at` + 鮮度管理ダッシュボード（中）

**目的：** 掲載中のカウンセラー／相談所／お店情報が「最後にいつ運営側で点検されたか」を可視化し、古い情報が放置されないようにする（Phase B「コンテンツ整備」の足回り）。

**設計判断が必要な項目（着手前に確認）：**

1. **対象テーブル：** どれに `last_reviewed_at` を持たせるか？
   - 候補：`counselors` / `shops`（カフェ等）/ `agencies`（相談所）/ `columns`
   - 全部やるか、まずは 1〜2 個に絞るか
2. **更新トリガー：** 誰が・いつ更新するか？
   - 案 A：admin が「点検した」ボタンを押した時
   - 案 B：admin がレコードを編集して保存した時に自動更新
   - 案 C：A + B のハイブリッド（手動「点検済」ボタン＋編集時の自動）
3. **ダッシュボードの居場所：** futarive-admin のどこ？
   - admin top に「鮮度警告」ウィジェット？
   - 各管理画面（counselors 一覧等）にソート列追加？
   - 専用 `/admin/freshness` ページ？
4. **鮮度の閾値：** 何日経ったら「古い」と表示するか？
   - 例：30 日（黄）/ 90 日（赤）

**実装の流れ（仮）：**
1. Supabase に `last_reviewed_at timestamptz` カラムを追加（マイグレーション）
2. 既存レコードに `created_at` を初期値として埋める
3. admin 側の編集フローで保存時に `now()` で更新（trigger or アプリ側）
4. ダッシュボード UI 実装

---

## 🟡 リリース前 must（残）

`docs/image-audit.md` §7 より、未着手項目を転記：

- [ ] **#4 `not-found.tsx` 新設 + イラスト 1 枚**（中、1h）
  - 削除されたお店 / カウンセラーへのアクセスで素っ気ない画面を防ぐ
  - 既存 weather 系 webp を流用しても可
- [ ] **#5 `KindaLoader` コンポーネント新設**（中、1.5h）
  - `Suspense fallback={<div style={{minHeight: 400}} />}` の 5 箇所を置換
    （agencies / kinda-act / kinda-talk / kinda-glow / login）
  - variant: `inline`（短い待ち）/ `page`（長い待ち、Suspense fallback 用）

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
2. **last_reviewed_at + 鮮度管理ダッシュボード（中）— Phase B の足回り** ← 次
3. SNS 流入対策（小）— カウンセラー管理画面の SNS フィールド表示制限ロジックを futarive-counselor で実装。利用規約案文章は `/terms` を更新

---

## 🗂 ドキュメントの使い分け（CLAUDE.md §9 より）

| ファイル | 役割 |
|---|---|
| `CLAUDE.md` | Kinda の憲法（世界観・トーン・ルール） |
| `WORKLOG.md` | 日々の作業ログ・実装メモ・ハマったこと |
| `TODO.md`（本ファイル） | タスク管理・次セッションへの引き継ぎ |
| `docs/image-audit.md` | 画像アセット監査の専用ドキュメント |
| `docs/*.md` | その他テーマ別の設計・実装ドキュメント |
