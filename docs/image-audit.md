# 画像監査レポート（image-audit.md）

最終更新: 2026-05-22（rev. 3 — ロゴ webp 切替完了 / 重複 jpg 削除を反映）

ふたりへ（Kinda）user-site の画像アセットの棚卸し。本番リリース前に「不足を埋める」「重いものを最適化」「装飾の統一感を上げる」ためのチェックリスト。

> 本ドキュメントは uDUoW ブランチで管理。実装着手時の手順書ではなく、必要な画像と作業を洗い出すためのもの。
>
> **rev. 2 の主な変更点：**
> - §2 不足画像は ✅ 解決（kinda-note-deco-1/-2.webp 配置済み）
> - §3-1 から `.spinner` 行を撤去（コードから既に消えていた）
> - §4-1 ロゴ 2 枚は main で webp 化済み（92% / 90% 削減）。uDUoW のコード参照差し替えが残タスク
> - §4-3 オーファン誤検出を修正（CSS 参照を見落としていた 3 件を訂正）。意図的保全アセットの節を追加

---

## 1. 現状サマリー

| カテゴリ | 件数 | 状態 |
|---|---|---|
| ヒーロー画像（ページ最上部） | 6 件 | 揃っている |
| 天気アイコン（Kinda note 用） | 20 件 | 揃っている |
| セクション画像（トップ・グリッド） | 6 件 | 揃っている |
| ロゴ | 2 件（WebP のみ） | ✅ 全 webp 化完了（合計 -1.1MB） |
| オーナメント / 装飾 | 3 件 | 2 件使用（starfish / deco-1）／ 1 件意図保全（deco-2） |
| ローディング画像 | 0 件 | **未整備（Suspense fallback 5 箇所が空 div）** |
| **不足（参照あるが /public に無い）** | **0 件** | ✅ 解決済み（2026-05-22）|
| **重複（同名 jpg + webp）** | **0 件** | ✅ 解決済み（2026-05-22、-383KB）|

---

## 2. 不足している画像（参照されているが /public に無い）

✅ **2026-05-22 解決** — 5/22 時点で参照されていた kinda-note-deco-1/-2 は webp 化して `public/images/` に配置済み。現在「参照あるが実体なし」のアセットは **0 件**。

### 経緯（採用先・形式が変更された記録）

旧計画と最終形が大きく違うので、要点を残しておく：

| 項目 | 旧計画 | 最終形 |
|---|---|---|
| 形式 | `.png`（80×80px・線画・透過） | `.webp`（1254×1254・クレイ風） |
| 採用先 | `quiz/page.tsx` の質問カード右上・左下に装飾 | `kinda-note/page.tsx`（intro）の hero エリアに 1 枚 |
| モチーフ | 鳥・植物・羽など婚活感情のシルエット | deco-1=クレイのノート＋ペン＋カップ、deco-2=ハート手渡し |

### 経緯コミット

| commit | 内容 |
|---|---|
| `f37ec0c` | quiz/page.tsx に deco-1/-2 を配置 |
| `597fcda` | quiz の配置を revert（世界観調整のため） |
| `ab2040b` | webp はアセットとして保全（コード参照は外したまま） |
| `0e8eb4a` | kinda-note/page.tsx（intro）の hero に deco-1 を採用 |
| `61f14a4` | deco-2 は CTA 直前から外したが、`public/` には保全 |

---

## 3. ローディング UI（要強化）

### 3-1. 現在のローディング表現

| 場所 | 実装 | 評価 |
|---|---|---|
| `/booking/[counselorId]/loading.tsx` | スケルトン pulse（バー型） | ◎ よくできている |
| `/counselors/[id]/loading.tsx` | スケルトン pulse | ◎ よくできている |
| `Suspense fallback` 5 箇所 | `<div style={{ minHeight: 400 }} />`（空白） | 🚨 **空っぽで体験が悪い**（agencies / kinda-act / kinda-talk / kinda-glow / login の 5 箇所） |
| `Step1Calendar`「空き状況を読み込み中…」 | プレーンテキスト | 装飾欲しい |
| `Step2Slots`「読み込み中...」 | プレーンテキスト | 同上 |

