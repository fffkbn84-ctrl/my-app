# ことさん#3「美容院の『このあとお出かけ？』」制作キット（2026-09-30 水 18:00）

> **ことさん v2 の最初の回。** 改修の中身と理由は `docs/sns/series/kotosan-reel.md` §2-b・§3-b。
> 元になった分析は `docs/sns/ig-strategy-2026-09.md` §18（伸びているリール3本）。

## 0. 何を変えたか（#1・#2 との違い）

| | #1・#2（v1） | #3 から（v2） |
|---|---|---|
| 題 | 1カット目だけ、明朝の小さなシリーズ名 | **黒帯・白の太ゴシックで全カット出しっぱなし**。その回の皮肉の題＋小さくシリーズ名 |
| 相手 | 1カット目だけ（#1 会議・#2 上司） | **全カット同じ構図で画面にいる**（顔のないクレイ人形） |
| 文字 | 状況・表・本音・ごくんの4回。全部読ませる | **1カットに1つだけ**。状況説明は捨てた（絵で分かる） |
| 笑い | 本音の文章 | **真顔 ↔ 建前の顔の切り替え** |
| 尺 | 12.15秒・ディゾルブ 0.35秒 | **10.1秒・0.1秒のほぼカット切り** |

**ことさんには口がない。** なので「笑顔」＝眼鏡が光る建前の顔（シリーズで確立済み）、
「真顔」＝眼鏡が光らず、縦長の目がそのままこちらを見ている無表情、とする。

## 1. 台本

| # | 秒 | 画面 | 文字 | 音 |
|---|---|---|---|---|
| 帯 | 全編 | — | **充実した休日の答え方**／ことさんは、飲み込んだ。#3 | — |
| 1 | 0〜2.8 | 美容師がくしを持って、ことさんに話しかけている。ことさんは普通の顔 | 美容師「このあと／お出かけですか？」（白い吹き出し） | ポン／曲が始まる |
| 2 | 2.7〜4.9 | **ことさんが真顔でまっすぐこちらを見る。** 美容師は気づかず髪をとかしている | 心の声「帰って寝る」（薄いローズの思考の吹き出し） | **カッ・曲が止まる** |
| 3 | 4.8〜7.4 | **眼鏡がきらっと光り、小さく会釈**（建前の顔） | ことさん「はい、ちょっと〜」（白い吹き出し） | キラッ → ポン |
| 4 | 7.3〜10.1 | ことさんがまんまるにふくらむ。美容師は両手を上げて「いいですね〜」の身ぶり | **（ごくん）** | ごくん／曲がフェードインで戻る |

- 題は Notion のキャプション「予定がない休日も、ちゃんと予定です。」と同じ皮肉の向き
- 笑う対象は**ことさん自身の建前**。美容師は悪者にしない（気づかず、ただ感じがいい）
- 真顔のカット2 に「帰って寝る」を置くのは、何を飲み込んだかが分からないと送る理由にならないため。
  文字は5字まで減らした（元の本音は「帰って寝る、という予定が」）

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**最初に `docs/sns/assets/kotosan/kotosan-reference-v1.webp`（4面キャラシート）を添付する。**
4枚とも同じスレッドで続けて生成する（セットと美容師をそろえるため）。

### 共通（4枚とも、下の【ACTING】だけ差し替える）

```
Use the attached image as the exact character reference. Keep everything about the character identical: dusty blue drawstring pouch plush with a gathered top, terracotta drawstring cord with two wooden beads, no mouth, vertical oval matte black embroidered eyes that are slightly uneven, thin round gold wire glasses resting on the face, a cream felt staff ID badge with a small dusty blue square patch in its centre (no text, no letters, no logo on it) hanging slightly off-center on a thin terracotta cord, short round fabric arms, flat base. Looped fluffy fabric texture exactly like the reference, soft and fuzzy, not carved, with visible hand-stitched seams. Do not turn the character into clay. No cheek blush, no glossy eyes.

Scene: a tiny handmade polymer clay hair salon set on a plain warm beige seamless background (#F5EEE6). No walls, no mirror, no shelves, no window, no other furniture. The character sits on one small round cream clay salon chair, slightly left of centre, facing the camera, with a small cream clay cape draped over its shoulders and tied loosely below the glasses. Standing just behind the chair on the right is a hairdresser: a small faceless clay figure with a smooth round head with no eyes, no nose, no mouth and no hair, a soft rounded body, a plain oatmeal top and a sage green clay apron, nothing that shows gender or age. The hairdresser is taller than the character, and its head is at the same height as the top of the character's head.

Composition: front view, camera at the character's eye level. The chair, the character and the hairdresser are centred and fill the lower 60 percent of the image. The top 38 percent of the image is completely plain empty beige background. Keep exactly the same composition, camera and positions in every image of this thread; only the poses change.

【ACTING】

Lighting: soft diffused daylight from the upper left, one soft shadow. Clay keeps fingerprints and tool marks, soft matte finish.
No text, no letters, no numbers, no logos anywhere. No speech bubbles. No scissors and no metal tools: the hairdresser holds only a small cream clay comb. No gold, no brass, no metallic parts except the character's gold glasses. Portrait 2:3 (1024x1536).
```

