# 人の説明書 No.02「仕事の私から、少しだけ着替えたい日」（IG 10/21 水 20:00）

> 型の正は `docs/sns/series/au-hi-no-fuku.md`（v5「人の説明書」・手書き風）。前回は `packs/2026-10-18-ig-reel-manual-01.md`。
> 書き出しは `render-manual.js`（`"hand":true`）＋ `build_reel.py one10`。

- **ジャンル**：韓国系（No.01 は 90年代ニューヨーク。交互に出す）
- **場面（sub）**：平日の夜 仕事帰りに1回目のデートへ
- **見る数字**：コメント（数字）・保存・送信。3秒残存は No.01 と比べる（No.01 の数字は 10/21 に出る）

## 0. この回で変えないこと・変えること

- 型（左に写真・右に説明書・下に today's point・最後に「いくつ当てはまりましたか」）は No.01 のまま。**同じ版面で続けてから判断する**（`reviews/2026-10-17-benchmark-aya-casual-note.md`：1本で見切らない）
- 変えるのはジャンル（韓国系）と時間帯（平日の夜）。No.01 が土曜の昼なので、見る人の「これ私だ」の入口を増やす
- お見合いの回は作らない（相談所が服装を指導している場のため）。1回目のデートにした

## 1. 説明書（1項目18字まで・`/` は改行位置）

| 項目 | 一言 | 字数 |
|---|---|---|
| 好きな人には | 聞かれる前に/お店を3つ調べてある | 15 |
| 友達とは | 近況報告が/毎回2時間を超える | 13 |
| 休日は | 朝のカフェで/手帳を色分けする | 13 |
| LINEは | 既読にしたら/5分以内に返す派 | 13 |
| 今日の服 | ロッカーで変えたのは/ピアスだけ | 14 |

- 「彼」「彼氏」と書かない（相手は「好きな人」）。下に見る・からかう書き方なし
- 題は「その服を選んだ気持ち」で書く（v5 の決まり）：**仕事の私から、少しだけ着替えたい日**（16字・1行）

## 2. 画像プロンプト（ChatGPT・2:3 縦）

> No.01 の形のまま、**人・服・街・時間だけ差し替えた**。「横を向く」「下の35%は何もない歩道」は変えていない。

```
A candid street-style photograph, shot on 35mm film look, early evening
on a weekday, the sky still a deep soft blue, warm light from shop windows.
A Japanese woman in her late 20s walks along a calm city street in an office
district after work, past a small café and a flower shop with warm lights.
She is glancing sideways, smiling slightly at something off camera; her face
is turned three-quarters away from the camera, not looking at the lens.

Her outfit is modern Korean style, clean and soft, office to date: a long
oversized oatmeal wool coat worn open, a crisp white collared shirt with
the collar out over a pale sky-blue fine knit vest, wide charcoal grey
pleated slacks with a long hem, black leather loafers, a small black
leather shoulder bag on a thin strap, small silver drop earrings, a thin
silver hair clip. Hair long and straight, tucked behind one ear.
Understated, neat, clearly fashionable.

The woman is in the upper and middle part of the frame, full body visible.
The lower 35 percent of the image is a soft, out-of-focus sidewalk with
nothing important in it.

No text, no letters, no signs with readable words, no logos, no brand marks.
```

### 再生成の基準

- カメラ目線になった／顔が正面を向いた
- 夜が暗すぎて服の色が見えない（服の色が見えることが最優先。空は青く残す）
- 看板や店に読める文字が出た
- 足元が切れた（ローファーが today's point に要る）

## 3. 書き出し（画像を見てから Claude が埋める）

```bash
NODE_PATH=$(npm root -g) node render-manual.js src.png f1.png '{"hand": true, "headTop": 160, "pt": 400, "colTop": 395, "gap": 20, "no": "02", "style": "Seoul, after work", "title": "仕事の私から、少しだけ着替えたい日", "sub": "平日の夜 仕事帰りに1回目のデートへ", "palette": […画像から4色…], "crop": […], "accent": "…", "footer": "いくつ当てはまりましたか", "note": "save it for your next date", "noteTop": 1815, "entries": [["好きな人には", "聞かれる前に/お店を3つ調べてある"], ["友達とは", "近況報告が/毎回2時間を超える"], ["休日は", "朝のカフェで/手帳を色分けする"], ["LINEは", "既読にしたら/5分以内に返す派"], ["今日の服", "ロッカーで変えたのは/ピアスだけ"]], "points": […3つ…]}'
python3 build_reel.py one10 manual-02.mp4
```

- **palette** の候補（写真から拾って直す）：oatmeal・sky・charcoal・black
- **today's point** の候補（12字×2行）：
  - 「白いシャツの襟を/ベストの外に出す」
  - 「グレーのスラックスは/靴に少しかかる丈」
  - 「小さい黒のバッグで/仕事の荷物は置いてく」
- `style` は英字の手書き。`Seoul, after work` が長すぎて崩れたら `Seoul style` に

## 4. キャプション

```
仕事の私から、少しだけ着替えたい。
そんな気持ちで、仕事帰りに1回目のデートへ向かう人の説明書です。

聞かれる前に、お店を3つ調べてある。
既読にしたら、5分以内に返す。
いくつ当てはまりましたか。数字だけコメントに置いていってください。

今日の服
コートは長めのオートミールを前を開けて。中が白と水色なので、夜の街でも顔まわりが明るく見えます
シャツの襟をベストの外に出すと、会社の服のままでもきちんと着替えた感じが出ます
バッグは小さい黒を一つだけ。仕事の荷物はロッカーに置いていくと、歩く姿まで軽くなります

someone's manual No.02 / Seoul, after work
画像はAIで生成しています

#デートコーデ #韓国ファッション #オフィスカジュアル #仕事帰りデート #婚活
```

- 曲は IG 側。歌なしか英語の軽い曲（No.01 と同じ系統でよい・ほかのシリーズの曲は避ける）。カバーは1カット目
- 特定ブランドの商品名は出さない

## 5. X（任意・同日 21:00 前後・画像1枚・リンクなし）

X の週の並び（`packs/2026-10-w3-x.md`）には入れていない。出すなら No.01 と同じ形で：

```
仕事の私から、少しだけ着替えたい日。
仕事帰りに1回目のデートへ向かう人の説明書を作りました。

聞かれる前にお店を3つ調べてある
近況報告が毎回2時間を超える
既読にしたら5分以内に返す

いくつ当てはまりましたか。数字だけで大丈夫です
```

## 6. セルフQA

- [x] お見合いの回ではない（1回目のデート）
- [x] 「彼」「彼氏」と書いていない。相手の性別を決めていない
- [x] 焦らせ・比較なし。「モテ」「勝負服」「目を惹く」を使っていない
- [x] 一言は全部18字以内。題は1行（16字）
- [x] 画像に文字を描かせない指定あり。ブランド名なし。AI 生成の開示あり
- [x] 絵文字なし
