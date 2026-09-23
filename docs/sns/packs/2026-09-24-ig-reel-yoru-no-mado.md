# 木曜 1枚リール #1「夜の窓」制作キット（2026-09-23 作成）

> 設計の背景は `docs/sns/ig-strategy-2026-09.md` §15。ここは実作業のキット。
> **投稿は 9/24(木) 20:00 案**（夜の窓なので夜に出す）。前日 9/23 はことさん#1 が伸びている最中のため同日には出さない（§3）。

---

## 1. 狙い（Claude とふうかさんで認識を合わせる3点）

1. **人を描かない。ものだけで暮らしを見せる。** マグ2つ・靴2足で「ふたり」が出る。性別も人数も決めつけない
2. **評価しない。並べるだけ。** どの窓が良い／進んでいる、と読めるものを置かない。明かりの消えた窓も1つ入れる（いない夜も、ひとりの夜も並列）
3. **答えを渡さない。** 天気の名前は付けない。問いは「今夜は、どの窓？」だけ。行き先は bio の Kinda note

**この回は例外的に「情景」を作る。** CLAUDE.md §7-b の「単色背景＋クレイのもの1つ（情景にしない）」は
火・土の型のためのルール。1枚リールは「たくさん並んだ中から探す」ことが価値なので、ここだけ当てない。

---

## 2. ChatGPT プロンプト（新しいチャットで・添付なし・2:3）

```
A handmade miniature clay diorama photographed straight-on: the front wall of a small four-storey apartment building at dusk, filling the frame from side to side. The wall is soft warm beige clay (#F5EEE6 tone) with gentle hand-pressed texture, faint fingerprints and slightly uneven edges.

Twelve windows in a loose 3-column by 4-row grid. Each window is slightly different in size, and the frames are painted in muted colours (dusty rose #D4A090, soft sage, cream, faded terracotta), a little crooked as if made by hand. Every window is lit from inside with soft warm light, some more amber, some paler cream. No people anywhere: each room is shown only through small objects.

One scene per window:
1. two mugs side by side on a tiny table, one still steaming
2. a single bed with one pillow and a smartphone lying face up, its blank screen glowing
3. two pairs of simple sneakers by a doorway, in two different colours
4. one armchair with an open book resting face down on the seat
5. one cup holding two toothbrushes
6. a small table set for two, one plate still under a cover
7. an open laptop on a desk, its blank screen glowing softly
8. a small wrapped gift box on a shelf, its ribbon untied
9. two coats hanging on one hook
10. an umbrella stand with two umbrellas, one still dripping
11. a potted plant and a small watering can on the sill
12. a window with the light off, curtains open, the room dark and calm

The top 20 percent of the image is empty dusk sky in soft muted blue-mauve: no moon, no stars, no clouds with shapes. Keep every window away from the left and right 10 percent of the image. Soft light from above, gentle matte shadows, quiet and cozy. Miniature clay and felt handcraft look, not glossy, not a 3D render, not a realistic photo.

No people, no hands, no faces, no silhouettes, no pets. No text, no letters, no numbers, no logos, no signs. No gold, no brass, no metallic parts.
Portrait 2:3 (1024x1536).
```

- 2〜3回出して良いものを選ぶ（1日8枚まで）
- **崩れやすいところ**：窓が12個より減る／同じ小物が2つの窓に出る／画面に文字や数字が出る。
  どれかが出たら「Regenerate. Exactly twelve windows, each with a different scene as listed.」と足す
- どうしても12個が崩れるなら**6窓（2列×3段）に落とす**。1〜3・6・10・12 を残す
- カレンダーは**入れない**（日付の数字が描かれてしまうため）。9番をコートに差し替え済み

## 3. 版面（Claude 側）

- 2:3 の左右を切って 9:16（ことさんと同じ処理）
- 上の空の部分に白い吹き出しで **「今夜は、どの窓？」**（Shippori Mincho・`#2E2620`）。これ1行だけ
- ズームしない。**尺は7秒**・ループさせる。音源は「のほほん」
- カバーは1カット目（＝この1枚）

