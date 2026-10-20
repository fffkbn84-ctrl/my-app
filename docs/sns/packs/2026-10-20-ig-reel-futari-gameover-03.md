# 「ふたり」ゲームオーバー3「行き先が決まらない日」制作キット（2026-10-20 火 20:00）

> 新しい方向（`ig-strategy-2026-09.md` §21）の1本目。主役＝ゲームオーバー型・同じ2体。
> **キャラは今回から天気の2体**（§2）。道具・版面・秒数は前2回（`packs/ig-reel-futari-gameover.md`・`packs/2026-10-04-ig-reel-futari-gameover-02.md`）と同じ。

## 0. なぜこの回か

- 前2回はどちらも「機嫌が悪い日」。3本続けると近似重複になるので、**場面を「次のデートの行き先を決める」に替えた**（pair `l1-holiday`「休みの日の過ごし方」の手前の会話）
- 「どこでもいいよ」は言う側も言われる側も覚えがあり、**「これ言いがちな人」に送る理由が絵の中にある**（判定は送信数）
- **性別を言わない回にした**（§21 の提案。帯・窓は「あいて」）。2体の性別は絵で描いていないので成り立つ
- 同じ週の話題：10/18 人の説明書・10/19 ぎっしり#6（ホテルのロビー）と重ならない

## 1. 台本（6カット・12.5秒。秒の区切りは前回と同じ）

| # | 秒 | 画面 | 窓の文字 | 音 |
|---|---|---|---|---|
| 帯 | GAME OVER 以外 | — | 付き合いたての／行き先が決まらない日 | — |
| 1 | 0〜2.4 | B が A のほうを向いて、わくわくした顔で聞いている。A は考えこむ | 「つぎ、どこ　いきたい？」／どうする？／**▶ どこでも　いいよ**／　ふたつに　しぼる | ピコ・ピコ／曲 |
| 2 | 〜4.3 | 2体ともスマホをのぞきこんで、ぐったり | 「どこでも　いいよ」……／ふたりで　30ぷん、／スマホを　みつづけた。 | ポン |
| 3 | 〜6.7 | **GAME OVER**（2 の絵をモノクロで暗く） | やさしさの　つもりが／まかせきりに　なる。／▶ もういちど　やめる | 下がる4音・**曲を止める** |
| 4 | 〜8.4 | **1 と同じ絵** | 同じ文。**カーソルだけ「▶ ふたつに　しぼる」** | ピコ・ピコ |
| 5 | 〜10.3 | A が小さなコーヒーカップと魚を両手に持って見せる | 「カフェと　すいぞくかん、」／「どっちが　いい？」 | ポン |
| 6 | 〜12.5 | B が魚を指さして、ぱっと明るい顔。A もにっこり | 「すいぞくかん！」／つぎの　よていが　きまった！ | レベルアップ・曲が戻る |

- GAME OVER の文は**人ではなく行動を言う**（「どこでもいい」と言う人を悪者にしない。やさしさで言っていることを先に認める）
- 終わりは「よていが　きまった！」。うまくいく約束はしない

## 2. ChatGPT プロンプト（同じスレッドで5枚・2:3）

> **10/20 キャラを替えた（ふうか決裁）。** フリースの熊2体 → **気持ちが天気になって出る、クレイの雲の2体**。
> 理由：熊は AI のかわいい系アカウントで最も多い形で、Kinda のだと分かる理由がなかった。天気は note・サイトと同じ言葉で、すねた／ほどけたが1秒で読め、性別も出ない。
> 質感はサイトの天気画像（`public/images/w_*.webp`）と同じマットなクレイ（つやのあるフリースが AI っぽさの元）。

**0枚目＝設定画**（初回だけ。これが以後の参照になる。採用したら `assets/futari/tenki-reference-v1.webp` に保存）

```
Character design sheet photo. Two small handmade clay characters standing side by side on a plain warm beige background (#F5EEE6), front view, camera at eye level, centered. Both are shaped like small puffy cumulus clouds with a rounded bottom, short stubby clay arms and tiny round clay feet. Character A (left): soft dusty rose clay (#D9A797), a little wider and rounder. Character B (right): soft pale blue-grey clay (#A7B6BE), a little taller with one small puff on top. Faces: two small black clay bead eyes, a tiny carved mouth line, faint soft pink cheeks. No clothes, no hats, no scarves, no accessories. Matte clay with faint fingerprints and tool marks, handmade miniature feel, not glossy, not plush, not fleece. Soft daylight from the upper left, one soft shadow. No text, no letters, no numbers, no logos. No gold, no metallic parts. Portrait 2:3 (1024x1536).
```

**1〜4枚目＝場面**（0枚目を参照に。テンプレートの【ACTING】だけ差し替え）

```
Use exactly the same two clay cloud characters as in the reference image (same shapes, same colors, same faces, same sizes, no clothes or accessories). They sit side by side on a small matte cream clay sofa, character A (dusty rose) on the left, character B (pale blue-grey) on the right. Plain warm beige background (#F5EEE6) — no room, no walls, no floor line, no other furniture.
Front view, camera at eye level. The sofa and the two characters are centered and fill the lower 55 percent of the image. The top 40 percent of the image is completely plain empty beige background. Any tiny clay weather above a head floats close to that head, inside the lower 55 percent.
Soft daylight from the upper left, one soft shadow. Handmade miniature clay, matte surface with faint fingerprints and tool marks, not glossy.
【ACTING】
No notebook. No text, no letters, no numbers, no logos. No speech bubbles. No gold, no metallic parts. Portrait 2:3 (1024x1536).
```

