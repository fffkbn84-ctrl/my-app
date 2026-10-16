# Kinda note today「空の手帳」の告知（IG リール 10/17・X 10/16〜17）

> 対象：10/15 に本番に出した空の手帳（今日の空が街へ旅をする・行った街がスタンプでたまる）。
> 文言の正は `src/app/kinda-note/data/skyCities.ts`。設計は `docs/research/2026-10-12-shohyo-tokyo-ugoki.md` §5。

## 0. なぜこの形か

- 前回の note 紹介（10/11「今日の天気、つけてみた」・本物の画面）は 3秒残存 14%・スキップ 87.7% で、この期間でいちばん低かった。**画面のスクショでは止まらない**
- 止まったのは、人がいて「自分かも」と思える絵（ぎっしり#1・#4 が 56%、並べる型#1 が 36%）
- 空の手帳の一言は、もともと「その街のいまの誰か」を書いている（帽子を追いかける人、洗濯物の前で迷う人）。**その人をクレイで1人ずつ描けば、そのまま並べる型になる**
- 新しく生成した絵は X の告知の画像にも使う

## 1. IG リール（10/17 土 20:00・並べる型・9.3秒）

| # | 秒 | 画面 | 文字 |
|---|---|---|---|
| 帯 | 全編 | — | **今日の空は、どの街へ？**／Kinda note・今日の天気 |
| 1 | 0〜2.4 | ウェリントンの港・強い風。帽子を追いかけて走る人 | 〔ウェリントン・風の強い晴れ〕「帽子、待って〜！」 |
| 2 | 〜4.7 | 那覇の路地・晴れているのに雨。洗濯物の前で迷う人 | 〔那覇・天気雨〕「洗濯物、どうしよう」 |
| 3 | 〜7.0 | 札幌の夜道・月夜。月を撮ろうとしてうまく撮れない人 | 〔札幌・月夜〕「月、うまく撮れない…」 |
| 4 | 〜9.3 | 函館の朝市・夜明け前。走ってくる人 | 〔函館・夜明け前〕「二度寝した〜！」 |

- 天気と街の組み合わせは `skyCities.ts` のとおり（windy_sunshine／sun_shower／moonlit_night／pre_dawn）。**today の答えから出る天気だけを使う**（10/16 訂正：最初は windy_day・cold_wind を使ったが、この2つは `WEATHER_MAP` に無く today では出ない。カット1は絵がそのまま「風の強い晴れ」なので名札だけ直し、カット3は札幌・月夜で作り直し）。台詞は一言の中の人の気持ちを短くしたもの
- 人は「失敗も書く」の線（研究メモ §5）。笑われる側ではなく、誰にでもある小さな失敗にする
- **例外の線引き**：既定（単色＋物1つ・人なし）を外し、クレイの情景＋人1人にする。人は顔なし・性別や年齢の手がかりなし。文字は後から入れる（CLAUDE.md §7-b の例外一覧に追記）
- 書き出しは並べる型と同じ `render-kotosan-v2.js say`（名札＝街・天気）＋ `build_reel.py narabe4`

### ChatGPT プロンプト（同じスレッドで4枚・2:3）

```
A tiny handmade polymer clay miniature street scene, photographed like a real miniature diorama but cropped as a slice of a larger town — the ground and buildings continue past the edges of the frame. No display base, no box, no frame.

【SCENE】

One small clay figure: smooth round head with no eyes, no nose, no mouth and no hair, soft rounded body, plain muted clothes, nothing that shows gender or age. The figure is in the lower middle of the image, about one tenth of the image height.

Composition: slightly elevated front view. The street, buildings and the figure fill the lower 60 percent of the image. The top 38 percent is open sky that clearly shows today's weather, with nothing else in it. Keep exactly the same clay texture, camera height, figure size and composition in every image of this thread; only the town, the weather and the action change.

Clay keeps fingerprints and tool marks, soft matte finish, rounded forms. Muted warm palette with dusty rose / terracotta (#D4A090) as the accent.
No text, no letters, no numbers, no signs with writing, no logos anywhere. No other people. No phones. No gold, no brass, no metallic parts. Portrait 2:3 (1024x1536).
```

| # | 【SCENE】 |
|---|---|
| 1 | `Wellington harbour on a very windy day: a short stretch of waterfront promenade, a few small sailboats in the water all tilted the same way, a pale blue sky with fast streaky clouds. The figure runs with one arm stretched out after a small round clay hat that is flying away in the wind, just out of reach. A scarf blows sideways.` |
| 2 | `A narrow lane in Naha with low white houses and a red tiled roof: the sun is shining in a bright blue sky while thin silver rain falls at the same time, small puddles catching the light. A clay laundry pole hangs with a few just-washed shirts and towels. The figure stands in front of the laundry with both hands on its head, frozen, unsure whether to take it in.` |
| 3 | `A sidewalk in Sapporo on a cold windy late-autumn day: a few bare trees, yellow ginkgo leaves blowing along the ground, a grey-blue sky. The figure wears a thick coat and a knitted scarf, one hand in a mitten and the other bare, bending forward and looking back along the path for the lost mitten.` |
| 4 | `The Hakodate morning market before dawn: a few low market stalls with warm glowing lanterns, crates of crabs and squid on the counters, a deep navy sky just starting to lighten at the horizon. The figure runs toward the market in a hurry, hair-less round head tilted forward, coat half on, one arm still out of its sleeve.` |

