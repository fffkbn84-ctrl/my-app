# TODO.md — タスク管理・次セッションへの引き継ぎ

> このファイルは **「次に何をやるか」「今どこまで進んでいるか」** を 1 枚で把握するためのもの。
> 完了した項目は履歴として残してよいが、行頭を `- [x]` にして本文を 1 行に圧縮する。
> 詳細な実装メモは `WORKLOG.md`、画像周りの監査は `docs/image-audit.md` を参照。

最終更新: 2026-06-07

---

## 📌 次セッション引き継ぎ（最初に読む）

### 開始手順（ユーザーサイト作業の場合）
1. `git fetch origin` → **`git checkout -B <feature> origin/main`**（ローカル main は信用しない＝CLAUDE.md §10 デプロイ前チェック）。
2. 作業 → push → プレビュー確認 → main マージ。
3. ⚠️ **counselor/admin は別系統**：`futarive-counselor/` は `claude/fix-profile-creation-1clpG`、`futarive-admin/` は `claude/futarive-admin-dashboard-iKBfw`。これらのブランチは **src/ が古い別履歴**なので、編集は各サブディレクトリ配下だけに限定し、作業後 main に戻すこと。

### いま未マージ / 進行中
- **`claude/review-reservation-flow`** … （済）main マージ済み。
- **`claude/pc-booking-mypage`** … （済）main マージ済み（e6c269a）。
- ~~**`claude/review-reply-display`**~~ … 口コミへのカウンセラー返信表示。**置き換え済み**：常時インライン表示だったが、要望（返信マーク→タップで展開）に合わせ `claude/review-display-tags-reply` で作り直し main 反映済み（2026-06-07）。当該ブランチは破棄可。
- **DNS**：✅ `kinda.jp` / `www.kinda.jp` ともに Vercel で **Valid Configuration**（2026-06-08・SSL証明書発行済）。`https://kinda.jp` 本番稼働。
- **Supabase 本番に適用済み（コードと対）**：`submit_review` RPC／自動完了 cron／reviews＋7テーブルの RLS 最小権限化／`is_admin()`。実機（counselor/admin/予約）動作は確認済み。

### 次の最優先候補
- [x] ~~`claude/review-reply-display` を main マージ~~ → 返信マーク→タップ展開UXで作り直し main 反映済み（`claude/review-display-tags-reply`・2026-06-07）。
- [x] **口コミの選択タグ保存・表示**（「アドバイスが具体的」等）：`reviews.good_tags text[]` 追加＋`submit_review` に `p_good_tags` 追加（DB適用済・migration 034）＋`ReviewForm` 送信＋カウンセラー詳細でピル表示。main 反映済み（2026-06-07）。
- [x] **カウンセラー口コミ返信の不具合修正**（2026-06-07・`claude/fix-profile-creation-1clpG`）：`reviews.agency_replied_at` カラム未存在で返信 UPDATE が常に失敗し未返信のまま何度でも返信できていた → カラム追加（migration 0033）で解消。返信タブに投稿者ニックネーム（profiles.nickname）と相談日時（reservations.start_at）を表示（本名取り違え防止）。
- [x] **リールの口コミ数が0表示の修正**（2026-06-07・main 反映）：リール/カードが参照する `counselors.review_count`/`rating_avg` が口コミ投稿・公開時に更新されず、実カウンセラー（小山楓華 等）で実口コミ2件あるのに0表示だった。実口コミ行から同期するトリガー＋バックフィル（migration 035・DB適用済）で解消。実体0件の純表示用 seed（中村さくら=14 等）は維持。
- [x] **マイページの口コミ返信通知を廃止**（2026-06-07・main 反映）：低評価への返信が必ずしも納得のいくものとは限らず能動的に見せる必要が低いため、未読ドット/通知一覧から `reviews.agency_reply` を除外。返信自体はカウンセラー詳細ページで引き続き確認可。
- [ ] **不要ブランチの削除（要・手作業）**：`claude/review-reply-display`（置き換え済）・`claude/review-display-tags-reply`（merged）・`claude/reel-count-notif-tweak`（merged）は削除可。⚠️ この実行環境の git プロキシはブランチ削除 push を弾くため、Claude からは削除できなかった。**GitHub UI から削除してください**。※`claude/fix-profile-creation-1clpG` は counselor 本番なので削除しないこと。
- [ ] 返金モデル改定の法務同期（下記）／整合性の横断監査（下記）／残セキュリティ小項目。