## 4. キャプション案

```
今夜は、どの窓？

マグがふたつの窓も、
明かりの消えた窓も、
どれも、ある夜のこと。

いまの気持ちに、名前をつけたくなったら
プロフィールのリンクから、登録なしで。

#結婚相談所 #婚活 #おうち時間 #ふたり暮らし #婚活中の人と繋がりたい
```

- 「プロフィールのリンクから」は §6 で使わないとした CTA。**ただし今回は bio を note に向けた最初の回なので、1回だけ試す**（プロフ遷移を見る）
- 絵文字なし。AI 生成ラベルを付ける

---

## 5. v1 の結果と、人を入れる判断（2026-09-23 夜・次のセッションで続ける）

**v1（ものだけ）**：`docs/sns/assets/yoru-no-mado/v1-objects-only.webp`（12窓すべて指示どおりに出た。絵としては成功）

### ふうかさんの指摘：「人がいること」が目を引く

> 人がいるから目が引かれて、細かいところまで「どんなことしているんだろう？」と好奇心で見てしまう。

**Claude の判断：賛成。v1 は投稿しない。人を入れた v2 を作る。**

- v1 は**小物のカタログ**に見える。窓は「覗き見」が楽しいのに、覗いた先に誰もいないので好奇心の行き場がない。
  参考にした窓の集合（doodlesbysophie）も、全部の窓に人がいた
- 犬・ヘッドホンの座標は「自分が持っているもの」を探す図なので物でよかった。**窓は「自分に似た人」を探す図**なので人が要る
- §1 で「人を描かない」にした理由（性別・人数を決めつけない）は、**人の描き方で解決できる**

### どんな人を入れるか（決定）

- **リアルな人間は使わない。** 理由：CLAUDE.md §4 のクレイの世界から浮く／AI のリアル人物は「作られた感」が出る（`ig-strategy` §13 のオーセンティシティ）／
  性別・年齢・人種の見た目が確定してしまい、包摂の線を守りにくい
- **ことさん#1 で使った「顔のないクレイ人形」にする。** 丸い頭・顔なし・髪型や服で性別を示さない。
  ことさん#1 は1カット目にこの人形2体を置いて、**3秒残存 37%（過去最高）**を出した。実績がある
- 窓ごとに1人か2人。**2人の窓は「関係の途中」**（並んで座っているが別々にスマホ、同じ料理を作る、玄関で靴を脱いでいる…）
- **明かりの消えた窓（12番）は無人のまま残す。** いない夜も並列、の線は守る

### 次のセッションで決めること → §6 で決着（2026-09-23 深夜）

- ~~v2 のプロンプト~~ → §6-1
- ~~ことさんを1つの窓に隠すか~~ → **今回は隠さない**（§6-2）
- ~~投稿日~~ → 9/24(木) 20:00 を狙う。**9/24 17:00 までに1枚が決まらなければ 10/1(木) 20:00**（§6-3）

---

## 6. v2（顔のないクレイ人形を入れる）

### 6-1. ChatGPT プロンプト（新しいチャットで・添付なし・2:3）

v1 から変えたのは3点だけ。**①人形を入れた ②12場面を人のいる場面に書き直した ③左右の余白を強くした**。
壁・窓枠・光・空は v1 のまま（v1 で当たっている部分は動かさない）。

