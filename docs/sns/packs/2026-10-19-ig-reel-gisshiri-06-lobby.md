# IGリール制作キット｜ぎっしり情景#6 土曜13時50分、ホテルのロビー（2026-10-19 月 20:00）

> 型の正は `docs/sns/series/gisshiri-jokei.md`。前回は `packs/2026-10-15-ig-reel-gisshiri-05-park.md`。
> 10/18 の最初の案（美術館・`packs/2026-10-19-ig-reel-gisshiri-06-museum.md`）は、#5 の数字が出たので保留にした（§0）。

- **題**：土曜13時50分、ホテルのロビー ／ **問いかけ**：あなたは、何番？
- **場面**：お見合いの10分前。初めて会う人を待つ、それぞれの心の準備
- **見る数字**：リーチ（#1・#4 の1,000超に戻るか）・スキップ率（60%未満か）

## 0. #5 の結果で、軸を「会う場面」から「初めて会う直前の緊張」に絞った

| 回 | 場面 | 初めて会う？ | リーチ | 3秒残存 | スキップ |
|---|---|---|---|---|---|
| #1 駅前 | 待ち合わせ10分前 | **はい** | **1,588** | 56% | 47% |
| #2 アパート | 返信を待つ夜 | — | 126 | 24% | 78.6% |
| #3 カフェ | いろんな人の店（お見合い1席） | 一部 | 108 | 33% | 67.6% |
| #4 ラウンジ | 初対面3分目・相手の席を探す | **はい** | **3,465** | 58% | 45.9% |
| #5 公園 | ピクニック（慣れたふたり） | いいえ | 111 | 28% | 73% |

- 10/15 の仮説「会っている最中なら届く」は #5 で外れた。会っている場面でも、**慣れたふたりのデート（公園）は #2・#3 と同じ 110 前後**
- 伸びた2本はどちらも**初めて会う直前・直後の緊張**を描いていた（待ち合わせの10分前／初対面の3分目）。見る人が「この感じ知ってる」と止まるのはここ（Claude 仮説）
- 美術館（初版の #6）は2回目以降のデートなので、#5 と同じ側にある。**保留にしてストックに戻した**
- #6 は #1（会う直前）と #4（ホテル）の重なるところに置く。ラウンジ（10/14）とは場所の見た目を変える：回転ドア・大きな花・フロント・エレベーター
- 反応（いいね・保存・送信）は #4 も #5 も0。キャプションを変えても動かなかったので、この回は**届くかどうかだけを見る**。キャプションは短く戻す（§4）

## 1. ラベル（12字まで・番号込み）

> #5 の学び：ラベルは動きではなく、**その人がなぜそうしているか**を書く。

| # | ラベル | 人形の動き |
|---|---|---|
| 1 | 1 写真と顔を見比べ中 | スマホのプロフィール写真と、入ってくる人を交互に見ている |
| 2 | 2 早く着きすぎて2周目 | ロビーの端をゆっくり歩いているひとり。腕時計を見ている |
| 3 | 3 回転ドアでもう一周 | 回転ドアの中で、出るタイミングを逃して回っているひとり |
| 4 | 4 担当さんと最終確認 | 年上の担当の方（スーツ）と小声で話している |
| 5 | 5 ガラスで前髪チェック | ガラスの壁に映った自分を見て、前髪を指で直している |
| 6 | 6 名前を心で練習中 | ソファに浅く座り、目を閉じて口が小さく動いている |
| 7 | 7 深呼吸、3回目 | 大きな花の横で、胸に手を当てて息を吐いている |
| 8 | 8 旅行のチェックイン | フロントでスーツケースを持つふたり（関係ない人） |
| 9 | 9 同じ服で目が合った | 同じような紺のジャケットのふたりが、気まずそうに目をそらしている |
| 10 | 10 お手洗いの場所を確認 | 案内板（文字なし）を見上げて指でたどっているひとり |
| 11 | 11 新聞を読むいつもの人 | ソファで新聞を広げている年配のひとり（関係ない人） |
| 12 | 12 ガラスの外にまた鳩 | 入口のガラスの外に鳩が1羽（#1・#5 の鳩の再登場） |

