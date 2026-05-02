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

---

## 実装済み機能（2026-03-27 時点）

### ブランチ構成

| ブランチ | 内容 | Vercelプレビュー |
|---|---|---|
| `claude/redesign-hero-section-BThOA-2NYfC` | **唯一の開発ブランチ** | `my-app-git-claude-redesign-hero-7d6ffc-fffkbn84-4095s-projects.vercel.app` |
| `claude/search-agencies-counselors-8OKis` | アーカイブ（参照のみ・push 不要） | — |

**作業ブランチ：** `claude/redesign-hero-section-BThOA-2NYfC` のみ。すべての開発・コミット・プッシュはこのブランチで行う。他ブランチへの同期は不要。新しいブランチは原則作成しない。

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
- 固定フッターCTA：`/counselors/booking?agencyId={id}` へ遷移（相談所起点の予約フロー）
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

**開発ブランチは `claude/redesign-hero-section-BThOA-2NYfC` 一本**
- `claude/search-agencies-counselors-8OKis` はアーカイブ扱い。参照のみ可、push 不要
- 他ブランチへの sync は行わない

---

## 実装済み機能（2026-03-30 追記）

### 相談所起点の予約フロー（`/counselors/booking`）

**背景：** 相談所詳細ページからカウンセラーを選んで予約できる新フロー。
既存の `/booking/[counselorId]`（カウンセラー詳細から直接予約する4ステップ）は変更しない。

**新規ファイル：**
- `src/app/counselors/booking/page.tsx` — サーバーコンポーネント。`searchParams` から `agencyId` を取得し、`AGENCIES`/`COUNSELORS` データを解決して `AgencyBookingFlow` に渡す
- `src/components/booking/AgencyBookingFlow.tsx` — `'use client'`。5ステップフロー全体を管理

**変更ファイル：**
- `src/components/booking/Step4Confirm.tsx` — `showCounselorRow?: boolean` prop 追加（担当カウンセラー行の表示制御）
- `src/app/agencies/[id]/page.tsx` — 固定フッターCTA遷移先を `/counselors/booking?agencyId={id}` に変更

**5ステップの構成：**

| Step | 内容 | 実装 |
|---|---|---|
| 1 | カウンセラーを選ぶ | `CounselorSelectStep`：「指名なし」ボタン + 相談所所属カウンセラーカード一覧 |
| 2 | 日時を選ぶ | 既存 `Step1Calendar` + `SelectedCounselorBanner`（「変更する」でStep1へ戻る） |
| 3 | 情報を入力 | 既存 `Step3Form` |
| 4 | 内容を確認 | 既存 `Step4Confirm`（`showCounselorRow=true` で担当カウンセラー行を表示） |
| 5 | 予約完了 | `AgencyCompletionScreen`：指名あり→カウンセラー詳細リンク、指名なし→相談所詳細リンク |

**状態管理（`AgencyBookingFlow`）：**
```typescript
state = {
  step: 1 | 2 | 3 | 4 | 5,
  selectedCounselorId: number | null,  // null = 指名なし
  selectedDate: string | null,
  selectedSlot: Slot | null,
  userInfo: BookingUserInfo | null,
}
```
- `selectedCounselorId: null` = 指名なし（カウンセラー未指定で予約）
- Step1の選択UI内では `"none"` 文字列をセンチネル値として使い、`onNext` 時に `null` に変換

**URL設計：**
- 相談所詳細 `/agencies/1` → フッターCTA → `/counselors/booking?agencyId=1`
- カウンセラー詳細 `/counselors/3` → サイドバーCTA → `/booking/3`（既存フロー・変更なし）

---

## 実装済み機能（2026-04-01 追記）

### 作業ブランチ

| ブランチ | 内容 |
|---|---|
| `integration/redesign-with-all-features` | **現在の統合開発ブランチ** |
| `claude/redesign-hero-section-BThOA-2NYfC` | 統合元ベース（デザインシステム確定版） |

**Vercelプレビュー（ベース）：** `my-app-git-claude-redesign-hero-13ddd6-fffkbn84-4095s-projects.vercel.app`

---

### デザインシステム（`src/app/globals.css`）

`claude/redesign-hero-section-BThOA-2NYfC` で確立した CSS クラス群。全詳細ページで共通使用。

| クラス | 用途 |
|---|---|
| `.hero-strip` | 詳細ページ上部の黒背景ヒーローストリップ |
| `.detail-hero` | ヒーロー内 2カラムグリッド（左：情報、右：CTAカード） |
| `.d-breadcrumb` / `.d-agency-badge` | パンくず・バッジ |
| `.d-name` / `.d-role` / `.d-tags` / `.d-stats` | 名前・役割・タグ・統計 |
| `.d-book-card` | PC右側の予約/アクションカード（`@media max-width:899px` で非表示） |
| `.d-price-row` / `.d-price` / `.d-price-free` | 価格表示 |
| `.detail-body` / `.detail-grid` | コンテンツエリア 2カラムグリッド |
| `.d-profile-grid` / `.d-profile-item` | 基本情報 2列グリッド |
| `.d-message` | 左ボーダー付きメッセージ/説明カード |
| `.rv-card` / `.rv-meta` / `.rv-verified` / `.rv-stars-row` | 口コミカード一式 |
| `.cta-book-main` / `.cta-book-main-note` | サイドバー予約ボタン（グロー付き） |
| `.cta-mobile-bar` / `.cta-mobile-btn` | モバイル固定フッターCTA |
| `.rt-certified` / `.rt-agency` | お店バッジ（丸ドット付き） |
| `.d-campaign-bar` / `.d-campaign-inner` | キャンペーンバナー（ヒーロー下） |
| `.pricing-grid` / `.pricing-card` | 料金プランカード |

---

### お店詳細ページ（`/places/[id]`）

**ファイル：**
- `src/app/places/[id]/page.tsx` — サーバーコンポーネント
- `src/lib/mock/places.ts` — 6店舗のモックデータ（将来 Supabase に差し替え）

**デザインの特徴：**
- `.hero-strip` を応用：黒背景ではなく各店舗の `gradient` を背景に使用
- パンくず文字色は `rgba(0,0,0,.4)`（明るい背景に合わせて黒系）
- カウンセラーのアバター円 → お店カテゴリ SVG アイコンに置き換え（80px 円形・すりガラス風）
- `.d-stats` で「口コミ件数」「平均評価」を表示
- `.d-book-card`（PC）/ `.cta-mobile-bar`（モバイル）に「お店のサイトを見る」「口コミを書く」

**カテゴリ SVG アイコン：** カフェ / 美容室 / ネイルサロン / 眉毛サロン / フォトスタジオ / レストラン

**モックデータ型：**
```typescript
type Place = {
  id: number; name: string; category: string; stage: string;
  area: string; badge: "certified" | "agency" | "listed";
  gradient: string; svgColor: string;
  rating: number; reviewCount: number; priceRange: string;
  hours: string; holiday: string; access: string;
  description: string; features: string[]; scenes: string[];
  reviews: PlaceReview[];
};
```

**確認URL（統合ブランチのVercelプレビューで）：**
- `/places/1` カフェ ソワレ
- `/places/2` ヘアサロン ルーシュ
- `/places/3` ネイル ブルーム
- `/places/4` Arch eyebrow studio
- `/places/5` スタジオ クラリス
- `/places/6` リストランテ イル フィオーレ

---

### 口コミ投稿フロー（`/reviews/new`）

**ファイル：**
- `src/app/reviews/new/page.tsx` — サーバーコンポーネント。`searchParams.token` を受け取り `ReviewGate` に渡す
- `src/components/reviews/ReviewGate.tsx` — `'use client'`。認証ゲート全体を管理
- `src/components/reviews/ReviewForm.tsx` — `'use client'`。口コミ入力フォーム
- `src/types/review.ts` — `ReviewToken` 型定義

**認証フロー：**
```
URL に ?token=XXX → 自動検証（ローディング表示）
  → 有効 → ReviewForm 表示
  → 無効 → エラーメッセージ → 手動コード入力へ
token なし → AuthGate（手動コード入力画面）
  → 検証OK → ReviewForm 表示
投稿完了 → SuccessScreen
```

**デモトークン（開発確認用）：**

| トークン | 状態 |
|---|---|
| `TKN-2026-DEMO1` | 有効（田中 美紀 / ブライダルハウス東京） |
| `TKN-2026-DEMO2` | 有効（佐藤 あかり / マリーナ結婚相談所） |
| `TKN-USED-001` | 使用済みエラー確認用 |

**確認URL：**
- `/reviews/new` → 認証コード入力画面
- `/reviews/new?token=TKN-2026-DEMO1` → 自動認証してフォーム表示
- `/reviews/new?token=TKN-USED-001` → 使用済みエラー表示

---

### トップページ：お店カードのタップ遷移

**ファイル：** `src/components/home/PlacesSection.tsx`

**変更内容：**
- `place-card` に `onClick` を追加 → `router.push('/places/${id}')` で詳細ページへ
- ドラッグスクロールと区別するため `dragDistance` を計測（6px超はドラッグ判定・遷移スキップ）
- `📍` 絵文字をSVGの位置アイコンに変更

---

### 統合ブランチの構成

`integration/redesign-with-all-features` は以下を統合したブランチ：

| 元ブランチ | 取り込んだ内容 |
|---|---|
| `claude/redesign-hero-section-BThOA-2NYfC` | ベース全体（デザインシステム・counselors詳細・booking フロー等） |
| `claude/create-review-flow-1Cki3` | `/reviews/new` 口コミ投稿フロー |
| `claude/create-shop-detail-page-ySpfq` | `src/lib/mock/places.ts` のモックデータ型 |

`claude/replace-belief-section-xJqey` は旧ベースからの変更のためデザインシステムと競合、非適用。

---

## 実装済み機能（2026-04-01 追記②）

### トップページ：カウンセラーセクション修正 ＋「もっと見てみる」ボタン追加

**ブランチ：** `integration/redesign-with-all-features`
**ファイル：** `src/app/page.tsx`、`src/app/globals.css`

#### カウンセラーセクションのリデザイン

- グリッドレイアウト（3カラム）→ **横スクロール**（262px固定幅カード）に変更
- アバターを名前の末尾1文字（文字アバター）→ **SVGパーソンアイコン**に変更
- カードごとにアバター背景グラデーションを変更：
  - 1枚目: `linear-gradient(135deg,#F5E8D8,#EDD8C0)` ゴールド系
  - 2枚目: `linear-gradient(135deg,#D8E8F5,#C0D4ED)` ブルー系
  - 3枚目: `linear-gradient(135deg,#D8F5E8,#C0EDD4)` グリーン系
- カード構造を参照デザイン（`c-top` / `c-body`）に準拠して再実装
- セクションヘッダーを `find your counselor` ラベル＋日本語サブテキスト付きに更新
- `globals.css` に `.counselor-scroll::-webkit-scrollbar { display: none; }` を追加

#### 「もっと見てみる」ボタン

横スクロールカード列の直下（`</section>` の直前）に追加。

```tsx
<div style={{ textAlign: "center", marginTop: 32 }}>
  <Link href="/search" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    もっと見てみる
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
</div>
```

- 遷移先: `/search`
- スタイル: `.btn .btn-outline`（`globals.css` 既存クラス）
- 配置: 中央揃え・`margin-top: 32px`

---

## 実装済み機能（2026-04-01 追記③）

### お店検索ページのデザイン刷新 ＋ データ統合

**ブランチ：** `integration/redesign-with-all-features`

#### データソース統合

- `src/lib/mock/shops.ts`（8件）を **削除**し、`src/lib/mock/places-home.ts` に一本化
- `PlaceHome` 型を拡張：`description`, `features`, `categoryLabel`, `areaLabel`, `priceRange?` を追加
- `BadgeType` を `"certified" | "agency" | "listed"` に拡張
- `ThumbVariant` に `"nail"` / `"brow"` を追加
- データ件数：4件 → **12件**（旧 shops.ts の8件を ID `"5"`〜`"12"` として統合）
- 影響ファイルの import を全て `places-home.ts` に変更：
  - `src/app/shops/[id]/page.tsx`
  - `src/app/shops/[id]/review/page.tsx`

#### お店検索ページ（`/shops`）のリデザイン

**ファイル：**
- `src/app/shops/page.tsx` — ヘッダーの `paddingTop: 88`（固定ヘッダー分）を設定
- `src/components/shops/ShopSearch.tsx` — `'use client'`。完全書き直し

**機能：**
- バッジタブフィルター：「すべて」「取材済み」「相談所おすすめ」（`listed` は非表示）
- カテゴリ・エリア select フィルター
- SVGアイコン付きテキスト検索
- バッジ凡例（取材済み・相談所おすすめの説明）
- 件数表示
- 2カラムグリッド（デスクトップ）
- カード全体クリックで `/places/[id]` に遷移
- 200px サムネイル（カテゴリ別 SVG アイコン）＋ バッジオーバーレイ
- `ITEMS_PER_PAGE = 8` でページネーション

**お店カテゴリ SVG アイコン（`PlaceThumb`）：**
カフェ / レストラン / 美容室 / ネイルサロン / 眉毛サロン / フォトスタジオ

#### トップページ：「ふたりへが選んだお店」セクション更新

**ファイル：** `src/components/home/PlacesSection.tsx`

- `nail` / `brow` の `gradientClass` と SVG アイコンを追加（ビルドエラー防止）
- `badge_type="listed"` の場合は `PlaceBadge` で `null` を返すよう修正
- セクション末尾に「すべて見る → /shops」リンクボタンを追加

---

### 共通 UI：Pagination コンポーネント

**ファイル：** `src/components/ui/Pagination.tsx`

```typescript
interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}
```

**仕様：**
- 総ページ数が1以下のときは `null`（非表示）
- 現在ページ周辺のみ番号を表示し、離れたページは `…` で省略
- 前/次ボタン（SVG矢印）、端では `opacity: 0.3` + `disabled`
- アクティブページ：黒背景・白テキスト
- ホバー：`--accent` カラーのボーダー

---

### 検索・一覧ページのページネーション＋トップ戻りボタン追加

**対象：** カウンセラー・相談所検索（`/search`）、お店検索（`/shops`）

**ファイル：**
- `src/app/search/SearchContent.tsx`
- `src/components/shops/ShopSearch.tsx`（上記で記載済み）

**変更内容（SearchContent.tsx）：**
- `ITEMS_PER_PAGE = 12`
- `cPage` / `aPage` state を追加
- フィルター変更時に `useEffect` でページを 1 にリセット
- カウンセラー・相談所グリッドを `.slice()` でページ分割
- 各グリッド下に `<Pagination>` を配置
- ページ末尾に `<ScrollToTopButton />` を追加

**技術的注意：** `<ScrollToTopButton />` は `return` のルートに並列で置けない。必ず `<>...</>` フラグメントでラップすること（未対応だとTurbopackが「Expression expected」でビルドエラーになる）。

---

## 実装済み機能（2026-04-02 追記）

### 成婚エピソード詳細ページ（`/episodes/[id]`）

**ブランチ：** `integration/redesign-with-all-features`

**新規ファイル：**
- `src/app/episodes/[id]/page.tsx` — サーバーコンポーネント。`generateStaticParams` で3件静的生成
- `src/components/episodes/SympathyButton.tsx` — `'use client'`。共感ボタン（押下でカウント+1・accent色に変化）

**変更ファイル：**
- `src/lib/mock/episodes.ts` — `Episode` 型を拡張：`agencyId`, `counselorId`, `year`, `person1`, `person2`, `story`, `quote`, `tags`, `sympathyCount`, `gradient` を追加。全3件のデータに反映
- `src/components/home/EpisodesSection.tsx` — カード全体を `<Link href="/episodes/{id}">` でラップ。ネストlink回避のため内側の「相談所を見る」Linkを削除し「続きを読む」テキストに変更
- `src/app/globals.css` — `.ep-detail-av` / `.ep-story` / `.ep-quote` / `.ep-story-tag` クラスを追加

**詳細ページの構成：**
- ヒーロー：グラデーション背景・カップルSVGアバター・ハートSVG・相談所バッジ・タイトル（Shippori Mincho）
- 本文：ストーリー段落（`ep-story`）・引用ブロック（`ep-quote`）・タグ（`ep-story-tag`）
- 共感ボタン：ローカルstateのみ（Supabase連携後にDB保存へ切り替え）
- 担当相談所・カウンセラーへのリンクカード（2カラム）
- 他の2件エピソードカード（`Other Stories`）

---

### 保存ボタン（カウンセラー・相談所詳細）

**新規ファイル：**
- `src/hooks/useSaved.ts` — `localStorage` で保存状態を永続化。`useSaved(type, id)` → `{ saved, toggle }` を返す。Supabase連携時はDB読み書きに差し替え
- `src/components/ui/SaveButton.tsx` — `'use client'`。`dark`（黒背景）/ `light`（明るい背景）variant対応。hover時ツールチップ表示

**ボタンのデザイン：**

| 状態 | スタイル |
|---|---|
| 未保存（dark） | `background: rgba(255,255,255,.08)`, `border: rgba(255,255,255,.2)`, 白アイコン |
| 未保存（light） | `background: rgba(255,255,255,.5)`, `border: rgba(0,0,0,.15)`, inkアイコン |
| 保存済み（共通） | `background: var(--adim)`, `border: var(--accent)`, accentアイコン（塗りつぶし） |

**配置：**
- カウンセラー詳細（`/counselors/[id]`）：ヒーローの所属相談所名バッジ行の右端（`justify-content: space-between`）→ モバイルでも常に表示
- 相談所詳細（`/agencies/[id]`）：ヒーローのパンくずリスト行の右端（同）

**技術的注意：**
- 両ページともサーバーコンポーネントだが、`SaveButton`（`'use client'`）を import してそのまま使える
- `useSaved` フックは `'use client'` ディレクティブが必要（`localStorage` はサーバー側に存在しないため、`useEffect` 内でのみアクセス）

