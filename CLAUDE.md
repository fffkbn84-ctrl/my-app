# CLAUDE.md — ふたりへ プロジェクト ガイド

このファイルはAIアシスタント（Claude等）がこのリポジトリで作業する際に参照するガイドです。

---

## プロジェクト概要

**ふたりへ** — 結婚相談所を「カウンセラー個人の口コミ」を見てから予約できるサービス。
面談した人だけが書けるレビューが核心。広告に頼らないユーザーファーストな設計。

**ビジョン：**
「世の中のレビューサイトは関係が出来上がった人のためにある。
ふたりへは今まさに関係を作っているふたりのためにある。」
婚活準備→お見合い→デート→プロポーズ→その先まで拡張していく。

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 |
| DB・認証 | Supabase (PostgreSQL) |
| ホスティング | Vercel |
| コード管理 | GitHub |

---

## 作業ルール（必ず守ること）

1. **コードを書く前に必ず計画を日本語で説明してから実装する**
2. **1ステップずつ確認しながら進める**
3. **エラーが出たら原因を日本語で説明してから修正する**
4. **デザインファイル（/design/）を忠実に実装すること。フォント・カラー・余白・アニメーションは変更しない**
5. **Supabaseの環境変数は `.env.local` で管理し、GitHubにpushしない**

---

## ディレクトリ構成（想定）

```
my-app/
├── CLAUDE.md                    # このファイル
├── README.md
├── .env.local                   # 環境変数（Gitignore済み）
├── .env.example                 # 環境変数サンプル
├── next.config.ts
├── tsconfig.json
├── package.json
├── design/                      # HTMLプロトタイプ（デザイン参照用）
├── public/                      # 静的ファイル
└── src/
    ├── app/                     # Next.js App Router
    │   ├── globals.css          # Tailwind v4 + CSS変数定義
    │   ├── layout.tsx           # ルートレイアウト（フォント・メタデータ）
    │   ├── page.tsx             # トップページ
    │   ├── counselors/
    │   │   └── [id]/page.tsx    # カウンセラー詳細
    │   ├── booking/
    │   │   └── [counselorId]/   # 予約フロー（4ステップ）
    │   ├── shops/
    │   │   └── [id]/page.tsx    # お店詳細
    │   ├── columns/             # コラム記事
    │   ├── episodes/            # 成婚エピソード
    │   └── admin/               # 管理画面
    │       ├── page.tsx         # 統括管理（ふたりへ運営）
    │       └── agency/          # 相談所管理画面
    ├── components/              # 共通コンポーネント
    │   ├── ui/                  # 汎用UIパーツ
    │   ├── layout/              # ヘッダー・フッター等
    │   └── booking/             # 予約フロー用コンポーネント
    ├── lib/
    │   ├── supabase/            # Supabaseクライアント・型定義
    │   └── utils/               # ユーティリティ関数
    └── types/                   # TypeScript型定義
```

---

## デザイン原則（変更禁止）

### トーン
- スタイリッシュ・モダン・洗練。女性30代メイン
- 「高級感」ではなく「誠実な上質感」

### フォント
| 用途 | フォント | CSS変数 |
|---|---|---|
| 日本語見出し | Shippori Mincho | `--font-mincho` |
| 英語見出し | DM Serif Display | `--font-serif` |
| 本文 | Noto Sans JP | `--font-sans` |

### カラートークン（CSS変数として必ず統一）

```css
:root {
  --black:  #0E0E0E;
  --ink:    #2A2A2A;
  --mid:    #6B6B6B;
  --muted:  #A0A0A0;
  --light:  #D8D8D8;
  --pale:   #F0EEEB;
  --white:  #FAFAF8;
  --accent: #C8A97A; /* ゴールド・メインアクセント */
  --green:  #7A9E87;
  --rose:   #C4877A;
  --blue:   #6B8FBF;
}
```

**Tailwind v4でのカラー指定：**
- Tailwindユーティリティ: `text-accent`, `bg-pale`, `border-light` など
- インラインCSS: `style={{ color: "var(--accent)" }}` など
- `@theme inline` でTailwindのカラーとCSS変数を紐付けている（globals.css参照）