---

### 🆕 2026-06-09 メール基盤の配線（DNS完了 → コード反映）

> Resend `send.kinda.jp` 認証完了・受信 hello@kinda.jp 構築済み。
> 指示書：`docs/implementation/claude-code-email-wiring-2026-06-09.md`／引き継ぎ：`docs/handoff/handoff-summary-2026-06-09.md`。
> 送信元統一：From=`Kinda ふたりへ <noreply@send.kinda.jp>` / Reply-To=`hello@kinda.jp`。

- [x] **(Claude Code) admin 送信元差し替え**：`futarive-admin/lib/email.ts` を `onboarding@resend.dev` → `noreply@send.kinda.jp`＋Reply-To。`claude/futarive-admin-dashboard-iKBfw` に反映済。
- [x] **(Claude Code) lib/email.ts を user-site / counselor へ展開**：両プロジェクトに送信ラッパー追加・`resend` 依存追加・キー未設定ガード維持・build green。user-site=main / counselor=`claude/fix-profile-creation-1clpG` に反映済。
- [x] **(Claude Code) sitemap から `/mypage` 除外**：`src/app/sitemap.ts` 対応・main 反映済（robots と整合）。
- [x] **(ふうかさん) `RESEND_API_KEY` を user-site(my-app-rp9u) / counselor の Vercel env に追加 → 再デプロイ**（2026-06-09 完了）。
- [x] **(Claude Code) お問い合わせフォーム＝送信者識別（①B）**：`/contact` をアプリ内フォーム化＋`/api/contact`（Resend送信・サーバ側で会員/カウンセラー/相談所オーナーを判定し問い合わせメールに付与・Reply-To=送信者）。main 反映済（2026-06-09）。※本番 /contact 送信＝Resend送信テストを兼ねる。
- [x] **(Claude Code) 口コミ促進メール（運営名義・タスクE）**：completed 予約に「面談おつかれさまでした、口コミを」を1回送信。`/api/cron/send-review-requests`（service role・直近14日・未送信・投稿済み除外・`reservations.review_request_sent_at` で冪等／migration 036）＋ `vercel.json` 日次 cron（01:00 UTC=10:00 JST）。From=noreply@send.kinda.jp / Reply-To=hello@kinda.jp。main 反映済（2026-06-09）。
  - [ ] **(ふうかさん・必須) my-app-rp9u の Vercel env に 2つ追加 → 再デプロイ**：`SUPABASE_SERVICE_ROLE_KEY`（Supabase の Project Settings → API → service_role）と `CRON_SECRET`（任意のランダム文字列）。これが無いと cron は 401 で動かない（送信されない）。Vercel Hobby の cron は日次のみ。
  - [ ] 動作確認：env投入後、cron 実行（または `curl -H "Authorization: Bearer <CRON_SECRET>" https://kinda.jp/api/cron/send-review-requests`）で completed 予約に促進メールが届くか。
- [ ] **取引メール本文（決済/予約確定/連絡先開示/日程変更/返金）は Stripe 実装とセット**（Stripe-first・今はやらない）。

#### メール運用の改善（2026-06-09 追加）
- [ ] **問い合わせ返信を `hello@kinda.jp` 名義で出せるようにする**（現在は Gmail から返信すると差出人が個人 gmail になる）。Gmail「他のアドレスから送信（Send mail as）」に hello@kinda.jp を追加するには送信SMTPが必要。**おすすめ＝Google Workspace（約¥800/月）で hello@kinda.jp を本物のメールボックス化**（送受信とも自然）。代替＝ImprovMX 有料（SMTP付き）。**まず Google Workspace でいくか検討するところから**（ふうかさん希望）。受信転送（ImprovMX）自体は現状維持で可。

#### DNS後始末の残り（2026-06-09）
- [ ] **OGP実機検証**（X / LINE / opengraph.xyz）。metadataBase は正しいと確認済み、実機表示チェックのみ。
- [ ] **GA4 プロパティURLを kinda.jp に更新**（ふうかさん手動）。

