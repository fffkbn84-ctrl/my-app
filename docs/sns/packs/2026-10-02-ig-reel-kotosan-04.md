# ことさん#4「ウーロン茶一杯の割り勘」制作キット（2026-10-02 金 18:00）

> 型は `docs/sns/series/kotosan-reel.md` §2-b（v2）。作り方は #3（`2026-09-30-ig-reel-kotosan-03.md`）と同じ。

## 0. 差し替えの経緯（2026-10-02 ふうか決裁）

元の #4 は Kinda 社内回「口コミを読んでいて、ちょっと会ってみたい」だった。
**理不尽なこと・強く言えないことを飲み込むキャラとして確立したい**（ふうか）ため、職場の飲み会の割り勘に差し替えた。

- 口コミの回は、ことさんが**飲み込むもの**がない（会ってみたい、は理不尽ではない）。v2 の「言いかけて飲み込む」が成立しない
- 割り勘は**絵だけで理不尽が分かる**（ジョッキが並ぶ中、ことさんの前だけウーロン茶）。1カット目で何かが起きている
- 「私、ウーロン茶…」の続き（しか飲んでない）は誰でも補える。言いかけの型に合う
- 机の場面が #1・#2 で続いたので場所も変わる
- 毒は割り勘という慣習に向く（設定書§5「世間の普通」）。幹事・同僚個人を責める言葉は置かない

**社内回にしなかった理由。** 社内カテゴリの役割は「Kinda が何の会社かを業務の日常として見せる」（設定書§7）。
理不尽ネタを社内の会議に置いても Kinda の業務は見えず、#1 と同じ会議の絵になるだけ。
設定上は Kinda 運営部の飲み会なので「職場」として扱い、カテゴリは仕事。
サービスの説明は #6 のキャプションに残っている。社内回は 10/12 判定後に v2 の形で考え直す。

## 1. 台本

| # | 秒 | 画面 | 文字 | 音 |
|---|---|---|---|---|
| 帯 | 全編 | — | **ウーロン茶一杯の割り勘**／ことさんは、飲み込んだ。#4 | — |
| 1 | 0〜2.6 | 幹事が伝票を持って、ことさんに話しかけている | 〔幹事〕「じゃあ、ひとり／4,500円で〜」 | ポン／曲が始まる |
| 2 | 2.5〜4.5 | **ことさんが真顔で言いかける**（少し前のめり・片手がウーロン茶のほうへ） | 〔ことさん〕「私、ウーロン茶…」 | ポン |
| 3 | 4.4〜6.2 | **ことさんがまんまるにふくらむ。** 幹事は気づかず待っている | **（ごくん）** | ごくん・曲が止まる |
| 4 | 6.1〜9.1 | **眼鏡がきらっと光り、会釈。** 幹事は両手を上げて喜んでいる | 〔ことさん〕「楽しかったです〜」 | キラッ → ポン／曲が戻る |

- オチは「払うのに楽しかったと言う」建前の顔。金額は言わせない（4,500円は幹事の言葉だけ）

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**最初に `docs/sns/assets/kotosan/kotosan-reference-v1.webp`（4面キャラシート）を添付する。**
4枚とも同じスレッドで続けて生成する。

### 共通（【ACTING】だけ差し替える）

```
Use the attached image as the exact character reference. Keep everything about the character identical: dusty blue drawstring pouch plush with a gathered top, terracotta drawstring cord with two wooden beads, no mouth, vertical oval matte black embroidered eyes that are slightly uneven, thin round gold wire glasses resting on the face, a cream felt staff ID badge with a small dusty blue square patch in its centre (no text, no letters, no logo on it) hanging slightly off-center on a thin terracotta cord, short round fabric arms, flat base. Looped fluffy fabric texture exactly like the reference, soft and fuzzy, not carved, with visible hand-stitched seams. Do not turn the character into clay. No cheek blush, no glossy eyes.

Scene: a tiny handmade polymer clay izakaya table set on a plain warm beige seamless background (#F5EEE6). No walls, no shelves, no window, no lanterns, no other furniture. One low rectangular light wood clay table runs across the lower part of the image. The character sits behind the table slightly left of centre, facing the camera, its head well above the tabletop. On the table: five large clay beer mugs with amber beer and thick white foam, most of them half empty, spread across the table in front of empty places; a few small clay plates with leftover edamame and karaage. Directly in front of the character stands only one tall clear clay glass of dark brown iced oolong tea with ice cubes and no foam, clearly different from the beer mugs. Sitting behind the table on the right is the party organiser: a small faceless clay figure with a smooth round head with no eyes, no nose, no mouth and no hair, a soft rounded body, a plain oatmeal top, nothing that shows gender or age. Its head is at the same height as the top of the character's head.

Composition: front view, camera at the character's eye level. The table, the character and the organiser are centred and fill the lower 60 percent of the image. The top 38 percent of the image is completely plain empty beige background. Keep exactly the same composition, camera, table items and positions in every image of this thread; only the poses change.

【ACTING】

Lighting: soft diffused warm light from the upper left, one soft shadow. Clay keeps fingerprints and tool marks, soft matte finish.
No text, no letters, no numbers, no logos anywhere, including on the bill slip. No speech bubbles. No money, no coins, no cards. No gold, no brass, no metallic parts except the character's gold glasses. Portrait 2:3 (1024x1536).
```

