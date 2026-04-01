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
