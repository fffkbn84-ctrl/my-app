# 「ふたり」ゲームオーバー6「いそがしい日の返信」制作キット（2026-10-24 土 20:00）

> 型・道具・秒数・2体はゲームオーバー3（`packs/2026-10-20-ig-reel-futari-gameover-03.md`）と同じ。共通テンプレートと天気の出方の表は同 §2 をそのまま使う。
> 前の回は `packs/2026-10-22-ig-reel-futari-gameover-05.md`。

## 0. なぜこの回か

- pair **`l2-contact`「連絡の頻度とテンポ」**。今週の主役は 層1 行き先（l1-holiday）・層2 ひとり時間（l2-alone）・層3 家事（l3-housework）。連絡は今週まだ出していない
- §21-c ④「題材の半分を 25〜34 寄りに」：仕事が忙しい平日に、恋人からの連絡にどう返すか。働いている人の話
- §21-c ③：キャプションの最後を **「返信がはやいのはどっち？」**（相手に送って聞ける二択）
- 待つのは A（くすんだピーチ＝**わた**。`series/ichibyo-no-kokoro.md` で名前を決めた子）。気にしいの子が既読を見つめる
- 性別を言わない回（「わたし」も使わない）

## 1. 台本（6カット・12.5秒）

| # | 秒 | 画面 | 窓の文字 | 音 |
|---|---|---|---|---|
| 帯 | GAME OVER 以外 | — | 仕事がいそがしい日の／「いま　なにしてる？」 | — |
| 1 | 0〜2.4 | B がひざの小さなパソコンで忙しく打っている（頭の毛がうず）。A はスマホを持って、きらきらした目で B のほうを見ている | いそがしい　ときに　きた。／どうする？／**▶ よるに　ゆっくり　かえす**／　ひとこと　だけ　かえす | ピコ・ピコ／曲 |
| 2 | 〜4.3 | B はパソコンに夢中で元の色のまま。A はスマホを見つめて灰色にしぼみ、体の下から小さな雨つぶ | 「よるに　ゆっくり　かえそう」……／そのあいだ　6じかん、／きどくの　まま。 | ポン |
| 3 | 〜6.7 | **GAME OVER**（2 の絵をモノクロで暗く） | いそがしいのは　みえない。／みえるのは　きどく　だけ。／▶ もういちど　やめる | 下がる4音・曲を止める |
| 4 | 〜8.4 | **1 と同じ絵** | 同じ文。カーソルだけ「▶ ひとこと　だけ　かえす」 | ピコ・ピコ |
| 5 | 〜10.3 | B がパソコンを打ちながら、片手でスマホをさっと掲げる。A はスマホを見て目を丸くし、上から色が戻っていく | 「いま　バタバタ！」／「よる　でんわ　していい？」 | ポン |
| 6 | 〜12.5 | A がふくらんで光り、スマホを抱きしめる。B はパソコンを閉じて、やわらかく笑う | 「まってる！」／れんらくも　ふたりも　はれた！ | レベルアップ・曲が戻る |

- GAME OVER の文は「見え方」を言う。ゆっくり返す人も、待つ人も悪者にしない（ちゃんと返したいから夜にまとめる、はやさしさでもある）
- 「すぐ返すのが正しい」とは言わない。一手は「先にひとことだけ」

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**設定画 `docs/sns/assets/futari/tenki-reference-v1.webp` を最初に添付する。**
共通テンプレート（ゲームオーバー3 §2）の【ACTING】に、下の文を入れて1枚ずつ頼む。

**1枚目（カット1・4）**
```
Character B has a tiny cream felted wool laptop open on its lap and is typing fast with both stubby arms, eyes focused and narrowed, a small determined mouth; thin wisps of B's own wool swirl up from its top puff like a little gust of wind, showing it is busy. Character A holds a tiny cream felted wool smartphone in both stubby arms and looks over at B with sparkly hopeful eyes and a small open smile; A's body has puffed up a little and its top glows warm and bright. The laptop screen and the phone screen are plain and blank.
```

**2枚目（カット2・3）**
```
Character B is still typing on the tiny cream felted wool laptop on its lap, completely absorbed, eyes on the screen, body in its normal pale blue color. Character A stares down at the tiny cream felted wool smartphone in both stubby arms with tired half-closed eyes and a small wobbly mouth; A's body has turned a dull ash-grey version of its dusty peach color and gone flat and deflated, and a few tiny felted wool raindrops fall from the bottom of A's body onto the sofa. The screens are plain and blank.
```

**3枚目（カット5）**
```
Character B keeps one stubby arm on the tiny cream felted wool laptop and quickly holds up a tiny cream felted wool smartphone in the other arm toward A, with a quick small smile and one eye half-closed, as if saying "just a second". Character A looks at its own tiny smartphone with round surprised eyes; A's body is still mostly ash-grey, but the dusty peach color is coming back from the top down, with a faint warm glow at its edge. The screens are plain and blank.
```

