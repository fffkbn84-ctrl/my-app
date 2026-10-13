# 会う日の服（IG リール・2026-10-11 ふうか決裁）

> 入口は `CLAUDE.md` §7-b。既定の絵柄（単色＋クレイ1つ）から外れる例外の型。
> 書き出しは `docs/sns/tools/ig-carousel/render-coord.js` ＋ `build_reel.py one10`。

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

## #1 のキャプション

```
まだ2回目なのに、だいぶ好きになってきた日の服。
あなたは何番？

① レザーのフレアパンツ。脚の線は出るのに、肌は出さない
② モヘアのカーデは前を閉じてトップスに。サテンと合わせると、同じ2色でも平たく見えない
③ 短い丈のジャケット。中だけバーガンディにすると、きちんとして固くならない
④ オフショルダーは、羽織りを1枚持っていけばお店の温度でも困らない
⑤ キャミのレースは、カーデを開けたときだけ見える量に
⑥ マキシ丈にぺたんこ靴。並んで歩くのが楽になる

Burgundy & Cream
画像はAIで生成しています
```

## 出すとき

- AI 生成の開示を付ける（ほかの型と同じ）
- 曲は IG 側。ほかのシリーズで使っている曲は使わない
- 特定ブランドの商品名を出さない（提携前にステマと誤解されないため）

## 見る数字

**送信数**と**保存数**。コメントに番号（「④です」）が来たら当たり。

## 次の候補

- お見合いの回（「写真より実物がいい、と言われたいお見合い」）
- メイクの回は**ストーリーだけにしない**。フォロワーがほぼ0のあいだ、ストーリーは誰にも届かない。リールで出してハイライト「整える」に束ねる
