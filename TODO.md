# TODO

ふたりへプロジェクトの未対応タスク一覧。完了したものは `[x]` でチェック、もしくは ~~取り消し線~~ で消し込み。

最終更新: 2026-05-21（セッション③ 終了時点）

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

- [x] **D-1** futarive-counselor / futarive-admin のエラーメール根本対応（2026-05-21）
  - 原因：iKBfw branch / uDUow branch には `futarive-counselor/` ディレクトリが、
    fix-profile-creation-1clpG branch には `futarive-admin/` ディレクトリが
    存在せず、Vercel が "Root Directory does not exist" でビルド失敗 → エラーメール
  - 対応：
    1. 各ブランチに `futarive-counselor/.gitkeep` / `futarive-admin/.gitkeep` の placeholder を追加
       して Root Directory が常に存在するように
    2. futarive-counselor / futarive-admin の両プロジェクトに
       Vercel Settings → Git → Ignored Build Step を設定（**許可ブランチ判定のみ**）
  - 最終 IBS コマンド（シンプル版）:
    ```bash
    # futarive-counselor 用
    case "$VERCEL_GIT_COMMIT_REF" in
      main|claude/fix-profile-creation-1clpG) exit 1 ;;
      *) exit 0 ;;
    esac
    ```
    ```bash
    # futarive-admin 用
    case "$VERCEL_GIT_COMMIT_REF" in
      main|claude/futarive-admin-dashboard-iKBfw) exit 1 ;;
      *) exit 0 ;;
    esac
    ```
  - exit 0 = ビルドスキップ（エラー扱いにならない・メール飛ばない）, exit 1 = ビルド実行
  - ⚠️ ハマりポイント（初期版で誤った）: Vercel は **Root Directory の中で IBS を実行する**ので、
    その中から `[ -d futarive-counselor ]` を確認すると入れ子のディレクトリ
    （`futarive-counselor/futarive-counselor/`）を探すことになり、常に false → 全 push がスキップされていた。
    Root Directory 存在チェックはディレクトリ側（.gitkeep）で担保し、IBS は許可ブランチ判定のみに絞るのが正解。

### E. 認証・ログイン後対応

- [x] **E-1** マイページ：ログイン後に `diagnosis_results` から診断履歴を取得して表示（2026-05-21）
  - `src/app/mypage/DiagnosisTypeHistorySection.tsx`（397 行・Kinda type 履歴）
  - `src/app/mypage/NoteHistorySection.tsx`（451 行・Kinda note 履歴・天気予報風横スクロール）
  - 両方とも `useAuth()` + Supabase `diagnosis_results` 読み取りで実装済み
- [x] **E-2** 診断結果ページの「あとから見返したい人はこちら」（2026-05-21）
  - 遷移先は `/mypage` のまま据え置き（未ログイン時 AuthCard で登録/ログインを促す）
  - 古い TODO コメントを `src/app/kinda-type/result/page.tsx` から削除
  - 当初想定の `/mypage/register` 専用ページは作らない方針

### F. データ統合（モック → Supabase）

- [ ] **F-1** `src/lib/data.ts` AGENCIES / COUNSELORS を Supabase 化（CLAUDE.md 321）
  - 部分対応：2026-05-21 セッション③ で実在名混入 + 名前不整合を解消（コミット `abf6bad` `6ed86b7` `c64b3d0`）
  - mock COUNSELORS / AGENCIES の実在名は全て架空名化。本格 Supabase 移行は次フェーズ
- [x] **F-2** `src/lib/mock/places.ts` のお店データを Supabase 化（2026-05-21 セッション③ / コミット `c64b3d0`）
  - `/places/[id]` を `getShopById()` 経由に変更
  - `buildPlaceFromShop()` で ShopDetail → Place 型互換に変換
  - mock places.ts は型定義 fallback として残置するが、user-site の表示は Supabase 一本化
