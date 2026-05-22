# 画像監査レポート（image-audit.md）

最終更新: 2026-05-22

ふたりへ（Kinda）user-site の画像アセットの棚卸し。本番リリース前に「不足を埋める」「重いものを最適化」「装飾の統一感を上げる」ためのチェックリスト。

> 本ドキュメントは uDUoW ブランチで管理。実装着手時の手順書ではなく、必要な画像と作業を洗い出すためのもの。

---

## 1. 現状サマリー

| カテゴリ | 件数 | 状態 |
|---|---|---|
| ヒーロー画像（ページ最上部） | 6 件 | 揃っている |
| 天気アイコン（Kinda note 用） | 20 件 | 揃っている |
| セクション画像（トップ・グリッド） | 6 件 | 揃っている |
| ロゴ | 2 件 | **重い・最適化必須** |
| オーナメント / 装飾 | 2 件 | 1 件未使用、追加が望ましい |
| ローディング画像 | 0 件 | **未整備（spinner CSS のみ）** |
| **不足（参照あるが /public に無い）** | **2 件** | 🚨 要対応 |

---

## 2. 不足している画像（参照されているが /public に無い）

実装で `src=` 参照されているが `/public/images/` に存在しないファイル：

| ファイル | 参照箇所 | 用途 | 状態 |
|---|---|---|---|
| `/images/kinda-note-deco-1.png` | `src/app/kinda-note/quiz/page.tsx:823` | Kinda note 質問カード右上の装飾（80×80px・opacity 0.85） | 🚨 **欠落** |
| `/images/kinda-note-deco-2.png` | `src/app/kinda-note/quiz/page.tsx:838` | Kinda note 質問カード左下の装飾（80×80px・opacity 0.85） | 🚨 **欠落** |

**コードはレイアウト崩れを防ぐ作りになっているが、画像が表示されないことでユーザー体験は不完全。**

### 必要な画像仕様

- サイズ: 80×80px（実寸）。表示は `background-size: contain` で柔軟
- 形式: PNG（透過必須）
- スタイル: Kinda の世界観 — 線画 / フラット / 淡い accent 色 `#C8A97A`
- 候補モチーフ: 鳥・植物・羽・葉・雲・水滴のシルエット（婚活の心情を象徴）

---

## 3. ローディング UI（要強化）

### 3-1. 現在のローディング表現

| 場所 | 実装 | 評価 |
|---|---|---|
| `.spinner`（globals.css） | 黒系のドーナツ回転 | プレーンすぎる・Kinda 世界観に合わない |
| `/booking/[counselorId]/loading.tsx` | スケルトン pulse（バー型） | ◎ よくできている |
| `/counselors/[id]/loading.tsx` | スケルトン pulse | ◎ よくできている |
| `Suspense fallback` 5 箇所 | `<div style={{ minHeight: 400 }} />`（空白） | 🚨 **空っぽで体験が悪い** |
| `Step1Calendar`「空き状況を読み込み中…」 | プレーンテキスト | 装飾欲しい |
| `Step2Slots`「読み込み中...」 | プレーンテキスト | 同上 |

### 3-2. 「考え中／ロード中」キャラ案

ふうかさんが希望していた **Kinda 世界観のローダー**：

| 案 | 制作難度 | 適用範囲 |
|---|---|---|
| **A. 天気アニメ**：既存の `w_*.webp` をフェード切替（霧→晴れ） | 低（既存素材活用） | 全体の汎用ローダー |
| **B. 線画キャラ**：地蔵さん風の小さなキャラがゆっくり動く SVG | 中（新規制作） | Kinda 全体のマスコット化 |
| **C. ふんわり噴水**：SectionDivider の fountain SVG を脈動アニメ | 低（既存 SVG 流用） | 既存トーンと統一 |
| **D. 雲が流れる**：accent 色のうすい雲が左→右へ | 中 | 待ち時間が短いもの向き |

**推奨：C（短い待ち）+ A（Suspense の長い待ち）のハイブリッド**。新規制作 0 / 1 件で済む。

### 3-3. 推奨：新規 `KindaLoader` コンポーネント

```
src/components/ui/KindaLoader.tsx
  - variant="inline"  → 噴水脈動（高さ 80px・テキスト「読み込み中…」付き）
  - variant="page"    → 天気アニメ + Kinda 文言（Suspense fallback 用）
  - variant="dot"     → ミニ版（ボタン内など、現 .spinner 置換）
```

