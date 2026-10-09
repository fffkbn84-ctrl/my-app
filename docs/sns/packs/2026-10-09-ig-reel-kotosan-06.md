# ことさん#6「毎年くる、あの質問」制作キット（2026-10-09 金 18:00・テスト最終回）

> 型は `docs/sns/series/kotosan-reel.md` §2-b（v2）。作り方は #5（`2026-10-07-ig-reel-kotosan-05.md`）と同じ。
> **テスト最終回なので型（相手 → 言いかける → ごくん → 建前）は変えない。** 変えたのは下の §0 の3点だけ。

## 0. Notion の原案から変えたこと（10/9 数字を見て）

Notion の原案は v1 の並び（状況の文字 → 表 → 本音 → ごくん → 救い・5枚とも別画像）のままだった。

| 変えたこと | 理由（数字） |
|---|---|
| **v2 の並びに組み直した** | 2026-10-02 の決裁で #3 以降は v2 に統一。原案の「親戚の集まりにて。」の状況文字は、1カット目に読むものを増やす（10/6 A vs B が 18% で止まった仮説と同じ） |
| **親戚を3体にした**（話すのは1体だけ） | 3秒残存は「画面にいる人の数」で並ぶ：ぎっしり#1（大勢）56%／ことさん#1（会議・人形2体）38%／#3・#4（1対1）23%。親戚の集まりは人が多くて自然な場面なので、型を変えずに人を増やせる |
| **本音を「それ、去年も聞…」に**（10/9 差し替え） | 原案「そのご縁、どこで配ってるか」は、v2 だと「ご縁」が建前（後）にしか出ないので「その」が何も指さない。一度「ご縁って、どこで…」にしたが、ふうかさん「微妙」で差し替え（理由は下）。題「毎年くる、あの質問」と本音が同じことを指すので、1カット目の題と2カット目がつながる |

題は #5 で試した「見る人のこと」の書き方にそろえた：**毎年くる、あの質問**（結婚の語を題に出さない。結婚に限らず「まだ〇〇しないの？」全般に読める）。

## 1. 台本（11.5秒）

| # | 秒 | 画面 | 文字 | 音 |
|---|---|---|---|---|
| 帯 | 全編 | — | **毎年くる、あの質問**／ことさんは、飲み込んだ。#6 | — |
| 1 | 0〜2.5 | 座卓を囲む親戚の集まり。右の親戚がことさんのほうへ身を乗り出す | 〔親戚〕「まだ結婚／しないの？」 | ポン／曲が始まる |
| 2 | 〜4.4 | **ことさんが真顔で、親戚のほうへ向き直りかける** | 〔ことさん〕「それ、去年も聞…」 | ポン |
| 3 | 〜6.1 | **ことさんがまんまるにふくらむ。** 親戚たちは気づかず笑っている | **（ごくん）** | ごくん・曲が止まる |
| 4 | 〜8.7 | **眼鏡がきらっと光り、湯のみを両手に会釈** | 〔ことさん〕「ご縁があれば〜」 | キラッ → ポン／曲が戻る |
| 5 | 〜11.5 | 親戚たちは別の話に移っている。ことさんはひとり湯のみでお茶を飲んでいる。眼鏡は光らず、目が見える穏やかな顔 | 「自分のペースでいい」（画面下・`label`） | 音なし |

- 本音の続き（「かれました」）は誰でも補える。v2 の条件どおり
- **「ご縁って、どこで…」をやめた理由**（10/9 ふうか「微妙」）：①続き（配ってるんですか）が「ご縁を配る」という言葉遊びを知らないと補えず、頭の数文字で残りが立たない ②皮肉の向きが「ご縁」という概念に向いて、相談所が扱っているもの（出会い・ご縁）を茶化すようにも読める ③理不尽さがない。親戚の質問のいちばんの理不尽は**毎年同じことを聞かれる**ことで、そこを飲み込むほうが「わかる」になる
- 建前「ご縁があれば〜」は、毎年同じ答えを返している側の定型。質問も答えも毎年同じ、という往復が笑いになる
- **毒の向き先は、毎年くり返される「まだ結婚しないの？」という定型の質問**。親戚個人を責める言葉は置かない。
  結婚相談所・カウンセラー・婚活している人には向けない（設定書§5）
- 救いは設定書§6 の「重さのある回のみ」に当たる（親戚の結婚の質問は軽くない）。帯の題は残したまま、文字は画面下の一言だけ
- 「自分のペース」は CLAUDE.md §3 の「自分のペースを肯定する」そのもの。急かす質問への返しとして、比べず・励まさずに置く

