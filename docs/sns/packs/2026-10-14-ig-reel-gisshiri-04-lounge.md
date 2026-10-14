# IGリール制作キット｜ぎっしり情景#4 日曜15時、ホテルのラウンジ（2026-10-14 水 20:00）

> 型の正は `docs/sns/series/gisshiri-jokei.md`。テーマはストックの「日曜15時、ホテルのラウンジ」。
> 10/14 の枠は「伸びている型を入れる」（`ig-week-2026-09.md` §00）。10/1〜10/13 で3秒残存の上位は
> ぎっしり#1（56%）・並べる型#1（36%）・ぎっしり#3（33%）。**型としてはぎっしりがまだいちばん止まる**ので #4 を出す。

- **題**：日曜15時、ホテルのラウンジ ／ **問いかけ**：あなたは、何番？
- **見る数字**：スキップ率と3秒残存（#1 47%・56% ／ #2 78.6%・24% ／ #3 67.6%・33%）。次に送信・コメント

## 0. #3 の結果と、この回で確かめること

#3（カフェ・構図を #1 に戻した回）：リーチ108・3秒残存33%・スキップ67.6%。
**#2 よりは戻ったが、#1 には届かなかった**（§0 の判定基準では「50%未満なら構図の仮説が当たり」→ 半分だけ当たり）。

- 構図（箱をやめる）は効いた：スキップ 78.6% → 67.6%、3秒残存 24% → 33%
- 残る違いは**テーマ**。#1 は「待ち合わせ10分前」＝全員が**誰かに会う直前**で、見る人の当事者の時間だった。
  #3 のカフェは「いろんな人がいる店」で、自分に引き寄せる理由が薄かった（Claude 仮説）
- だから #4 は、構図・明るさ・ラベルは #3 のまま、**テーマを「会っている最中」に寄せる**。ラウンジは初対面の席が集まる場所で、
  全員が当事者ではなく、ただの商談・ひとりのお茶も混ぜる（息苦しくしない）
- 判定：スキップが 60%未満に下がれば「テーマの寄せ」が効いた。#3 並みなら曜日・時刻（月20時の #1 と水20時）を疑う

## 1. ラベル（12字まで・番号込み）

| # | ラベル | 人形の動き |
|---|---|---|
| 1 | 1 初対面、まだ3分目 | 向かい合って座る2体。背すじがぴんと伸びて、両手をひざの上 |
| 2 | 2 同時に話しだした | 向かい合う2体が、同時に口を開けて片手を少し上げている |
| 3 | 3 ケーキ頼むか迷い中 | ふたり組の片方が、メニューを持って相手の顔をちらっと見ている |
| 4 | 4 柱の陰で見守る人 | 柱のそばに立って、離れた席をそっと見ている |
| 5 | 5 カップ空でもまだ話す | 空のカップを前に、身を乗り出して楽しそうに話す2体 |
| 6 | 6 ただの商談 | スーツの2体が書類を広げている（関係ない人） |
| 7 | 7 ひとりで3段トレイ | ひとりの前にアフタヌーンティーの3段トレイ。うれしそう |
| 8 | 8 ピアノに聴き入る | ひとりで目を閉じて、奥のピアノのほうに顔を向けている |
| 9 | 9 紅茶3杯目 | ひとりでポットから紅茶を注いでいる。机にカップが3つ |
| 10 | 10 入る前に前髪チェック | 入口の近くで、小さな手鏡をのぞいて前髪を直している |
| 11 | 11 伝票を同時につかむ | 2体が同時に伝票に手を伸ばしている |
| 12 | 12 相手の席を探してる | スマホを持って、首をのばして店の中を見回している |

- 「沈黙10秒」は #3 で使ったので外した。「3回目」も #3 と 10/13 の会う日の服（2回目）に近いので外した
- 4 は「仲人」と書かず「見守る人」。誰なのかは見た人が決める（親でも、友だちでも、仲人さんでも）
- 「進んでいる・遅れている」と読めるラベルなし。2体組の性別は決めない。11 は払う側を決めない（同時につかむ）
- 10 字を超えるもの：5（11字）・10（12字）・11（10字）・12（10字）。すべて12字以内

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