---

## Tailwind CSS v4 注意事項

このプロジェクトはTailwind CSS v4を使用している。v3とは構成が異なる。

- 設定ファイル（`tailwind.config.ts`）は**不要**。代わりに `globals.css` の `@theme inline` で設定
- CSS記法: `@import "tailwindcss"` （v3の `@tailwind base/components/utilities` は使わない）
- カスタムカラーは `--color-*` プレフィックスで定義
- カスタムフォントは `--font-*` プレフィックスで定義

---

## Supabaseテーブル構成

| テーブル | 説明 |
|---|---|
| `agencies` | 相談所 |
| `counselors` | カウンセラー |
| `slots` | 予約枠（status: `open` / `locked` / `booked`） |
| `reservations` | 予約 |
| `reviews` | 口コミ（source_type: `face_to_face` / `proxy`） |
| `shops` | お店（badge_type: `certified` / `agency` / `listed`） |
| `columns` | コラム記事 |
| `episodes` | 成婚エピソード |

---

## 重要なビジネスルール

### 口コミの信頼性

- **相談所口コミ：** ふたりへ経由で面談完了した人のみ投稿可
  - 面談完了後に専用URLと認証コードを発行する
- **お店口コミ：** 利用後なら誰でも投稿可
- **代理掲載口コミ：** 管理画面から運営が入力
  - 必ず `source_type='proxy'` + 「代理掲載」バッジを表示（景表法対応）

### ダブルブッキング防止

```
ユーザーが枠選択
  → 即座に status='locked' へ（5分間）
  → Supabase pg_cron で毎分、期限切れロックを open に自動解放
  → Supabase Realtime で全ユーザーのカレンダーをリアルタイム同期
  → 予約確定は SQL レベルで排他制御
     （WHERE status='open' AND id=slot_id）
```

**排他制御の実装例：**
```sql
UPDATE slots
SET status = 'booked'
WHERE id = :slot_id
  AND status = 'open'
RETURNING *;
-- 0行返ったらダブルブッキング → エラーをユーザーに返す
```

### お店のバッジ

| badge_type | 表示 | 色 |
|---|---|---|
| `certified` | ふたりへ取材済み | ゴールド（--accent） |
| `agency` | 相談所おすすめ | ブルー（--blue） |
| `listed` | 掲載店 | グレー（--muted） |

### 収益モデル
- 相談所への面談予約成立：10,000円 / 件
- 最初の100〜150社は1年間掲載無料（手数料のみ）

---

## 管理画面の権限設計

| ロール | 権限 |
|---|---|
| `admin`（ふたりへ運営） | 全機能 + 口コミ代理入力 |
| `agency`（相談所） | 自社カレンダー・口コミ返信のみ |

**口コミ返信ルール：** 相談所側から1回のみ。ユーザーからの追加返信は不可。

---

## 予約フロー（4ステップ）

```
Step 1: カウンセラー選択（カレンダー表示）
Step 2: 日時・枠選択（Realtimeで空き状況同期）
Step 3: 利用者情報入力
Step 4: 確認・予約確定
```

各ステップ間でブラウザバックされた場合、lockedになった枠を自動解放する処理を実装すること。

---

## 実装の優先順位

1. トップページ（v4デザインの実装）
2. カウンセラー詳細ページ
3. 予約フロー（4ステップ）
4. 口コミ投稿（認証ゲート付き）
5. お店ページ・口コミ
6. 統括管理画面（口コミ代理入力含む）
7. 相談所管理画面
8. 成婚エピソード・コラム

---

## 環境変数

`.env.local` に以下を設定する（`.env.example` をコピーして使う）：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # サーバーサイドのみ
```

**絶対にこれらの値をGitHubにpushしないこと。**

---

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# Lintチェック
npm run lint
```

---

## コーディング規約

### TypeScript
- 型は明示的に定義する（`any` は原則禁止）
- Supabaseのテーブル型は `src/types/database.ts` で管理

### コンポーネント
- Server Components を基本とし、インタラクションが必要な箇所のみ `'use client'` を使う
- コンポーネントファイルはPascalCase（例: `CounselorCard.tsx`）