- 字数：最長は 10・11（12字）。12字を超えるものなし
- 関係ない人（8・11）を混ぜた。全員が当事者だと息苦しい
- 「何回目」「まだ」など、進んでいる／遅れていると読めるラベルなし。性別を決めていない
- 4 の担当の方は、見守るやさしい役。下に見る書き方をしていない
- ラウンジ（#4）と重なるラベルなし（#4 は「柱の陰で見守る人」「相手の席を探してる」。ここは会う前の準備だけ）

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

> #4 v2 の学び：**縛るのは背景の明るさだけ。人物の色を縛ると全員が同じ人になる。**

```
A handmade miniature clay diorama of the bright, spacious lobby of an
elegant city hotel on a Saturday early afternoon, photographed like a real
tilt-shift miniature photo from a high three-quarter bird's-eye angle,
looking down onto one part of the lobby. It should feel like a single
candid snapshot cut out of a larger scene, not a model on a table: the lobby
continues beyond every edge of the frame. Sofas, a large flower arrangement
and the front desk are cut off by the left, right and bottom edges. Do not
show the edges of the diorama, a base, a box, a frame around everything,
separate rooms or any background behind the model.

Layout: a glass revolving door and a tall glass wall near the top of the
image with soft daylight coming in, a pigeon standing outside the glass;
a large round table with a tall flower arrangement in the middle of the
lobby; a long front desk along one side; a few low sofas and armchairs
placed at different angles; one small blank direction sign on a stand.
No grid, no rows, no partitions.

The floor is pale, almost white polished marble, bright and soft, lit by
daylight. The people wear clear colors that stand out against the floor.

About twelve groups of small clay figures are spread across the lobby with
clear space between them, each doing one small thing, each with simple dot
eyes and a tiny readable expression:
1. one figure holding a phone, looking back and forth between the phone screen and the entrance
2. one figure walking slowly along the edge of the lobby, checking a wristwatch
3. one figure inside the revolving door, still turning around, having missed the moment to step out
4. one figure talking quietly with an older person in a neat suit who is giving gentle advice
5. one figure facing the glass wall, fixing their bangs with a finger while looking at their reflection
6. one figure sitting on the very edge of a sofa with eyes closed, lips moving slightly
7. one figure standing beside the big flower arrangement, a hand on their chest, breathing out
8. two figures with a suitcase checking in at the front desk
9. two strangers wearing almost the same navy jacket, glancing at each other awkwardly
10. one figure looking up at the small blank sign, tracing it with a finger
11. one older figure relaxing on a sofa reading a wide open newspaper
12. one pigeon outside the glass wall, looking in

The people are all different, like a real Saturday crowd: ages from their
twenties to their seventies, different body types and skin tones, different
hair (curly, grey, short, long, tied back, glasses, a beard), and neat
weekend clothes (navy jacket, cream knit, burgundy dress, camel coat, light
blue shirt, black turtleneck, olive cardigan). Do not make everyone look
alike.

Composition: all the figures are between about 8 percent and 70 percent of
the image height, and kept away from the far left and far right edges. The
top of the image is the glass wall and the revolving door; the bottom 30
percent is the same pale marble floor continuing toward the camera, with the
corner of a sofa and a low table, slightly blurred in the foreground, with
no figures there. No large plain or empty areas anywhere.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
bright and warm daylight from the glass and from above, mild depth of field
so every figure stays readable. Soft matte colors. No text, no letters, no
numbers, no logos, no hotel name, no writing on the sign, the newspaper,
the phones or the front desk.
Vertical 2:3 composition.
```

### 再生成の基準

- ロビーが模型の台・箱・断面図に見えた
- 床が暗い・人形が床に溶けた
- 全員が同じ髪型・同じ服に見えた
- 新聞・案内板・フロントに文字が出た
- ラウンジ（#4）と見分けがつかない（回転ドア・花・フロントのどれも写っていない）
- 3 の回転ドアの人が描かれない → 3 は外して、描かれた面白い動きで埋める