```
A handmade miniature clay diorama photographed straight-on: the front wall of a small four-storey apartment building at dusk. The wall is soft warm beige clay (#F5EEE6 tone) with gentle hand-pressed texture, faint fingerprints and slightly uneven edges.

Twelve windows in a loose 3-column by 4-row grid. The windows are fairly large so the rooms inside are easy to see. Each window is slightly different in size, and the frames are painted in muted colours (dusty rose #D4A090, soft sage, cream, faded terracotta), a little crooked as if made by hand. Eleven windows are lit from inside with soft warm light, some more amber, some paler cream.

The people inside are small faceless clay figures, all made in the same simple style: smooth round heads with no eyes, no nose, no mouth and no hair; soft rounded bodies; plain loose tops and trousers in muted colours (oatmeal, sage, dusty blue, terracotta, cream). No skirts, no dresses, no ties, no jewellery, no makeup, nothing that shows gender or age. The figures are busy with their own evening and do not look out of the window.

One scene per window:
1. two figures sit across a tiny round table with two mugs, one mug still steaming; one figure has a hand raised mid-sentence
2. one figure lies on its stomach on a single bed, feet in the air, holding a smartphone whose blank screen glows
3. at a doorway, one figure sits on the step untying a sneaker while a second figure stands just inside; two pairs of sneakers in two different colours
4. one figure curled up in an armchair reading a book, a small blanket over its knees
5. two figures side by side at a small sink, both brushing their teeth
6. one figure at a desk with an open laptop whose blank screen glows softly, a mug beside it
7. two figures cooking together at a small counter, one stirring a pot, the other holding out a plate
8. one figure sits on the floor holding a small wrapped gift box with its ribbon untied, looking down at it
9. two figures sit side by side on a small sofa, shoulders touching, each looking at their own smartphone
10. one figure has just come in, holding a dripping umbrella; a second umbrella already stands in the umbrella stand
11. one figure waters a potted plant on the sill with a small watering can
12. the light is off, curtains open, the room dark, calm and empty, with no figure

The top 20 percent of the image is empty dusk sky in soft muted blue-mauve: no moon, no stars, no clouds with shapes. Leave a wide plain wall margin on the left and right: no window comes closer than one eighth of the image width to either side edge. Soft light from above, gentle matte shadows, quiet and cozy. Miniature clay and felt handcraft look, not glossy, not a 3D render, not a realistic photo.

No realistic people, no faces, no eyes, no mouths, no hair. No pets. No text, no letters, no numbers, no logos, no signs, nothing written on any screen. No gold, no brass, no metallic parts.
Portrait 2:3 (1024x1536).
```

**2人の窓と1人の窓を市松に置いた**（1段目 2・1・2／2段目 1・2・1／3段目 2・1・2／4段目 1・1・無人）。
2人の窓が片寄ると「ふたりの建物」、1人が片寄ると「ひとりの建物」に読めるため。

| 窓 | 人数 | 何が「途中」か |
|---|---|---|
| 1 マグ | 2 | 話している最中。片方の手が上がっている |
| 2 ベッドとスマホ | 1 | 返事を待っているのか、ただ見ているのか分からない |
| 3 玄関 | 2 | 帰ってきたのか、これから帰るのか分からない |
| 4 肘掛け椅子 | 1 | ひとりの夜。寂しく描かない（毛布・読書） |
| 5 洗面台 | 2 | 同じことを並んでしている |
| 6 机とノートPC | 1 | 遅くまで何かしている |
| 7 台所 | 2 | 同じ料理を作っている |
| 8 贈り物 | 1 | **渡す前か、もらった後か分からない**（いちばん覗きたくなる窓） |
| 9 ソファ | 2 | 並んでいるが、別々のスマホ |
| 10 傘 | 1 | 傘がもう1本ある。**誰かいるのかは分からない** |
| 11 植木 | 1 | 自分のペース |
| 12 消灯 | 0 | いない夜も並列（§5 で決定済み） |

「分からない」を残してあるのが要点。**答えを絵で確定させない**と、見る人が自分の事情で埋める（§1-3）。

#### 崩れやすいところ（出たら作り直す）

