# IGリール制作キット｜ぎっしり情景#7 日曜11時、ホテルのラウンジ（2026-10-23 金 20:00）

> 型の正は `docs/sns/series/gisshiri-jokei.md`。下敷きは #4（`packs/2026-10-14-ig-reel-gisshiri-04-lounge.md`・画像 `assets/gisshiri/lounge-v2.webp`）。
> どちらを出すかは `packs/2026-10-w3-ig.md` §2 で決めてあった（#6 が 1,000超なら A 改札／110前後なら B ラウンジの朝）。

- **題**：日曜11時、ホテルのラウンジ ／ **問いかけ**：あなたは、何番？
- **場面**：#4 と同じラウンジの朝。初めて会う席がいくつかあって、関係ない人も混ざる
- **見る数字**：リーチ（#4 の 3,465 に近づくか、110前後か）・スキップ率

## 0. なぜ B（ラウンジの朝）にしたか

| 回 | 場面 | 初めて会う？ | リーチ | 3秒残存 | スキップ |
|---|---|---|---|---|---|
| #1 駅前 | 待ち合わせ10分前 | はい | 1,588 | 56% | 47% |
| #4 ラウンジ | 初対面3分目 | はい | **3,465** | 58% | 45.9% |
| #5 公園 | 慣れたふたり | いいえ | 111 | 28% | 73% |
| #6 ロビー | お見合いの10分前 | はい | **105** | 16% | 86.7% |

- #6 は「初めて会う直前の緊張」の軸に入っていたのに、#5 と同じ 110 前後だった。平均再生は1秒。**1カット目でほぼ全員が離れている**
- だから「テーマが当たれば伸びる」とはまだ言えない。#1・#4 が伸びたのは、場面の力なのか配られ方の波なのか、区別がついていない
- #7 は**伸びた #4 を、構図・家具・床・人の配置ごと残して、時間帯と小物だけ変える**。これで確かめる
  - 1,000超 → 伸びるかどうかは「絵」で決まっている。#4 の絵に近いものほど届く（次は #4 の構図のまま場所を変える）
  - 110前後 → 同じ絵でも届かない。#1・#4 は配られ方の波だった可能性が高い。ぎっしりの本数を見直す材料にする（`ig-strategy-2026-09.md` §21-b）
- 同じ週の #6 ロビー（10/19）とは4日あく。ロビー（回転ドア・花・フロント）とラウンジ（窓・ピアノ・ソファ）で写るものも違う

## 1. ラベル（12字まで・番号込み）

> #4 の型（初対面・同時に話す・注文に迷う・見守る人・相手の席を探す）を朝の言葉に入れ替えた。
> ラベルはその人の**いまの気分**で書く（#4 の学び。「ひとりで」「ただの」は使わない）。

| # | ラベル | 人形の動き |
|---|---|---|
| 1 | 1 朝イチの初対面 | 向かい合って座る2体。背すじがぴんと伸びて、両手をひざの上 |
| 2 | 2 どうぞ、がかぶった | 向かい合う2体が、同時に手のひらを相手に向けて「どうぞ」をしている |
| 3 | 3 モーニングかランチか | ふたり組の片方が、メニューを持って相手の顔をちらっと見ている |
| 4 | 4 今朝も見守る人 | 柱のそばに立って、離れた席をそっと見ている（#4 の「柱の陰で見守る人」の再登場） |
| 5 | 5 朝の商談、順調 | スーツの2体が書類を広げて、片方がうなずいている（関係ない人） |
| 6 | 6 まったりモーニング | トーストとコーヒーを前に、ソファに深くもたれてうれしそう |
| 7 | 7 朝の光で読書中 | 窓際でひとり、本を開いている（関係ない人） |
| 8 | 8 寝ぐせを最終確認 | 入口の近くで、小さな手鏡をのぞいて髪を押さえている |
| 9 | 9 あくび、がまん中 | ひとりで座って、口を手で隠してあくびをこらえている。腕時計をちらっと見る |
| 10 | 10 お会計で譲りあい | 2体が伝票の上で、両手を出して「ここは私が」をしあっている |
| 11 | 11 相手の席を探してる | スマホを持って、首をのばして店の中を見回している（#4 と同じ） |
| 12 | 12 窓の外にまた鳩 | 窓の外の手すりに鳩が1羽（#1・#5・#6 の鳩の再登場） |

- 字数：最長は 3・11（12字）。12字を超えるものなし（`render-labels.js` が数えて止める）
- 関係ない人（5・7）を混ぜた。全員が当事者だと息苦しい
- 「何回目」「まだ」など、進んでいる／遅れていると読めるラベルなし。性別を決めていない。10 は払う側を決めない
- 4・11・12 は前の回と同じ人（鳩）。@koarasan_genkai の「同じ人が毎回出てくる」の取り入れ（`series/gisshiri-jokei.md`）

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

**やり方：#4 の採用画像（`assets/gisshiri/lounge-v2.webp`）を添えて頼む。**
10/14 に v2 を作った ChatGPT の会話が残っていれば、その会話の続きで頼むのがいちばん近くなる。
残っていなければ、新しい会話に画像を添えて下を貼る。

