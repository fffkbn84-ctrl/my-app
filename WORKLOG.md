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

## 作業ブランチルール（厳守・最優先）

> **このセクションのルールは、CLAUDE.md 内の他の場所に書かれた古いブランチ指定（「唯一の開発ブランチ」「作業ブランチ：xxx」など）よりも優先される。**
> 過去の実装記録セクションに登場するブランチ名は履歴情報であり、現在の作業ブランチ指定ではない。

### 許可されている作業ブランチ

| ブランチ | 用途 |
|---|---|
| `claude/implement-kinda-talk-uDUoW` | フロントサイト（`my-app/src/`）開発用 |
| `claude/fix-profile-creation-1clpG` | futarive-counselor（`my-app/futarive-counselor/`）開発用 |
| `integration/redesign-with-all-features` | futarive-admin（`my-app/futarive-admin/`）開発用 |
| `main` | マージ用（Claude が直接 push するのは禁止） |

### ルール

1. **commit / push はこの4ブランチ以外に行わない**
2. **`main` への直接 push は禁止**（Pull Request 経由でのマージのみ）
3. **新しいブランチを作る前に必ずユーザーに確認する**
4. **push する前に必ず `git branch --show-current` で現在のブランチを確認する**
5. ユーザーから明示的に別ブランチを指定された場合のみ、そのブランチで作業してよい

### Vercel デプロイとの連動

各 Vercel プロジェクトは Ignored Build Step で許可ブランチのみビルドする設定になっている：

| Vercel プロジェクト | ビルド対象ブランチ |
|---|---|
| `my-app-rp9u` | `main` / `claude/implement-kinda-talk-uDUoW` |
| `futarive-counselor` | `main` / `claude/fix-profile-creation-1clpG` |
| `futarive-admin` | `integration/redesign-with-all-features` |

許可リスト外のブランチに push してもデプロイは走らないが、不要な commit を増やさないため必ず指定ブランチで作業すること。

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

## 実装済み機能（2026-05-22 追記）

ブランチ：`claude/implement-kinda-talk-uDUoW`

### 1. Kinda note intro ページに clay 装飾画像を採用

- `kinda-note/page.tsx` の hero エリアに `kinda-note-deco-1.webp`（1254×1254、クレイ風ノート＋ペン＋カップ＋花）を採用
- 元のピンクグラデーション枠＋ハート SVG を撤去、画像 1 枚に置換
- `priority` 付与で LCP 対策、`sizes` でレスポンシブ
- CTA 直前にあった `kinda-note-deco-2.webp`（ハート手渡し）は、CTA を画面外に追いやる＆「1 分で終わる」の軽さを削ぐ理由で **配置せず保留**。アセット自体は `public/images/` に保全（`ab2040b` の方針踏襲）
- 関連：`0e8eb4a`（採用）／ `61f14a4`（deco-2 撤去）

### 2. ロゴ画像の webp 化と PNG 撤去（`ba6cfe2`）

main で生成済みの webp を uDUoW に取り込み、コード参照差替＆旧 PNG 削除。

| ファイル | 旧 | 新 | 削減 |
|---|---|---|---|
| ヘッダーロゴ | `logoname _kinda_header.PNG`（836KB） | `.webp`（67KB） | -92% |
| OG image | `toppage_name.PNG`（381KB） | `.webp`（39KB） | -90% |

合計 -1.17MB。ヘッダーは全ページで読み込まれるため、初回 LCP / モバイル回線への効果が大きい。コード差替箇所：

- `src/components/layout/Header.tsx:104`
- `src/app/columns/[slug]/page.tsx:137`

ファイル名のスペース（`logoname _kinda_header`）は動作上問題ないため踏襲。

### 3. 重複 .jpg 撤去（`b2b34d4`）

コード参照は webp のみだったため、`.jpg` 版を削除。

- `kinda-act-hero.jpg`（212K）→ 削除
- `section-beauty-n2.png.jpg`（171K）→ 削除

合計 -383KB。`section-beauty-n2.png.webp` の二重拡張子は将来リネーム候補。

### 4. `docs/image-audit.md` rev. 2 / rev. 3

- rev. 2：kinda-note-deco 配置 / ロゴ webp 化（main 側）/ オーファン誤検出修正（CSS 経路の grep 漏れ）/ 意図保全アセット節新設（`59af3e6`）
- rev. 3：本日の実コミット完了を反映、§7 優先タスク中 6 件中 4 件が ✅

旧 rev で `Kinda-voices-nouse` / `Toontown-background` / `laughing-town-background` をオーファン扱いしていたが、`globals.css` で参照されており現役だった。監査スクリプトを `src/` 全体（CSS 含む）に拡張。

### ハマったこと

- uDUoW の push が一度 403 で reject された（並行セッションが先に `f37ec0c` → `597fcda` → `ab2040b` を積んでいた）。`git pull --rebase` で取り込んで再 push、binary 衝突なし（同一 webp 追加だったため）
- WORKLOG.md の最新セクションが futarive-counselor 系で止まっていて、user-site Phase A の日々の作業ログが分離していた。次の作業ログは引き続き user-site セクションとして書く

### 次セッションの引き継ぎ

`docs/image-audit.md` §7 リリース前 must の残：

- [ ] #4 `not-found.tsx` 新設 + イラスト 1 枚（中、1h）
- [ ] #5 `KindaLoader` 新設 + Suspense fallback 5 箇所差替（中、1.5h）

優先タスクは **last_reviewed_at + 鮮度管理ダッシュボード（中）** に移行。詳細は `TODO.md` を参照。

---

## 2026-05-23 追記

ブランチ：`claude/implement-kinda-talk-uDUoW`（→ 後半で main へ force-push 統合）

### 1. 診断タイプ名のリブランディング（`f3c4c11`）

CLAUDE.md §3「相手を下に見る表現を避ける」「焦らせない・比較しない」との整合を取るため、`DIAGNOSIS_TYPES` の name / shortName / label / description を全タイプ書き換え：

- A: 慎重分析タイプ → **じっくり整理タイプ**（shortName: じっくり）
- B: 自信低下タイプ → **そっと整えるタイプ**（shortName: そっと）※ 一番の懸念だった
- C: 環境影響タイプ → **空気を感じるタイプ**（shortName: 空気派）
- D: 直感型 → **直感タイプ**（shortName: 直感、他タイプと表記揃え）

変えていないもの（意図的）：
- characteristics（あるある 5 項目）：共感を呼ぶ事実描写として優秀
- faqs：SEO ロングテール価値あり
- calculateResult ロジック・8 問の質問文と選択肢：タイプ判定精度に直結

伝播範囲：`DIAGNOSIS_TYPES` を参照するすべての画面（`/kinda-type/result`, `/kinda-talk` フィルタタブ, `KindaTypeBadge`, `SearchModal`, `Step3Form`, `Step4Confirm`）。

### 2. 4 タイプ別ミニチュアクレイ画像（`5d2358e`）

og:image 標準サイズ 1200×630 に center crop した webp 各 37〜45KB を `public/images/kinda-type/` に配置。CLAUDE.md §3「相手を下に見る表現を避ける」「LGBTQ+ 包摂」に従い、4 枚とも人物なし・シーンのみで構成。

### 3. result ページの SNS シェア対応（`51bb96a`）

`/kinda-type/result`：
- ヒーロー領域最上部に `next/image` でタイプ別ミニチュア画像（`priority` + `sizes` 設定で LCP 最適化）
- `generateMetadata` で og:image / twitter:image 追加
- JSON-LD Article に image フィールド（Google リッチカード対応）
- Twitter intent URL に `&url` パラメータ追加

`/kinda-note/result`：
- `metadata` → `generateMetadata` 化、weather searchParam を受け取って weather 別の og:image
- `ResultContent` で weather 確定後に `window.history.replaceState` で URL に weather 反映 → アドレスバーから URL コピー時にも og:image が正しく出る
- 「結果を SNS でシェア」ボタン新設（Web Share API → X intent フォールバック）
- 「相性チェックも試してみる」→「60 秒でぴったりのカウンセラーが見つかる」に CTA 文言変更

### 4. `deriveSiteUrl` ヘルパー（`7bb0ed4`）★重要

旧コードは `const SITE_URL = "https://kinda.futarive.jp"` でハードコードされていた。

**問題**：`kinda.futarive.jp` は Vercel 未登録ドメインで実在しない（後述）。シェアした tweet にこの URL が埋め込まれると Twitter のスクレイパーが DNS 解決失敗 → og:image 真っ白になっていた。

**修正**：両 result ページで `SITE_URL` を `headers()` から導出するヘルパー `deriveSiteUrl` に置換。preview / production / カスタムドメインそれぞれが自分自身を指す URL を返す。env var フォールバックは残し、localhost は除外。

### 5. uDUoW を main に force-push で統合 ★大手術

**経緯**：PR #4 を merge しようとしたら、Vercel の `mergeable_state: "dirty"`。`git merge-base main uDUoW` が空（=共通祖先なし）と判明。「unrelated histories」状態だった。

**原因**：main は 56 commits の「ファイルアップロード履歴」（GitHub web UI からのアセット upload + delete）が積まれていただけで、実コードは数か月前で停止していた。一方 uDUoW は 450 commits で全機能を実装してきた本筋ブランチ。両者は同じ repo でありながら共通祖先を持たない独立な歴史だった。

**判断**：uDUoW の 56 件の "ファイル操作 commit" は本質的に価値ゼロ（同じファイルは uDUoW 側にも全て存在）。普通の merge は不可能なため、`git push origin claude/implement-kinda-talk-uDUoW:main --force` で main を uDUoW の状態に置換。

**結果**：
- ✅ `my-app-rp9u`（production = main）が `7bb0ed4` で Deploy 成功
- ✅ `https://my-app-rp9u.vercel.app` で全新機能（リブランディング・画像・SNS）が稼働
- ✅ 旧 main（`11f27cf`）は rollback candidate として保存
- ✅ ローカル main も `git reset --hard origin/main` で同期済み

### 6. `.vercelignore` の罠 ★要注意

repo root の `.vercelignore` に以下が含まれる：

```
futarive-counselor
futarive-admin
```

これは **my-app の build がサブアプリの型エラーを拾わないために必要**（CLAUDE.md §6 の tsconfig exclude を超えて Next.js が拾うのを防ぐ）。