#### ✅ 2026-06-09 完了（ふうかさん）
- [x] GSC ドメインプロパティ登録（DNS TXT・Vercel側）・sitemap 送信成功・主要URLインデックスリクエスト。
- [x] 受信 `hello@kinda.jp`（ImprovMX・Gmail転送）構築・テストOK。
- [x] 送信ドメイン認証 `send.kinda.jp`（Resend・DKIM/SPF/MX/DMARC 緑・東京リージョン）。
- [x] metadataBase が kinda.jp で正しいことを sitemap 実体で確認。

---

### 🆕 2026-06-08 追加（SNS／コンテンツ・フォーマット起点）

> Claude.ai セッション（Voices/Story 執筆フォーマット＋SNS立ち上げ設計）からの引き継ぎ。
> 詳細サマリーは `docs/handoff/handoff-summary-2026-06-08.md`。

#### ドキュメント整備
- [ ] 3キットHTMLを repo に保存（**HTML本体は未受領＝別途アップ待ち**）
      - docs/voices/kinda-voices-writing-format.html
      - docs/voices/kinda-story-writing-format.html
      - docs/sns/kinda-sns-launch-kit.html

#### Voices／Story 記事インフラ（実装）
- [ ] voices の MDX frontmatter スキーマを確定（title/description/slug/counselorSlug/area/heroImage/heroAlt/ogImage/author/publishedAt/updatedAt/pullQuote）
- [ ] story の MDX frontmatter スキーマを確定（上記＋ category/stage/pseudonym ＋ 同意記録：consentWeb/consentSNS/consentAgency/consentDate）
- [ ] story の stage → クレイ画像マッピング（marriage=夕景／active=夜明けの芽／dating=顔つきの芽）
- [ ] story の category routing（marriage / dating / struggle → /story/category/[category]）
- [ ] LeadAnswer / PullQuote の MDX コンポーネント（両フォーマット共通）

#### 構造化データ・OGP（SEO診断★★と連動）
- [ ] Article ＋ Person（著者=ふうか, url=/about/founder）JSON-LD コンポーネント
- [ ] FAQPage JSON-LD（記事内の質問形見出しから2〜4問を生成）
- [ ] 動的OGP（opengraph-image.tsx）：クレイ背景＋タイトル合成、1200×630、WebP配信

#### 内部リンク・E-E-A-T
- [ ] voices／story 記事テンプレに内部リンク枠（天気2／コラム1〜2／詳細 or 関連Story／診断入口）。アンカーは具体語
- [ ] /about/founder（ふうかプロフィール）への著者リンクを各記事末尾に固定

#### SNS（※コードではなく運用・ふうか手動）
- [ ] note / Instagram / X アカウント確保（bio・アイコンは SNSキット参照）
- [~] クレイふうか像の生成・3媒体共通アイコン化（**2026-06-08：Claude.ai 側で各種SNS用アイコンを選定中**）
- [ ] 創業ストーリー note 1本目（**2026-06-08 変更：録音→Whisper ではなく Claude との対話式で素材化する方針に決定**）

#### 将来構想：belonging（「ひとりじゃない」場所）— Phase 3（PMF後・ユーザー数が育ってから）
> 結論：Story を公開投稿型にはしない。belonging は Kinda Note 側で、低リスクに実現する。
- [ ] 【今・前倒しOK／低コスト】Kinda Note のデータモデルを「任意・匿名で共有できる」前提で設計しておく（weatherKey と日付だけ持つ shared フラグ等。投稿本文や個人特定情報は持たせない方向で検討）
- [ ] 【Phase 3・本命】Note の「今日の天気」を任意・匿名で共有 → 「同じ天気の人が◯人」表示（他人の物語ではなく"自分の感情の抽象"なのでモデレーション負荷がほぼゼロ）
- [ ] 【Phase 3】編集Story への「反応」機能（救われた／自分もここにいる）。投稿ではなく応答で belonging
- [ ] 【さらに先・要体制】招待制の編集UGC（特定ユーザーに声かけ→項目別同意→編集レビュー→公開）。公開投稿箱ではなく"編集Storyパイプラインのスケール"として扱う
- [ ] 【Phase 3 着手時の前提】通報導線・クライシス相談リソースへの導線・初期はDM不可、等の安全設計