| # | 【ACTING】 |
|---|---|
| 1 | `The organiser leans slightly toward the character in a cheerful, chatty way, holding up a small blank cream clay bill slip in one hand, its round head tilted as if announcing something. The character looks slightly up and to the side toward the organiser, eyes visible behind the glasses, no glare, a calm ordinary face.` |
| 2 | `The character turns to face the camera with a completely blank, flat, honest face: the matte black oval eyes are fully visible and perfectly still, no glare on the lenses. It leans slightly forward and one short round arm is lifted a little toward its glass of oolong tea, as if it has just started to say something about it. The organiser waits with the bill slip held still, round head tilted, listening.` |
| 3 | `The character's pouch body has suddenly swollen into a round ball, clearly wider than in the reference, and the gathered top is cinched shut hard so the terracotta drawstring bites into the fabric and the two wooden beads stick out sideways. Both matte black eyes are visible behind the glasses, no glare. The organiser is still waiting in exactly the same pose as before, bill slip held still, not noticing anything.` |
| 4 | `The character is back to its normal size and tips its whole body forward in a small polite bow toward the organiser, one short round arm lifted slightly. Both round gold wire lenses catch the light in a flat bright glare, so the eyes are not visible. The organiser has raised both arms happily, bill slip in one hand, as if saying "great, thanks everyone".` |

### 崩れやすいところ（出たら作り直す）

- **口が生える**（最頻出）／目がツヤ目・丸目になる
- **ウーロン茶がビールと見分けられない**（泡が付く・ジョッキになる）。この回の命。出たら作り直す
- ウーロン茶がことさんの前以外にも置かれる
- 伝票・ジョッキに文字が出る／お金が描かれる
- 幹事に顔・髪・性別の手がかりが付く
- 4枚で机の上のもの・位置・大きさが変わる（2→3 でとくに目立つ）
- 上の38%に提灯や壁が写り込む
- カット2の真顔が弱い（首をかしげる・眼鏡が光るのは不採用）。2だけ作り直してよい
- カット3で幹事が動く
- 1枚ずつ 1024×1536 の原寸で貼ってもらう

## 3. 書き出し（Claude の担当）

```bash
python3 prep-futari.py <生成1.png> plate-1.png 200     # 2〜4 も同じ

B='["ウーロン茶一杯の割り勘","ことさんは、飲み込んだ。#4"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" say   800 '["@幹事","じゃあ、ひとり","4,500円で〜"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" say   400 '["@ことさん","私、ウーロン茶…"]'
TIP_Y=690 NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" gokun 360 '["（ごくん）"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" say   380 '["@ことさん","楽しかったです〜"]'

python3 build_reel.py kotosanv2 kinda-ig-1002-kotosan04.mp4          # 9.1秒
python3 add_sfx.py kinda-ig-1002-kotosan04.mp4 kinda-ig-1002-kotosan04-sfx.mp4 kotosan03   # 秒が #3 と同じなので流用
```

- しっぽの x は実際の生成画像に合わせた値（2026-10-02 確定：800／400／360／380）
- **3カット目は `TIP_Y=690`。** ふくらんだ頭が高く、既定（780）だと「（ごくん）」が頭のてっぺんに重なった。
  `render-kotosan-v2.js` に環境変数 `TIP_Y`（文字の下端の高さ・既定 780）を足した。既定の出力は変わらない（cmp で確認）
- 生成4枚は `docs/sns/assets/kotosan/` に WebP（quality 95）で commit。
  ファイル名：`kotosan-izakaya-bill-v1`／`-answer-v1`／`-puff-v1`／`-glare-bow-v1`

## 4. 音

#3 と同じ。曲は「のほほん」、4.4秒（ごくん）で切り、6.1秒からフェードインで戻す。

## 5. キャプション

```
飲み会の最後の「じゃあ、ひとり4,500円で〜」。
ウーロン茶一杯で、4,500円。
今夜いちばん高いウーロン茶を飲んだのは、たぶん私です。

言えなかったので、楽しかったことにしておきます。

あなたが今日飲み込んだことも、コメントに置いていってください。

#ことさんは飲み込んだ #会社員あるある #飲み会あるある
```

キャプションは 10/2 に直した（ふうか指摘：「同じ金額が届きます」は詩的で意味が取れない）。ツッコミは「いちばん高いウーロン茶」に置き、自分に向けた。
セルフチェック：毒は割り勘の慣習と、言えなかった自分に向いている。幹事・お酒を飲む人を責めていない。
年齢・性別・婚活に触れない。焦らせない。絵文字なし。ハッシュタグ3個。

投稿時：カバーは1カット目を手動指定／AI 生成の開示を付ける。3日後（10/5）に**送信数・3秒残存・シェア数・フォロー数**。

## 6. 制作記録（2026-10-02）

- ChatGPT で4枚とも1回で採用。口なし・ウーロン茶はビールと見分けがつく・幹事は2→3で同じ姿勢
- カット2の腕の上がりは弱い（ウーロン茶を指すほどではない）が、真顔とグラスの位置で伝わるので採用
- 書き出し：`kinda-ig-1002-kotosan04-sfx.mp4`（9.10秒・1080×1920・効果音は kotosan03 を流用）
