# 【ストック】「ふたり」ゲームオーバー回・その2「彼氏の機嫌が悪い日」制作キット（2026-10-04 作成・未投稿）

> 10/4 用に作ったが、ふうか指示でストックに回した。出すときは §0 の「同じ週の話題」を確認し直す。

> 前回（#2・9/28「彼女の機嫌が悪い日」）のキットは `packs/ig-reel-futari-gameover.md`。道具・版面・秒数は**すべて前回と同じ**。
> 案の経緯は `series/futari-ideas.md` 案1（「反響がよければ、次は役を入れ替えた回を作る」）。

## 0. なぜこの回か（10/4 の選定）

10/4 は日曜で定番枠がなく、Notion にも予定がなかったため、ネタ帳から選んだ。

| 直近の回 | 3秒残存 | 平均再生 | プロフ遷移 |
|---|---|---|---|
| ことさん#1（9/23） | 38% | 4秒 | 0 |
| **ふたり#2 ゲームオーバー（9/28）** | **26%** | **4秒／12秒** | **1** |
| 木曜1枚#2 間取り（10/1） | 26% | 4秒 | 0 |
| ことさん#3（9/30） | 23% | 3秒 | 0（フォロー1） |
| ふたり#1（9/27） | 19% | 2秒 | 0 |
| 連載 第3週（9/29）・言いにくい気持ち（9/26） | 5〜6% | 1秒 | 0 |

- ふたり#2 は**ことさん以外で一番残った回**で、プロフィール遷移も出た。前回のキットに「反響がよければ役を入れ替えた回を作る」と書いてあり、その条件を満たした
- 役の入れ替えは、#2 で気にしていた「機嫌が悪い＝彼女」の偏りを打ち消す役目もある
- 案4「肯定の型」は TODO で**並べる型#1（10/3）の数字を見てから**と決めてあるので、今日は使わない
- 同じ週の話題と重ならない：10/6 連載は「子どものこと」、10/7・10/9 はことさん、10/8 は note の今日の天気

### 前回と変えたところ（近似重複を避ける）

同じ「そっとしておく → GAME OVER」をなぞると、文言も絵もほぼ前回と同じになる。今回は**外れの選択肢を逆にする**。

- 前回：**放っておく**でゲームオーバー → 聞いてみる
- 今回：**問いつめる**でゲームオーバー → 先に食べ物を出して、話せる空気をつくる

「放っておくのも、つめるのもちがう」がシリーズとしてつながり、2本並べて見る理由にもなる。

## 1. 台本（6カット・12.5秒。秒の区切りは前回と同じ）

| # | 秒 | 画面 | 窓の文字 | 音 |
|---|---|---|---|---|
| 帯 | GAME OVER 以外 | — | 付き合いたての／**彼氏**の機嫌が悪い日 | — |
| 1 | 0〜2.4 | 彼氏がそっぽを向いてふくれている。彼女が横目で見て汗 | かれしの　きげんが　わるい。／どうする？／**▶ なんで　おこってるの？**／　なにか　たべる？ | ピコ・ピコ／曲 |
| 2 | 〜4.3 | 彼女が身を乗り出して詰め寄る。彼氏は帽子を目深に下げて縮こまる | 「なんで？」／「わたし　なにかした？」／「ねえ、なんで？」 | ポン |
| 3 | 〜6.7 | **GAME OVER**（2 の絵をモノクロで暗く） | きくのと　つめるのは／ちがう。／▶ もういちど　やめる | 下がる4音・**曲を止める** |
| 4 | 〜8.4 | **1 と同じ絵** | 同じ文。**カーソルだけ「▶ なにか　たべる？」** | ピコ・ピコ |
| 5 | 〜10.3 | 彼女がそっと小さなおにぎりを差し出す | 「なにか　たべる？」 | ポン |
| 6 | 〜12.5 | 彼氏がおにぎりを持って、ほどけた顔で彼女のほうを向き、話し出す | おなかが　すいていた　らしい。／きげんが　すこし　なおった！ | レベルアップ・曲が戻る |