- [ ] **人形に顔が出る**（目・口・眉。いちばん出やすい）→「The figures have completely blank, smooth faces.」を足す
- [ ] 人形に髪が出る／スカート・ネクタイが出る（性別が確定する）
- [ ] 人形がこちら（窓の外）を向いて手を振る・覗き返す
- [ ] 12番の暗い窓に人形が入る
- [ ] 窓が12個より減る／同じ場面が2つ出る／スマホや PC の画面に文字が出る
- [ ] **左右の窓が端から1/8より近い**（v1 は約6%まで寄っていて、9:16 に切ると両端の窓枠が約20pxずつ切れる）
- [ ] 人形がリアルな人間・フィギュア（ツヤのあるプラスチック）になっている
- [ ] 1024×1536 の原寸で受け取る（プレビューの縮小版を貼らない。`kotosan-poses.md` 場面画像の解像度）

**12窓で人形が崩れるなら、6窓（2列×3段）に落とす。** 残すのは 1・2・8・9・10・12
（2人／1人／贈り物／並んで別々／傘／消灯。この6つで「関係の途中」と「いない夜」が両方残る）。
6窓にすると窓が大きくなり、人形の崩れも減る。

#### 左右が寄ってしまったときの逃げ道（Claude 側）

作り直しが続くなら、切らずに**縮めて上下を足す**。1024 幅を 864 に縮め（84%）、上に空の色、下に壁の色を足して 9:16 にする。
空は単色なので継ぎ目が目立たない。下の足し分は壁の続きとして 1 割程度に収まる。

### 6-2. ことさんを1つの窓に隠すか → **今回は隠さない**

**判断：隠さない。10/16 の判定後に、夜の窓 #2 の候補として持つ。** 理由の強い順。

1. **この回が測りたいものが濁る。** 夜の窓は木曜1枚リールの**1本目**で、確かめたいのは
   「たくさん並んだ中から自分に近い窓を探す」型が送られるか（`ig-strategy` §15）。
   ことさんを入れて伸びたら、型が効いたのか、ことさんを探す遊びが効いたのか**切り分けられない**。
   ことさん側の「テスト中は変数を増やさない」（`kotosan-reel.md` §8）と同じ理屈を、こちら側にも当てる
2. **問いが2つになる。** 「今夜は、どの窓？」は**自分を探す**問い（送信を生む）。「ことさんはどこ？」は**キャラを探す**問い
   （ループ視聴は伸びるが、送信は生みにくい。`ig-strategy` §15 で「キャラの問いかけは送られない」と整理済み）。
   1枚に2つ置くと、弱いほうに目が取られる
3. **見る人のほとんどがことさんを知らない。** 流入はリールタブ・発見が半分ずつで、フォロワーはまだ少ない。
   知らないキャラを探させても、探す動機がない
4. **絵として馴染まない。** ことさんは**ふわふわのループ生地・金の丸眼鏡**で、ほかは全部クレイ。
   窓の大きさでは「ひとつだけ質感が違う」ことで**隠れずに浮く**か、潰れて誰だか分からなくなるかのどちらか。
   しかも参照画像を添付して12窓を生成させると、ほかの人形までことさんに寄っていく（眼鏡が生える等）。
   v2 のプロンプトの「no gold」ともぶつかる

**判定後にやるなら**：場面は生成せず、`kotosan-poses.md` の既存ポーズを**スクリプトで1つの窓に合成**する
（生成で混ぜない）。問いは「今夜は、どの窓？」のまま、ことさんは**キャプションで1行だけ**明かす
（「ことさんも、どこかの窓に。」）。ことさんのテスト結果が良かった場合に限る。

### 6-3. 投稿日

- **9/24(木) 20:00 を狙う。** 生成（ふうかさん）→ 9:16 化・文字入れ・7秒 MP4（Claude）は、1枚なら短時間で終わる
- **9/24 17:00 までに1枚が決まらなければ 10/1(木) 20:00 にずらす。** 20:00 の直前に慌てて出すより、
  1週間おいても何も失わない（木曜枠はまだ型が決まっていない）