ただし副作用がある：futarive-counselor / futarive-admin の Vercel project が main から build しようとすると、同じ `.vercelignore` を読んで **自分自身の package.json も除外され**、`npm install` が ENOENT で失敗する。

→ サブアプリの main target build は構造的に失敗するが、後述のとおり**主戦場は別ブランチの preview なので無害**。

### 7. サブアプリの正しい運用パターン（user 確認・私の早とちり訂正）

**私の最初の誤読**：force-push 後にサブアプリの main 向け production build が ERROR になっているのを見て、「force-push でサブアプリを壊した」と報告した。

**user の訂正と正しい理解**：
- futarive-counselor は **`claude/fix-profile-creation-1clpG`** の preview URL を実質 production として運用
- futarive-admin は **`claude/futarive-admin-dashboard-iKBfw`** の preview URL を実質 production として運用
- 各 Vercel project は Ignored Build Step で feature branch も build 対象に含めている
- main target の build は形式上存在するだけで実際は使われていない → ERROR で構わない

調査ログ：futarive-counselor の production target build は force-push 前から ERROR が連続していた（5/22 の `04556c3`〜`d29661c`〜`11f27cf` 全て ERROR）。force-push が破壊した訳ではなく、元々機能していなかった。

→ **今回の force-push の影響範囲は `my-app-rp9u` のみ**。他 2 プロジェクトは元の運用のまま無傷。

### 8. `kinda.futarive.jp` の正体

このドメインは **Vercel project に未登録 = 実在しないドメイン**。`my-app-rp9u` の `domains` は以下のみ：
- `my-app-rp9u.vercel.app`
- `my-app-rp9u-fffkbn84-4095s-projects.vercel.app`
- `my-app-rp9u-git-main-fffkbn84-4095s-projects.vercel.app`

過去のコードがハードコードしていたのは「将来取得予定の願望ドメイン」で、機能していなかった。本物の production URL は `https://my-app-rp9u.vercel.app`。

将来 `futarive.jp` を取得して `kinda.futarive.jp` を生かすには：
1. Vercel project (my-app-rp9u) → Settings → Domains → Add `kinda.futarive.jp`
2. レジストラ側で DNS CNAME を Vercel 指定の値に設定
3. 反映に数分〜数時間

### ハマったこと / 学び

- main の git 履歴を見ずに「PR を merge する」と判断したら「unrelated histories」で詰んだ。**merge 前に `git merge-base` で共通祖先の有無を確認**するのが正解。
- 「production が壊れた」と判断する前に「そもそも production target を運用に使っているのか」を user に確認すべきだった。Vercel ダッシュボード上の「production」と実運用の「production」が乖離している multi-project repo では特に。
- `.vercelignore` は全 Vercel project が repo root から同じものを読む。multi-project の場合は project-specific な仕組み（project の Root Directory 設定など）と組み合わせる必要がある。

### 次セッションへの引き継ぎ

**運用方針の決定が必要**：

- [ ] futarive-counselor / futarive-admin の運用を「feature branch preview 据え置き」のまま続けるか、「main 統合の標準フロー」に揃えるか
  - 据え置きの場合：`.vercelignore` の現状でも問題ないが、main 上でサブアプリのコードが古いまま放置される
  - 標準化する場合：`.vercelignore` 戦略の再設計（root vs project-specific Root Directory）が必要
- [ ] WORKLOG.md / CLAUDE.md のブランチ運用表に齟齬あり：
  - WORKLOG.md 旧記述：admin = `integration/redesign-with-all-features`
  - 実態：admin = `claude/futarive-admin-dashboard-iKBfw`
  - どちらが現行か要確認、ドキュメント整備
- [ ] PR #4 は手動 close 推奨（base = head になり diff ゼロ）
- [ ] PR #2（counselor 用、open）は merge するか別途検討
- [ ] `futarive.jp` ドメインの取得タイミング・サブドメイン構成の決定

**完了済（記録）**：

- [x] CLAUDE.md §3 整合のためのタイプ名リブランディング
- [x] /kinda-type/result のミニチュア画像 + og:image
- [x] /kinda-note/result の SNS シェア対応
- [x] `deriveSiteUrl` ヘルパー導入（SITE_URL ハードコード排除）
- [x] uDUoW → main 統合（force-push）
- [x] production deploy 確認（`https://my-app-rp9u.vercel.app`）

---

## 2026-05-23 続き（深夜セッション）

ブランチ：`claude/monorepo-deployment-strategy-dzAgF`（main 同期済み）

前セッション引き継ぎメモ #1（サブアプリ運用方針決定）に対応。三択 A/B/C の代わりに**第三の道**として「**feature branch を Production Branch に昇格**」する選択で counselor を運用変更。admin は手付かず（user 一人運用なので preview のままで実害なし）。

### 1. 現状調査で判明したこと

- 「production target build が ERROR」は壊れているのではなく、Ignored Build Step + `.vercelignore` の組み合わせで起きる**設計上の副作用**
- futarive-counselor は Root Directory が `futarive-counselor` に設定済みだが、`.vercelignore` がそのディレクトリを削除するため main からの build は必ず ENOENT で死ぬ（build log で確定）
- futarive-admin は Root Directory が未設定（`.` のまま推定）で、main からは my-app の build を走らせて Next.js 16 で落ちている
- いずれも「壊れてる」のではなく「main は使わず feature branch の preview を実体 production として運用している」状態

### 2. counselor の Production Branch 切替

Vercel project `futarive-counselor` の設定変更（ダッシュボード経由、user 操作）：

- **Production Branch**: `main` → `claude/fix-profile-creation-1clpG`
- **Deployment Protection (Vercel Authentication / Require Log In)**: 有効 → **Disabled**
- **Password Protection**: Disabled のまま（無変更）

切替後、trigger 用空コミット `c629995` を `claude/fix-profile-creation-1clpG` に push → 約 52 秒で deploy 完了（`dpl_J3sujdo4oVZJRaBqoThYy6GpxUGe`、state=READY、target=production）。

### 3. 確定した新 URL

`futarive-counselor` プロジェクトの新しい production aliases：

- `https://futarive-counselor.vercel.app/` ★ 外部案内用の正規 URL
- `https://futarive-counselor-fffkbn84-4095s-projects.vercel.app/`
- `https://futarive-counselor-git-claude-fi-fc6d5e-fffkbn84-4095s-projects.vercel.app/`（branch alias）

iPhone Safari **プライベートモード**で未認証アクセス確認：Vercel SSO は出ず、アプリ独自の Supabase Auth ログイン画面（「Kinda・ふたりへ COUNSELOR ADMIN」）まで素直に到達する。**外部のカウンセラーに案内可能な状態**になった。

### 4. なぜ "main 統合" を選ばなかったか

引き継ぎメモでは A（現状維持）/ B（main 統合）/ C（repo 分離）の三択だったが、調査の結果：

- B（main 統合）は `.vercelignore` を削除して tsconfig の exclude に置き換える設計変更を要する。my-app の build が壊れるリスクあり、検証コストも高い
- 「Production Branch 切替」は Vercel ダッシュボードの 2 クリックで完結、コード変更ゼロ、ロールバックも 2 クリック
- counselor チームが既に `claude/fix-profile-creation-1clpG` で長く運用してきた実績を尊重できる
- 結果として A と B の中間にある第三の道。引き継ぎメモには無かった選択肢

### 5. admin について（今回は手付かず）

futarive-admin は **user 一人運用 + カスタムドメイン不要**のため、今回は変更なし。preview URL のままで実害なし。将来複数人で使うようになったタイミングで counselor と同じ手順（Production Branch 切替 + Deployment Protection Disabled）を実施する想定。

### ハマったこと / 学び

- 私の初動の誤読：ERROR を見て「壊れてる」と判定し、`.vercelignore` 全面リファクタを推した。user の指摘で「ERROR は設計通り、実体は feature branch 運用」と気づき方針転換
- WebFetch が `*.vercel.app` の production URL に対して 403 を返した。Deployment Protection は無効だったので、Vercel CDN の bot 対策と判断。実機シークレットモードでの検証が確実
- 三択（A/B/C）に縛られず「Vercel project ごとに Production Branch を独立に設定できる」という Vercel の仕様を活かす第三の道があった

### 次セッションへの引き継ぎ

- [ ] PR #4（uDUoW → main, base=head で diff ゼロ）の手動 close
- [ ] PR #2（counselor 用、open）の merge 可否判断
- [ ] `futarive.jp` ドメイン取得タイミング決定
- [ ] futarive-admin も将来複数人運用になったら今回の手順を踏襲

### 私のもう一つのミス（学習用に記録）

セッション末盤で「利用規約の作業ブランチ」を user に案内する際、古い WORKLOG 内に残っていた「`claude/implement-kinda-talk-uDUoW` = user-site 作業」を引いてしまい、user から「利用規約の作業場所は main じゃないの？」と正しく指摘された。

正解：force-push で main = uDUoW になった 2026-05-23 以降、`claude/implement-kinda-talk-uDUoW` は歴史的経緯ブランチ。新規作業は **main から派生した short-lived feature branch → PR → main** が筋。

**対策（このセッション内で実施済）**: CLAUDE.md に §10「ブランチ運用」を新設して現行スナップショットを明示。TODO.md にも「セッション開始時は CLAUDE.md §10 を最初に確認」を明記。これで未来の Claude が同じミスを繰り返さない構造にした。

### ドキュメントの main 集約（A 案実施）

このセッションで生成した WORKLOG / TODO / CLAUDE.md の更新を、`claude/monorepo-deployment-strategy-dzAgF` ブランチから main に直接 push して取り込んだ（ドキュメント変更のみ・機能コード変更なしの軽い変更のため、PR 経由ではなく直接 push を選択）。

以降、CLAUDE.md / TODO.md / WORKLOG.md は **main を source of truth** として運用する。

---

## 2026-05-23 追記（Phase C 法務ドキュメントレビュー）

### 概要

Phase C（法務・契約）の第一弾として、`/terms`（利用規約）・`/privacy`（プライバシーポリシー）・`/tokushou`（特定商取引法に基づく表記）の 3 ページを内容レビュー・条項補強。実値（会社名・所在地・電話番号・代表者氏名・サポートメール）は user 判断によりプレースホルダ保留。

