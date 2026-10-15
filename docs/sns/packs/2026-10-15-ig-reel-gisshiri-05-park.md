# IGリール制作キット｜ぎっしり情景#5 日曜13時、公園の芝生（2026-10-15 木 20:00）

> 型の正は `docs/sns/series/gisshiri-jokei.md`。前回は `packs/2026-10-14-ig-reel-gisshiri-04-lounge.md`。

- **題**：日曜13時、公園の芝生 ／ **問いかけ**：あなたは、何番？
- **見る数字**：スキップ率と3秒残存は #4 並み（47%・56%）を保てるか。**本命はいいね・保存・送信・コメントが0から動くか**

## 0. #4 の結果と、この回で確かめること

| 回 | テーマ | リーチ | 3秒残存 | スキップ | 反応 |
|---|---|---|---|---|---|
| #1 駅前（10/5 月） | 会う直前 | 1,588 | 56% | 47% | いいね1・保存1 |
| #2 断面図（10/8 木） | 返信待ち | 126 | 24% | 78.6% | — |
| #3 カフェ（10/10 土） | いろんな人の店 | 108 | 33% | 67.6% | — |
| **#4 ラウンジ（10/14 水）** | **会っている最中** | **2,578** | **56%** | **47.1%** | **いいね0・保存0・送信0・再投稿1・プロフ4・フォロー0** |

- **#4 で仮説が当たった。** #4 の判定基準は「スキップ60%未満ならテーマの寄せが効いた」で、47.1% は #1 とほぼ同じ数字
- 伸びるのは「ぎっしり」全般ではない。**ぎっしり × 誰かに会う場面**。#2・#3 はぎっしりでも 110 前後だった
- 構図（箱にしない・床を明るく）と人物の描き分け（v2）は #4 で両方そろっている。この2つは変えない
- 残る課題は**反応がほぼ0**であること。2,578人に届いて、いいね・保存・コメントが0。平均再生7秒／10秒なので見てはいる。
  見て終わる絵になっていて、手を動かす理由がない（Claude 仮説）
- だから #5 は**テーマの軸（会っている最中）と構図はそのまま**にする。変えるのはキャプションの1点だけ（§4）。2つ同時に変えると何が効いたか分からなくなる
- 場所は屋外にする。いちばん伸びた #1 も屋外で、10月はピクニックの季節。明るい芝生は「床を明るく」とも合う
- 判定：スキップ60%未満を保ち、いいね・保存・送信・コメントのどれかが1以上になれば、キャプションの変更が効いた

## 1. ラベル（12字まで・番号込み）

| # | ラベル | 人形の動き |
|---|---|---|
| 1 | 1 お弁当つくりすぎた | ふたり組。シートの上に重箱が3段、相手が少し驚いている |
| 2 | 2 シートの端に座ってる | ふたり組の片方が、広いシートのいちばん端にちょこんと座っている |
| 3 | 3 写真撮ろうか迷い中 | スマホを半分出して、となりの相手をちらっと見ている |
| 4 | 4 日傘にふたりで入る | ひとつの日傘の下を、ふたりで歩いている |
| 5 | 5 フリスビー届かない | フリスビーが相手のずっと手前に落ちている。投げた人は手で顔をおおう |
| 6 | 6 ベンチで読書の続き | ベンチで本を読むひとり（関係ない人） |
| 7 | 7 先に犬と仲良くなる | ふたり組の片方が、相手が連れてきた犬とすっかり仲良く遊んでいる |
| 8 | 8 日曜のジョギング | 走っているひとり（関係ない人） |
| 9 | 9 落ち葉を拾って見せる | 赤い落ち葉を1枚、相手に見せている |
| 10 | 10 どの木の下か迷う | スマホを持って、木を見比べてきょろきょろしている |
| 11 | 11 キッチンカー並び中 | 小さなキッチンカーの前に並ぶふたり |
| 12 | 12 パンを狙う鳩 | 誰かのサンドイッチをじっと見ている鳩（#1 の「ずっといる鳩」が再登場） |