- 9/25(金) 18:00 はことさん#2。夜の窓と22時間空くので、互いの計測は混ざらない
- キャプション（§4）はそのまま使える。1番の窓にマグが2つ・12番が消灯なので「マグがふたつの窓も、明かりの消えた窓も」が合っている

---

## 7. v2 の結果と v3（夜・逆光のシルエット）への切り替え（2026-09-23 22時台）

**v2（顔のない人形）**：`docs/sns/assets/yoru-no-mado/v2-faceless.webp`。12場面・人数・消灯・左右の余白（端から約10%）はすべて指示どおりに出た。
**不採用。** ふうかさんの指摘：

> 表情がほしい。LGBTQ が混ざっていていいし、友達と取るか恋愛と取るかも見た人の自由。細い線の人のほうが見ていて気持ちいい。
> 逆光（参考：窓の写真を集めたコラージュ）なら表情がなくても成り立つ。情緒が出る。その場合は夜にしたい。

**Claude の判断：賛成。逆光のシルエットにする。** v2 を見て分かったこと。

- **のっぺらぼうの顔は、表情が「ない」のではなく「空白」に見える。** 明るい部屋で丸い頭が正面を向くと、卵が並んでいるように見えて感情が読めない。
  **逆光なら顔は最初から見えないので、空白が気にならない。** 感情は首の傾き・肩・姿勢・ふたりの距離が運ぶ。参考のコラージュが表情なしで情緒を出せているのはこの理由
- **「性別を示さない」は、v2 で「性別の手がかりを全部消す」にしてしまっていた。** これは行き過ぎだった。
  髪型も体つきもばらばらに混ぜ、**組み合わせを性別で決めない**ほうが包摂になる。友達か恋人かも決めない（§1-3 の「答えを渡さない」と同じ線）
- **細い人形にする。** v2 の人形は頭が大きく胴が太い。姿勢で感情を出すには、首・肩・腕の角度が読める細い体が要る

### 7-1. ブランドとの線（何を参考にして、何を参考にしないか）

| 参考コラージュの要素 | v3 では | 理由 |
|---|---|---|
| 逆光のシルエット・姿勢で語る | **取り入れる** | 表情の問題と包摂の両方が解ける |
| 夜・窓の光だけで見せる | **取り入れる** | 「今夜は、どの窓？」の問いとも合う |
| 窓の形がばらばら（アーチ・格子・バルコニー） | **少しだけ**（窓の大きさと格子の有無を変える程度） | 12場面の読みやすさを優先 |
| 実写の人物・写真の切り貼り | **取り入れない** | §5 で決定済み（リアルな人は使わない）。クレイの世界は残す |
| 真っ黒な背景 | **取り入れない**。夜空は深い藍、壁は窓明かりに照らされた暖かいクレイ | 黒は Kinda の世界にない色。暖かさは窓の光で出す |

§1 の「単色背景のルールを当てない」例外の延長として、**この回だけ夜にする**。クレイ質感・窓の暖かい光・ダスティローズの窓枠は残るので、Kinda の絵であることは変わらない。

### 7-2. ChatGPT プロンプト v3（新しいチャットで・添付なし・2:3）

v2 から変えたのは4点。**①夜 ②逆光のシルエット ③細い人形・髪型と体つきを混ぜる ④場面を姿勢で語るものに書き直す**。
左右の余白・12窓の並び・市松の人数配置は v2 で当たったので**そのまま**。