## 2. ChatGPT プロンプト（同じスレッドで5枚・2:3）

**最初に `docs/sns/assets/kotosan/kotosan-reference-v1.webp`（4面キャラシート）を添付する。**
5枚とも同じスレッドで続けて生成する。【ACTING】だけ差し替える。

```
Use the attached image as the exact character reference. Keep everything about the character identical: dusty blue drawstring pouch plush with a gathered top, terracotta drawstring cord with two wooden beads, no mouth, vertical oval matte black embroidered eyes that are slightly uneven, thin round gold wire glasses resting on the face, a cream felt staff ID badge with a small dusty blue square patch in its centre (no text, no letters, no logo on it) hanging slightly off-center on a thin terracotta cord, short round fabric arms, flat base. Looped fluffy fabric texture exactly like the reference, soft and fuzzy, not carved, with visible hand-stitched seams. Do not turn the character into clay. No cheek blush, no glossy eyes.

Scene: a tiny handmade polymer clay family gathering set on a plain warm beige seamless background (#F5EEE6). Only a small low round wooden clay table (a Japanese chabudai) in the middle, with a few small clay dishes on it (a plate of round rice balls, a bowl of mandarin oranges, two small teacups), and a short strip of pale tatami-green clay floor under it. No walls, no windows, no shelves, no TV, no other furniture. The character sits on the floor at the left side of the table, facing the camera, a small cream clay teacup in front of it on the table. Around the table sit three relatives: small faceless clay figures with smooth round heads with no eyes, no nose, no mouth and no hair, soft rounded bodies, plain muted tops in oatmeal, sage green and dusty pink, nothing that shows gender or age. One relative sits on the right side of the table, closest to the character; the other two sit behind the table in the middle, slightly smaller in the distance. Their heads are at about the same height as the top of the character's head.

Composition: front view, camera at the character's eye level. The table, the character and the relatives are centred and fill the lower 60 percent of the image. The top 38 percent of the image is completely plain empty beige background. Keep exactly the same composition, camera, props and positions in every image of this thread; only the poses change.

【ACTING】

Lighting: soft diffused warm light from the upper left, one soft shadow. Clay keeps fingerprints and tool marks, soft matte finish.
No text, no letters, no numbers, no logos anywhere. No speech bubbles. No phones. No alcohol bottles. No gold, no brass, no metallic parts except the character's gold glasses. Portrait 2:3 (1024x1536).
```

| # | 【ACTING】 |
|---|---|
| 1 | `The relative on the right leans forward over the table toward the character in a friendly, curious way, one arm raised slightly, round head tilted as if asking a casual question. The two relatives in the back are turned toward the character too, as if waiting to hear the answer. The character looks slightly up and to the side toward the right relative, eyes visible behind the glasses, no glare, a calm ordinary face.` |
| 2 | `The character turns to face the camera with a completely blank, flat, serious face: the matte black oval eyes are fully visible and perfectly still, no glare on the lenses. Its body leans slightly forward toward the right relative, one short arm lifted a little, as if about to point out something obvious. The three relatives stay in exactly the same poses as before.` |
| 3 | `The character's pouch body has suddenly swollen into a round ball, clearly wider than in the reference, and the gathered top is cinched shut hard so the terracotta drawstring bites into the fabric and the two wooden beads stick out sideways. Both matte black eyes are visible behind the glasses, no glare. The three relatives are still in exactly the same poses, cheerful, not noticing anything.` |
| 4 | `The character is back to its normal size, holding the small cream teacup with both short arms, and tips its whole body forward in a small polite bow toward the right relative. Both round gold wire lenses catch the light in a flat bright glare, so the eyes are not visible. The right relative leans back, satisfied, one arm raised in a pleased gesture.` |
| 5 | `The three relatives have turned toward each other in the middle and are chatting among themselves, no longer looking at the character. The character sits alone at the left side, normal size, quietly sipping from the small cream teacup held with both short arms, the eyes visible behind the glasses, no glare, a soft relaxed face. A thin wisp of steam rises from the cup.` |

### 崩れやすいところ（出たら作り直す）

- **口が生える**（最頻出）／目がツヤ目・丸目になる
- 親戚に顔・髪・性別・年齢の手がかり（白髪・ひげ・エプロン・眼鏡）が付く。**この回でいちばん出やすい**
- 座卓のまわりに壁・ふすま・テレビ・お酒の瓶が増える／上の38%に何か写り込む
- 親戚が3体より増える・減る。カット1〜4で親戚の位置が変わる
- カット2の真顔が弱い（首をかしげる・眼鏡が光るのは不採用）。2だけ作り直してよい
- カット5で眼鏡が光る（光ると建前の顔に戻ってしまう）
- 1枚ずつ 1024×1536 の原寸で貼ってもらう

