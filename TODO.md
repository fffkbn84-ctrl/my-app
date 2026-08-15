# TODO.md — タスク管理・次セッションへの引き継ぎ

> **やることの正はこのファイル。日程・繰り返し予定の正は Notion「運営カレンダー」**（Kinda 運営ダッシュボード内）。
> 完了したら行頭を `- [x]` にして1行に圧縮。詳細な実装メモは `WORKLOG.md`。
> 2026-07-02 に全面整理（重複統合・完了項目の退避）。整理前の全文は `docs/archive/todo-full-archive-2026-07-02.md`。
> 定期整理は `/repo-tidy` Skill で行う。

最終更新: 2026-08-13

---

## 📌 次セッション引き継ぎ（最初に読む）

### 🆕 2026-08-13 Kinda pair v1.0・交際期コラム4本・デモ隔離（今セッション分）

> **main にマージ済み・本番反映済み**（マージコミット `cc6f613`）。
> 実装メモは WORKLOG 2026-08-05〜13。URL の正は `docs/site-url-structure.md`。

#### ✅ やり残しチェックリスト（この系統・上から順に片付ける）

| # | やること | 状態 | 詰まっている理由 |
|---|---|---|---|
| 1 | トップの戸棚に Kinda pair を5枚目として入れる | **判断待ち** | 画像未生成＋グリッドが4枚前提（下記 A） |
| 2 | Kinda story のサンプル4本（consent なし）の扱いを決める | **判断待ち** | 実話でない物語をどう下げるかは content 判断（下記 B） |
| 3 | `/counselors` 一覧の架空モックの是正 | **判断待ち** | 直すと一覧が空になる（下記 C） |
| 4 | GA4 DebugView で pair のイベント6種を確認 | 未着手 | 本番反映済みなので実施可能 |
| 5 | iPhone 16 Pro で `/kinda-pair` 3ページ＋0件表示を実機確認 | 未着手 | 同上 |
| 6 | `/kinda-pair/solo` の `X-Robots-Tag` を本番レスポンスヘッダーで確認 | 未着手 | メタタグ側は確認済み |
| 7 | `/kinda-pair` に `FAQPage` を付けるか決める | 未着手 | 仕様書と実装指示書で記述が割れている（下記 D） |
| 8 | `SECTION_PREVIEW_COUNT = 6` の見直し | 未着手 | 7件目のコラムが `/columns` 一覧に出ない |

**判断が必要なもの（詳細）**

- [ ] **A. トップの戸棚に Kinda pair を5枚目として入れる**（実装指示書 2026-08-08 §5-1）。`type/talk/act/glow` の4枚帯に5枚目として入れる。カード定義は `src/app/page.tsx` の `DECIDED_CARDS` に1オブジェクト足すだけ。
  - **画像プロンプトは用意済み**：`docs/guides/miniature-image-guide.md` 第3弾（第2弾の共通テンプレート＋pair 用 SCENE・貼り付け用の完成形あり）。生成 → 正方形クロップ → WebP → `public/images/section-pair-room.webp`
  - 色は**セージグリーン**を提案（既存 type=青 `#E0ECF8` / talk=黄 `#FAF3DE` / act=桃 `#F5E1E0` / glow=紫 `#EDE0F4` と重ならない）
  - ⚠️ **グリッドが4枚前提**（`.pc-grid-2to4`：モバイル `1fr 1fr`／PC `repeat(4,1fr)`）。5枚だとモバイル2+2+1・PC4+1 で**升目が1つ空く**。次のどれかを選ぶ：
    - **(1) 5枚のまま並びを直す**（PC を `repeat(5,1fr)`、モバイルは5枚目を2列ぶち抜き＝下段の広い引き出しに見せる）← 追加画像1枚で済む・推奨
    - **(2) 6枚にする**（Kinda note を戸棚に昇格 → モバイル2×3・PC3×2 で完全に埋まる）← 画像がもう1枚要る
    - **(3) 戸棚は4枚のままにして、pair は別ブロックで置く**（フッター・ハンバーガーには既に入っているので、トップは見送る）