作業ブランチ：`claude/phase-c-legal-docs-cRaur`（main から派生・PR 経由で main にマージする想定）。

### 1. `/terms` 利用規約

- 第3条（規約の同意・変更）を**民法第548条の4 定型約款の不利益変更ルール**に沿って書き直し。「軽微な変更／重要な変更」を分離。重要変更は 30 日前事前通知方式。
- 第4条（アカウント登録）に認証情報の管理責任、アカウント停止条件を具体化。長期未使用（2 年）アカウントの停止条項を新設。
- **第5条（退会・アカウントの削除）を新設**。退会後の口コミは匿名化のうえ存続する旨を明示。
- 第6条（禁止事項）を補強。スクレイピング・なりすまし・営業妨害目的投稿等を追記。
- 第7条（口コミ・コンテンツの取り扱い）に**著作者人格権の不行使**特約と**コンテンツ利用許諾の範囲明確化**（複製・公衆送信・翻案・編集・要約・翻訳・無償非独占）を追加。
- **第11条（当社からの通知・連絡）を新設**。取引関係通知と**マーケティング通知のオプトイン**を分離し、特定電子メール法対応の根拠を明示。
- 第12条（サービスの変更・停止）に**30 日前告知努力義務**を追加。
- 第13条（免責事項）に外部サービス（Supabase / Vercel / 決済）の障害も含めて明示。
- **第14条（損害賠償の制限）を新設**。直接損害限定 + 損害額上限（無料サービスは 1,000 円）。消費者契約法の上書きを明示。
- **第16条（反社会的勢力の排除）を新設**。営業前提で BtoB 取引時に求められやすい。
- **第17条（権利義務の譲渡禁止）を新設**。事業譲渡時のユーザー情報承継について事前同意を取得。
- **第18条（分離可能性）を新設**。

### 2. `/privacy` プライバシーポリシー

- 改正個人情報保護法（2022 年 4 月）の文言・構成に揃える。
- 第2章（利用目的）に**マーケティング通知はオプトイン基盤**である旨を明示。「目的の範囲」表記を導入。
- 第3章（第三者提供）を改正個情法第27条の規定順序に揃える（公衆衛生・国の機関への協力等の例外列挙）。
- **第5章「外国にある第三者への個人データの提供」を新設**（改正個情法第28条対応）。Supabase / Vercel / Google が米国法人であることを明示。
- 第6章（Cookie）に Google Analytics オプトアウトアドオンへのリンクを追加。
- 第8章（開示等の請求）を新設し、本人確認方法・手数料・拒否事由を明示（改正個情法第33条以下対応）。
- 第9章（未成年者）を「18 歳以上」に変更（成年年齢引き下げ対応）。
- **第10章「個人情報の保有期間」を新設**。退会後の取り扱い（利用規約第7条との接続）も明示。

### 3. `/tokushou` 特定商取引法に基づく表記

- 所在地・電話番号欄に**「請求があれば、遅滞なく開示します」**の文言を追加。これにより、実値がプレースホルダのままでも消費者庁ガイドラインに沿った形が成立する（個人事業主・小規模事業者の標準対応）。
- 「お支払い時期」「お問い合わせ窓口」「特別条件」項目を追加し、消費者庁ガイドラインの推奨項目順に整理。
- ページ末尾に利用規約・プライバシーポリシーへの相互リンクを追加。

### 4. 補助変更

- `globals.css` に `.legal-ol-sub`（lower-roman の入れ子リスト）スタイル追加。terms の `民法548条の4` 2項箇条書きで使用。
- `sitemap.ts` に `/terms` `/privacy` `/tokushou` を低優先度（0.3、yearly）で追加（各ページは indexable に設定済）。

### プレースホルダの残置

以下は user 判断（2026-05-23）により実値差替を保留。法人設立後に sed 一発で置換できるよう統一表記：

| 場所 | プレースホルダ |
|---|---|
| terms / privacy / tokushou | `[会社名]` |
| privacy / tokushou | `[所在地]` |
| privacy | `[氏名]`（個人情報保護管理者） |
| tokushou | `[代表者氏名]` |
| tokushou | `[電話番号]` |

サポートメール `hello@kinda-futari.app` は Phase D（ドメイン整備）と合わせて再検討する保留案件。

### 動作確認

- `npx tsc --noEmit` グリーン
- `npx eslint src/app/{terms,privacy,tokushou} src/app/sitemap.ts` グリーン
- Vercel プレビュー上の視覚確認は次回 push 後（実機 Safari で各ページの段落・入れ子リストレンダリングを確認すること）

### 次セッションへの引き継ぎ

- 営業準備（メーリングリスト送信）のための**特定電子メール法対応**：terms 第11条・privacy 第2章でマーケティング通知のオプトイン基盤を明示済。実運用ではアカウント登録 UI に「マーケティングメールを受け取る」チェックボックスを追加し、デフォルト OFF にすること（次回 UI 改修タスク）。
- 法人設立 or 個人事業主屋号確定後、プレースホルダ実値差替を 1 コミットで実施。
- 顧問弁護士レビューを受ける場合、本コミット内容を起点に添削してもらうのが最短。

---

## 2026-05-23 追記（Phase C 第二弾：counselor 法務 + ユーザー UI 整備・即時 main マージ運用）

### 概要

同 2026-05-23 セッション継続。Phase C の残作業を 3 PR でまとめて完了。user が「都度マージしてよい」と判断したため、PR 単位で main / counselor production branch にマージしてプレビュー → 本番反映までを一気に進めた。

### PR 一覧

| # | branch | base | 内容 |
|---|---|---|---|
| #6 | `claude/phase-c-legal-docs-cRaur` | `main` | my-app 法務 3 ページの条項補強（前述） |
| #7 | `claude/phase-c-counselor-legal-docs-cRaur` | `claude/fix-profile-creation-1clpG` | counselor 法務 2 ページ新設 |
| #8 | `claude/phase-c-marketing-optin-cRaur` | `main` | signup マーケティングオプトイン UI |

すべて squash merge で取り込み済。

### PR #7：counselor 利用規約・プライバシーポリシー新設

`futarive-counselor` 側に法務ページが未整備だったため新設。**user 質問の核心「プロフィール更新リマインダー（90 日鮮度管理）の送信法的根拠」に直接対応**。

主なポイント：

- **terms 第8条 / privacy §3**：「業務上の通知」を定義し、特定電子メール法第2条第2号「営業上の広告又は宣伝」に該当しない取引上の通知として、利用者の事前同意なく送信できる根拠を明示。プロフィール更新リマインダー・予約成立通知・口コミ通知・料金請求・規約変更・システム通知を網羅。
- **terms 第7条「プロフィール情報の公開・更新義務・鮮度管理」**：90 日経過 → リマインダー送信 → 督促後も更新なし → 公開プラットフォーム非公開化、までの一連の運用を規約レベルで明示。`supabase/functions/notify-stale-profiles` Edge Function を法的根拠を持って稼働させられる状態に。
- **第6条「利用料金・送客手数料」**：¥5,000/件・初期費用無料・遅延損害金 14.6%・支払遅滞時の停止権を規定。
- **第12条「エンドユーザー情報の取り扱い・守秘義務」**：カウンセラー側にも個情法遵守義務を課す。
- 第1条で「事業者向けサービスのため消費者契約法の適用対象外」を明示（B2B 契約として設計）。
- 損害賠償の制限：無料利用者は上限 10,000 円。
- 反社条項 / 越境第三者提供 / 著作者人格権不行使 等の標準条項。

補助：
- `app/claim/ClaimContent.tsx` の「利用規約に同意」文言をリンク化、業務上通知の受領が必要な旨を補足。
- `components/shell/Sidebar.tsx` のフッターに利用規約・プライバシーへのリンクを追加。
- `app/globals.css` に `kc-legal-*` スタイル一式（既存ゴールド系トークン準拠）。

### PR #8：マーケティングメールのオプトイン UI

terms 第11条・privacy §2 の「マーケティング通知は事前同意ベース」基盤に対応する UI を実装。

- `LoginForm.tsx` signup mode にチェックボックス追加。**デフォルト OFF**。
- `supabase.auth.signUp()` の `options.data` 経由で `user_metadata` に保存：
  - `marketing_emails_opt_in: boolean`
  - `marketing_emails_consented_at: ISO 8601 string | null`
- マイページ「アカウント設定」展開内にメール配信トグルを追加。`supabase.auth.updateUser({ data: {...} })` で即時保存。
- 「予約完了等の重要な連絡は本設定にかかわらず送信」の補足文を signup / mypage 両画面に明示。
- 既存 signup 画面下「利用規約・プライバシーポリシー」リンクが `/about` を指していた誤りを `/terms` `/privacy` に修正（incidental fix）。

### 配信実装時の注意（Phase D で対応予定）

- 配信開始時：`user_metadata.marketing_emails_opt_in = true` のユーザーにのみ送信
- メール本文末尾に**配信停止リンク**を必ず付与（特電法 第4条）
- 配信停止リンクは `marketing_emails_opt_in = false` に書き戻す API として実装

### ブランチ運用の学び

- counselor 側変更は base = `claude/fix-profile-creation-1clpG`（CLAUDE.md §10 通り）の PR で進めた。GitHub UI で base を切り替えるだけで対応できた。
- ローカル `main` が古い別ラインに乗っていたため `git pull` が拒否された。`git fetch` 後に `origin/main` から直接ブランチを派生させる運用が安全。
- 都度 squash merge で進めたため履歴は綺麗。3 PR の関係性：#6（基盤）→ #7（B2B 同水準）→ #8（基盤への UI 実装）。

---

## 2026-05-23 追記（Phase C 第三弾・クローズ：UI 品質・明示同意・業界調査に基づく設計確定）

### 概要

Phase C 第二弾の後、user が実機で動作確認した結果、いくつかの UI ギャップが発覚し対応。さらに「相談所オーナーとカウンセラー個人の登録経路はどうあるべきか」という根本設計判断を業界調査を踏まえて確定した。最終的に Phase C をクローズ。

### 完了 PR 一覧（本セッション後半）