- 「ただの〇〇」「ひとりで〇〇」は使わない（#4 の学び：その人を一段下に置く言い方に読める）。関係ない人も**その人の気分**で書く
- 12 の鳩は #1 の鳩の再登場（型の「同じ人形を別の回にも出す」）
- 進んでいる／遅れていると読めるラベルなし。ふたり組の性別は決めない。7 の犬は「どちらの犬か」を決めず「相手が連れてきた」だけ
- 12字を超えるものなし（最長は 1・2・5・9・11 の11字）

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

> #4 v2 の学び：**縛るのは背景の明るさだけ。人物の色を縛ると全員が同じ人になる**。人物は年齢・髪・服の違いを具体的に書く。

```
A handmade miniature clay diorama of a big city park lawn on a sunny Sunday
afternoon in autumn, photographed like a real tilt-shift miniature photo from
a high three-quarter bird's-eye angle, looking down onto one part of the
lawn. It should feel like a single candid snapshot cut out of a larger scene,
not a model on a table: the park continues beyond every edge of the frame.
Trees, a bench, a path and picnic sheets are cut off by the left, right and
bottom edges. Do not show the edges of the diorama, a base, a box, a frame,
a fence around everything or any background behind the model.

Layout: a few trees with a little autumn color along the upper part of the
image, a curving pale path, one wooden bench, one small food truck near the
path, and picnic sheets scattered irregularly across the lawn at different
distances and angles. No grid, no rows, no partitions.

The lawn is a pale, sunlit, light green, bright and soft. Avoid people
wearing green so they do not melt into the lawn.

About twelve groups of small clay figures are spread across the lawn with
clear space between them, each doing one small thing, each with simple dot
eyes and a tiny readable expression:
1. two figures on a picnic sheet with a huge three-tier lunch box, one looking surprised
2. two figures on a large picnic sheet, one sitting shyly at the very edge of it
3. one figure half pulling out a phone and glancing at the person next to them
4. two figures walking together under one small parasol
5. a frisbee lying on the grass far short of the catcher, the thrower covering their face
6. one figure on the bench reading a book
7. two figures with a small dog, one of them already playing happily with the dog
8. one figure jogging along the path
9. one figure showing a single red fallen leaf to the person beside them
10. one figure holding a phone, looking back and forth between two trees
11. two figures waiting in line at the small food truck
12. one pigeon on the grass staring at someone's sandwich

The people are all different, like a real crowd on a weekend: ages from
their twenties to their seventies, different body types and skin tones,
different hair (curly, grey, short, long, tied back, a knit cap, glasses, a
beard), and ordinary weekend clothes (mustard knit, red cardigan, striped
shirt, denim jacket, white t-shirt, navy coat, beige trench). Pairs are mixed
freely; do not make every pair look alike.

Composition: all the figures are between about 8 percent and 70 percent of
the image height, and kept away from the far left and far right edges. The
top of the image is the trees; the bottom 30 percent is the same lawn
continuing toward the camera, with an empty picnic sheet corner, a few fallen
leaves and grass, slightly blurred in the foreground, with no figures there.
No large plain or empty areas anywhere.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
bright and warm daylight from above, mild depth of field so every figure
stays readable. Soft matte colors. No text, no letters, no numbers, no
logos, no signs, no writing on the food truck, phones or book.
Vertical 2:3 composition.
```

### 再生成の基準

- 公園の外枠・模型の台・背景が写った（＝箱に見える）
- 芝生が濃い緑・暗い緑で、人形が沈んだ
- 全員が同じ髪型・同じ服に見えた（#4 v1 の失敗）
- シートが格子に並んだ
- キッチンカー・本・スマホに文字が出た
- 1 と 2 が見分けられない（1 は重箱、2 は端に座る）

## 3. 書き出し