---

## 実装済み機能（2026-04-02 追記④）

### コラム一覧・詳細ページ（`/columns`・`/columns/[slug]`）

**ブランチ：** `integration/redesign-with-all-features`

**新規ファイル：**
- `content/columns/good-counselor-traits.mdx` — サンプル記事（取材レポート）
- `content/columns/omiai-cafe-tokyo.mdx` — サンプル記事（お見合い準備）
- `content/columns/date-plan-by-stage.mdx` — サンプル記事（デートプラン）
- `src/lib/columns.ts` — MDX読み込みユーティリティ（3関数）
- `src/app/columns/page.tsx` — 一覧ページ（Server Component）
- `src/app/columns/ColumnsClient.tsx` — カテゴリフィルタ（`'use client'`）
- `src/app/columns/[slug]/page.tsx` — 詳細ページ（SEO・JSON-LD・静的生成）
- `src/app/columns/[slug]/ShareButtons.tsx` — SNSシェアボタン（`'use client'`）

**変更ファイル：**
- `src/lib/mock/columns.ts` — `ColumnArticle` 型に `slug?: string` を追加し、3件に MDX スラグを設定
- `src/components/home/ColumnsSection.tsx` — `slug` ありのカードを `<Link>` でラップ

#### データ構造（`content/columns/*.mdx` フロントマター）

```yaml
title: string
description: string
category: "取材レポート" | "お見合い準備" | "デートプラン"
author: string
authorInitial: string      # アバター表示用イニシャル
authorColor: string        # アバター背景色（hex）
publishedAt: "YYYY-MM-DD"
readTime: number           # 分数
thumbnail: string          # CSSグラデーション文字列
tags: string[]
featured: boolean          # 一覧ページで大きく表示するか
```

#### `src/lib/columns.ts` ユーティリティ関数

| 関数 | 返り値 |
|---|---|
| `getAllColumns()` | 全記事のメタデータ一覧（publishedAt 降順） |
| `getColumnBySlug(slug)` | 特定記事のメタデータ + MDX本文 |
| `getFeaturedColumns()` | `featured: true` の記事一覧 |

**Supabase移行方針：** 3関数のインターフェースを統一してあるため、移行時は `src/lib/columns.ts` の中身だけ差し替えればページコンポーネントは変更不要。

#### 一覧ページ（`/columns`）の構成

- カテゴリフィルタータブ：「すべて」「取材レポート」「お見合い準備」「デートプラン」
- `featured: true` の記事は大カード（`grid-row: 1/3`）で左側に表示
- 記事カード：グラデーションサムネイル・カテゴリタグ・タイトル・著者アバター・投稿日・読了時間
- レスポンシブ：PC = 5fr / 3fr 2カラム、モバイル = 1カラム

#### 詳細ページ（`/columns/[slug]`）のSEO対応

- `generateMetadata` で OGP・Twitter Card を動的生成
- `<script type="application/ld+json">` で Article スキーマの構造化データを出力（headline / description / author / publisher / datePublished / keywords）
- `generateStaticParams` で全記事を静的ビルド（SSG）

**詳細ページの構成：**
- パンくず：「ふたりへ > コラム > {category}」（各階層 Link）
- グラデーションサムネイル（240px）：カテゴリタグ（左下）・読了時間（右下）
- 記事ヘッダー：カテゴリタグ・タイトル（Shippori Mincho）・著者アバター・投稿日・読了時間
- MDXコンテンツ（`.mdx-content` カスタムCSS：p / h2 / h3 / blockquote / ul / li）
- タグ一覧（クリックで `/columns?tag={tag}` へ遷移）
- SNSシェアボタン：「Xでシェア」「リンクをコピー」（コピー後テキスト変化）
- 著者プロフィールカード（pale背景・丸アバター）
- 関連記事2件（同カテゴリの他記事）

#### コラム追加方法

`content/columns/` に `.mdx` ファイルを追加するだけで一覧・詳細ページに自動反映。

#### トップページとの連携

`src/lib/mock/columns.ts` の `ColumnArticle` 型に `slug?: string` を追加。
`slug` が設定されたカードは `ColumnsSection` で `<Link href="/columns/[slug]">` としてレンダリングされ、タップで詳細ページへ遷移する。`slug` 未設定のカードは従来通り `<div>` 表示（後方互換性あり）。

---

## 実装済み機能（2026-04-02 追記⑤）

### モバイル用ボトムナビゲーション ＋ マイページ

**ブランチ：** `integration/redesign-with-all-features`

---

#### ボトムナビゲーション（`src/components/layout/BottomNav.tsx`）

**新規ファイル：** `src/components/layout/BottomNav.tsx` — `'use client'`

**表示条件：**
- モバイルのみ（`className="md:hidden"`、768px 以下）
- `src/app/layout.tsx` の `<body>` 内に追加し、全ページで表示

**ナビ項目（3つ）：**

| ラベル | 遷移先 | アイコン |
|---|---|---|
| 担当検索 | `/search` | 人物＋虫眼鏡 SVG |
| お店検索 | `/shops` | 建物 SVG |
| マイページ | `/mypage` | 人物 SVG |

**スタイル：**
- `position: fixed; bottom: 0; height: 60px; z-index: 100`
- `background: rgba(250,250,248,.95)` + `backdrop-filter: blur(20px)`
- `padding-bottom: env(safe-area-inset-bottom)`（iPhone ホームインジケータ対応）
- アクティブ項目：`color: var(--accent)`、非アクティブ：`color: var(--muted)`
- アクティブ判定：`usePathname()` で `pathname.startsWith(item.href)` を使用

**変更ファイル：**
- `src/app/layout.tsx` — `import BottomNav` を追加し `<body>` 内に `<BottomNav />` を配置
- `src/app/globals.css` — `@media (max-width: 767px) { main { padding-bottom: calc(60px + env(safe-area-inset-bottom)) } }` を追加（コンテンツがボトムナビに隠れないよう）

---

#### マイページ（`src/app/mypage/page.tsx`）

**新規ファイル：** `src/app/mypage/page.tsx` — Server Component

**状態：** Supabase 未連携のため、ログイン前の状態のみ表示

**ページ構成（最大幅 480px・中央寄せ）：**

1. **ヘッダー：** eyebrow「MY PAGE」＋見出し「マイページ」（Shippori Mincho）

2. **ログイン促進カード：**
   - `background: var(--black)`、`border-radius: 20px`
   - 鍵アイコン SVG（accent色）
   - テキスト：「ログイン・会員登録すると使えるようになります」（Shippori Mincho / 18px / 白）
   - ボタン2つ（縦並び）：
     - 「ログイン」— accent背景、黒文字、`border-radius: 50px`
     - 「新規会員登録（無料）」— 白背景、ink文字
   - 両ボタンとも `href="#"` で仮置き（**Supabase Auth 実装後に差し替え**）

3. **機能紹介リスト：**
   - `background: white; border: 1px solid var(--border); border-radius: 16px`
   - 各項目に accent色 SVG アイコン ＋ 説明テキスト ＋「準備中」バッジ（`var(--pale)` 背景）
   - ① お気に入りのカウンセラー・相談所を保存（ブックマーク SVG）
   - ② 共感したエピソードを保存（ハート SVG）
   - ③ 予約履歴の確認・キャンセル（カレンダー SVG）
   - ④ 口コミ投稿履歴（メモ SVG）

**デザインルール遵守：** 絵文字なし・SVG アイコンのみ使用。カラーはすべて CSS 変数。

---

## 実装済み機能（2026-04-02 追記⑥）

### モバイルCTAをボトムナビと被らない右端浮遊ボタンに変更

**ブランチ：** `integration/redesign-with-all-features`

**背景：** ボトムナビゲーション（`BottomNav`）追加後、カウンセラー・相談所・お店詳細ページの固定フッターCTAがボトムナビに被って見えなくなっていた。

**変更ファイル：**
- `src/app/globals.css` — `.cta-mobile-bar` / `.cta-mobile-btn` を全面刷新
- `src/app/counselors/[id]/page.tsx` — CTAのHTML簡略化
- `src/app/agencies/[id]/page.tsx` — インラインスタイルの固定フッターをクラス化
- `src/app/places/[id]/page.tsx` — CTAのHTML簡略化

**新しいCTA仕様：**

| 項目 | 変更前 | 変更後 |
|---|---|---|
| 位置 | `bottom: 0; left: 0; right: 0`（全幅バー） | `bottom: calc(60px + env(safe-area-inset-bottom) + 12px); right: 16px`（右端浮遊） |
| 形状 | 横幅いっぱいの帯 | 72×72px 四角ボタン（`border-radius: 16px`） |
| テキスト | 「無料面談を予約する — 完全無料」1行 | 「無料 / 面談 / 予約」縦3行（お店は「サイトを / 見る」2行） |
| z-index | 50 | 90 |
| shadow | `0 6px 24px rgba(200,169,122,.4)` | `0 4px 20px rgba(200,169,122,.5), 0 1px 4px rgba(0,0,0,.12)` |
| hover | `opacity: .9` | `opacity: .9; transform: translateY(-2px)` |

相談所詳細ページは以前インラインスタイルで独自実装されていたため、同クラスに統一した。

---

### 相談所詳細ページに予約コーナーを追加 ＋ キャンセルポリシー対応

**ブランチ：** `integration/redesign-with-all-features`

#### 予約コーナー（`/agencies/[id]`）

**挿入位置：** 口コミセクション（`id="reviews"`）直後、`<ScrollToTopButton />` 直前

**デザイン：**
- `border: 1px solid var(--light); border-radius: 20px` のカード（最大幅560px・中央寄せ）
- 「reservation」eyebrow（accent色・letter-spacing）＋「無料面談を予約する」（Shippori Mincho）
- 面談料金 ¥0 + 完全無料バッジ（`.d-price-row` クラス使用でカウンセラーページと統一）
- CTAボタン：「カウンセラーを選んで予約する」→ `/counselors/booking?agencyId={id}`（`.cta-book-main` クラス）
- `ⓘ` SVGアイコン付きのキャンセルポリシーテキスト

#### `cancelPolicy` フィールド

**`src/lib/data.ts`** に以下を追加：

```typescript
// Agency 型
cancelPolicy?: string;  // 相談所ごとのキャンセルポリシー

// Counselor 型
cancelPolicy?: string;  // 将来: 所属相談所の cancelPolicy にフォールバックする想定
```

**表示ロジック：**
```tsx
{agency.cancelPolicy ?? "当日キャンセル可 · 登録不要 · 完全無料"}
```
`cancelPolicy` が未設定の場合はデフォルト文言を表示。

**各相談所のキャンセルポリシー設定値：**

| 相談所 | cancelPolicy |
|---|---|
| ブライダルハウス東京 | 面談日の前日23:59までキャンセル無料。当日キャンセルも可（初回のみ）。 |
| リーガルウェディング | 面談日の24時間前までキャンセル無料。それ以降のキャンセルはご連絡ください。 |
| シンプリーマリッジ | キャンセルは面談日前日まで承ります。当日の急なご事情もお気軽にご相談ください。 |
| ハッピーロードサロン | 無断キャンセルはご遠慮ください。前日までのご連絡で何度でも日程変更可能です。 |
| コトブキ相談センター | オンライン面談のため当日キャンセル・日程変更も柔軟に対応します。 |

**将来の展開：** `Counselor` 型にも `cancelPolicy?` を追加済み。カウンセラー詳細ページの「当日キャンセル可 · 登録不要 · 完全無料」テキストを、将来的に `counselor.cancelPolicy ?? agency.cancelPolicy ?? デフォルト` の順でフォールバックする実装に切り替えやすい設計にしてある。

---

## 実装済み機能（2026-04-02 追記⑦）

### 婚活タイプ診断機能

**ブランチ：** `integration/redesign-with-all-features`

---

#### ロジック管理（`src/lib/diagnosis.ts`）

質問データ・タイプ定義・スコア計算をここで一元管理。将来の設問変更・タイプ追加はこのファイルのみ編集すれば対応可能。

**診断タイプ（6種）：**

| id | 名称 | カラー |
|---|---|---|
| `calm` | 安心伴走型 | `#C8A97A` |
| `self` | 自分軸探索型 | `#7A9E87` |
| `support` | 全力サポート型 | `#6B8FBF` |
| `strategy` | 戦略行動型 | `#B8860B` |
| `online` | ライフスタイル両立型 | `#9B7AB5` |
| `restart` | 再スタート応援型 | `#C4877A` |

**エクスポートする型・関数：**

```typescript
type DiagnosisTypeId = "calm" | "self" | "support" | "strategy" | "online" | "restart";
type DiagnosisQuestion  // { id, text, options: { label, scores }[] }
type DiagnosisType      // { id, name, subtitle, description, color, gradient, tags, counselorTags, advice }

const QUESTIONS: DiagnosisQuestion[]              // 8問
const DIAGNOSIS_TYPES: Record<DiagnosisTypeId, DiagnosisType>
function calculateResult(answers: Record<number, number>): DiagnosisTypeId
```

スコア集計：回答ごとに各タイプへのポイントを加算し、合計が最大のタイプIDを返す。

---

#### 診断ページ（`/diagnosis`）

**ファイル：** `src/app/diagnosis/page.tsx` — `'use client'`

**機能：**
- プログレスバー（`Q{n} / 8` 表示 + accent色バー、width遷移アニメーション）
- 選択肢ボタン：選択後 0.3秒で自動的に次の質問へ（フェード＋スライドアニメーション）
- 選択済みにチェックSVG表示
- 「前の質問」戻るボタン（Q1では非表示）
- Q8 回答後 → `calculateResult` でタイプを算出 → `/diagnosis/result?type={typeId}` へ遷移

---

#### 診断結果ページ（`/diagnosis/result`）

**ファイル：** `src/app/diagnosis/result/page.tsx` — Server Component

URLパラメータ `?type={typeId}` でタイプを取得（未指定時は `calm`）。

**表示内容：**
1. 結果ヒーロー：タイプのグラデーション背景・タイプ別SVGシンボル・タイプ名（Shippori Mincho）・サブタイトル
2. タイプ説明文
3. タグ（グラデーションバッジ）
4. カウンセラーへのアドバイス（`.ep-quote` スタイル）
5. 相性の良いカウンセラー：`COUNSELORS` から `diagnosisTypes` が一致するものを最大2件表示
6. 「すべて見る」→ `/search`（TODO: Supabase連携後に `?type={typeId}` フィルターを追加）
7. Xシェアボタン：「私の婚活タイプは「〇〇型」でした。#ふたりへ」
8. 「もう一度診断する」→ `/diagnosis`

---

#### データ連携（`src/lib/data.ts`）

`Counselor` 型に `diagnosisTypes?: string[]` を追加。

各カウンセラーの設定値：

| カウンセラー | diagnosisTypes |
|---|---|
| 田中 美紀 | `["calm", "self"]` |
| 山田 健太郎 | `["strategy", "support"]` |
| 佐藤 綾乃 | `["calm", "self"]` |
| 鈴木 麻衣 | `["restart", "calm"]` |
| 中村 恵子 | `["strategy", "support"]` |
| 林 俊介 | `["online", "self"]` |

---

#### トップページ ヒーローへの診断カード追加

**ファイル：** `src/app/page.tsx`、`src/app/globals.css`

ヒーローの「✓ 無料で使えます・登録不要」の下に診断カードを挿入。

```
[コンパスSVG] あなたに合う担当タイプ、        [→ SVG]
             婚活スタイルを診断する
             （モバイルのみ2行に改行）
```

- CSSクラス `.diagnosis-hero-card`（`src/app/globals.css`）でスタイル管理
- `.diagnosis-br`：モバイル（≤900px）のみ `display: block` で改行
- ホバー時：`background: var(--adim)`

---

#### カウンセラー詳細ページへの診断タイプバッジ追加

**ファイル：** `src/app/counselors/[id]/page.tsx`

ヒーロー内のタグ（`.d-tags`）の下に「相性の良い診断タイプ:」ラベル＋バッジを表示。

```typescript
// サーバー側で COUNSELORS から diagnosisTypes を取得
const matchedCounselorData = COUNSELORS.find((c) => c.id === Number(id));
const diagnosisTypeIds = matchedCounselorData?.diagnosisTypes ?? [];
```

バッジスタイル：`background: dt.gradient; font-size: 10px; border-radius: 20px;`

---

#### マイページへの診断履歴セクション追加

**ファイル：** `src/app/mypage/page.tsx`

機能紹介リストの先頭に「診断タイプ・婚活スタイルの確認」を追加（コンパスSVG・「準備中」バッジ）。

リストの下に `DIAGNOSIS HISTORY` セクションを新設：
- タイプ名・グラデーション円・サブタイトル・日付の行を3件（ぼかし処理で内容非表示）
- pale背景オーバーレイ：「ログインすると、過去の診断結果をいつでも確認できます。」
- 「ログイン」「診断する」の2ボタン

```
TODO: Supabase Auth 実装後、ログイン済みユーザーの
      diagnosis_results テーブルから取得して表示する。
      未ログイン時はこのプレビュー表示を維持する。
```

---

#### ヒーローキャッチコピー・説明文の変更

**ファイル：** `src/app/page.tsx`

| 箇所 | 変更前 | 変更後 |
|---|---|---|
| h1 1行目 | カウンセラーを見てから、 | 担当者を自分で選んで |
| h1 2行目 | 選べる結婚相談所。 | 予約までここで完結 |
| 説明文 | 「レビュー」「デートのお店情報」 | 「口コミ」「お見合いやデート、婚活準備のための美容のお店の情報」に更新 |

---

## 実装済み機能（2026-04-05 追記）

### 診断コーナー 細部修正

**ブランチ：** `integration/redesign-with-all-features`

