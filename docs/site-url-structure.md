# Kinda サイトURL構造マップ

最終更新：2026-08-13
このファイルは `docs/site-url-structure.md` としてリポジトリで管理する。
**実装を変えたら、同じコミットでこのファイルも直す。** 乖離したら実装が正。

---

## 0. 命名規約

- サブブランドのルートは **`/kinda-{name}`** で統一する。`/note` `/type` `/talk` のような短縮 prefix は使わない
- 例外は `/note/weather` のみ（後述）
- コラムは `/columns`（`/column` 単数ではない）
- 新しいサブブランドを作るときは、必ずこの規約に合わせる

---

## 1. 実在するルート（Claude Code 確認済み・2026-08-13）

### 1-1. サブブランド・読みもの

```
/kinda-note                       Kinda note トップ
/kinda-note/quiz                  設問フロー
/kinda-note/result                結果画面
/kinda-type                       Kinda type
/kinda-type/quiz                  設問フロー
/kinda-type/result                結果画面
/kinda-talk                       Kinda talk
/kinda-talk/area/[area]           エリア別集約（tokyo/osaka/nagoya/fukuoka/online）
/kinda-talk/type/[type]           Kinda type のタイプ別集約
/kinda-act                        Kinda act
/kinda-glow                       Kinda glow
/kinda-pair                       Kinda pair LP
/kinda-pair/topics                28話題の全公開
/kinda-pair/solo                  ひとりモード本体
/kinda-story                      Kinda story 一覧
/kinda-story/[id]                 各体験記（編集管理型・UGC禁止）
/columns                          コラム一覧（Kinda voices の実体）
/columns/[slug]                   各コラム（MDX：content/columns/*.mdx + gray-matter）

/note/weather                     20種の天気タイプ一覧
/note/weather/[slug]              各天気タイプ解説（SEO主力・20本）
```

### 1-2. 共通・規約・運営

```
/                                 トップ
/about                            Kinda について
/about/editorial-policy           編集ポリシー
/about/founder                    運営者紹介
/about/transparency               透明性ポリシー
/contact                          お問い合わせ
/for-counselors                   カウンセラー向けランディング
/privacy                          プライバシーポリシー
/terms                            利用規約
/tokushou                         特定商取引法に基づく表記
/sitemap.xml                      動的生成（src/app/sitemap.ts）
/robots.txt                       動的生成（src/app/robots.ts）
```

### 1-3. 検索・予約・口コミ（別紙に記載がなかったが実在するルート）

> 2026-08-05 の確認で見つかった実在ルート。別紙 v2 には記載がなかったため追記した。
> `/kinda-talk` 配下ではなくトップレベルに実装されている点に注意（§4 の計画と実体が違う）。

```
/counselors                       カウンセラー検索
/counselors/[id]                  カウンセラー個別ページ
/counselors/booking               カウンセラー指定の予約
/booking/[counselorId]            予約フロー
/agencies                         相談所一覧
/agencies/[id]                    相談所個別ページ
/shops                            お店一覧（Kinda act / glow のデータ元）
/shops/[id]                       お店個別ページ
/shops/[id]/review                お店の口コミ投稿
/places/[id]                      場所個別ページ
/episodes/[id]                    エピソード個別ページ
/reviews/new                      口コミ投稿（認証コード経由）
```

### 1-4. アカウント（robots.txt で Disallow）

> 別紙 v2 §4 には「ログイン機能は当面持たない」とあるが、**実装済み**。事実に合わせて記載する。

```
/login                            ログイン・新規登録
/auth/reset-password              パスワード再設定
/mypage                           マイページ           robots.txt で Disallow
/mypage/reservations/[id]         予約詳細             robots.txt で Disallow
```

### 1-5. API（robots.txt で Disallow）

```
/api/contact                      お問い合わせ受付
/api/content-index                コンテンツ索引（内部用）
/api/cron/send-review-requests    口コミ依頼メール（Vercel Cron）
/api/for-counselors/inquiry       掲載相談フォーム受付
/api/notify                       公開通知の登録
/api/reservations/notify          予約通知
/api/stripe/charge                送客料の課金
/api/stripe/refund                返金
/api/stripe/webhook               Stripe Webhook（service_role 使用）
```

### `/note` の特例 ★誤解しやすいので必ず読むこと

- **`/note` 自体にページ実体はない。** `next.config.ts` で `/kinda-note` へ **307 リダイレクト**している
- `/note` 配下に実在するのは **`weather` のみ**
- したがって `/note/weather` は「Kinda note の配下」ではなく、**リダイレクト対象外として残っている独立ルート**
- **この2本を `/kinda-note/weather` へ移さない。** 既に公開・被リンク・sitemap 登録済みで、動かすとSEO資産を捨てることになる
- 新規ページを `/note` 配下に作らない

