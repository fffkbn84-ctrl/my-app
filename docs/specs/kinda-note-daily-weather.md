# Kinda note 今日の天気（毎日モード）

> きっかけ：2026-10-03 ふうかさん「デイリーで言葉にできない気持ちを天気にするサービスとして、私なら使いたいかもしれない」。
> 状態：**実装済み（2026-10-03）**。`/kinda-note/today`。データの正は `src/app/kinda-note/data/daily.ts`。
> 新しい天気（§4）は画像ができてから足す。

## 0. 決まったこと（2026-10-03 ふうか）

- **入口の主役にする。** `/kinda-note` の「はじめる」は今日の天気へ。段階の note（いまいる場所に合わせた60秒の整理・カウンセラーに渡せる）は
  LP の下と結果の最後に「じっくり整理する」として控えめに残す
  - 理由：IG から来る人の多くは相談所をまだ考えていない。毎日来る理由がある方が入口に向く。段階の note は「渡す」用途の人が自分で選べば足りる
- **質問は自分軸。** 原因や相手（「それは誰のこと？」）は聞かない。天気にするのは自分の気持ちだけ（旧案の Q2 を削除）
- **名前**：「今日の天気」は **Kinda note の中のモード名**。Kinda note はそのまま（別サービスにはしない）。
  画面の見出し・パンくず・IG の「note を使ってみた」の型名に使う

## 1. 書き方の線

- 天気は**気持ちの名前**として返す。良い・悪いの判定、点数、前日比を出さない。「これまでの天気」は日付と名前を並べるだけ
- 天気そのものは選ばせない。気持ちを選ぶと天気が返ってくる（言葉にできない気持ちを言葉にする部分）
- 婚活語彙・相手の有無や性別を前提にする語を使わない。絵文字なし
- 回答と一言は端末にだけ残す。計測は天気名と回数のみ（`kinda_note_daily_start` / `kinda_note_daily_complete`）

## 2. 質問（3問＋任意の一言・選ぶと次へ進む）

**Q1 今日のあなたに、いちばん近い気持ちは？**
うれしかった／ほっとしていた／**とくに何もない、おだやかな日だった**（凪・10/3 追加）／どきどき・そわそわしていた／もやもやしていた／不安だった／さみしかった／いらいら・ざわざわしていた／くたびれていた／よくわからない

**Q2 その気持ちは、どのくらい？**
胸いっぱいだった／すこしだけ／もう、通り過ぎかけている

**Q3 いまの自分に、近いのは？**
外に出したい（話したい・書きたい）／ひとりで、静かにしていたい／すこしだけ、動いてみたい／このままで、いたい

**一言**（任意・140字）：今日のことを、ひとことだけ。

- Q1×Q2 で天気、Q3 で「今日、ひとつだけ」を決める
- 「とくに何もない」を選んだときは Q2（どのくらい？）を飛ばす（何もない日に大きさは無いので）。Q3 から戻ると Q1 へ

## 3. 天気の決め方（いまある20の天気から18を使う）

| 気持ち | 胸いっぱい | すこしだけ／通り過ぎかけている |
|---|---|---|
| うれしかった | 朝焼け | 淡い朝焼け |
| ほっとしていた | 晴れ間 | 薄日 |
| とくに何もない | 凪 | 凪 |
| どきどき・そわそわ | 風の強い晴れ | 天使の梯子 |
| もやもや | 霧 | 朝もや |
| 不安だった | 雨雲 | 降り始め |
| さみしかった | 小雨 | 夕暮れ |
| いらいら・ざわざわ | 雷雨 | 違和感の風 |
| くたびれていた | 夜明け前 | 静かな曇り |
| よくわからない | 迷い雲 | 花曇り |

- 説明文はいまの各天気の詩的な2文（`description`）をそのまま使う（段階に依存しない文なので）
- 「通り過ぎかけている」は淡い方の天気に「この天気は、もう通り過ぎかけています。」を添える
- 使っていない天気：風の日・冷たい風

### 3-b. 毎日専用の天気の出し方（2026-10-04 実装・ふうか了承）

`decideDailyWeather(feeling, size, want)` が、上の表より先に次を見る。

| 天気 | 出る条件 | 理由 |
|---|---|---|
| **雨上がり** | もやもや／不安／さみしい／いらいら／くたびれた／いろいろ混ざっていた × 「もう、通り過ぎかけている」 | 重さのある気持ちが抜けていくところ。うれしい・ほっとした・どきどき・よくわからないが通り過ぎるのは雨上がりではないので、淡い天気＋「もう通り過ぎかけています」の一文のまま。雨上がりのときはこの一文を出さない（天気がそれを言っているので） |
| **天気雨** | Q1 に足した「いろいろ混ざっていた」（`mixed`・「よくわからない」の直前）× 胸いっぱい／すこしだけ | 晴れと雨がいっしょ。**切ない空ではなく、きらきらして少しはしゃぐ空**（10/4 ふうか：「晴れてるのに雨だけ降ってきて、空間がキラキラして楽しい」）。説明文もその向きで書いた |
| **月夜** | くたびれていた × すこしだけ × 「ひとりで、静かにしていたい」（もとは静かな曇り） | **時刻では分けない**（朝に開いた人に月夜を出さないため、組み合わせで決める） |
| 陽だまり | 画像待ち。ほっとしていた × 胸いっぱい（いまは晴れ間） | — |

## 4. 新しく作りたい天気（案・画像はふうかさんが ChatGPT で生成）

いまの20で足りない気持ちを埋める候補。画像ができたら `daily.ts` の対応表と `PolaroidWeatherCard` に足す。