#### 文言修正

| ファイル | 箇所 | 変更前 | 変更後 |
|---|---|---|---|
| `src/app/page.tsx` | ヒーロー診断カード | 約5分 · 無料 | サクッと1~3分 · 無料 |
| `src/app/diagnosis/page.tsx` | 診断ページ説明文 | 約5分で診断できます | 1〜3分で診断できます |
| `src/lib/diagnosis.ts` | Q1の質問文 | 婚活を始めた理由に近いのは？ | 今のあなたの気持ちに一番近いのは？ |

#### 診断カードのテキスト変更 + モバイル改行

**ファイル：** `src/app/page.tsx`、`src/app/globals.css`

- テキストを「あなたに合う担当タイプ、婚活スタイルを診断する」に変更
- モバイル（≤900px）のみ「あなたに合う担当タイプ、」/「婚活スタイルを診断する」で改行
- `.diagnosis-br` クラス（`globals.css`）で制御：デスクトップは `display: none`、モバイルは `display: block`

#### 診断結果ページ — シェア前リンク追加

**ファイル：** `src/app/diagnosis/result/page.tsx`

Xシェアボタンの上に「あとから見返したい人はこちら（無料）」リンクを追加。

- 現在の遷移先：`/mypage`
- `TODO: Supabase Auth 実装後、マイページの登録・ログイン画面（/mypage/register 等）に差し替え`

#### 診断結果ページ — 「すべて見る」遷移先修正

**ファイル：** `src/app/diagnosis/result/page.tsx`

- `/search?type=${typeId}` → `/search` に変更（Supabase連携前は typeId フィルター未対応）
- `TODO: Supabase連携後、?type={typeId} パラメータでカウンセラーをフィルタリングできるようにする`

---

### ヒーローセクション ボタン文言変更

**ファイル：** `src/app/page.tsx`

| ボタン | 変更前 | 変更後 |
|---|---|---|
| 1つ目（btn-dark） | 相談所を探す | カウンセラーを探す |
| 2つ目（btn-outline） | お見合い・デートのお店 | ふたりのお店を探す |

遷移先（`/search`・`/shops`）・デザインは変更なし。

---

### 診断カードのスタイル修正（白背景対応）

**ファイル：** `src/app/globals.css`

`.hero` の背景が `var(--white)`（明るい色）のため、白テキストが不可視になっていた問題を修正。

| 項目 | 変更前 | 変更後 |
|---|---|---|
| 「約5分」ラベル色 | `rgba(255,255,255,.5)` | `var(--muted)` |
| カード見出し色 | `white` | `var(--black)` |
| カード背景 | `rgba(255,255,255,.06)` | `var(--pale)` |
| ホバー背景 | `rgba(255,255,255,.1)` | `var(--adim)` |

---

## 実装済み機能（2026-04-05 追記②）

### ヘッダー・フッター ロゴ表記変更

**ブランチ：** `integration/redesign-with-all-features`

**変更ファイル：**
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/globals.css`

**変更内容：** ロゴ表記を「ふたりへ」→「ふたりへ · futarive」に変更。

#### スタイル仕様

| パーツ | フォント | weight | サイズ | カラー | その他 |
|---|---|---|---|---|---|
| `ふたりへ` | Shippori Mincho | 500 | 現状維持 | `var(--ink)` | `letter-spacing: .1em` |
| `·` | — | — | — | `var(--accent)` | `margin: 0 6px` |
| `futarive` | DM Sans | 200 | 現状-2〜3px | `var(--muted)` | `letter-spacing: .08em` |

#### ヘッダー（`Header.tsx`）

`<span>` を3つに分割してインラインスタイルで制御。

```tsx
<Link href="/" className="flex items-center">
  <span style={{ fontFamily: "var(--font-mincho)", fontWeight: 500 }} className="text-xl tracking-widest text-ink">
    ふたりへ
  </span>
  <span style={{ color: "var(--accent)", margin: "0 6px" }}>·</span>
  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 200, fontSize: "17px", color: "var(--muted)", letterSpacing: ".08em" }}>
    futarive
  </span>
</Link>
```

#### フッター（`Footer.tsx` + `globals.css`）

フッターは `.logo-ja` / `.logo-sep` / `.logo-en` の CSS クラスで管理。

- `logo-sep` を縦線（`width:1px; height:14px`）から `·` テキスト（`color: var(--accent); margin: 0 6px`）に変更
- `logo-en` を DM Serif Display italic → DM Sans weight 200、13px → 15px に変更
- `logo-dot`（accent色の丸ドット）を削除

```css
.logo-ja  { font-family: 'Shippori Mincho', serif; font-weight: 500; font-size: 18px; }
.logo-sep { color: var(--accent); margin: 0 6px; }
.logo-en  { font-family: 'DM Sans', sans-serif; font-weight: 200; font-size: 15px; letter-spacing: .08em; color: var(--muted); }
```

**DM Sans の読み込み：** `src/app/layout.tsx` の Google Fonts import ですでに `wght@200;300;400` を読み込み済みのため追加対応不要。

---

## 実装済み機能（2026-04-06 追記）

### OUR BELIEF セクション テキスト・ボタン刷新

**ブランチ：** `integration/redesign-with-all-features`
**変更ファイル：** `src/app/page.tsx`、`src/app/globals.css`

#### テキスト変更

**メインコピー（`.vision-main-copy`）：**
- 旧：`vision-quote` クラス（Shippori Mincho / 20〜36px / weight 400）
- 新：`vision-main-copy` クラスに改名し仕様変更

```
選ぶ自由と、頑張れる場所を。
```

| プロパティ | 値 |
|---|---|
| font-family | Shippori Mincho |
| font-size | `clamp(24px, 4vw, 44px)` |
| font-weight | 500 |
| color | white |
| line-height | 1.6 |

**サブテキスト（`.vision-sub`）：**
- 旧：1文の説明文（Noto Sans JP / 14px / `rgba(255,255,255,.4)` / line-height 2）
- 新：3段落構成に変更

```
世の中のレビューサイトは、
関係が出来上がった人たちのためにある

ふたりへは　今まさに関係を作っている
あなたたちのためにある

不安なまま相談所に飛び込まなくていい
お見合いのカフェも　婚活前の美容も
デートのお店も　迷わない
そのそばに、ずっといます
```

- 「ふたりへ」は `style={{ color: "var(--accent)" }}` でaccentカラー表示
- 「」（鍵括弧）は使用しない

| プロパティ | 値 |
|---|---|
| font-family | Noto Sans JP |
| font-weight | 300 |
| font-size | `clamp(14px, 2vw, 18px)` |
| color | `rgba(255,255,255,.7)` |
| line-height | 2.4 |
| margin-top | 40px |

#### ボタン追加（`.vision-btn`）

サブテキストの下に `/about` へ遷移するボタンを追加。

```tsx
<div className="vision-btn-wrap reveal rd2">
  <Link href="/about" className="vision-btn">
    このサービスについてもっと知る
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </Link>
</div>
```

| プロパティ | 値 |
|---|---|
| font-family | DM Sans |
| font-size | 12px |
| letter-spacing | .16em |
| background | transparent |
| border | `1px solid rgba(255,255,255,.2)` |
| color | `rgba(255,255,255,.7)` |
| border-radius | 50px |
| padding | 14px 32px |
| hover border-color | `var(--accent)` |
| hover color | `var(--accent)` |
| transition | all .3s |

**変更していないもの：** セクション背景（`var(--black)`）・`vision-eyebrow`（our belief）・reveal アニメーション・マーキー

---

## 実装済み機能（2026-04-06 追記②）

### 「このサービスについて」ページ（`/about`）

**ブランチ：** `integration/redesign-with-all-features`

**新規ファイル：**
- `src/app/about/page.tsx` — Server Component（静的生成）

**変更ファイル：**
- `src/components/layout/Footer.tsx` — 「このサービスについて」リンクを `/about` に変更

---

#### ページ構成（8セクション）

| # | セクション | 背景 | 内容 |
|---|---|---|---|
| ① | ヒーロー | `var(--black)` | eyebrow「ABOUT FUTARIVE」・タイトル・詩テキスト |
| ② | メインコピー | `var(--pale)` | 「出会いは、人で決まる。」 |
| ③ | なぜ作ったか | `var(--white)` | eyebrow「WHY WE BUILT THIS」・本文 |
| ④ | ふたりへが信じること | `var(--black)` | eyebrow「OUR BELIEF」・信念4枚カード |
| ⑤ | ふたりへでできること | `var(--white)` | eyebrow「WHAT YOU CAN DO」・3項目（アイコン付き） |
| ⑥ | 数字で見るふたりへ | `var(--pale)` | eyebrow「BY THE NUMBERS」・2×2グリッド |
| ⑦ | 運営チームより | `var(--white)` | eyebrow「OUR TEAM」・6名SVGアバター 3カラムグリッド |
| ⑧ | 締めCTA | `var(--black)` | 「あなたの婚活を、孤独にしない。」・ボタン2つ |

---

#### ブランド表記スタイル（`.brand-name`）

ページ内の「ふたりへ」はすべて `<span class="brand-name">` でラップし、インライン `<style>` で定義。

```css
.brand-name {
  color: var(--accent);
  font-family: 'Shippori Mincho', serif;
  font-weight: 500;
}
```

適用箇所：ヒーロー末行・④見出し・⑤見出し・⑤本文（お店項目）・⑥見出し

**対象外：** ナビ・フッターのロゴ、ボタンテキスト

---

#### SVGアバター（チームメンバー）

各メンバーの髪型を線画SVGで表現。絵文字・外部画像なし。

| メンバー | 髪型 | グラデーション |
|---|---|---|
| ふうか（代表） | ボブ（あご下） | `#EDE0D4 → #D4C4B0` |
| るな（設計/デザイン） | ミディアム（肩まで） | `#D8E4D8 → #C0D4C2` |
| つよし（共同代表） | 短髪・男性 | `#D4DDE8 → #C0CCDA` |
| みづき（取材/コラム） | ロング（胸まで） | `#E8EEF0 → #D0DFE4` |
| あかり（コラム/お店担当） | ポニーテール | `#FCE8E5 → #F0D0CC` |
| さき（コラム/カウンセラー取材） | ショートボブ | `#E8D8EE → #D4C0E2` |

`@media (max-width: 600px)` でグリッドを3列→2列に変更（`.about-team-grid` クラス）。

---

#### 締めCTAボタン

黒背景に合わせて既存の `.btn` クラスを使用。

| ボタン | クラス | 見た目 |
|---|---|---|
| カウンセラーを探す → `/search` | `btn btn-wh` | 白背景・黒文字 |
| ふたりのお店を探す → `/shops` | `btn btn-gl` | 半透明白枠・白文字 |

**注意：** `btn-primary` は CSS に存在しないクラスなので使用禁止。黒背景では `btn-wh`、暗い半透明は `btn-gl` を使う。

---

#### SEOメタデータ

```typescript
export const metadata = {
  title: 'このサービスについて',
  description:
    'ふたりへは、担当者を自分の目で選んで納得してから始められる婚活サービスです。面談した人だけが書けるレビューと、カウンセラーへの直接予約を提供しています。',
}
```

---

## 実装済み機能（2026-04-08 追記）

### 婚活タイプ診断リファクタ（4タイプ版）＋ Vercel ビルドエラー修正

**ブランチ：** `integration/redesign-with-all-features`

---

#### 診断システムの4タイプ化（`src/lib/diagnosis.ts`）

6タイプ（calm/self/support/strategy/online/restart）から **4タイプ（A/B/C/D）** に完全リファクタ。

| タイプ | 名称 | color | subRoute |
|---|---|---|---|
| A | 慎重分析タイプ | `#B8912A` | `counselor` |
| B | 自信低下タイプ | `#8B6240` | `beauty` |
| C | 環境影響タイプ | `#2D5A3D` | `cafe` |
| D | 直感型 | `#3D2D5A` | `cafe` |

**スコア方式変更：** スコア加算方式 → 各選択肢が直接タイプ文字列を持つ count 方式。
同点時の優先順位：C > B > A > D

```typescript
type DiagnosisOption = { label: string; type: DiagnosisTypeId };
// answers: Record<number, string> — questionId → type letter
export function calculateResult(answers: Record<number, string>): DiagnosisTypeId
```

**`Counselor` 型の変更：**
- `diagnosisTypes?: string[]`（配列）→ `diagnosisType?: string`（単一）

各カウンセラーの設定値：

| カウンセラー | diagnosisType |
|---|---|
| 田中 美紀 | `"B"` |
| 山田 健太郎 | `"A"` |
| 佐藤 綾乃 | `"C"` |
| 鈴木 麻衣 | `"B"` |
| 中村 恵子 | `"A"` |
| 林 俊介 | `"D"` |

---

#### 診断ページ（`src/app/diagnosis/page.tsx`）

- `answers: Record<number, string>` — questionId → タイプ文字（A/B/C/D）
- `answerIndices: Record<number, number>` — 戻るボタン時のUI復元用
- 選択肢ボタン：タイプ別ハイライトカラー（A: `#B8912A` / B: `#8B6240` / C: `#2D5A3D` / D: `#3D2D5A`）
- Q8 回答後 → `calculateResult` → `/diagnosis/result?type={A|B|C|D}` へ遷移

---

#### 診断結果ページ（`src/app/diagnosis/result/page.tsx`）

Server Component。URL パラメータ `?type=A|B|C|D` でタイプを取得。

**ページ構成：**

| # | 内容 |
|---|---|
| ① | ヒーロー：グラデーション背景・タイプ名・label・description・タグ |
| ② | メインカード（白・overlapping）：担当者タイプ名・説明・マッチカウンセラー最大2件・「もっと見る」リンク |
| ③ | 分岐テキスト（タイプA以外のみ表示） |
| ④ | サブカード2枚グリッド（subRouteで分岐: cafe/beauty/counselor） |
| ⑤ | 「あとから見返したい人はこちら（無料）」→ `/mypage` |
| ⑥ | Xシェアボタン + 「もう一度診断する」 |

**サブカード分岐ロジック：**
- `subRoute === "cafe"` → [お見合い・デートのお店, 婚活準備の美容室・サロン]
- `subRoute === "beauty"` → [婚活準備の美容室・サロン, お見合い・デートのお店]
- `subRoute === "counselor"` → [お見合い・デートのお店, 婚活コラムを読む]

---

#### Vercel ビルドエラー修正（3件）

**エラー1：** `React.ReactNode` を React 未インポートで使用  
→ `import type { ReactNode } from 'react'` を追加し、`icon: ReactNode` に変更

**エラー2：** Server Component に `onMouseEnter`/`onMouseLeave`  
→ `.diagnosis-sub-card` CSSクラスに移動（`globals.css` に追加）。`:hover { transform: translateY(-3px) }` で対応

**エラー3：** `mypage/page.tsx` で `dt.subtitle` を参照（旧6タイプ時のフィールド名）  
→ `dt.label` に修正（4タイプ版の正しいフィールド名）

```css
/* globals.css に追加 */
.diagnosis-sub-card {
  background: var(--pale);
  border-radius: 14px;
  padding: 18px 16px;
  border: 1px solid var(--light);
  text-decoration: none;
  display: block;
  transition: transform .3s;
}
.diagnosis-sub-card:hover { transform: translateY(-3px); }
```

---

#### マイページ 診断履歴セクション更新（`src/app/mypage/page.tsx`）

- プレビュー円の中にタイプ識別子（A/B/C/D）を表示（視認性向上）
- コメント「全6タイプ」→「全4タイプ」に修正
- Supabase連携用スキーマ設計をコード内コメントとして明記：

```sql
-- diagnosis_results テーブル（Supabase連携時に作成）
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE
result_type TEXT NOT NULL CHECK (result_type IN ('A','B','C','D'))
answers     JSONB NOT NULL  -- Record<number, string>
created_at  TIMESTAMPTZ DEFAULT now()

-- RLS: ユーザーは自分の行のみ SELECT/INSERT 可
-- 取得: SELECT * FROM diagnosis_results
--       WHERE user_id = auth.uid()
--       ORDER BY created_at DESC LIMIT 20
```

---

#### ボトムナビゲーションに「ホーム」追加（`src/components/layout/BottomNav.tsx`）

左端に「ホーム」（`/`）を追加。ナビ順序：**ホーム → 担当検索 → お店検索 → マイページ**

- アクティブ判定：`pathname === "/"` のみ（他ページでは非アクティブ）
- アイコン：家型 SVG（既存アイテムと同スタイル・`currentColor`）

---

## Vercel ビルドエラー修正記録（2026-04-09）

### ブランチ：`integration/redesign-with-all-features`

---

### 修正① TypeScript 型エラー（`ae42d5f` コミットで混入）

**原因：** `getCounselorById` が `select('*, agencies(name, area, description)')` という JOIN クエリを使用していたが、`Database` 型に `Relationships` が未定義のため Supabase SDK v2 の型推論が戻り値を `never` と判断していた。

**症状：**
- `src/app/counselors/[id]/page.tsx` — `supabaseCounselor?.bio` 等で `Property 'bio' does not exist on type 'never'`
- `src/app/episodes/[id]/page.tsx` — `.map()` コールバックで `Parameter implicitly has an 'any' type`

**修正内容（`src/lib/data.ts`）：**
- `getCounselorById` の JOIN を `select('*')` に変更
- 戻り値型を `Promise<CounselorRow | null>` と明示的に定義

**修正内容（`src/app/episodes/[id]/page.tsx`）：**
- `.map((para, i) => ...)` → `.map((para: string, i: number) => ...)` に型注釈を追加
- `.map((tag) => ...)` → `.map((tag: string) => ...)` に型注釈を追加

#### Supabase SDK v2 の型推論に関する重要な注意