## 3. 書き出し（Claude の担当）

```bash
python3 prep-futari.py <生成1.png> plate-1.png 200     # 2〜5 も同じ

B='["毎年くる、あの質問","ことさんは、飲み込んだ。#6"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" say   <x> '["@親戚","まだ結婚","しないの？"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" say   <x> '["@ことさん","それ、去年も聞…"]'
TIP_Y=650 NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" gokun <x> '["（ごくん）"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" say   <x> '["@ことさん","ご縁があれば〜"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-5.png f5.png "$B" label 0  '["自分のペースでいい"]'

python3 build_reel.py kotosanv2s kinda-ig-1009-kotosan06.mp4          # 11.5秒
python3 add_sfx.py kinda-ig-1009-kotosan06.mp4 kinda-ig-1009-kotosan06-sfx.mp4 kotosan06
```

- `kotosanv2s`（v2 ＋救い1枚）と効果音 `kotosan06` は 10/9 に追加。ダミー画像で 11.50 秒の書き出しを確認済み
- しっぽの x は生成画像を見てから決める（#5 は 830／420／390／330）
- カット5の一言（`label`）は y=1290〜1376。座卓や親戚と重なって読めなければ `LABEL_Y` で上下させる
- 生成5枚は `docs/sns/assets/kotosan/` に WebP で commit：`kotosan-relatives-ask-v1`／`-answer-v1`／`-puff-v1`／`-glare-bow-v1`／`-tea-v1`

## 4. 音

#3〜#5 と同じ。曲は「のほほん」、4.4秒（ごくん）で切り、6.1秒からフェードインで戻す。救い（8.7秒〜）は効果音なし。

## 5. キャプション

```
親戚の集まりの、あの質問。
「それ、去年も聞…」まで出かけて、しまいました。

答えを急かされても、決めるのは自分のペースでいい。
毎年この質問を一緒に乗り切っている人へ、送ってあげてください。

あなたが今日飲み込んだことも、コメントに置いていってください。

──
ことさんの職場、Kindaは、結婚相談所をカウンセラーの口コミで選べるサービスです。
急ぐための場所ではなく、自分のタイミングで選ぶための場所として。

#ことさんは飲み込んだ #親戚の集まり #あるある
```

- 原案から変えたところ：①1行目の後に、飲み込んだ言葉を置いた（#5 と同じ書き方）②**送る相手を指定する一行**を足した（送信が全回0。#5 で試し始めたものを最終回にもそろえる）③サービス説明のすぐ後に「急ぐための場所ではない」を置いた（「急かされなくていい」と言った直後に相談所の紹介が来ると、急かしの側に読めるため）④ハッシュタグ `#本音` を `#あるある` に（#5 とそろえる）
- セルフチェック：毒は定型の質問と言い回しに向いていて、親戚個人・相談所・婚活している人を責めていない。「男女」「異性」を書いていない。焦らせない・比べない。絵文字なし。ハッシュタグ3個。キャプションの「結婚相談所」は機能の説明（CLAUDE.md §2 の SNS 二層構造の範囲）

投稿時：カバーは1カット目を手動指定／AI 生成の開示。**3日後（10/12）に送信数・3秒残存・シェア数・フォロー数**を測り、そのままテストの判定（`kotosan-reel.md` §7・§8）。

## 6. 判定に向けて（10/9 時点の数字）

| 回 | リーチ | 3秒残存 | スキップ | 送信 | フォロー |
|---|---|---|---|---|---|
| #1（v1・会議・人形2体） | 144 | 38% | 66.7% | 0 | 0 |
| #2（v1） | 未記入 | — | — | — | — |
| #3（v2・美容院） | 187 | 23% | 79.7% | 0 | 1 |
| #4（v2・居酒屋） | 147 | 23% | 78.2% | 0 | 0 |
| #5（v2・街角） | 10/10 計測 | | | | |
| #6（v2・親戚） | 10/12 計測 | | | | |

- 合否指標のシェア・フォローは、ここまでほぼ0。**#6 で人を増やして 3秒残存が #1 の水準（35%前後）に戻るか**が、判定でいちばん使える材料になる
- #2 の数字が Notion に入っていない。判定前にふうかさんに埋めてもらう