---

### 🆕 2026-06-05 相談メモ（営業資料フィードバック＋口コミ仕組みの信頼性）

#### 【要対応】整合性の横断監査（同じルールが場所により食い違う問題）
- [ ] **「同一ルールの実装ズレ」を洗い出して統一**。例：カウンセラーのキャンペーンが一覧では期限非表示・別の場所では期限切れでも表示、のように同じ概念が箇所ごとに別実装になっている所がないか横断確認。観点例：①キャンペーン/バッジの有効期限（相談所/カウンセラー/お店/カード/詳細/検索結果で同じ判定か）②is_published の尊重（全リスト/詳細/OGで未公開を漏らさないか）③料金・無料表記のフォーマット④日付/時刻の表示形式⑤デモ（is_demo）の出し分け⑥キャンセル/返金文言の表記ゆれ。ズレを見つけたら共通ヘルパー化して統一。

#### 【最優先・セキュリティ】RLS 過剰権限の是正（auth_all_* を全廃）
> 2026-06-05 点検で発覚。reviews は対処済み(M2)。残り7テーブルに同じ `auth_all_*`(ALL/true) が残存＝ログインユーザーなら誰でも編集/削除可。
- [x] **RLS 最小権限化（適用済み）**：7テーブルの auth_all_* を全廃→ owner/admin スコープへ（migration harden_core_tables_rls・`is_admin()` 関数導入）。**要：counselor/admin/ユーザー予約の実機検証**。
- [ ] **slots UPDATE を RPC 化**：現在は予約フロー依存で UPDATE=authenticated のまま。枠ロックを SECURITY DEFINER RPC 化し UPDATE も owner/admin に絞る。
- [ ] ERROR: Security Definer View ×3（audit_*）の閲覧権限を admin/service_role に制限。
- [ ] SECURITY DEFINER 関数群を anon から revoke（authenticated のみに）。
- [ ] Auth の Leaked Password Protection を有効化（ダッシュボード）。
- [ ] Storage バケット（*-media）の listing 可否を確認・必要なら制限。
- [ ] 既存関数6つに `set search_path=public` を付与。

#### 別タスク：法務系・ユーザーサイト情報ページの更新（要対応）
- [ ] **【最優先】返金モデル改定の全文書同期**（2026-06-05 確定：予約確定で即時課金・原則返金なし・やむを得ない場合のみ運営相談で個別返金）。請求履歴UI・CLAUDE.md §12 は反映済み。残：`agency-agreement.md`／`tokushoho-agency-b2b.md`／営業デッキ slide6 返金脚注／Stripe実装指示書（24h返金ロジック撤廃→即時課金＋例外返金）を統一。顧問弁護士レビュー前提。
- [ ] **法務系の更新**：利用規約 `src/app/terms/`・プライバシーポリシー `src/app/privacy/`・特商法 `src/app/tokushou/`・契約書類 `docs/contracts/`。kinda.jp ドメイン確定／課金方式（カード前払い・24h返金）／口コミ仕様変更（認証コード廃止→ログイン＋面談完了）に合わせて棚卸し。顧問弁護士レビュー前提。
- [ ] **ユーザーサイト情報ページの更新**（内容・文言の見直し）：
  - 編集ポリシー `src/app/about/editorial-policy/`
  - 運営の透明性 `src/app/about/transparency/`
  - お問い合わせ `src/app/contact/`（`hello@kinda.jp` 受信設定とセットで）
  - 掲載のご相談 `src/app/partners/`（送客料¥5,000・無料掲載・kinda.jp）

#### 運営マニュアル（私用の手引き・最後でOK）
- [ ] **運営オペレーション手引き**を作成（`docs/guides/` 想定）。最低限：①自動完了の仕組み（面談終了+12hで `active`→`completed`・毎時cron。低頻度だが未実施でも自動完了し得る）と **手動で戻す方法**（admin もしくは SQL で `status='active'`・`completed_at=null` に戻す手順）。②no-show 連絡を受けた時の処理（該当 `billing_events` を void／必要なら口コミを `is_published=false` のまま非公開維持・削除）。③口コミ審査（公開/却下）の運用。

