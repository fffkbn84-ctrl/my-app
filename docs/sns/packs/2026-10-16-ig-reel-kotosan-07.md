# ことさん#7「回ってくる、あのマイク」制作キット（2026-10-16 金 18:00）

> 型は `docs/sns/series/kotosan-reel.md` §2-b（v2）。10/12 の判定で週1・金曜になってから最初の回。
> 判定で残った宿題「オチが平均再生2〜4秒より後ろにある」に、**尺の組み直しだけ**で答える回。並び（相手 → 言いかける → ごくん → 建前）は変えない。

## 0. この回で変えること（10/16）

### 0-a. 根拠：伸びた2本と、伸びなかった本の差

10/7〜10/15 のリールは**ほぼ全部リーチ 105〜190 で止まっている**（最初に配られる試しの枠）。
そこを抜けたのは、ぎっしり#1（1,588）と #4（2,578）の2本だけ。2本とも**3秒残存 56%**だった。
ほかは 9〜33%。ぎっしり#5 も #4 と同じ型だが、3秒残存 28%・平均再生4秒で枠の中に止まった（10/15 ふうか速報。正式な計測は 10/17）。

つまり**型の名前ではなく、最初の数秒で残るかどうかで次の枠に進むかが決まっている**。ことさんは平均再生2〜4秒なのに、オチ（建前）が 6.1 秒にあった。大半の人はオチを見ていない。

### 0-b. 変えたこと

| 変えたこと | 理由 |
|---|---|
| **尺 9.1 秒 → 6.4 秒。オチを 6.1 秒 → 4.0 秒に前倒し**（`build_reel.py kotosanv2q`） | 平均再生の4秒以内にオチを入れる。短いと2周目に入る人が出て、平均再生も伸びる |
| **相手の言葉を10字前後に** | カット1が 1.9 秒しかない。読み切れる長さに |
| **画面にいる人を5人に**（ことさん＋同僚4体） | 3秒残存は人の数で並んでいる（会議 38%／親戚3体 30%／1対1 21〜23%）。カラオケは人が多くて自然な場面 |
| 救いのカットなし | 軽い回（設定書§6）。救いを足すと尺が戻る |

判定：**3秒残存 35% 以上・平均再生 4 秒以上**なら速い版を続ける。#6（30%・3秒）より下なら、尺ではなく1カット目の絵の問題と見る。

## 1. 台本（6.4秒）

| # | 秒 | 画面 | 文字 | 音 |
|---|---|---|---|---|
| 帯 | 全編 | — | **回ってくる、あのマイク**／ことさんは、飲み込んだ。#7 | — |
| 1 | 0〜1.8 | カラオケの部屋。同僚4体が盛り上がっていて、右の1体がことさんにマイクを差し出している | 〔同僚〕「次、ことさんの番〜！」 | ポン／曲が始まる |
| 2 | 〜3.0 | **ことさんが真顔で、片手を小さく上げて断りかける** | 〔ことさん〕「私は聞く専…」 | ポン |
| 3 | 〜4.0 | **ことさんがまんまるにふくらむ。** 同僚たちは気づかずタンバリンを振っている | **（ごくん）** | ごくん・曲が止まる |
| 4 | 〜6.4 | **眼鏡がきらっと光り、マイクを両手で持って会釈** | 〔ことさん〕「じゃあ1曲だけ〜」 | キラッ → ポン／曲が戻る |

- 本音「私は聞く専…」の続き（門なので）は誰でも補える。言い返して空気を止めるより、1曲歌って終わらせる。見る人は「断っていいのに」と思う
- **毒の向き先は「全員に順番が回ってくる空気」**。マイクを渡す同僚1人を悪者にしない（相手も悪気なく盛り上げている）。性別・年齢を付けない。結婚相談所・婚活している人には向けない（設定書§5）
- 題は場面名ではなく、誰にでもある一言（#5 から）

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**最初に `docs/sns/assets/kotosan/kotosan-reference-v1.webp`（4面キャラシート）を添付する。**
4枚とも同じスレッドで続けて生成する。【ACTING】だけ差し替える。