### CSS
- カラーは必ずCSS変数を使う（ハードコード禁止）
- Tailwindのユーティリティクラス（`text-accent`, `bg-pale` 等）を優先して使う
- 直接CSS変数を参照する場合は `style={{ color: "var(--accent)" }}` のように書く
- `/design/` フォルダのプロトタイプのデザインを忠実に再現する

### Supabase
- クライアントサイド：`createBrowserClient` を使う
- サーバーサイド：`createServerClient` を使う（cookies連携）
- Row Level Security (RLS) を必ず有効にする

---

## デザインファイルについて

`/design/` フォルダにHTMLプロトタイプがある。
実装時は必ずこれを参照し、以下を忠実に再現すること：

- フォントファミリーと使い分け
- カラートークン
- 余白・サイズ感
- アニメーション・トランジション
- コンポーネントの配置とレイアウト

**デザインから勝手に変更・改善しないこと。変更が必要な場合は必ず確認を取る。**

---

## 認証・ユーザー設計

- 閲覧・検索: 登録不要・完全無料
- 予約する: メールアドレスのみ必須（パスワードなし）
- 口コミ投稿: 予約完了メールに記載の専用URLから認証
- アカウント: 予約後に任意で作成可能

### 口コミ認証フロー
予約 → 面談完了 → ふたりへからメール送信
→ メール内の専用URL → 口コミ投稿画面

### Supabase設計方針
- Supabase Authはメールリンク認証（Magic Link）を使う
- パスワード認証は実装しない
- 予約時のメールアドレスとMagic Linkを紐づける

---

## 現在の実装状況（2026-03-25 時点）

### 作業ブランチ

現在のメイン作業ブランチ: **`claude/redesign-hero-section-BThOA`**
（以降の作業はすべてこのブランチで行う）

---

### 技術スタック（実装確認済み）

| カテゴリ | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js (App Router) | 16.2.1 |
| 言語 | TypeScript | ^5 |
| UI | React | 19.2.4 |
| スタイリング | Tailwind CSS | ^4 |
| DB/Auth | Supabase (PostgreSQL) | - |
| Supabase SDK | @supabase/supabase-js | ^2.100.0 |
| SSR連携 | @supabase/ssr | ^0.9.0 |

---

### 完了済みの機能

#### ページ・ルート
| ページ | パス | 状態 |
|---|---|---|
| トップページ | `/` | ✅ 完全実装（全6セクション） |
| カウンセラー一覧 | `/counselors` | ✅ 実装済（モックデータ6名） |
| カウンセラー詳細 | `/counselors/[id]` | ✅ 実装済 |
| 予約フロー | `/booking/[counselorId]` | ✅ 4ステップ実装済 |
| お店一覧 | `/shops` | ✅ 実装済（モックデータ6店） |
| お店詳細 | `/shops/[id]` | ✅ 完全実装（口コミ表示含む） |
| お店口コミ投稿 | `/shops/[id]/review` | ✅ 実装済 |
| カウンセラー口コミ投稿 | `/reviews/new` | ✅ 認証ゲート付き実装済 |

#### コンポーネント
- `Header.tsx` / `Footer.tsx` — グローバルレイアウト（Footerは4カラムグリッドデザイン）
- `RevealObserver.tsx` — スクロールアニメーション（IntersectionObserver）
- `CounselorSearch.tsx` — 検索・フィルター・カード表示
- `BookingFlow.tsx` + `Step1Calendar` / `Step2Slots` / `Step3Form` / `Step4Confirm` — 予約フロー4ステップ
- `ShopSearch.tsx` — お店検索・フィルター
- `ReviewGate.tsx` / `ReviewForm.tsx` — 口コミ認証・投稿フォーム

#### インフラ・設計
- `src/types/database.ts` — Supabase型定義（9テーブル分）
- `src/types/booking.ts` / `review.ts` — 予約・口コミ専用型
- `src/lib/supabase/client.ts` / `server.ts` — ブラウザ/サーバー/管理者クライアント
- `supabase/schema.sql` — DBスキーマ（ENUM・テーブル・インデックス・リレーション）
- `src/lib/mock/shops.ts` — お店モックデータ