> 旧 rev で挙げていた `.spinner`（globals.css）は、現状コードに `className="spinner"` 参照が 0 件のため、既に撤去済みとして本表から除外。

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
- `<Suspense fallback={<div style={{minHeight: 400}} />}>` → `<Suspense fallback={<KindaLoader variant="page" />}>`（5 箇所）

> `variant="dot"`（ミニ版）は現状 `.spinner` が撤去済みで差し替え先がないため、必要になった時に都度追加でよい。

---

## 4. 既存アセットの最適化（重い画像 / 重複ファイル）

### 4-1. ロゴ画像 ✅

| ファイル | サイズ | 状態 |
|---|---|---|
| `logoname _kinda_header.webp` | **67 KB**（92% 削減）| ✅ 採用中（Header.tsx:104） |
| `toppage_name.webp` | **39 KB**（90% 削減）| ✅ 採用中（columns/[slug]/page.tsx:137、OG image） |

**実施履歴（`ba6cfe2`）：**
- uDUoW のコード参照を `.PNG` → `.webp` に差し替え
- 旧 `.PNG` 2 枚（836KB + 381KB = 1.17MB）を削除
- ヘッダーは全ページ読み込みなので、初回 LCP / モバイル回線への効果が大きい

**任意の追加タスク（保留）：**
- ファイル名のスペース（`logoname _kinda_header`）を `logoname-kinda-header` 等に rename
  → URL エンコード回避になるが、動作上は問題なし。コミット履歴を汚すコスト > 利点なので保留

### 4-2. 重複ファイル ✅

`b2b34d4` で同名 `.jpg` を撤去済み。コード参照は webp のみだったため安全に削除。

| 削除済みファイル | 元サイズ | 残った webp |
|---|---|---|
| `kinda-act-hero.jpg` | 212K | `kinda-act-hero.webp`（53K） |
| `section-beauty-n2.png.jpg` | 171K | `section-beauty-n2.png.webp`（35K） |

合計 -383KB。`section-beauty-n2.png.webp` の二重拡張子（`.png.webp`）は気持ち悪いので、将来リネームの追加タスク化（§9 Step 3）。

### 4-3. オーファン（未参照アセット）

> ⚠️ 旧 rev は `Kinda-voices-nouse` / `Toontown-background` / `laughing-town-background` をオーファン扱いしていたが、これらは `globals.css` および columns 配下で現役。`src/` だけ grep していて CSS 経路を見落としていた。本 rev で訂正済み。

✅ **2026-05-22 解消** — `ornamental-heartwopal.webp`（88K）/ `Kinda-belief-background.webp`（52K）を削除。同時に Next.js scaffolding の `public/{next,window,file,globe,vercel}.svg` 5 件も未参照のため削除（合計 -141KB）。

| ファイル | サイズ | 処置 |
|---|---|---|
| ~~`ornamental-heartwopal.webp`~~ | 88K | 削除済み |
| ~~`Kinda-belief-background.webp`~~ | 52K | 削除済み |
| ~~`next.svg` / `window.svg` / `file.svg` / `globe.svg` / `vercel.svg`~~ | 計 3.3K | Next.js デフォルト・未参照のため削除済み |

### 4-4. 意図的に保全しているアセット（オーファンと混同しないこと）

コード参照は 0 だが、運用判断で `public/images/` に残しているアセット。将来の差し戻し時に同じファイル名で復活できるよう保持中。

| ファイル | サイズ | 経緯 |
|---|---|---|
| `kinda-note-deco-2.webp` | 43K | `61f14a4` で kinda-note/page.tsx の CTA 直前から外したが、世界観調整時に同じ位置に戻せるよう保全（`ab2040b` の方針に揃える） |

**ルール：** これらはオーファン掃除コマンドの対象から除外する。本表を更新して合意済みであることを示す。

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