```
A handmade miniature clay diorama photographed straight-on: the front wall of a small four-storey apartment building at night. The wall is warm beige clay with gentle hand-pressed texture and faint fingerprints, darkened by the night but softly lit around each window by the glow spilling out.

Twelve windows in a loose 3-column by 4-row grid, fairly large so the rooms inside are easy to see. Each window is a little different: some taller, some wider, a few with thin window bars or a sheer curtain pulled halfway. The frames are painted in muted colours (dusty rose #D4A090, soft sage, cream, faded terracotta), a little crooked as if made by hand. Eleven windows glow from inside with warm light, some deep amber, some pale cream, one soft rose.

Every room is lit from behind, so the people inside are seen as dark backlit silhouettes against the glowing room, with only a thin rim of light along their edges. Their faces cannot be seen; feeling is shown only by posture, the tilt of the head, the shoulders, the hands and the distance between them. The figures are slender handmade clay figures with thin arms and legs, long necks and small heads, elegant and light. Their hairstyles and body shapes are all different and freely mixed (short hair, long hair, a bun, a cap, curls, broad, narrow). Pairs are not matched by gender or look: every pair is a different combination, and whether they are friends, partners or family is left open.

One scene per window:
1. two figures sit across a tiny round table with two steaming mugs; one leans back laughing, head tipped up, the other leans forward on both elbows
2. one figure lies on its stomach on a bed, feet in the air, chin in one hand, the other hand holding a smartphone whose blank screen glows faintly
3. at a doorway, one figure sits on the step untying a sneaker while a second figure leans against the door frame, watching
4. one figure curled up in an armchair beside a lamp, knees drawn up, a book open on its knees
5. two figures sit facing each other on a deep window sill, knees drawn up, feet almost touching
6. one figure at a desk with an open laptop whose blank screen glows softly, head resting on one hand
7. two figures cooking at a small counter; one holds out a spoon and the other leans in to taste
8. one figure sits on the floor holding a small wrapped gift box with its ribbon untied, head bowed over it
9. two figures sit side by side on a small sofa, shoulders touching, heads bowed, each lit by their own phone
10. one figure has just come in, holding a dripping umbrella, head turned toward the inner room; a second umbrella already stands in the umbrella stand
11. one figure stands at the sill watering a small potted plant, the other hand on its hip
12. the light is off, curtains open, the room dark, calm and empty, with no figure

The top 20 percent of the image is empty night sky in deep muted indigo blue, not black: no moon, no stars, no clouds with shapes. Leave a wide plain wall margin on the left and right: no window comes closer than one eighth of the image width to either side edge. Quiet, tender, cinematic mood made only by warm window light. Miniature clay and felt handcraft look, soft matte surfaces, not glossy, not a 3D render, not a realistic photo.

No realistic people, no photographs, no visible faces, no eyes, no mouths. No pets. No text, no letters, no numbers, no logos, no signs, nothing written on any screen. No gold, no brass, no metallic parts. No pure black anywhere.
Portrait 2:3 (1024x1536).
```

#### 場面の書き換え（v2 → v3）

| 窓 | v2 | v3 | 理由 |
|---|---|---|---|
| 1 | 手を上げて話している | **片方がのけぞって笑う・片方が身を乗り出す** | 逆光では手の上げ下げより体全体の角度が読める |
| 3 | もう1人は立っているだけ | **ドア枠にもたれて見ている** | ふたりの間の空気が姿勢に出る |
| 5 | 洗面台で並んで歯みがき | **出窓に向かい合って座る・足先が触れそう** | 歯みがきは逆光で何をしているか読めない。参考コラージュで最も情緒が出ていた構図 |
| 7 | 鍋と皿 | **スプーンで味見させる** | 動作が1つで読める |
| 9 | 並んで別々のスマホ | そのまま＋**スマホの光で照らされる** | 逆光の中に2つの小さな光が入り、「別々」が絵で見える |

#### 崩れやすいところ（出たら作り直す）

- [ ] **顔が描かれる**（目・口が見える）→「The faces stay completely in shadow.」を足す
- [ ] 人形が太い・頭が大きい（v2 に戻っている）→「slender, small heads, thin limbs」を繰り返す
- [ ] ペアが全部「髪の長い人＋短い人」になる（男女の記号で組まれる）→「Pairs are not matched by gender」を先頭の段落に移す
- [ ] 夜空・壁が黒くなる（Kinda の色から外れる）
- [ ] 写実の写真になる・人がリアルになる
- [ ] 12番の暗い窓に人が入る／窓が12個より減る／画面に文字
- [ ] 左右の窓が端から1/8より近い（v2 は約10%で、9:16 に切っても枠は切れない）