#### トップページ実装セクション（現在6セクション）
1. HERO — グリッド背景・フローティングカード3枚・CTAボタン（redesign済み）
2. MARQUEE — 無限スクロール黒帯
3. VISION — ビジョン引用（黒背景）
4. JOURNEY — フェーズタイムライン + カテゴリカード6枚
5. 注目のカウンセラー — カウンセラーカード横スクロール
6. CTA — 最終CV（黒背景・グロー装飾付き）

> **削除済みセクション：** 口コミセクション（旧6番）・ご利用の流れ（旧7番）は削除した。

#### globals.cssのCSSクラス構成
- ヒーロー系: `.hero`, `.hero-grid`, `.hero-tag`, `.hero-h1`, `.hero-sub`, `.hero-actions`, `.hero-right`, `.fc-*`, `.scene-*`
- ボタン系: `.btn`, `.btn-dark`, `.btn-outline`, `.btn-wh`, `.btn-gl`
- 共通: `.sec-label`, `.sec-h`, `.sec-sub`, `.wrap`, `.reveal`, `.rd1`〜`.rd3`
- マーキー: `.marquee-wrap`, `.mi`, `.mqi`, `.mqd`
- ビジョン: `.vision-sec`, `.vision-inner`, `.vision-eyebrow`, `.vision-quote`, `.vision-sub`
- ジャーニー: `.journey-sec`, `.journey-inner`, `.phase-*`, `.cat-*`, `.crn-*`
- ロゴ: `.logo`, `.logo-ja`, `.logo-sep`, `.logo-en`, `.logo-dot`
- CTA: `.cta-sec`, `.cta-o1`, `.cta-o2`, `.cta-inner`, `.cta-ey`, `.cta-h`, `.cta-en`, `.cta-d`, `.cta-btns`
- フッター: `footer`, `.ft-grid`, `.ft-desc`, `.ft-col`, `.ft-bottom`

---

### 未完了の機能

| 機能 | パス | 状態 |
|---|---|---|
| 統括管理画面 | `/admin` | ❌ 未実装 |
| 相談所管理画面 | `/admin/agency` | ❌ 未実装 |
| コラム一覧・詳細 | `/columns` | ❌ 未実装（リンクのみ） |
| 成婚エピソード | `/episodes` | ❌ 未実装（リンクのみ） |
| Supabase実データ接続 | — | ⚠️ モックデータのまま |
| Magic Link認証 | — | ⚠️ 設計済み・未接続 |
| ダブルブッキング排他制御 | — | ⚠️ 設計済み・未接続 |
| Supabase Realtime（枠同期） | — | ⚠️ 設計済み・未接続 |
| RLSポリシー設定 | — | ⚠️ スキーマのみ・ポリシー未設定 |

---

### 次にやること（推奨順）

1. **Supabase実データ接続** — モックデータをSupabaseクエリに置き換え
2. **RLSポリシー設定** — 各テーブルのRow Level Security設定
3. **Magic Link認証フロー** — 予約メール送信・口コミURL発行の実装
4. **ダブルブッキング排他制御** — `slots` テーブルの `locked` 状態管理 + pg_cron設定
5. **Supabase Realtime** — 予約枠のリアルタイム同期
6. **管理画面** — 統括（口コミ代理入力）・相談所（カレンダー・返信）
7. **コラム・成婚エピソード** — 記事一覧・詳細ページ

---

## アップデート履歴（2026-03-25 追記）

### 追加されたセクション（トップページ）

トップページのセクション構成が **6 → 8セクション** に拡張された。

| # | セクション | 変更 |
|---|---|---|
| 1 | HERO | 変更なし |
| 2 | MARQUEE | 変更なし |
| 3 | VISION | 変更なし |
| 4 | JOURNEY | カテゴリカードをクリッカブル化（後述） |
| 5 | 注目のカウンセラー | マージン・ヘッダースタイル修正（後述） |
| **6** | **ふたりへが選んだお店** | **新規追加** |
| **7** | **成婚エピソード** | **新規追加** |
| 8 | CTA | 変更なし |

---

### 追加されたファイル

