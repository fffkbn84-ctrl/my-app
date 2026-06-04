# 天気コラム 残り15本 執筆ガイド

> 作成日：2026-05-14
> 対象：Claude.ai（記事執筆）/ Claude Code（MDX 配置・サイト連携）
> 作業ブランチ：`claude/implement-kinda-talk-uDUoW`（ユーザーサイト）

このドキュメントは、Kinda「20の天気タイプ」のコラム化プロジェクトにおいて、
未執筆の15本を Claude.ai に依頼する際の引き継ぎ仕様書。
Claude.ai にこのファイルの内容をそのまま渡せば、既存5本と整合した記事が書ける。

---

## 0. 前提・全体像

- Kinda の「20の天気タイプ」のうち **5本は実装済み**（雨雲・霧・違和感の風・冷たい風・朝もや）
- 残り **15本** を Claude.ai で執筆 → Claude Code が MDX 配置・サイト連携・ビルドを担当
- **既存5本が完成形のテンプレート**。`content/columns/weather-*.mdx` を1本読めば構造が分かる
- 背景の SEO 戦略は `docs/seo-trends-2026-diagnosis.pdf` を参照（Pillar & Cluster 構造、GEO/AEO 対応）

### 実装済み5本（テンプレートとして参照）
| ファイル | weatherKey | ルート |
|---|---|---|
| `content/columns/weather-rain-cloud-konkatsu-tsukareta.mdx` | rain_cloud | waiting |
| `content/columns/weather-mist-shinken-mayoi.mdx` | mist | kousai |
| `content/columns/weather-dissonance-wind-iwakan.mdx` | dissonance_wind | kousai |
| `content/columns/weather-cold-wind-date-fuan.mdx` | cold_wind | date1 |
| `content/columns/weather-morning-mist-konkatsu-start.mdx` | morning_mist | pre |

---

## 1. MDX フロントマター仕様（厳守）

```yaml
---
title: "（SEO検索意図を直撃する長めのタイトル。例：「婚活、疲れたと感じたら。雨雲のような気持ちを〜」）"
description: "120-140字。検索結果に出る説明文。狙うキーワードを自然に含める"
category: "気持ちの整理"           # ← 5本すべてこの固定値。変えない
author: "Kinda 編集部"             # ← 固定
authorInitial: "K"                 # ← 固定
authorColor: "#XXXXXX"             # ← 天気の色味に合わせた hex（既存5本を参考に）
publishedAt: "2026-05-14"          # 執筆日
updatedAt: "2026-05-14"            # 同上
readTime: 6                        # 6〜7 程度
thumbnail: "linear-gradient(135deg,#XXX,#XXX)"  # 天気の色のCSSグラデ
tags: ["キーワード", "を5個程度"]
featured: false                    # 15本中 featured:true は最大2本まで
weatherKey: "pre_dawn"             # ← 下の一覧の通り正確に
atomicAnswer: "40-60字。記事の結論を1〜2文で。AI検索が引用する核心部分"
faq:
  - q: "質問1（検索でよく打たれる疑問形）"
    a: "回答1（150-200字）"
  - q: "質問2"
    a: "回答2"
  # FAQは4問が標準
---
```

---

## 2. 本文の構造（5セクション固定）

```markdown
## この天気の正体
（約400字。天気のメタファーで、その気持ちが「悪いものではない」と伝える。
 段落は空行で区切る＝MDXで <p> に分かれる）

## こんな時に、〇〇の気持ちになる
### 場面タイトル1（15-25字）
（100-150字）
### 場面タイトル2
### 場面タイトル3
### 場面タイトル4
（3〜4場面。具体的なシーンで検索意図に刺す）

## 気持ちを言葉にすると、なにが起きるか
（約300字。★ここに必ず実在の研究を1本引用★）

## できる、小さなこと
### 1. アクションタイトル
（80-100字。Kinda noteへの自然な動線を1つ含めてOK）
### 2. アクションタイトル
### 3. アクションタイトル

## 〇〇のあなたに、Kinda ができること
（2-3文の導入 + 箇条書きで内部リンク3本）
- **[気持ちを整理する（Kinda note）→](/kinda-note)** 説明
- **[ぴったりのカウンセラーを見つける（Kinda type）→](/kinda-type)** 説明
- **[他のカウンセラーを見る（Kinda talk）→](/kinda-talk)** 説明
  （※デート系の天気なら3本目を /kinda-act に変えてもOK）

---

（締めの詩的な1-2文。記事冒頭の余韻と呼応させる）
```