```
Please make a new image of the SAME hotel tea lounge as the attached
picture, but on a Sunday morning around 11 a.m.

Keep exactly the same: the high three-quarter bird's-eye camera angle, the
tall windows along the top, the small grand piano in the back, the round
pillar, the scattered armchairs and low tables, the pale cream, almost white
stone floor, and roughly where the groups of people are placed. It is a
candid snapshot cut out of a larger scene: furniture is cut off by the left,
right and bottom edges. No outside walls, no diorama edges, no base, no box,
no frame.

Change only the time of day and the small things:
- Morning light: clear, fresh, slightly cooler daylight coming in low from
  the windows, long soft shadows across the pale floor. Still bright and
  warm overall, not blue.
- On the tables: coffee cups, toast, croissants, small glasses of orange
  juice instead of afternoon tea. No three-tier tea stands.
- One pigeon sitting on the railing just outside the window.

The people are new people, all different, like a real Sunday morning crowd:
ages from their twenties to their seventies, different body types and skin
tones, different hair (curly, grey, short, long, tied back, a knit cap,
glasses, a beard), and relaxed weekend clothes in soft matte colors
(mustard knit, red cardigan, striped shirt, denim jacket, white hoodie,
navy coat, olive sweater). Do not make everyone look alike.

About twelve groups, each doing one small thing, each with simple dot eyes
and a tiny readable expression:
1. two figures sitting face to face, very upright and formal, hands on their knees
2. two figures face to face, both holding out an open palm toward the other at the same moment, as if saying "please, you first"
3. two figures at a table, one holding a menu and glancing up at the other
4. one figure standing beside the pillar, quietly watching a table far away
5. two figures in suits with papers on the table, one nodding
6. one figure sinking happily into a sofa with toast and coffee
7. one figure by the window reading an open book in the morning light
8. one figure near the entrance looking into a small hand mirror, pressing down their hair
9. one figure sitting and covering a yawn with their hand, glancing at a wristwatch
10. two figures both holding out their hands over the bill, each insisting on paying
11. one figure standing with a phone, stretching their neck and looking around for someone
12. one pigeon outside the window, looking in

Composition: all the figures between about 8 percent and 70 percent of the
image height, away from the far left and far right edges. The bottom 30
percent is the same lounge continuing toward the camera, with empty
armchairs, a potted plant and floor, slightly blurred, no figures there.
No large plain or empty areas.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
mild depth of field so every figure stays readable. No text, no letters, no
numbers, no logos, no signs, no writing on any menu, bill, book, paper or
phone. No gold, no brass, no chandeliers, no metallic parts.
Vertical 2:3 composition.
```

### 再生成の基準

- #4 と構図・家具の位置が大きく変わった（この回は「時間帯だけ変える」実験なので、構図が変わると比べられない）
- 朝に見えない（午後と区別がつかない）／逆に青く暗くなった
- 床が茶色・ベージュで、人形と溶けた
- 全員が同じ髪型・同じ服に見えた（#4 v1 の失敗）
- 3段トレイ・金色・シャンデリアが出た
- メニュー・伝票・本・書類に文字が出た
- 2（どうぞがかぶった）と 10（お会計で譲りあい）が描かれない → 外して、描かれた面白い動きで埋める

## 3. 書き出し

- `"fit":"width"`、`top` は #4 と同じ 300 から。ラベルは既定値（30px・0.92）。座標は画像を見てから Claude が決める（y=360〜1480）

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"日曜11時、ホテルのラウンジ","sub":"あなたは、何番？","fit":"width","top":300,"labels":[…]}'
python3 build_reel.py one10 kinda-ig-1023-gisshiri07.mp4
```

## 4. キャプション

#6 と同じく短く。キャプションでの検証は止めたまま（反応は #4〜#6 すべて0）。

```
日曜の11時、ホテルのラウンジです。
はじめましての席も、朝ごはんの人も、仕事の人もいます。

あなたは何番でしたか。

#結婚相談所 #お見合い #婚活 #初対面 #ホテルラウンジ
```

- ハッシュタグは5個まで。「プロフィールのリンクから」は使わない
- 曲は IG 側（ほかのシリーズの曲は避ける）。カバーは書き出した1枚。AI 生成の開示
- 投稿したら友達2〜3人に DM で送る（`ig-strategy-2026-09.md` §21-c ①）

## 5. セルフQA

- [x] 焦らせ・比較表現なし／「中立」自称なし／結婚をゴールにしていない
- [x] 異性・男女前提なし（2・10 も性別と払う側を決めない）
- [x] 人を上下に並べていない。「ひとりで」「ただの」など一段下に置く言い方なし
- [x] 画像に文字を描かせない指定あり（メニュー・伝票・本・書類・スマホ）
- [x] 絵文字なし
- [ ] 生成後：#4 と構図が近い／朝に見える／床が明るい／ラベルが重ならない

## 6. 判定（10/26 月の朝に計測して、ぎっしり#8 を決める）

- リーチ1,000超 → #4 の絵が届く。#8 は #4 の構図のまま、場所か時間帯を変える
- リーチ110前後 → #1・#4 は配られ方の波だった可能性が高い。ぎっしりの本数（週2本）を §21-b の目安で見直す提案をする
