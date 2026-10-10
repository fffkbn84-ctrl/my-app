# IGリール制作キット｜ぎっしり情景#3 土曜15時のカフェ（2026-10-10 土 12:00）

> 型の正は `docs/sns/series/gisshiri-jokei.md`。ふうか案（10/8）。
> **10/9 書き直し**：最初の版は「12の席を仕切りで分けた3×4のマス目」だったが、#2 と同じ箱割りの構図なので撤回した（§0）。

- **題**：土曜15時のカフェ ／ **問いかけ**：あなたは、何番？
- **見る数字**：**スキップ率と3秒残存**（#1 41〜47%・56% ／ #2 78.6%・24%）。次に送信・保存・コメント（番号で返るか）
- これで**ぎっしりが3本**。投稿後、3本ともプロフィールに固定する

## 0. この回で確かめること（10/9 ふうか仮説・Claude 同意）

#2（アパートの断面図）は16時間でリーチ126・3秒残存24%・スキップ78.6%。#1 の1/10。

- **仮説**：#2 は「景色を切り取った写真」ではなく「箱（ドールハウス）を外から撮った物の写真」に見えた。
  さらに3×4のマス目は左上から順に読めば終わる「表」なので、**目が画面の中を探し回らない**。ぎっしりの強み（自分を探す）が消えた
- 下1/3 が平らな地色（道路の色）で埋まっていて、空白が目立った
- **だから #3 は構図だけを #1 に戻す。** 箱・仕切り・建物の外枠を描かない。店内の一角を斜め上から切り取る

#2 では構図のほかにも変えたものがあった。今回は**構図以外も #1 にそろえて**、構図の効き目だけを見る。

| | #1（伸びた） | #2（伸びなかった） | #3 |
|---|---|---|---|
| 構図 | 広場を斜め上から。端が画面の外に切れる | 建物の正面・外枠まで全部写る・3×4 | **#1 と同じ**（店内を斜め上から・端が切れる） |
| 人の置き方 | ばらばら | 1部屋1人の格子 | **ばらばら** |
| 明るさ | 昼 | 夜（全体が暗い） | **昼**（午後の窓の光） |
| ラベル | 30px・不透明 0.92 | 23px・0.8 | **30px・0.92**（既定値に戻す） |
| 番号 | なし | あり | あり（コメントの返しやすさのため残す。見た目への影響は小さい） |
| 曜日・時刻 | 月 20:00 | 木 20:00 | 土 12:00（予定どおり。**残る違いはこれ**） |

**判定**：スキップ率が #1 並み（50%未満）に戻れば、構図の仮説は当たり。#2 並み（70%超）なら構図以外（テーマ・曜日）を疑う。

## 1. ラベル（12字まで・番号込み）

| # | ラベル | 人形の動き |
|---|---|---|
| 1 | 1 お見合いの沈黙10秒 | 向かい合って座る2体。少しかしこまって、両方ともカップを見ている |
| 2 | 2 3回目、同じ席で笑う | 向かい合って笑い合う2体 |
| 3 | 3 ママ会、話が3周目 | 大人2体が身を乗り出して話している。横で小さな子が2人ジュースを飲んでいる |
| 4 | 4 仕事してる風 | ノートPCを開いて、画面ではなく窓の外を見ている |
| 5 | 5 勉強、まだ2ページ目 | 分厚い本を開いて、頬杖をついて眠そう |
| 6 | 6 おひとり様、至福 | ひとりで目を閉じて、カップを両手で包んでいる |
| 7 | 7 ケーキを2つ頼んだ | ひとりの前にケーキが2つ。うれしそう |
| 8 | 8 撮ってる間に冷めた | スマホでラテを真上から撮っている |
| 9 | 9 真顔で旅行の相談 | 2体が真剣な顔で1枚の地図をのぞきこんでいる |
| 10 | 10 読むふりで人間観察 | ひとりで本を持っているが、目は店の中を見ている（10/10 変更・§6） |
| 11 | 11 メニューで5分迷う | カウンターの前でメニューを持って固まっている |
| 12 | 12 外の犬に夢中 | 窓際の席で、窓の外の小さな犬を見ている |

- お見合いの席（1）が混ざるのが Kinda らしさ。**沈黙を笑いにするが、下には見ない**（「沈黙10秒」は誰にでもある間）
- 10 は見ている人そのもの（隣の会話が気になる＝この画面を眺めている自分）
- 「進んでいる・遅れている」と読めるラベルなし。2体組の性別は決めない
- 12人は #1（11）より多い。描かれなかった動きのラベルは外してよい（10前後で十分）

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