## 3. 書き出し

- `"fit":"width"`、`top` は 300〜380。ラベルは既定値（30px・0.92）。座標は画像を見てから Claude が決める（y=360〜1480）

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"土曜13時50分、ホテルのロビー","sub":"あなたは、何番？","fit":"width","top":300,"labels":[…]}'
python3 build_reel.py one10 kinda-ig-1019-gisshiri06.mp4
```

- X 用（10/24 昼）：同じ座標で `render-x-labels.js`（`shift` は一番上のラベルが y≈210 になる値）

## 4. キャプション

#4（番号コメント）も #5（送る先）も反応0だったので、キャプションでの検証はいったん止める。短く、場面だけ伝える。

```
お見合いの10分前、土曜のホテルのロビーです。
同じ時間に、それぞれが自分なりの準備をしています。

あなたは何番でしたか。

#結婚相談所 #お見合い #婚活 #初対面 #ホテルラウンジ
```

- ハッシュタグは5個まで。「プロフィールのリンクから」は使わない
- 曲は IG 側（ほかのシリーズの曲は避ける）。カバーは書き出した1枚。AI 生成の開示

## 5. セルフQA

- [x] 焦らせ・比較表現なし／「中立」自称なし／結婚をゴールにしていない（お見合いは場面として出すだけ）
- [x] 異性・男女前提なし（9 の「同じ服」も性別を決めない）
- [x] 人を上下に並べていない。侮辱的に読まれうるラベルなし
- [x] 画像に文字を描かせない指定あり（案内板・新聞・フロント・ホテル名）
- [x] 絵文字なし
- [ ] 生成後：箱に見えない／床が明るい／ラウンジと見分けがつく／ラベルが重ならない

## 6. 判定（10/21 夜に計測して、10/22 の #7 を決める）

- リーチ1,000超 → 「初めて会う直前の緊張」が軸。#7 も同じ軸で場所を変える（候補は `packs/2026-10-w3-ig.md`）
- リーチ110前後 → 場面の差ではなく配られ方の波の可能性が高い。#4 の型（ラウンジ・初対面）を構図ごと別の時間帯で出し直して確かめる

## 7. 制作記録（2026-10-19）

- **1回目（v1）で採用**（`assets/gisshiri/lobby-v1.webp`）。12の動きが全部描かれた。床は明るい大理石・箱に見えない・回転ドア／花／フロントでラウンジと見分けがつく
- ラベル 10・11 はキットの文言だと13字（番号と空白込み）でスクリプトに止められた。**「10 お手洗いを探し中」「11 新聞のいつもの人」**に短くした
- 3 は回転ドアの人の顔にかかるので足元に置いた
- 書き出し：`kinda-ig-1019-gisshiri06.mp4`（one10・10秒）。X 用 4:5 は `assets/x/2026-10-w3/1024-lobby-bango.jpg`（shift 175）
- 座標（IG 版・`fit:width`・`top:300`）：

```json
{"title": "土曜13時50分、ホテルのロビー", "sub": "あなたは、何番？", "fit": "width", "top": 300, "labels": [{"t": "1 写真と顔を見比べ中", "x": 200, "y": 425}, {"t": "2 早く着きすぎて2周目", "x": 195, "y": 553}, {"t": "3 回転ドアでもう一周", "x": 445, "y": 615}, {"t": "4 担当さんと最終確認", "x": 280, "y": 700}, {"t": "5 ガラスで前髪チェック", "x": 680, "y": 445}, {"t": "6 名前を心で練習中", "x": 240, "y": 1035}, {"t": "7 深呼吸、3回目", "x": 330, "y": 965}, {"t": "8 旅行のチェックイン", "x": 880, "y": 640}, {"t": "9 同じ服で目が合った", "x": 870, "y": 940}, {"t": "10 お手洗いを探し中", "x": 800, "y": 1180}, {"t": "11 新聞のいつもの人", "x": 380, "y": 1360}, {"t": "12 ガラスの外にまた鳩", "x": 850, "y": 385}]}
```
