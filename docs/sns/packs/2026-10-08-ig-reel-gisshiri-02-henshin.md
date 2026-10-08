# IGリール制作キット｜ぎっしり情景#2 返信を待つ金曜の夜（2026-10-08 木 20:00）

> 型の正は `docs/sns/series/gisshiri-jokei.md`。ストック「金曜夜、返信を待つ部屋」を、**アパートの断面図**にして1枚に人を並べる。

- **枠**：木 20:00（10/7 決定：#1 がまだ配られているうちに2本目を置く。「今日の天気、つけてみた」は後ろへ）／リール ／ 1枚 ／ 1080×1920 ／ 10.0秒・ズームなし（`build_reel.py one10`）
- **題**：返信を待つ金曜の夜 ／ **問いかけ**：あなたは、何番？
- **見る数字**：送信数・保存数・コメント（番号で返ってくるか）。3秒残存は #1（56%）と比べる

## 0. #1 から変えること（10/7 の数字から）

#1 はリーチ 1,580（ほかの回の約10倍）・3秒残存 56%・平均再生 7／10秒。**見られ方はシリーズ最高**。
一方で いいね1・保存1・送信0・フォロー0。**眺められたが、何も起きなかった**。

| #1 | #2 | 理由 |
|---|---|---|
| ラベルに番号なし | **1〜11 を頭に付ける**（丸数字は書体に無い・下記） | コメントが「4です」の一言で済む。返事の敷居を下げる |
| 駅前の人の行動（前髪・手土産） | **頭の中の状態**（既読がつかない・下書きを消した） | 外から見える行動は「いるね」で終わる。内側の状態は「わたしだ」になり、送る理由になる |
| 広場に散らばる人形 | **部屋で区切られた断面図** | 1人1部屋なのでラベルが重ならず、誰が誰か一目で分かる。並べる型・夜の窓（31%）と同じ「窓を選ぶ」形 |
| キャプションは問いかけだけ | **番号で答えてもらう一行**を足す | 同上 |

## 1. ラベル（12字まで・番号込み）

| # | ラベル | 部屋の中 |
|---|---|---|
| 1 | 1 既読がつかない | ベッドにうつぶせ、スマホを顔の前に掲げてじっと見ている |
| 2 | 2 下書きを5回消した | 机でスマホを両手で持ち、頭を抱えかけている。足元に丸めた紙くず |
| 3 | 3 通知を切ったのに見る | スマホを裏返して机に置き、横目でちらっと見ている |
| 4 | 4 もう返信が来てた | スマホを持って、両腕を上げて小さく跳ねている |
| 5 | 5 スタンプ選びで30分 | ソファで体育座り、スマホの画面を指でなぞり続けている |
| 6 | 6 友だちに文面を相談中 | ソファに2体並んで、1台のスマホをのぞきこんでいる |
| 7 | 7 寝たふりで待つ | 布団にくるまって、目だけ出してスマホの光を見ている |
| 8 | 8 返事は明日にする | スマホを棚の上に置いて離れ、湯のみを持ってくつろいでいる |
| 9 | 9 待ちきれず電話した | 窓辺で、スマホを耳に当てて笑っている |
| 10 | 10 返信より猫が大事 | 猫を抱いて眠っている（関係ない人） |
| 11 | 11 お風呂で待つ派 | 湯船につかって、袋に入れたスマホを見ている |

- 「進んでいる／遅れている」と読めるラベルを置かない。⑧⑨⑩を混ぜて、待つことだけが正解に見えないようにする
- 相手の性別・関係（彼氏・彼女）を書かない
- 画像に描かれなかった部屋のラベルは外す。描かれた面白い動きは足してよい（`gisshiri-jokei.md` 手順3）

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

```
A handmade miniature clay diorama of a small four-storey apartment building on
a Friday night, shown as a dollhouse cross-section with the whole front wall
removed, seen straight on from the front. The building is a neat grid of
twelve small rooms: four floors, three rooms per floor, each room clearly
separated by thick cream clay walls and floors. Every room has its own warm
lamp, so each room glows softly against a deep dusty-blue night background.

Each room has exactly one small clay figure (one room has two) doing one
small thing, each with simple dot eyes and a tiny readable expression. The
phones are small plain clay rectangles with a softly glowing blank screen.
1. lying face down on a bed, holding a phone up in front of the face, staring at it
2. sitting at a small desk holding a phone with both hands, almost clutching their head, a few crumpled paper balls on the floor
3. sitting at a desk with the phone placed face down, glancing at it sideways
4. holding a phone and jumping with both arms raised, delighted
5. sitting on a sofa hugging their knees, slowly scrolling on the phone
6. two figures sitting close together on a sofa, both peering at one phone
7. wrapped in a duvet on a bed with only the eyes peeking out, looking at the glow of a phone
8. relaxing in an armchair holding a small teacup, the phone left far away on a shelf
9. standing by a window, holding a phone to the ear, laughing
10. sleeping peacefully while hugging a small round clay cat
11. sitting in a small bathtub with bubbles, looking at a phone inside a clear plastic bag
12. one room is empty except for a lamp, a plant and a hanging coat

Composition: the building fills the width of the image but keep a thin margin
of night sky on the left and right edges. The building occupies the middle of
the image from about 18 percent to 80 percent of the height; the top is a
plain night sky with a small moon, the bottom is a plain dark street with no
figures. Figures are large enough to read their poses clearly.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
miniature photography look, every room evenly lit so every figure stays
readable. Muted palette: warm beige (#F5EEE6), soft off-white, dusty rose /
terracotta (#D4A090), muted sage and soft blue, warm lamp light. The figures
are gender-neutral. No text, no letters, no numbers, no logos, no writing on
any screen, poster or book. No gold, no brass, no metallic parts. Vertical 2:3
composition.
```

