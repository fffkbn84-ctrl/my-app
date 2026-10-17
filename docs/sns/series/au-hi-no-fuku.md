# 会う日の服（IG リール・2026-10-11 ふうか決裁／2026-10-17 v4 に改定）

> 入口は `CLAUDE.md` §7-b。既定の絵柄（単色＋クレイ1つ）から外れる例外の型。
> **v5「人の説明書」（2026-10-17 夜〜）が正。** v4 は1本目の画像で不採用。v3 までは経緯として残す。
> 書き出しは `docs/sns/tools/ig-carousel/render-manual.js` ＋ `build_reel.py one10`。

## v5 の型：人の説明書（2026-10-17 ふうか決裁）

**街にいる1人を写真で描き、その人の「説明書」を横に書く。** 服の説明ではなく、その人の人生と性格を描く。
A型説明書や MBTI と同じで「これ私だ」を探して、いくつ当てはまったかをコメントしてもらう。

### v4 をやめた理由（ふうかさん 10/17）

- v4（あごから下・スタジオ・モカとアイボリーのお見合い服）は、**「婚活の服＝無難」をそのまま絵にしていた**
- あそこまで写すなら顔を出すか、横を向かせるほうがいい。マネキンより**人生を描くほうが面白い**
- **婚活っぽくない服を載せる**。「こんな服で会いに行っていいんだ」と思った人が、どこにも属さない Kinda だけの見込み客になる

### 決まっていること

1. **街のスナップ写真。顔は出してよい。ただし横顔か目線を外す**（カメラを見ない）。登場人物は架空の人。AI 生成の開示を付ける
2. **ジャンルは韓国系と90年代アメリカ系**（フレンズのレイチェルやモニカのような）。どちらも IG と Pinterest に好きな人が多い
3. **お見合いの回は作らない。** お見合いは相談所が服装を指導している場で、Kinda の取引先は相談所。場面は「2回目のデート」「土曜の昼」などデートから
4. **説明書は性格を書く**：好きな人には／友達とは／休日は／LINEは／今日の服。1項目18字まで。
   相手は「好きな人」「相手」と書き、**「彼氏」「彼」と書かない**（見る人の相手の性別を決めない）。下に見る書き方・からかう書き方をしない
5. 最後は「いくつ当てはまりましたか」。見る数字は**コメント（数字）・保存・送信**
6. 参考アカウントと被らないための線（下の v4 の節）は v5 でも同じ

### 版面（1080×1920・1枚・10秒・ズームなし）

- 上：`someone's manual No.01 90s New York`（Cormorant イタリック）→ 題（Noto Serif JP 300・40px・1行）
- 左：写真（人のまわりを縦長に切り出す・幅540）。右：説明書（項目名は服の色・一言は 27px・`/` で改行位置を決める）
- 写真の下：「いくつ当てはまりましたか」
- 説明書は y=1150 より上（IG の右のボタン）、全体は y=1500 より上（キャプション）。スクリプトが超えたら止まる

### 画像プロンプトの形（ChatGPT・2:3 縦）

No.01 で使ったもの。**人・服・街だけ差し替える。** 「横を向く」「下の35%は何もない歩道」は変えない。

```
A candid street-style photograph, shot on 35mm film look, natural daylight.
A Japanese woman in her late 20s walks along a quiet city street on a
Saturday afternoon, past an old café and a vintage clothing shop. She is
glancing sideways, smiling slightly at something off camera; her face is
turned three-quarters away from the camera, not looking at the lens.

Her outfit is 1990s New York inspired, like a stylish sitcom character from
that era: a fitted cream ribbed turtleneck tucked into high-waisted
light-wash straight jeans, a slim brown leather belt, an oversized brown
and green plaid blazer, brown penny loafers with white socks, a small
brown leather shoulder bag. Hair loosely half-up with a tortoiseshell claw
clip. Effortless, a little playful, clearly fashionable.

The woman is in the upper and middle part of the frame, full body visible.
The lower 35 percent of the image is a soft, out-of-focus sidewalk with
nothing important in it.

No text, no letters, no signs with readable words, no logos, no brand marks.
```

### No.01 土曜の昼、2回目のデートに古着で行く人（90s New York）

原本は `docs/sns/assets/au-hi-no-fuku/manual-01-90s-ny.png`。