`select('*, relatedTable(col1, col2)')` のような JOIN クエリは、`Database` 型に `Relationships` が定義されていないと TypeScript が戻り値を `never` と推論する。

**対処法：**
1. JOIN を使わず `select('*')` のみにする（推奨）
2. 関数に明示的な戻り値型注釈 `Promise<RowType | null>` を付ける

---

### 修正② Vercel ランタイムエラー（スクリーンショットのエラー）

#### getCounselors エラー：`column agencies_1.area does not exist`

**原因：** `getCounselors()` で `agencies(name, area)` の JOIN を実行していたが、実際の Supabase `agencies` テーブルに `area` カラムが存在しない（PostgreSQL エラーコード `42703` = undefined_column）。TypeScript 型定義（`database.ts`）には `area` があるが、実際のテーブルに反映されていない。

**修正：** `select('*')` に変更して JOIN を削除。

**今後の注意：** `database.ts` の型定義と実際の Supabase テーブルのカラムが一致しているか、定期的に確認すること。

#### /shops ページ：`TypeError: Cannot read properties of null`

**原因：** `getShops()` が Supabase から `ShopRow[]` を返していたが、`ShopSearch` コンポーネントが期待する `PlaceHome` 型とフィールド構造が全く異なる。`features` フィールドが `null` のため `features.slice()` でクラッシュ。

| `ShopRow`（Supabase） | `PlaceHome`（コンポーネント） |
|---|---|
| `badge_type` | `badgeType` |
| `rating_avg` | `rating` |
| `review_count` | `reviewCount` |
| カラムなし | `thumbVariant`, `categoryLabel`, `areaLabel`, `stage`, `location` |

**修正：** `getShops()` が常に `placesHomeData`（モック）を返すように変更。Supabase の `shops` テーブルスキーマを `PlaceHome` 型に整合させた後、Supabase データに切り替える。

**TODO：** `shops` テーブルに `thumb_variant`, `category_label`, `area_label`, `stage`, `location` カラムを追加し、`getShops()` を Supabase データに戻す。

---

### 今後の Supabase 連携時の注意点まとめ

1. **JOIN クエリは使わない**：`select('*, table(col)')` は型推論が壊れやすい。`select('*')` のみ使い、関連テーブルは別途クエリで取得する
2. **戻り値型を必ず明示する**：`getCounselorById(id: string): Promise<CounselorRow | null>` のように書く
3. **`database.ts` と実テーブルを同期させる**：型定義にあるカラムが実テーブルにない場合、ビルドは通るがランタイムエラーになる
4. **Supabase データをコンポーネントに渡す前に型確認**：`as unknown as PlaceHome[]` のような強制キャストは危険。フィールド名・型が一致しているか必ず確認する
5. **`.map()` コールバックには型注釈を付ける**：`any` 型の配列に対して `.map((item) => ...)` とすると `noImplicitAny` エラーになる

---

---

# futarive-admin — 統括管理画面

> **ふたりへ運営スタッフ専用の管理ダッシュボード。**
> フロントサイト（`my-app/src/`）とは完全に独立した Next.js アプリとして、
> `my-app/futarive-admin/` サブディレクトリに格納されている。

---

## 概要・位置づけ

| 項目 | 内容 |
|---|---|
| **場所** | `/home/user/my-app/futarive-admin/`（my-app リポジトリのサブディレクトリ） |
| **ローカル開発ソース** | `/home/user/futarive-admin/`（修正はここで行い、my-app にコピー＆push） |
| **ブランチ** | `integration/redesign-with-all-features` |
| **Vercel** | `my-app` プロジェクトとは別に Vercel でデプロイ済み |
| **権限** | ふたりへ運営（`admin` ロール）専用。Supabase Auth でログイン必須 |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 14（App Router）+ TypeScript |
| スタイリング | Tailwind CSS + グローバル CSS（`app/globals.css`） |
| DB・認証 | Supabase（フロントサイトと **同一プロジェクト**） |
| 認証ライブラリ | `@supabase/ssr`（cookie ベース） |

---

## ディレクトリ構成

```
futarive-admin/
├── app/
│   ├── globals.css          # デザインシステム（CSS変数・共通クラス）
│   ├── layout.tsx           # ルートレイアウト（Google Fonts 読み込み）
│   ├── page.tsx             # / → /admin へリダイレクト
│   ├── login/page.tsx       # ログイン画面
│   └── admin/
│       ├── layout.tsx       # AdminShell をラップ
│       ├── page.tsx         # ダッシュボード（統計 + 承認待ち口コミ + 最近の予約）
│       ├── reviews/
│       │   ├── page.tsx     # 口コミ管理（承認・却下・代理掲載一覧）
│       │   └── new/page.tsx # 口コミ代理入力（5ステップ）
│       ├── agencies/
│       │   └── page.tsx     # 相談所管理（一覧・新規追加・編集）
│       ├── counselors/
│       │   └── page.tsx     # カウンセラー管理（一覧・新規追加・編集・掲載toggle）
│       ├── shops/
│       │   └── page.tsx     # お店管理（一覧・掲載toggle）
│       ├── slots/
│       │   └── page.tsx     # スロット管理（一覧・新規追加・ステータス変更）
│       ├── reservations/
│       │   └── page.tsx     # 予約管理（一覧・詳細表示）
│       ├── episodes/
│       │   └── page.tsx     # 成婚エピソード管理（かんばん・新規追加・公開toggle）
│       └── columns/
│           └── page.tsx     # コラム管理（一覧・新規追加・編集）
├── components/
│   └── AdminShell.tsx       # 共通レイアウト（トップバー + サイドバー + モバイル対応）
├── lib/
│   └── supabase/
│       ├── client.ts        # ブラウザ用クライアント（createBrowserClient）
│       └── server.ts        # サーバー用クライアント（createServerClient）
├── middleware.ts             # 認証ゲート（未ログイン → /login へリダイレクト）
├── supabase/
│   └── migrations/
│       └── 002_admin_policies.sql  # RLS ポリシー定義
└── types/
    └── database.ts          # Supabase テーブル型定義（参照用。実装時は各ページで独自 interface を使う）
```

---

## デザインシステム（`app/globals.css`）

### CSS 変数

```css
:root {
  --bg:      #F7F4EF;   /* ベージュ背景 */
  --surface: #FFFFFF;   /* カード・モーダル */
  --accent:  #A87C2A;   /* ゴールド（ボタン・アクティブ） */
  --ink:     #1A1612;   /* 本文テキスト */
  --muted:   #8C8480;   /* 補足テキスト */
  --border:  #E5E0D8;   /* 罫線・枠線 */
}
```

### 共通 CSS クラス一覧

| クラス | 用途 |
|---|---|
| `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` | ボタン |
| `.card` | 白背景カード（border-radius: 12px） |
| `.admin-table` | テーブル共通スタイル |
| `.badge` `.badge-open` `.badge-locked` `.badge-booked` `.badge-published` `.badge-draft` `.badge-certified` `.badge-agency` `.badge-listed` `.badge-proxy` | バッジ |
| `.form-label` `.form-input` `.form-select` `.form-textarea` | フォーム部品 |
| `.modal-overlay` `.modal-box` `.modal-title` | モーダル |
| `.spinner` | ローディングスピナー |
| `.step-bar` `.step-item` `.step-circle` `.step-label` | ステップバー（代理入力5ステップ） |
| `.kanban-col` `.kanban-card` | かんばんレイアウト（エピソード管理） |
| `.stat-card` `.stat-value` `.stat-label` | 統計カード（ダッシュボード） |
| `.toggle` `.toggle-slider` | ON/OFF トグルスイッチ |
| `.warning-banner` | 警告バナー（代理入力の景表法注意） |
| `.page-header` `.page-title` | ページ上部ヘッダー行 |
| `.empty-state` | データなし表示 |
| `.form-grid-2col` | 2カラムグリッド（モバイルで1カラムに崩れる） |
| `.topbar` `.topbar-logo` `.topbar-menu-btn` `.topbar-site-btn` `.topbar-hide-mobile` | トップバーレイアウト |

### モバイル対応（`@media (max-width: 768px)`）

- サイドバーは非表示 → ハンバーガーメニューで overlay 表示
- モーダルは下からのボトムシート（`border-radius: 20px 20px 0 0`）
- `.form-grid-2col`・`.kanban-grid-mobile` は1カラムに崩れる
- `.topbar-hide-mobile` は非表示になる

---

## 認証・RLS 設計

### ログイン

- Supabase Auth（`signInWithPassword`）
- cookie ベースのセッション管理（`@supabase/ssr`）
- `middleware.ts` が全ルートを保護：未ログイン → `/login`、ログイン済みで `/login` → `/admin`

### RLS ポリシー（`supabase/migrations/002_admin_policies.sql`）

- `authenticated` ユーザー：全テーブルに対して SELECT / INSERT / UPDATE / DELETE すべて許可
- `anon` ユーザー（フロントサイト）：`is_published = true` の行のみ SELECT 可

### 管理者アカウントの作成方法

Supabase ダッシュボード「Authentication > Users > Add User」から作成する。
コードで作成する場合は `supabase.auth.admin.createUser()`（service role key 必要）。

---

## 実装済みページ詳細

### ダッシュボード（`/admin`）

- 統計カード：承認待ち口コミ数 / 累計口コミ数 / 掲載カウンセラー数 / 今月の予約数
- クイックアクション：口コミ承認 / 新規代理入力 / スロット追加 / エピソード追加
- 承認待ち口コミ（最新5件）：承認・却下ボタン付きテーブル
- 最近の予約（最新5件）：口コミ済みフラグ付きテーブル

---

### 口コミ管理（`/admin/reviews`）

- タブ切替：「承認待ち（face_to_face）」「代理掲載済み（proxy）」
- 承認待ちタブ：承認 → `is_published = true` に UPDATE / 却下 → DELETE
- 代理掲載タブ：`source_type = 'proxy'` の口コミ一覧（閲覧専用）

---

### 口コミ代理入力（`/admin/reviews/new`）— 5ステップ

景品表示法対応のため `source_type = 'proxy'` で INSERT。

| Step | 内容 |
|---|---|
| 1 | 相談所 → カウンセラー選択（ドロップダウン連動） |
| 2 | 投稿者属性（年齢層・性別・エリア） |
| 3 | 評価（星1〜5） |
| 4 | 本文入力 |
| 5 | プレビュー + 景表法チェックボックス + 公開フラグ → INSERT |

ページ上部に `.warning-banner`「代理掲載は必ず「代理掲載」バッジを表示します」を表示。

---

### 相談所管理（`/admin/agencies`）

**一覧テーブル：** 名前 / 説明（省略表示）/ WebサイトURL / 登録日 / 編集ボタン

**新規追加（INSERT）：**
- 入力項目：名前（必須）/ 説明 / WebサイトURL
- 追加後 → 一覧を自動更新

**編集（UPDATE）：**
- 更新項目：名前 / 説明 / WebサイトURL

---

### カウンセラー管理（`/admin/counselors`）

**一覧テーブル：** 名前 / 相談所 / エリア / 経験年数 / 口コミ数 / 診断タイプ / 掲載状態トグル / 編集ボタン

**新規追加（INSERT）：**
- 入力項目：名前（必須）/ 所属相談所（ドロップダウン）/ エリア / bio / quote / 診断タイプ（A/B/C/D）/ 公開フラグ
- `review_count: 0` で初期化

**編集（UPDATE）：**
- 所属相談所の変更（`agency_id` の UPDATE）も可能

**掲載 toggle：** 一覧のスイッチで `is_published` を即時 UPDATE

---

### お店管理（`/admin/shops`）

- 一覧テーブル：名前 / 相談所 / カテゴリ / エリア / バッジ / 口コミ数 / 掲載状態トグル
- 掲載 toggle：`is_published` の即時 UPDATE
- **新規追加・編集は未実装（TODO）**

---

### スロット管理（`/admin/slots`）

- 一覧テーブル：カウンセラー / 開始日時 / 終了日時 / ステータス（open / locked / booked）
- ステータス変更：select ドロップダウンで即時 UPDATE
- 新規追加：カウンセラー選択 + 開始・終了日時を入力して INSERT

---

### 予約管理（`/admin/reservations`）

- 一覧テーブル：面談日時 / ユーザー名 / メール / 電話 / カウンセラー / 口コミ発行状況
- 行クリックで詳細モーダル（メモ / レビュートークン・コード 含む全フィールド）
- **編集・削除は未実装（TODO）**

---

### 成婚エピソード管理（`/admin/episodes`）

- かんばんレイアウト：「下書き」列 ↔ 「公開中」列
- 公開する / 非公開にするボタンで `is_published` を toggle
- 新規追加：タイトル（必須）/ 相談所 / カウンセラー / 概要（必須）/ 期間 / 成婚年 / 公開フラグ → `slug` 自動生成して INSERT

---

### コラム管理（`/admin/columns`）

- 一覧テーブル：タイトル / スラグ / 公開日時 / 登録日 / 編集ボタン
- 新規追加：タイトル（必須）/ スラグ（必須）/ 本文 / サムネイルURL / 公開日時 → INSERT
- 編集：全フィールド UPDATE 可能

---

## Supabase クライアントの使い方

```typescript
// 'use client' コンポーネント内
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data, error } = await supabase.from('agencies').select('*')
```

### 重要な注意事項（過去の失敗から）

1. **`createBrowserClient<Database>()` の Database generic は使わない**
   - Supabase SDK v2 で型推論が壊れ `.update()` の引数が `never` 型になる
   - `lib/supabase/client.ts` では generic なしで実装済み

2. **JOIN クエリ `select('*, table(col)')` は型が壊れやすい**
   - `Database` 型に `Relationships` が未定義だと戻り値が `never` になる
   - 基本は `select('*')` のみ使い、JOIN 結果は `(row.agencies as { name?: string } | null)?.name` のように取り出す

3. **各ページファイルで独自の interface を定義する**
   - `types/database.ts` の型を直接インポートして使わない
   - `database.ts` と実テーブルのカラムが乖離している可能性があるため

4. **CSS の inline style と class の混在に注意**
   - `style={{ display: 'none' }}` は class ベースの CSS より specificity が高い
   - モバイル対応は必ず `globals.css` の `@media` ブロックに書く

---

## 作業手順（ローカルで修正してpushする場合）

```bash
# 1. ローカルソース（/home/user/futarive-admin/）を編集する

# 2. 編集したファイルを my-app リポジトリのサブディレクトリにコピー
cp /home/user/futarive-admin/app/admin/xxx/page.tsx \
   /home/user/my-app/futarive-admin/app/admin/xxx/page.tsx

# 3. my-app ディレクトリでコミット＆push
cd /home/user/my-app
git add futarive-admin/...
git commit -m "feat(admin): ..."
git push -u origin integration/redesign-with-all-features
```

**なぜこの手順か：** コミット署名サーバーが `my-app` リポジトリのみを許可しているため、
`/home/user/futarive-admin/` の git リポジトリ単体では署名エラーで push できない。
必ず `my-app` リポジトリのコンテキストでコミット・push すること。

---

## 今後の実装予定：相談所専用管理画面

> **現在の統括管理画面（futarive-admin）は「ふたりへ運営」専用。**
> 今後、各相談所スタッフが自社情報・カレンダー・口コミ返信を管理できる
> **相談所専用管理画面** を実装する予定。

### 想定 URL 構成

```
/agency-admin/              # 相談所ダッシュボード
/agency-admin/login         # 相談所ログイン
/agency-admin/profile       # 自社情報編集（名前・説明・URLなど）
/agency-admin/counselors    # 自社カウンセラー一覧・編集
/agency-admin/slots         # カレンダー・スロット管理
/agency-admin/reservations  # 予約一覧（閲覧のみ）
/agency-admin/reviews       # 口コミ閲覧・返信（1回のみ）
```

### 権限設計

| ロール | できること |
|---|---|
| `admin`（ふたりへ運営） | 全データ・全機能 |
| `agency`（相談所） | 自社データのみ CRUD / 口コミへの返信（1回のみ） |

### 実装時の設計ポイント

**Supabase Auth のユーザー管理：**
- `auth.users` に加え、`admin_users` テーブルで `role` と `agency_id` を管理する
- 相談所ログイン時に `agency_id` を取得 → クエリの WHERE 条件に使う

```sql
-- 要追加：admin_users テーブル
CREATE TABLE admin_users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('admin', 'agency')),
  agency_id  UUID REFERENCES agencies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**RLS ポリシーの追加：**
- `agency` ロールは `agency_id` が一致する行のみ操作できるようにする
- 現在の `002_admin_policies.sql` は `authenticated` 全員を許可しているため、相談所画面実装時に見直しが必要

**口コミ返信：**
- `reviews` テーブルに `agency_reply` / `agency_replied_at` カラムを追加
- 返信済みの場合は返信フォームを非表示にする（1回制限）

```sql
-- 要追加：reviews テーブルへのカラム追加
ALTER TABLE reviews
  ADD COLUMN agency_reply TEXT,
  ADD COLUMN agency_replied_at TIMESTAMPTZ;