### その他のリダイレクト（`next.config.ts`）

```
/partners                → /for-counselors   308（恒久）
/search?tab=agency       → /agencies         308（恒久）
/search                  → /kinda-talk       308（恒久）
/note                    → /kinda-note       307（暫定・SNS bio 着地用）
```

---

## 2. Kinda pair（v1.0 実装済み・2026-08-13）

```
/kinda-pair                       LP                    index する
/kinda-pair/topics                28話題の全公開         index する ★SEO本命
/kinda-pair/solo                  ひとりモード本体        noindex
```

### v1.1 以降で追加予定（未実装）

```
/kinda-pair/i/[inviteToken]       招待の受け取り          noindex
/kinda-pair/s/[secretToken]       自分の回答画面          noindex
/kinda-pair/r/[secretToken]       突き合わせ結果          noindex
/kinda-pair/c/[shareToken]        担当への共有（閲覧のみ）  noindex
```

- `noindex` は `robots` メタと `X-Robots-Tag` の**両方**で落とす
  （`/kinda-pair/solo` は実装済み。ヘッダは `next.config.ts` の `headers()` で付与）
- トークンを含むページには `<meta name="referrer" content="no-referrer">` を付ける
  （`/kinda-pair/solo` は先行して付与済み）

---

## 3. 計画のみ・未実装（着手時にこの節から §1 へ移す）

> 別紙 v2 の §3「存在確認が必要なルート」は、**記載されていた9件すべてが実在**したため
> §1-2 へ移し、節ごと削除した。本節は旧 §4。

```
/kinda-talk/counselors            カウンセラー一覧（実体は /counselors）
/kinda-talk/counselors/[slug]     カウンセラー個別ページ（Person JSON-LD・中期タスク。実体は /counselors/[id]）
/kinda-talk/agencies              相談所一覧（実体は /agencies）
/kinda-talk/agencies/[slug]       相談所個別ページ（実体は /agencies/[id]）

/kinda-act/venues                 店舗一覧（実体は /shops）
/kinda-act/venues/[slug]          店舗個別ページ（実体は /shops/[id]）
/kinda-act/area/[slug]            エリア別
```

- 上の各行は「`/kinda-*` 配下へ寄せる」という**命名規約上の移行計画**であり、機能自体は実在する。
  移行するときは 308 リダイレクトを必ず残すこと（既に index・被リンクがあるため）
- **旧版にあった `/biz` 系（`/biz/pricing` `/biz/apply` `/biz/dashboard`）は破棄。**
  カウンセラー向け入口は `/for-counselors` に一本化する（実装済み・§1-2）
- 旧版にあった `/guide/*` `/interview/*` も破棄。読み物は `/columns` に集約

---

## 4. index / noindex の一覧

| 範囲 | 扱い |
|---|---|
| `/kinda-note` `/kinda-type` `/kinda-talk` `/kinda-act` `/kinda-glow` `/kinda-story` | index |
| `/note/weather` `/note/weather/[slug]` | index（SEO主力） |
| `/columns` `/columns/[slug]` | index |
| `/kinda-pair` `/kinda-pair/topics` | index |
| `/kinda-pair/solo` および将来のトークン系ページ | **noindex**（メタ + `X-Robots-Tag`） |
| `/kinda-note/quiz` `/kinda-type/quiz` | index。sitemap 登録あり。自己参照 canonical あり |
| `/kinda-note/result` `/kinda-type/result` | index（`robots` メタ未指定＝既定で index）。**sitemap には入れない**（クエリで内容が変わる結果画面。`/kinda-note/result` の canonical は `?weather=` 付きの自己参照） |
| `/kinda-story` `/kinda-story/[id]` | index。sitemap は**掲載同意の記録がある物語だけ**（下記） |
| `/counselors/[id]` | index。ただし**営業デモ（`is_demo = true`）のカウンセラーは noindex**（下記） |
| `/mypage` `/mypage/*` `/api/*` | robots.txt で Disallow。sitemap 未登録 |

sitemap は動的生成（静的配列 + データ由来を結合）。**noindex のページを sitemap に入れない。**

### 営業デモ（`is_demo`）の扱い ★

`counselors` / `agencies` の `is_demo` は **NOT NULL / default false**（NULL レコードは存在しない）。
デモのレコードは**削除しない。表示場所を変えるだけ**。