#### モックデータ
- `src/lib/mock/places-home.ts` — お店セクション用モックデータ
  - `PlaceHome` / `BadgeType`（`"certified" | "agency"`）/ `PlaceTabCategory` / `ThumbVariant` 型
  - `placesHomeData`（4件）・`placeTabs`（5タブ）
- `src/lib/mock/episodes.ts` — 成婚エピソード用モックデータ
  - `Episode` / `EpisodeThumbVariant` 型
  - `episodesData`（3件）

#### コンポーネント
- `src/components/home/PlacesSection.tsx` — `'use client'`
  - タブフィルター（`useState`）+ ドラッグスクロール（`useRef` + `useEffect`）
  - サブコンポーネント: `PlaceThumb`・`PlaceBadge`・`Stars`
- `src/components/home/EpisodesSection.tsx` — Server Component
  - サブコンポーネント: `EpisodeThumb`・`CoupleAvatars`・`EpisodeCard`
  - featured カードは `grid-row: 1/3`（`.ep-card-ft`）

---

### 修正された既存機能

#### 注目のカウンセラー セクション
- セクションヘッダーのパディングを `px-[22px] md:px-12`（Tailwind） → `.counselor-inner` CSS クラスに変更
  - `max-width: 768px` メディアクエリで `places-inner` と同じアプローチに統一
- スクロールラッパーも同様に `.counselor-scroll` へパディングを移動
- セクションラベル・見出しを `sec-label` + `sec-h` + `sec-h-jp` クラスに統一
  - 他セクション（what we offer / selected places）と表記スタイルを揃えた

#### JOURNEY カテゴリカード（6枚）
- アクティブな3枚を `<div>` → `<Link>` に変更
  - ct-1（相談所・カウンセラー）→ `#counselors`
  - ct-2（カフェ・レストラン）→ `#places`
  - ct-3（ヘア・ネイル・眉）→ `#places`
- coming soon カード（ct-4〜6）はリンクなし・無反応のまま
- `.cat-card` に `text-decoration: none; color: inherit; display: block` を追加

#### お店バッジ仕様変更
- `listed`（掲載店）バッジを**廃止**
  - `BadgeType` から `"listed"` を削除
  - `PlaceBadge` のマップから `listed` を削除
  - 凡例から「掲載店」バッジを削除
  - `globals.css` の `.rt-listed` / `.rt-listed::before` を削除
- `sec-h-jp` テキスト変更：
  - 旧: `取材済み・相談所おすすめ・口コミで集まったお店を掲載しています`
  - 新: `取材済み・相談所おすすめのお店を掲載しています`

---

### globals.css 追加CSSクラス（このセッションで追加）

- カウンセラー: `.counselor-inner`、`.counselor-scroll`（レスポンシブパディング）
- お店: `.places-sec`、`.places-inner`、`.place-tabs`、`.pt-btn`、`.places-scroll`、`.places-track`、`.place-card`、`.place-thumb`、`.pt-cafe`/`.pt-rest`/`.pt-hair`/`.pt-photo`、`.pt-body`/`.pt-stage`/`.pt-name`/`.pt-loc`/`.pt-bottom`/`.pt-rating`/`.pt-stars`/`.pt-cnt`/`.pt-review-type`
- バッジ: `.rt-certified`、`.rt-agency`（`.rt-listed` は廃止）
- エピソード: `.ep-sec`、`.ep-inner`、`.ep-grid`、`.ep-card`、`.ep-card-ft`、`.ep-thumb`、`.et-1`/`.et-2`/`.et-3`、`.ep-body`、`.ep-tag-row`、`.ep-atag`、`.ep-period`、`.ep-title`、`.ep-excerpt`、`.ep-footer`、`.ep-couple`、`.ep-avs`、`.ep-av`、`.ep-couple-l`、`.ep-link`

---

### ビジネスルール変更点

#### お店バッジ（最新）

| badge_type | 表示 | 色 |
|---|---|---|
| `certified` | ふたりへ取材済み | ゴールド（--accent） |
| `agency` | 相談所おすすめ | ブルー（--blue） |
| ~~`listed`~~ | ~~掲載店~~ | ~~廃止~~ |