| # | base | 内容 |
|---|---|---|
| #10 | `claude/fix-profile-creation-1clpG` | counselor middleware の PUBLIC_PATHS に `/terms` `/privacy` 追加 |
| #11 | `claude/fix-profile-creation-1clpG` | counselor モバイル TopBar にハンバーガーメニュー + ドロワー |
| #12 | `main` | my-app signup の明示的規約同意チェックボックス必須化 |
| #13 | `claude/fix-profile-creation-1clpG` | counselor claim の明示的規約同意チェックボックス必須化 |
| #14 | `claude/fix-profile-creation-1clpG` | counselor 規約に SNS 抜け駆け禁止 + オーナー監督責任を追記 |
| #15 | `main` | 結婚相談所オーナー向け送客契約書テンプレート `docs/contracts/agency-agreement.md` 作成 |
| #16 | `claude/futarive-admin-dashboard-iKBfw` | admin に「相談所＋オーナー一括作成」UI 追加 |
| #17 | `main` | 本ドキュメント更新（Phase C クローズ宣言）|

### 設定変更（user 操作）

- **futarive-counselor の Vercel Ignored Build Step を修正**：Production Branch 切替時に古い設定（`main|claude/fix-profile-creation-1clpG` build 許可）が残っていたため、main への push のたびに futarive-counselor が ENOENT エラーで build 失敗していた。`claude/fix-profile-creation-1clpG` のみ build 許可に絞り込み修正済。

### 根本設計判断：オーナー / カウンセラー登録経路（重要・誤認回避のため記録）

#### 業界調査の結論（要約）

| サービス | オーナー登録 | スタッフ登録 |
|---|---|---|
| ホットペッパービューティー | 営業 → 書面契約 → 営業が ID 発行（Web セルフ無し）| 個別ログイン無し（店舗 1 アカウント内のプロフィールレコード）|
| 食べログ | 無料は Web、有料は営業経由 | 個別ログイン無し |
| エキテン | Web セルフ → 審査 → ID 発行 | 個別ログイン無し |
| IBJ | 問い合わせ → 面談 → 書面契約 → 加盟金 → ID 発行 | 大半オーナー兼任 |
| **BIU**（最も Kinda 寄り）| 問い合わせ → 書面契約 → ID 発行 | オーナーが追加カウンセラー無料招待可 |
| SaaS 一般 | 自己 signup | オーナーが招待リンクで追加 |

業界全体の共通パターン：
1. **オーナー本人を Web セルフ signup させるサービスはほぼ無い**（HPB / IBJ / BIU / 食べログ有料プラン）。書面 or 電子契約 → 運営が手動 ID 発行が業界標準。
2. **「スタッフ個別ログイン」は Kinda コア（カウンセラー個人を口コミで選ぶ）にとって必須**。HPB 型「店舗 1 アカウント＋スタッフはプロフィール」だと、Kinda のコア体験が崩れる。
3. **BIU が最も近いベンチマーク**：書面契約 → オーナーアカウント発行 → オーナーが配下仲人を無料招待。

#### user 質問への明確な答え（重要・誤認回避）

> 「相談所オーナーも会員登録時規約系の同意必須、招待リンクからきたカウンセラー個人も規約同意必須という認識で合っていますか？」

**実装の真実**：
- counselor 側の新規登録経路は **`/claim?token=...` の 1 つだけ**
- `/auth/login` ページは**ログイン専用**（signup フォーム無し）
- `agencies` テーブルには `invite_token` カラム自体存在しない（オーナー専用招待リンクは未実装かつ未予定）
- 相談所オーナー本人も「最初の counselors レコード」として claim 経由で登録される設計

**結論**：相談所オーナーもカウンセラー個人も**同じ `/claim` 入り口**を共有しているため、PR #13 でその唯一の入り口に必須同意化を実装したことで**両者カバー済**。

#### 採用設計：ハイブリッド型（BIU + SaaS 寄せ）

```
[私（運営）]
   │ ① 書面/電子契約（docs/contracts/agency-agreement.md・送客料 ¥5,000/件）
   ▼
[オーナー]
   │ ② 私が futarive-admin から「新規相談所＋オーナー招待」モーダル（PR #16）：
   │    - agencies INSERT
   │    - counselors にオーナー本人レコード INSERT（owner_user_id=null + invite_token 発行）
   │    - 招待 URL を表示・コピー → オーナーへメール送付
   ▼
[/claim?token=...]
   │ ③ オーナーが明示的規約同意（必須・PR #13）→ signup
   │ ④ 私が Supabase Dashboard で agencies.owner_user_id をオーナーの auth.uid() にセット
   │    （将来 admin UI 化予定）
   ▼
[オーナーがログイン後]
   │ ⑤ 配下カウンセラーを招待する場合：
   │    オーナー自身が counselors レコードを作成 → invite_token 発行 → 配下へ送付
   │    （将来 counselor 側に UI 実装予定）
   ▼
[配下カウンセラー]
   │ ⑥ 同じ /claim 経由で明示的規約同意（必須）→ signup
```

#### この設計の根拠

| 観点 | HPB 型に変更した場合 | 採用：ハイブリッド型 |
|---|---|---|
| Kinda コア「個人を口コミで選ぶ」| ❌ 崩れる | ✅ 成立 |
| 鮮度管理リマインダーが本人に届く | ❌ 店舗代表メールに集約 | ✅ カウンセラー本人に届く |
| 口コミ返信が本人の声 | ❌ 代理応答（声が消える）| ✅ 本人 |
| 契約相手の明確さ | ✅ 相談所 | ✅ オーナー（agency 代表）|
| 経理・請求 | ✅ 相談所単位 | ✅ 相談所単位（同じ）|
| 抜け駆け防止 | ⚠️ 規約頼み | ⚠️ 規約頼み（同じ。PR #14 で強化）|
| 小規模 1 人運営対応 | ✅ シンプル | ✅ 同じ（1 アカウント完結）|
| 既存実装の作り直し | ❌ 大幅 | ✅ ゼロ |
| 業界ベンチマーク | HPB（美容業）| BIU（結婚相談所業）|

### 抜け駆けリスクへの対策（PR #14）

カウンセラーが個人 SNS で集客 → Kinda 経由しない予約に流すリスクは、どんなシステムでも物理的には防げない。規約 + 契約 + 経済設計で抑止する：

- **規約第6条第6項**（PR #14）：送客手数料回避目的の本サービス外チャネル誘導を禁止 + 違反時は送客手数料相当額の支払い請求 + 利用契約解除
- **規約第9条**（PR #14）：SNS / 個別 DM / 電話等への面談誘導禁止、自己 SNS で本サービス非経由予約を勧奨する表示禁止
- **規約第12条の2**（PR #14）：オーナーの監督責任 + 連帯責任（相当な注意で免責）
- **契約書 第6条第5項 / 第10条**（PR #15）：上記を契約レベルでも明文化
- **送客手数料の発生条件 = 面談完了**：Kinda 経由予約のみ手数料発生（業界標準）
- **将来モニタリング**（Phase E 以降）：プロフィール更新頻度・口コミ件数が同規模の平均より極端に低い相談所をアラート

### Phase C クローズ判定

| 領域 | 状態 |
|---|---|
| 利用規約（my-app / counselor 双方）| ✅ 条項補強 / 反社条項 / 損害賠償の制限 / マーケ opt-in 基盤 / 業務通知の送信根拠 / SNS 抜け駆け禁止 / オーナー監督責任を完備 |
| プライバシーポリシー（my-app / counselor 双方）| ✅ 改正個情法 (2022/4) 対応・越境第三者提供・開示請求手続を完備 |
| 特商法表記（my-app）| ✅ 「請求があれば遅滞なく開示」文言で実値プレースホルダ状態でも形成立 |
| 規約同意 UI（必須チェックボックス）| ✅ my-app signup / counselor claim 両方で明示的同意・証跡保存（`terms_accepted_at` / `privacy_accepted_at`）|
| マーケティングメール同意 UI（任意）| ✅ my-app signup + マイページトグルで取得・撤回可能 |
| 法務ページへのモバイル UI 導線（counselor）| ✅ TopBar ハンバーガーメニュー |
| 未ログインでの規約閲覧可能性（counselor）| ✅ middleware PUBLIC_PATHS で許可 |
| 送客契約書テンプレート | ✅ `docs/contracts/agency-agreement.md`・利用規約と条文対応表付き |
| admin 「相談所＋オーナー一括作成」UI | ✅ agencies + counselors（owner レコード）+ invite_token を 1 フォームで作成、招待 URL コピー機能 |
| Vercel build 設定 | ✅ Ignored Build Step を Production Branch のみに絞り込み |

**残（外部要因待ち or 次フェーズ）**：
- 法人設立 / 屋号確定後のプレースホルダ実値差替（`[会社名]` 等）
- 顧問弁護士レビュー（任意・営業前リスク低減のため推奨）
- Resend 契約 + ドメイン検証（Phase D）
- agencies.owner_user_id を admin から手動セットする UI（次フェーズ予定）
- futarive-counselor 側でオーナーが配下カウンセラーを招待する UI（次フェーズ予定）

これらは外部要因待ちまたは次フェーズ予定のため、Phase C は**主要 UI / 規約整備フェーズとしてクローズ**する。

### 次セッション以降のメインタスク

優先順（TODO.md と同期）：
1. 法人設立完了 → プレースホルダ実値差替
2. Phase D（Resend 契約 + ドメイン検証 + 配信停止リンク API + 鮮度アラート稼働）
3. 営業準備（営業資料・台本・実カウンセラー投入）

---

## 2026-05-27（UI 大規模整理：counselor 60代対応 + user-site PC 全面対応 + /about Apple 風刷新）

### このセッションの位置づけ
営業開始に向けた UI 仕上げのセッション。3 つの大領域を並行で進めた：

1. **counselor 管理画面の 60 代対応**：iPad/iPhone から触る本人カウンセラーの視認性向上
2. **user-site の PC 対応**：「PC で真ん中の細い帯にしか表示されない」問題を全面解消
3. **/about の Apple 風刷新**：ダーク茶 + アンバーグラデの組み合わせを廃して、清潔感のあるライト基調に

### counselor（`claude/fix-profile-creation-1clpG`）