- [ ] **B. Kinda story のサンプル4本（`id: "1" "4" "5" "6"`・consent なし）の扱い**。デモカウンセラーを全画面から隠したため、**サイト上に存在しないカウンセラー名（田中 美紀・林 俊介）が物語の署名としてトップに残っている**。sitemap からは既に除外済みだが、URL と一覧表示は生きている
- [ ] **C. `/counselors` 一覧の是正方針**。`src/app/counselors/page.tsx` に**ページ内直書きの架空カウンセラー**（4.9/82件 等）があり、`is_demo` の仕組みの外にある。是正すると一覧が空になるため、Supabase 接続に切替か、ページごと下げるかの判断が要る。sitemap には未登録で、`/counselors/[id]` からのリンクのみ

**やり残し・確認待ち**

- [ ] GA4 DebugView で pair のイベント6種の発火確認（`pair_start` / `pair_layer_complete` / `pair_solo_complete` / `pair_copy` / `pair_image_save` / `notify_signup{source:"pair_lp"}`）
- [ ] iPhone 16 Pro で `/kinda-pair` 3ページと0件表示の実機確認
- [ ] `/kinda-pair/solo` の `X-Robots-Tag` がプレビューのレスポンスヘッダーに乗っているか確認（メタタグ側は確認済み）
- [ ] `/kinda-pair` に `FAQPage` を付けるか（`docs/site-url-structure.md` §5 の表は LP にも想定。実装指示書 v1.0 §6 は `WebApplication` + `BreadcrumbList` のみと定義しており、指示書に従った）
- [ ] `SECTION_PREVIEW_COUNT = 6` の見直し（7件目のコラムが `/columns` 一覧に出ない。`soudanjo-to-konkatsu-app-chigai` が該当。バグではないが取りこぼし）

**この系統で確定した不変則（変更しない）**

- Kinda pair v1.0 は **Supabase を使わない**。solo は `localStorage` のみ・`fetch` を書かない・`pair_*` テーブルを作らない
- 話題28件の正は `src/lib/pair/topics.ts` の1ファイル。ページに文言をハードコードしない
- `/kinda-pair/solo` は noindex（メタ + `X-Robots-Tag`）・sitemap に入れない
- ％表示をどこにも出さない。実数のみ。絵文字ゼロ
- 連盟差の注記は**この2行のみ**（「コネクトシップ」は全廃・リポジトリ全体0件）
  ```
  結婚相談所が加盟している連盟によって、ルールが異なる場合があります。
  詳しくは担当の方にご確認ください。
  ```
- カウンセラー0件時は「準備中」「近日公開」を使わず「**まだ公開していません**」＋ `NotifySignup`
- デモ（`is_demo`）はレコードを消さない。ユーザー向け画面では `getPublicCounselors()` を使う。
  `getCounselors()`（デモ込み）を使ってよいのは `/kinda-talk` の `?preview=1` と `/for-counselors` の掲載イメージだけ

**v1.1 以降（未着手・仕様は受領済み）**

- [ ] ふたりモード（招待・突き合わせ）＋**終了体験**（パッチ v1.1 で v1.1 に格上げ）。見送り画面・`pair_tombstones`（sha256 は Web Crypto API。`node:crypto` 不可）・Kinda note への一行導線
- [ ] ルームのライフサイクル（`active` / `continued` / `ended`。固定180日は廃止、例外的に最終アクセスから730日）
- [ ] 担当共有URL（v1.2・**オプション扱いに格下げ**。「担当の方によって使い方は異なります」の一行を必ず添える）
- [ ] カウンセラープロフィールの属性項目（v1.3・`/kinda-talk/counselors/[slug]` と同時）

### 🆕 2026-07-10 SNS投稿スタジオ・事業計画v1（今セッション分）

- [ ] **hello@kinda.jp を受信可能にする**（Google Workspace の既存ユーザーにエイリアス or グループで追加＝ライセンス追加不要。kinda.jp の MX/SPF/DKIM/DMARC を Vercel DNS に追加）→ 完了後フォーム営業第1波50社
- [ ] リスト戦略v1をフォーム営業優先に書き換え（`docs/sales/kinda-list-strategy-v1.html`。調査：フォームはメールの数倍の反響率）
- [ ] X/IG 自動投稿 Phase 2 の判断（まずは X ネイティブ予約投稿＋Meta Business Suite 予約で週1セット運用。効果が出たら X API（無料枠500件/月）＋Vercel Cron で Notion→自動投稿を構築）
- [ ] voices 取材素材が届き次第 `/kinda-voices` で記事化（Claude 待機中）
- [ ] IG「じぶんツッコミ型R」（7/20）は投稿前に実話へ差し替え
- [ ] IG は**1日1本ルール**（7/10〜7/20 リスケ済み。下書き投入時は既存エントリの日付を確認）
- 資産：SNS投稿スタジオ https://claude.ai/code/artifact/845b9c73-1a9f-4d65-b218-1775fdb299a4 ／事業計画v1（Notion・運営ダッシュボード直下）／6つの型・テロップ標準・フックの型はスタジオ内「型と根拠」参照