```bash
NODE_PATH=$(npm root -g) node render-manual.js src.png f1.png '{"no":"01","style":"90s New York","title":"土曜の昼、2回目のデートに古着で行く人","crop":[230,20,860,1180],"accent":"#5B4A2E","footer":"いくつ当てはまりましたか","entries":[["好きな人には","好きなものの話になると/早口になる"],["友達とは","予定を決めないで/集まりたい"],["休日は","古着屋を2軒回ってから/喫茶店"],["LINEは","スタンプより/短い文で返す"],["今日の服","張り切って見えない本気"]]}'
python3 build_reel.py one10 out.mp4
```

キャプション：

```
土曜の昼。2回目のデートに古着で行く人の説明書です。

好きなものの話になると早口になる。
予定は決めないで集まりたい。
いくつ当てはまりましたか。数字だけコメントに置いていってください。

今日の服
チェックのジャケットは大きめを選びます。中を細いタートルにすると着られている感じになりません
デニムはまっすぐの形を少し長めに。ローファーに白い靴下で90年代らしく
バッグは小さめの革を肩に。2回目は荷物が少ないほうが歩くのが楽です

someone's manual No.01 / 90s New York
画像はAIで生成しています

#デートコーデ #2回目デート #古着コーデ #90年代ファッション #婚活
```

### 次の候補

- No.02 韓国系（例：平日の夜、仕事帰りに1回目のデートに行く人）
- No.03 90年代（モニカ寄りのきれいめ）
- ふたりのリンクコーデ（ふたりの説明書。組み合わせは男女に固定しない）

---

## v4（2026-10-17 昼・不採用）


**1回に1コーデ。1人が全身で着ていて、その服の「説明書」を横に書く。** 会う回数の順にシリーズで出す。

### なぜ変えたか

参考アカウント @aya_casual_note（`reviews/2026-10-17-benchmark-aya-casual-note.md`）を見て決めた。

- 6着並べ（v3）は実用をキャプションに逃がしていた。リールのキャプションはほぼ読まれない。**画像の中に実用を入れる**
- 人が着ているほうが自分を重ねられる
- **「説明書」は強いキーワード**（A型説明書・MBTI）。ぎっしりが面白いのも「これ私だ」を探す遊びだから。服でも同じことをする
- 「婚活の服は無難」というイメージを外す。**ちゃんとおしゃれ**であることは v3 と同じく外さない

### 参考アカウントと被らないための線（2026-10-17）

「人が着ている写真＋アイテム分解」は服のジャンル全体の見せ方で、誰のものでもない（Pinterest にも大量にある）。
寄せてはいけないのは **@aya_casual_note 個人の見た目**。

- 使わない：手書き風の文字・青い水彩の背景・「〇〇で目を奪われた／目を惹く」の題・リボンの保存アイコン・ブランド名の列挙・顔出しのモデル
- Kinda の印：細い明朝＋英字イタリック・生成りの地色／**場面は「会う日」**（会う回数で進む）／**心の声**（他の服アカウントにない。ここが「説明書」）／顔を写さない

### シリーズの順番（同じ版面で10本続けてから判断する）

1. お見合いの日
2. 1回目のデート
3. 2回目のデート（v3 の #1 と同じ場面。v4 で作り直す）
4. 3回目、帰りに少し遠回りしたい日
5. ふたりのリンクコーデ（間に挟む。組み合わせは男女に固定しないで回す）

「婚活服」とは言わない。題は場面で書く。「勝負服」「モテ」「目を惹く」も使わない（人からどう見られるかを軸にしない）。

### 版面（1080×1920・1枚・10秒）

```
┌────────────────────────┐
│ 題「お見合いの日の服」         │
│ 場面「土曜14時 ホテルのラウンジ」│
├───────────┬────────────┤
│           │ COLOR        │
│  人が着た  │ TOPS  心の声  │
│  全身      │       実用1行 │
│ （顔は写さ │ SKIRT …      │
│   ない）   │ SHOES …      │
│           │ BAG …        │
├───────────┴────────────┤
│ アイテム5つの小さな写真の列     │
│ 保存して、当日の朝に見返してね   │
└────────────────────────┘
```

- **人は左半分。右半分は無地で空けて生成させ、文字は後から入れる**（画像に文字を描かせない）
- **顔は写さない**（あごから下か、帽子や角度で隠す）。見る人が自分を重ねやすく、実在の人にも見えない
- 右の説明書：見出しは英字（Cormorant Garamond イタリック）、**心の声**（Noto Serif JP 300・12字まで・体言止め・読点なし）、**実用1行**（小さめ・2文まで）
- 下に「保存して…」の一言。見る数字は**保存と送信**
- 色は v3 と同じく **1回に2色**。題の上に色の名前を入れる