- **ナビ表記の日本語化＋統一**
  - サイドバー / モバイル下タブを統一：ダッシュボード→「最初に見る」、受信トレイ→「やるべきこと」、リール→「動画・写真」→最終的に「写真」、予約枠管理→「カレンダー」、レビュー返信→「口コミへの返信」
  - eyebrow の英語ラベル（DASHBOARD / INBOX / CALENDAR / REVIEWS / PROFILE / REEL / COUNSELOR ADMIN / MENU）を全削除
  - モバイル下タブの折り返し位置を明示的に制御（最初に\n見る / やるべき\nこと / 口コミ\n返信）
- **ダッシュボードを「気になること」に改名 + 60 代向け色分け**
  - 「ちいさな『しなきゃ』」→「気になること」
  - 統計カード 4 枚 → 2 枚に絞り込み（今月の予約・未返信の口コミ）
  - todo-row に種類別の左ボーダー色分け（urgent=赤・booking=緑・reply=ベージュ・rec=薄ベージュ・profile-stale=赤・profile-aging=茶）
  - 本文フォント 13→15px、ヘッダ 15→18px、各サイズ 1〜2px 拡大
- **「面談完了」ボタンを Apple 風押せ感に**
  - kc-btn-sm を外して大型化、accent 影 + 微弱なパルスアニメーション（2.6 秒呼吸）
  - ラベル「面談完了」→「完了をマーク」（動詞前置き）+ チェック・› アイコン
  - prefers-reduced-motion 対応
- **「気になること」全項目を押せ感ある表現に統一**
  - タグ：返信→要・返信、予約→要・準備、推奨→おすすめ、点検→要・点検
  - 本文を状態語尾 → 行動依頼の言い回しに刷新
  - 要・系の行のアクションをピル型ボタン（accent 色フィル）に昇格
- **カレンダーを Google カレンダー風に作り替え**
  - 日/週/月 タブを追加（デフォルト：週、localStorage 永続化）
  - WeekView コンポーネント新規：縦軸＝時刻、横軸＝7 日、スロットを時間ブロックで配置、「いま」を示す赤い水平線
  - 空き時間タップで 30 分単位スナップして枠追加モーダル
  - 営業時間が agency.consultation_start/end_time から自動反映
- **inbox クローズ列に「もっと見る」ボタン**
  - 最新 20 件打ち切り → 20 件ずつ追加表示
  - KanbanColumn に totalCount / hasMore / onShowMore プロパティ追加
- **相談所プロフィール（/agency）の整理**
  - eyebrow（AGENCY / FEES / DISCOUNTS / CAMPAIGN / CANCELLATION & CONTACT）を全削除
  - 各セクションタイトルに色付きドット + 太い色付き上ボーダー：相談所写真=黄、料金プラン=緑、各種割引=青、キャンペーン=ピンク、キャンセル連絡先=茶
  - 「リール画像」→「写真」（label / showToast / 確認 / 空状態 / alt / 説明文すべて）
  - 「ダッシュボードへ」→「最初の画面へ」（ナビ表記と整合）

### admin（`claude/futarive-admin-dashboard-iKBfw`）

- **agencies.owner_user_id 手動セット UI を追加**
  - 既存の #16「新規相談所＋オーナー一括作成」と共存
  - 相談所一覧テーブルに「オーナー」列（設定済 緑バッジ / 未設定 赤バッジ）
  - オーナーボタン → modal で UUID 入力（バリデーション付き）→ 設定・解除
  - Supabase Dashboard > Authentication > Users から UID を貼る手順を modal 内で案内
  - これまで「別途 Supabase Dashboard で実施」としていた箇所が admin で完結
- **誤って main にコミットしていた変更を revert → iKBfw に再適用**
  - main は user-site の Production Branch のため、admin の変更は iKBfw に固定する運用を再確認

### user-site（`main`）

- **PC レスポンシブ用ユーティリティクラスを globals.css に新設**
  - `.pc-section-wide`（560 → 760 → 920 で拡張）
  - `.pc-text-narrow`（中の段落は 560 で読みやすさ維持）
  - `.pc-grid-2to4`（2×2 mobile → 1×4 PC）
  - `.pc-flexrow-to-grid`（横スクロール mobile → 中央寄せ並列 PC）
  - `.pc-stack-to-grid3`（縦スタック mobile → 3 列 PC）
  - `.pc-readable`（480 mobile / 720 PC、テキスト中心ページ向け）
- **ホーム各セクションを PC で広がる作りに**
  - A' Kinda note：外枠拡張、天気アイコンは PC で横並び中央寄せ
  - B やりたいことが決まっている方へ：2×2 → 1×4
  - C' Kinda story / Kinda voices：縦 3 → PC で横 3 列
  - 「やりたいことが決まっている方へ」を p（薄グレー 12px）→ h2（Shippori Mincho 濃文字 clamp(20-30px)）に