```
Use the attached image as the exact character reference. Keep everything about the character identical: dusty blue drawstring pouch plush with a gathered top, terracotta drawstring cord with two wooden beads, no mouth, vertical oval matte black embroidered eyes that are slightly uneven, thin round gold wire glasses resting on the face, a cream felt staff ID badge with a small dusty blue square patch in its centre (no text, no letters, no logo on it) hanging slightly off-center on a thin terracotta cord, short round fabric arms, flat base. Looped fluffy fabric texture exactly like the reference, soft and fuzzy, not carved, with visible hand-stitched seams. Do not turn the character into clay. No cheek blush, no glossy eyes.

Scene: a tiny handmade polymer clay karaoke room set on a plain warm beige seamless background (#F5EEE6). Only a long low L-shaped clay sofa in dusty rose, and a small low clay table in front of it with a few tall clay glasses of pale orange and pale green juice, a small clay tambourine and a bowl of clay fries. No walls, no windows, no TV, no screen, no monitor, no posters, no other furniture. The character sits on the sofa at the left end, facing the camera. Four coworkers sit along the sofa to its right: small faceless clay figures with smooth round heads with no eyes, no nose, no mouth and no hair, soft rounded bodies, plain muted tops in oatmeal, sage green, mustard and dusty pink, nothing that shows gender or age. The coworker sitting right next to the character holds a small cream clay microphone. Their heads are at about the same height as the top of the character's head.

Composition: front view, camera at the character's eye level. The sofa, the table, the character and the coworkers are centred and fill the lower 60 percent of the image. The top 38 percent of the image is completely plain empty beige background. Keep exactly the same composition, camera, props and positions in every image of this thread; only the poses change.

【ACTING】

Lighting: soft diffused warm light from the upper left, one soft shadow. Clay keeps fingerprints and tool marks, soft matte finish.
No text, no letters, no numbers, no logos anywhere. No speech bubbles. No phones. No alcohol bottles, no beer mugs. No gold, no brass, no metallic parts except the character's gold glasses. Portrait 2:3 (1024x1536).
```

| # | 【ACTING】 |
|---|---|
| 1 | `The coworker right next to the character leans toward it with a cheerful, encouraging air, holding the cream microphone out toward the character with one short arm. The other three coworkers are lively: one shakes the tambourine above its head, one raises both arms, one claps. The character looks slightly to the side toward the microphone, eyes visible behind the glasses, no glare, a calm ordinary face.` |
| 2 | `The character turns to face the camera with a completely blank, flat, serious face: the matte black oval eyes are fully visible and perfectly still, no glare on the lenses. One short arm is raised a little with the palm out, as if about to politely refuse. The four coworkers stay in exactly the same poses as before, the microphone still held out.` |
| 3 | `The character's pouch body has suddenly inflated into a huge, perfectly round ball, about twice as wide as before and clearly bigger than the coworkers' heads, swelling upward into the empty beige space above. The fabric is stretched tight and smooth, the hand-stitched seams pulled taut. The gathered top is cinched shut hard so the terracotta drawstring bites deep into the fabric and the two wooden beads stick straight out sideways. Both matte black eyes are still visible behind the gold glasses, small and wide-open in the middle of the big round body, no glare, no mouth. The four coworkers stay in exactly the same poses as before, not noticing anything. Keep the looped fluffy fabric texture; do not turn it into clay or a balloon.` |
| 4 | `The character is back to its normal size, holding the small cream microphone with both short arms, and tips its whole body forward in a small polite bow. Both round gold wire lenses catch the light in a flat bright glare, so the eyes are not visible. The four coworkers cheer: the tambourine is raised high, two raise both arms.` |

### 崩れやすいところ（出たら作り直す）