| 天気 | 英名 | 何の気持ちに | いまの代わり |
|---|---|---|---|
| **雨上がり**【済・10/4】 | After Rain | どの気持ちでも「もう、通り過ぎかけている」を選んだとき | 淡い方の天気＋一文 |
| **凪（なぎ）**【済・10/3】 | Calm | 新しい選択肢「とくに何もない、おだやかな日だった」。いまは**何もない日を選べない** | — |
| **天気雨**【済・10/4】 | Sun Shower | 新しい選択肢「いろいろ混ざっていた」（うれしいのに泣きたい、など） | よくわからない／花曇り |
| **月夜**【済・10/4】 | Moonlit Night | Q3「ひとりで、静かにしていたい」×静かな気持ちの夜 | 静かな曇り |
| **陽だまり** | Sunny Spot | 「ほっとしていた」の胸いっぱい（晴れ間は「会えてうれしい」寄りのため） | 晴れ間 |

- おすすめの順：**凪 → 雨上がり → 天気雨**（凪は「何もない日」を選べない穴を埋める。雨上がりは毎日使う人ほど出番が多い）
- 生成の条件はいまの20枚に揃える：正方形・ミニチュアクレイ・空だけの情景・文字なし・人なし。ファイル名 `w_<key>.webp`

### 4-b. 画像の作り方（2026-10-03）

- ChatGPT で **1:1**。**1枚ずつ、同じスレッドで**生成する（並べたときに揃う）
- スレッドの最初に、いまのカードを2枚添付して「このスタイルに揃えて」と伝える
  （`https://kinda.jp/images/w_light_rain.webp` と `https://kinda.jp/images/w_quiet_overcast.webp`。夜の絵だけ `w_twilight.webp` も）
- 生成された画像をチャットに貼る → Claude が 1254×1254 の WebP にして `public/images/w_<key>.webp` に置き、対応表に足す
- 雷雨の画像の右下に、別の生成ツールの透かし（きらりマーク）が入っている。新しい画像では透かしがないか確認する

**共通（毎回、先頭に付ける）**

```
Square 1:1 image. Top-down flat-lay photo of a handmade miniature made of matte clay and soft felt,
placed on a plain warm cream background (#F5EEE6). Muted, dusty colors. Soft diffused light from above,
gentle soft shadows. Simple, minimal, centered composition with generous empty space around the motif.
Calm, warm, quiet mood. Match the style of the attached reference images.
No text, no letters, no logos, no people, no faces, no watermark, no frame.
```

**凪（なぎ）** `calm`
```
SCENE: A calm sea at the horizon. A smooth, completely flat band of pale blue-grey clay across the lower third,
with no waves or ripples at all. A small pale butter-yellow clay sun sits low just above it,
and its soft reflection is a short vertical stroke of the same yellow on the flat surface. Nothing is moving.
```

**雨上がり** `after_rain`
```
SCENE: A small soft cream-grey felt cloud drifting away toward the upper right, with only two last tiny
pale blue clay raindrops falling from it. Below, three small flat clay puddles in pale blue on the cream surface,
one of them catching a soft warm glint of light. The feeling of rain that has just stopped.
```

**天気雨** `sun_shower`
```
SCENE: A small warm yellow clay sun peeking out from behind a soft light-grey felt cloud, while thin pale blue
clay raindrops fall at the same time. A few of the raindrops catch warm golden light.
Bright and rainy at once, gentle and a little bittersweet.
```

**月夜** `moonlit_night`（背景を夜にするため、共通の「cream background」はこの回だけ外す）
```
SCENE: Full-frame night sky made of deep muted indigo felt (not black). A crescent moon of soft cream-yellow clay
in the upper area, five or six tiny clay star dots, and a low line of dark soft felt hills along the bottom.
Quiet and still.
```

**陽だまり** `sunny_spot`
```
SCENE: A small warm clay sun in the upper left. Soft beams made of thin pale-yellow felt reach down diagonally
to a round pool of warm golden light on the cream surface. Inside the pool of light, one tiny round clay pebble
rests, as if warming in the sun. Cozy and still.
```

## 5. 残っていること

- [x] 凪（10/3）。**毎日専用の天気**として `daily.ts` の `DAILY_ONLY_WEATHERS` に持つ（段階の20天気＝`WeatherKey` には混ぜない。解説ページや結果の第1〜3層を持たないため）。足すときは `DAILY_ONLY_WEATHERS`・`PolaroidWeatherCard` の画像対応・Q1 の選択肢と `WEATHER_MAP` の4か所
- [x] 雨上がり・天気雨・月夜（10/4・出し方は §3-b）。画像は ChatGPT の 1254×1254 を WebP に（月夜はフェルトの質感で重いので quality 72・128KB）
- [ ] 陽だまり（画像待ち）。足すときは `DAILY_ONLY_WEATHERS`・`PolaroidWeatherCard`・`WEATHER_MAP` の relief.full
- [ ] マイページの履歴（Supabase 側）には今日の天気を保存していない（**ログインしていても端末のみ**）。マイページの「Kinda note の履歴」は段階の note だけ。
  足すなら `saveDiagnosisResult` を呼ぶが、**保存するのは天気と日付だけにし、一言は送らない**（§1「回答と一言は端末にだけ残す」）。マイページ側は `NoteHistorySection` が段階の結果ページへ飛ぶ作りなので、毎日の分の表示を別に作る。10/4 ふうかさんの質問で判明・決裁待ち
  - 端末のみの注意：サイトのデータを消す／プライベートブラウズのほか、**iPhone の Safari は7日間サイトを開かないと保存が消える**（ITP）。毎日使う人は残るが、間が空くと消える
- [ ] `/note/weather`（天気一覧）は段階ごとの見出しのまま。今日の天気の入口として見直すか