#### MyPage（マイページ）PC 表示の改修（別タスク）
- [ ] MyPage 系の **PC レイアウト**をまとめて整える（モバイル前提の作りで PC が左寄り/余白過多になりがち）。レビュー投稿ページ等の個別対応とは分け、MyPage 系を 1 パスで対応する方針。優先度・着手時期は別途相談。

#### 営業資料（`docs/sales/`）の修正候補（一部 main 反映済み）
- [x] **「@cosme・食べログ」の比喩を見直し**（@cosme 削除→食べログ一本＋口頭で個人単位を補足。deck/script/cold-email/brief 反映済み）。
- [x] **「一気通貫」を非・麻雀用語へ**（「ひと続きで」に変更済み）。
- [ ] **代表の創業エピソード**（なぜ立ち上げた／何がしたい）を**面談終盤に話す**用に台本へブロック追加。**実際のストーリーをふうかさんから受け取って文章化**する。あわせて **Kinda voices に創業ストーリー記事**として載せる案（SEO・信頼担保）。

#### 口コミの信頼性（自動発行で「良い口コミだけ集まる」懸念を断つ）
> 方針確定（2026-06-05）：①認証コード制は**廃止**（予約がログイン必須なので冗長）②自動完了は**純粋な時間ベース**（`canceled`のみ除外）。**no-showのセルフ申告ボタンは作らない**（相談所を信用して自己除外させない）。未実施は**相談所→運営へメール連絡→運営が手動で除外/返金**する例外運用に一本化。安全弁は `reviews.is_published=false`（運営審査で公開判断）＋課金は予約成立時で完了マークと無関係。③投稿期限**30日**。HPBも「来店翌日に自動解禁＋促進・サロン承認不要」で同型。
> 注意（現状の穴）：今は ReviewForm がクライアントから直接 `reviews` に insert し、サーバ側で「本人の completed 予約か」を検証していない。RPC 化で塞ぐ。
- [x] **B. reservation 起点の口コミ投稿を実装**：RPC `submit_review` ＋ ユーザーサイト `/reviews/new?reservation=ID` 配線・`ReviewForm` を RPC 化・投稿ページのPC/モバイル レイアウト修正。**main 反映済み**。
- [x] **【M2】`reviews` の RLS 厳格化（適用済み）**：過剰権限 `auth_all_reviews` と公開漏れ `public read reviews` を撤去し、user/counselor/agency-owner/admin を網羅した最小権限ポリシーへ置換。
- [x] **A. 自動完了フォールバック**：`auto_complete_reservations()` ＋ pg_cron（毎時0分・`end_at+12h`・canceled/reschedule=requested除外）**適用済み**。
- [x] **認証コード制の廃止（ユーザーサイト）**：`ReviewGate`(MOCK_TOKENS)削除・`?token=`廃止。`reservations.review_token/review_code/review_token_used` は当面温存。
- [ ] **営業資料の「専用URLと認証コード」表現の修正**（deck slide「面談を終えた人だけの認証口コミ」→「ログイン＋面談完了の予約に紐づくため成りすまし不可」へ）。
- [x] **カウンセラー管理画面の改修（適用済み）**：面談完了時の認証コード発行（`ReservationDetailBody.tsx`/`PendingCompletionsSection.tsx`）を撤去し『お客様はマイページから投稿』案内に置換。`claude/fix-profile-creation-1clpG` に push 済み。
- [ ] **C. 口コミ促進メール（Resend・運営名義）**：completed 契機で「面談お疲れさまでした、口コミを」。※Resend ドメイン認証後。A/B/カウンセラー改修は先行可能。

---

### 🆕 2026-06-05 ドメイン取得（kinda.jp）・Vercel 接続

#### 完了
- [x] `kinda.jp` ドメイン取得（お名前.com・法人名義 AGOGLIFE Inc.・初年度0円・更新期限 2027/06/30）。
- [x] お名前.com ネームサーバー → Vercel 向け（`ns1/ns2.vercel-dns.com`）へ変更。
- [x] Vercel `my-app-rp9u` に `kinda.jp` / `www.kinda.jp` を登録（Production）。