### #2 お見合いの日（2026-10-17 案）

- 題：お見合いの日の服 ／ 場面：土曜14時 ホテルのラウンジ
- 色：**Mocha & Ivory**
- ※ ぎっしり#4（10/14）もホテルのラウンジ。同じ週に出さない（10/21 以降）

| 見出し | 心の声 | 実用1行 |
|---|---|---|
| COLOR | 甘すぎない白 | 明るい色は顔のそばに置きます。茶色を下にすると甘くなりすぎません |
| TOPS | ちゃんと見せたい襟元 | パールボタンの薄手ニットです。ホテルの照明でも顔が明るく見えます |
| SKIRT | 座っても気にならない丈 | ラウンジのソファは低めです。ひざが隠れる丈なら座っても気になりません |
| SHOES | 歩幅を気にしない高さ | ヒールは5センチまでで大丈夫です。ホテルの床でも音が響きにくいです |
| BAG | 膝にのる小さな安心 | 自立する小さめのバッグです。ソファの横にも膝の上にも置けます |

#### 画像プロンプト（ChatGPT・2:3 縦）

```
A clean, stylish fashion lookbook image. Realistic photography, true-to-life
fabric texture. Soft even studio lighting with gentle shadows. Seamless warm
off-white background (#F3EEE8).

Layout (important):
- One woman stands in the LEFT HALF of the image, full body from the chin
  down to the shoes. Her face is NOT shown: the image is cropped at the chin.
  Relaxed, natural pose, one hand lightly holding the bag.
- The RIGHT HALF of the image is completely empty plain background (text will
  be added there later). Nothing in the right half.
- Along the BOTTOM of the image, a single neat row of five small separate
  product photos on the same background: the knit top, the skirt, the shoes,
  the bag, the earrings. Leave a thin empty strip below the row.
- Leave an empty strip at the very top, about 12 percent of the height.

Outfit, color story mocha brown and ivory, elegant and quietly fashionable,
not plain, not overly sweet:
- An ivory short-sleeve fine-gauge knit top with small pearl buttons and a
  neat round neckline, tucked in.
- A mocha brown softly pleated satin-sheen midi skirt that covers the knees.
- Mocha suede slingback pumps with a 5 cm heel.
- A small structured ivory leather top-handle bag that can stand on its own.
- Small pearl stud earrings.
- An ivory light cardigan draped over the shoulders.

No text, no letters, no labels, no logos, no brand marks, no face, no
mannequin, no hangers.
```

---

# v3 までの記録（2026-10-11〜10-13）

## 何をする型か

**ある1日の気持ちを題にして、その日に着たい服を6着、1枚に並べる。**
1着ずつに「その服を選んだときの心の声」をラベルで付ける。見る人は「これ私だ」を探して、友だちに送る。

- 参考：服の配色一覧（@classyladyedit「CHARCOAL + BUTTER」いいね1.4万・送信4,828＝**送信/いいね 約34%**）、
  Pinterest の透明人間コーデ一覧（2段×3〜4列）
- ぎっしり#1（リーチ1,580）と同じ「並んだ中から自分を探す」見方を、服でやる
- Kinda glow（会う前に自分を整える時間）・act（浮かない服装）の入口になる

## 決まっていること（v1 → v3 で何が効いたか）

| 版 | 中身 | ふうかさんの判定 |
|---|---|---|
| v1 | クレイの服3着・平置き・くすんだ単色 | 「あまりにも適当」。配色におしゃれさがない |
| v2 | 本物の服3着・平置き・バーガンディ×クリーム | 良くなったが「薄っぺらい」。服が小さく、上下が離れて物の写真に見える |
| **v3** | **透明人間が着た形・2段×3列・ぎゅっと詰める** | **「だいぶいい」**。これを型にする |

1. **おしゃれであることは外さない。** 服のアカウントはみんなやっている。普通に見て「なんかいい」と思われなければ広がらない
2. **クレイにしない。本物に見える服**（authentic なものが見られる）
3. **1回に2色。** 色の名前と組み合わせが主役（「Burgundy & Cream」）。差し色はデニム・チョコ・金だけ
4. **透明人間が着た形**（ゴーストマネキン）。トップスとボトムをつなげ、靴はすそ、バッグは腰の高さに重ねる
5. **6着・2段×3列・すき間を作らない**
6. **小物で笑わせる**：くまのチャーム、リボン。その日の浮かれ具合を出す
7. **女性の服にする。パンツの組は色っぽく**（ふうか判断）。ただしラベル・キャプションで相手の性別を決めない（「彼」と書かない）
8. 画像に文字を描かせない。文字はすべて後から入れる

