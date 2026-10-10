# IGリール制作キット 2026-10-05（月）20:00｜ぎっしり情景#1 待ち合わせ10分前の駅前

> 型の正は `docs/sns/series/gisshiri-jokei.md`。月曜は固定枠ではない（空いていたので入れた・2026-10-04 ふうか決定）。

- **枠**：月 20:00 ／ リール ／ 1枚 ／ 1080×1920 ／ 10.0秒・ズームなし
- **題**：待ち合わせ10分前の駅前 ／ **問いかけ**：あなたは、どの人？
- **見る数字**：送信数・3秒残存（比べる相手：並べる型#1 36%・夜の窓 31%・間取り 26%）
- **計測日**：10/8（3日後）

## 1. ラベル案（人形の動きはこれに合わせてプロンプトに書いてある）

| # | ラベル | 人形 |
|---|---|---|
| 1 | 30分前に着いた | 駅の大時計の下で、ひとり落ち着いて立っている |
| 2 | お店を3回確認 | スマホの地図を横にしたり縦にしたりしている |
| 3 | 前髪を直してる | 店のガラスに映る自分を見て前髪をさわる |
| 4 | 柱の陰で深呼吸 | 柱の陰で胸に手を当て、目を閉じている |
| 5 | 遅れそうで走る | 改札から小走りで出てくる |
| 6 | 返信の文面を考え中 | ベンチで両手の親指をスマホの上で止めている |
| 7 | 手土産を持ち直す | 小さな紙袋を両手で大事そうに持ち直す |
| 8 | 初めて会うふたり | 少し距離をあけて、ぺこりとお辞儀し合う2体 |
| 9 | 3回目のふたり | 笑って手を振り合う2体（性別の分からない2体） |
| 10 | ただの通勤 | かばんを持って、関係なく通り過ぎる |
| 11 | ずっといる鳩 | 足元の鳩 |

## 2. 画像プロンプト（ChatGPT・**2:3 縦**・1枚）

```
A handmade miniature clay diorama of a small, calm station plaza in a Japanese
town on a weekend afternoon, seen from a high three-quarter bird's-eye angle.
At the top of the image, the station building with a simple ticket gate and a
large round station clock (the clock face is blank, no numbers). Soft warm
late-afternoon light from the upper left, gentle soft shadows.

About eleven small clay figures are spread out across the plaza, clearly
separated from each other with space between them, each doing a different
small thing, each with simple dot eyes and a tiny readable expression:
1. one figure standing calmly alone under the big clock, early and relaxed
2. one figure frowning at a smartphone map, holding the phone sideways
3. one figure looking at their reflection in a shop window, touching their bangs
4. one figure half-hidden behind a pillar, eyes closed, one hand on the chest, taking a deep breath
5. one figure hurrying out of the ticket gate in a small run
6. one figure sitting on a bench, both thumbs hovering over a phone, thinking hard
7. one figure carefully holding a small paper gift bag with both hands
8. two figures standing a little apart, politely bowing to each other for the first time
9. two figures of the same height with similar short hair and similar casual clothes, smiling and waving to each other
10. one figure with a briefcase walking past, paying no attention to anyone
11. one small clay pigeon on the paving

Composition: all the figures are inside the middle band of the image — keep the
top fifth for the station building and the bottom quarter as empty plain
paving with no figures. Keep the far left and far right edges free of figures.

Matte air-dry clay texture with visible fingerprints and soft rounded forms,
miniature photography look, shallow depth of field kept mild so every figure
stays readable. Muted palette: warm beige (#F5EEE6), soft off-white, and dusty
rose / terracotta (#D4A090) accents, with small touches of muted sage and soft
blue on clothing. No text, no letters, no numbers, no logos, no signs with
writing anywhere. No gold, no brass, no metallic parts. Vertical 2:3 composition.
```

### 再生成の基準

看板・時計・画面に文字や数字が出た／人形が重なって誰が誰か分からない／人形が画面の上下の端にいる／
2体組（8・9）が見分けられない／実写っぽくなった（クレイの質感が消えた）

## 3. 書き出し

`docs/sns/tools/ig-carousel/` で。座標は**画像を見てから Claude が決める**（下は形だけ）。

```bash
NODE_PATH=$(npm root -g) node render-labels.js <生成画像.png> f1.png '{"title":"待ち合わせ10分前の駅前","sub":"あなたは、どの人？","labels":[{"t":"30分前に着いた","x":0,"y":0}, …]}'
python3 build_reel.py one10 kinda-ig-1005-ekimae.mp4
```

## 4. キャプション

```
待ち合わせの10分前、駅前にはいろんな人がいます。
あなたは、どの人ですか。

#結婚相談所 #婚活 #初デート #デート #婚活中の人と繋がりたい
```

- 「続きを読む」の前の2行で完結。URL・「プロフィールのリンクから」なし／絵文字なし
- コメントが来たら、ラベル名で返事が来ているかを見る

## 5. セルフQA

