# TODO

ふたりへプロジェクトの未対応タスク一覧。完了したものは `[x]` でチェック、もしくは ~~取り消し線~~ で消し込み。

最終更新: 2026-05-20

---

## 🔴 直近で着手するもの

### A. UI 修正（小）

- [x] **A-1** `/admin/reviews`：口コミ本文を全文表示（2026-05-20）
- [x] **A-2** `futarive-admin` モバイル対応の追加調整（2026-05-20 ダッシュボード）

### B. 機能リネーム

- [x] **B-1** コラム → **Kinda voices**（futarive-admin 完了 2026-05-20）
  - [ ] フロントサイト（`my-app/src/`）のリネームは別ブランチで対応必要
  - [ ] futarive-counselor 側の言及あれば別ブランチで対応必要
- [x] **B-2** 成婚エピソード → **Kinda story**（futarive-admin 完了 2026-05-20）
  - [ ] フロントサイト側のリネームは別ブランチで対応必要
  - [ ] futarive-counselor 側の言及あれば別ブランチで対応必要

### C. Kinda type 関連の機能追加

- [x] **C-1** カウンセラー側 Kinda type タイプ分け（2026-05-20）
  - `futarive-counselor/app/(main)/profile/page.tsx` Step 2 に「相性の良い Kinda type」セクション追加
  - 4タイプカード型ピッカー（A/B/C/D + 色付きバッジ + 説明文）
- [ ] **C-2** `/kinda-type` ページ（カウンセラータイプ診断）
  - CLAUDE.md 2235 で「未実装・`/diagnosis` とは別フロー想定」と明記
  - 仕様の再確認から必要

---

## 🟡 過去に「やる」と言ったが未対応

### D. インフラ・運用

- [ ] **D-1** futarive-counselor のエラーメール根本対応
  - `claude/fix-profile-creation-1clpG` に push した billing 関連コードに futarive-counselor 側の type/build エラーがあるか確認・修正
  - Skip-deployments-no-changes の効果待ち

### E. 認証・ログイン後対応

- [ ] **E-1** マイページ：ログイン後に `diagnosis_results` から診断履歴を取得して表示（CLAUDE.md 1165）
- [ ] **E-2** 診断結果ページの「あとから見返したい人はこちら」遷移先を `/mypage/register` 等に変更（CLAUDE.md 1213）

### F. データ統合（モック → Supabase）

- [ ] **F-1** `src/lib/data.ts` AGENCIES / COUNSELORS を Supabase 化（CLAUDE.md 321）
- [ ] **F-2** `src/lib/mock/places.ts` のお店データを Supabase 化（CLAUDE.md 539）
- [ ] **F-3** `shops` テーブルに `thumb_variant`, `category_label`, `area_label`, `stage`, `location` カラム追加 → `getShops()` を Supabase に戻す（CLAUDE.md 1672）

### G. 検索・フィルター

- [ ] **G-1** 診断結果ページの「すべて見る」→ `/search?type={typeId}` でカウンセラーをフィルタリング（CLAUDE.md 1096, 1220）

### H. キャンセルポリシー連動

- [ ] **H-1** カウンセラー詳細：`counselor.cancelPolicy ?? agency.cancelPolicy ?? デフォルト` のフォールバック実装（CLAUDE.md 1028）

---

## 🟢 Phase B として保留

### I. ダッシュボード分析（futarive-admin）

- [ ] **I-1** GA4 Data API 連携実装
  - docs と `.env.example` の枠は 2026-05-20 に作成済み（`futarive-admin/docs/ga4-integration.md`）
- [ ] **I-2** トレンドセクション
  - 直近 7 日訪問数
  - 診断完了率（`kinda_note_start` → `kinda_note_complete`）
  - カウンセラー別 詳細閲覧数ランキング
  - 流入元別トラフィック内訳

### J. 課金関連の発展

- [ ] **J-1** 月次請求書 PDF 出力（agency 別）
- [ ] **J-2** 異議申立てに対する自動通知（メール / プッシュ）
- [ ] **J-3** 支払いステータス（`paid_at` カラム）と請求 ID の紐付け

### K. futarive-counselor の機能拡張

- [ ] **K-1** 複数カウンセラー切替（オーナー向け）：ダッシュボード・リール・プロフィールを `currentCounselorId` に連動
- [ ] **K-2** Supabase Realtime（カレンダー）：他デバイスでのスロット変更をリアルタイム反映
- [ ] **K-3** カレンダー画面から booked スロットの予約者情報を表示
- [ ] **K-4** プロフィール写真トリミング（ブラウザ内クロップ UI）
- [ ] **K-5** 通知機能：新規予約・新規口コミ着信時のブラウザ通知

---

## 完了済み（ログ）

- [x] **A-1** `/admin/reviews` 口コミ本文の全文表示（2026-05-20）
- [x] **A-2** futarive-admin モバイル対応（2026-05-20）
- [x] **B-1** コラム → Kinda voices（admin 側のみ・2026-05-20）
- [x] **B-2** 成婚エピソード → Kinda story（admin 側のみ・2026-05-20）
- [x] **C-1** カウンセラー側 Kinda type 編集 UI（2026-05-20）
- [x] 課金イベント基盤（billing_events + RPC + RLS + pg_cron） — counselor / admin 両側（2026-05-20）
- [x] futarive-admin TypeScript 型エラー修正（5 箇所）→ Vercel ビルド復活（2026-05-20）
- [x] futarive-admin ダッシュボード再構成（要対応 + 今月のKPI）（2026-05-20）
- [x] GA4 連携準備：docs + `.env.example` 枠（2026-05-20）

---

## 運用メモ

- このファイルは `main` ブランチに置きたいが、現状は各作業ブランチに分散して管理されているため、最新は **`claude/futarive-admin-dashboard-iKBfw` ブランチ**を参照
- 各ブランチで修正したタスクは、そのブランチ上で `[x]` チェックを入れる
- ブランチが分岐している場合、競合が起きたら最新の `[x]` を採用する