---

## アップデート履歴（2026-03-26 追記）

### 追加・修正された機能（このセッション）

#### カウンセラー詳細ページ（`/counselors/[id]`）の強化

##### ① キャンペーンバー
- ヒーローストリップと本文エリアの間に `.d-campaign-bar` を追加
- `campaign` フィールドが `null` でない場合のみ表示
- 表示内容: 星アイコン・キャンペーン名（`label`）・詳細（`detail`）・有効期限（`expiry`）

##### ② 料金プラン表
- 左カラムの「プロフィール」と「カウンセラーからのメッセージ」の間に挿入
- `.pricing-grid` / `.pricing-card` / `.pricing-card.featured` クラスで実装
- 各プランに入会金・月会費・お見合い料・成婚料を表示
- `matchmaking: null` の場合は「無料」バッジ（`.pricing-item-val.free`）を表示
- `featured: true` のプランは強調（ゴールドアクセント）・「人気」バッジ付き
- プラン注釈（`notes`）・全体注釈（`note`）も表示

##### ③ サイドバーCTAボタン強化
- 旧: Tailwindインラインスタイルの `<Link>` ボタン
- 新: `.cta-book-main` クラスで大きく目立つボタンに変更
- 補足テキストも `.cta-book-main-note`（当日キャンセル可・登録不要・完全無料）

##### ④ モバイル固定フッターCTA強化
- 旧: `lg:hidden fixed` Tailwindクラス
- 新: `.cta-mobile-bar` / `.cta-mobile-btn` CSS クラスに変更
- 次の空き枠日時も合わせて表示

#### トップページ カウンセラーカード（`/`）の強化

- `monthlyFee` フィールドを `featuredCounselors` に追加（例: `"29,800"`）
- `campaign` フィールドを `featuredCounselors` に追加（`null` または `{ label, detail }`）
- カード内に月会費（DM Serif Display フォントで大きく表示）を追加
- キャンペーンバナー（ゴールドボーダー）をカード内に差し込み（`campaign: null` の場合は非表示）

---

### モックデータ変更点

#### `src/app/counselors/[id]/page.tsx` — 全6カウンセラーに追加
| フィールド | 型 | 説明 |
|---|---|---|
| `monthlyFee` | `string` | 月会費（例: `"29,800"`） |
| `campaign` | `{ label, detail, expiry } \| null` | キャンペーン情報 |
| `pricing` | `{ plans: Plan[], note: string }` | 料金プラン一覧 |

#### `src/app/page.tsx` — `featuredCounselors` に追加
| フィールド | 型 | 説明 |
|---|---|---|
| `monthlyFee` | `string` | 月会費 |
| `campaign` | `{ label, detail } \| null` | キャンペーン情報 |

---

### globals.css 追加CSSクラス（2026-03-26 追加）

- キャンペーンバー: `.d-campaign-bar`、`.d-campaign-inner`、`.d-campaign-icon`、`.d-campaign-label`、`.d-campaign-detail`、`.d-campaign-expiry`
- 料金表: `.pricing-grid`、`.pricing-card`、`.pricing-card.featured`、`.pricing-card-head`、`.pricing-plan-name`、`.pricing-popular`、`.pricing-items`、`.pricing-item`、`.pricing-item-label`、`.pricing-item-val`、`.pricing-item-val small`、`.pricing-item-val.free`、`.pricing-note`
- CTAボタン: `.cta-book-main`、`.cta-book-main::before`、`.cta-book-main:hover`、`.cta-book-main-note`
- モバイルCTA: `.cta-mobile-bar`、`.cta-mobile-btn`、`.cta-mobile-btn:hover`

---

### 現在の実装状況（2026-03-26 時点）

#### トップページ セクション構成（計8セクション）

| # | セクション | 状態 |
|---|---|---|
| 1 | HERO | ✅ |
| 2 | MARQUEE | ✅ |
| 3 | VISION | ✅ |
| 4 | JOURNEY（カテゴリカード6枚・一部クリッカブル） | ✅ |
| 5 | 注目のカウンセラー（月会費・キャンペーン表示付き） | ✅ |
| 6 | ふたりへが選んだお店（タブフィルター・ドラッグスクロール） | ✅ |
| 7 | 成婚エピソード（featured カード付き） | ✅ |
| 8 | コラム | ✅ |
| 9 | CTA | ✅ |