| # | タスク | 規模 | 工数 | 状態 |
|---|---|---|---|---|
| 1 | `kinda-note-deco-1.webp` / `-2.webp` 制作・配置 | 小 | — | ✅ 完了（`0e8eb4a` / `61f14a4`） |
| 2 | `logoname _kinda_header.PNG` を webp 化 | 小 | — | ✅ 完了（`ba6cfe2`、92% 削減） |
| 3 | `toppage_name.PNG` の webp 化 | 小 | — | ✅ 完了（`ba6cfe2`、90% 削減） |
| 4 | `not-found.tsx` 新設 + イラスト 1 枚 | 中 | 1h | 🔴 未着手 |
| 5 | `KindaLoader` コンポーネント新設 + Suspense fallback 5 箇所差し替え | 中 | 1.5h | 🔴 未着手 |
| 6 | 重複 .jpg ファイル削除（kinda-act-hero / section-beauty-n2） | 極小 | — | ✅ 完了（`b2b34d4`、-383KB） |

残工数目安：2.5 時間

### 🟡 リリース後でも OK

| # | タスク | 規模 |
|---|---|---|
| 8 | オーナメント追加（dewdrop / petal / crescent / bird の SVG） | 中 |
| 9 | 各ページに SectionDivider 挿入（about / counselors / agencies / columns 等） | 小 |
| 10 | EmptyState コンポーネント化 + 既存 5 箇所差し替え | 中 |
| 11 | `error.tsx` グローバルエラー画面 | 小 |
| ~~12~~ | ~~オーファン画像（ornamental-heartwopal / Kinda-belief-background）整理~~ | ✅ 削除済み（2026-05-22）|

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

### Step 1: 即対応 ✅ 完了

- [x] `kinda-note-deco-1.webp` / `-2.webp` 生成・配置（intro hero へ採用）
- [x] ロゴ 2 枚を webp 化 + コード参照差替 + 旧 PNG 削除（`ba6cfe2`、-1.17MB）
- [x] 重複 .jpg ファイル 2 件削除（`b2b34d4`、-383KB）

### Step 2: 段階的に

- [ ] `KindaLoader` コンポーネント実装（既存 fountain SVG 流用）
- [ ] `not-found.tsx` 作成
- [ ] オーナメント挿入を約 7 ページに展開（現状 SectionDivider はトップページのみ）

### Step 3: 余裕があれば

- [ ] オーナメント SVG 4 種追加（dewdrop / petal / crescent / bird）
- [ ] EmptyState コンポーネント化
- [ ] 旧 `.PNG` ロゴ 2 枚を `public/images/legacy/` 退避 or 削除
- [ ] ファイル名スペース除去（`logoname _kinda_header.webp` → `logoname-kinda-header.webp`）

---

## 10. このドキュメントの更新ルール

- 新しい画像を追加した時は `## 1. 現状サマリー` を更新
- 画像参照を削除した時はオーファンチェックを再実行
- ファイル名規約に違反したコミットがあった場合は PR で指摘

> 監査スクリプト案（rev. 2 で修正）：
>
> ```sh
> # 参照されているファイル一覧（src/ + CSS の両方を見る）
> grep -rohE '/images/[^"'\'')]+' src/ | sort -u > /tmp/used.txt
> # /public/images/ の実体一覧
> (cd public/images && ls) | sed 's|^|/images/|' | sort -u > /tmp/have.txt
> # 不足（参照あるが実体なし）
> comm -23 /tmp/used.txt /tmp/have.txt
> # オーファン候補（実体あるが src/ + CSS から参照なし）
> comm -13 /tmp/used.txt /tmp/have.txt
> ```
>
> ⚠️ 旧 rev は `src/*.tsx` だけ grep して `globals.css` 経由の参照（Toontown / laughing-town / Kinda-voices-nouse）を見落としていた。`grep -r src/` であれば `.css` も拾うので、上記でカバーされる。
