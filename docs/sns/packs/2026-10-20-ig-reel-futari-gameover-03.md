# 「ふたり」ゲームオーバー3「行き先が決まらない日」制作キット（2026-10-20 火 20:00）

> 新しい方向（`ig-strategy-2026-09.md` §21）の1本目。主役＝ゲームオーバー型・同じ2体。
> **キャラは今回から羊毛フェルトの雲の2体**（§2）。道具・版面・秒数は前2回（`packs/ig-reel-futari-gameover.md`・`packs/2026-10-04-ig-reel-futari-gameover-02.md`）と同じ。

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

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

> **10/20 キャラを替えた（ふうか決裁）。** フリースの熊2体 → **羊毛フェルトの雲の2体**。
> - 熊は AI のかわいい系で最も多い形で、Kinda のだと分かる理由がなかった
> - 素材はクレイで試した → ふうか「ふわふわで触りたくなるほうがいい」で羊毛フェルトに。顔はふうかが描き直した（ぐるぐる目・八の字眉・ω口）
> - **気持ちは体そのものの天気で出す**（ふうか「頭上より、体から天気が変わるほうが予想外で面白い」）
>
> **設定画（参照）＝ `docs/sns/assets/futari/tenki-reference-v1.webp`**（毎回これを最初に添付する）。
> A（左）＝くすんだピーチの、横に丸い雲。B（右）＝淡い青の、上に丸いぽこっとがある背の高い雲。

### 共通テンプレート（【ACTING】だけ差し替え）

```
Use exactly the same two needle-felted wool cloud characters as in the reference image: same shapes, same colors, same sizes, same face style (hand-stitched dark thread swirl eyes, small arched eyebrows, a tiny "ω"-shaped mouth, soft pink cheeks). Their expressions may change as described below. Character A (dusty peach, wide and round) sits on the left, character B (pale blue, taller with a round puff on top) sits on the right, side by side on a small cream wool felt sofa. Plain warm beige background (#F5EEE6) — no room, no walls, no floor line, no other furniture.
Their feelings show as weather in their own bodies: the wool itself changes color, puffs up or deflates, and tiny felted wool weather comes out of the body itself. Nothing floats separately above their heads.
Front view, camera at eye level. The sofa and the two characters are centered and fill the lower 55 percent of the image. The top 40 percent of the image is completely plain empty beige background.
Soft daylight from the upper left, one soft shadow. Handmade needle-felted wool, soft fluffy fuzzy fibers, matte, not glossy, not clay, no stitches on the body.
【ACTING】
No notebook. No text, no letters, no numbers, no logos. No speech bubbles. No gold, no metallic parts. Portrait 2:3 (1024x1536).
```

| 枚 | 台本 | 【ACTING】 |
|---|---|---|
| 1 | カット1・4 | `Character B has turned toward A, leaning in with sparkly eager eyes and an open happy mouth, one stubby arm raised a little as if asking a fun question; B's body has puffed up a little bigger and its top puff glows warm and bright, as if sunlight is breaking through it. Character A looks up and to the side, thinking hard, one stubby arm touching its cheek, a worried wobbly mouth; thin wisps of A's own wool swirl up from the top of its head like a little gust of wind.` |
| 2 | カット2・3 | `Both characters have slumped back into the sofa, each holding a tiny cream felted wool smartphone in both stubby arms and staring down at it with tired half-closed eyes and flat mouths. Both bodies have turned a dull ash-grey version of their colors and gone flat and deflated, sagging like heavy overcast clouds. The phone screens are plain and blank.` |
| 3 | カット5 | `Character A, back to its normal dusty peach color, holds up two tiny felted wool objects, one in each stubby arm: on the left a tiny cream coffee cup, on the right a tiny soft orange fish, with a soft small smile. Character B looks at them with round curious eyes, leaning in; B's body is still mostly ash-grey, but the pale blue color is coming back from the top down, and the top puff has a faint warm glow at its edge.` |
| 4 | カット6 | `Character B, fully back to its pale blue color, points happily with one stubby arm at the tiny orange fish that A is still holding; B has a wide open smile and sparkly eyes, its body puffed up big and round, and a few short soft felted wool sunbeam tufts stick out from its top puff. Character A smiles softly back with a gentle warm glow on its top. The tiny coffee cup is still in A's other arm.` |

### 天気の出方（この型の決まり・以後も同じ）

**天気は頭の上に浮かべず、体そのものに出す。**

| 気持ち | 体 |
|---|---|
| ふつう | 設定画の色のまま |
| わくわく・うれしい | ひとまわりふくらみ、上のほうが日が差すように明るく光る（強いと光の毛が飛び出す） |
| 考えこむ・迷う | 頭のてっぺんの毛が、風のうずのように巻き上がる |
| どんより・すれちがい | 灰色にくすみ、平たくしぼむ（重いくもり空） |
| すねる・悲しい | 灰色になり、体の下から小さな羊毛の雨つぶが落ちる |
| ほどけはじめ | 灰色が上から元の色に戻り、ふちが少し光る |

### 崩れやすいところ（出たら作り直す）

- 顔が変わる（ぐるぐる目・八の字眉・ω口が、点の目や別の口になる）／2体の色・形・左右が入れ替わる
- **天気が頭の上に別の物として浮かぶ**（雲や太陽が体と離れて出る）→ 「comes out of the body itself」を強めて作り直す
- つやが出る・縫い目のあるぬいぐるみになる
- 上の40%に何か写り込む（帯と窓が載らない）
- スマホの画面に何か映る／カップや魚に顔や文字が入る
- 1 と 3・4 で**ソファと2体の位置がずれる**（カット4で1を使い回すので、1 だけは特に構図を守る）
- 2 の灰色・しぼみが弱い → 2 だけ作り直してよい。**2 の「ふたりそろってどんより」がこの回の笑いどころ**

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

## 8. 実際に作った形（2026-10-20）

- 生成4枚は**初回で全採用**。保存先 `assets/futari/tenki-go3-{1-think,2-phone,5-choose,6-sunny}-v1.webp`（設定画は `tenki-reference-v1.webp`）
- 台紙の上端 260・窓の top 400 のままで、帯・窓とキャラ（A の風のうず・B の光）が重ならなかった
- カット2の灰色は控えめ（A は灰がかったモーヴ、B は青みが残る）だが、カット3の GAME OVER がモノクロなので落差は出ている
- カット6の B の光は、体から少し離れた黄色い線になった（「体から出る」の決まりからは少し外れるが、読みやすさを取って採用）
- 書き出し：`kinda-ig-1020-futari-gameover3-sfx.mp4`（12.5秒・効果音8つ）。MP4 はリポジトリに入れていない