- [x] **F-3** `shops` テーブルに `thumb_variant`, `category_label`, `area_label`, `location` カラム追加 + `getShops()` を Supabase に戻す（2026-05-21 セッション③ / コミット `705805e` `c64b3d0`）
  - migration: `f3_shops_align_with_place_home_type` / `f3_shops_sample_curation_9_stores` / `f3_shops_rename_to_fictional` / `f3_rename_legacy_mock_agencies_and_counselors_to_sample`
  - Kinda act / Kinda glow も Supabase 一本化（10 件問題 + リール→詳細別店舗問題を解消）
  - Supabase shops 9 件構成（カフェ 2 / レストラン 2 / ラウンジ 1 / 美容室 1 / ネイル 1 / 眉毛 1 / エステ 1、フォトスタジオはタブのみ）

### G. 検索・フィルター

- [x] **G-1** 診断結果ページの「すべて見る」→ `/search?type={typeId}` でカウンセラーをフィルタリング（2026-05-21 セッション③・コミット `fb76ec5`）
  - Kinda talk 側は既に `?type=A|B|C|D` の絞り込みに対応済みだったため、結果ページのリンクから typeId を渡すだけで完了
  - 古い「6タイプとのマッピング表」TODO コメント（4タイプ統一前の名残）を削除

### H. キャンセルポリシー連動

- [x] **H-1** カウンセラー詳細：`counselor.cancelPolicy ?? agency.cancelPolicy ?? デフォルト` のフォールバック実装（2026-05-21 セッション② / コミット `a14dbe5`）
  - CounselorShape 型に `cancelPolicy?: string` を追加
  - hero d-book-card / sidebar PC card の「登録不要 · 面談料 無料」テキストを ⓘ アイコン付きキャンセルポリシー表示に置換
  - mock counselors（cancelPolicy 未設定）→ 所属相談所のポリシーが自動で出る

### サンプル絞り込み（2026-05-21 セッション③）

- [x] **mock 整理 Phase 1**（コミット `abf6bad`）
  - COUNSELORS: ID 4, 5, 101〜105 を削除 → 4 名（1/2/3/6）に絞り込み
  - AGENCIES: ID 3, 4 を削除 → 3 社（1/2/5）に絞り込み
  - Agency 型に `isDemo?: boolean` 追加し、残り全カウンセラー・全相談所に `isDemo: true` 付与
  - 既存 DemoBadge コンポーネントで「サンプル」バッジが自動表示
- [x] **mock 整理 Phase 2**（コミット `6ed86b7`）— **名前不整合解消**
  - `/counselors/[id]/page.tsx` の hardcoded counselors{} と `src/lib/data.ts` の COUNSELORS で
    同 ID なのに別人（田中 美紀 ⇄ 田中 美咲 等）の不整合を全面解消
  - hardcoded 側を src/lib/data.ts の人物に書き換え、reviews 本文も新キャラに合わせて書き直し
  - `src/app/booking/[counselorId]/page.tsx` / `src/app/counselors/page.tsx` /
    `src/components/reviews/ReviewGate.tsx` / `src/lib/mock/{episodes,stories}.ts` も同期
  - ID 6 の hardcoded `agencyId="6"`（AGENCIES 未存在）バグも `"5"` に修正

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

- [x] **J-1** 月次請求書 HTML 発行（2026-05-21）
  - `/admin/billing` 相談所別集計に「🖨 発行」ボタン追加
  - クリック → `assign_monthly_invoice` RPC で invoice_number 一括付与
  - 別タブで `/admin/billing/invoice/[agencyId]/[ym]` を開く（印刷で PDF 保存）
  - 振込先・住所のプレースホルダーは本番リリース時に書き換え必要
- [x] **J-2** 異議申立てに対する自動通知（メール）（2026-05-21 完了）
  - Resend 連携 + Supabase Database Webhook → Vercel Route Handler → メール送信
  - メール内容に判定材料追加（予約日・異議申立日・利用者メッセージ・相談所メッセージ）
  - 統括画面の解決モーダルにも同様の情報を表示
  - **TODO**: main ブランチに merge する際、Supabase Webhook の URL を branch alias から
    Production URL（`https://futarive-admin-fffkbn84-4095s-projects.vercel.app/...`）に戻す
  - **TODO**: プッシュ通知は未着手（次フェーズ）