- 終わりは前回と同じく「**すこし**　なおった！」。食べたら全部解決、とは言わない
- 「おなかがすいていた」はオチ。理由はいつも深刻とは限らない、という笑い。理由を聞くのは**落ち着いてから**でいい、がキャプションの一手

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**最初に `docs/sns/assets/futari/futari-reference-v1.webp`（キャラ設定画）を添付する。**
1・2・5・6 の4枚だけ生成する（3 は 2 の加工、4 は 1 の使い回し）。

キャラは第1回と同じ：**A（左・ダスティローズ・耳・クリームのマフラー）＝彼女**、**B（右・オートミール・緑のニット帽）＝彼氏**。

### 共通テンプレート（【ACTING】だけ差し替え）

```
Use exactly the same two characters as in the reference image (same colors, same fleece fabric, same stitches, same green beanie, same cream scarf, same sizes). They sit side by side on a small cream plush sofa, character A on the left, character B on the right. The sofa sits on a plain warm beige background (#F5EEE6) — no room, no walls, no floor line, no other furniture.
Front view, camera at eye level. The sofa and the two characters are centered and fill the lower 60 percent of the image. The top 38 percent of the image is completely plain empty beige background.
Soft daylight from the upper left, one soft shadow. Miniature product photography, matte fleece texture with visible stitches.
【ACTING】
No notebook. No text, no letters, no numbers, no logos. No speech bubbles. No gold, no brass, no metallic parts. Portrait 2:3 (1024x1536).
```

| # | 【ACTING】 |
|---|---|
| 1 | `Character B sits turned away from A, facing slightly toward the right edge of the sofa, stubby arms crossed, cheeks puffed out, eyes closed in a small sulky frown, the green beanie drooping, the whole body a little stiff. Character A sits upright and glances sideways at B with worried round eyes, one tiny clear droplet of sweat beside the head, stubby arms held close to the body.` |
| 2 | `Character A leans in very close toward B, almost pressing against B's side, one stubby arm raised and pointing at B, eyes wide and intense, a big open mouth as if firing questions one after another. Character B shrinks away toward the right edge of the sofa, both stubby arms pulling the green beanie down over the eyes, the body squeezed small and round.` |
| 5 | `Character A sits calmly beside B and gently holds out a tiny round felt rice ball wrapped in a small dark green felt strip, offering it to B with both stubby arms, a soft small smile, eyes gentle. Character B is still turned away but glances back over its shoulder at the rice ball with one eye, cheeks a little less puffed.` |
| 6 | `Character B has turned back toward A, holding the tiny felt rice ball with one small bite missing in both stubby arms, the cheeks no longer puffed, a small soft relieved face with a tiny open mouth as if starting to talk. Character A faces B and listens with a gentle small smile, nodding slightly.` |

### 崩れやすいところ（出たら作り直す）

- 2体の色・帽子・マフラーが変わる／**左右が入れ替わる**（今回すねるのは右の B。A と B を取り違えやすい）
- 手帳が出る／おにぎりに顔や文字が入る
- 上の38%に何か写り込む（帯と窓が載らない）
- 1 と 5・6 で**ソファと2体の位置がずれる**（4 で 1 を使い回すので、1 だけは特に構図を守る）
- 2 の詰め寄りが弱い → 2 だけ作り直してよい。**2 の「詰めすぎ」がこの回の笑いどころ**

## 3. 書き出し（Claude の担当）

準備は前回 §3 と同じ（`dot-ja.woff2` `dot-la.woff2` `noto900.woff2`）。**帯を `"band"` で彼氏に差し替える**のが前回との違い。

