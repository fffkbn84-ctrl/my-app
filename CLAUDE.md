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

## ブランチ sync ルール（必ず守ること）

### sync 前に必ず差分を確認する

`claude/search-agencies-counselors-8OKis` → `claude/redesign-hero-section-BThOA-2NYfC` へファイルをコピーする前に、**必ず以下を実行して redesign ブランチ側に独自の変更がないか確認する：**

```bash
git diff origin/claude/redesign-hero-section-BThOA-2NYfC -- <対象ファイル>
```

差分がある場合は上書きせず、内容を確認した上でユーザーに判断を仰ぐこと。

---

### ファイルの「所有権」

#### search ブランチが正（redesign に同期してよい）

| ファイル | 備考 |
|---|---|
| `src/lib/data.ts` | モックデータ・型定義 |
| `src/app/search/` | 検索・一覧ページ全体 |
| `src/app/agencies/[id]/page.tsx` | 相談所詳細ページ |
| `src/components/ui/` | 汎用UIコンポーネント |

#### redesign ブランチが正（search ブランチで**上書き禁止**）

| ファイル | 備考 |
|---|---|
| `src/app/counselors/[id]/page.tsx` | リデザイン済みの洗練されたUI |
| `src/app/page.tsx` | トップページ（リデザイン版） |
| `src/app/globals.css` | Tailwind v4 テーマ設定 |
| `src/components/layout/` | ヘッダー・フッター等 |
| `src/app/booking/` | 予約フロー |

#### 両ブランチに変更がある場合

上書きせず、手動でマージするかユーザーに確認を取ること。

---

## 実装済み機能（2026-03-27 時点）

### ブランチ構成

| ブランチ | 内容 | Vercelプレビュー |
|---|---|---|
| `claude/redesign-hero-section-BThOA-2NYfC` | メイン開発ブランチ（全機能統合） | `my-app-git-claude-redesign-hero-7d6ffc-fffkbn84-4095s-projects.vercel.app` |
| `claude/search-agencies-counselors-8OKis` | 検索機能ベースブランチ（開発元） | — |

**作業ブランチ：** 新機能はすべて `claude/search-agencies-counselors-8OKis` で開発し、`claude/redesign-hero-section-BThOA-2NYfC` にも同期プッシュする。新しいブランチは原則作成しない。

---

### 検索・一覧機能（`/search`）

**ファイル：**
- `src/app/search/page.tsx` — サーバーコンポーネント。`<Suspense>` で `SearchContent` をラップ
- `src/app/search/SearchContent.tsx` — `'use client'`。タブ切替・フィルタリング・カード表示
- `src/lib/data.ts` — モックデータ（`AGENCIES` 5件 / `COUNSELORS` 6件）。将来Supabase移行予定

**機能：**
- タブ切替（カウンセラーから探す / 相談所から探す）
- URL params対応：`?tab=agency`、`?tab=counselor`、`?agency={id}`（相談所詳細からの遷移用）
- カウンセラーフィルター：テキスト検索・エリア・得意分野・料金帯・オンライントグル・ソート
- 相談所フィルター：テキスト検索・エリア・種別・料金帯・ソート
- カウンセラーカード全体クリックで `/counselors/{id}` に遷移（`useRouter` + `stopPropagation`）
- 相談所カード全体クリックで `/agencies/{id}` に遷移（同上）
- 「面談を予約する」「詳細を見る」ボタンは `stopPropagation` で独立してクリック可能
- キャンペーンバナー（`campaign` フィールド）対応

**実装上の注意：**
- `useSearchParams` を使うため `'use client'` + `<Suspense>` 必須
- カードクリックは `<Link>` ネストを避けるため `onClick={() => router.push(...)}` を使用
- ページヘッダーの `padding-top: 88px`（固定ヘッダー64px + 余白）

---

### 相談所詳細ページ（`/agencies/[id]`）

**ファイル：** `src/app/agencies/[id]/page.tsx`

**機能：**
- `generateStaticParams()` で全相談所IDを静的生成
- ヒーロー：グラデーション背景、パンくずリスト、種別タグ、相談所名（Shippori Mincho）
- ヒーロー内：星評価 + 口コミ件数（`#reviews` へのアンカーリンク）
- キャンペーンバナー（`campaign` フィールド）
- セクション順：特徴 → 経営方針 → ギャラリー → 料金プラン → 在籍カウンセラー → アクセス → 口コミ
- 「この相談所の特徴」タグ一覧
- 「経営方針・ご挨拶」テキストブロック（`policy` フィールド、なければ `description` を使用）
- フォトギャラリー：プラン別表示枚数制限（`PLAN_PHOTO_LIMITS`）、顧客にはプラン名非表示
- 料金プランカード：人気バッジ、料金内訳テーブル
- 在籍カウンセラー：横スクロール表示（`scrollbarWidth: none`）
- アクセス情報：所在地（`address`）・アクセス・営業時間・定休日 + Google マップ埋め込み
- 口コミ（`id="reviews"`）：SVGアバター、「面談済み」バッジ
- 固定フッターCTA：`/search?tab=counselor&agency={id}` へ遷移
- ページトップへ戻るボタン（`ScrollToTopButton`）

