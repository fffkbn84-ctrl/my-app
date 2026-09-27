# 「ふたり」ゲームオーバー回 制作キット（2026-09-27 ふうか採用・投稿日未定）

> 案の経緯とトーンの線は `docs/sns/series/futari-ideas.md` 案1。型は第1回 `packs/2026-09-27-ig-reel-futari-01.md`。

## 1. 台本（6カット・12.5秒）

| # | 秒 | 画面 | 窓の文字 | 音 |
|---|---|---|---|---|
| 帯 | GAME OVER 以外 | — | 付き合いたての／彼女の機嫌が悪い日 | — |
| 1 | 0〜2.5 | 彼女がそっぽを向いてふくれている。彼氏が横目で見て汗 | かのじょの　きげんが　わるい。／どうする？／**▶ そっとしておく**／　きいてみる | ピコ・ピコ／曲 |
| 2 | 〜4.4 | 彼氏はスマホ。彼女はさらに丸まってそっぽ | そっとしておいた。／……**3時間が　たった。** | ポン |
| 3 | 〜6.8 | **GAME OVER**（2 の絵をモノクロで暗く） | きもちは　ためると／かたくなる。／▶ もういちど　やめる | 下がる4音・**曲を止める** |
| 4 | 〜8.5 | **1 と同じ絵** | 同じ文。**カーソルだけ「▶ きいてみる」** | ピコ・ピコ |
| 5 | 〜10.4 | 彼氏が彼女のほうを向いて聞く | 「どうした？　なにかあった？」 | ポン |
| 6 | 〜12.5 | 彼女がこちらを向いて、ゆるんだ顔で話し出す | かのじょの　きげんが／すこし　なおった！ | レベルアップ・曲が戻る |

- **放っておいた時間は「3時間」**（ふうか訂正 2026-09-27。初案の「3日」はそっとしておきすぎ）。
  3時間なら「わかる、それくらい置いちゃう」の範囲で、見る人が自分ごとにできる
- 終わりは「すこし　なおった！」。聞いたら全部解決、とは言わない

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**最初に `docs/sns/assets/futari/futari-reference-v1.webp`（第1回のキャラ設定画）を添付する。**
1・2・5・6 の4枚だけ生成する（3 は 2 の加工、4 は 1 の使い回し）。

共通テンプレートは第1回キット §2-1〜2-4 のものをそのまま使い、【ACTING】だけ差し替える。
**ただし第1回にあった手帳は今回は出さない**ので、テンプレートの後に `No notebook.` を足す。

| # | 【ACTING】 |
|---|---|
| 1 | `Character A sits turned away from B, facing slightly toward the left edge of the sofa, stubby arms crossed, cheeks puffed out, eyes closed in a small sulky frown, the whole body a little stiff. Character B sits upright and glances sideways at A with worried round eyes, one tiny clear droplet of sweat beside the head, stubby arms held close to the body.` |
| 2 | `Character B has slumped back into the sofa and is looking down at a tiny cream clay smartphone held in both stubby arms (the screen is plain and blank), relaxed and absorbed, not looking at A at all. Character A is still turned away from B, now curled up smaller and rounder, cheeks puffed even more, arms crossed.` |
| 5 | `Character B has turned its whole body toward A and leans in gently, one stubby arm reaching toward A's shoulder, eyes soft and concerned, a small open mouth as if asking something. The smartphone is gone. Character A is still turned away but glances back over its shoulder at B with one eye.` |
| 6 | `Character A has turned back toward B, the cheeks no longer puffed, a small soft relieved face with a tiny open mouth as if starting to talk, stubby arms uncrossed and resting in its lap. Character B faces A and listens with a gentle small smile, nodding slightly.` |

### 崩れやすいところ

- 2体の色・帽子・マフラーが変わる／**手帳が出る**／スマホの画面に何か映る
- 上の38%に何か写り込む（帯と窓が載らない）
- 1 と 5・6 で**ソファと2体の位置がずれる**（4 で 1 を使い回すので、1 だけは特に構図を守る）

## 3. 書き出し（Claude の担当）

準備：`@fontsource/dotgothic16` から `japanese-400` と `latin-400` の woff2 を `dot-ja.woff2` `dot-la.woff2` として置く（README の準備と同じく npm から）。
`noto900.woff2` も要る（第1回と同じ）。

```bash
python3 prep-futari.py <生成1.png> plate-1.png 200      # 2・5・6 も同じ

NODE_PATH=$(npm root -g) node render-game.js plate-1.png f1.png win  '{"lines":["かのじょの　きげんが　わるい。","どうする？"],"cmd":{"items":["そっとしておく","きいてみる"],"sel":0}}'
NODE_PATH=$(npm root -g) node render-game.js plate-2.png f2.png win  '{"lines":["そっとしておいた。","……3時間が　たった。"]}'
NODE_PATH=$(npm root -g) node render-game.js plate-2.png f3.png over '{"lines":["きもちは　ためると","かたくなる。"],"cmd":{"items":["もういちど","やめる"],"sel":0}}'
NODE_PATH=$(npm root -g) node render-game.js plate-1.png f4.png win  '{"lines":["かのじょの　きげんが　わるい。","どうする？"],"cmd":{"items":["そっとしておく","きいてみる"],"sel":1}}'
NODE_PATH=$(npm root -g) node render-game.js plate-5.png f5.png win  '{"lines":["「どうした？　なにかあった？」"]}'
NODE_PATH=$(npm root -g) node render-game.js plate-6.png f6.png win  '{"lines":["かのじょの　きげんが","すこし　なおった！"]}'

python3 build_reel.py futari-go6 kinda-ig-futari-gameover.mp4          # 12.5秒
python3 add_sfx.py kinda-ig-futari-gameover.mp4 kinda-ig-futari-gameover-sfx.mp4 futari-go
```

効果音（カーソルのピコ・ゲームオーバーの下がる4音・レベルアップ）は矩形波で合成済み。権利の心配なし。
窓が絵の頭にかかるときは json に `"top":380` のように上端を渡す。

## 4. 音

Edits で第1回と同じ形：明るい曲を0秒から → **GAME OVER（4.3秒）で止める** → カット5（8.4秒〜）でフェードインして戻す。
ゲームらしさを足すなら、IG の音楽検索で「8bit」「chiptune」も候補。

## 5. キャプション

```
「そっとしておく」が正解の日も、たしかにあります。
でも付き合いたての「いつもと違う」は、聞いてほしいサインのことが多い。

溜めこむ前に、気づいたときに、ひとこと。
いまはふたりの関係をつくっている途中なので、
この小さな「どうした？」の積み重ねが、あとで効いてきます。

彼女でも彼氏でも、同じです。

#カップルあるある #付き合いたて #恋愛あるある #彼女の機嫌 #婚活
```

投稿時：カバーは1カット目／AI 生成の開示。見る数字は**送信数**と3秒残存。