#### 最優先（反映確認・ドメイン切替の後始末）
- [x] **ドメイン反映確認**：✅ 2026-06-08 に `kinda.jp` / `www.kinda.jp` ともに Vercel で Valid Configuration＋証明書発行完了（NS委任の伝播完了後、放置で自動解決）。
- [x] **`metadataBase` を `kinda.jp` に修正**：確認済み。`src/app/layout.tsx` は `process.env.NEXT_PUBLIC_SITE_URL ?? "https://kinda.jp"` で既に kinda.jp（前セッションで対応済）。※Vercel に `NEXT_PUBLIC_SITE_URL` を設定している場合は値が `https://kinda.jp` か（古い値が残っていないか）だけ要確認。未設定ならフォールバックで kinda.jp。
- [x] **サイト内のハードコード URL 棚卸し**：✅ `kinda-futari` / `kinda.futarive.jp` / `my-app-rp9u.vercel.app` は **src 内 0 件**（2026-06-08 確認）。
- [ ] **OGP の実機検証（ドメイン稼働後＝今やれる）**：`https://kinda.jp` の各ページ（story / columns / type）を X / LINE / opengraph.xyz でカード画像プレビュー確認。
- [ ] **GA4 のプロパティ URL を `kinda.jp` に更新**（Vercel Analytics は自動反映で対応不要）。
- [ ] **Stripe 審査用 URL は `kinda.jp` で申請**（アカウント開設時に使用）。
- [ ] 特商法表記ページが本番ドメインで正しく表示されるか確認（実体は `src/app/tokushou/`）。
- [x] サイト内の旧ドメイン（`www.kinda-futari.app` / `kinda.futarive.jp` / メール `hello@kinda-futari.app`）を全て `kinda.jp` / `hello@kinda.jp` に統一（src 20ファイル・metadataBase/JSON-LD/sitemap/robots 含む）。
- [ ] **サポート受信 `hello@kinda.jp` の受信設定（DNS稼働で着手可能に）**（表示だけ変えた状態。今は受信できない）。無料案：ImprovMX / ForwardEmail 等＋**Vercel DNS（kinda.jp ゾーン）に MX レコード追加**で Gmail へ転送。有料案：Google Workspace（約¥800/月）で本格メールボックス。Resend（送信）とは別レイヤー。※NS は Vercel 委任なので、MX は Vercel の DNS 画面で追加する。
  - 進め方：**DNS（kinda.jp）反映後**に着手。ImprovMX か ForwardEmail のどちらが良いか等は **Claude に相談しながら一緒に設定**していく方針。

---

### 🆕 2026-06-05 Resend（メール送信）の現状と残タスク

> 調査結果：**Resend は admin だけ実装済み**。user-site / counselor は未実装。送信ドメイン認証は `kinda.jp` の DNS 反映後。

#### 現状（実装済み・admin のみ）
- [x] `futarive-admin/lib/email.ts`：Resend 送信ラッパー（`RESEND_API_KEY` 未設定なら送らず警告＝事故防止）。
- [x] `futarive-admin/app/api/webhooks/billing-disputed/route.ts`：相談所が課金に異議申立て → 運営宛（`ADMIN_NOTIFY_EMAIL`）に「[ふたりへ] 課金異議申立て：相談所名」を送信。Supabase の `billing_events` UPDATE Webhook 起点。
- [x] admin の Vercel に `RESEND_API_KEY` 設定済み。テスト送信は `onboarding@resend.dev` から（＝アカウント所有者宛のみ可）で確認済み。

