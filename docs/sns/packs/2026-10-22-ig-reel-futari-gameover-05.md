# 「ふたり」ゲームオーバー5「ごはんのあと」制作キット（2026-10-22 木）

> 型・道具・秒数・2体はゲームオーバー3（`packs/2026-10-20-ig-reel-futari-gameover-03.md`）と同じ。共通テンプレートと天気の出方の表は同 §2 をそのまま使う。
> 22:18 に依頼を受けて作った回。20:00 には間に合っていない（§6）。

## 0. なぜこの回か

- pair **`l3-housework`「家事の分担のイメージ」**。今週は層1（行き先）・層2（ひとり時間）が出たので、層3で重ならない
- §21-c ④「題材の半分を 25〜34 寄りに」：おうちデート・お泊まり・一緒に住む前に出る話題
- §21-c ③「相手に聞きたくなる二択で終える」の最初の回。キャプションの最後を **「ごはんのあと、先に立つのはどっち？」** にする（見た人が相手に送って聞ける）
- 前2回は「片方の天気だけ変わる／ふたりともどんより」。今回は**ふたりとも相手を待って、少しずつくもる**
- 性別を言わない回（「わたし」も使わない）

## 1. 台本（6カット・12.5秒）

| # | 秒 | 画面 | 窓の文字 | 音 |
|---|---|---|---|---|
| 帯 | GAME OVER 以外 | — | おうちデートの／ごはんのあと | — |
| 1 | 0〜2.4 | 2体とも満腹でにこにこ。ソファの間に小さなお皿の山 | 「ごちそうさまでした！」／どうする？／**▶ きづいた　ほうが　やる**／　さきに　わけておく | ピコ・ピコ／曲 |
| 2 | 〜4.3 | 2体ともお皿をちらっと見て、相手を横目で待つ。体が灰色にしぼんでいく | おたがい　まって、／おさらは　そのまま　1じかん。 | ポン |
| 3 | 〜6.7 | **GAME OVER**（2 の絵をモノクロで暗く） | きづいた　ほうが、は／きづいた　ほうだけ　つかれる。／▶ もういちど　やめる | 下がる4音・曲を止める |
| 4 | 〜8.4 | **1 と同じ絵** | 同じ文。カーソルだけ「▶ さきに　わけておく」 | ピコ・ピコ |
| 5 | 〜10.3 | A がスポンジ、B がふきんを持って向き合う | 「あらうから、」／「ふいてくれる？」 | ポン |
| 6 | 〜12.5 | ぴかぴかのお皿の山。2体とも元の色で、ふちが光る | 「まかせて！」／おさらも　ふたりも　はれた！ | レベルアップ・曲が戻る |

- GAME OVER の文は行動を言う。先に気づく人も、気づかない人も悪者にしない
- 「分担を決めれば全部うまくいく」とは言わない

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**設定画 `docs/sns/assets/futari/tenki-reference-v1.webp` を最初に添付する。**
共通テンプレートはゲームオーバー3 §2 のまま（【ACTING】だけ差し替え）。

**1枚目（カット1・4）**
```
Between the two characters on the sofa sits a small neat stack of three tiny cream felted wool plates with a few soft brown crumbs on them. Both characters lean back happily with full round bellies, eyes closed in contented curved smiles, each patting its own tummy with one stubby arm. Both bodies are their normal colors and puffed up a little rounder than usual.
```

**2枚目（カット2・3）**
```
The same small stack of three tiny cream felted wool plates with crumbs still sits between them. Both characters glance sideways at the plates and then at each other out of the corners of their eyes, waiting, with flat mouths and slightly awkward eyes; neither moves. Both bodies have turned a dull ash-grey version of their colors and gone a little flat and deflated, like clouds slowly getting heavier.
```

**3枚目（カット5）**
```
Character A holds a tiny soft yellow felted wool sponge in one stubby arm and turns toward B with a small friendly smile, offering. Character B holds a tiny plain white felted wool dish towel in both stubby arms and looks at A with round eager eyes. Both bodies are coming back to their normal colors from the top down, with a faint glow at the edges. The stack of tiny plates still sits between them.
```

**4枚目（カット6）**
```
Between the two characters sits the same small stack of three tiny cream felted wool plates, now perfectly clean, with a few tiny soft white felted sparkle tufts on top. Character B raises one stubby arm proudly with a wide open smile and sparkly eyes, still holding the tiny white dish towel. Character A smiles softly with the tiny yellow sponge. Both bodies are their normal colors, puffed up and round, with a gentle warm glow on their tops. The sofa and both characters keep the same position and size as before.
```

### 崩れやすいところ（ゲームオーバー3 に足すもの）

- お皿に柄・顔・文字が入る／お皿が床やテーブルに置かれる（背景は無地のまま。お皿はソファの上）
- 2 で灰色が弱い → 2 だけ作り直す。**2 の「ふたりとも待ってくすむ」が笑いどころ**
- スポンジやふきんが別の物（ぬいぐるみ・クッション）に見える

## 3. 書き出し・音・投稿

- 書き出しはゲームオーバー3 §3 と同じ手順（`prep-futari.py` の上端 260・窓 top 400）。帯と窓の文字だけ §1 に替える
- 音：前4回と別の 8bit。GAME OVER で止めて、カット5で戻す
- カバーは1カット目／AI 生成の開示／無音で出さない

## 4. キャプション

```
ごはんのあと、どちらが洗うかで少しだけ空気が止まることがあります。
「気づいたほうがやる」は、平等に見えて、先に気づく人に寄りやすいです。

先に「洗う人」「ふく人」を分けておくだけで、待つ時間がなくなります。
家事をどう分けたいかは、暮らしが重なる前に話しておけると楽です。

ごはんのあと、先に立つのはどっち？
相手に送って、聞いてみてください。

#カップルあるある #おうちデート #家事分担 #恋愛あるある #婚活
```

## 5. トーンの線（セルフチェック）

- 笑う対象は「気づいたほうがやる」という**決め方**。先に立つ人も、座っている人も下に見ない
- 性別を言わない／焦らせない／絵文字なし／一手（先に分けておく）を返している
- 同じ週の話題（行き先・ひとり時間）と重ならない

## 6. 見る数字（3日後＝10/25）

送信数と3秒残存（ゲームオーバー3・4 と比べる）。投稿が 20:00 より遅れた回なので、時刻のずれもメモに残す。