### 再生成の基準

画面・本・ポスターに文字や数字が出た／部屋の数が崩れて人形が重なる／ひと部屋に何人も入る（⑥以外）／
人形が小さすぎて動きが読めない／建物が画面の上下の端まで来る／実写っぽくなった

## 3. 書き出し

座標は画像を見てから決める。部屋の絵は端まで建物があるので、#1 と同じく `"fit":"width","top":300` から試す。

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"返信を待つ金曜の夜","sub":"あなたは、何番？","fit":"width","top":300,"labels":[{"t":"1 既読がつかない","x":0,"y":0}, …]}'
python3 build_reel.py one10 kinda-ig-gisshiri02-henshin.mp4
```

- 夜の絵なので、ラベルの白い札は #1 より目立つはず。題の帯は地色（ベージュ）のまま
- **丸数字は使えない**（10/7 確認：Shippori Mincho・Noto Sans JP の japanese サブセットとも ①⑤⑪ が無い）。「1 既読がつかない」の形にする

## 4. キャプション

```
金曜の夜、同じ建物の中で、みんなそれぞれ返信を待っています。
あなたは何番ですか。番号だけ、コメントに置いていってください。

#結婚相談所 #婚活 #仮交際 #デート #婚活中の人と繋がりたい
```

- 「続きを読む」の前の2行で完結。URL なし／絵文字なし
- コラム「仮交際の連絡頻度」（`/columns/karikousai-renraku-hindo-hetta`）と話題が重なる。リンクは置かない（プロフィールのリンクに任せる）

## 5. セルフQA

- [ ] 画像の中に文字・数字が無い（スマホの画面・本・ポスターを確認）
- [ ] 「進んでいる・遅れている」「待つのが正しい」と読めるラベルが無い
- [ ] 相手の性別・関係を決めつけていない
- [ ] ラベルが全部 y=360〜1480 に入り、重なっていない（スクリプトが止めてくれる）
- [ ] 曲を足した（固定曲は未定。ほかのシリーズで使っている曲は避ける）／カバーは書き出した1枚／AI 生成の開示

## 6. 制作記録（2026-10-08）

- 画像は初回生成で採用（`assets/gisshiri/henshin-v1.webp`）。12部屋すべて描かれ、画面・本に文字なし。12部屋目は空室
- **ラベルを1つ足した：「12 まだ帰ってない」**（空室・コートだけ掛かっている）
- **幅に合わせず、縮小して収めた。** 建物が縦に長く、幅に合わせると最下段が y=1480 より下（キャプションの下）に入る。
  0.909倍・x=74／y=136 に置き、周りは夜空の色（下は道路の色）で埋め、画像の縁を 18px ぼかして馴染ませた。
  ぼかした画像を敷く方法は縁が四角く浮いて見えたのでやめた
- **ラベルは天井と床を互い違いにした。** 1部屋の幅（約240px）よりラベルが長く、横に並ぶと重なる。
  各段で「左右が天井・真ん中が床」か「左右が床・真ん中が天井」にして、顔を隠さないようにした
- 書き出し：`kinda-ig-1008-gisshiri02.mp4`（10.0秒・`one10`）

```json
{"title":"返信を待つ金曜の夜","sub":"あなたは、何番？","labels":[
{"t":"1 既読がつかない","x":283,"y":470},{"t":"2 下書きを5回消した","x":539,"y":641},{"t":"3 通知を切ったのに見る","x":797,"y":470},
{"t":"4 もう返信が来てた","x":283,"y":889},{"t":"5 スタンプ選びで30分","x":539,"y":716},{"t":"6 友だちに文面を相談中","x":797,"y":889},
{"t":"7 寝たふりで待つ","x":283,"y":959},{"t":"8 返事は明日にする","x":539,"y":1140},{"t":"9 待ちきれず電話した","x":797,"y":959},
{"t":"10 返信より猫が大事","x":283,"y":1210},{"t":"11 お風呂で待つ派","x":539,"y":1404},{"t":"12 まだ帰ってない","x":797,"y":1210}]}
```