```
A handmade miniature clay diorama of the tea lounge of an elegant but calm
city hotel on a Sunday afternoon, photographed like a real tilt-shift
miniature photo from a high three-quarter bird's-eye angle, looking down into
one part of the lounge. It should feel like a single candid snapshot cut out
of a larger scene, not a model on a table: the lounge continues beyond every
edge of the frame. Sofas, low tables, plants and a pillar are cut off by the
left, right and bottom edges. Do not show the outside walls, the edges of the
diorama, a building outline, a box, a frame or any background behind the
model.

Layout: tall windows with soft afternoon daylight along the upper part of the
image, a small grand piano far in the back, one round pillar, and pairs of
armchairs with small low tables scattered irregularly across a pale cream,
almost white stone floor, at different distances and angles. No grid, no
rows, no partitions, no booths.

The floor is very light (pale cream / off-white). The figures have dark hair
and clothes in clear colors (muted blue, sage green, dusty rose, white, navy)
so they stand out from the floor. No brown or beige clothes.

About twelve groups of small clay figures are spread across the lounge with
clear space between them, each doing one small thing, each with simple dot
eyes and a tiny readable expression:
1. two figures sitting face to face, very upright and formal, hands on their knees
2. two figures sitting face to face, both opening their mouths to speak at the same moment, one hand slightly raised
3. two figures at a table, one holding a menu and glancing up at the other
4. one figure standing beside the pillar, quietly watching a table far away
5. two figures leaning in and chatting happily, empty cups in front of them
6. two figures in suits with papers spread on the table, a business meeting
7. one figure alone with a three-tier afternoon tea stand, delighted
8. one figure alone with eyes closed, face turned toward the piano
9. one figure alone pouring tea from a teapot, three cups on the table
10. one figure near the entrance looking into a small hand mirror, fixing their bangs
11. two figures both reaching for the same bill on the table at once
12. one figure standing with a phone, stretching their neck and looking around for someone

Composition: all the figures are between about 8 percent and 70 percent of
the image height, and kept away from the far left and far right edges. The
top of the image is the windows and the piano; the bottom 30 percent is the
same lounge continuing toward the camera, with empty armchairs, a potted plant
and floor, slightly blurred in the foreground, with no figures there. No large
plain or empty areas anywhere.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
bright and warm daylight, mild depth of field so every figure stays readable.
Muted palette: warm beige (#F5EEE6), soft off-white, dusty rose / terracotta
(#D4A090), muted sage and soft blue. The figures are gender-neutral. No text,
no letters, no numbers, no logos, no signs, no writing on any menu, bill,
paper or phone. No gold, no brass, no chandeliers, no metallic parts.
Vertical 2:3 composition.
```

### 再生成の基準

- ラウンジの外枠・壁の端・模型の台・背景が写った（＝箱に見える）
- 床が茶色・ベージュで、人形と溶けた（#3 v1 の失敗）
- いすが格子に並んだ／仕切りで区切られた
- 金色・シャンデリアが出た（旧デザインのゴールド路線に寄る）
- メニュー・伝票・書類に文字が出た
- 1番と2番が見分けられない（1 はかしこまって黙っている、2 は同時に口を開けている）

## 3. 書き出し

- `"fit":"width"`、`top` は 300〜380（題の帯にピアノ・窓の人が隠れないよう画像を見て決める）
- ラベルは既定値（30px・0.92）。座標は画像を見てから Claude が決める。y=360〜1480 の中だけ

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"日曜15時、ホテルのラウンジ","sub":"あなたは、何番？","fit":"width","top":300,"labels":[…]}'
python3 build_reel.py one10 kinda-ig-1014-gisshiri04.mp4
```

## 4. キャプション

```
日曜の15時、同じラウンジで、それぞれの時間が流れています。
はじめましての席も、ただのお茶も、仕事の人も。
あなたは何番ですか。番号だけ、コメントに置いていってください。

#結婚相談所 #お見合い #婚活 #ホテルラウンジ #アフタヌーンティー
```

## 5. セルフQA

- [ ] 1枚の写真として見て「箱」「模型」に見えない
- [ ] 床が明るく、人形が浮いて見える
- [ ] 画像の中に文字・数字が無い（メニュー・伝票・書類・スマホ）
- [ ] 進んでいる／遅れていると読めるラベルが無い／性別を決めつけていない
- [ ] ラベルが全部 y=360〜1480 に入り、重なっていない
- [ ] 曲を足した（ほかのシリーズの曲は避ける）／カバーは書き出した1枚／AI 生成の開示
- [ ] 投稿後、ぎっしり 3本（#1・#3・#4 のうち選ぶ）をプロフィールに固定
