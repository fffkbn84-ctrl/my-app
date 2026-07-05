---
name: kinda-voices
description: Kinda voices（カウンセラー取材記事）を文字起こし素材から作成する。実体は content/columns/*.mdx のカテゴリ「取材レポート」。8セクション構成→frontmatter→QA→PRまで半自動化。「取材記事にして」「voices書いて」等で使用。
---

# /kinda-voices — カウンセラー取材記事の投稿フロー

⚠️ **Kinda voices の実体は `/columns`**（サイト上のセクション名が「Kinda voices」、29件公開中・2026-07-02 時点）。
専用ルートは存在しない。取材記事は `content/columns/<slug>.mdx` に **category: "取材レポート"** で追加する。
記事設計の正は CLAUDE.md §11。

## 入力
- 取材の文字起こし（Whisper 出力）またはメモ
- カウンセラー名・相談所名・地域・掲載同意の確認（**本人確認前に公開しない**）

## STEP 1: 記事化（3,000〜4,500字）

8セクション構成（§11・固定）:
1. タイトル（**相談所名＋カウンセラー名＋地域名**を含める=SEO）＋ヘッダー画像
2. リード文（200字以内・核心を先に）
3. プロフィールサマリー（箇条書きの箱組み）
4. この仕事を選んだ理由（原体験）
5. どんな人を担当してきたか
6. 相談所の空気感・働き方
7. 印象に残っているひとこと（引用ブロック`>`・業界の常識をそっと外す言葉を選ぶ）
8. クロージング＋CTA「〇〇さんの話を、直接聞いてみる。」→ `/counselors/<id>` への内部リンク

トーン: 励まさない・断言しない・現象描写にとどめる。婚活/結婚相談所は本文OK・ゴールとして煽らない。絵文字なし。

## STEP 2: frontmatter（既存の取材レポート記事に準拠）

```yaml
category: "取材レポート"
author: "ふうか"        # 取材記事は実名著者（E-E-A-T）。編集部名義の過去記事に合わせる場合は要確認
tags: [相談所名, カウンセラー名, 地域名, "結婚相談所", "カウンセラー"]
atomicAnswer: 必須 / faq: 3件推奨
```
title・description・publishedAt・readTime・thumbnail 等は `/kinda-column` Skill の仕様と同じ。

## STEP 3: QA・公開
1. `npm run qa:content` → error 0
2. 本人（取材相手）に原稿確認 → OK が出るまで publish しない（PR は draft のまま待機可）
3. `npm run build` → feature branch → PR → マージ後 production READY 確認
4. 公開後は `/sns-pack` で SNS 展開（相談所への認知＝B2B にも二次利用）