#### 残タスク
- [ ] **送信ドメイン認証**（`kinda.jp` DNS 反映後）。Resend Domains で `kinda.jp`（推奨：サブドメイン `send.kinda.jp`）を SPF/DKIM/DMARC 認証 → 各 `lib/email.ts` の送信元を `onboarding@resend.dev` → `noreply@kinda.jp` 等へ差し替え。**認証前は相談所・ユーザーに実送信できない**（自分宛テストのみ）。
- [ ] **`RESEND_API_KEY` を user-site（my-app-rp9u）と counselor（futarive-counselor）の Vercel にも追加**（プロジェクトごとに必要）。
- [ ] **`lib/email.ts` ラッパーを my-app と futarive-counselor へ展開**（admin のものを流用）。
- [ ] **メール本体は Stripe 実装にセットで作る**（Stripe-first）。決済完了 / 予約確定 / 連絡先開示 / 日程変更 / 返金 は全て Stripe `payment_intent.succeeded` Webhook 起点のため。文面ドラフトは Stripe 着手時にこちらで用意。
  - 役割：user-site→ユーザー宛（確定/決済/日程変更/返金）、counselor→相談所宛（新規予約/決済成立で連絡先開示/日程変更）、admin→運営宛（異議申立て・既存）。

---

### 🆕 2026-06-05 ユーザーサイト UI（日の出 / Kinda story 刷新 / シェア統一 / デプロイ運用）

#### 完了（このセッション・main 反映済み）
- [x] 噴水SVG → 「日の出」シンボルへ（`KindaLoader` / `SectionDivider` 共通）。
- [x] トップ story/voices カードに視覚バンド。voices は `/columns` のサムネ出し分けを移植。
- [x] story サムネを stage プール＋id 分散（`getStoryThumbnail`）。個別 `Story.thumbnail` / og:image 対応。
- [x] クレイ画像を差別化（成婚=夕景2カップ / 活動中=夜明けの芽 / 交際中=顔つきの芽）。一覧カードにもサムネ帯。
- [x] story 詳細ページを Kinda voices 仕様（角丸サムネ＋下にタイトル）へ刷新。
- [x] 一覧ヒーローを横長クレイ情景（`story-hero.webp`）へ差し替え＋濃色文字化。
- [x] 共通 `ShareBar`（X/LINE/コピー/共有）で story / voices / type を統一。リールに native 共有追加。**note は特別仕様維持**。
- [x] Vercel Ignored Build Step をパス指定方式へ（3プロジェクト個別）。feature branch の preview が出るように・無駄ビルド解消。

#### 残課題（ドメイン取得後にまとめて）
- [ ] **OGP（og:image）の実機検証（ドメイン稼働後＝今やれる）**。`metadataBase` は `https://kinda.jp`（フォールバック）で確定済み。`kinda.jp` 本番稼働＆証明書発行済みなので、**X / LINE / opengraph.xyz で実プレビュー確認**（story / columns / type）。カード画像が出るか・タイトル/説明が正しいかを見る。
- [ ] （任意）診断結果の「保存できる画像」を Kinda type にも追加するか検討（現状 Note のみ html2canvas でDL可。Type は og:image=リンクプレビューのみ）。Instagram ストーリー等への投稿導線を強めたい場合の打ち手。
- [ ] （任意）OGP 専用 1200×630 画像の用意可否（現状は story サムネ 1672×941 を流用＝16:9 でほぼ問題なし。最適化したい場合のみ）。

---

### 🆕 2026-06-04 決済(Stripe)・メール(Resend)・Kinda voices・リポジトリ整理

#### 完了（このセッション）
- [x] `files.zip`（引き継ぎ資料）を取り込み、CLAUDE.md §11(Kinda voices運用)・§12(Stripe/Resend)へ反映。
- [x] リポジトリ整理：散在資料をコーナー別に集約（`docs/sales` `docs/specs` `docs/implementation` `docs/guides` `docs/handoff` `docs/voices`）。`files.zip` は展開後削除。
- [x] Stripe/Resend 実装指示書を `docs/implementation/claude-code-stripe-resend-implementation.md` として配置（実装はこれを正とする）。
- [x] 営業台本の強化（Kinda voices切り札・反論2枚追加・¥5,000桁対比・クロージング2分岐・パターンC再接触）。
- [x] 掲載運用の訂正：入力は**専用アカウントで自分で・編集可**、運営代行は**初期口コミのみ**。台本の事実誤りを修正。
- [x] 営業資料のURL統一（`my-app-rp9u.vercel.app`）。
- [x] **Kinda voices 取材キット**作成（`docs/voices/kinda-voices-interview-kit.html`・§11準拠の現場用ツール）。
- [x] 営業台本を提案デッキのスライド順に全面整合（#4質/#6課金を本編に追加・ステマ反論カード追加・デッキ#n対応明記）。
- [x] 確認済み：手元の `kinda-deck-2.html` は同じファイルを再DLして OS が `-2` を付けただけ。リポジトリ版 `docs/sales/kinda-deck.html` と同一内容。台本との#n対応はこのままで確定。