---

## 3. ブランドトーン（CLAUDE.md より・最重要）

| ルール | 詳細 |
|---|---|
| **本文では 婚活/結婚相談所/お見合い を使ってOK** | これは情報記事なので SEO 上必須。CLAUDE.md の「フロントに出さない」は**ヒーロー・CTA・ブランドコピー**の話。記事本文は対象外 |
| ただし**主役にしない** | 「結婚」「成婚」をゴールとして煽らない。「好きな人」「ふたり」「過ごす日々」が中核 |
| **焦らせない・比較しない** | 「早くしないと」「周りは」で追い詰めない。「自分のペース」を肯定 |
| **LGBTQ+ 包摂** | 「異性」「男女」を当たり前にしない。「相手」「ふたり」で書く |
| **詩的トーン** | 天気のメタファーを軸に、断定より寄り添い。既存5本の文体に合わせる |
| **絵文字なし** | 一切使わない |

---

## 4. SEO キーワード密度ルール（過去の修正で学んだ教訓）

- **各記事に「ターゲットキーワード」を設定**（下の一覧参照）し、本文に8回以上自然に出す
- **サブキーワード**（婚活・結婚相談所・カウンセラー・お見合い・デート等）も**各2-3回は入れる**。ゼロは作らない
- ただし**段階に合わないキーワードは無理に入れない**（例：入会前の記事に「真剣交際」は不要）
- **キーワード詰め込み厳禁**。既存の文の中に文脈として溶かす（「カウンセラー」→「結婚相談所のカウンセラー」のように自然に拡張）

---

## 5. 引用ルール（YMYL対応・E-E-A-T）

- 「気持ちを言葉にすると」セクションに**実在の研究を1本**引用
- **安全に使える研究**（既存5本で使用済み）：
  - **James W. Pennebaker** "Writing About Emotional Experiences as a Therapeutic Process" (1997) — 表出筆記
  - **Matthew D. Lieberman** "Putting Feelings Into Words" (2007) — 感情ラベリング fMRI / Affect Labeling
  - **内閣府「結婚と家族をめぐる基礎データ」** — 公的統計
- **存在しない研究・数字を捏造しない**。確信がないものは「心理学の研究では」程度にぼかす

---

## 6. 残り15本の一覧（weatherKey と既存データ）

> ⚠️ `src/app/kinda-note/data/weatherDescriptions.ts` 内の**短い詩文（description）は絶対に変更しない**。
> 結果画面で使用中。コラム本文はそれとは別物。

| weatherKey | 天気名 | ルート（段階） | ターゲットキーワード案 | slug 案 |
|---|---|---|---|---|
| `pre_dawn` | 夜明け前 | pre（入会前） | 婚活 決断、結婚相談所 迷い | `weather-pre-dawn-konkatsu-ketsudan` |
| `flower_overcast` | 花曇り | pre（入会前） | 婚活 不安、はじめる前 | `weather-flower-overcast-konkatsu-fuan` |
| `light_rain_start` | 降り始め | waiting（待機中） | お見合い 待ち、婚活 これから | `weather-light-rain-start-omiai-machi` |
| `light_rain` | 小雨 | waiting（待機中） | 婚活 マンネリ、お見合い 組まれない | `weather-light-rain-konkatsu-mannneri` |
| `thunderstorm` | 雷雨 | waiting（待機中） | 婚活 限界、感情 爆発 | `weather-thunderstorm-konkatsu-genkai` |
| `sun_break` | 晴れ間 | omiai（お見合い後） | お見合い 手応え、いい人だった | `weather-sun-break-omiai-tegotae` |
| `angels_ladder` | 天使の梯子 | omiai（お見合い後） | 仮交際 期待、お見合い後 | `weather-angels-ladder-kari-kosai` |
| `windy_day` | 風の日 | omiai（お見合い後） | お見合い 予感、心が動く | `weather-windy-day-omiai-yokan` |
| `light_sunrise` | 淡い朝焼け | date1（デート後） | デート 楽しかった、淡い期待 | `weather-light-sunrise-date-yokan` |
| `wandering_clouds` | 迷い雲 | date1（デート後） | デート 迷い、続けるべきか | `weather-wandering-clouds-date-mayoi` |
| `windy_sunshine` | 風の強い晴れ | multiple（複数交際中） | 複数交際 疲れ、同時進行 | `weather-windy-sunshine-fukusu-kosai` |
| `faint_sunlight` | 薄日 | multiple（複数交際中） | 本命 わからない、複数 迷い | `weather-faint-sunlight-honmei-mayoi` |
| `twilight` | 夕暮れ | multiple（複数交際中） | 複数交際 罪悪感、選べない | `weather-twilight-fukusu-zaiakukan` |
| `sunrise` | 朝焼け | kousai（真剣交際中） | 真剣交際 前向き、結婚 決意 | `weather-sunrise-shinken-zenmuki` |
| `quiet_overcast` | 静かな曇り | kousai（真剣交際中） | 真剣交際 不安、これでいいのか | `weather-quiet-overcast-shinken-fuan` |

