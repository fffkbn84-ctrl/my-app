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