**params の取り方（Next.js 16）：**
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
```

---

### カウンセラー詳細ページ（`/counselors/[id]`）

**ファイル：** `src/app/counselors/[id]/page.tsx`（redesign ブランチで構築・**上書き禁止**）

**デザイン：** リデザイン済みの洗練されたレイアウト

**機能：**
- ヒーロー：グラデーション背景、アバター、氏名、エリア
- ヒーロー内：星評価 + `#reviews` アンカーリンク、成婚実績・経験年数の統計
- キャンペーンバー（`campaign.label` / `campaign.detail` / `campaign.expiry`）
- 2カラムレイアウト（左：プロフィール・料金プラン・口コミ、右：サイドバー）
- 料金プランカード（`pricing.plans`）
- 口コミ一覧（`id="reviews"`）：評価サマリー・バー付き
- 右サイドバー：予約CTA（PC）、所属相談所カード
- 所属相談所：`AgencyCardBlock` コンポーネントで検索一覧と同形式のカード表示（全体クリック可）
- モバイル固定フッターCTA
- ページトップへ戻るボタン（`ScrollToTopButton`）

**所属相談所のデータ連携：**
- サーバー側で `AGENCIES.find(a => a.id === Number(counselor.agencyId))` を解決
- `AgencyCardBlock`（`src/components/ui/AgencyCardBlock.tsx`）は `'use client'` コンポーネント
- 該当する AGENCIES データがない場合はシンプルなフォールバック表示

---

### データ構造（`src/lib/data.ts`）

```typescript
type Agency = {
  id: number; name: string; area: string; type: string[];
  plans: Plan[]; rating: number; reviewCount: number;
  description: string; features: string[]; gradient: string;
  counselorIds: number[]; access: string; address: string;
  hours: string; holiday: string; reviews: AgencyReview[];
  campaign?: string;
  policy?: string;        // 経営方針・ご挨拶テキスト
  plan: "premium" | "standard" | "fast";  // 掲載プラン（顧客非表示）
  photos: AgencyPhoto[];  // ギャラリー写真
};

// 掲載プランごとの写真表示上限
const PLAN_PHOTO_LIMITS = { premium: 5, standard: 3, fast: 1 };

type Counselor = {
  id: number; name: string; kana: string; agencyId: number;
  agencyName: string; area: string; role: string; experience: number;
  tags: string[]; rating: number; reviewCount: number; online: boolean;
  minAdmission: number; monthlyFrom: number; gradient: string;
  svgColor: string; message: string; campaign?: string;
};
```

---

### 共通コンポーネント（`src/components/ui/`）

| ファイル | 内容 |
|---|---|
| `ScrollToTopButton.tsx` | `'use client'`。スムーズスクロールでページトップへ戻るボタン |
| `AgencyCardBlock.tsx` | `'use client'`。相談所カード（検索一覧と同形式・全体クリック可）。カウンセラー詳細の所属相談所欄で使用 |

---

### トップページ・フッター修正

- `claude/redesign-hero-section-BThOA-2NYfC` の `page.tsx`：「相談所を探す」ボタンを `/search` に変更
- フッター（`src/components/layout/Footer.tsx`）の相談所セクションリンクを更新：
  - 相談所を探す → `/search?tab=agency`
  - カウンセラーから探す → `/search`
  - エリアから探す → `/search`

---

### 技術的な注意事項（過去の失敗から）

**サーバーコンポーネントでイベントハンドラーは使えない**
- `onMouseEnter` / `onMouseLeave` 等は `'use client'` コンポーネントにのみ書く
- サーバーコンポーネントのページファイルに直接書くと、ビルドは通っても **ランタイムエラー** になる
- 解決策：イベントハンドラーを含むコンポーネントを別ファイルに `'use client'` として切り出し、サーバー側でデータを解決してから props で渡す

**ブランチ sync での上書きミス**
- redesign ブランチに独自の洗練されたファイルがある場合、search ブランチのファイルで上書きすると失う
- sync 前に必ず `git diff` で差分確認。迷ったらユーザーに確認を取る
