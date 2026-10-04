# 並べる型 #1「まだ言えてないこと」制作キット（2026-10-02 作成・2026-10-03(土) 12:00 投稿）

> 型の背景は `docs/sns/ideas.md` 案3（参考 @zzz_offton「幸せな女性ほど」）。
> キャラは「ふたり」の Character A（彼女役・ダスティローズ・耳の丸み・クリームのマフラー）を**1体だけ**出す。
> 設定画は `packs/2026-09-27-ig-reel-futari-01.md` §2-0。

## 0. この回の狙い

- **題は全カット同じ。変わるのは下の一言とポーズだけ。** 1カット＝1項目なので、どこで離脱されても損をしない
- 4つとも「付き合いたてで、まだ言えていない小さなこと」。見た人が**「これ私」**と思って送る
- 4項目は Kinda pair の話題に1つずつ対応している（`l1-food`／`l1-rhythm`／`l2-contact`ほか）。
  **pair の「話したこと／まだ話していないこと」そのもの**を、ネタの形で見せる回
- 相手役もオチもない。笑いではなく「わかる」と「送りたい」を取る

## 1. 台本（4カット・9.3秒）

| # | 秒 | 画面（Character A だけ） | 下の一言 | pair の話題 |
|---|---|---|---|---|
| 帯 | 全編 | — | **まだ言えてないこと**／付き合いたての彼女 | — |
| 1 | 0〜2.4 | 赤いスープの小さな器を両手で持って、涙目で笑顔を作っている | 「辛いもの、実は苦手」 | `l1-food` 食べ物の好き・苦手 |
| 2 | 〜4.6 | 床にぺたんと座って、目を閉じて半分寝ている。横に小さな目覚まし時計 | 「朝、ほんとうに弱い」 | `l1-rhythm` 朝型か夜型か |
| 3 | 〜6.8 | 両腕で顔を隠して、片目だけのぞかせている。横に小さなポーチ | 「すっぴんは、まだ」 | — |
| 4 | 〜9.3 | 小さなスマホを両手で持って、画面をじっと見つめて固まっている・汗1滴 | 「返事に30分悩んだ」 | `l2-contact` 連絡の頻度とテンポ |

- 並びは「食べる → 朝 → 顔 → 連絡」。**いちばん送りたくなる「返事に30分」を最後に置く**（ループ直前に残る）
- 3 は pair の話題にはないが、付き合いたての「まだ」をいちばん分かりやすく出す項目として入れる

## 2. ChatGPT プロンプト（同じスレッドで4枚・2:3）

**最初に「ふたり」#1 のキャラ設定画（2体並び）を添付する。** 新しいスレッドなら、設定画を作り直してから始める。

### 共通テンプレート（【ACTING】だけ差し替える）

```
Use exactly the same Character A as in the reference image (same dusty rose fleece body, same two tiny round ear bumps, same thin cream knit scarf, same embroidered eyes and mouth, same size). Only Character A appears. Character B does not appear.
Character A is alone on a plain warm beige background (#F5EEE6) — no room, no walls, no floor line, no furniture.
Front view, camera at eye level. Character A is small and centered: the character and its props fit inside the vertical band between 30 percent and 62 percent of the image height. The top 28 percent and the bottom 36 percent of the image are completely plain empty beige background.
Soft daylight from the upper left, one soft shadow under the character. Miniature product photography, matte fleece texture with visible stitches.
【ACTING】
No text, no letters, no numbers, no logos, nothing written on any object. No speech bubbles. No gold, no brass, no metallic parts. Portrait 2:3 (1024x1536).
```

| # | 【ACTING】 |
|---|---|
| 1 | `Character A sits holding a tiny round cream clay bowl of bright red soup with both stubby arms, a tiny red chili pepper floating on top. Character A is forcing a brave small smile while its embroidered eyes are watery with two tiny clear tears at the corners, cheeks slightly flushed, one tiny clear droplet of sweat beside the head.` |
| 2 | `Character A sits slumped on the ground, leaning to one side, eyes fully closed, mouth slightly open, completely half asleep. The cream scarf is crooked and loose. A tiny round cream clay alarm clock with a blank plain face (no numbers) sits beside Character A.` |
| 3 | `Character A sits and hides its face with both stubby arms raised in front of it, shy, peeking out with only one eye between the arms. A tiny cream fabric pouch with a small zipper sits closed beside Character A.` |
| 4 | `Character A sits hunched forward, holding a tiny cream clay smartphone with both stubby arms close to its face (the screen is plain and blank), eyes wide and fixed on the screen, frozen, a short straight line for a mouth, one tiny clear droplet of sweat beside the head.` |