- [x] **J-3** 支払いステータス（`paid_at` カラム）と請求 ID の紐付け（2026-05-21）
  - billing_events に paid_at / invoice_number / payment_method / payment_note / marked_paid_by 追加
  - RPC: mark_billing_paid / mark_invoice_paid / unmark_billing_paid（admin のみ）
  - /admin/billing に「支払い確認」モーダル + フィルター + 集計列追加
  - counselor /billing にも「支払い済み / お支払い待ち」バッジ表示
- [ ] **J-4** 送客料 ¥5,000 への変更を反映済み（2026-05-21）
  - DB: `billing_events.amount_jpy` DEFAULT 5000
  - migration ファイル（admin / counselor 両方）のコメントと固定値も同期

### K. futarive-counselor の機能拡張

- [x] **K-1** 複数カウンセラー切替（オーナー向け）（2026-05-21）
  - 共通 hook `lib/hooks/useAgencyScope.ts` + UI `components/shared/ScopeSwitcher.tsx`
  - reel ページに統合（カウンセラー切替で画像・キャッチコピー・bio・公開設定が連動）
  - dashboard / inbox / calendar は既存実装が同じ localStorage キーを共有
  - **TODO**: profile / reviews / billing への展開は次フェーズ
  - **TODO**: admin_users への運営追加方法（fffkbn84@gmail.com は登録済み・他スタッフ追加時は Supabase SQL Editor で INSERT）
- [x] **K-2** Supabase Realtime（カレンダー）：他デバイスでのスロット変更をリアルタイム反映（2026-05-21）
  - コード側は元々実装済み（`futarive-counselor/app/(main)/calendar/page.tsx` line 165-175）
  - 問題は DB 側 — `slots` テーブルが `supabase_realtime` publication に登録されていなかった
  - migration `enable_realtime_for_slots` で `ALTER PUBLICATION supabase_realtime ADD TABLE public.slots` を適用
  - iPad/iPhone 2台同時テストで実機確認済み
- [x] **K-3** カレンダー画面から booked スロットの予約者情報を表示（既存対応済み）
- [x] **K-4** プロフィール写真トリミング（既存対応済み・2026-05-21 確認）
  - `futarive-counselor/components/profile/PhotoCropModal.tsx`（357 行）
  - 丸型クロップ UI / タッチドラッグ / ピンチイン・アウト / マウスホイールズーム
  - 出力 512x512 JPG（品質0.9）
  - 既存写真の再編集（`photo_url` から fetch → File 変換 → モーダル再起動）対応
- [x] **K-5** 通知機能：新規予約・新規口コミ着信時のブラウザ通知（2026-05-21）
  - DB: `enable_realtime_for_reservations_and_reviews` migration で publication 追加
  - `futarive-counselor/lib/notifications.ts`: Web Notifications API ラッパー（permission/preference/show）
  - `futarive-counselor/components/shell/NotificationListener.tsx`: 全ページ globalに動く Realtime listener
  - `futarive-counselor/components/shared/NotificationSettingsCard.tsx`: ダッシュボード設置の ON/OFF UI
  - 制約: iPhone Safari は PWA 化必要（plain Notification は表示されない）→ 当面 desktop / Android Chrome 想定

---

## 完了済み（ログ）