- **口が生える**（最頻出）／目がツヤ目・丸目になる
- 同僚に顔・髪・性別・年齢の手がかり（ネクタイ・スカート・ひげ・眼鏡）が付く
- **壁・モニター・歌詞の画面が出る**（この回でいちばん出やすい。画面が出ると文字が描かれやすい）
- ビールジョッキ・お酒の瓶が出る／上の38%に何か写り込む
- 同僚が4体より増える・減る。カット1〜4で並びが変わる
- カット2の真顔が弱い（首をかしげる・眼鏡が光るのは不採用）。2だけ作り直してよい
- カット3は人形より大きくなってよい（#6 で決定。控えめだと飲み込んだことが伝わらない）
- 1枚ずつ 1024×1536 の原寸で貼ってもらう

## 3. 書き出し（Claude の担当）

```bash
python3 prep-futari.py <生成1.png> plate-1.png 200     # 2〜4 も同じ

B='["回ってくる、あのマイク","ことさんは、飲み込んだ。#7"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" say   <x> '["@同僚","次、ことさんの番〜！"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" say   <x> '["@ことさん","私は聞く専…"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" gokun <x> '["（ごくん）"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" say   <x> '["@ことさん","じゃあ1曲だけ〜"]'

python3 build_reel.py kotosanv2q kinda-ig-1016-kotosan07.mp4          # 6.4秒（ダミーで確認済み）
python3 add_sfx.py kinda-ig-1016-kotosan07.mp4 kinda-ig-1016-kotosan07-sfx.mp4 kotosan07
```

- しっぽの x・`TIP_Y` は生成画像を見てから決める（#6 は場面が下に寄って TIP_Y＝930 前後）
- `noto900.woff2`／`noto700.woff2` を作業フォルダに置く（#6 §7 の注意）
- 生成4枚は `docs/sns/assets/kotosan/` に WebP で commit：`kotosan-karaoke-mic-v1`／`-answer-v1`／`-puff-v1`／`-glare-bow-v1`

## 4. 音

曲は「のほほん」（#3〜#6 と同じ）。3.0秒（ごくん）で切り、4.0秒から戻す。
**曲の頭がすぐ鳴るところから使う**（1.8秒で最初の切り替えが来るので、前奏の長い位置は合わない）。

## 5. キャプション

```
カラオケで、順番が回ってきた。
「私は聞く専…」まで出かけて、飲み込みました。

断るより、1曲歌うほうが早く終わる日もある。
歌わなくても、ちゃんとその場にいたことになります。

マイクが回ってくるたびに少し身構える人へ、送ってあげてください。

あなたが今日飲み込んだことも、コメントに置いていってください。

──
ことさんの職場、Kindaは、結婚相談所をカウンセラーの口コミで選べるサービスです。
急ぐための場所ではなく、自分のタイミングで選ぶための場所として。

#ことさんは飲み込んだ #カラオケ #あるある
```

- セルフチェック：毒は「順番が回ってくる空気」に向いていて、同僚・相談所・婚活している人を責めていない。「男女」「異性」を書いていない。焦らせない・比べない。絵文字なし。ハッシュタグ3個。「結婚相談所」は機能の説明（CLAUDE.md §2 の SNS 二層構造の範囲）
- 「歌わなくても、ちゃんとその場にいたことになります」は聞く専の人の肯定。飲み込んだことを我慢として褒めない

投稿時：カバーは1カット目を手動指定／AI 生成の開示。**10/19 に 3秒残存・平均再生・スキップ・送信**を測り、§0-b の判定に当てる。

## 6. 制作記録（2026-10-16）

- ChatGPT の4枚を全部採用（貼られた順は 4→3→2→1 の逆順）。口なし・同僚は顔なしで性別や年齢の手がかりなし・壁やモニターなし・ジョッキなし
- カット4はお辞儀ではなく、マイクを片手で持った正面の姿。眼鏡は光っているので建前の顔として成立していて、そのまま採用
- 場面が画面の下半分に寄るので、しっぽの先を下げた：**TIP_Y＝1010／1000／820（gokun）／960**、x＝450／190／190／190
- 書き出し：`kinda-ig-1016-kotosan07-sfx.mp4`（6.40秒・効果音 kotosan07）
- 素材：`assets/kotosan/kotosan-karaoke-{mic,answer,puff,glare-mic}-v1.webp`
