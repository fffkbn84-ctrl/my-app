---
name: kinda-column
description: SEO対策済みコラム記事（content/columns/*.mdx）を新規作成する。キーワード設計→執筆→frontmatter→QA→ブランチ/PRまでを半自動化。「コラム書いて」「記事追加」「SEO記事」等で使用。
---

# /kinda-column — SEOコラム投稿フロー

キーワード/テーマから `content/columns/<slug>.mdx` を1本作成し、QA・ビルド確認・PRまで行う。

## 入力
- **主キーワード**（例:「結婚相談所 選び方」）。なければテーマから提案して1つに決めて進める
- 参考にする既存記事・素材があれば受け取る

## STEP 1: 設計
1. `content/columns/` の既存記事一覧を確認し、**カニバリ（同一キーワード重複）がないか**チェック
2. 検索意図を1行で定義 → タイトル案3つ（主キーワードをタイトル前方に）→ 1つ選ぶ
3. slug は英語 kebab-case（既存の命名に倣う。例: `counselor-de-erabu-soudanjo`）
4. 見出し構成（H2×3〜5）を先に提示してから本文へ

## STEP 2: 執筆（3,000字前後）

トーン（コラム特有の線引き）:
- 「婚活/結婚相談所/お見合い」は**本文で使ってOK**（SEO上むしろ必須）。ただし主役にしない
- 「結婚・成婚」をゴールとして煽らない。焦らせ・比較なし。絵文字なし
- 「異性/男女」前提にしない（「相手」「ふたり」）
- 断定より寄り添い。だが空虚な共感はせず、実用的な整理を返す
- 記事末尾は Kinda の該当セクション（/kinda-type 等）への自然な内部リンクで締める（煽らないCTA）

## STEP 3: frontmatter（既存記事準拠・必須）

```yaml
---
title: "主キーワードを前方に含む32字前後"
description: "120〜155字。検索結果でのクリック理由になる要約"
category: "既存カテゴリから選ぶ（新設時はユーザーに確認）"
author: "さき"            # 既存記事の著者に合わせる
authorInitial: "S"
authorColor: "#B07D62"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
readTime: 数値（分）
thumbnail: "linear-gradient(135deg,#E8C9B8,#D4A090)"  # 既存トーンの淡グラデ
tags: [主キーワード, 関連キーワード…]
featured: false
atomicAnswer: "AI検索(AEO)向けの2〜3文の直接回答。必須で書く"
faq:
  - q: "検索されそうな自然文の質問（3〜4件）"
    a: "断定しすぎない実用回答。Kindaへの言及は自然な範囲で"
---
```

## STEP 4: QA
1. `npm run qa:content` → error 0（絵文字・NG語・frontmatter必須項目を機械チェック）
2. `npm run build` → MDXがビルドを通ることを確認
3. 目視: タイトル・description に主キーワードが入っているか / 内部リンク切れがないか

## STEP 5: ブランチ・PR
1. `git fetch origin main` → `git checkout -B column/<slug> origin/main`
2. commit → `git push -u origin column/<slug>` → PR（ユーザーが求めた場合）
3. main反映時: **tipコミットに content/ 変更が含まれていればVercelビルドは走る**（Ignored Build Step は content も監視対象）。反映後 `mcp__Vercel__list_deployments` で production が READY か確認

## STEP 6: 展開（任意・提案する）
公開URL確定後、`/sns-pack` でこのコラムをソースにSNS展開パックを作ると集客導線がつながる。