| # | 【ACTING】 |
|---|---|
| 1 | `The hairdresser leans slightly toward the character in a chatty, friendly way, holding the clay comb up near the character's head, its round head tilted as if asking a question. The character looks slightly up and to the side toward the hairdresser, eyes visible behind the glasses, no glare, a calm ordinary face.` |
| 2 | `The character now stares straight into the camera with a completely blank, flat, expressionless face: the matte black oval eyes are fully visible and perfectly still, no glare on the lenses, the body sits dead straight and motionless, arms flat against the sides under the cape. The hairdresser does not notice and keeps combing the top of the character's head, looking down at the work.` |
| 3 | `The character tips its whole body forward in a small polite bow toward the hairdresser, one short round arm lifted slightly out from under the cape. Both round gold wire lenses catch the light in a flat bright glare, so the eyes are not visible. The hairdresser holds the comb still and looks at the character.` |
| 4 | `The character's pouch body has swollen into a round ball, clearly wider than in the reference, the cape stretched tight around it, and the gathered top is cinched shut hard so the terracotta drawstring bites into the fabric and the two wooden beads stick out sideways. Both matte black eyes are visible behind the glasses, no glare. The hairdresser has raised both arms happily, comb in one hand, as if saying "that sounds lovely".` |

### 崩れやすいところ（出たら作り直す）

- **口が生える**（最頻出）／目がツヤ目・丸目になる
- 鏡・はさみ・金属の道具が湧く（プロンプトで禁止済み。出たら作り直す）
- 美容師に顔・髪・性別の手がかりが付く
- 4枚で**ことさんと美容師の位置・大きさが変わる**（帯と吹き出しの位置が崩れる。とくに2→3の切り替えで目立つ）
- 上の38%に何か写り込む
- **カット2の真顔が弱い**（この回のオチ）。首をかしげる・目が笑う・眼鏡が光るのはすべて不採用。2だけ作り直してよい
- 1枚ずつ 1024×1536 の原寸で貼ってもらう（プレビューは不可。`kotosan-poses.md` §9 の解像度の件）

## 3. 書き出し（Claude の担当）

```bash
# 台紙：横幅いっぱい・上端 y=200（「ふたり」と同じ）
python3 prep-futari.py <生成1.png> plate-1.png 200     # 2〜4 も同じ

B='["充実した休日の答え方","ことさんは、飲み込んだ。#3"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" say   760 '["このあと","お出かけですか？"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" think 400 '["帰って寝る"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" say   400 '["はい、ちょっと〜"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" gokun 540 '["（ごくん）"]'

python3 build_reel.py kotosanv2 kinda-ig-0930-kotosan03.mp4          # 10.1秒
python3 add_sfx.py kinda-ig-0930-kotosan03.mp4 kinda-ig-0930-kotosan03-sfx.mp4 kotosan03
```

- しっぽの x（760／400）は**仮の値**。生成画像で美容師とことさんの頭の位置を見てから合わせる
- 生成4枚は `docs/sns/assets/kotosan/` に WebP（quality 95）で入れて commit する。
  ファイル名：`kotosan-salon-talk-v1`／`-blank-v1`／`-glare-bow-v1`／`-puff-v1`

## 4. 音

効果音は焼き込み済み（`add_sfx.py kotosan03`）。**曲は Edits で「ふたり」#1 と同じ形**にする：
0秒から曲 → **2.7秒（真顔のカッ）で切る** → カット4（7.3秒〜）でフェードインして戻し、10秒でフェードアウト。
曲はことさん専用の「のほほん」（`ig-strategy` §14）。

## 5. キャプション（Notion のまま・直すところなし）

```
美容院の「このあとお出かけですか？」に、正直に答えたことがありません。

予定がない休日も、ちゃんと予定です。

#ことさんは飲み込んだ #休日の過ごし方 #美容院あるある
```

セルフチェック：毒の矛先は自分の建前で、美容師・結婚相談所・婚活している人に向いていない。焦らせない。絵文字なし。

投稿時：カバーは1カット目を手動指定／AI 生成の開示を付ける。7日後（10/7）に**送信数・3秒残存・シェア数・フォロー数**。

> **テストとの関係。** #1・#2 は v1、#3 以降は v2 になるので、10/16 の判定は「v1 の2本 vs v2 の4本」の比較になる。
> v2 に変えたことが効いたのか、題材の差なのかは完全には切り分けられない（2026-09-27 ふうか OK 済みの変更）。