- [x] **A-1** `/admin/reviews` 口コミ本文の全文表示（2026-05-20）
- [x] **A-2** futarive-admin モバイル対応（2026-05-20）
- [x] **B-1** コラム → Kinda voices（admin 側のみ・2026-05-20）
- [x] **B-2** 成婚エピソード → Kinda story（admin 側のみ・2026-05-20）
- [x] **C-1** カウンセラー側 Kinda type 編集 UI（2026-05-20）
- [x] **J-1** 月次請求書 HTML 発行ページ + invoice_number 一括付与 RPC（2026-05-21）
- [x] **J-2** 課金異議申立て自動メール通知（Resend + Supabase Webhook + Vercel Route Handler）（2026-05-21）
- [x] **J-3** 支払いステータス管理（paid_at + invoice_number + RPC + UI）（2026-05-21）
- [x] **K-1** 複数カウンセラー切替（useAgencyScope hook + ScopeSwitcher UI + reel 統合）（2026-05-21）
- [x] admin_users への fffkbn84@gmail.com 登録（運営権限付与）（2026-05-21）
- [x] 送客料 ¥10,000 → ¥5,000 への統一（DB + migration ファイル + UI 全箇所）（2026-05-21）
- [x] counselor `/billing` 表記改善（Kinda 請求履歴 + 説明セクション追加）（2026-05-21）
- [x] 課金イベント基盤（billing_events + RPC + RLS + pg_cron） — counselor / admin 両側（2026-05-20）
- [x] futarive-admin TypeScript 型エラー修正（5 箇所）→ Vercel ビルド復活（2026-05-20）
- [x] futarive-admin ダッシュボード再構成（要対応 + 今月のKPI）（2026-05-20）
- [x] GA4 連携準備：docs + `.env.example` 枠（2026-05-20）
- [x] **G-1** 診断結果ページ「すべて見る」を `?type={typeId}` 付きに（2026-05-21 セッション③）
- [x] **H-1** カウンセラー詳細キャンセルポリシー fallback（2026-05-21 セッション②）
- [x] **mock 整理 Phase 1** — カウンセラー 4 名 + 相談所 3 社に絞り込み + isDemo フラグ（2026-05-21 セッション③）
- [x] **mock 整理 Phase 2** — 名前不整合解消（hardcoded counselors と src/lib/data.ts の人物統一）（2026-05-21 セッション③）
- [x] /kinda-type/quiz / /kinda-note/quiz でフローティング戻るボタンを非表示（2026-05-21 セッション③ / コミット `7367f65`）
- [x] **B-1 / B-2 フロント側リブランド残箇所**（2026-05-21 セッション③ / コミット `7495079`）
  - /episodes/[id] → /kinda-story/[id] 308 リダイレクト
  - SympathySavedSection マイページ「エピソード」「コラム」→ Bパターン（KINDA STORY/VOICES eyebrow + 日本語見出し）
  - /note/weather CTA「コラムで深く読む」→「Kinda voices で深く読む」
  - EpisodesSection.tsx 削除（完全 dead code）
- [x] **F-3 完了** — shops Supabase 化 + Kinda act / Kinda glow / /places/[id] を Supabase 一本化（2026-05-21 セッション③ / コミット `705805e` `c64b3d0`）
- [x] **F-2 部分完了** — /places/[id] を Supabase 経由に変更（2026-05-21 セッション③）
- [x] **実在店舗・相談所名の全廃**（2026-05-21 セッション③ / コミット `c64b3d0`）
  - Supabase shops 8 件 + mock placesHomeData / places.ts 20 件 + AGENCIES 3 件 + Supabase agencies/counselors 旧 mock 残骸 12 件 を架空名にリネーム
- [x] **Kinda glow グリッドレイアウト修正**（未定義 `.kt-reel-grid` → `.kt-grid` に統一）（2026-05-21 セッション③）
- [x] **FloatingBackButton を /kinda-type/quiz / /kinda-note/quiz で非表示**（2026-05-21 セッション③）

---

## 運用メモ

- このファイルは `main` ブランチに置きたいが、現状は各作業ブランチに分散して管理されているため、最新は **`claude/futarive-admin-dashboard-iKBfw` ブランチ**を参照
- 各ブランチで修正したタスクは、そのブランチ上で `[x]` チェックを入れる
- ブランチが分岐している場合、競合が起きたら最新の `[x]` を採用する

### 運営スタッフ追加方法（admin 権限付与）

新しい運営スタッフを admin として追加する場合：

