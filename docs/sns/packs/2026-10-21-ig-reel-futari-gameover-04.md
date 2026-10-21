# 「ふたり」ゲームオーバー4「ひとりになりたい日」制作キット（2026-10-21 水 20:00）

> §21 では 10/21 は空ける予定だった。ふうか「今日も出したい」（10/21）で、**10/22 木のゲームオーバー4を今日に前倒し**し、**10/22 を空けた**。今週の主役は火・水・土の3本で、週3本は変わらない。
> 型・道具・秒数・2体はゲームオーバー3（`packs/2026-10-20-ig-reel-futari-gameover-03.md`）と同じ。プロンプトの共通テンプレートと天気の出方の表は同 §2 をそのまま使う。

## 0. なぜこの回か

- pair `l2-alone`「一人の時間がどれくらい必要か」。3回目の「行き先」は会話の層 1。今回は層 2 で、同じ週の話題と重ならない
- 「いっしょにいたいけど、ちょっとだけひとりになりたい」は言い出しにくい。**「これ私だ」と思った人が相手に送る理由が絵の中にある**（判定は送信数）
- 前回は2体ともどんよりした。今回は **A だけ雨・B は晴れたまま気づかない**ので、同じ型でも笑いどころがちがう
- 性別を言わない回（帯・窓は「あいて」も使わずに成り立つ）

## 1. 台本（6カット・12.5秒。秒の区切りは前回と同じ）

| # | 秒 | 画面 | 窓の文字 | 音 |
|---|---|---|---|---|
| 帯 | GAME OVER 以外 | — | 付き合いたての／ひとりになりたい日 | — |
| 1 | 0〜2.4 | B がわくわくして A に寄る。A は少しくすんで、ぐったり | 「つぎ、なに　する？」／どうする？／**▶ がまんして　つきあう**／　ひとりじかんを　たのむ | ピコ・ピコ／曲 |
| 2 | 〜4.3 | B はまだ晴れて楽しそう。A だけ灰色にしぼみ、体の下から雨 | がまんして　つきあった。／……Aだけ　あめが　ふってきた。 | ポン |
| 3 | 〜6.7 | **GAME OVER**（2 の絵をモノクロで暗く） | がまんは　あとで／まとめて　ふる。／▶ もういちど　やめる | 下がる4音・**曲を止める** |
| 4 | 〜8.4 | **1 と同じ絵** | 同じ文。**カーソルだけ「▶ ひとりじかんを　たのむ」** | ピコ・ピコ |
| 5 | 〜10.3 | A が B のほうを向いて、そっとお願いする。B は聞いている | 「30ぷんだけ　ひとりで」／「やすんでも　いい？」 | ポン |
| 6 | 〜12.5 | ソファの両はしで、A はマグ・B は本。2体とも元の色で、ふちが光る | 「いいよ、ゆっくりね」／ふたりとも　すこし　はれた！ | レベルアップ・曲が戻る |

- カット2の窓は「Aだけ」と書くと記号っぽい。**書き出し時に「ひとりだけ　あめが　ふってきた。」に替えてよい**（Claude が文字幅を見て決める）
- GAME OVER の文は**人ではなく行動を言う**。いっしょにいたい B を悪者にしない（B は気づいていないだけ）
- 終わりは「すこし　はれた！」。言えば全部うまくいく、とは言わない

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**設定画 `docs/sns/assets/futari/tenki-reference-v1.webp` を最初に添付する。**
共通テンプレートはゲームオーバー3 §2 のまま（【ACTING】だけ差し替え）。

**1枚目（カット1・4）**
```
Character B has scooted close to A and leans toward A with sparkly eager eyes and a wide open happy mouth, one stubby arm raised as if asking "what shall we do next?"; B's body has puffed up a little bigger and its top puff glows warm and bright, as if sunlight is breaking through it. Character A sinks slightly into the sofa with tired droopy half-closed eyes and a small wobbly smile, trying to keep up; A's dusty peach color has faded a little paler and greyer, and A's body sags a little lower than normal.
```

**2枚目（カット2・3）**
```
Character B is still bright and happy, its pale blue body puffed up and glowing at the top, swinging its stubby arms cheerfully and looking forward, not noticing A at all. Character A, right next to B, has turned completely dull ash-grey and gone flat and deflated like a heavy rain cloud, with gloomy downcast eyes and a flat mouth; a few tiny felted wool raindrops are falling from the bottom of A's own body onto the sofa. Only A is grey; B keeps its normal bright pale blue color.
```

**3枚目（カット5）**
```
Character A has turned toward B and raises one stubby arm a little, gently, as if politely asking for something, with a small shy apologetic smile; A's body is still mostly ash-grey, but the dusty peach color is coming back from the top down. Character B has stopped and looks at A with round attentive eyes and a small open mouth, listening; B is still its normal pale blue.
```

**4枚目（カット6）**
```
The two characters now sit at the two opposite ends of the same sofa, a little apart, both relaxed. Character A, fully back to its dusty peach color, holds a tiny cream felted wool mug in both stubby arms, eyes peacefully closed, a soft content smile. Character B, normal pale blue, holds a tiny open felted wool book with plain blank pages, smiling softly. Both bodies have a gentle warm glow at their top edges, like clouds after the rain clears. The sofa and both characters keep the same position and size as before.
```

### 崩れやすいところ（ゲームオーバー3 に足すもの）

- 2 で **B までくすむ**（この回は B が晴れたままなのが笑いどころ）→ 2 だけ作り直す
- 雨が頭の上の別の雲から降る → 体の下から落ちるように作り直す
- 4 で2体がくっつく（少し離れて座るのが「ひとりの時間」）／本やマグに文字が入る

## 3. 書き出し・音・投稿

- 書き出しはゲームオーバー3 §3 と同じ手順（`prep-futari.py` の上端 260・窓 top 400）。帯と窓の文字だけ §1 に替える
- 音：前3回と別の 8bit。GAME OVER で止めて、カット5で戻す
- カバーは1カット目／AI 生成の開示／無音で出さない

## 4. キャプション

```
いっしょにいるのは楽しいのに、少しだけひとりになりたいときがあります。
それは相手を嫌になったサインではないと思います。

がまんして合わせ続けると、あとでまとめて疲れが出やすくなります。
「30分だけ休んでもいい？」と先に言えたら、ふたりとも楽になります。

一人の時間がどれくらい要るかは、人によってちがいます。
付き合いはじめのうちに知っておけると安心です。

ひとり時間がほしい派の人は、こっそり相手に送っておくのもありです。

#カップルあるある #付き合いたて #ひとり時間 #恋愛あるある #婚活
```

## 5. トーンの線（セルフチェック）

- 笑う対象は「がまんして合わせる」という**やり方**。いっしょにいたい側もひとりになりたい側も下に見ない
- 「ひとりになりたい＝冷めた」と読まれないよう、キャプション2行目で先に否定している
- 性別を言わない／焦らせない／絵文字なし／一手（先に時間を区切って言う）を返している

## 6. 見る数字（3日後＝10/24）

**送信数**と3秒残存（ゲームオーバー3 と比べる。熊の1・2 は 26%・24%）。