#### カウンセラー詳細ページ（`/counselors/[id]`）構成

```
Header
main.pt-16
  .hero-strip（黒背景）
    .detail-hero
      左: パンくず → 相談所バッジ → アバター+名前 → 星評価+口コミ件数リンク → タグ → 統計
      右: 予約カード（PCのみ / .d-book-card）
  .d-campaign-bar（campainがある場合のみ）
  .detail-body
    .wrap
      .detail-grid
        左カラム:
          プロフィール（bio + .d-profile-grid）
          料金プラン（.pricing-grid）
          メッセージ（.d-message）
          口コミ・評価（id="reviews" / .rv-card リスト）
        右カラム（sticky top:72px）:
          予約カード（.cta-book-main ボタン）
          相談所情報カード
.cta-mobile-bar（モバイル固定フッター）
Footer
```

---

## アップデート履歴（2026-03-31 追記）

### 作業ブランチ変更

- 今回の作業ブランチ: **`claude/redesign-hero-section-BThOA`**
  - Vercelプレビュー: `my-app-git-claude-redesign-hero-***.vercel.app`
  - 変更は `claude/replace-belief-section-xJqey` で一度コミット後、`claude/redesign-hero-section-BThOA` に手動で移植した

---

### 変更内容

#### トップページ —「our belief」セクションを「Why Futarini」に置き換え（`src/app/page.tsx`）

##### 置き換え前
- セクション名: `vision-sec`（`our belief`）
- 内容: ビジョン引用テキスト（黒背景）

##### 置き換え後
- eyebrow: `WHY FUTARINI`
- 見出し: `ふたりへが選ばれる理由`（Shippori Mincho、`clamp(28px, 4vw, 48px)`）
- 背景: 白（`bg-white`）
- 最大幅: `max-w-2xl mx-auto`

##### カード仕様（3枚・縦並び）

| 項目 | 値 |
|---|---|
| background | white |
| border | `1px solid var(--border, var(--light))` |
| border-radius | 16px |
| padding | 28px 32px |
| margin-bottom | 16px |

番号スタイル:
- font: DM Serif Display
- size: 48px
- color: `var(--accent)`
- opacity: 0.25

カードタイトル:
- font: Shippori Mincho
- size: 20px
- weight: 500

本文:
- font: Noto Sans JP
- size: 13px
- color: `var(--mid)`
- line-height: 2

##### 各カード内容

| # | アイコンイメージ | タイトル |
|---|---|---|
| 01 | シールド（認証） | 面談者だけのリアルな口コミ |
| 02 | 人物（カウンセラー） | カウンセラー個人を指名して予約 |
| 03 | 時計（無料） | 完全無料で何度でも相談 |

##### セクション下部ボタン
- テキスト: 「サービスについてもっと知りたい」
- スタイル: 白背景・枠線ボタン（`border border-light text-mid rounded-full`）
- 遷移先: `/about`

---

### 新規ファイル

#### `src/app/about/page.tsx`
- `/about` へのリンク先として新規作成
- 現在は「準備中」のプレースホルダーページ
- Header / Footer を含む最小構成

---

### 現在の実装状況（2026-03-31 時点）

#### トップページ セクション構成（`claude/redesign-hero-section-BThOA` ブランチ）

| # | セクション | 状態 |
|---|---|---|
| 1 | HERO | ✅ |
| 2 | MARQUEE | ✅ |
| 3 | **WHY FUTARINI**（旧: VISION / our belief） | ✅ 今回置き換え |
| 4 | JOURNEY（カテゴリカード6枚・一部クリッカブル） | ✅ |
| 5 | 注目のカウンセラー（月会費・キャンペーン表示付き） | ✅ |
| 6 | ふたりへが選んだお店（タブフィルター・ドラッグスクロール） | ✅ |
| 7 | 成婚エピソード（featured カード付き） | ✅ |
| 8 | コラム | ✅ |
| 9 | CTA | ✅ |