## 題の書き方

**場面が一行で浮かぶ、具体的な1日。** 天気の比喩（「はじめましての薄曇り」）は意味が分からないのでやめた。
参考はぺこちゃんの IG（「学校では明るいけど家では弟を叱るお母さんタイプの80年代の女の子」のような具体性）。

- まだ2回目なのに、だいぶ好きになってきた日（#1。初版「2回目なのに、もうだいぶ好きな日」を 10/13 に直した）
- LINEの返信が早すぎた翌日
- 写真より実物がいい、と言われたいお見合い
- 3回目、帰りに少し遠回りしたい日

「勝負服」「モテ」は勝ち負けの読み方になるので使わない。

**「好きな日」で終えない**（10/13）。「好きな日」は「気に入っている日」とも読めてしまう。気持ちが動いていることは「好きになってきた日」のように動詞で書く。
題は 40px・字間広めで**1行20字まで**（それ以上は折り返す）。「進んでいる／遅れている」と読める題にしない。

## ラベルの書き方

服の説明ではなく**その服を選んだときの心の声**。12字まで。番号①〜⑥を付ける（コメントが「④です」で済む）。

- **読点を入れない。名詞で止める**（体言止め）。「本気に見せない本気」がいちばん良かった（ふうか）。読点で区切ると説明文に見える
- ひねり（逆の言葉を並べる・言い切らない）でユニークさを出す

#1：①控えめに主張する脚 ②計算ずくのふわふわ ③本気に見せない本気 ④3回たしかめた肩 ⑤見えたら勝ちのレース ⑥並んで歩きたい丈

（初版は「脚、ちょっと見せたい」「肩、3回たしかめた」など読点入り。10/11 に書き直した）

## 画像の文字とキャプションの分担

雑誌のように、**服には文字を重ねない**。

- **画像**：番号と心の声だけ。ここで笑って、送りたくなる
- **キャプション**：番号ごとに、実際に使える一言（素材・合わせ方・その場での困らなさ）。リールのキャプションは1行目しか見えないので、**画像だけで成立させる**。キャプションは読みたい人への付録

## 版面（1080×1920・1枚・10秒・ズームなし）

- 地色は生成画像の背景から取る（#1 は `#EFE7DB`）
- **生成画像を段ごとに切り分け、段の上に文字だけの帯を挟む**（`rows` で各段の上端・下端を指定）。服の上に文字を置かない。
  初版はラベルを服の上に札で重ねていて、④の肩（見せ場）に文字がかかった
- 画像は幅860。段の下の端は 22px ぼかして、隣の段のはみ出しを消す。2段目の靴はキャプションの下に入るが許容
- 上：`today's color`（Cormorant Garamond イタリック 300）→ **色の名前をその色で書く**（同 500・84px）。
  地色に溶ける淡い色（クリームなど）は**相手の色の札に抜く**。間の `&` は金 `#B08D57`
- 細い線 → 題（Noto Serif JP 300・40px・字間広め）
- ラベル：Noto Serif JP 300・22px・札なし。**番号を上・言葉を下の2行**（1行に3つ並べたら1つの文に見えた）。番号だけ1色目の色
- フォントは npm の `@fontsource/noto-serif-jp`（200/300）と `@fontsource/cormorant-garamond`（italic 300/500）

## 画像プロンプト（ChatGPT・2:3 縦）

#1 で使ったもの。**色・題・6着の中身だけ差し替える**。構図の段落は変えない。