### ルート別の段階イメージ（執筆の文脈に使う）
- **pre**＝結婚相談所に入る前。まだ何も始まっていない
- **waiting**＝入会後、お見合いを待っている／活動が動き出した時期
- **omiai**＝お見合いを終えた直後の気持ち
- **date1**＝初期のデートを重ねている時期
- **multiple**＝複数の人と並行して会っている時期
- **kousai**＝真剣交際〜結婚を意識する段階

### おすすめの執筆バッチ（5本ずつ）
1. **第1バッチ**：`pre_dawn` / `thunderstorm` / `sun_break` / `wandering_clouds` / `sunrise`
   （6ルート中5ルートをカバー、検索需要も高い）
2. **第2バッチ**：`flower_overcast` / `light_rain_start` / `angels_ladder` / `light_sunrise` / `quiet_overcast`
3. **第3バッチ**：`light_rain` / `windy_day` / `windy_sunshine` / `faint_sunlight` / `twilight`

---

## 7. 執筆後の流れ（Claude Code 側の作業）

Claude.ai が MDX を書き上げたら、**Claude Code に渡す**。Claude Code が以下を実施：

1. `content/columns/` に MDX 配置
2. `src/app/kinda-note/data/weatherDescriptions.ts` の該当 weatherKey に `column_slug` を追加
   （これで `/note/weather/[slug]` が自動で noindex 解除＋コラム誘導カード表示に切り替わる）
3. `npm run build` で検証（FAQ schema / OGP / JSON-LD が正しく出るか）
4. サイトマップは自動反映（コラム追加を検知）
5. キーワード密度の最終チェック
6. コミット＆プッシュ

---

## 8. やってはいけないこと

- ❌ `weatherDescriptions.ts` の短い詩文（description）を書き換える（結果画面で使用中）
- ❌ 存在しない研究・統計を引用する
- ❌ category を "気持ちの整理" 以外にする
- ❌ 絵文字を使う
- ❌ 「早く結婚しないと」など焦らせる表現
- ❌ featured: true を3本以上にする

---

## 9. 関連ファイル・参照先

| ファイル | 役割 |
|---|---|
| `content/columns/weather-*.mdx` | 既存5本（テンプレート） |
| `src/lib/columns.ts` | コラムのデータ取得・型定義（atomicAnswer / faq / weatherKey / updatedAt 対応済み） |
| `src/app/columns/[slug]/page.tsx` | コラム個別ページ（Atomic Answer / FAQ / JSON-LD 描画） |
| `src/app/columns/[slug]/opengraph-image.tsx` | 動的 OGP 画像生成 |
| `src/app/kinda-note/data/weatherDescriptions.ts` | 20天気の定義（column_slug で連携） |
| `src/app/note/weather/[slug]/page.tsx` | 天気辞書ページ（column_slug 有無で表示切替） |
| `docs/weather-pages-implementation-v1.md` | 天気ページ初期実装の指示書 |
| `docs/seo-trends-2026-diagnosis.pdf` | 2026 SEO ベースライン診断書 |