差し替え対象（一括置換可能）:
- `<div className="spinner" />` → `<KindaLoader variant="dot" />`
- `<Suspense fallback={<div style={{minHeight: 400}} />}>` → `<Suspense fallback={<KindaLoader variant="page" />}>`

---

## 4. 既存アセットの最適化（重い画像 / 重複ファイル）

### 4-1. 巨大なロゴ画像 🚨

| ファイル | サイズ | 問題 |
|---|---|---|
| `logoname _kinda_header.PNG` | **836 KB** | ヘッダーで毎ページ読み込まれる。PNG 非圧縮 + ファイル名スペース |
| `toppage_name.PNG` | **381 KB** | OG 画像で参照（columns/[slug] line 137） |

**推奨：**
1. WebP 化 + 圧縮で `<50KB` まで削減（10〜20 倍軽量化可能）
2. ファイル名のスペースを `_` か `-` に置換（URL エンコード問題回避）
3. SVG 化できればさらに軽い（テキストロゴなら可能）

### 4-2. 重複ファイル

| ペア | サイズ | 推奨 |
|---|---|---|
| `kinda-act-hero.jpg`（212K）+ `.webp`（53K） | jpg は約 4 倍重い | **jpg 削除**（コード参照は webp のみ） |
| `section-beauty-n2.png.jpg`（171K）+ `.png.webp`（35K） | 同上 | **jpg 削除**。ファイル名 `.png.jpg` の二重拡張子も気持ち悪い → リネーム |

### 4-3. オーファン（未参照アセット）

| ファイル | サイズ | 備考 |
|---|---|---|
| `ornamental-heartwopal.webp` | 85K | コード内で 0 件参照。過去のデザイン残骸の可能性 |
| `Kinda-belief-background.webp` | 52K | コード内で 0 件参照。OUR BELIEF 旧背景の残骸の可能性 |

**推奨：** 削除 or 別フォルダ `public/images/legacy/` に退避。

---

## 5. オーナメント挿入候補（セクション区切り）

### 5-1. 現状

`SectionDivider` コンポーネント（噴水 SVG or starfish 画像）を使っているのは **トップページのみ（5 箇所）**。他の重要ページにオーナメントが入っていない。

### 5-2. 挿入推奨ページ

| ページ | 行数 | セクション数 | 挿入推奨箇所数 |
|---|---|---|---|
| `/about` | 1171 | 8 | 7 |
| `/counselors/[id]` | 1407 | 9〜10 | 5（profile / 料金 / 口コミ間） |
| `/agencies/[id]` | （未測） | 8 | 4 |
| `/places/[id]` | 943 | 6 | 3（お店について / 基本情報 / 口コミ間） |
| `/kinda-act` / `/kinda-glow` | 153 / 215 | 4 | 2 |
| `/columns/[slug]` | 771 | 6 | 2（本文末 / 関連記事前） |
| `/kinda-story/[id]` | （未測） | 5 | 2 |
| `/note/weather/[slug]` | 223 | 4 | 1 |

**作業規模：** SectionDivider をインポートして `<SectionDivider />` 1 行追加するだけ。新規画像は不要（既存 fountain / starfish で十分）。

### 5-3. オーナメントのバリエーション追加候補

現在 2 種類（fountain / starfish）。Kinda の世界観をもっと出すなら：

| キー | モチーフ | 用途 |
|---|---|---|
| `dewdrop` | 水滴 1 つ + 波紋 | 軽い区切り（コラム本文中） |
| `petal` | 花びら 1 枚 | 成婚エピソード / Kinda story 用 |
| `crescent` | 細い三日月 | 夜・静かな時間の章（Kinda note 用） |
| `bird` | 線画の小鳥 | 婚活準備ステージ向け |

すべて SVG（1 ファイル数 KB）で表現可能。

---

## 6. 不足ページ（リリース前必須）

### 6-1. グローバル 404 / エラーページ

```
src/app/not-found.tsx       未作成 — 削除されたお店 / カウンセラーへのアクセスで素っ気ない画面
src/app/error.tsx           未作成 — 予期せぬエラー時の画面
```