### 開始手順（ユーザーサイト作業の場合）
1. `git fetch origin` → **`git checkout -B <feature> origin/main`**（ローカル main は信用しない＝CLAUDE.md §10）。
2. 作業 → push → プレビュー確認 → main マージ。
3. ⚠️ **counselor/admin は別系統**：`futarive-counselor/` は `claude/fix-profile-creation-1clpG`、`futarive-admin/` は `claude/futarive-admin-dashboard-iKBfw`。編集は各サブディレクトリ配下のみ。

### ⚠️ デプロイの落とし穴（必読）
- main の tip コミットに `src public content package.json next.config.ts tsconfig.json` の差分が無いと Vercel が本番ビルドをスキップ（CANCELED）する。**docs-only コミットを main の最後に置かない**。マージ後は production が READY か確認。

### 🤖 AI運用資産（2026-07-02 導入）
- Skill: `/sns-pack`（SNS一括生成→Notion下書き）／`/sns-review`（実績分析→翌週方針）／`/kinda-column`（SEOコラム）／`/kinda-voices`（取材記事＝columns の取材レポート）／`/kinda-story`（同意ゲート付き）／`/repo-tidy`（この整理の再実行）
- QA: `npm run qa:content`（公開前の機械チェック）
- 全体像: `docs/ops/ai-ops-playbook.md`／Notion「AI運用手順」「SNS運用マップ」ページ

### ⚠️ admin（futarive-admin）デプロイの落とし穴（2026-07-04・Claudeが指示する時は必ず反映）

> ふうかは Vercel の Redeploy で誤って別デプロイを叩きがち。Claude はふうかに Redeploy を依頼する時、**必ず「どのブランチの行か」まで指定する**こと。

- **admin の本番実体は `claude/futarive-admin-dashboard-iKBfw` ブランチの Preview デプロイ**。`main`/Production 系統は実体を伴わず**ずっと ERROR 表示**（既知・無視してよい）。ふうかが「エラーが出た」と言ったら、まず対象デプロイのブランチが `main` かどうかを疑う。
- **Redeploy は必ず Deployments 一覧で「ブランチ = `claude/futarive-admin-dashboard-iKBfw`」の行**（＝目的のコミットメッセージの行）から実行するよう指示する。`main` の行を Redeploy しても意味がなく ERROR になる。
- **Vercel の env（環境変数）を変更したら、反映には Redeploy が必須**。「env を入れたのに効かない」時は未 Redeploy か、古いデプロイ URL を見ている可能性を最初に確認する。
- **確認 URL はデプロイごとに変わる**。ふうかに渡す時はブランチ固定エイリアス `https://futarive-admin-git-claude-futari-fcf6db-fffkbn84-4095s-projects.vercel.app`（常にこのブランチの最新を指す）を使うと迷子にならない。
- **動作確認は必ずシークレット/プライベートウィンドウ**で（Basic 認証や自動入力のキャッシュで「効いていないのに通ってしまう/効いているのに弾かれる」を避ける）。
- Vercel MCP で対象デプロイの `githubCommitRef`/`state`/`target` を見れば、ふうかがどのデプロイを見ているか特定できる（team `team_PUbgx1RuY5muanExK0tdtY6L`／project `prj_mmGS8duJEM9ymxAiPKX3r4onJ7t6`）。

### 🆕 2026-07-04 Stripe セキュリティ対策措置状況申告 対応（実装完了・動作確認済み）

> Stripe 本番審査の途中で「セキュリティ対策措置状況申告書」（割販法・クレジット取引セキュリティ対策協議会のチェックリスト）の提出を求められた。必須項目を満たすため以下を実装。ブランチは各系統に直接 push 済み。

