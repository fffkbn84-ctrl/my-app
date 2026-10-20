# 「ふたり」ゲームオーバー3「行き先が決まらない日」制作キット（2026-10-20 火 20:00）

> 新しい方向（`ig-strategy-2026-09.md` §21）の1本目。主役＝ゲームオーバー型・同じ2体。
> 道具・版面・秒数は前2回（`packs/ig-reel-futari-gameover.md`・`packs/2026-10-04-ig-reel-futari-gameover-02.md`）と同じ。

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

**最初に `docs/sns/assets/futari/futari-reference-v1.webp`（キャラ設定画）を添付する。**
1・2・5・6 の4枚だけ生成する（3 は 2 の加工、4 は 1 の使い回し）。
キャラ：**A（左・ダスティローズ・耳・クリームのマフラー）**、**B（右・オートミール・緑のニット帽）**。今回は A が選ぶ側（プレイヤー）。

共通テンプレートは前回 §2 と同じ（【ACTING】だけ差し替え）。

| # | 【ACTING】 |
|---|---|
| 1 | `Character B has turned its body toward A, leaning in slightly with bright round eager eyes and a small open happy mouth, one stubby arm raised a little as if asking a fun question. Character A sits upright looking up and to the side as if thinking hard, one stubby arm touching its cheek, one tiny clear droplet of sweat beside the head.` |
| 2 | `Both characters have slumped back into the sofa side by side, each holding a tiny cream clay smartphone in both stubby arms and staring down at it with tired half-closed eyes, mouths in small flat lines, bodies drooping. The phone screens are plain and blank.` |
| 5 | `Character A holds up two tiny felt objects, one in each stubby arm: on the left a tiny cream felt coffee cup, on the right a tiny pale blue felt fish. A has a soft small smile. Character B looks at the two objects with round curious eyes, leaning in a little. The phones are gone.` |
| 6 | `Character B points happily with one stubby arm at the tiny pale blue felt fish that A is still holding up, B's face bright with a wide open smile and sparkling eyes. Character A smiles softly back at B. The tiny cream felt coffee cup is still in A's other arm.` |

### 崩れやすいところ（出たら作り直す）

- 2体の色・帽子・マフラーが変わる／左右が入れ替わる
- 手帳が出る／スマホの画面に何か映る／カップや魚に顔や文字が入る
- 上の38%に何か写り込む（帯と窓が載らない）
- 1 と 5・6 で**ソファと2体の位置がずれる**（4 で 1 を使い回すので、1 だけは特に構図を守る）
- 2 のぐったりが弱い → 2 だけ作り直してよい。**2 の「30分スマホ」がこの回の笑いどころ**

## 3. 書き出し（Claude の担当）

```bash
python3 prep-futari.py <生成1.png> plate-1.png 260      # 2・5・6 も同じ
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