| 枚 | 台本 | 【ACTING】 |
|---|---|---|
| 1 | カット1・4 | `Character B has turned toward A, leaning in with bright round eager eyes and a small open happy mouth, one stubby arm raised a little as if asking a fun question; a tiny cream clay sun floats just above B's head. Character A looks up and to the side as if thinking hard, one stubby arm touching its cheek, one tiny clear clay droplet of sweat beside its head; a tiny pale clay swirl of breeze floats just above A's head.` |
| 2 | カット2・3 | `Both characters have slumped back into the sofa, each holding a tiny cream clay smartphone in both stubby arms and staring down at it with tired half-closed eyes, mouths in flat lines, bodies drooping and slightly squashed. One flat grey clay overcast cloud floats low above both of their heads. The phone screens are plain and blank.` |
| 3 | カット5 | `Character A holds up two tiny clay objects, one in each stubby arm: on the left a tiny cream clay coffee cup, on the right a tiny soft orange clay fish. A has a soft small smile. Character B looks at the two objects with round curious eyes, leaning in a little; above B's head the edge of a tiny cream clay sun peeks out from behind a tiny white clay cloud. The phones are gone.` |
| 4 | カット6 | `Character B points happily with one stubby arm at the tiny soft orange clay fish that A is still holding, B's face bright with a wide open smile; a tiny cream clay sun with short clay rays floats above B's head. Character A smiles softly back; a smaller tiny cream clay sun floats above A's head. The tiny coffee cup is still in A's other arm.` |

### 天気の出方（この型の決まり・以後も同じ）

| 気持ち | 頭の上 |
|---|---|
| ふつう | なにもない |
| わくわく・うれしい | 小さな太陽（強いと光の線） |
| 考えこむ・迷う | 小さな風のうず |
| どんより・すれちがい | 灰色のくもり（ふたりの上に1つ） |
| すねる・悲しい | 小さな雨雲と雨つぶ |
| ほどけはじめ | 雲のうしろから太陽がのぞく |

### 崩れやすいところ（出たら作り直す）

- 0枚目：**つやが出る・ぬいぐるみっぽくなる・服や小物が付く** → 「matte clay, not plush」を強めて作り直す
- 2体の色・形が変わる／左右が入れ替わる
- 天気が大きすぎて上の40%に入る（帯と窓が載らない）／天気に顔が付く
- スマホの画面に何か映る／カップや魚に顔や文字が入る
- 1 と 3・4 で**ソファと2体の位置がずれる**（カット4で1を使い回すので、1 だけは特に構図を守る）
- 2 のぐったりが弱い → 2 だけ作り直してよい。**2 の「30分スマホ」がこの回の笑いどころ**

## 3. 書き出し（Claude の担当）

```bash
python3 prep-futari.py <1枚目.png> plate-1.png 260      # 2枚目→plate-2、3枚目→plate-5、4枚目→plate-6
B='"band":["付き合いたての","行き先が決まらない日"]'
Q='"lines":["「つぎ、どこ　いきたい？」","どうする？"]'
node render-game.js plate-1.png f1.png win  "{$B,$Q,\"cmd\":{\"items\":[\"どこでも　いいよ\",\"ふたつに　しぼる\"],\"sel\":0},\"top\":400}"
node render-game.js plate-2.png f2.png win  "{$B,\"lines\":[\"「どこでも　いいよ」……\",\"ふたりで　30ぷん、\",\"スマホを　みつづけた。\"],\"top\":400}"
node render-game.js plate-2.png f3.png over '{"lines":["やさしさの　つもりが","まかせきりに　なる。"],"cmd":{"items":["もういちど","やめる"],"sel":0}}'
node render-game.js plate-1.png f4.png win  "{$B,$Q,\"cmd\":{\"items\":[\"どこでも　いいよ\",\"ふたつに　しぼる\"],\"sel\":1},\"top\":400}"
node render-game.js plate-5.png f5.png win  "{$B,\"lines\":[\"「カフェと　すいぞくかん、」\",\"「どっちが　いい？」\"],\"top\":400}"
node render-game.js plate-6.png f6.png win  "{$B,\"lines\":[\"「すいぞくかん！」\",\"つぎの　よていが　きまった！\"],\"top\":400}"
python3 build_reel.py futari-go6 kinda-ig-1020-futari-gameover3.mp4
python3 add_sfx.py kinda-ig-1020-futari-gameover3.mp4 kinda-ig-1020-futari-gameover3-sfx.mp4 futari-go
```

## 4. 音

前回と同じ形：明るい曲を0秒から → **GAME OVER（4.3秒）で止める** → カット5（8.4秒〜）でフェードインして戻す。
**前2回と別の曲**（IG の音楽検索「8bit」「chiptune」）。

## 5. キャプション

```
「どこでもいいよ」は、やさしさで言っていることが多いと思います。
でも聞いた側は、ぜんぶ自分で決めることになる。

ふたつにしぼって「どっちがいい？」と返すだけで、
相手はぐっと選びやすくなります。

付き合いたてのふたりは、お互いの「好き」をまだ知っている途中です。
選んでもらえると、次のデートの話もしやすくなります。

「どこでもいい」が口ぐせのあの人に、こっそり送っておくのもありです。

#カップルあるある #付き合いたて #デートの行き先 #恋愛あるある #婚活
```

投稿時：**カバーは1カット目**／AI 生成の開示／無音で出さない。

## 6. トーンの線（セルフチェック）

- 笑う対象は「どこでもいい」という**返し方**で、言った人ではない（やさしさを先に認めている）
- 性別を言っていない（帯・窓・キャプションとも「あいて」「ふたり」「相手」）
- 焦らせない・関係の終わりを言わない／絵文字なし
- 空虚な共感ではなく「ふたつにしぼって返す」という一手を返している

## 7. 見る数字（3日後）

**送信数**（最後の一行が効くか）と3秒残存（ゲームオーバー1・2 の 26%・24% と比べる）。