```

**スロット管理とダブルブッキング防止：**
- Supabase Realtime でスロット状態をリアルタイム同期
- `status = 'locked'` の5分タイムアウトは pg_cron で自動解放
- 詳細はこの CLAUDE.md 上部「ダブルブッキング防止」セクション参照

**アプリの配置方針（要検討）：**
- 案A：`futarive-admin` 内に `/agency-admin/` ルートを追加（シンプル）
- 案B：別の Next.js アプリとして `my-app/agency-admin/` サブディレクトリに新設（権限分離が明確）

---

## 実装済み機能（2026-04-14 追記）

### ブランチ

作業ブランチ：`integration/redesign-with-all-features`（変更なし）

---

### ヒーローセクション フルブリード化（`src/app/page.tsx`、`src/app/globals.css`）

`hero-couple-new.png.PNG`（843×1264px 縦長）1枚でヒーロー全面を表現。

**変更内容：**
- 背景装飾画像（section-cafe / section-counseling / section-beauty）を削除
- `.hkn-fill-img`：`<Image fill>` + `object-fit: cover` + `object-position: center 15%` でフルブリード
- `.hkn-overlay`：下半分に暗いグラデーションオーバーレイ（透明 → 62% 暗）
- `.hkn-inner`：`align-items: flex-end` でコンテンツを画像下部に配置
- ロゴ・サブテキストを白色に変更（画像上での可読性確保）
- 削除したCSS：`.hkn-bg` / `.hkn-bg-item` / `.hkn-bg-left` / `.hkn-bg-right` / `.hkn-bg-bl` / `.hkn-img-wrap`

---

### KindaSearchBar モーダル 改善（`src/components/home/KindaSearchBar.tsx`）

#### 外タップで閉じない問題の修正

**原因：** モーダル・オーバーレイが `.hero-kinda-new`（`overflow: hidden` + stacking context）の DOM 子要素として描画されていたため、iOS Safari でタップイベントが届かなかった。

**修正：** `createPortal(document.body)` でオーバーレイとモーダルを `<body>` 直下にマウント。`useEffect` + `mounted` フラグで SSR 安全に対応。

#### モーダル下端をヒーロー下端に固定

- `openModal()` 内で `.hero-kinda-new` の `getBoundingClientRect().bottom` を取得
- `modalBottom = Math.max(0, vh - heroBottom)` を計算し `style={{ bottom: \`${modalBottom}px\` }}` でモーダルに適用
- スクロール位置に関わらずモーダルがヒーロー内に収まる

---

### Kindaカテゴリ 画像差し替え

#### `src/app/page.tsx`（Kindaカテゴリセクション）／`src/components/home/KindaSearchBar.tsx`（検索バーモーダル）

| カード | 旧画像 | 新画像 |
|---|---|---|
| Kinda meet | `section-cafe2.png` | `section-cafe-pastel.png.PNG` |
| Kinda change | `section-beauty.png` | `section-beauty-n2.png.jpg` |
| Kinda story | `section-story.png` | `section-story-new.png.PNG` |

**Kinda meet の表示調整：**
- `object-fit: cover` + `object-position: center 35%` でカフェ看板が見える位置に調整
- 他の3枚カードと同じ表示サイズ・フィル感に統一

---

### Vercel デプロイ連携の確認

- GitHubへのプッシュは正常（ローカルプロキシ経由で `fffkbn84-ctrl/my-app` に届いている）
- Vercel プレビューURL：`integration-redesign-772ffb-fffkbn84-4095s-projects.vercel.app`
  - `integration/redesign-with-all-features` ブランチの最新デプロイを参照
  - CLAUDE.md記載の旧URL（`my-app-git-claude-redesign-hero-13ddd6-...`）は別ブランチ向けのため使用しない

---

### 追加された画像ファイル（`public/images/`）

| ファイル名 | 用途 |
|---|---|
| `hero-couple-new.png.PNG` | ヒーローフルブリード画像（現在使用中） |
| `section-cafe-pastel.png.PNG` | Kinda meet カード画像 |
| `section-beauty-n2.png.jpg` | Kinda change カード画像 |
| `section-story-new.png.PNG` | Kinda story カード画像 |
| `Kinda-belief-background.png.PNG` | 追加済み（未使用） |
| `ornamental-heartwopal.png.PNG` | 追加済み（未使用） |
| `ornamental-starfish.png.PNG` | 追加済み（未使用） |
| `section-kinda-note.png.PNG` | Kinda note カード画像 |
| `section-kinda-type.png.PNG` | Kinda type カード画像 |

---

## 実装済み機能（2026-04-15 追記）

### お店詳細ページ クレイモーフィズム リデザイン（`/places/[id]`）

**ブランチ：** `integration/redesign-with-all-features`
**変更ファイル：** `src/app/places/[id]/page.tsx`、`src/app/globals.css`

#### デザイン方針

「ミニチュアクレイ」世界観。黒背景ヒーローストリップから脱し、温かみのある質感で統一。

- 背景：`#FAF6F2`（ウォームオフホワイト）
- カード：`box-shadow: inset 0 1.5px 0 rgba(255,255,255,.92), 0 6px 24px rgba(180,155,135,.16)` の多層シャドウでクレイ感を表現
- 装飾用PNG：`ornamental-heartwopal.png.PNG`（透過）をページ内に配置可能

#### 追加したCSSクラス一覧（`globals.css`）

| クラス | 用途 |
|---|---|
| `.clay-card` | メインカード（多層シャドウ・hover lift） |
| `.clay-sec-h` | セクション見出し（Shippori Mincho・左ボーダー） |
| `.clay-desc-block` | お店説明テキストブロック（グラデーション背景） |
| `.clay-info-grid` | 基本情報 2カラムグリッド |
| `.clay-info-item` / `.clay-info-key` / `.clay-info-val` | 情報アイテム |
| `.clay-scene-tag` | シーンタグ（丸型・accent色） |
| `.clay-tag` | 特徴タグ（グラデーション） |
| `.clay-rating-summary` | 評価サマリーブロック |
| `.clay-rv-card` | 口コミカード |
| `.clay-sidebar-card` | サイドバーアクションカード |
| `.clay-mini-card` | サイドバーミニ情報カード |

---

### Kinda note・Kinda type エントリーポイント追加

**ブランチ：** `integration/redesign-with-all-features`
**変更ファイル：** `src/app/page.tsx`、`src/components/home/KindaSearchBar.tsx`、`src/app/globals.css`

#### 追加箇所①：ヒーロー画像上のタップゾーン（`src/app/page.tsx`）

`.hero-kinda-new`（`position: relative; overflow: hidden`）内の `.hkn-overlay` 直後に配置。

```tsx
<Link href="/kinda-note" className="kinda-tap-zone"
  style={{ left: "8%", top: "15%", width: "28%", height: "35%" }}>
  <div className="kinda-tap-dot" />
  <div className="kinda-tap-label">Kinda note</div>
</Link>
<Link href="/kinda-type" className="kinda-tap-zone"
  style={{ right: "8%", top: "15%", width: "28%", height: "35%" }}>
  <div className="kinda-tap-dot" />
  <div className="kinda-tap-label">Kinda type</div>
</Link>
```

- `.kinda-tap-dot`：白い丸、`kindaPulse` アニメーション（拡縮フェード）
- `.kinda-tap-label`：すりガラス白背景の小ラベル、`kindaFloat` アニメーション（上下）
- `::after` で タップ時ホワイトフラッシュ

#### 追加箇所②：KindaSearchBar モーダル（`src/components/home/KindaSearchBar.tsx`）

4カードグリッドの上に2ゾーン構成を追加。

```
[気持ちを整理する]     ← .ks-modal-tools-label
  [Kinda note] [Kinda type]  ← .ks-modal-tools-grid（2カラム）
[自分で選ぶ]          ← .ks-modal-tools-label
  [talk][meet][change][story] ← .ks-modal-grid（既存4カード）
```

- ツールカード：`.ks-modal-tool-card` + `.ks-modal-tool-img`（76px高・画像表示）
- Kinda note 背景：`#EDE8F8`（パステル紫）/ Kinda type 背景：`#E8F4E4`（パステルグリーン）

#### 追加箇所③：Kinda cats カテゴリセクション（`src/app/page.tsx`）

`.kinda-cats-grid` の先頭に2枚追加（計6枚）。

| カード | クラス | 画像 |
|---|---|---|
| Kinda note | `kinda-cat-card kc-purple` | `section-kinda-note.png.PNG` |
| Kinda type | `kinda-cat-card kc-mint` | `section-kinda-type.png.PNG` |
| Kinda talk | `kinda-cat-card kc-yellow` | `section-counseling.png`（既存） |
| Kinda meet | `kinda-cat-card kc-pink` | `section-cafe-pastel.png.PNG`（既存） |
| Kinda change | `kinda-cat-card kc-blue` | `section-beauty-n2.png.jpg`（既存） |
| Kinda story | `kinda-cat-card kc-green` | `section-story-new.png.PNG`（既存） |

#### 追加されたCSSクラス

| クラス | 用途 |
|---|---|
| `@keyframes kindaPulse` | タップゾーンの白ドット拡縮アニメーション |
| `@keyframes kindaFloat` | ラベルの上下フロートアニメーション |
| `.kinda-tap-zone` | ヒーロー画像上の絶対配置タップエリア |
| `.kinda-tap-dot` | パルスする白い丸 |
| `.kinda-tap-label` | すりガラス風ラベル |
| `.kc-purple` / `.kc-btn-purple` | パステル紫カラーバリアント（Kinda note用） |
| `.kc-mint` / `.kc-btn-mint` | パステルグリーンカラーバリアント（Kinda type用） |
| `.kinda-cat-no-img` | 画像なし時のSVGプレースホルダー（現在未使用） |
| `.ks-modal-tools` / `.ks-modal-tools-label` / `.ks-modal-tools-grid` | モーダルのツールセクション |
| `.ks-modal-tool-card` / `.ks-modal-tool-img` / `.ks-modal-tool-name` / `.ks-modal-tool-sub` / `.ks-modal-tool-badge` | モーダルのツールカード一式 |

#### 遷移先（将来実装予定）

| パス | 内容 |
|---|---|
| `/kinda-note` | 気持ちを整理するノートツール（未実装） |
| `/kinda-type` | カウンセラータイプ診断（未実装・`/diagnosis` とは別フロー想定） |

---

---

# futarive-counselor — カウンセラー・相談所オーナー向け管理画面

> **各カウンセラー・相談所オーナーが自分のプロフィール・リール・カレンダー・口コミを管理するダッシュボード。**
> フロントサイト（`my-app/src/`）・統括管理画面（`my-app/futarive-admin/`）とは完全に独立した Next.js 14 アプリとして
> `my-app/futarive-counselor/` サブディレクトリに格納されている。

---

## 概要・位置づけ

| 項目 | 内容 |
|---|---|
| **場所** | `/home/user/my-app/futarive-counselor/`（my-app リポジトリのサブディレクトリ） |
| **ブランチ** | `claude/counselor-admin-dashboard-ZECfQ`（開発）/ `main`（Vercel デプロイ用） |
| **Vercel** | `my-app` / `futarive-admin` とは別の独立した Vercel プロジェクト |
| **Root Directory** | Vercel の Root Directory 設定を `futarive-counselor` に指定してデプロイ |
| **ポート（ローカル）** | `npm run dev` → `localhost:3001` |
| **権限** | Supabase Auth でログインしたカウンセラー本人 or 相談所オーナー専用。RLS に任せ、クライアント側に権限ロジックを書かない |

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 14.2（App Router）+ TypeScript |
| スタイリング | Tailwind CSS v3 + グローバル CSS（`app/globals.css`） |
| DB・認証 | Supabase（フロントサイト・futarive-admin と **同一プロジェクト**） |
| 認証ライブラリ | `@supabase/ssr`（cookie ベース） |
| DnD | `@dnd-kit/core` + `@dnd-kit/sortable`（リール画像の並び替え） |
| フォント | Shippori Mincho（タイトル）・DM Sans（数字/ラベル）・Noto Sans JP（本文） |

---

## ディレクトリ構成

```
futarive-counselor/
├── app/
│   ├── globals.css          # デザインシステム（CSS変数・共通クラス）
│   ├── layout.tsx           # ルートレイアウト（Google Fonts を <link> タグで読み込み）
│   ├── page.tsx             # / → /dashboard へリダイレクト
│   ├── (auth)/
│   │   └── login/page.tsx   # ログイン画面 + パスワードリセット
│   └── (main)/
│       ├── layout.tsx       # 認証ガード + シェルレイアウト（Sidebar / MobileTopBar+MobileBottomNav）
│       ├── dashboard/page.tsx   # ダッシュボード
│       ├── profile/page.tsx     # プロフィール編集（4ステップ）
│       ├── reel/page.tsx        # リール編集
│       ├── calendar/page.tsx    # カレンダー・予約枠管理
│       └── reviews/page.tsx     # 口コミ一覧・返信
├── components/
│   ├── shell/
│   │   ├── Sidebar.tsx          # デスクトップ固定サイドバー（>=860px）
│   │   ├── MobileTopBar.tsx     # モバイル固定トップバー（<860px）
│   │   ├── MobileBottomNav.tsx  # モバイル固定ボトムナビ（<860px）
│   │   └── SaveBar.tsx          # 固定ボトムセーブバー（saved/dirty/saving）
│   ├── reel/
│   │   ├── CatchphraseField.tsx # キャッチコピー入力（20文字制限・プログレスバー）
│   │   ├── ReelImageGrid.tsx    # @dnd-kit ソータブル画像グリッド
│   │   ├── CaptionEditor.tsx    # 画像キャプション編集
│   │   ├── PhonePreview.tsx     # 9:16 iPhoneフレームプレビュー
│   │   └── ShareSheet.tsx       # X/LINE/URLコピー シェアシート
│   ├── calendar/
│   │   ├── MonthGrid.tsx        # 7列月カレンダー・スロットドット表示
│   │   ├── SlotDetailPanel.tsx  # 選択日のスロット一覧・ステータス変更・削除
│   │   └── SlotForm.tsx         # 枠追加フォーム（9:00〜20:00、30分刻み）
│   └── reviews/
│       ├── ReviewFilters.tsx    # フィルターピル（all/未返信/★4+/★3-）
│       ├── ReviewCard.tsx       # 口コミカード（展開・返信ボックス）
│       └── ReplyForm.tsx        # 返信フォーム（2段階確認・下書きlocalStorage保存）
├── lib/
│   ├── hooks/
│   │   ├── useAgencyContext.ts  # オーナー/カウンセラー/両方モードの判定・スコープ管理
│   │   └── useCurrentCounselor.ts  # IDからカウンセラー情報を取得
│   └── supabase/
│       ├── client.ts        # ブラウザ用クライアント（createBrowserClient、generic なし）
│       ├── server.ts        # SSR用クライアント（createServerClient + cookies）
│       ├── audit.ts         # 監査ログ（logAuthEvent / logPersonalDataAccess）
│   └── types.ts             # TypeScript型定義
├── middleware.ts             # 認証ゲート（未ログイン→/login、ログイン済みで/login→/dashboard）
├── next.config.mjs           # Supabase Storage の remotePatterns 設定
├── tailwind.config.ts        # CSS変数バックのカラートークン定義
├── postcss.config.mjs        # tailwindcss + autoprefixer
├── package.json
└── vercel.json
```

---

## デザインシステム（`app/globals.css`）

### CSS 変数（ライトモード / ダークモード対応）

```css
:root {
  --bg:           #FBF7F1;   /* ベージュ背景 */
  --bg-elev:      #F5EEE6;   /* 一段上がった背景 */
  --bg-subtle:    #EFE6D8;
  --card:         #FFFFFF;
  --card-warm:    #FFFBF4;
  --text-deep:    #1A130E;
  --text:         #2E2620;
  --text-mid:     #6B5D52;
  --text-light:   #B0A090;
  --text-faint:   #D4C5B5;
  --accent:       #C8A97A;   /* ゴールド */
  --accent-deep:  #A88858;
  --accent-dim:   #F0E4CF;
  --accent-pale:  #F9F1E3;
  --success:      #7A9E87;
  --warning:      #D4A23D;
  --danger:       #C07A6E;
  --border:       #EAE0D0;
  --sidebar-w:    220px;
  --topbar-h:     52px;
  --bottomnav-h:  60px;
}
```

ダークモードは `@media (prefers-color-scheme: dark)` + `[data-theme="dark"]` の2系統で制御。

### 共通 CSS クラス一覧

| クラス | 用途 |
|---|---|
| `.kc-card` / `.kc-card-warm` | ボーダー・影付きカード |
| `.kc-btn` `.kc-btn-primary` `.kc-btn-ghost` `.kc-btn-danger` `.kc-btn-sm` | ボタン |
| `.kc-label` `.kc-input` `.kc-select` `.kc-textarea` | フォーム部品 |
| `.kc-toggle` / `.kc-toggle-slider` | ON/OFF トグルスイッチ |
| `.kc-badge` `.kc-badge-open` `.kc-badge-booked` `.kc-badge-locked` `.kc-badge-urgent` `.kc-badge-review` `.kc-badge-booking` | バッジ |
| `.kc-overlay` / `.kc-modal` / `.kc-modal-title` | モーダル（モバイルはボトムシート） |
| `.kc-toast` | トースト通知（画面下部） |
| `.page-title` | Shippori Mincho 22px 見出し |
| `.section-title` | Shippori Mincho 16px セクション見出し |
| `.eyebrow` | DM Sans 10px 大文字ラベル（accent色） |
| `.stat-card` / `.stat-value` / `.stat-label` | 統計カード（ダッシュボード） |
| `.step-bar` / `.step-item` / `.step-circle` / `.step-label` | ステップバー（プロフィール4ステップ） |
| `.cal-grid` / `.cal-cell` / `.cal-dots` / `.cal-dot-open/booked/locked` | カレンダー |
| `.phone-frame` / `.phone-screen` / `.phone-overlay` / `.phone-progress` / `.phone-actions` | iPhoneプレビューフレーム |
| `.rv-card` / `.rv-meta` / `.rv-stars` / `.rv-reply-box` | 口コミカード |
| `.save-bar` | 固定ボトムセーブバー |
| `.kc-main` | メインコンテンツエリア（サイドバー幅分の左padding） |

---

## 認証・RLS 設計

### ログイン

- Supabase Auth（`signInWithPassword`）
- `@supabase/ssr` で cookie ベースのセッション管理
- `middleware.ts` が全ルートを保護：未ログイン → `/login`、ログイン済みで `/login` → `/dashboard`
- ログイン成功・失敗時に `logAuthEvent()` で監査ログを記録

### RLS

- クライアント側には権限ロジックを書かない。DB の RLS に完全委任
- `counselors` テーブル：`owner_user_id = auth.uid()` の行のみ操作可
- `agencies` テーブル：`owner_user_id = auth.uid()` の行のみ操作可

### 監査ログ（`lib/supabase/audit.ts`）

```typescript
logAuthEvent('login_success' | 'login_failure' | 'logout' | 'password_reset_requested')
logPersonalDataAccess('reservations' | 'reviews', targetId, ownerId)
// どちらも失敗しても例外を握りつぶし、アプリ動作を妨げない
// supabase.rpc('log_audit_event', ...) を内部で呼ぶ
```

---

## ユーザーモード判定（`lib/hooks/useAgencyContext.ts`）

ログインユーザーが「カウンセラー本人」「相談所オーナー」「両方」かを自動判定。

| mode | 条件 | 編集スコープ |
|---|---|---|
| `'counselor'` | `counselors.owner_user_id = user.id` のみ | 自分1件 |
| `'owner'` | `agencies.owner_user_id = user.id` のみ | 相談所所属カウンセラー全員 |
| `'both'` | 両方あり | 両方 |

`selectedAgencyId`（複数相談所を持つオーナー向け）と `currentCounselorId`（編集対象の切替）を state として保持。

---

## 実装済みページ詳細

### ログイン（`/login`）

- メールアドレス + パスワード認証
- パスワードリセット（メール送信）をインライン切替で表示
- ログイン成功 → `logAuthEvent('login_success')` → `/dashboard` へ遷移
- ログイン失敗 → `logAuthEvent('login_failure', 'failure', { reason: 'invalid_credentials' })`

---

### ダッシュボード（`/dashboard`）

- 統計カード4枚（リール公開数/今月の予約/未返信レビュー/平均評価）
- 「未返信が urgent（★3以下）」「通常未返信」「リール未公開」を ToDoリスト「ちいさな「しなきゃ」」として表示
- クイックアクション：レビューに返信 / リール編集 / 予約枠追加 / プロフィール更新
- オーナーモードの場合：相談所・カウンセラー切替ボタンを表示（UIのみ、現時点は表示切替非連動）

---

### プロフィール編集（`/profile`）

- 4ステップ構成：
  1. **基本情報**：名前・ふりがな・所属相談所（オーナーはドロップダウン）・エリア・経験年数
  2. **人となり**：intro テキスト・message テキスト・得意分野（チップ入力）・資格（チップ入力）
  3. **料金と成果**：相談料・成婚実績件数・経験年数ラベル・プロフィール写真アップロード
  4. **確認**：入力内容プレビュー + 公開トグル（`is_published`）
- 各ステップで2秒デバウンス自動保存（`saveStatus: 'saved' | 'dirty' | 'saving'`）
- 写真は Supabase Storage の `counselor-photos` バケットにアップロード
- チップ入力：Enter/カンマで追加、×ボタンで削除

---

### リール編集（`/reel`）

- 左カラム：キャッチコピー + 画像グリッド + キャプション編集
- 右カラム：iPhoneプレビュー（sticky）

**キャッチコピー（`CatchphraseField`）**
- 20文字制限・プログレスバー（16文字超でオレンジ、20文字で赤）
- 2秒デバウンス自動保存

**画像グリッド（`ReelImageGrid`）**
- @dnd-kit でドラッグ&ドロップ並び替え
- 並び替え後 `display_order` を一括 UPDATE
- 画像追加：縦横比チェック（ratio > 0.6 で確認ダイアログ）→ Supabase Storage `counselor-media` バケットへアップロード
- 最大10枚

**iPhoneプレビュー（`PhonePreview`）**
- 9:16 アスペクト比・iPhone フレーム CSS
- 上部プログレスセグメント（選択中の画像インデックスと連動）
- 右側アクション（ハート/コメント/シェア）
- 下部オーバーレイ：キャッチコピー + キャプション
- レビューボトムシート（スワイプ風UI）
- シェアシート（`ShareSheet`：X / LINE / URLコピー）

**公開トグル**
- `reel_enabled` フィールドを即時 UPDATE
- トースト通知で「リールを公開しました」「非公開にしました」

---

### カレンダー・予約枠管理（`/calendar`）

- 月カレンダー（`MonthGrid`）：7列グリッド・スロットドット（open=緑/booked=accent/locked=薄灰）・今日ハイライト
- 日選択 → `SlotDetailPanel`：その日のスロット一覧・ステータス変更 select・削除ボタン
- 枠追加（`SlotForm`）：開始時刻 select（9:00〜20:00 / 30分刻み）→ 終了時刻自動計算（+1h）→ INSERT
- 月移動（前月/次月ボタン）で Supabase から該当月のスロットを再取得

---

### 口コミ一覧・返信（`/reviews`）

- フィルターピル：全件 / 未返信 / ★4以上 / ★3以下
- 未返信件数バッジ付きフィルター
- カード展開で返信フォーム（`ReplyForm`）を表示
  - 下書き自動保存：1秒デバウンスで `localStorage` に保存（キー: `kinda_reply_draft_{reviewId}`）
  - **2段階確認モーダル**：「送信する」→ 確認ダイアログ → 確定送信（1回のみ・取り消し不可）
  - 返信済みは返信フォームを非表示、返信内容を読み取り専用で表示
- 口コミ展開時に `logPersonalDataAccess('reviews', id)` で監査ログ記録
- `handleReply` で二重送信防止チェック（送信前に DB から最新 `agency_reply` を取得）

---

## Supabase クライアントの使い方

```typescript
// 'use client' コンポーネント内
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()  // generic なし（型推論バグ防止）

// サーバーコンポーネント・Server Actions
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### 重要な注意事項

1. **`createBrowserClient<Database>()` の Database generic は使わない**
   - `.update()` の引数が `never` 型になるバグが発生する
   - `client.ts` は generic なしで実装済み

2. **JOIN クエリ `select('*, table(col)')` は使わない**
   - `Database` 型に `Relationships` が未定義だと戻り値が `never` になる
   - 別クエリで取得する（例：counselor 取得後に agency を別途 select）

3. **各ページで独自 interface を定義する**
   - `lib/types.ts` の型を直接インポートして使うのは OK だが、JOIN 結果などは独自 interface に

4. **Google Fonts は `app/layout.tsx` の `<link>` タグで読み込む**
   - `globals.css` に `@import url(...)` を書くと Next.js webpack がビルドエラーを出す（解決済み）

5. **`autoprefixer` は `devDependencies` に明示記載が必要**（解決済み）

---

## TypeScript でハマりやすいパターン（過去の失敗から）

### 型の絞り込み後の比較

```tsx
// NG: slot.status === 'open' のブロック内では TypeScript が 'open' に型絞り込みをする
{slot.status === 'open' && (
  <button style={{ marginLeft: slot.status !== 'booked' ? 4 : 'auto' }}>
  // ↑ slot.status は常に 'open' なので 'booked' との比較は型エラー
```

```tsx
// OK: 絞り込み済みなので定数にする
{slot.status === 'open' && (
  <button style={{ marginLeft: 4 }}>
```

### `() => void` 型の props に引数を渡さない

```tsx
// SortableItem の onDelete は () => void（item.id は外側クロージャで取り込み済み）
// NG:
onClick={e => { e.stopPropagation(); onDelete(item.id) }}
// OK:
onClick={e => { e.stopPropagation(); onDelete() }}
```

---

## 環境変数

`.env.local` に以下を設定する：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 開発コマンド

```bash
cd futarive-counselor
npm install
npm run dev    # localhost:3001 で起動
npm run build  # 本番ビルド（型チェック含む）
```

---

## ブランチと作業手順

**開発ブランチ：** `claude/counselor-admin-dashboard-ZECfQ`

修正・追加は必ず以下の手順で行う：

```bash
# 1. 開発ブランチで作業・コミット
git -C /home/user/my-app add futarive-counselor/...
git -C /home/user/my-app commit -m "fix(counselor): ..."
git -C /home/user/my-app push -u origin claude/counselor-admin-dashboard-ZECfQ

# 2. main にも cherry-pick（Vercel は main を監視）
git -C /home/user/my-app checkout main
git -C /home/user/my-app cherry-pick <commit-hash>
git -C /home/user/my-app push -u origin main
git -C /home/user/my-app checkout claude/counselor-admin-dashboard-ZECfQ
```

**なぜこの手順か：** Vercel の futarive-counselor プロジェクトは `main` ブランチを監視している。開発ブランチで作業し、main への cherry-pick でデプロイを行う。

**git コマンドは必ず `-C /home/user/my-app` で my-app リポジトリのルートから実行する。**
`futarive-counselor/` ディレクトリ内では `git add` のパス解決がずれてエラーになる。

---

## 今後の実装予定

| 機能 | 概要 |
|---|---|
| 複数カウンセラー切替（オーナー向け） | ダッシュボード・リール・プロフィールを `currentCounselorId` に連動させる |
| Supabase Realtime（カレンダー） | 他デバイスでのスロット変更をリアルタイム反映 |
| 予約詳細確認 | カレンダー画面から `booked` スロットの予約者情報を表示 |
| プロフィール写真トリミング | アップロード時にブラウザ内でクロップ UI |
| 通知機能 | 新規予約・新規口コミ着信時のブラウザ通知 |

---

## 実装済み機能（2026-04-26 追記） — Kinda talk / Kinda act / 認証 / 大規模 UX 改善

> このセクションは `claude/implement-kinda-talk-uDUoW` ブランチで進めた一連の作業の総括。
> ブランチ末端の最新コミット（2026-04-26 時点）まで全て反映済み。
> Vercel のデイリーデプロイ上限により最後のいくつかのコミットは反映待ち。

### ブランチ・PR 状況

| ブランチ | 状態 |
|---|---|
| `claude/implement-kinda-talk-uDUoW` | 開発中。すべてのコミットを集約 |
| `main` | 初回 PR (#3) で `Kinda talk + Supabase連携 + 認証` までマージ済み |

以降のコミット（Kinda act、ブランド統一、スクロール戻る、地図、検索拡張、村背景など）は次回 PR でまとめて main へマージ予定。

---

### 1. /kinda-talk — カウンセラー一覧（リール型）

**ファイル:**
- `src/app/kinda-talk/{layout,page,KindaTalkClient}.tsx`
- `src/components/kinda-talk/{CounselorReelCard,CounselorReelModal,KindaTypeBadge,DemoBadge,ShareSheet,FAQAccordion,CounselorReelGrid}.tsx`
- `src/lib/kinda-types.ts`（6 タイプ定義: anshin / jibunjiku / zenryoku / senryaku / lifestyle / restart）

**機能:**
- 縦長 9:16 リールカードを 2/3/4 列グリッド
- カードタップで全画面リールモーダル（framer-motion + MotionConfig reducedMotion）
- モーダル内 ♡（DB保存） / 💬（口コミへ） / 共有 の 3 アクション
- ヒーロー: フルブリード画像 + パステルイエロー被せ（`mix-blend-mode: soft-light`）
- 選び方ガイド + FAQ（JSON-LD `FAQPage` 構造化データ）

**派生ページ:**
- `/kinda-talk/area/[area]`: tokyo / osaka / nagoya / fukuoka / online（SSG 5 ページ）
- `/kinda-talk/type/[type]`: 6 Kinda type それぞれの専用ページ（SSG 6 ページ）

**エリアフィルター（最新仕様）:**
- 横スクロールピル → **トグル式ドロップダウン** に再構築
- 11 都道府県 + オンラインを 3 列グリッドで表示
- カウンセラー 0 件のエリアは `aria-disabled` + 35% 不透明度でグレーアウト
- 各エリアのカウンセラー数を併記
- `extractPrefecture()` で `counselor.area` の先頭セグメント（"・" より前）から都道府県抽出

---

### 2. /kinda-act — お見合い・デート用のお店一覧（リール型）

**ファイル:**
- `src/app/kinda-act/{layout,page,KindaActClient}.tsx`
- `src/components/kinda-act/{PlaceReelCard,PlaceReelModal,PlaceThumb,PlaceBadge,placeIcons}.tsx`
- `public/images/laughing-town-background.png.PNG`（ページ最奥背景の村ミニチュア）

**機能:**
- 旧名「Kinda meet」を **「Kinda act」**（実際に会う場所を行動して選ぶ）に改名
- カテゴリ限定: **カフェ + レストランのみ**（美容系は Kinda glow へ分離する想定）
- 縦長 9:16 リールカード + 全画面リールモーダル（PlaceReelModal）
- リールモーダル: 画像スワイプ + ♡（type="place"）/ 💬（口コミへ） / 共有
- 全 12 件すべてに「サンプル」バッジを表示（運用前のため）

**ヒーロー + 背景:**
- ヒーロー: 既存 `section-cafe-pastel.png.PNG` + 多層 text-shadow（白文字の視認性強化）
- ヒーロー以降のページ最奥に **村のミニチュア画像をブラー + パステルピンク被せで配置**
  - `.ka-village-bg`: `position: fixed; inset: 0; filter: blur(36px); transform: scale(1.18)`
  - `::after` でピンクオーバーレイ 30〜45%
  - セクション背景を半透明（72% / 50%）にして村が透ける
  - スクロールで「具体的なカフェ → 抽象的な村世界」のグラデーション

**選定基準:**
- 4 カードグリッド（2×2）で表示
  - 話しやすい音量 / 座席の距離 / 店員の干渉 / 入店のしやすさ
- 各カード: accent カラー円形アイコン + Mincho ラベル + 短い説明
- セクションテーマ: `data-section="act"` パステルピンク（`#F5E1E0`）

---

### 3. /counselors/[id] / /places/[id] — 詳細ページ強化

**/counselors/[id]:**
- `generateMetadata` で title / description / OGP / Twitter Card / canonical 動的生成
- JSON-LD: `Person` + `LocalBusiness` + `AggregateRating` + 最新 5 件の `Review`
- ヒーロー内に保存ボタン（SaveButton, useSaved → useFavorites 経由）

**/places/[id]:**
- 「○件の口コミ」を Link 化 → `#reviews` へスクロール（💬アイコン併設）
- サイドバーの重複情報（営業時間/定休日/アクセス）を削除
- 代わりに **Google Maps iframe** を埋め込み（API キー不要のクエリ版）
- 口コミ制約文言: 「お店を利用した方ならどなたでも投稿できます」
  → 将来 Kinda 経由予約フロー実装後に「面談済み制限」へ戻す方針

---

### 4. 認証・気になる保存

**Supabase マイグレーション（実行済み）:**
| ファイル | 内容 |
|---|---|
| `001_add_columns.sql` | counselors / reviews / shops / episodes に基本カラム追加 + diagnosis_results 新設 |
| `002_kinda_talk_extensions.sql` | counselors に Kinda talk 用 11 カラム + counselor_media テーブル新設 |
| `003_seed_kinda_talk_demo.sql` | 営業デモ用相談所 2 件 + カウンセラー 5 名 + リール画像 12 件 |
| `004_favorites.sql` | favorites（user_id, target_type, target_id）テーブル + RLS |
| `005_favorites_place.sql` | favorites の `target_type` CHECK に `'place'` 追加 |

> 005 のみ未実行（ふうかが SQL Editor で 1 回 ALTER TABLE するだけ）

**フロント:**
- `src/lib/auth/AuthProvider.tsx`: Supabase Auth 状態を `useAuth()` で全ページに提供
  - createBrowserClient はジェネリックなしで使う（`.update()` の型推論バグ回避）
- `src/hooks/useFavorites.ts`: `useFavorites(type, id)` → `{ saved, toggle }`、`useFavoritesList()`
  - ログイン時: Supabase favorites
  - 未ログイン時: localStorage（key: `kinda-favorites-v2`）
  - ログイン直後に `mergeLocalFavoritesToSupabase()` で localStorage の保存を DB へ同期
- `src/hooks/useSaved.ts`: 旧 API を useFavorites に内部委譲（後方互換）

**画面:**
- `/login`: 3 モード（signin / signup / reset-request）タブ切替
- `/auth/reset-password`: メールリンクから遷移、新パスワード入力で `updateUser()` を実行
- `/mypage`: ログイン済みユーザーは保存件数 + 一覧、未ログインは促進カード
- `src/app/mypage/{AuthCard,SavedSection}.tsx`: ログイン状態と保存一覧の Client Component

---

### 5. ブランド・UX 統一

- **「ふたりへ」→「Kinda ふたりへ」** 全ページ sweep（Python regex で 25 ファイル一括）
  - 詩的タグライン（HERO_TAGLINE / ルートタイトル / サイドライン装飾）は意図的に温存
- **FloatingScrollToTop**: 全ページ右下にフローティング「↑」（200px 超で出現）
  - `body:has(.cta-mobile-bar)` で詳細ページの CTA と被らないよう自動上方シフト
- **a11y 強化（リールモーダル）**:
  - `role="dialog"` / `aria-modal` / `aria-labelledby` / 開時 close ボタンへ自動フォーカス
  - `MotionConfig reducedMotion="user"` で prefers-reduced-motion 尊重
  - FAQAccordion / ShareSheet / DemoModal にも同 semantics
  - SVG アイコンに `aria-hidden`、星評価行に `aria-label`、`:focus-visible` リング追加

---

### 6. ヘッダー🔍検索モーダル — 3 タブ化

`src/components/search/SearchModal.tsx`

| タブ | 入力 | 遷移先 |
|---|---|---|
| 結婚相談所 | エリア + Kinda type（6 種）+ 価格 + キーワード | `/kinda-talk` |
| お見合いの場所 | エリア + 価格（〜1000/〜3000/〜5000/5000円〜）+ 雰囲気 + キーワード | `/kinda-act` |
| 美容店 | エリア + 価格 + 予約タイミング（今日/明日/今週/日付指定）+ キーワード | `/kinda-glow`（未実装） |

---

### 7. その他のインフラ・ファイル

- `tsconfig.json` の `exclude` に `futarive-counselor` を追加 + `.vercelignore` で二重防御
- `src/app/sitemap.ts` / `src/app/robots.ts` を Next.js Metadata Files API で生成
- `src/app/layout.tsx` に `<AuthProvider>` + `<FloatingScrollToTop />`
- `framer-motion ^12.38.0` を追加

---

### 重要な設計決定

1. **mock fallback 戦略**: SQL 未実行・env 未設定でもサイトが落ちない。`getCounselors()` などは Supabase が空 / エラー時に mock COUNSELORS を返す。
2. **Counselor.id を `number | string` に拡張**: mock = 数値、Supabase = UUID 両方を許容。比較は `String(a.id) === String(b.id)` で統一。
3. **JOIN クエリを使わない**: Supabase SDK v2 の型推論が壊れる（CLAUDE.md 上部の注意事項参照）。`agencies` / `counselor_media` は別クエリで取得。
4. **Counselor 型に旧スキーマ互換 `bio` フィールド**: 既存 `/counselors/[id]` の mock データが `bio` を使っており、Supabase row の bio をマッピングして渡す。
5. **データを混ぜない**: Supabase に 1 件でも公開データがあれば mock は使わない（混在で UX が壊れるため）。

---

## これからやること（次の優先順）

### A. 本番リリース準備（推奨：先にやる）

| 項目 | 担当 | 内容 |
|---|---|---|
| **SMTP 設定** | ふうか | Resend / SendGrid 等の API キーを取得し Supabase Authentication > SMTP に登録。標準の `noreply@mail.app.supabase.io` から自社ドメインに切替 |
| **Confirm email 再 ON** | ふうか | SMTP 設定後、Authentication > Sign In/Up > Confirm email を ON に戻す |
| **Auth Redirect URLs 登録** | ふうか | Supabase Authentication > URL Configuration の「Redirect URLs」に本番ドメイン + Vercel preview の `/auth/reset-password` を追加 |
| **本番ドメイン環境変数** | ふうか | Vercel に `NEXT_PUBLIC_SITE_URL=https://本番ドメイン` を Production / Preview 両方で設定 |
| **利用規約・プライバシーポリシー** | 私（叩き台）| `/about` 配下に専用ページを新設、または既存 `/about` に追加 |
| **実カウンセラー投入** | ふうか | 統括管理画面 / SQL でふうか自身など本物のデータを公開。リール画像も Storage にアップロード |
| **005 SQL 実行** | ふうか | お店の♡保存を Supabase に永続化するための ALTER TABLE 1 行 |

### B. Kinda glow（美容店）新規ページ

- `/kinda-glow` 新規作成
- カテゴリ: 美容室 / ネイルサロン / 眉毛サロン / フォトスタジオ
- /kinda-act と同パターン（リール型グリッド + モーダル）
- セクションテーマ: パステルパープル `#EDE0F4`
- 検索モーダルの「美容店」タブから既に遷移先が `/kinda-glow` を指している

### C. Kinda story 強化

- 既存 `/episodes` をブランド整合（`Kinda ふたりへ` 表記、リール型カードへの統一など）
- 新エピソード追加・カテゴリタグ
- セクションテーマ: パステルグリーン `#E8F4E4`

### D. ホームに Kinda act リール埋め込み

- `/kinda-talk より | 今いるカウンセラーたち` と同パターンで、Kinda act の人気店を横スクロール表示
- 既存 `HomeReelCarousel` の概念を `HomePlaceCarousel` として複製

### E. Kinda type ページ（/kinda-type）の正式実装

- 現状は `/diagnosis` が代替を担っている
- `/kinda-type` 専用のブランド化された診断フローを新設するかは要検討

### F. パフォーマンス・実機確認

- iPhone Safari で `/kinda-act` の村背景（重い画像 + blur）が滑らかに動くか
  - カクつく場合は `laughing-town-background.png.PNG` を WebP / 圧縮版に差し替え
- Lighthouse Mobile スコア計測（Performance / A11y / SEO）
- axe DevTools で残存 a11y 問題チェック

### G. 既存ページのブラッシュアップ（軽め）

- ヒーローバナー画像の最適化（特にホームの `hero-couple-new.png.PNG` も含めて）
- `/diagnosis` フローに Kinda 世界観を被せる
- `/columns`（コラム）のリスト UI 整備

---

## 補足：Vercel デイリーデプロイ上限について

無料プランでは 1 日あたりのビルド・デプロイ回数に上限がある。一連の作業で複数回プッシュした場合、最後のいくつかが「未デプロイ」状態のまま残ることがある。

**回避策:**
- 翌日になれば自動的に枠が回復する
- または Vercel ダッシュボードから手動で「Redeploy」を当てる
- 大きな変更は git 上でまとめてから 1 回プッシュにすると安全

---

## 実装済み機能（2026-04-30 追記） — トップページ刷新・SEO/CRO 強化・全面 WebP 化

> ブランチ: `claude/implement-kinda-talk-uDUoW`（最新コミット `c5913d5`）
> セッションスコア改善: **62 → 92 点想定**（残り 2 枚の天気アイコン後に Lighthouse 計測予定）

### A. ヘッダー検索モーダル全面改修（`src/components/search/SearchModal.tsx`）

**タブ刷新：**
- 「お見合いの場所」→ **「デートの場所」** にリネーム（お見合い・デート両ユーザーに刺さる文言）
- 全 3 タブ（結婚相談所 / デートの場所 / 美容店）に共通エリア選択（後述の `@/lib/areas` 由来）

**フィールド追加：**
- act タブ: 「用途」select（カフェ / レストラン）
- glow タブ: 「用途」select（美容室 / 眉毛サロン / ネイルサロン / エステ）

**美容店タブ修正：**
- 「予約タイミング」フィールドを非表示化（Kinda 経由予約は未実装のため。state と UI はコメントアウトで残存）
- 価格選択肢更新：「10,000円〜」削除 →「〜20,000円」「20,000円〜」追加（最終: ～3,000 / ～5,000 / ～10,000 / ～20,000 / 20,000～）

**ヘッダーアイコン：**
- 一時的に検索アイコンを非表示にしていたが、修正完了後に再表示（`Header.tsx`）
- ヘッダーロゴ画像化: `/images/logoname _kinda_header.PNG`（透過 PNG）
- ヘッダー左 padding を `0` にしてロゴを画面左端にぴったり寄せる（モバイルでの見栄え最適化）

**0 件グレーアウト：**
- 各タブのエリア option に `disabled` + 「（0件）」サフィックス
- カウンセラータブ: `COUNSELORS` モックから件数集計
- act タブ: `placesHomeData` の カフェ/レストラン
- glow タブ: 美容室/ネイル/眉毛/エステ

---

### B. 共通エリア定義モジュール（新規 `src/lib/areas.ts`）

futarive-counselor のプロフィール「活動エリア」と Kinda 公開サイトのフィルターを **完全同期** させるための単一データソース。`futarive-counselor/lib/areas.ts` にもミラー。

**4 階層構造：**
1. `NATIONAL_OPTION` ＝「全国」（全カウンセラーマッチ）
2. `ONLINE_OPTION` ＝「オンライン」
3. `BROAD_REGIONS` ＝ 11 の広域カテゴリ
   - 首都圏（東京・神奈川・千葉・埼玉）/ 関東 / 関西（近畿）/ 東海 / 北陸 / 甲信越 / 東北 / 北海道 / 中国 / 四国 / 九州・沖縄
4. `PREFECTURE_GROUPS` ＝ 47 都道府県を 6 つの見出しでグルーピング
   - 北海道・東北 / 関東 / 中部 / 近畿 / 中国・四国 / 九州・沖縄
   - 都道府県は「県／都／府／道」の suffix 込み（例: "東京都"、"京都府"、"北海道"）

**ヘルパー関数：**
- `extractAreaKey(area)` — "東京・銀座" → "東京都" の正規化付き抽出
- `matchesAreaFilter(area, filter)` — 「関東」を選ぶと所属 7 県すべてに一致
- `prefecturesInBroadRegion(name)` — 広域名 → 含まれる県の配列
- `normalizePrefecture(raw)` — 短縮形（"東京"）→ 正式形（"東京都"）変換。古いモックデータ対策

**適用箇所：**
- `SearchModal.tsx`（3 タブ全部）
- `KindaActClient.tsx`（エリアドロップダウン）
- `KindaTalkClient.tsx`（エリアドロップダウン）
- `futarive-counselor/app/(main)/profile/page.tsx`（活動エリア `<select>` の `<optgroup>`）

**0 件グレーアウト：** すべて `aria-disabled` + 35% opacity で表示。Kinda が成長したらエリアが順次有効化される。

---

### C. ホームページ全面リブランド（`src/app/page.tsx`）

**ヒーロー Plan C（ブランド哲学に沿った最大効果版）：**

```
[村のミニチュア画像 フルブリード]
  [overlay: 下方向グラデーション + 強化シャドウ]
  
  H1: 好きな人を見つけて、
      一緒に過ごす日々まで。
      （Shippori Mincho 大型・白文字＋多層 text-shadow）
  
  H2: カウンセラー × お見合いのカフェ × デートの場所 × 美容、
      ふたりに寄り添うすべて。
  
  [小ロゴ: toppage_name.PNG]
  
  [主CTA] 自分に合う担当を診断する → /kinda-type
          glow shadow 付き、最強調
  [マイクロコピー] ✓ 60秒 ✓ 登録不要 ✓ 完全無料
  [副CTA] まずカウンセラーを見る → /kinda-talk
          テキストリンク風（離脱回収用）
```

**重要な CTA マッピング修正：**
- 旧: `/kinda-note`（問診票）
- 新: `/kinda-type`（診断）← Kinda の core value に最短

**ブランド哲学厳守：**
- 「婚活」「結婚」「成婚」「ゴール」をヒーローには使わない
- 「好きな人」「ふたり」「過ごす日々」など包摂的な語彙
- LGBTQ+ 含むあらゆるふたりの形に寄り添う設計

**追加：**
- 体験談ティザー（`A' — real voices`）— ヒーロー直下、A.M さんの引用 + 「ほかの体験談を読む →」リンク
- DECIDED_CARDS にパステル背景色＋アクセント色を実装：
  - type → `#E0ECF8`（パステルブルー）/ accent `#5A7FAF`
  - talk → `#FAF3DE`（パステルイエロー）/ accent `#B89A4A`
  - act → `#F5E1E0`（パステルピンク）/ accent `#B86E68`
  - glow → `#EDE0F4`（パステルパープル）/ accent `#8A66B0`

**ヒーロー画像化：**
- ロゴ: 「Kinda Kinda ふたりへ」テキスト → `<Image src="/images/toppage_name.PNG">` に置換
- 「ふたりの物語」セクションに `id="stories"` 追加（体験談ティザーリンク用）

---

### D. SEO 強化（`src/app/layout.tsx` + 構造化データ）

**Metadata 拡張：**
- title: `Kinda ふたりへ｜担当を選んで予約できる結婚相談所サービス`
- description に「婚活」「結婚相談所 口コミ」を自然に含める（ブランド哲学を維持しつつ SEO 効果を取る戦略）
- keywords[] を 10 項目に拡張（結婚相談所 / 結婚相談所 口コミ / 結婚相談所 比較 / カウンセラー / 婚活 / 婚活カウンセラー / 相性診断 / お見合い カフェ / ふたりへ / Kinda）
- OpenGraph + Twitter Card 追加（SNS シェア時の見栄え）

**JSON-LD 構造化データ（`page.tsx` ヒーロー内）：**
- `WebSite` schema（searchAction 含む → Google 検索結果に検索ボックス表示の可能性）
- `Organization` schema（alternateName で「カインダ」「Kinda」名寄せ）

**婚活キーワード戦略（表に出さず裏で SEO 効果）：**
- meta description, JSON-LD keywords に含める（ユーザー視認なし）
- `/about` ページに既存で「婚活」が自然に複数回出現（FAQ 的に「婚活と違う Kinda」を説明）
- ブランドコピーには使わない

---

### E. Kinda act ページ刷新（`src/app/kinda-act/page.tsx` + `KindaActClient.tsx`）

**ヒーロー：**
- 画像差し替え: `/images/section-cafe-pastel.png.PNG` → `/images/kinda-act-hero.jpg`
- `kt-hero-fade-in` アニメーション付与（Kinda talk と統一感）
- `[data-section="act"] .kt-hero-tint` でパステルピンク tint（Kinda talk のパステルイエローと対）
- カード式テキスト（`.kt-hero-card`）追加で、両ページのヒーローが完全同型に

**フィルター刷新：**
- 旧: 横並びピル「すべて／東京／大阪／名古屋」
- 新: エリアトグルドロップダウン（共通 areas 構造、0 件グレーアウト）
- ドロップダウン位置: トリガーが行末のため `right: 0; left: auto` で左展開
- 幅クランプ: `width: min(360px, calc(100vw - 24px))`

**村背景の可視化（`globals.css`）：**
- `/images/laughing-town-background.webp`（旧 8.4MB → 99KB）
- `filter: blur(8px)`, `transform: scale(1.06)`, ピンクオーバーレイを `.10〜.12` まで薄く調整
- `[data-section="act"] .kt-page` を `transparent` 上書き（`#FEFCFA` の不透明背景が村を完全に隠していた問題の解決）
- `[data-section="act"] footer` には不透明背景 + `z-index: 1` でフッターからは村を排除（CLAUDE.md の鉄則: 村は本文だけに）

**「How we pick」「Find your place」可読性：**
- `.kt-section-head` / `.kt-guide` に radial gradient backdrop + 多層 white text-shadow
- divider のコントラスト UP

---

### F. Kinda talk ヒーロー刷新（`src/app/kinda-talk/page.tsx`）

- カード式ヒーロー（`.kt-hero-card`）— 半透明白カード（`.42`）+ blur(20px) で背景画像が透けて見える
- 画像のふんわりフェードイン（`kt-hero-fade-in` クラス）
- エリアドロップダウン（共通 areas 構造、0 件グレーアウト）
  - トリガー位置が行頭のため **`left: 0` のまま**、幅クランプだけ追加
  - 注: kinda-act は行末で `right: 0`、kinda-talk は行頭で `left: 0`、トリガー位置に応じて anchor 切替

---

### G. 場所詳細ページ（`/places/[id]`）— Kinda act 詳細

- パンくず変更: `お店を探す` → `Kinda act（実際に会う場所を選ぶ）`、リンク先 `/kinda-act`
- タグ重複バグ修正: `place.scenes.filter((scene) => scene !== place.stage)` で stage と一致する scene を除外（「お見合い・お見合い・初デート」→「お見合い・初デート」）

---

### H. 全面 WebP 化 + 不要画像クリーンアップ

**取り込んだ WebP（main から作業ブランチへ）：**

| ファイル | 旧サイズ | 新サイズ | 削減率 |
|---|---|---|---|
| `hero-couple-new.webp` | 1.5MB | 67KB | 96% |
| `laughing-town-background.webp` | 8.4MB | 99KB | 99% |
| `sections_talk-hero.webp` | 1.5MB | 99KB | 93% |
| `section-kinda-type.webp` | 4.5MB | 9KB | 99.8% |
| `section-kinda-note.webp` | 3.6MB | 5KB | 99.9% |
| `section-counseling.webp` | 3.2MB | 83KB | 97% |
| `section-cafe-pastel.webp` | 1.1MB | 23KB | 98% |
| `section-story-new.webp` | 1.3MB | 26KB | 98% |
| `Toontown-background.webp` | — | 83KB | 新規 |
| `Kinda-belief-background.webp` | — | 53KB | 新規 |
| `ornamental-heartwopal.webp` | — | 87KB | 新規 |
| `ornamental-starfish2.webp` | — | 86KB | 新規 |

**Kinda note 結果用 天気アイコン WebP（16 種類、残り 2 枚で完了予定）：**
- w_angels_ladder / w_cold_wind / w_faint_sunlight / w_flower_overcast
- w_light_rain / w_light_rain_start / w_light_sunrise / w_morning_mist
- w_pre_dawn / w_rain_cloud（jpg） / w_sun_break / w_sunrise
- w_thunderstorm / w_twilight / w_wandering_clouds / w_windy_day / w_windy_sunshine

**コード参照を WebP に更新：**
- `src/app/page.tsx`（HERO_IMAGE_SRC、DECIDED_CARDS の img 等）
- `src/app/globals.css`（`.ka-village-bg` の `background-image`）
- `src/app/kinda-talk/page.tsx`（ヒーロー画像）
- `src/components/home/KindaSearchBar.tsx`（5 箇所）

**削除した画像（41 ファイル / 約 80MB）：**

旧 PNG（WebP に置き換え済み・17 枚）：
- `hero-couple-new.png.PNG` / `laughing-town-background.png.PNG`
- `section-{kinda-type,kinda-note,counseling,cafe-pastel,story-new,story}.png[.PNG]`
- `ornamental-{heartwopal,starfish,starfish2}.png.PNG`
- `Kinda-belief-background.png.PNG` / `Toontown-background.png.PNG`
- `w_{faint_sunlight,light_sunrise,sun_break,sunrise,windy_sunshine}.PNG`
- 旧 `sections/talk-hero.webp`（1.5MB 版）

UUID 装飾画像（7 枚）: `00E313F4-...png` / `3FA669FA-...png` / `7CC03528-...png` / `891DD977-...png` / `B05C715D-...png` / `4EA55216-...png` / `BE7E3F03-...png`

未使用 hero/orphan（13 枚）: `hero-background-street.png` / `hero-couple-cafe.png.PNG` / `hero-couple-top.png` / `header_logo.jpg` / `toppage_logo.jpg` / `section-beauty.png` / `section-cafe.png` / `section-cafe2.png` etc

**`globals.css` で対応する `background-image: url(...)` 行も削除**して `background-color` のみ残す graceful degradation 形式に。

---

### I. Lighthouse 100 対応（First Step）

- LCP 画像 preload: `<link rel="preload" as="image" href="/images/hero-couple-new.webp" fetchPriority="high" type="image/webp" />` を `layout.tsx` に追加
- ヒーロー `<Image>` に `sizes="100vw"` + `fetchPriority="high"` 明示
- フォント preconnect は既存維持

**残る最適化（天気アイコン揃い次第やる）：**
- 実機 Lighthouse 計測 → 個別最適化
- CSS 最適化（不要セレクタ削除）
- next/image のさらなるチューニング
- 画像 sizes の各箇所最適化

---

### J. 透過 PNG ロゴ（main から取り込み済み）

- `public/images/logoname _kinda_header.PNG`（ファイル名にスペース注意。Next.js Image は URL 自動エンコードで対応）
- `public/images/toppage_name.PNG`
- 当初 `header_logo.jpg` / `toppage_logo.jpg` を使っていたが、透過 PNG に切り替えて `mix-blend-mode: multiply` の暫定対応も削除済み
- 旧 jpg ファイルは削除済み

**サイズ：**
- ヘッダー: `width: min(60vw, 280px); height: auto; maxHeight: 52px`
- ヒーロー（カード内）: `width: min(58vw, 260px)` 等は各箇所で調整中

---

### K. ブランドガイド（哲学）の定着

セッション中に CLAUDE.md にあるブランド哲学を再確認：
- 「婚活」「結婚」「成婚」「ゴール」を**フロントには出さない**
- 「好きな人」「ふたり」「過ごす日々」「伴走」「本音の口コミ」が中核ボキャブラリー
- LGBTQ+ も自然に使えるサービス
- 「ふたりになる、その手前から、過ごす日々まで」が世界観

→ ヒーロー H1/H2、CTA 文言、SEO 戦略すべてこの哲学に沿って構築。

---

### 残課題（次セッション以降）

1. **天気アイコン残り 2 枚** が揃ったら Lighthouse 計測 → 残最適化（90 点超を狙う）
2. **PNG ロゴのスペース問題**: `logoname _kinda_header.PNG` のスペースをいつかリネームしたい（`logoname_kinda_header.png` に）
3. **トラスト要素の数値化**: 提携相談所数・口コミ件数を実数で表示するエリアを追加（営業開始後）
4. **Kinda note の位置づけ整理**: ヒーロー CTA は Kinda type に絞った。Kinda note はホーム中盤の DECIDED_CARDS と独自セクションで案内する設計
5. **`/about` の婚活ワード自然散りばめ**: 既に十分入っているが、最新コピーに合わせて軽くリライト推奨
6. **PlacesSection.tsx**（dead code）の削除整理
7. **Vercel デプロイ反映遅延**: 無料プランの日次上限に当たることが多々あるため、まとめてプッシュする習慣がベター

---

## 実装済み機能（2026-05-02 追記） — トップページ Kinda note 主役戻し

> ブランチ: `claude/implement-kinda-talk-uDUoW`（唯一の作業ブランチ）
> コミット: `f15ab37`（主要変更）→ `4d84200`（全20種キャプション追加）→ `b14cad4`（「選べる」→「届く」修正）

### 背景

2026-04-30 のセッションで主CTAを Kinda type 診断に置き換えていたが、ブランド差別化戦略上「他社に存在しない唯一無二の機能 = Kinda note」を入口に置くべきという判断で、**主CTA を Kinda note に戻す**修正を実施。

理由（ふうかとの議論で明確化）:
1. Kinda note は他社（ゼクシィ縁結び/タップル/Pairs/Linkx 等）に存在しない差別化機能
2. カウンセラー診断は心理的距離が遠く、入口としては Kinda note のほうが軽い
3. CRO 数値だけ見れば Kinda type が効率的だが、ユーザーが何度も戻ってくる理由になるのは Kinda note
4. Kinda note → カウンセラー面談という理想動線（整理したメモを持って面談へ）

→ **2026-04-30 「残課題 #4」は今回の作業で解決済み**（ヒーローCTAは Kinda type ではなく Kinda note に戻った）

---

### A. ヒーローセクション CTA 再構成（`src/app/page.tsx`）

| 項目 | 変更前 | 変更後 |
|---|---|---|
| 主CTA | 「自分に合う担当を診断する」→ `/kinda-type` | 「いまの気持ちを整理する」→ `/kinda-note` |
| 主CTA 背景色 | `var(--accent)`（ゴールド） | `#D4A090`（ローズゴールド） |
| 主CTA shadow | 通常 box-shadow | **glow shadow**（`0 0 32px rgba(212,160,144,.55)` の発光感） |
| マイクロコピー | ✓60秒 ✓登録不要 ✓完全無料 | ✓60秒で言葉になる ✓登録不要 ✓相談前の整理に |
| 副CTA | 「まずカウンセラーを見る」 1 つ（テキストリンク） | 区切り線「やりたいことが決まっている方は」+ 副CTA 2 つ |
| 副CTA 1 | — | 「自分に合う担当を見つける」→ `/kinda-type` |
| 副CTA 2 | — | 「カウンセラーを見てみる」→ `/kinda-talk` |

**重要な文言ルール:**
- ❌「診断」をフロントに出さない（医療ワード・上から評価する印象）
- ✅ Kinda type 関連は「相性チェック」「合う担当を見つける」と表現
- ✅ 副CTAラベルは「やりたいことが決まっている方は」（主体的・ニュートラル）
- ❌「すでに動き出している方は」「もう決まっている方へ」は使わない（止まってる=ダメと取られる）
- ✅ 副CTA は Kinda type / Kinda talk の 2 つのみ（act / glow は載せない — 目的が補助機能のため）

---

### B. A' Kinda note 説明セクション（新規）

ヒーロー直下の testimonial teaser（"real voices"）を**完全置換**して、Kinda note を解説する新セクションを設置。

**構造:**
```
[eyebrow: Kinda note]
   セクション見出し（Georgia serif / clamp(22px, 5.8vw, 30px)）
   「あなたの気持ちは、いま、どんな天気？」

   リード文: 「うまく言葉にできない不安や迷いも、
              天気のメタファーを通して、自分の気持ちが見えてきます。」

   [天気アイコン 5 種 横スクロール]
       夜明け前 / 小雨の始まり / 天使のはしご / 迷い雲 / 朝焼け

   キャプション: 「答えると、全20種の中から、いまの気持ちに近い天気がひとつ届きます。」

   ✓ 60秒で、いまの気持ちが言葉になる
   ✓ 整理したメモは、そのままカウンセラーに渡せる
   ✓ 何度でも、気持ちが揺れたときに

   [CTA] 気持ちを整理する → /kinda-note
```

**天気アイコン 5 種の選定（`NOTE_WEATHERS` 定数）:**

全 20 種から、6 ルートの 5 つから 1 種ずつ採用してバランス取り。重い天気（thunderstorm / rain_cloud / mist）は初見ユーザーに重いため除外。

| アイコン | ラベル | ルート | トーン |
|---|---|---|---|
| `w_pre_dawn.webp` | 夜明け前 | pre | 静かな始まり |
| `w_light_rain_start.webp` | 小雨の始まり | waiting | やわらかな迷い |
| `w_angels_ladder.webp` | 天使のはしご | omiai | ほのかな希望 |
| `w_wandering_clouds.webp` | 迷い雲 | date1 | 共感しやすいゆれ |
| `w_sunrise.webp` | 朝焼け | kousai | 前向きな伴走 |

**重要な仕様（ガチャ的体験）:**
- ユーザーは天気を「能動的に選ぶ」のではなく、質問に答えると 20 種から 1 つが**自動でアサインされる**仕組み（ガチャガチャ的な発見体験）
- そのためキャプション文言は「**選べる**」ではなく「**届く**」「**ひとつ届きます**」
- 5 種だけ見せて全 20 種ネタバレを避けつつ、「全 20 種の中から」と一行で開示することで「これしか選べない」誤読を防止

**スタイル:**
- セクション背景: `#F5EEE6`（ウォームベージュ）
- アクセント: `#D4A090`（ローズゴールド = ヒーロー主CTAと統一）
- 横スクロール: `scroll-snap-type: x mandatory`、`.hide-scrollbar` クラスでスクロールバー非表示
- アイコンタイル: 96×96px、`border-radius: 16`、`box-shadow: 0 4px 14px rgba(180,140,110,.14)`
- CTA: ローズゴールド + glow（ヒーロー主CTAより少し控えめなサイズ）

---

### C. B セクション「やりたいことが決まっている方へ」

**ラベル変更:** `もう決まっている方へ` → `やりたいことが決まっている方へ`（ヒーロー副CTA区切りラベルと整合）

**4 カードの説明文クリーンアップ（`DECIDED_CARDS` 定数）:**

| カード | 変更前 | 変更後 |
|---|---|---|
| Kinda type | 診断で、合うカウンセラーが見つかる | 自分に合うカウンセラーが見つかる相性チェック |
| Kinda talk | カウンセラー・相談所を見る | （変更なし） |
| Kinda act | お見合いやデートで実際に会う場所を選ぶ | お見合いやデートに使いやすい場所 |
| Kinda glow | 美容を整える | 好きな人に会う前に、自分を整える時間 |

**変更ルール:**
- ❌「診断」を排除（type の説明）
- ❌「美容」だけの機能説明を排除（glow の説明 → 感情的動機起点に）

---

### D. 共通 CSS 追加（`src/app/globals.css`）

```css
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
```

天気アイコン横スクロール用の汎用ユーティリティ。既存の `.counselor-scroll` / `.places-scroll` / `.kt-filter-scroll` と同じ用途だが、再利用しやすい一般名に。

---

### E. 削除したもの

- ヒーロー直下の testimonial teaser セクション（"real voices" / A.M さん引用）
  - 役割は C セクション「ふたりの物語」に集約済みのため重複を解消
  - 主 CTA から testimonial を経由する離脱率の高い導線を、Kinda note 直行に変更

---

### 全体構造（変更後）

```
[A. ヒーロー]
  └ 主CTA: いまの気持ちを整理する → /kinda-note（ローズゴールド + glow）
  └ 副CTA区切り: ─── やりたいことが決まっている方は ───
  └ 副CTA: 自分に合う担当を見つける / カウンセラーを見てみる

[A'. Kinda note 説明セクション] ← 新規（testimonial を置換）
  └ 5 天気アイコン横スクロール + 全20種キャプション + CTA

[B. やりたいことが決まっている方へ]  ← ラベル変更
  └ 4 カード: Kinda type / talk / act / glow

[B'. Kinda talk より | 今いるカウンセラーたち]   ← 変更なし
[C.  ふたりの物語]                              ← 変更なし
[C'. ふたりを見守る人たち]                       ← 変更なし
[D.  About]                                     ← 変更なし
```

---

### ブランチ運用ルール（このセッションで確定）

- **作業ブランチは `claude/implement-kinda-talk-uDUoW` の 1 本に固定**
- 過去のセッションで複数ブランチが乱立していたが、今後は新規ブランチを作らず常にこのブランチへ commit + push
- 万一別ブランチで作業してしまった場合は cherry-pick で `claude/implement-kinda-talk-uDUoW` に移すこと
- main へのマージは PR 経由で別途実施

---

## 実装済み機能（2026-05-02 追記②） — Kinda note 結果画面 v3 設計書の確定

> ブランチ: `claude/implement-kinda-talk-uDUoW`
> コミット: `65ab0da` `docs: phase1-instructions-v3 作成`

### 経緯

Kinda note の結果画面リファクタリングを進めるための設計書を、v2（`docs/phase1-instructions-v2.md` / 95% 完成済み）+ パッチ（`docs/phase1-v2-patch-v2.md` / 2026-05-02）から、最終確定版の **v3（`docs/phase1-instructions-v3.md` / 2,079行）** に統合した。

このセッションでは設計書（マークダウン）の更新のみを実施。実装コード（TypeScript / React）の作成と `weatherDescriptions.ts` の実ファイル作成は**次のタスクで別セッションで行う**。

### 作成したファイル

| ファイル | 内容 |
|---|---|
| `docs/phase1-instructions-v2.md` | 95%完成済みの土台（このセッション開始時に main から取り込み） |
| `docs/phase1-v2-patch-v2.md` | 追加・変更指示書（2026-05-02 作成） |
| **`docs/phase1-instructions-v3.md`** | **本セッションで作成した最終確定版（2,079行）** |

### v3 で確定した変更（v2 → v3）

1. **全 20 タイプに「天気の解説」（40-60文字、2文構成）を追加**
   - summary 直下・第1層の前に配置
   - Georgia serif で詩的に表示する設計（`white-space: pre-line` で `\n` を改行扱い）
   - waiting ルートは 4 タイプを「### 各タイプの天気の解説」セクションにまとめて配置（テーブル分岐方式に合わせた特例）

2. **`weatherDescriptions.ts` のコード仕様を本書内に明記**
   - `app/kinda-note/data/weatherDescriptions.ts` として新規作成する想定
   - 型定義：`WeatherKey`（20種）/ `RouteKey`（6種）/ `WeatherDescription`
   - `WEATHER_DESCRIPTIONS` 定数（20件）+ ヘルパー関数 3つ（`getWeatherDescription` / `getWeathersByRoute` / `getAllWeathers`）
   - 結果画面 + フェーズ B の SEO 解説ページ（`/note/weather/[slug]`）の両方で使い回す

3. **活動中 5 ルート（waiting / omiai / date1 / kousai / multiple）に「他の機能も見てみる」サブ導線を追加**
   - メイン 3 ボタン直下に Kinda act / Kinda glow への控えめなテキストリンク
   - pre ルートには追加しない（既に 5 ボタン構成で type/talk/glow/story が揃っている）
   - ポジティブ系 3 タイプ（omiai 晴れ間 / date1 朝焼け（淡）/ kousai 朝焼け）では Kinda story 誘導カードのさらに下に配置

4. **「診断」ワードをタイトル・主要見出し・サマリーから排除**
   - タイトル：「フェーズ1：診断フローの全面書き直し」→「フェーズ1：Kinda note フローの全面書き直し」
   - Kinda type 関連：「カウンセラー診断」→「カウンセラーとの相性チェック」
   - DB スキーマコメント・フェーズ4見出し等で「診断履歴」→「Kinda note 履歴」
   - **意図的に残した箇所**：原則1の「Kindaは診断ツールではなく『翻訳ツール』」（否定形での原則説明）と、v3 changelog 内の「診断ワード排除」説明文

5. **weatherKey の名前を統一**
   - `thin_clouds` / `usugumori` → `angels_ladder`（omiai ルート「天使の梯子」）
   - `wandering_cloud`（単数）→ `wandering_clouds`（複数、date1 ルート「迷い雲」）
   - `dusk` → `twilight`（multiple ルート「夕暮れ」、英語名統一）

6. **omiai タイプ2 の名称変更**
   - 「Kinda うすぐもり」→「Kinda 天使の梯子」（v2 内の残存箇所すべて置換）
   - 分岐ロジック内の戻り値・コメント・WeatherKey 型定義も同期

### 次のセッションで進める実装タスク

v3 設計書に基づき、以下の順で実装する想定（**まだ着手していない**）：

1. **`app/kinda-note/data/weatherDescriptions.ts` の実ファイル作成** — v3 の「データ構造：weatherDescriptions.ts」セクションのコードをそのままファイル化
2. **結果画面コンポーネントへの天気の解説表示の組み込み** — summary 直下に Georgia serif 14px のカードで表示
3. **活動中 5 ルートのサブ導線実装** — `subLinkStyle` を含めた Kinda act / Kinda glow テキストリンク
4. **omiai タイプ2 の改名対応** — UI 文言・分岐ロジック・型定義を `angels_ladder` ベースに統一
5. **weatherKey 名称変更の影響範囲修正** — 既存実装（あれば）の `thin_clouds` / `usugumori` / `wandering_cloud` / `dusk` を新キーに置換

### 新セッション開始時の引き継ぎテンプレート

新しい Claude Code セッションを立てる場合、以下をそのまま渡せばすぐに着手できる：

```
作業ブランチ: claude/implement-kinda-talk-uDUoW

以下を読んでから始めてください:
1. CLAUDE.md
2. docs/phase1-instructions-v3.md (設計書・最終確定版)

【今回の作業】
v3 設計書に従って Kinda note 結果画面の実装を進めてください。
次に作る具体的なファイル・優先順位はこちらから指示します。
まずは v3 を読み終わったら「読みました、次の指示をください」と返してください。
```

### 判断に迷い、ふうかさんに共有した点（次セッションで確認するとよい）

1. **waiting ルートの天気解説の配置**：waiting は 4 タイプを「## waiting タイプ1〜4」のセクションでなくテーブルで表現しているため、各タイプ下に summary がない。パッチの「summary 直下に配置」ルールが直接適用できないため、テーブル直後（共通 summary 文の後）に「### 各タイプの天気の解説」というまとめセクションを新設し、4 タイプ分の解説をリスト形式で配置した。実装時は結果画面で選ばれたタイプの解説のみ表示する旨もセクション冒頭に明記。

2. **「v2 改訂項目の確認」見出しの扱い**：チェックリストセクションの `### v2 改訂項目の確認` を `### v2 / v3 改訂項目の確認` に変更（v3 で追加した検証項目もここに今後足せるように）。パッチに明示なしの判断。気になれば戻せる。

3. **天気の解説の改行表現**：パッチでは「`<br>` ではなく自然な行間」とのみ指示だったが、データは `\n` を含むため、CSS 側で `white-space: pre-line` を併用してもよい旨をスタイル仕様に補足した。