```bash
python3 prep-futari.py <生成1.png> plate-1.png 260      # 2・5・6 も同じ
B='"band":["付き合いたての","彼氏の機嫌が悪い日"]'

NODE_PATH=$(npm root -g) node render-game.js plate-1.png f1.png win  "{$B,\"lines\":[\"かれしの　きげんが　わるい。\",\"どうする？\"],\"cmd\":{\"items\":[\"なんで　おこってるの？\",\"なにか　たべる？\"],\"sel\":0},\"top\":400}"
NODE_PATH=$(npm root -g) node render-game.js plate-2.png f2.png win  "{$B,\"lines\":[\"「なんで？」\",\"「わたし　なにかした？」\",\"「ねえ、なんで？」\"],\"top\":400}"
NODE_PATH=$(npm root -g) node render-game.js plate-2.png f3.png over '{"lines":["きくのと　つめるのは","ちがう。"],"cmd":{"items":["もういちど","やめる"],"sel":0}}'
NODE_PATH=$(npm root -g) node render-game.js plate-1.png f4.png win  "{$B,\"lines\":[\"かれしの　きげんが　わるい。\",\"どうする？\"],\"cmd\":{\"items\":[\"なんで　おこってるの？\",\"なにか　たべる？\"],\"sel\":1},\"top\":400}"
NODE_PATH=$(npm root -g) node render-game.js plate-5.png f5.png win  "{$B,\"lines\":[\"「なにか　たべる？」\"],\"top\":400}"
NODE_PATH=$(npm root -g) node render-game.js plate-6.png f6.png win  "{$B,\"lines\":[\"おなかが　すいていた　らしい。\",\"きげんが　すこし　なおった！\"],\"top\":400}"

python3 build_reel.py futari-go6 kinda-ig-1004-futari-gameover2.mp4          # 12.5秒
python3 add_sfx.py kinda-ig-1004-futari-gameover2.mp4 kinda-ig-1004-futari-gameover2-sfx.mp4 futari-go
```

窓の幅は1行あたり全角13〜14字。それを超えると折り返す（10/4 に前回の絵で試し書きして確認済み）。

## 4. 音

前回と同じ形：明るい曲を0秒から → **GAME OVER（4.3秒）で止める** → カット5（8.4秒〜）でフェードインして戻す。
**前回と同じ曲は避ける**（同じ音＋同じ版面だと近似重複に寄る）。IG の音楽検索で「8bit」「chiptune」から別の曲を。

## 5. キャプション

```
この前は「そっとしておく」でゲームオーバーでした。
今回は、その逆です。

「なんで？」を重ねると、
聞いているつもりで、相手を追いつめてしまうことがあります。

理由を聞くのは、少しあとでいい。
先に、話せる空気をつくる。
あたたかい飲み物でも、おにぎりでも。

付き合いたてのふたりは、
お互いの「機嫌の戻し方」を、まだ知らないだけです。
自分の戻し方を、相手にこっそり送っておくのもありです。

彼女でも彼氏でも、同じです。

#カップルあるある #付き合いたて #恋愛あるある #彼氏の機嫌 #婚活
```

- 「こっそり送っておく」は**送信数を動かすための一行**（これまで全回0）。押しつけにならないよう「〜のもありです」で止めた
- 投稿時：**カバーは1カット目**／AI 生成の開示／無音で出さない

## 6. トーンの線（セルフチェック）

- **笑う対象は彼女ではなく「問いつめる」という選び方。** 彼女を悪者にしない（GAME OVER の文は「きくのと　つめるのは　ちがう。」で、人ではなく行動を言う）
- 「男はお腹が空くと不機嫌」という決めつけに寄らないよう、キャプションは食べ物を「あたたかい飲み物でも、おにぎりでも」と**場をつくる手段の一例**として置き、「彼女でも彼氏でも、同じです」で閉じる
- 焦らせない・関係の終わりを言わない（「ふられた」「わかれた」は出さない）
- 空虚な共感ではなく「理由は少しあとで、先に話せる空気を」という具体的な一手を返している
- 絵文字なし（キャプションも区切り用途すら使っていない）

## 7. 見る数字

- **送信数**（キャプションの一行が効くか）と**3秒残存**（#2 の26%と比べる）
- #2 と並べて、役を入れ替えても残るか＝「ゲームオーバー」が型として使えるかを判断する