- `"fit":"width"`、`top` は 300〜380（題の帯に木の下の人が隠れないよう画像を見て決める）
- ラベルは既定値（30px・0.92）。座標は画像を見てから Claude が決める。y=360〜1480 の中だけ

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"日曜13時、公園の芝生","sub":"あなたは、何番？","fit":"width","top":300,"labels":[…]}'
python3 build_reel.py one10 kinda-ig-1015-gisshiri05.mp4
```

## 4. キャプション（#4 から変えるのはここだけ）

#4 は「番号だけ、コメントに置いていってください」でコメント0。**自分のことを書くのは、知らない人の投稿には重い**（Claude 仮説）。
#5 は**送る先を先に言う**。自分の番号ではなく、思い浮かんだ人に渡す形にする。

```
日曜の13時、同じ芝生の上で、それぞれの午後が流れています。
はじめましてのふたりも、走っている人も、鳩も。

この中に「これ、あの人だ」という番号があったら、その人に送ってあげてください。
自分の番号は、コメントに置いていっても大丈夫です。

#結婚相談所 #お見合い #婚活 #ピクニックデート #公園デート
```

## 5. セルフQA

- [ ] 1枚の写真として見て「箱」「模型」に見えない
- [ ] 芝生が明るく、人形が浮いて見える
- [ ] 人物の年齢・髪・服がばらばら
- [ ] 画像の中に文字・数字が無い（キッチンカー・本・スマホ）
- [ ] 進んでいる／遅れていると読めるラベルが無い／性別を決めつけていない
- [ ] ラベルが全部 y=360〜1480 に入り、重なっていない
- [ ] 曲を足した（ほかのシリーズの曲は避ける）／カバーは書き出した1枚／AI 生成の開示
- [ ] プロフィール固定：#1 駅前・#4 ラウンジを先に固定（3本目は #5 の数字を見て）

## 6. 制作記録（2026-10-15）

- **1回目（v1）を採用**（`assets/gisshiri/park-v1.webp`）。外枠なし・人物ばらばら・年齢と服の描き分けも出た
- ふうか初見の懸念「人物が小さい・緑に負けている」→ 採用。人形が画面の左右いっぱいまで散っているので、幅合わせ（`top` 300）以上には拡大できない。ラベルを付けると1体ずつ拾える大きさで、芝生は黄みのある明るい緑なので服の色は沈んでいない
- 描かれ方に合わせてラベルを組み替えた：「写真撮ろうか迷い中」は描かれなかったので外した。右下のシートで水筒を手に話し込むふたりに「3 気づけば2時間経過」
- v2 で2点直した（ふうか指摘）：
  - 「2 シートの端に座ってる」は意味が通らなかった。同じシートの真ん中にふたり、端にひとりという絵なので、端の人が誰なのか分からない。**付いてきた友だちが、ふたりの邪魔をしないよう端にいる**と読める「2 ふたりの邪魔はしない」に変えた。学び：**ラベルは動きではなく、その人がなぜそうしているかを書く**
  - 「6」が読書の人の頭にかかっていたので、ベンチの左へ移した
- 書き出し：`kinda-ig-1015-gisshiri05.mp4`（10.0秒・`one10`・`top` 300・ラベル既定値）

```json
{"title":"日曜13時、公園の芝生","sub":"あなたは、何番？","fit":"width","top":300,"labels":[{"t":"1 お弁当つくりすぎた","x":221,"y":639},{"t":"2 ふたりの邪魔はしない","x":640,"y":915},{"t":"3 気づけば2時間経過","x":830,"y":1372},{"t":"4 日傘にふたりで入る","x":860,"y":670},{"t":"5 フリスビー届かない","x":720,"y":1040},{"t":"6 ベンチで読書の続き","x":300,"y":578},{"t":"7 先に犬と仲良くなる","x":190,"y":903},{"t":"8 日曜のジョギング","x":380,"y":392},{"t":"9 落ち葉を拾って見せる","x":225,"y":1180},{"t":"10 どの木の下か迷う","x":880,"y":1262},{"t":"11 キッチンカー並び中","x":885,"y":452},{"t":"12 パンを狙う鳩","x":345,"y":1470}]}
```