```sql
-- 1. その人が futarive-admin にログインして、auth.users に存在することを確認
SELECT id, email FROM auth.users WHERE email = '新スタッフのメール';

-- 2. その id を admin_users に登録
INSERT INTO admin_users (id, role)
VALUES ('上記で取得したUUID', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

これは Supabase SQL Editor から実行。2026-05-21 時点で fffkbn84@gmail.com は登録済み。

---

## 🟠 次セッション用の引き継ぎ（2026-05-21 セッション② 終了時）

### このセッションで完了したタスク

| ID | 内容 |
|---|---|
| 動作確認 J-1 popup | Safari 別タブで請求書発行 → 完璧に動作 |
| 動作確認 口コミ URL 404 | Vercel Auth 解除 + uDUow を Production に Promote + `futarive-counselor/lib/config.ts` FRONTSITE_URL を production alias に変更 |
| 口コミフォーム星評価 UI | 総合評価 SVG40px ボタン化 + 項目別評価 縦並び28px |
| H-1 | カウンセラー詳細ページのキャンセルポリシー fallback（counselor → agency → デフォルト） |
| D-1 | Vercel エラーメール根本対応（.gitkeep + IBS 設定。**IBS ロジック注意点あり** ↓ 参照） |
| E-1 / E-2 | マイページ Supabase 連携（実装済み確認）+ 古い TODO コメント整理 |
| K-2 | カレンダー Realtime（`supabase_realtime` publication に slots 追加） |
| K-3 / K-4 | 既に実装済みを確認しマーク |
| K-5 | ブラウザ通知（reservations/reviews publication 追加 + NotificationListener + 設定 UI） |

### 作業ブランチと役割

| プロジェクト | 開発ブランチ | Vercel deploy 対象ディレクトリ |
|---|---|---|
| **my-app-rp9u**（フロントサイト） | `claude/implement-kinda-talk-uDUoW` | `.`（リポジトリルート） |
| **futarive-counselor**（カウンセラー管理画面） | `claude/fix-profile-creation-1clpG` | `futarive-counselor/` |
| **futarive-admin**（運営管理画面） | `claude/futarive-admin-dashboard-iKBfw` | `futarive-admin/` |

Vercel 各プロジェクトの「許可ブランチ」（Ignored Build Step）：
- my-app-rp9u: `main`, `claude/implement-kinda-talk-uDUoW`
- futarive-counselor: `main`, `claude/fix-profile-creation-1clpG`
- futarive-admin: `main`, `claude/futarive-admin-dashboard-iKBfw`

各 IBS コマンドの最終版（**前回のロジックバグを訂正済み**）：

```bash
# futarive-counselor 用
case "$VERCEL_GIT_COMMIT_REF" in
  main|claude/fix-profile-creation-1clpG) exit 1 ;;
  *) exit 0 ;;
esac
```

```bash
# futarive-admin 用
case "$VERCEL_GIT_COMMIT_REF" in
  main|claude/futarive-admin-dashboard-iKBfw) exit 1 ;;
  *) exit 0 ;;