**4枚目（カット6）**
```
Character A hugs the tiny cream felted wool smartphone to its chest with both stubby arms, eyes closed in a happy curved smile; A's body is back to its dusty peach color, puffed up big and round, and a few short soft felted wool sunbeam tufts stick out from its top. Character B has closed the tiny cream felted wool laptop on its lap and smiles softly at A, body in its normal pale blue with a gentle warm glow on its top puff. The sofa and both characters keep the same position and size as before.
```

### 崩れやすいところ（ゲームオーバー3 に足すもの）

- パソコンやスマホの画面に文字・アイコン・顔が出る（画面は無地）
- パソコンが机の上に出る（背景は無地のまま。パソコンは B のひざの上）
- 2 で A の灰色と雨つぶが弱い → 2 だけ作り直す。**2 の「隣で気づかない B と、雨の A」が笑いどころ**
- B まで灰色になる（2 の B は元の色のまま）

## 3. 書き出し（Claude の担当）

```bash
python3 prep-futari.py <1枚目.png> plate-1.png 260      # 2枚目→plate-2、3枚目→plate-5、4枚目→plate-6
B='"band":["仕事がいそがしい日の","「いま　なにしてる？」"]'
Q='"lines":["いそがしい　ときに　きた。","どうする？"]'
node render-game.js plate-1.png f1.png win  "{$B,$Q,\"cmd\":{\"items\":[\"よるに　ゆっくり　かえす\",\"ひとこと　だけ　かえす\"],\"sel\":0},\"top\":400}"
node render-game.js plate-2.png f2.png win  "{$B,\"lines\":[\"「よるに　ゆっくり　かえそう」……\",\"そのあいだ　6じかん、\",\"きどくの　まま。\"],\"top\":400}"
node render-game.js plate-2.png f3.png over '{"lines":["いそがしいのは　みえない。","みえるのは　きどく　だけ。"],"cmd":{"items":["もういちど","やめる"],"sel":0}}'
node render-game.js plate-1.png f4.png win  "{$B,$Q,\"cmd\":{\"items\":[\"よるに　ゆっくり　かえす\",\"ひとこと　だけ　かえす\"],\"sel\":1},\"top\":400}"
node render-game.js plate-5.png f5.png win  "{$B,\"lines\":[\"「いま　バタバタ！」\",\"「よる　でんわ　していい？」\"],\"top\":400}"
node render-game.js plate-6.png f6.png win  "{$B,\"lines\":[\"「まってる！」\",\"れんらくも　ふたりも　はれた！\"],\"top\":400}"
python3 build_reel.py futari-go6 kinda-ig-1024-futari-gameover6.mp4
python3 add_sfx.py kinda-ig-1024-futari-gameover6.mp4 kinda-ig-1024-futari-gameover6-sfx.mp4 futari-go
```

- 音：前5回と別の 8bit。GAME OVER で止めて、カット5で戻す
- カバーは1カット目／AI 生成の開示／無音で出さない

## 4. キャプション

```
連絡のテンポは人によって違います。
忙しい日にまとめて返すのは、ちゃんと返したいからだったりします。
でも相手の画面に見えるのは「既読」だけです。

ひとこと先に返しておくと、待つ時間の天気が変わります。
どのくらいの間隔がちょうどいいかは、ふたりで話しておけると楽です。

返信がはやいのはどっち？
相手に送って、聞いてみてください。

#カップルあるある #LINE #恋愛あるある #連絡頻度 #婚活
```

## 5. トーンの線（セルフチェック）

- [x] 笑う対象は「既読だけが見える」という**仕組み**。返しが遅い人も、待つ人も下に見ない
- [x] 性別を言わない／焦らせない／絵文字なし／一手（先にひとこと）を返している
- [x] 「すぐ返すべき」と決めつけていない（夜にまとめるのは「ちゃんと返したいから」と書いた）
- [x] 同じ週の話題（行き先・ひとり時間・家事）と重ならない
- [x] 読点は1文あたり 0.6（7文に4つ）・接続詞のあとに読点なし

## 6. 見る数字（3日後＝10/27）

送信数と3秒残存（ゲームオーバー3〜5 と比べる）。

## 7. 実際に作った形（2026-10-24）

- 生成4枚は**初回で全採用**。保存先 `assets/futari/tenki-go6-{1-busy,2-kidoku,5-hitokoto,6-matteru}-v1.webp`
- 2枚目は A がはっきり灰色で雨つぶも出て、B は元の色のまま真剣な顔。狙いどおり
- 3枚目（カット5）は B がウインクしながらスマホを掲げた。A は上から色が戻りかけている
- 4枚目（カット6）は B がパソコンを閉じていないが、やわらかい顔なので採用
- カット2の1行目は「「よるに　ゆっくり　かえそう」……」が折り返したので「「よるに　かえそう」……」に縮めた
- 書き出し：`kinda-ig-1024-futari-gameover6-sfx.mp4`（12.5秒・効果音8つ）。MP4 はリポジトリに入れていない