- **ホームヒーローを 2 段階で改修**
  - 第 1 段階：PC で 2 カラムレイアウト（コピー左・画像右）
  - 第 2 段階：**PC を全幅シネマティック型に変更**（画像が画面いっぱい、テキストは右側オーバーレイ）
  - 季節画像 hero-couple-2026ss.webp（1024×1536 縦長 2:3）+ hero-couple-2026ss-pc.webp（1672×941 横長 16:9）
  - picture 要素で実画像を切替（不要なファイルはダウンロードしない）
  - 右側に 62% 幅のベージュグラデーションオーバーレイ（画像左側のシール「季節とともに、気持ちは変わる」を確実に映しつつ、テキストの可読性確保）
  - CTA タグライン色を accent (#C8A97A) opacity .82 → accent-deep (#A88858) opacity 1.0 weight 500 に
  - 副CTA帯を画像下端に absolute 配置 + backdrop-filter: blur(8px)
- **ヘッダーロゴ左位置をヒーロー「好」と揃える**（左 padding 0 → 24px）
- **SearchModal（虫眼鏡）の PC 幅制限**
  - モバイル：ボトムシート維持
  - PC（≥768px）：中央寄せ・最大幅 720px
- **サブページの PC 対応**
  - /kinda-note：480 → 720 (PC)
  - /kinda-type：480 → 720 (PC)、結果・診断中ページも同様
  - /kinda-note/quiz：プログレスバー + コンテンツ wrapper に pc-readable
- **/about を Apple 風に全面刷新**
  - 8 セクション全てを統一トーンに：白（#FFFFFF）/ ウォームベージュ（#FBF7F1）
  - 旧：ダーク茶 (#231A12) × 3 セクション + アンバーグラデ × 1 → 全廃
  - padding 80px → clamp(96-160px) で PC に余裕、maxWidth 720 → 760
  - eyebrow 統一：fontWeight 400→500、letterSpacing .18→.2em、color var(--accent) → #D4A090（ダスティローズ）
  - h1/h2 拡大（hero clamp(28-48) → clamp(32-56)、section h2 clamp(22-36) → clamp(26-42)）
  - **④信じることをカード化**（白カード + 軽い影、モバイル 1 列 / PC 2 列、hover で 2px 浮く）
  - **②「出会いは、人で決まる」を村の上に浮かぶ巨大カードに**（背景透明 → fixed の村背景が透ける、内側に丸角 28-44px の白カード + 3 段重ねの影）

### 仕様変更で確定した方針

- **ブランチ運用の再徹底**
  - counselor 変更 → `claude/fix-profile-creation-1clpG` 直接
  - admin 変更 → `claude/futarive-admin-dashboard-iKBfw` 直接
  - user-site 変更 → `main` 直接（Vercel Ignored Build Step が他ブランチをブロックするため、feature branch を作らない）
- **画像の運用**：季節ごとに「モバイル縦長 2:3」+「PC 横長 16:9」の 2 枚を組で用意（hero-couple-2026ss.webp / hero-couple-2026ss-pc.webp）。命名規則は `hero-couple-<season>{,-pc}.webp`。

### 次セッションへの申し送り

- 残作業（このセッション時点）：
  - PC 用ワイド画像のシール位置確認（実機で）
  - /about の② カードの実機確認、装飾画像追加の判断
  - 他ページ（/kinda-act / /kinda-glow / /kinda-story / /agencies / /counselors）は既存の grid CSS で responsive 化済のため大きな手入れ不要
- counselor 管理画面で残る微調整は実機テストで洗い出し
- 詳細な変更履歴は git log 参照

---

## 2026-05-27（料金モデル・課金フロー・集客方針の大決定）

### このセッションの位置づけ
営業資料作成を起点に議論を始めたが、上流の事業根幹（料金モデル・課金フロー・集客順序）が未確定と判明し、そちらを優先して確定させたセッション。営業資料そのものは未着手で次回へ。

### 決定事項

#### 1. 料金モデル（段階移行・確定）
- フェーズ1（現在）：送客課金 ¥5,000 / 件。掲載無料・初期費用なし・月額固定費なし。
- フェーズ2（ブランド確立後）：掲載課金へ移行可能。月額 ¥11,000（税込）／契約から1年間モニター価格50%オフ ¥5,500。
- 移行は選択制・強制しない。既存パートナーには優遇措置。
- 切り替え提案トリガー：おすすめベース（Kinda経由面談が月平均3件超で相手が得になる、を目安。集計・管理方法は要検討）。

#### 2. PR枠・広告枠（やる・確定）
- 「PR」と明示した有料上位枠を設ける（金額は要確定。¥30,000規模を仮置き）。
- 透明表示が絶対前提（"こっそり順位操作"はしない＝ユーザーファーストと両立）。
- 将来：外部スポンサー広告枠（楽天・保険等は仮）で安定収益化。

#### 3. 課金フロー（「前払い＋情報ロック」方式へ大変更・確定）
従来の「面談完了ベース課金」を廃し、取りっぱぐれ防止のため前払い方式に刷新。

確定した順序：
```
ユーザー予約
 → 24時間のキャンセル猶予
 → 猶予通過で課金確定・相談所へ請求
 → 入金確認（自動）
 → 個人情報のロック解除
 → 面談（予約から最短3日後、※短縮可能）
```

情報開示の二層化（解き方A・確定）：
- 予約直後に開示（ロック不要）：メッセージ本文、面談希望日時、ニックネーム、相談したい大まかなテーマ。
- 入金後に開示（ロック解除）：本名・連絡先・詳細プロフィール。

UI挙動：予約が入ると管理画面に「予約者を見る」バーがロック状態で出現 → システムが入金確認 → 自動でロック解除 → タップ可能に。

透明性の明示：予約完了画面でタイムラインを先に提示（「予約受付／まもなく返信／詳細プロフィールは面談確定後に共有」）。

#### 4. 決済手段（確定）
- Stripe でクレカ一本化。銀行振込は捨てる。
- 理由：「入金確認後の自動ロック解除」を成立させる唯一の現実解。銀行振込は自動消し込みが実質不可能で手動運用が事故を招く。
- 実装：Stripe Webhook で入金検知 → Supabase `payment_status` 更新 → 管理画面アンロック。
- PayPay は後回し（要望が出てから追加）。
- ⚠️ Stripe口座開設・本人確認・APIキー取得はふうかさん本人が行う（法人未確定なら個人事業主で開設）。

#### 5. 集客エンジン方針（確定）
- SEO軸（SNSは補助）に決定。SEO＝資産が積み上がるメインエンジン、SNS＝初速＆潜在層拡大の補助。
- 既存の 2026-05-14 SEO診断レポート（seotrends2026diagnosis.pdf）の10施策の上に積む。
- 2026年は「Google順位」→「AI検索に引用される」競争（GEO/AEO/LLMO）。武器は「20の天気タイプ」等の独自語彙。YMYL領域ゆえ運営者の顔出し必須。

#### 6. ローンチ順序（2段階営業として確定）
営業は「シード営業」と「拡大営業」の2段階に分離する：
- シード営業（今すぐ・初期から必須）：提携相談所が0のため、最低限の品揃え（数社〜十数社）を作る初期営業。ユーザー集客と並行。
- 拡大営業（ユーザーが見えてから）：規模拡大（2,500社目標）の本格営業。営業資料はこちらの主武器だが、シード営業でも初版を使う。
- 店舗（カフェ・美容室）は最後。ユーザーが面談→デート段階に進んでから、キュレーションで紹介。

### 既存記録の上書き（重要）
- 課金タイミングの旧記録（WORKLOG 3173行目「面談完了」、本人記憶「予約後24h」、キャンセルポリシー「面談24h前まで無料」）は、本セッションの「前払い＋情報ロック方式」で**刷新**された。契約書・規約・WORKLOG を新方式に統一すること。

### 次セッションへの申し送り
- 営業資料（リーフレット／スライド／FAQ／台本／コールドメール／リスト戦略）は未着手。次回作成。
- 詳細設計が必要：抜け駆け防止のメッセージ制御、個人情報の線引き、Supabaseスキーマ変更（payment_status）、契約書・規約の課金条文改訂。
- 人間と相談すべき保留：料金の金額妥当性、3日後ルールの体感、切り替えトリガー管理、法人設立、顧問弁護士レビュー。

### 2026-05-27 追記：ヘッダーロゴ位置の方針決定

セッション終盤で「モバイルヘッダーのロゴをもう少し左に寄せられないか」「逆に Lemme/Kourtney のような中央配置はどうか」が議論に。検証の結果：

- ロゴ画像内部の左余白はすでに精一杯削ってあり、CSS 側でこれ以上左に寄せられない
- 残る選択肢は「現状の左寄せ（軽微な余白あり）」vs「中央配置（ブティック感）」の二択

**結論：左寄せ維持**

判断根拠：
- 95% のサイトが左上ロゴ＝ユーザーに既習の配置
- シード営業フェーズ＝初訪問者が大半 → 認識コストゼロが優先
- 左の余白は運営者目線でだけ気になる「目が肥えた者の感覚」、一般ユーザーは気付かない
- 詩的・ブティック感は hero / about / コピー側で十分表現できている
- 中央配置の判断材料：ブランド認知が育ったら A/B テストで再検討（指名検索が増えた段階）


---

### 2026-06-01 ユーザーサイト：相談所からの通知マーク + キャンセルUNDO

ブランチ `claude/user-reservations-notify`（main 88a313f から派生）。ユーザー（お客様）サイトの修正。

#### 背景・前提確認でハマったこと
- 当初 `claude/fix-profile-creation-1clpG`（カウンセラー側作業ブランチ）で作業していたが、これは **main より306コミット遅れ**ており、main にあるユーザーサイトのログイン・予約一覧（`src/app/login`, `src/app/mypage/ReservationsSection.tsx`, `src/app/mypage/reservations/[id]`, `src/lib/reservations.ts`）が入っていなかった。
- 探索を `src/` 配下のみに絞ったため一度「予約一覧が無い」と誤認。実際は main に実装済み。**ユーザーサイトの作業は必ず最新 main から派生する**こと（カウンセラー作業ブランチとは系統が別）。

#### 機能1：相談所からの通知マーク（サイト内）
通知の元データ（すべて相談所/カウンセラー → ユーザー方向）:
1. `reservations.agency_message`（相談所メッセージ）
2. `reservations.reschedule_status='requested'` かつ `reschedule_requested_by='counselor'`（カウンセラー発の日程変更提案＝要対応）
3. `reviews.agency_reply`（口コミへの相談所返信）

- 新規 `src/lib/useUserNotifications.ts`：上記の最新時刻と localStorage `kinda-notif-seen-at:<uid>` を比較し未読判定。`markSeen()` で既読化し `kinda-notif-changed` イベントで他インスタンスへ伝播。
- `BottomNav` の「マイページ」アイコンに未読ドット（rose）を表示。
- `src/app/mypage/NotificationsSeen.tsx`（裏方）をマイページに配置 → 開くと既読化しドットが消える。
- 予約一覧カードに「日程変更の提案あり」バッジを追加（「相談所からメッセージあり」は既存）。

#### 機能2：キャンセルUNDO（ユーザーサイト）
- 新RPC `undo_cancel_reservation_rpc(p_reservation_id)`（Supを apply_migration で適用）。`cancel_reservation_rpc` の反転：本人・`cancelled_by='user'`・キャンセルから5分以内・slot が open の時のみ、status=active 復元 / slot=booked 再確保 / billing(`cancelled_within_grace` で voided）を pending 復元。slot が取られていたら `slot_taken`。
- `src/lib/reservations.ts` に `undoCancelReservationViaRpc` 追加。
- 共通 `src/components/ui/UndoToast.tsx`（下部トースト・残り時間バー・8秒で自動消滅）。
- 予約詳細（`ReservationDetailClient`）と予約一覧（`ReservationsSection`）の両方でキャンセル直後にUNDOトースト表示。一覧のキャンセルを旧 `cancelReservation`（直接UPDATE・billing非対応）から `cancelReservationViaRpc` に統一（UNDO/billing整合のため）。

ビルド green（サンドボックスは Supabase 非到達のため SSG 時 mock フォールバックのみ・エラーではない）。実機（Vercel プレビュー）で要確認。

---

### 2026-06-01 追記：通知一覧の可視化 / リール真っ黒の真因 / デプロイ運用の反省

#### 機能改善（main 反映済み）
- **通知内容の可視化**：通知ドットを押しても何の通知か分からない問題に対処。マイページに `NotificationsSection`（相談所メッセージ / カウンセラー発の日程変更提案 / 口コミ返信を一覧表示・新着バッジ付き）を追加。開くと既読化するが一覧は残る。旧 `NotificationsSeen` は統合・削除。
- **リール真っ黒の真因と修正**：症状は「暗幕は出るがモーダル本体が見えない・エラー表記も無し」。クラッシュではなく **CSS レイアウト崩れ**だった。リールモーダルの中身は全て `position:absolute` でモーダル自身に高さが無く、モバイルは `height:100vh` で成立するが **PC幅(`min-width:768px`)は `height:auto`+`aspect-ratio:9/16` のみ**で高さ基準が無く 0×0 に潰れて不可視に。**iPad Pro 横向き等 768px 以上が該当**（＝ふうかさんの主環境で再現）。PC幅に `height: min(900px, calc(100vh-40px))` を明示して解消。
- **安全網**：`ModalErrorBoundary` を追加し CounselorReelModal を保護（万一の描画クラッシュでアプリ全体が真っ黒になるのを防ぐ・console にエラー出力）。今回の原因はCSSだったが安全網として残置。

#### デプロイ運用の重大な反省（同じミスを繰り返さない）
- **今回のミス**：ユーザーサイトの作業を、カウンセラー作業ブランチ `claude/fix-profile-creation-1clpG`（main より **306コミット遅れ**・別系統）の上で始めてしまい、main にあるログイン/予約一覧が無い状態で「未実装」と誤認した。
- **もう一つの落とし穴**：ローカルの `main` ブランチが `origin/main` とは **unrelated history の古いコミット(d29661c)** を指していた（`git checkout main` で placeholder 版に戻って見える）。**ローカル main は信用しない。常に `origin/main` を真とする。**
- **正しい手順（ユーザーサイト = my-app-rp9u / Production Branch = `main`）**：
  1. `git fetch origin main`
  2. `git checkout -B <feature> origin/main`（必ず origin/main 起点。ローカル main 起点にしない）
  3. 実装 → build green 確認
  4. デプロイ反映は `git push origin <feature>:main`（fast-forward 可能なことを `git rev-list --count claude/...` で確認してから）
- **ブランチ系統が2つある点に注意**：ユーザーサイト(`src/`)は `main` 系統、カウンセラー(`futarive-counselor/`)は `claude/fix-profile-creation-1clpG` 系統で **履歴が分岐している**。両者を取り違えない。

---

### 2026-06-04 追記：営業デッキ作成 / 返金方針確定 / リポジトリ整理 / 決済・Voices設計の取り込み

#### 1. 営業デッキ（`docs/sales/kinda-deck.html`・main 反映済み）
- 結婚相談所向け提案デッキを**自己完結 HTML**で新規作成（外部画像非依存＝メール添付・PDF化で崩れない）。
- クレイ風ベージュ / 16:9 / キーボード・タップ送り / 進捗ドット / 印刷=PDF書き出し（vw→px 切替）。
- `?excerpt=1` で**★スライド(1,3,5,6,10)のみの抜粋版**に切替（1ソース2書き出し）。絵文字なし・「中立」不使用・競合の名指し批判なし。
- 会社名 / 特商法 / ドメイン / 所要時間はプレースホルダのまま（実値は法人設立・ドメイン取得後）。

#### 2. 返金方針の確定（スライド6に反映）
- **相談所さま都合のキャンセルは課金確定（返金対象外）** を確定。会員に当日キャンセルのペナルティがある業態なので相談所側にも規律を求める方針。
- デッキ脚注は「返金：24時間以内のキャンセル／日程変更の合意は返金します。」の2条件のみに修正。
- ※決済設計の完全版返金テーブル（§12・下記 zip 由来）とは粒度が異なる：相談所都合でも「別日了承」なら返金→再課金、純キャンセル（面談不成立）は課金確定。デッキは未入会者向けに簡略表記。

#### 3. 「優遇措置」は意図的に曖昧のまま（スライド8）
- 中身は未確定。内々の仕様として後日決める（TODO に残置）。候補：送客料割引／露出優遇／一定期間の送客料ゼロ／定額プランのロック価格。

#### 4. リポジトリ整理（コーナー別フォルダ化）
- ルート直下に散在していた資料をコーナー別に集約。コード参照ゼロを確認してから `git mv`。
  - `docs/sales/` … 営業用資料（deck / deck-brief / cold-email / faq / list-strategy / sales-script）
  - `docs/specs/` … cancel-reschedule-spec-v1.md
  - `docs/implementation/` … phase系・top-page-nav・weather-pages 実装指示書 ＋ Stripe/Resend実装指示書
  - `docs/guides/` … image-audit / weather-columns-writing-guide
  - `docs/handoff/` … handoff-summary-2026-06-04.md
- `files.zip`（main に置かれていた引き継ぎ資料一式）を展開・取り込み後に削除。中の転記用一時ファイル2本は `docs/archive/` へ退避。

#### 5. zip 由来の確定事項を CLAUDE.md に反映
- §11「Kinda voices 運用フロー（取材→記事化）」追記：カウンセラー個人単位・8セクション固定・3,000〜4,500字・SEO（相談所名＋カウンセラー名＋地域名）・Whisper取材ワークフロー。
- §12「決済・メール基盤（Stripe / Resend）」追記：カード登録制のみ・予約成立時即時前払い¥5,000・返金ルール完全版・Resend Free開始。実装指示書は `docs/implementation/claude-code-stripe-resend-implementation.md` を正とする。

---

### 2026-06-04 追記②：営業台本の磨き込み / 掲載運用の訂正 / Kinda voices 取材キット作成

#### 営業台本（`docs/sales/kinda-sales-script-v1.html`）強化
- Kinda voices 取材を「クロージング直前の切り札」ブロックとして追加（予約の質が上がる＝相手メリットで訴求・全員には約束しない注記つき）。
- 反論集に2枚追加：「他の口コミサイト（みん婚等）との違い」「掲載の手間」。
- ¥5,000 切り返しを成婚収益（数十万円）との桁対比で補強。
- クロージングを2分岐化（A:その場で枠確保 / B:持ち帰り＋期限設定）。
- コールドメール パターンC に再接触トリガーを追加。

#### 掲載運用の訂正（重要・事実誤り修正）
- 台本の「ページ入力は運営が代行」は**誤り**。正しくは **掲載決定後に御社専用アカウントを発行 → プロフィール・写真の入力はカウンセラー自身が管理画面から行う・いつでも編集可能**。
- **運営が代行するのは「初期の口コミ（代理掲載）」のみ**。§8 のビジネスルール（代理掲載＝`source_type='proxy'`＋バッジ）と整合。該当反論カードを修正済み。

#### 資料間のURL統一
- `kinda.futarive.jp`（台本・FAQ）→ 現行本番 `my-app-rp9u.vercel.app` に統一。全営業資料で一致（残存0確認）。正式ドメイン取得後の一括差し替えは TODO 済み。

#### Kinda voices 取材キット 新規作成（`docs/voices/kinda-voices-interview-kit.html`）
- CLAUDE.md §11 準拠の取材当日用ツール（自己完結HTML・クレイ風・印刷=A4）。
- 内容：トーン注意 → 当日の進め方 → 8セクション対応の質問リスト（約16問）→ 撮影カットリスト8枚 → Whisper取材後ワークフロー。
- 構成・トーンの正は CLAUDE.md §11 とし、本ファイルは現場運用の可視化版という位置づけ。

---

### 2026-06-04 追記③：営業台本をデッキのスライド順に全面整合

- 台本 Part2（面談本編）を、提案デッキ `docs/sales/kinda-deck.html` の10枚順になぞる「スライド送りトーク」に再編。各ブロック見出しに「デッキ #n」対応を明記。
- 欠けていた2ビートを本編に追加：**#4 届く人の質・診断ファネル（予約の質）**、**#6 空振りしない課金設計（前払い→24h猶予→入金後に本名開示）**。相手が懸念する前に先回りで説明する構成に。
- #2 課題提起（広告順位で埋もれる構造）を Opening 直後に新設。#3 を3カード（個人単位／面談認証口コミ／一気通貫）に揃えた。
- 反論集に **「やらせ・ステマでは？」** カードを追加（デッキ #9 と正対）。
- Kinda voices 切り札は「デッキ外・口頭のみ」と明示（意図的な差分）。#4 で伏線→Hook で回収する流れに接続。
- ※比較基準はリポジトリ版 `kinda-deck.html`。ユーザー手元の `kinda-deck-2.html` が別構成の場合は要再確認（WORKLOGに申し送り）。

---

### 2026-06-04 追記④：法務系を最新の課金方式（憲法§8/§12）へ整合・特商法整備

**背景**：送客契約書が旧モデル（面談実施で課金・月末締め・銀行振込・返金条項なし）のままで、憲法 §12（カード前払い・即時課金・24時間返金）と矛盾していた（TODO未完項目）。

- **送客契約書 `docs/contracts/agency-agreement.md` を改訂**：
  - §2 定義7「送客」＝面談実施 → **予約成立（予約確定時点）**に変更。
  - §4-3：連絡先（氏名・電話等）は**決済完了後に開示**、決済前はメッセージ/希望日時/ニックネーム/相談テーマのみ、と明記（情報ロック）。
  - §6 全面改訂：**クレジットカード前払い・銀行振込不可・予約成立時に即時課金**。返金は24時間ルール5分類（24h以内全額返金／24h超ユーザー都合は確定／相談所都合・日程変更は返金→再課金／その他不成立は確定）を条文化。決済失敗時の扱い・送客回避禁止・消費税も整理。
  - 弁護士チェックポイントを新方式に更新。
- **特商法**：
  - ユーザー向け `src/app/tokushou/page.tsx` は「ユーザーは無料」で正しいので維持。更新日を2026-06-04に。送客手数料は事業者間契約で**ユーザー負担ではない**旨の注記を追加。
  - 事業者向け（Stripe審査用）`docs/contracts/tokushoho-agency-b2b.md` を新規ドラフト作成（¥5,000/件・カード前払い・即時課金・24h返金ポリシー表）。**counselor 側に公開ページ化＋法人名/ドメイン実値挿入＋弁護士レビューが残**。
- **注意**：counselor 側の利用規約ソースは別ブランチ `claude/fix-profile-creation-1clpG` にあり main 作業ツリーに無いため、規約本体の課金条文改訂は次回そのブランチで実施する（TODOに残課題化）。

---

### 2026-06-04 追記⑤：返金ルールを「キャンセル/日程変更」分離の確定版へ修正

ふうかさんの認識に合わせて返金条件を再整理。キャンセル（取りやめ）と日程変更（振替）を明確に分離。

- 契約書 §6-5 を改訂（`docs/contracts/agency-agreement.md`）＋ 事業者向け特商法の返金表を同期（`tokushoho-agency-b2b.md`）。
- **返金が出るのは2ケースのみ**：①予約から24h以内のユーザー都合キャンセル＝全額返金、②ユーザー/相談所いずれかの日程変更を相手が承諾＝返金→別日再課金。
- それ以外は課金確定：24h超のユーザー都合キャンセル／**相談所都合のキャンセルは時間問わず課金確定（枠を確保して自己都合で取りやめたペナルティ）**／日程変更の承諾が得られない場合（申出者問わず）。
- 相談所からの日程変更は原則行わない旨を条文・表記に明記。
- 法的観点：B2B契約のため消費者契約法の適用なし＝契約自由が広く効き、相談所キャンセル＝課金確定は違約金的扱いとして有効。明らかな問題なしと判断（最終は顧問弁護士レビュー）。
- 事業者向け特商法は counselor 管理画面の「利用規約」と並べて掲載する方針を明記（TODO残課題化）。

### 2026-06-05 ユーザーサイト UI：日の出シンボル / Kinda story 視覚刷新 / シェア統一 / デプロイ運用整備

ブランチ `claude/nice-ptolemy-XtRgE` → main マージ済み（本番反映）。離脱防止・資産化・拡散の観点で Kinda story 周りを中心に整備。

- **日の出シンボル**：意味が読み取りづらかった「噴水」SVG を「日の出（水平線＋半円の太陽＋やわらかい光線）」へ差し替え。`KindaLoader`（光が呼吸／太陽がやわらかく昇る・`prefers-reduced-motion` 対応）と `SectionDivider`（静的・`ornament` キーを fountain→sunrise）で共通。天気メタファー＆「上から差し込む光」のブランド定義と一致。
- **トップの story/voices カードに視覚バンド**（文字だけ2セクションのスキャン素通り＝離脱を抑制）。voices は `/columns` と同じカテゴリ対応サムネ出し分け（weatherKey>thumbnail>画像）をトップに移植（将来の取材/カフェ/SEO記事は各自の thumbnail で自動反映）。
- **story サムネ＝stage プール＋id 分散方式**（`getStoryThumbnail`）。`STORY_THUMBNAIL_POOL` に複数枚を持てる土台。優先順は「個別 `Story.thumbnail` > stage プール(id ハッシュ分散)」で、1記事1画像にも移行可能。意味（段階）はバッジが担保し、画像は弁別性に振る方針。
- **クレイ画像**：成婚＝黄金の夕景に寄り添う2カップ、活動中＝青い夜明けにぽつんと芽、交際中＝顔つきの芽（据え置き）。色味・時間帯・構図を振り、一覧でも段階が一目で分かるよう差別化。ファイル名は小文字統一（Linux/Vercel の case-sensitive 対策）。
- **詳細ページを Kinda voices 仕様へ刷新**：全面クローズアップのヒーローを廃止し、記事サムネを角丸カード（左下=段階・右下=期間）→ 下にタイトル/著者、の columns 詳細レイアウトに統一。明るい背景で可読性向上。
- **一覧ヒーロー差し替え**：マクロ接写 `section-story-new.webp` → 横長クレイ情景 `story-hero.webp`（中央に余白）。明るい画像に合わせ文字を濃色＋淡いクリームスクリムへ。PC で高さ抑制・縦中央寄せ。
- **共通シェアバー `ShareBar`（Story 仕様）**：X / LINE / コピー / native 共有のインライン部品。`StoryShareBar` と `columns/ShareButtons` を統合・削除し、Kinda story 詳細・Kinda voices(columns) 記事を統一。`Kinda type` 結果も ShareBar へ（計測 `kinda_type_share` を onShare で全方式に拡張・「もう一度試す」・本番URL固定・ハッシュタグ文面 `shareText` は維持）。リール共有（counselor/place の `ShareSheet`）はモーダル形式を維持しつつ native 共有を追加。**Kinda note は特別仕様（html2canvas 画像保存／自由記述プライバシートグル＝予約フロー連動／天気別 og:image）維持のため変更なし**。
- **og:image の資産化**：Kinda story 詳細に `getStoryThumbnail` を og:image / twitter(summary_large_image) として付与（記事ごとに固有のシェアカード画像）＋ canonical。一覧カードにもサムネ帯を追加（CTR）。
- **デプロイ運用（重要・恒久化）**：Vercel の Ignored Build Step を「main のみビルド（＝feature branch の preview が全 CANCELED）」から **パス指定方式**へ変更。
  - my-app-rp9u：`git diff --quiet HEAD^ HEAD -- src public content package.json next.config.ts tsconfig.json`
  - futarive-counselor：`git diff --quiet HEAD^ HEAD -- ':(top)futarive-counselor'`
  - futarive-admin：`git diff --quiet HEAD^ HEAD -- ':(top)futarive-admin'`
  - 効果：counselor/admin だけの push で user-site がビルドされる無駄打ち（過去の日次上限到達の原因）を解消し、**user-site 変更のある feature branch では preview が出る**ように。これで「本番に出して様子見」をやめ、preview 確認 → main の運用に。


### 2026-06-05（kinda.jp ドメイン取得・Vercel 接続完了）

#### 1. `kinda.jp` ドメイン取得（完了）
- 取得先：お名前.com（GMO）。料金 0円/年（初年度）・自動更新設定済み。更新期限 2027/06/30。
- 登録名義：法人（AGOGLIFE Inc.）・担当者ふうかさん個人。Whois 代行：なし（法人住所のため不要と判断）。

#### 2. お名前.com ネームサーバー設定（完了）
- Vercel ネームサーバーに変更済み：`ns1.vercel-dns.com` / `ns2.vercel-dns.com`。

#### 3. Vercel ドメイン登録（完了）
- 対象プロジェクト：`my-app-rp9u`（ユーザーサイト）。
- 登録済み：`kinda.jp` → Production、`www.kinda.jp` → Production。
- 現ステータス：`Invalid Configuration`（ネームサーバー反映待ち・最大48時間）。反映後 Valid Configuration に自動更新。

#### 注意（要対応・TODO 化）
- コードの `metadataBase`（`src/app/layout.tsx`）が旧 `https://www.kinda-futari.app` のまま。OGP(og:image)・canonical が誤ドメインを指すため、`kinda.jp` へ修正（または `NEXT_PUBLIC_SITE_URL` 設定）が必要。

### 2026-06-05（Resend 現状整理・記録）

Resend の実装状況を調査して整理（コードはまだ書かず、状況の記録のみ）。
- **admin のみ実装済み**：`futarive-admin/lib/email.ts`（送信ラッパー）＋ `/api/webhooks/billing-disputed`（相談所の課金異議 → 運営宛通知）。admin の Vercel に `RESEND_API_KEY` 設定済み。テストは `onboarding@resend.dev`（所有者宛のみ）で確認済み。
- **user-site / counselor は未実装**：両プロジェクトに `RESEND_API_KEY` 追加＋`lib/email.ts` 展開が必要。
- **送信ドメイン認証は `kinda.jp` DNS 反映後**（推奨サブドメイン `send.kinda.jp`・SPF/DKIM/DMARC）。認証前は実送信不可（自分宛テストのみ）。
- **メール本体（決済完了/予約確定/連絡先開示/日程変更/返金）は Stripe 実装にセット**で作る方針（全て Stripe Webhook 起点のため・Stripe-first）。詳細は TODO 参照。

### 2026-06-05（相談：口コミ仕組みの信頼性 — 現状調査メモ）

「面談後に相談所が口コミURLを送る」運用だと、相手を選んで送らない→良い口コミだけ集まる懸念。現状コードを調査:
- **相談所側**（`futarive-counselor/components/dashboard/PendingCompletionsSection.tsx`）：「面談完了」を押すと予約 `status='completed'`＋`completed_at` を書き、コメントに「完了マーク後、お客様の口コミ投稿が可能になります」。＝口コミ解禁はカウンセラーが個別URLを送るのではなく**予約ステータス連動**。
- **ユーザー側 MyPage**（`src/app/mypage/reservations/[id]/ReservationDetailClient.tsx`）：`status==='completed'` で「面談完了 — 口コミを残しませんか？ → 口コミを書く」を自動表示し `/reviews/new?reservation=ID` へリンク。＝**MyPage 自動表示はすでに存在**。
- **未完成点**：`src/app/reviews/new/page.tsx` は `?token=` しか読まず、`ReviewGate` は `MOCK_TOKENS`（モック）。MyPage が渡す `?reservation=ID` は無視され、実 Supabase 保存まで未配線。＝**reservation 起点の投稿は未完成**。
- **残る裁量リスク**：completed への遷移トリガーが「相談所が押す」なので、押さないことで口コミを封じられる。→ 対策＝**時間経過での自動 completed フォールバック**＋**Resend で運営名義の促進メール**。設計を TODO 化。

### 2026-06-05（口コミ改修 Phase 1 DB：RPC＋自動完了を適用）

口コミ発行を相談所裁量から外す改修に着手。本番Supabase（lmxdhvmrtbzrbigzcnxs）へ適用済み:
- **RPC `submit_review`（SECURITY DEFINER）**：本人所有 × `status=completed` × `counselor_id`あり × `completed_at`から30日以内 × 同一予約に未投稿 を検証し `reviews` へ `is_published=false` で insert。`authenticated` のみ実行可。
- **自動完了 `auto_complete_reservations()` ＋ pg_cron（毎時0分）**：`end_at+12h` 超の `active`（`canceled`・日程変更`requested` 除外）を `completed` 化。no-show はセルフ申告を作らず、相談所→運営メール→運営手動の例外運用。安全弁は `is_published=false` の運営審査。
- 既存 active 12件中2件が次回cronで完了化（テストデータ・無害）と確認。

**重要な発見（M2＝RLS厳格化が要・未適用）**：`reviews` の `auth_all_reviews`（authenticated=ALL/true）が過剰権限で、ログインユーザーが他人の口コミ編集/削除/公開フラグ変更まで可能な既存穴。さらに **admin はanon/authenticatedキー運用**（service_role не使用）のため、admin の公開/削除/代理投稿も auth_all 依存。カウンセラー返信(agency_reply)も authenticated UPDATE。→ auth_all を素朴に剥がすと admin公開・カウンセラー返信が壊れる。M2 は admin/counselor/user を網羅したポリシー群に置換する単独ステップとして慎重に行う（下記TODO）。

### 2026-06-05（口コミ改修 Phase 2/3 完了：ユーザーサイト＋カウンセラー）

- **Phase 2（user-site・main 反映）**：`ReviewReservationGate` 新設（ログイン本人の completed 予約のみ）／`ReviewForm` を `submit_review` RPC 化／`/reviews/new?reservation=ID`／認証コードゲート `ReviewGate`(MOCK_TOKENS) 削除。投稿ページのレイアウト修正（PC中央寄せ/モバイル左右余白/下ナビ回避）。`claude/review-reservation-flow` → main マージ。
- **M2（RLS・適用済み）**：`reviews` の過剰権限 `auth_all_reviews` と公開漏れ `public read reviews` を撤去 → user/counselor/agency-owner/admin を網羅した最小権限へ。admin は anon/authenticated キー運用のため admin 操作も網羅。
- **Phase 3（counselor・`claude/fix-profile-creation-1clpG` push）**：面談完了時の `review_token/review_code` 発行・保存・表示を撤去（status=completed + completed_at のみ）。相談所向けUIを「お客様はマイページから投稿・操作不要」案内に置換。未使用の `generateReviewCode`/`FRONTSITE_URL`/`copyFlash` 等を削除。tsc クリーン。
- 残：営業資料の「専用URL＋認証コード」表現の修正、Phase 4（Resend 促進メール・ドメイン認証後）。
- 注意：counselor ブランチは src/ が分岐した別系統。編集は `futarive-counselor/` 配下のみに限定し、作業後 main に戻す運用を徹底。

### 2026-06-05（追記：完了メッセージ簡素化／no-show 返金ルール変更／営業資料の認証表現）

- カウンセラー完了メッセージを簡素化（「URL・コードのお渡しは不要」→「こちらでの操作は不要です」。相談所は旧フローの経緯を知らないため）。`claude/fix-profile-creation-1clpG`。
- **no-show 返金ルール変更（要・法務同期）**：請求履歴(`futarive-counselor billing/page.tsx`)の「no-show は確定」を撤回し、**「ユーザーが来られない等で未実施なら確認のうえ請求しない」＋お問い合わせ(mailto:hello@kinda.jp)導線**に変更。相談所都合の不実施は想定外として不記載。
  - ⚠️ これは従来方針（「面談不成立＝課金確定」）からの**実質的なルール変更**。`docs/contracts/agency-agreement.md`・`docs/contracts/tokushoho-agency-b2b.md`・営業デッキ slide6 返金脚注・関連法務記述を**この新ルールに同期する必要あり**（法務TODOに統合・顧問弁護士レビュー前提）。
- 営業資料の口コミ認証表現を新仕様へ（「専用URL＋認証コード」→「ログイン＋面談完了予約に紐づく」）。deck/script/faq/brief。