#### ✅ 完了・実機確認済み
- [x] **送客料を税込 ¥5,500 に統一**（契約書 第6条「¥5,000＋消費税」に実装を合わせた）：`src/lib/stripe.ts`（`REFERRAL_FEE_JPY=5500`）＋ partners/transparency 表示。※stripe-production ブランチ止まり・main 未マージ。
- [x] **セキュリティヘッダー＋Dependabot**（`next.config.ts` の `headers()`／`.github/dependabot.yml`）。
- [x] **脆弱性診断の自動化**（`.github/workflows/codeql.yml`＝SAST 週次／`zap-baseline-scan.yml`＝本番 kinda.jp への DAST 週次）。※申告項目3対応。
- [x] **ファイルアップロード制限**：Supabase Storage の `agency-media` バケットに MIME 制限（image/* のみ）＋5MB 上限を追加（counselor-media/shop-media は既設）。※申告項目2対応。
- [x] **admin: Basic 認証**（`futarive-admin/middleware.ts`・env `ADMIN_BASIC_AUTH_USER`/`ADMIN_BASIC_AUTH_PASSWORD` 設定済み）。※申告項目1a。
- [x] **admin/counselor: ログイン10回失敗で30分ロック**（`login_lockouts` テーブル〈service_role 専用・RLS 全拒否〉＋各 `/api/login` に集約）。counselor は env `SUPABASE_SERVICE_ROLE_KEY` を新規追加。※申告項目1c・6。
- [x] **admin: 2段階認証 TOTP**（`futarive-admin/app/mfa/page.tsx`＋middleware で env `ADMIN_MFA_ENFORCED=true` のとき AAL2 強制）。認証アプリ登録→コード入力→強制まで実機確認済み。※申告項目1b。

#### 判断・見送り（正直に申告）
- counselor の Basic 認証・IP 制限・MFA は**見送り**（外部の多数相談所が使うため構造的に不適・現場負荷大）。counselor は個別アカウント認証＋10回ロックで担保。
- admin の 2FA を実装したことで、申告フォーム（AGOGLIFE アカウント全体）の「二段階認証」は「実施」で回答可能。
- 脆弱性診断のペネトレーションテスト（手動）は未実施。CodeQL/ZAP の自動診断で代替（正直に申告）。

#### ⏳ 残（申告書送信後）
- [ ] Stripe 申告書を送信 → 審査。
- [ ] 審査通過 → 本番 Webhook 作成（`https://kinda.jp/api/stripe/webhook`）→ `sk_live_`/`pk_live_`/本番 `whsec_` を `my-app-rp9u`・`futarive-counselor` の Vercel env に設定 → 実カードで少額課金→返金の疎通確認。
- [ ] ¥5,500 税込の料金修正を main にマージ（現状 stripe-production ブランチ止まり）。
- [ ] （任意）船田も自分の端末で admin の MFA 登録を済ませる（初回ログイン時に自動で /mfa 登録画面へ）。

### ⚠️ マージ待ちブランチ
- [x] `claude/kinda-automation-strategy-4g1k5y`（AI業務改善キット・CLAUDE.md/TODO整理・bio二層化決裁反映）→ PR → main マージ → production READY 確認（2026-07-05 PR作成）。

---

## 🔴 ふうかの操作待ち（ブロッカー・上から順に）

### Stripe 本番審査（コード/文書側は完了済み）
> ⚠️ **2026-07-06 決定：料金表示・実課金額は¥5,000のまま据え置き（¥5,500税込への統一は審査完了まで凍結）。**
> Stripe審査の事業説明欄に「¥5,000」で申告済みのため、審査中にサイト表示や実課金額（`REFERRAL_FEE_JPY`）だけ¥5,500に変えると、申告内容とサイトの不一致で審査に響くリスクがある。
> `claude/stripe-production-deployment-sshgj2`ブランチにある¥5,500統一の修正は**審査通過後にまとめてmainマージ**する（表示・実課金額・契約書・特商法・営業デッキを同時に揃える）。それまでは新規に¥5,500表記を追加しない。
- [ ] Stripe アカウント有効化：法人=株式会社AGOGLIFE／代表者KYC／入金用銀行口座。
- [ ] 事業説明に「相談所への成果報酬 ¥5,000・消費者は無料」を明記（サイト kinda.jp・特商法/規約閲覧可）。
- [ ] 本番 Webhook（`https://kinda.jp/api/stripe/webhook`）登録 → `whsec_` 取得。
- [ ] `sk_live_`／`pk_live_`／`whsec_` を **Vercel 本番 env** に設定（GitHub に push しない）。
- [ ] 審査通過後、実カードで少額テスト課金→返金で疎通確認。（任意）顧問弁護士レビュー。
- [ ] **Google Workspace 契約 → `@kinda.jp` 送信有効化**（hello@kinda.jp 名義返信・Stripe/Resend の信頼性。日割り＋14日無料のため早めでよい）。

### SEO・計測（1回やれば終わり）
- [ ] **GSC 手動インデックス登録**：トップ→ `/note/weather`・`/columns` →需要大コラム→主要天気の順に URL 検査でリクエスト（1日上限あり）。
- [ ] **GA4 プロパティ URL を kinda.jp に更新**（`notify_signup` キーイベント化は済）。
- [ ] **OGP 実機検証**：X / LINE / opengraph.xyz で story / columns / type のカード表示確認（metadataBase は kinda.jp 確認済み。実機チェックのみ）。
- [ ] **不要ブランチ削除（GitHub UI から・環境の git プロキシでは削除不可）**：`claude/review-reply-display`・`claude/review-display-tags-reply`・`claude/reel-count-notif-tweak`。⚠️ `claude/fix-profile-creation-1clpG`（counselor本番）と `claude/futarive-admin-dashboard-iKBfw`（admin本番）は削除禁止。

### SNS まわり（決裁済み・実作業）
- [x] バリューコマース アフィリエイト**審査通過**（2026-07-06）。店舗掲載の型は `docs/guides/kinda-act-glow-post-template.md` に制定。PR表記＋rel=sponsoredはbooking_urlのASPドメインから自動判定（実装済み）。
- [ ] **VC管理画面でふうか作業（審査通過後の残り）**：①「一休.comレストラン」「ホットペッパーグルメ」に提携申請 → ②承認後、MyLinkで https://restaurant.ikyu.com/117183 のリンクを発行 → Claudeに渡す（shops.booking_url を差し替え・PR表記が自動で出る）。
- [ ] **Kinda act 初投稿の続き**：ランデブーラウンジ（帝国ホテル 東京）を掲載済み（shops id: dc483116-0e40-4cc3-a59c-8ffe85877615・badge=掲載店・一休生URL仮置き）。次はカフェ帯（HPG）を1〜2件＋お見合いカフェ記事のKinda voices展開（ふうか進行）。
- [ ] **bio 二層化の反映**：X / IG / note の bio 1行目に「結婚相談所を、カウンセラーの口コミで選べるサイト」等の機能記述を追記（CLAUDE.md §2 改定済み・2026-07-02 決裁）。あわせて旧タスク「bio から（結婚相談所Emma運営）を削除」も同時に確認。
- [ ] **コラム本番URLの確認 → Notion X カレンダーのリプリンク欄修正**（B/E投稿の `kinda.jp/columns/[slug]` は推定のまま。5本：counselor-de-erabu-soudanjo／soudanjo-to-konkatsu-app-chigai／kekkon-soudanjo-ryokin-no-mikata／counselor-tantou-henkou／shokai-mendan-de-miru-koto）。
- [x] 週次SNSレビュー 2026-W27 実施（`docs/sns/reviews/2026-W27.md`）。X「顕在ワード+意見+リプにコラム2本」を勝ち型として特定、IG冒頭1秒フック改善とCTA変更（保存・コメント誘導）をNotionの7/6〜7/11投稿に反映済み。
- [x] コラム追加・公開：「お見合いの服装、初デートまで」（`content/columns/omiai-shodate-fukuso.mdx`）男女別＋清潔感共通土台の構成。PR #28 で main マージ・本番反映確認済み。

---

## 🟠 定常運用（リズム・日程の正は Notion 運営カレンダー）

- [ ] X 日次運用：朝=柱／昼=中の人／夜=柱・リプ全返し。柱F（中の人）は別計測。
- [ ] 週1：`/sns-pack` で翌週分生成 → Notion 下書き承認。
- [ ] 週1（月曜推奨）：X アナリティクスの数字を貼る → `/sns-review` が整形・分析（CSV は `docs/sns/metrics/`）。
- [ ] 隔週：柱F・発信方向性 v2 のレビュー → 伸びた型を厚く。
- [ ] 月1：note・IG の数字も同 CSV に記録 → 月次方針。

---

## 🟡 次の制作テーマ

- [ ] **Emma 取材（Kinda voices 1本目）**：質問20問は handoff 参照。録音→Whisper→`/kinda-voices` で記事化（**実体は `/columns` の「取材レポート」**。専用ルートは作らない＝CLAUDE.md §11）。聞き手バイライン（さき/ふうか）は取材時に決定。
- [ ] IG 夏×日記カルーセル（プロンプト・キャプション確定済み・画像生成から）。
- [ ] 動画パイプライン方針決定（image-to-video ツール選定・月予算）→ 決定まで IG の動画系は仮置き。声の朗読リール試作（任意）。
- [ ] SNS発信方向性 v2 の実弾化：柱B（相談所リアル）主力化の投稿群・縦型動画60秒試作（Notion「SNS発信方向性 v2」参照）。
- [ ] og/twitter の title/description 再検討：「カウンセラー個人を選べる」を front に出す表現（決まったら layout 差し替え）。

---

## 🔵 中期開発（優先度順・着手時に個別タスク化）

- [ ] **カード未登録相談所の予約不可ガード**（現状は予約が通り課金だけ失敗＝運営フォロー頼み）。
- [ ] **運営オペレーション手引き**（`docs/guides/`）：自動完了の戻し方／no-show 時の billing_events void／口コミ審査運用。
- [ ] **法務同期の残り**：事業者向け特商法の counselor 管理画面掲載／利用規約・プライバシー・特商法の棚卸し（顧問弁護士レビュー前提）。
- [ ] **セキュリティ advisor 残**：slots UPDATE の RPC 化／Security Definer View 権限／anon revoke／search_path 付与／Storage listing 確認／Leaked Password Protection（Supabase Pro 化時に ON）。
- [ ] **同一ルールの実装ズレ横断監査**（キャンペーン期限・is_published・料金表記・is_demo 等 → 共通ヘルパー化）。
  - 2026-08-13 に **キャンペーン期限**（`isExpiryDateActive()` に共通化・日付単位に統一）と
    **is_demo**（`getPublicCounselors()` に入口を集約）は着手済み。残りは is_published と料金表記。
- [ ] 動的 OGP（@vercel/og）：/note/result 等のシェア画像動的生成（拡散エンジン・中期）。
- [ ] MyPage 系の PC レイアウト一括調整。
- [ ] Kinda Note「任意・匿名の天気共有」データモデル設計（Phase 3 の belonging 本命。shared フラグ等・本文は持たせない）。
- [ ] 取引メール本文（決済/予約確定/連絡先開示等）は Stripe 本番化とセットで実装（Stripe-first）。
- [ ] キャンセル時返金の運用自動化検討（当面は Stripe ダッシュボード＋個別判断）。
- [ ] 営業フェーズ2以降：優遇措置の中身確定／掲載課金・PR枠の設計／相談所向け使い方ガイド／営業リスト化。

---

## 📌 確定済みの投稿スタイル（参照用・変更しない）

### Kinda story（2026-06-27 確定）
実体は `/kinda-story`（`src/lib/mock/stories.ts`）。手順の詳細は `/kinda-story` Skill と CLAUDE.md §5。
要点：STORIES 配列先頭に追加／クレイ画像は stage 自動／consent 必須記録／相談所名非公開なら実名をコードに書かない／Article+FAQPage のみ。

### Kinda voices（2026-07-02 確定）
実体は `/columns` の category「取材レポート」（MDX）。手順は `/kinda-voices` Skill と CLAUDE.md §11。

---

## 🗂 済み・履歴

- 2026-07-02 以前の全タスク履歴（✅完了項目・経緯メモ・旧世代の重複タスク含む）は **`docs/archive/todo-full-archive-2026-07-02.md`** を参照。
- 廃止（アーカイブにのみ残す主な項目）：voices/story の専用 MDX スキーマ確定（→ voices=columns MDX・story=stories.ts で確定）／独自ドメイン取得（kinda.jp 取得済み）／Stripe 旧24h猶予モデル関連／note 1本目公開（済・https://note.com/kinda_jp/n/ndd5a4776cc13）。