```
A dense, stylish fashion outfit board in the "ghost mannequin" style: six
complete women's outfits, each shown as if worn by an invisible person, with
the top tucked into or layered over the bottom in its natural worn shape,
the shoes placed right at the hem as if standing, and a bag or accessory
overlapping the outfit at hip height. Realistic product photography with
true-to-life fabric texture: fine rib knit, fluffy mohair, satin sheen,
soft leather, patent leather, denim. Soft even studio lighting with subtle
shadows that give depth. Seamless warm off-white background (#F3EEE8).

Layout: two rows of three outfits, tightly packed. The outfits are large and
fill the frame: each outfit is almost as wide as its column, and the outfits
nearly touch each other side to side. Leave only a thin strip of background
above each row (for small labels added later) and an empty strip at the very
top of the image, about 12 percent of the height (for a title added later).
No large empty areas anywhere else.

Color story: deep burgundy and cream as the main pair, with accents of dark
indigo denim, chocolate brown and small gold details. Chic, romantic,
slightly daring, a little playful.

Top row, left to right:
1. A cream fitted square-neck rib-knit top tucked into burgundy faux-leather
   slim flared trousers, burgundy pointed slingback heels, a small cream
   shoulder bag with a thin gold chain.
2. A fluffy cream mohair cardigan buttoned up as a top over a burgundy
   bias-cut satin midi skirt, cream Mary Jane flats, a tiny burgundy bag with
   a cream satin ribbon tied on the handle.
3. A cream cropped tailored blazer over a burgundy halter-neck fine knit,
   cream high-waisted flared trousers, burgundy suede heeled ankle boots,
   a delicate gold pendant necklace.

Bottom row, left to right:
4. A burgundy off-the-shoulder fitted knit top with dark indigo high-waisted
   flare jeans, cream pointed heels, a cream baguette bag with a small brown
   teddy bear charm.
5. A cream lace-trimmed camisole under an open burgundy cropped cardigan,
   cream wide-leg pleated trousers, burgundy patent Mary Janes, small gold
   hoop earrings.
6. A cream fitted turtleneck tucked into a burgundy and chocolate-brown
   check maxi skirt, burgundy patent ballet flats, a small cream quilted
   bag with a burgundy bow.

No text, no letters, no labels, no logos, no brand marks, no people, no
visible mannequin, no hands, no hangers.
```

実際の画像は上の余白を守らなかった（1段目が上端から始まる）。版面側で画像を縮めて下げるので、作り直さなくてよい。

## 書き出し

```bash
# 作業ディレクトリに src.png（生成画像）とフォント4つを置いて
NODE_PATH=$(npm root -g) node render-coord.js src.png f1.png '<json>'   # json の形は render-coord.js 冒頭
python3 build_reel.py one10 out.mp4
```

#1 の json：

```json
{"title":"まだ2回目なのに、だいぶ好きになってきた日",
 "colors":[{"name":"Burgundy","hex":"#7A2430"},{"name":"Cream","hex":"#EFE3CF"}],
 "rows":[[40,800],[818,1536]],"cols":[0.2,0.5,0.8],
 "labels":["控えめに主張する脚","計算ずくのふわふわ","本気に見せない本気","3回たしかめた肩","見えたら勝ちのレース","並んで歩きたい丈"]}
```

生成画像の原本は `docs/sns/assets/au-hi-no-fuku/`。MP4 は `ig-out/`（リポジトリに入れない）。

## #1 のキャプション（10/13 確定）

題は短くキャッチーに。**場面（2回目に会う、もうだいぶ好きな相手）はキャプション1行目で言い切る**（ふうか 10/13）。

```
まだ2回目なのに、もうだいぶ好きになっている。
そんな相手に会いに行く日の服を、6つ並べました。

張り切りすぎたくはない。
でも、いつもより少しだけ、かわいいと思われたい。
あなたは何番ですか。番号だけ、コメントに置いていってください。

① レザーのフレアパンツ。脚の線は出るのに、肌は出さない
② モヘアのカーデは前を閉じてトップスに。サテンと合わせると、同じ2色でも平たく見えない
③ 短い丈のジャケット。中だけバーガンディにすると、きちんと見えて固くなりすぎない
④ オフショルダーは、羽織りを1枚持っていけば、お店の温度でも困らない
⑤ キャミのレースは、カーデを開けたときだけ見える量に
⑥ マキシ丈にぺたんこ靴。並んで歩くのが楽になる

Burgundy & Cream
画像はAIで生成しています

#デートコーデ #2回目デート #大人可愛いコーデ #婚活 #仮交際
```

曲：歌なしか英語の軽い曲（シティポップ／ボサノバ寄り・BPM100前後・頭からすぐ鳴る）。日本語の歌詞はラベルを読むのとぶつかる。

## 出すとき

- AI 生成の開示を付ける（ほかの型と同じ）
- 曲は IG 側。ほかのシリーズで使っている曲は使わない
- 特定ブランドの商品名を出さない（提携前にステマと誤解されないため）

## 見る数字

**送信数**と**保存数**。コメントに番号（「④です」）が来たら当たり。

## 次の候補

- お見合いの回（「写真より実物がいい、と言われたいお見合い」）
- メイクの回は**ストーリーだけにしない**。フォロワーがほぼ0のあいだ、ストーリーは誰にも届かない。リールで出してハイライト「整える」に束ねる