### 崩れやすいところ（出たら作り直す）

- **Character B が一緒に出てくる**（設定画に2体いるため）→ `Only Character A appears.` を先頭に移す
- キャラが大きく写って、下 36% にはみ出す（下の一言と重なる）→ `small and centered` を強める
- 器・時計・スマホに文字や数字が入る
- 1 の涙が強すぎて悲しく見える → 「無理して笑っている」くらいに戻す（泣かせる回ではない）

## 3. 書き出し（Claude の担当）

```bash
cd docs/sns/tools/ig-carousel
# フォント（セッションごと）：README の noto900.woff2 / noto700.woff2
for i in 1 2 3 4; do python3 prep-futari.py gen-$i.png plate-$i.png 200; done
B='["まだ言えてないこと","付き合いたての彼女"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" label 0 '["辛いもの、実は苦手"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" label 0 '["朝、ほんとうに弱い"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" label 0 '["すっぴんは、まだ"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" label 0 '["返事に30分悩んだ"]'
python3 build_reel.py narabe4 kinda-narabe-01.mp4
```

- 下の一言は上端 y=1290（`LABEL_Y` で変えられる）。キャラの足元が y≈1200 に来る想定。重なったら `LABEL_Y=1330`
- 効果音は入れない（カットの切り替えだけで見せる型）。曲は IG 側で、ゆるいローファイ系

## 4. キャプション案

```
付き合いたての、まだ言えてないこと。

隠しているわけじゃなくて、言うタイミングがまだ来ていないだけ。
辛いものが苦手だと話した日から、お店選びが少し変わる。
朝が弱いと話した日から、待ち合わせの時間が少し変わる。

話したことと、まだ話していないこと。
どちらがあってもいいし、順番はふたりで決めていい。

あなたの「まだ言えてないこと」も、コメントに置いていってください。

#付き合いたて #カップルあるある #恋愛あるある #まだ言えてないこと #婚活
```

- **AI 生成の開示（Meta「AI情報」ラベル）を付ける**
- カバーは1カット目を手動指定

## 5. トーンの線（セルフチェック）

- **焦らせない**：「早く言わないと」と書かない。「順番はふたりで決めていい」で、言わない今を否定しない
- **空虚な共感にしない**：「話すと、お店選びや待ち合わせの時間が変わる」という**話したあとに起きること**を返している
- **彼女役を笑わない**：4項目とも欠点の暴露ではなく「小さな、まだ」。泣き顔・だらしない姿に寄せすぎない
- **性別役**：IG のネタ型では彼女・彼氏の役を使ってよい（`ig-strategy-2026-09.md` §18 決定）。
  反響がよければ**彼氏版**（例「実は甘いものが好き」「寝癖、毎朝戦ってる」）を作る
- 絵文字なし／「中立」「診断」「相性」を使っていない

## 6. 判定

- 見るのは**送信数とリーチあたりの送信**（`ig-strategy-2026-09.md` §18 の課題が「送信0」）
- 比べる相手は「ふたり」#1・#2（掛け合いの型）。並べる型のほうが送信が多ければ、肯定の型（案4）と彼氏版に進む

## 実績（2026-10-03）

- **土曜 12:00 枠で出した**（ふうか決裁）。9/26「言いにくい気持ち」が3秒残存5%で、物だけの回が止まらないため。テーマも土曜枠と重なる
- 4枚とも初回生成で採用。素材 `docs/sns/assets/futari/narabe01-*-v1.webp`
- **`prep-futari.py` の上端は 200 固定にしない。** 生成ごとにキャラの位置が違い、1枚目（立ち姿）は 200 だと足が下の一言（y=1290）に重なった。
  画像ごとに背景との差で下端を測り、**足元を y≈1210 にそろえる**上端を入れた（1=19／2=123／3=148／4=109）
- キャプションは §4 の「辛いものが苦手なことも、朝が弱いことも、話した日から…」を対句2行に直した（読点が続き、主述もずれていた）
- Notion「IG投稿カレンダー」に登録済み。10/4 に数字を入れた（下）

## 数字（10/4 計測・投稿翌日）

閲覧190・リーチ156・プロフ遷移2・フォロー0・いいね0・保存0・送信0。**3秒残存36%**・スキップ69.2%・平均3秒／9秒。リールタブ59.5%・発見40.0%。
ことさん#1（38%）に次ぐ2番目で、ことさん以外では最高。**並べる型は止まる**。送信は0のまま。