esac
```

### 重要な運用ポイント（次セッションでも継続）

1. **production deploy は手動 Promote が必要**
   - Vercel の Production Branch 設定が `main` のまま、開発は他ブランチで行っているため
   - 大事な変更を本番反映したい時は uDUow の最新 deploy を Vercel UI から「Promote to Production」する
   - 将来的には main マージ or Production Branch 切替 or カスタムドメイン設定で自動化したい

2. **`.gitkeep` を消さない**
   - 各ブランチで存在しないはずの `futarive-counselor/.gitkeep` / `futarive-admin/.gitkeep` は
     Vercel の Root Directory check を通すための placeholder
   - これを消すと D-1 で対応したエラーメール問題が再発する

3. **DB Realtime publication 追加が必要なテーブル**
   - 既追加: `slots`, `reservations`, `reviews`
   - 今後追加するなら：`billing_events`（運営の即時表示用）, `agencies`（多店舗管理時）

### ⚠️ ハマりポイント（次回回避用）

1. **Vercel Ignored Build Step は Root Directory の中で実行される**
   - そこから `[ -d futarive-counselor ]` などのチェックを書くと入れ子になり常に false
   - Root Directory 存在の保証は .gitkeep で、IBS は許可ブランチ判定のみが正解

2. **Promote to Production と main マージは別物**
   - Promote しても git の main には何もマージされない（Vercel の production target に紐づくだけ）

3. **iPhone Safari の Web Notifications は PWA 化必須**
   - K-5 のブラウザ通知は当面 desktop / Android Chrome 想定

4. **Supabase Realtime はテーブル単位で publication 追加が必要**
   - クライアント側の `supabase.channel(...).subscribe()` だけでは動かない
   - `ALTER PUBLICATION supabase_realtime ADD TABLE <name>` が必要

### 残タスク（次セッション候補）

セッション③（2026-05-21）で G-1 / H-1 / 名前不整合解消 / F-2 / F-3 / B-1/B-2 フロント側 / 実在名全廃 / Kinda glow グリッド修正 は完了済み。

#### 🔴 次セッション最優先：admin お店登録ページ実装

| 項目 | 内容 | 規模 | 作業ブランチ |
|---|---|---|---|
| **L-1 admin お店登録ページ新設** | futarive-admin に `/admin/shops/new` + `/admin/shops/[id]/edit` ページ。F-3 で `shops` テーブルを Supabase 化済み（thumb_variant / category_label / area_label / location カラム追加済み）なので、UI を作れば即連動 | 中 | `claude/futarive-admin-dashboard-iKBfw` |
| **L-2 SNS 予約導線フィールド追加** | `shops` テーブルに `booking_url` `instagram_url` `other_social_url` カラム追加 → user-site の /places/[id] サイドバー CTA で「お店のサイトを見る」「Instagram で予約」を出し分け。カフェなどは Instagram が主予約口のため | 中 | DB migration + futarive-admin 編集 UI + user-site 表示の 3 段階 |

#### 🟡 次々セッション以降

| ID | 内容 | 規模 | 作業ブランチ |
|---|---|---|---|
| **動作確認（セッション③成果物）** | 翌日デプロイ後に Kinda act 5 件 / Kinda glow 4 件 / リール→詳細整合 / グリッドサイズ / 架空名表示 を実機確認 | 小 | `claude/implement-kinda-talk-uDUoW`（user-site） |
| **iPhone PWA 化** | K-5 のブラウザ通知を iPhone Safari でも動かす | 中 | `claude/fix-profile-creation-1clpG`（futarive-counselor） |
| **main マージ運用整備** | Production Branch を切替 or main へのマージフロー確立 | 中 | インフラ系（3 ブランチ全体） |
| **Supabase agencies/counselors 整理** | 旧 mock 残骸 12 件の DELETE / is_published=false 判断（運営判断） | 小〜中 | Supabase SQL Editor（運営本人） |
| **F-1（残）** | mock の COUNSELORS / AGENCIES を完全 Supabase 化（mock 4 名分を Supabase に INSERT、mock 廃止） | 大 | `claude/implement-kinda-talk-uDUoW` |
| **I-1 / I-2** | GA4 連携（docs 準備済み） | 大 | `claude/futarive-admin-dashboard-iKBfw` |
| **K-1 続編（profile）** | profile ページもオーナー切替可能に | 中〜大（RLS 拡張要・本人が保留判断） | `claude/fix-profile-creation-1clpG` |
| **C-2** | `/kinda-type` ページ（カウンセラータイプ診断・仕様再確認から） | 中〜大 | `claude/implement-kinda-talk-uDUoW` |

### 次セッションの開始時にやること

1. **このメモを読む**（TODO.md 末尾 + CLAUDE.md の対応セクション）
2. **動作確認**が完了したかふうかさんに聞く（実機テストが残っているもの）
3. その後、上記候補から優先タスクをふうかさんに確認して進める

ふうかさんから「1タスクに集中して終わらせてから次へ」というスタイル指針あり。複数並行しない。