**必要画像：** Kinda 世界観のイラスト 1 枚（例：霧の中の小道・夜明け前など、「迷っている」を表す）。weather 系の既存 webp の流用も可。

### 6-2. 空状態（empty state）

現状はテキスト一行のみ：
- `条件に一致するお店が見つかりませんでした。`（ShopSearch.tsx:398）
- `条件に一致するカウンセラーが見つかりませんでした。`（CounselorSearch.tsx:233）
- `まだ口コミはありません。`（counselors/[id]:1375、shops/[id]:279）
- `まだ天気がありません。`（NoteHistorySection:374）
- `この日の枠はありません。`（Step1Calendar:281）

**提案：** 各シーンに合った小さな線画 SVG（または既存ornament 流用）+ やわらかいメッセージで EmptyState コンポーネント化。

---

## 7. 優先順位 & 推奨アクション

### 🔴 リリース前 must

| # | タスク | 規模 | 工数 |
|---|---|---|---|
| 1 | `kinda-note-deco-1.png` / `-2.png` 制作・配置 | 小 | 0.5h（生成）+ 配置 |
| 2 | `logoname _kinda_header.PNG` を webp 化 + ファイル名空白除去 | 小 | 0.5h |
| 3 | `toppage_name.PNG` の webp 化 | 小 | 0.3h |
| 4 | `not-found.tsx` 新設 + イラスト 1 枚 | 中 | 1h |
| 5 | `KindaLoader` コンポーネント新設 + Suspense fallback 5 箇所差し替え | 中 | 1.5h |
| 6 | 重複 .jpg ファイル削除（kinda-act-hero / section-beauty-n2） | 極小 | 0.1h |

合計目安：3.9 時間

### 🟡 リリース後でも OK

| # | タスク | 規模 |
|---|---|---|
| 7 | オーナメント追加（dewdrop / petal / crescent / bird の SVG） | 中 |
| 8 | 各ページに SectionDivider 挿入（about / counselors / agencies / columns 等） | 小 |
| 9 | EmptyState コンポーネント化 + 既存 5 箇所差し替え | 中 |
| 10 | `error.tsx` グローバルエラー画面 | 小 |
| 11 | オーファン画像（ornamental-heartwopal / Kinda-belief-background）整理 | 極小 |

---

## 8. 画像制作のスタイル指針

新規画像は以下を守る（CLAUDE.md「デザイン原則」と整合）:

| 項目 | 指針 |
|---|---|
| カラー | `--accent: #C8A97A`（ゴールド）/ `--ink: #2A2A2A` / `--mid: #6B6B6B`。CSS 変数で参照可能なものは SVG `currentColor` で実装 |
| スタイル | 線画 / フラット / ぷっくり 3D は避ける（2026-05-17 のリデザインで脱却した） |
| 形式 | SVG > WebP > PNG > JPG の優先順 |
| 透過 | 必須（背景に重ねる前提） |
| サイズ | サムネ系は実寸 80〜120px、ヒーロー系は 1200×800 程度 |
| ファイル名 | snake_case か kebab-case、スペース・全角文字禁止 |

---

## 9. 制作の進め方（提案）

### Step 1: 即対応（このセッション or 次セッション）

- [ ] `kinda-note-deco-1.png` / `-2.png` を Claude.ai か手作業で生成 → 配置
- [ ] 重複 .jpg ファイル 2 件削除
- [ ] `logoname _kinda_header.PNG` の webp 化 + ファイル名修正

### Step 2: 段階的に

- [ ] `KindaLoader` コンポーネント実装（既存 fountain SVG 流用）
- [ ] `not-found.tsx` 作成
- [ ] オーナメント挿入を約 7 ページに展開

### Step 3: 余裕があれば

- [ ] オーナメント SVG 4 種追加
- [ ] EmptyState コンポーネント化

---

## 10. このドキュメントの更新ルール

- 新しい画像を追加した時は `## 1. 現状サマリー` を更新
- 画像参照を削除した時はオーファンチェックを再実行
- ファイル名規約に違反したコミットがあった場合は PR で指摘

> 監査スクリプト案: `grep -rn "/images/" src/ | awk -F'"' '{print $2}' | sort -u` で参照ファイル一覧。これと `ls public/images/` の diff を取れば不足 / オーファンが即出る。