- [ ] 画像の中に文字・数字が無い
- [ ] 人を上下に並べる・比べるラベルが無い／「進んでいる・遅れている」と読めるラベルが無い
- [ ] ふたり組の性別を決めつけていない
- [ ] ラベルが全部 y=360〜1480 に入り、重なっていない（スクリプトが止めてくれる）
- [ ] 曲を足した／カバーは書き出した1枚／AI 生成の開示

---

## 6. 実績（2026-10-04 書き出し済み）

- 画像：初回生成で採用（`docs/sns/assets/gisshiri/ekimae-v1.webp`）。看板・時計に文字なし、11体＋鳩がすべて描かれた
- **全面に敷かず幅に合わせた**（`"fit":"width","top":300`）。左右の端（ベンチ・手を振るふたり・柱の陰）まで人形がいて、
  全面敷きだと左右が約8%ずつ切れるため。上の空きは題の帯と地色になる
- 帯は不透明に変えた（半透明だと画像の上端と帯の境目が透けて見えた）
- **ラベルを1つ足した：「同じ服の人がいる」**。手土産の紙袋を持つ人が2体、同じ服で描かれていたので、もう1体に付けた
- 「30分前に着いた」は大時計の下ではなく改札前の1体に付けた（時計の下に人形がいなかった）
- 書き出し：`build_reel.py one10`（10.0秒）。ファイル `kinda-ig-1005-ekimae.mp4`

```json
{"title":"待ち合わせ10分前の駅前","sub":"あなたは、どの人？","fit":"width","top":300,"labels":[{"t":"遅れそうで走る","x":638,"y":502},{"t":"30分前に着いた","x":475,"y":646},{"t":"お店を3回確認","x":283,"y":762},{"t":"前髪を直してる","x":790,"y":728},{"t":"柱の陰で深呼吸","x":940,"y":812},{"t":"手土産を持ち直す","x":548,"y":941},{"t":"返信の文面を考え中","x":200,"y":999},{"t":"初めて会うふたり","x":854,"y":1051},{"t":"同じ服の人がいる","x":456,"y":1175},{"t":"3回目のふたり","x":224,"y":1262},{"t":"ただの通勤","x":875,"y":1283},{"t":"ずっといる鳩","x":645,"y":1455}]}
```

## 7. 曲（2026-10-05 ふうか選曲）

**Citizens of Halloween「This Is Halloween（ハロウィンタウンへようこそ）」**（IG 音源ライブラリ・個人アカウント）。
10月なので季節の曲にした。歌の多い曲なので、ラベルを読む邪魔になっていないかを3秒残存・平均再生時間で一緒に見る。
シリーズの固定曲にするかは、この回の数字を見てから決める（ハロウィンが過ぎたら使えないので、固定するなら別の曲で）。

## 8. 速報（投稿2時間後・参考値。正式な計測は 10/8）

| 回 | 閲覧 | リーチ | 3秒残存 | スキップ | 平均再生／尺 | 保存・送信・フォロー | 発見 | プロフ |
|---|---|---|---|---|---|---|---|---|
| **10/5 ぎっしり#1** | 1,180 | 730 | **54%** | 41.6% | **6／10秒** | 1・0・0 | 46.2% | 1 |
| 10/4 ナマケモノ#1（比較） | 117 | 112 | 13% | 88.5% | 2／11秒 | 0・0・0 | 45.3% | 0 |

- 2時間でこれまでの最高（並べる型#1 の 36%）を大きく超えた。「並んだ中から自分を探す」型の仮説どおり
- 年齢層が広がった（35〜54歳が約40%）。ハロウィンの曲は少なくとも邪魔はしていない
- 弱いのは**プロフィール遷移とフォロー**。見た人がプロフィールに来ても、同じ型がまだ1本しかない
- 対応（Claude 提案・ふうか判断待ち）：投稿は触らない／プロフィールに固定／#2 を早めに出す（ストック「金曜夜、返信を待つ部屋」など）

## 9. 2日目の数字（10/7 ふうか共有・正式計測は 10/8）

| 閲覧 | リーチ | 3秒残存 | スキップ | 平均再生／尺 | いいね・保存・送信 | プロフ・フォロー | リールタブ・発見・フィード |
|---|---|---|---|---|---|---|---|
| 2,163 | **1,580** | **56%** | 47.1% | **7／10秒** | 1・1・0 | 2・0 | 49.6%・48.5%・1.6% |

年齢：18〜24 18.7%／25〜34 35.6%／35〜44 20.5%／45〜54 18.4%。

- リーチはほかの回（100〜190）の約10倍。**3秒残存と平均再生（尺の7割）で IG が配り続けた**と読む
- ただし**反応はほぼ0**（いいね・保存とも 0.1%、送信0、フォロー0）。眺められたが、送る・残す理由がなかった
- 読み：ラベルが「外から見える行動」（前髪・手土産）で、「いるね」で終わった。番号がないのでコメントもしにくい
- → #2 は**番号付き・頭の中の状態のラベル・部屋で区切った断面図**にする（`packs/2026-10-08-ig-reel-gisshiri-02-henshin.md` §0）