### 崩れやすいところ（出たら作り直す）

- 人に顔が付く・人が増える（背景の通行人もなし）
- 看板・のれん・船体に文字が描かれる（**この回でいちばん出やすい**）
- 上の38%に建物や電線が入る（帯と台詞が乗らない）
- 台の上の模型になる・枠で囲まれる（ぎっしり §構図「箱にしない」）
- 4枚で人の大きさやカメラの高さが変わる

### 書き出し（Claude の担当）

```bash
for i in 1 2 3 4; do python3 prep-futari.py g$i.png plate-$i.png 200; done
B='["今日の空は、どの街へ？","Kinda note・今日の天気"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" say <x> '["@ウェリントン・風の強い晴れ","帽子、待って〜！"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" say <x> '["@那覇・天気雨","洗濯物、どうしよう"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" say <x> '["@札幌・月夜","月、うまく撮れない…"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" say <x> '["@函館・夜明け前","二度寝した〜！"]'
python3 build_reel.py narabe4 kinda-ig-1017-sora-no-techo.mp4
```

### キャプション

```
今日の気持ちを3つ選ぶと、天気がひとつ返ってきます。
その空が、世界のどこかの街へ旅をするようになりました。

風の強い晴れの日は、ウェリントンかリスボンへ。
ウェリントンの港では、ヨットがみんな同じ方向に傾いています。

行った街は、手帳にスタンプでたまります。まだ行っていない街は「？」のままです。
全部で24の街があります。

今日の空がどこへ行ったか、コメントで教えてください。
登録しなくても、30秒でつけられます。

#今日の天気 #気持ちの整理 #ひとりの時間 #Kindanote
```

- セルフチェック：焦らせない（連続日数・皆勤は出していない）／婚活語彙なし（診断・天気まわりは中立語彙）／絵文字なし／「登録しなくても使える」は事実。街の人は作り話だと分かる遊びの書き方（研究メモ §5 の線）
- 見る数字：3秒残存（並べる型#1 の 36% と比べる）・コメント（街の名前で返るか）

## 2. X

### 10/16（金）夜 21:00「月夜、という天気」にセルフリプを足す

本文は Notion の下書きのまま。月夜は札幌かマラケシュへ行くので、そのまま空の手帳につなぐ。

```
月夜の日は、空が札幌かマラケシュへ旅をします。

Kinda note の今日の天気に「空の手帳」を足しました。行った街がスタンプでたまります。

今日の天気を、30秒で。
https://kinda.jp/kinda-note/today
```

### 10/17（土）夜 21:00 D つくる日記（画像：IG のカット1＝ウェリントン）

```
Kinda note の今日の天気に、続きを足しました。

天気が出ると、その空が世界のどこかの街へ旅をします。風の強い晴れの日はウェリントンかリスボンへ。ウェリントンの港では、ヨットがみんな同じ方向に傾いています。

行った街は手帳にスタンプでたまります。
```

リプ：`今日の天気を、30秒で。／https://kinda.jp/kinda-note/today`

## 3. 制作記録（2026-10-16）

- ChatGPT の4枚を全部採用（貼られた順は 4→3→2→1 の逆順）。文字・看板なし、人は顔なしで1人ずつ。札幌はテレビ塔が入ったが文字はない
- 人が画面の下のほうにいるので、しっぽの先を下げた：**TIP_Y＝1270／1290／1330／1370**、x＝540／540／500／540
- 書き出し：`kinda-ig-1017-sora-no-techo.mp4`（narabe4・9.3秒）。X 用は生成1枚目をそのまま JPG に（`x-1017-sora-wellington.jpg`）
- 素材：`assets/sora-no-techo-{wellington-wind,naha-sunshower,sapporo-coldwind,hakodate-predawn}-v1.webp`。空の手帳 v1-b（クレイの世界地図）の素材の候補にもなる
- キャプションと X の文を直した：街は天気ごとに2つのうちから選ばれる（`pickSkyCity` は2つから乱数）。「強い風の日はウェリントンへ」と言い切ると、ケープタウンが出た人に嘘になる → 「ウェリントンかケープタウンへ」

### カット3の作り直し（札幌・月夜・10/16）

同じスレッドで続けて生成する（共通文は §1 のまま）。

```
【SCENE】A quiet street in Sapporo on a clear late-autumn night: a few bare trees, warm street lamps, the Sapporo TV tower softly lit in the distance, a deep indigo night sky with a bright full moon and a few small stars. The figure stands still on the sidewalk in a thick coat and knitted scarf, holding up a small plain clay phone-shaped block with both hands toward the moon, head tilted, as if trying to take a photo and failing.
```

- この1枚だけ `No phones.` を外してよい（撮ろうとしている道具が要る）。画面や文字が描かれたら作り直す
- 冷たい風の札幌（`sora-no-techo-sapporo-coldwind-v1.webp`）は今回使わない。today に冷たい風が入ったら使う