#### 最優先（Stripe実装のブロッカー・順に着手）
- [~] **特商法表記**（Stripe審査の必須条件）。①ユーザー向け `src/app/tokushou/page.tsx` は既存（ユーザーは無料・正しい）→ 更新日改訂＋送客手数料は事業者間契約である旨の注記を追加。②事業者向け（¥5,000/件・カード前払い・24h返金）は `docs/contracts/tokushoho-agency-b2b.md` をドラフト作成。**残：法人名/ドメイン等の実値挿入 → counselor 側に公開ページ化 → 顧問弁護士レビュー。**
  - [ ] **事業者向け特商法を counselor 管理画面の「利用規約」と並べて掲載**（フッター等に 利用規約／プライバシーポリシー と横並び。ソースは別ブランチ `claude/fix-profile-creation-1clpG`）。
- [ ] **Stripeアカウント開設**（身分証・銀行口座・特商法URL／ビジネス説明：成果報酬型 ¥5,000/件の送客プラットフォーム）。
- [ ] **Resendアカウント開設**（ドメインDNS認証・APIキー発行）。

#### Stripe実装（アカウント開設後・Claude Codeへ渡す）
- [ ] スキーマ追加（TASK7：`agencies.stripe_customer_id`、`reservations` 決済カラム群）。**適用前に `list_tables` 必須**。
- [ ] カード登録フロー（Customers/SetupIntent）→ 予約成立時即時課金（Payment Intents `off_session`）→ Webhook(`payment_intent.succeeded`)でユーザー情報自動開示 → Refund API。
- [ ] Vercel に Webhook URL 登録（`/api/stripe/webhook`）。返金→再課金（日程変更）フローも実装。

#### Kinda voices
- [ ] **Emma取材の実施（voices 1本目）**。質問リスト20問は前チャット（handoff参照）。録音→Whisper→Claude記事化。
- [ ] Kinda voices 記事一覧UIの実装設計（カード型一覧＋カウンセラー詳細ページへの内部リンク双方向）。

---

### 🆕 2026-06-03 営業デッキ（`docs/sales/kinda-deck.html`・main 反映済み）

#### 完了
- [x] 結婚相談所向け営業デッキを自己完結HTMLで作成（クレイ風ベージュ / 16:9 / キーボード・タップ送り / 印刷=PDF / `?excerpt=1` で★5枚抜粋）。
- [x] スライド6 返金条件を「24時間以内のキャンセル／日程変更の合意」の2条件に修正。**相談所さま都合のキャンセルは課金確定（返金対象外）** が確定方針（会員にも当日キャンセルのペナルティがある業態なので相談所側にも規律を求める）。

#### 次にやること（残課題）
- [ ] **「優遇措置」の中身を内々で確定する**（スライド8）。現状はあえて曖昧表記のまま。候補：送客料の割引／掲載順・露出の優遇／一定期間の送客料ゼロ／将来の定額プランのロック価格。決まったらスライド8を具体内容に差し替える。
- [ ] 表紙サブコピー・CTAのURL・特商法表記・所要時間 `[◯分]` 等のプレースホルダを、法人設立・ドメイン取得後に実値へ差し替え。

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
- [x] 送客契約書 第6条（課金条件）を「面談完了で月末締め銀行振込」→「予約成立で即時カード前払い＋情報ロック＋24h返金」へ改訂（`docs/contracts/agency-agreement.md` §2/§4/§6・2026-06-04）。**残：counselor 側の利用規約（別ブランチ）の課金条文も同様に改訂すること。**
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
     - サポートメール：✅ 表記は `hello@kinda.jp` に統一済み（残：受信設定＝MX。§2026-06-05 ドメイン取得タスク参照）
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