### 7-3. 版面の変更

- 吹き出しは**白のまま**「今夜は、どの窓？」。夜空の藍の上に白は v1〜v2 のときより目立つ
- 尺7秒・ズームなし・カバーは1カット目、は変えない
- キャプション（§4）もそのまま使える（「マグがふたつの窓も」＝1番、「明かりの消えた窓も」＝12番）

---

## 8. v3 の結果 → **採用**（2026-09-23 夜）

**v3（夜・逆光）**：`docs/sns/assets/yoru-no-mado/v3-night-backlit.webp`。**これで出す。**

### 良いところ（v1・v2 で足りなかったものが入った）

- **姿勢で気持ちが読める。** 1番ののけぞって笑う人、5番の出窓で足先が触れそうなふたり、7番の味見、9番のスマホの光2つ。
  「どんなことしているんだろう」と覗く理由が各窓にある
- **顔は完全なシルエットにはならず、影の中にうっすら出た。** 拡大しても目鼻ははっきりせず、表情の気配だけが分かる。
  ふうかさんの「表情がほしい」と「顔を確定させない」の両方にかなうので、**直さない**
- 12窓・12番の消灯（無人）・左右の余白・夜空の藍（黒ではない、RGB 約 43,51,73）はすべて指示どおり
- 細い体・髪型の混在（お団子・キャップ・巻き毛・長い髪・短い髪）も出た

### 気になるが、直さないところ

- **ペア5組のうち3組（1・5・9番）が「長い髪／お団子＋短い髪」の組み合わせ。** 男女に読む人もいる。
  ただ3番（キャップ＋短い髪）と7番（短い髪どうし）で組み合わせは散っていて、**どう読むかは見る人の自由**（ふうかさんの方針）の範囲に収まる
- 人形の肌はクレイより少しなめらか（CG 寄り）。壁と窓枠には指の跡とヘラ跡が残っているので、スマホの大きさでは気にならない
- 4段目は IG のキャプションが重なる高さに来る。4段の格子を縦長画面に入れる以上は避けられない。長押しで UI が消えるので、見たい人は見られる

### 版面（Claude 側・§3 から変えたところ）

- **9:16 に切らずに、上へ空を足した。** 切ると左右の窓枠が画面の端にぴったり付き、窮屈に見えた。
  `tools/ig-carousel/prep-sky.py` で 97% に縮め、空の帯を上下反転しながら積んで上を 430px 伸ばした
  （**引き伸ばすと空の粒が縦の筋になる**。1回目で踏んだ）。左右の足りない 43px は壁の端を反転して埋めた
- 吹き出しは `render-kotosan.js omote`（白・48px・y=380..531）。屋根の線は y≈587 で、吹き出しとの間が約 55px 空く
- `build_reel.py` にプリセット `one7`（1枚・7秒・ズームなし）を足した

```bash
python3 prep-sky.py <v3の原寸.png> plate-mado.png          # 既定 0.97・空の帯 140px
NODE_PATH=$(npm root -g) node render-kotosan.js omote plate-mado.png f1.png '["今夜は、どの窓？"]'
python3 build_reel.py one7 kinda-ig-0924-yoru-no-mado.mp4    # 7.00秒
```

### 投稿（9/24(木) 20:00）

- MP4：`kinda-ig-0924-yoru-no-mado.mp4`（1080×1920・7.00秒・無音）。**音楽は IG 側で足す**（無音で出さない）
- カバーは1カット目を手動で指定する
- キャプションは §4 のまま。AI 生成ラベルを付ける
- **見る数字**：送信（シェア）とコメント。「○番」と自分の窓を書くコメントが来たら、この型は当たっている（`ig-strategy` §15）