```
A handmade miniature clay diorama of the inside of a cozy, busy café on a
Saturday afternoon, photographed like a real tilt-shift miniature photo from
a high three-quarter bird's-eye angle, looking down into one corner of the
room. It should feel like a single candid snapshot cut out of a larger scene,
not a model on a table: the room continues beyond every edge of the frame.
Tables, chairs, plants and the counter are cut off by the left, right and
bottom edges. Do not show the outside walls, the edges of the diorama, a
building outline, a box, a frame or any background behind the model.

Layout of the room: big windows with soft afternoon sunlight along the upper
part of the image, a small wooden counter on one side, and small round and
square tables scattered irregularly across the wooden floor at different
distances and angles, like a real café. No grid, no rows, no partitions, no
separate booths or compartments.

About twelve groups of small clay figures are spread across the room with
clear space between them, each doing one small thing, each with simple dot
eyes and a tiny readable expression:
1. two figures sitting face to face, a little stiff and formal, both looking down at their cups in silence
2. two figures sitting face to face, laughing together
3. two adults leaning in and chatting eagerly, two small children beside them sipping juice
4. one figure with an open laptop, looking out of the window instead of at the screen
5. one figure with a thick open book, chin in hand, sleepy
6. one figure alone with eyes closed, holding a cup with both hands, blissful
7. one figure alone with two slices of cake in front of them, delighted
8. one figure taking a photo of a latte from directly above with a phone
9. two figures with serious faces peering together at one unfolded map
10. one figure at the table right next to group 1, holding a book but glancing sideways at group 1
11. one figure standing at the counter, frozen while holding a menu
12. one figure at a window seat watching a small clay dog outside the window

Composition: all the figures are between about 8 percent and 70 percent of
the image height, and kept away from the far left and far right edges. The
top of the image is the windows and wall; the bottom 30 percent is the same
café continuing toward the camera, with empty chairs, a potted plant and
floorboards, slightly blurred in the foreground, with no figures there. No
large plain or empty areas anywhere.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
bright and warm daylight, mild depth of field so every figure stays readable.
Muted palette: warm beige (#F5EEE6), soft off-white, dusty rose / terracotta
(#D4A090), muted sage and soft blue. The figures are gender-neutral. No text,
no letters, no numbers, no logos, no menus with writing, no signs, no writing
on any screen, cup or map. No gold, no brass, no metallic parts.
Vertical 2:3 composition.
```

### 再生成の基準

- **店の外枠・壁の端・模型の台・背景が写った**（＝箱に見える。いちばん大事）
- テーブルが格子に並んだ／仕切りやブースで区切られた
- 下のほうが平らな床だけで、空白に見える
- メニュー・看板・画面・地図に文字が出た
- 1番（お見合い）と2番（3回目）が見分けられない／10番が1番の隣にいない（隣にいなければラベル10は外す）
- 人形が小さすぎる・重なって誰が誰か分からない／実写っぽくなった（クレイの質感が消えた）

## 3. 書き出し

- **`"fit":"width","top":300`**（#1 と同じ。画像は y=300〜1920 に敷かれ、下の約440px はキャプションの下に入る）
- 縮めて地色で囲む方法（#2 §6）は**使わない**。外枠と空白が見えて「箱」に戻る
- ラベルは**既定値（30px・0.92）**。`size`・`alpha` を指定しない
- 座標は画像を見てから Claude が決める。y=360〜1480 の中だけ（画像の高さの約4〜73%）

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"土曜15時のカフェ","sub":"あなたは、何番？","fit":"width","top":300,"labels":[{"t":"1 お見合いの沈黙10秒","x":0,"y":0}, …]}'
python3 build_reel.py one10 kinda-ig-1010-gisshiri03.mp4
```

## 4. キャプション

```
土曜の15時、同じカフェに、いろんな時間が流れています。
あなたは何番ですか。番号だけ、コメントに置いていってください。

#結婚相談所 #お見合い #婚活 #カフェ #デート
```

## 5. セルフQA

- [ ] 1枚の写真として見て、「箱」「模型」に見えない（外枠・台・背景が無い。端が画面の外に切れている）
- [ ] 画面の下 1/3 に、平らな地色の帯が無い
- [ ] 画像の中に文字・数字が無い（メニュー・画面・地図・看板を確認）
- [ ] 「進んでいる・遅れている」と読めるラベルが無い／2体組の性別を決めつけていない
- [ ] ラベルが全部 y=360〜1480 に入り、重なっていない（スクリプトが止めてくれる）
- [ ] 曲を足した（ほかのシリーズで使っている曲は避ける）／カバーは書き出した1枚／AI 生成の開示

## 6. 制作記録（2026-10-10）

- **1回目（v1）は不採用。** 構図は狙いどおり（外枠なし・端で切れる・ばらばら）だったが、
  床がオレンジ寄りの茶色で、人形の髪・服（茶・ベージュ）と溶けて見えにくかった（ふうか指摘）。1番（お見合い）と4番（PC）も描かれていなかった
- **2回目（v2・採用）**：同じ会話で「構図はそのまま・床を白っぽい明るい木に・服を青/セージ/ローズ/白に・1番と4番を描き直す」と頼んだ。
  構図が保たれたまま全部直った（`assets/gisshiri/cafe-v2.webp`）
  - **学び：床と人形は色で分ける。** 白っぽい床に、濃い髪と色のある服。#1 の石畳が効いていた理由もこれ
- **10番は1番の隣に描かれなかった**ので「10 読むふりで人間観察」に変えた（本を持って店の中を見ている人＝この画面を眺めている自分、の役は同じ）
- **`"top":380`**（#1 は 300）。窓の外の犬（12番）が題の帯に隠れないよう 80px 下げた。下は1番のふたりの頭（y≈1480）まで見える
- ラベルは既定値（30px・0.92）。書き出し：`kinda-ig-1010-gisshiri03.mp4`（10.0秒・`one10`）

```json
{"title":"土曜15時のカフェ","sub":"あなたは、何番？","fit":"width","top":380,"labels":[{"t":"1 お見合いの沈黙10秒","x":710,"y":1455},{"t":"2 3回目、同じ席で笑う","x":683,"y":555},{"t":"3 ママ会、話が3周目","x":265,"y":650},{"t":"4 仕事してる風","x":230,"y":445},{"t":"5 勉強、まだ2ページ目","x":370,"y":1050},{"t":"6 おひとり様、至福","x":540,"y":870},{"t":"7 ケーキを2つ頼んだ","x":820,"y":790},{"t":"8 撮ってる間に冷めた","x":400,"y":1300},{"t":"9 真顔で旅行の相談","x":710,"y":1215},{"t":"10 読むふりで人間観察","x":200,"y":920},{"t":"11 メニューで5分迷う","x":880,"y":950},{"t":"12 外の犬に夢中","x":920,"y":395}]}
```
