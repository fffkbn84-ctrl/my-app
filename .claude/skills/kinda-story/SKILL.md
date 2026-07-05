---
name: kinda-story
description: Kinda story（ふたりの物語）を取材素材から新規投稿する。同意ゲート→STORIES配列への追加→QA→ブランチ/PRまでを半自動化。「story追加」「物語を投稿」「取材素材を記事に」等で使用。
---

# /kinda-story — Story 投稿フロー

取材素材（文字起こし・メモ）から `src/lib/mock/stories.ts` の `STORIES` 配列にエントリを1件追加し、
QA・ビルド確認・PR作成まで行う。実体ルートは `/kinda-story`（MDX方式は不採用）。

## STEP 0: 同意ゲート（最重要・ここを通らなければ下書きも作らない）

ユーザーに以下の同意状況を確認する。**回答がなければ作業を開始しない**:

| 項目 | 内容 |
|---|---|
| web | Webサイト掲載 |
| sns | SNS二次利用 |
| photo | 写真掲載 |
| realName | 実名（既定は仮名） |
| agency | 相談所名の掲載 |
| partner | 相手への配慮確認 |

- 既定は「**仮名・年代ぼかし・クレイ情景のみ（実写なし）**」。同意が取れた項目だけ開放。
- `agency=false` の場合: `agencyName`/`counselorName` は**空文字**、`agencyId`/`counselorId` は **0**（コードにも実名を持たせない＝mockはクライアント配信されるため）。
- 同意取得日と範囲は `consent` フィールドに記録（撤回対応用）。

## STEP 1: エントリ作成

`src/lib/mock/stories.ts` の `Story` interface に準拠して1件追加:

- **id**: 内容がわかる kebab-case（例: `atsumi-20s-mayoi`）。既存と重複しないこと
- **stage**: 成婚/交際中/活動中 → **サムネはstageから自動出し分け**（個別画像生成は不要。差別化したい時のみ `thumbnail` 上書き）
- **body**: 段落配列。トーン規則:
  - 励まさない・断言しない・現象描写にとどめる
  - 「結婚・成婚」をゴールとして煽らない。焦らせ・比較なし。絵文字なし
  - 転機は「静かな変化」として描く（劇的演出をしない）
  - 自社関与（Emma等）の事例は**関係性を明示する一文**を本文末尾に入れる
- **faq**: 2〜3件（FAQPage構造化データ→AEO）。質問は検索されそうな自然文で
- **relatedWeather**: 内容に合う天気を1〜2件（`/note/weather/[slug]` への内部リンク）
- **quote/pullQuote**: 本人の言葉から「業界の常識をそっと外す」一節を選ぶ
- **accentColor/accentSoft**: 既存エントリと調和する淡色系

⚠️ 構造化データは **Article + FAQPage のみ**。Review/Rating/AggregateRating は絶対に付けない（ステマ規制）。

## STEP 2: QA

1. `npm run qa:content` → error 0 を確認（同意整合性・絵文字・NG語を機械チェック）
2. `npm run build` → 型エラーなしを確認
3. 本文を読み直し、侮辱的に読まれうる表現・相手への配慮漏れがないか目視確認

## STEP 3: ブランチ・PR

1. `git fetch origin main` → `git checkout -B story/<id> origin/main`（ローカルmainは信用しない）
2. commit → `git push -u origin story/<id>` → PR作成（ユーザーがPRを求めた場合）
3. マージ後の本番反映確認: docs-onlyコミットがtipだとVercelビルドがスキップされる点に注意
   （このフローは stories.ts=src変更なので通常問題なし）

## 撤回依頼が来た場合
該当storyを配列から削除するのではなく、公開を止める（将来DB化後は `is_published=false`）。
同意取得日・範囲の記録は残す。速やかに対応する。