| 面 | 扱い |
|---|---|
| ユーザー向け一覧・診断結果・カルーセル | `getPublicCounselors()` で除外する |
| `/kinda-talk` | `?preview=1` のときだけデモを出す（client 側で出し分け） |
| `/for-counselors` の「掲載イメージ」 | `getDemoCounselors()` で意図的に3件出す。rating / reviewCount / fee / campaign は出さない |
| `/counselors/[id]`（デモ） | **ページは残し noindex**。一覧・診断からの導線は切ってある |

- `getCounselors()`（デモ込み）を直接使ってよいのは上記2箇所だけ。それ以外は `getPublicCounselors()`
- デモ除外の結果、`/kinda-talk/area/*`（5本）と `/kinda-talk/type/*`（6本）は実データが埋まるまで0件になる。
  0件時は `CounselorEmptyState`（「まだ公開していません」＋ `NotifySignup`）を出す。「準備中」「近日公開」は使わない

### Kinda story の sitemap 収録条件 ★

`src/app/sitemap.ts` は `STORIES.filter((s) => !!s.consent)` で絞っている。

- **掲載同意の記録（`consent`）を持つ物語だけ**を検索エンジンに送る
- `consent` を持たない初期のサンプル物語（`id: "1" "4" "5" "6"` ／ A.M さん等）は
  実在の取材素材ではないため、実話として index させない（CLAUDE.md §5 Story 細則・ステマ規制回避）
- 新しい物語を追加するときは `consent` を必ず記録する。記録した時点で自動的に sitemap に入る

> 申し送り：サンプル物語4本は sitemap から外れたが、**URL 自体は公開されたまま**
> （`/kinda-story` の一覧にも出る）。これを残すか下げるかは content 側の判断が要る。

---

## 5. 構造化データの方針

| スキーマ | 使用 |
|---|---|
| `Article` | コラム・`/kinda-pair/topics` |
| `FAQPage` | コラム・`/kinda-pair/topics`・`/kinda-pair` |
| `BreadcrumbList` | 全ページ（`src/components/ui/Breadcrumb.tsx` が内包） |
| `WebApplication` | `/kinda-pair`（`aggregateRating` を付けない） |
| `Person` / `Organization` | 著者・運営者 |
| **`Review` / `AggregateRating`** | **全面禁止**（景表法・ステマ規制リスク） |

`FAQPage` / `Article` の共通コンポーネントは存在しない。
各ページで `jsonLdStringify()`（`src/lib/jsonld.ts`）を使ってページ内定義する。

> 申し送り：`/kinda-pair` の `FAQPage` は**未実装**（`WebApplication` + `BreadcrumbList` のみ）。
> 実装指示書 v1.0 §6 が LP を `WebApplication` + `BreadcrumbList` と定義していたため。
> 追加するかは要判断。

---

## 6. 導線設計

### ユーザー導線（感情 → 選択 → 実行）

```
検索 / SNS
   ↓
/note/weather/[slug]  または  /columns/[slug]
   ↓
/kinda-note（気持ちの整理）
   ↓
/kinda-type（合う担当の輪郭）
   ↓
/kinda-talk（担当を探す）
   ↓
/kinda-act（会う場所）・/kinda-pair（会話）
   ↓
/kinda-pair 終了 → /kinda-note へ戻る（循環）
```

### カウンセラー導線

```
アウトリーチ / 検索
   ↓
/columns（インタビュー・コラム）
   ↓
/for-counselors（実装済み）
   ↓
掲載
```

---

## 7. 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-04-30 | 初版（`/note` `/type` `/talk` `/biz` `/column` 前提） |
| 2026-08-05 | 全面改訂。実体 prefix を `/kinda-*` に統一。`/note/weather` の特例を明記。`/biz` `/guide` `/mypage` 系を破棄。Kinda pair を追加 |
| 2026-08-13 | 営業デモの隔離を反映：デモは `getPublicCounselors()` で全ユーザー向け画面から除外、デモの個別ページは noindex、0件時の表示を規定。§4 に「営業デモの扱い」を追加 |
| 2026-08-05 | sitemap を修正：`/kinda-story`（一覧）・`/contact`・`/kinda-note/quiz` を追加。`/kinda-story/[id]` は `consent` を持つ物語のみ収録。結果画面2本は意図的に除外と明記。コラムのカテゴリに「お見合いと交際のこと」を追加 |
| 2026-08-05 | リポジトリへ配置。旧 §3「存在確認が必要なルート」は9件すべて実在したため §1-2 へ移動し節を削除。旧 §4 のうち実装済みだった `/for-counselors` `/kinda-story/[id]` `/kinda-talk/area/[area]` を §1 へ移動。別紙に記載のなかった実在ルート（検索・予約・口コミ・アカウント・API）を §1-3 〜 §1-5 として追記。§4 の `/kinda-note/quiz` `/kinda-note/result` を実測値に更新 |
