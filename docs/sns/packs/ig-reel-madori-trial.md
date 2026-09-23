# 木曜 1枚リール候補「同じ間取り、4つの暮らし」試作キット（2026-09-23 夜）

> 設計の背景は `docs/sns/ig-strategy-2026-09.md` §15 ①-2。投稿日は未定（夜の窓の数字を見てから）。
> 版面・書き出しは夜の窓と同じ流れ（`prep-sky.py` → `render-kotosan.js omote` → `build_reel.py one7`）。

---

## 1. 狙い

- **同じ 1LDK を4つ並べて、家具の置き方だけを変える。** 間取りが同じだから、違いがそのまま「暮らし方の違い」として読める
- 問いは **「住むなら、どの部屋？」** の1行だけ（画像には入れない。スクリプトで載せる）
- **良し悪しを付けない。** 散らかった部屋、おしゃれな部屋、と読める並べ方をしない。どれも誰かにとってちょうどいい暮らし
- **1部屋はひとり暮らし。** 「ふたりで住む」をゴールに見せない（夜の窓の消灯の窓と同じ役）
- 夜の窓で分かった「人がいると覗きたくなる」を引き継ぐ。人形は夜の窓 v3 と同じ**細いクレイ人形**。
  ただし**昼の光**にする。夜の窓と並べたときに同じ型の焼き直しに見えないようにするため

| 部屋 | 人数 | 暮らし方 | つながる pair の話題 |
|---|---|---|---|
| 左上 | 2 | **ふたりとも在宅勤務**。リビングが職場。片方はビデオ通話中 | `l2-work-view` 仕事への考え方 |
| 右上 | 2 | **お互い趣味に全力**。リビングが2つの趣味の隅に分かれている（絵とギター） | `l2-alone` 一人の時間 |
| 左下 | 1 | **本と植物でいっぱい**。窓辺に読書の椅子（片づいている） | ひとり暮らし |
| 右下 | 2 | **ほとんど物がない**。低いテーブル、座布団2つ、丸めた布団 | `l4-home` 住まいの形 |

---

## 2. ChatGPT プロンプト（新しいチャットで・添付なし・2:3）

```
Four identical handmade miniature clay apartment models, arranged in a neat 2 by 2 grid on a plain warm beige background (#F5EEE6). Each model is the same small one-bedroom apartment seen from above at an isometric angle, like a dollhouse with no roof and no front walls, so every room inside is visible.

The floor plan is exactly the same in all four models: the front door is in the bottom wall near the left corner and opens into a short entrance hall inside the apartment. A small bathroom sits beside the entrance hall, and its door opens into the entrance hall, inside the apartment, never to the outside. A small kitchen counter runs along the left wall, a large open living room is in the middle, one bedroom sits behind a wall at the top right with its door open to the living room, and one big window is on the right wall. Same walls, same doors, same window, same size. Only the furniture, the objects and the people are different.

The people are slender handmade clay figures with thin arms and legs, long necks and small heads. Their faces are soft and simple, with no detailed features. Their hairstyles and body shapes are all different and freely mixed. Pairs are not matched by gender or look, and whether they are friends, partners or family is left open.

Top left: both figures work from home. The living room has become an office: two desks, each with a laptop and a monitor whose blank screens glow, office chairs, cables, coffee mugs, a stack of folders. Both figures have short hair. One wears headphones and waves at the blank screen as if on a video call; the other types, leaning in. The sofa is pushed against the wall. In the bedroom, two single beds with a gap between them.
Top right: both figures are fully absorbed in their own hobbies, and the living room is split into two hobby corners. One figure has long loose hair and the other wears a knit beanie. On one side, a figure paints at a wooden easel, surrounded by small canvases with simple soft colour shapes, jars of brushes and paint-stained cloths. On the other side, a figure plays an acoustic guitar on a stool beside a shelf of records and a small amplifier. The two corners look completely different from each other. In the bedroom, one large bed with two blankets in two different colours.
Bottom left: one figure alone in a reading chair by the big window. The living room is full of bookshelves and potted plants, cosy and tidy, not cluttered. The bookshelves stand along the top wall of the living room and beside the big window. The kitchen counter stays completely clear and usable, with open floor in front of it: nothing stands in front of the kitchen. In the bedroom, one small bed and a stack of books.
Bottom right: two figures, both with their hair tied up in buns, sitting on floor cushions at a low wooden table, drinking tea. The rooms are almost empty and calm: bare floor, one plant, a folded futon in the bedroom.

Soft daylight from above, gentle matte shadows, warm and quiet. Muted colours only: beige, cream, oatmeal, sage, dusty rose #D4A090, faded terracotta, light wood. Miniature clay and felt handcraft look with faint fingerprints, not glossy, not a 3D render, not a realistic photo.

The top 20 percent of the image is plain empty beige background. Leave a plain margin on the left and right: no model comes closer than one eighth of the image width to either side edge. Leave a small even gap between the four models.

No text, no letters, no numbers, no labels, no room names, no measurements, no logos, nothing written on any object. No floor plan drawing lines. No gold, no brass, no metallic parts. No pets.
Portrait 2:3 (1024x1536).
```

---

## 3. 崩れやすいところ（出たら作り直す）

- [ ] **4つの間取りがそろっていない**（壁・ドア・窓の位置がずれる）。いちばん出やすい → 下の「崩れたとき」へ
- [ ] 「LDK」「6畳」などの**文字や寸法が描かれる**
- [ ] **どれかが散らかって見える／どれかだけ豪華に見える**（良し悪しに読める）
- [ ] 人形に**はっきりした目鼻**が出る（夜の窓 v3 と同じく、影の中にうっすらまで）
- [ ] ペアが全部「長い髪＋短い髪」になる（男女の記号で組まれる）
- [ ] 左下の部屋に2人目が入る（ひとり暮らしの部屋が消える）
- [ ] 上 20% が空いていない／左右が端から1/8より近い（`prep-sky.py` で逃がせるが、背景は単色なので足し分は目立たない）
- [ ] 1024×1536 の原寸で受け取る

### 崩れたとき（間取りがそろわない場合）

1枚で4つそろえるのが難しければ、**2段階で作る**。

1. 家具も人もいない**空の部屋を1つだけ**生成する（上のプロンプトの2段落目までを使い、1:1 で「one empty model」にする）
2. その画像を添付して「Use the attached apartment model exactly as it is. Keep every wall, door and window identical. Only add furniture and people:」＋ 部屋ごとの1段落、で4回生成する（1:1）
3. Claude が 2×2 に並べて 9:16 に組む

---

## 4. 版面（Claude 側・案）

- 問いは白い吹き出しで **「住むなら、どの部屋？」**（`render-kotosan.js omote`）
- 1枚・7秒・ズームなし（`build_reel.py one7`）。曲は木曜1枚リールの曲（夜の窓で決めたもの）
- 背景が単色のベージュなので、吹き出しを白にすると沈む。試作を見てから、吹き出しの色（白のまま／薄い縁取り）を決める

---

## 5. 試作 v1 の結果（2026-09-23 夜）

`docs/sns/assets/madori/v1-trial.webp`。**4つの間取りがそろった**（いちばんの難所を越えた）。上 20% の余白・文字なし・人形の顔の簡素さも指示どおり。
ふうかさんの評価は「なかなか良い」。直すのは2点。

1. **トイレに外からしか入れない。** 浴室のドアがアパートの外壁側に開いていて、玄関もどこか分かりにくい。
   ふうかさん：「一回外に出ないと行けないんかい、とツッコまれる（コメント狙いならアリ）」。
   **Claude の判断：直す。** 付くコメントは「どの部屋に住みたいか」ではなく「AI の間違い」になり、問いから目がそれる。
   しかも「AI が作った、よく見ると変な絵」と読まれると、クレイの手作り感（`ig-strategy` §13 のオーセンティシティ）が崩れる。
   → プロンプトで**玄関と玄関ホールを明示し、浴室のドアは玄関ホール側（室内）に開く**と書いた
2. **上2つのふたり暮らしの違いが分かりにくい**（机で作業／ソファでくつろぐ）。ふうかさん：「お互い趣味に全力／在宅勤務くらい違うほうが面白い」。
   **賛成。** 見た瞬間に違いが分からないと、比べる楽しさが生まれない。
   → 左上を**ふたりとも在宅勤務**（リビングが職場・片方はビデオ通話中）、右上を**お互い趣味に全力**（絵とギターの2つの隅）に書き換えた

**残したところ**：4つの間取り・左下のひとり暮らし・右下のほとんど物がない部屋・背景・光。当たっているので動かさない。

**気になる点（直さない）**：人形が小さい（9:16 で1体30px前後）。スマホでは何をしているかがぎりぎり読める大きさ。
v2 で在宅勤務・趣味の動作が読めなければ、模型を大きく（余白を減らす）するか、2段階方式（§3）で1部屋ずつ作る。

## 6. 試作 v2 の結果（2026-09-23 夜）

`docs/sns/assets/madori/v2-trial.webp`。**トイレは室内から入れるようになった。在宅勤務と趣味の違いも一目で分かる。** 人形も v1 より大きく写り、動作が読める。

直すのは2点（v3 のプロンプトに反映済み）。

1. **左下の読書部屋で、本棚と植物の列がキッチンの目の前に立っている**（料理ができない）。ふうかさん：「このくらい気にしないべき？」
   **Claude の判断：直す。** 間取りが好きな人ほど細かいところまで見る。この投稿は細部を眺めさせるのが価値なので、
   トイレと同じく「住めない」ところはコメントがそっちに流れる。本棚は上の壁と窓際に置き、キッチン前は空けると明記した
2. **ふたり暮らしの3組が、全部「お団子＋短い髪」になった**（v1 でも同じ傾向）。3組そろうと、3組とも男女に見える。
   「組み合わせを性別で決めない」はプロンプトの一般論だけでは効かなかったので、**部屋ごとに髪型を指定した**
   （在宅勤務＝ふたりとも短い髪／趣味＝長い髪とニット帽／お茶＝ふたりともお団子）

**v3 で崩れたら v2 に戻る。** v2 でも出せる出来なので、作り直しで他が壊れたら深追いしない（投稿日は未定で急がない）。

## 7. 試作 v3 → **これで行く**（2026-09-23 夜）

`docs/sns/assets/madori/v3-trial.webp`。ふうかさん「めっちゃ良い」。
キッチン前が空いた／ペアの髪型が3組とも違う（短い髪どうし・長い髪とニット帽・お団子どうし）／トイレは室内から／在宅勤務と趣味の違いが一目で分かる。
拡大して確認し、画面・キャンバス・レコードに文字は出ていない。

### 版面（Claude 側）

- 夜の窓の `prep-sky.py`（97% に縮めて上に足す）だと模型が小さく、右端に隣の影のかけらが出た。
  背景が単色なので**逆に拡大する** `tools/ig-carousel/prep-fill.py` を作った。模型の外周（x=72〜980・上端 y=288）を 1080 幅いっぱい（左右 20px）まで 1.145 倍にし、
  上端を y=580 に置く。上の足りない分は背景の帯を反転して積む
- 吹き出しは白のまま。ベージュの上でも縁がはっきり見えたので、色は変えない
- 4段目にあたる下の2部屋は IG のキャプションに一部重なる（夜の窓と同じ。長押しで見られる）

```bash
python3 prep-fill.py <v3の原寸.png> plate-madori.png 72 980 288
NODE_PATH=$(npm root -g) node render-kotosan.js omote plate-madori.png f1.png '["住むなら、どの部屋？"]'
python3 build_reel.py one7 kinda-ig-madori.mp4
```

**投稿日は未定。** 木曜の順番（夜の窓 9/24 → note 紹介 → 間取り）どおりなら 10/8 か 10/15。
夜の窓の数字（送信・「○番」のコメント）を見てから、問いとキャプションを決める。曲は木曜1枚リールの曲（夜の窓で決めるもの）。

---

## 8. 別案「人のいない、くわしい間取り」（2026-09-23 夜・ふうか提案・未生成）

> ふうかさん：「人を無くす代わりに、もうちょい詳しい家の間取りにフォーカスしたバージョンも欲しい」

**賛成。v3 とは別の1本として作る**（v3 の差し替えではない）。v3 は「4つの暮らしから選ぶ」、こちらは「1つの家の中を目で歩く」。
間取りはそれ自体を眺める人が多いジャンルなので、人がいなくても**細部そのものが見る理由**になる。

### 設計で外さないこと

- **1つの家を画面いっぱいに。** 4つ並べると1つずつが小さく、くわしくできない。v3 の 1LDK より広い **2LDK** にして、歩き回る場所を増やす
- **縦長の家にする。** 日本の集合住宅によくある「玄関が下・廊下がまっすぐ上へ・奥が LDK とベランダ」の形。9:16 の縦に素直に収まる
- **選ぶものを残す。** `ig-strategy` §15 ①-2 で「リビング1枚は選ぶものがなく送られにくい」とした。1つの家でも**「どこが自分の場所か」**を選べるように、
  性格の違う居場所を 6〜8 か所置く（窓辺の机・ソファ・キッチンカウンター・ベランダの椅子・寝室・ウォークインクローゼット・洗面所など）
- **人の代わりに「いま出かけたところ」の気配を置く。** 夜の窓 v1（ものだけ）が弱かったのは「覗く相手」がいなかったから。
  椅子にかけたカーディガン、伏せた本、湯気のないマグ、ベランダの洗濯物などで、**誰かが暮らしている**ことだけを見せる
- **何人で住んでいるかは読ませない。** 椅子やスリッパの数でふたり暮らしに見せない（v3 の左下と同じく「ふたり」をゴールにしない）
- 昼の光（夜の窓と並べて同じ型に見せない）

### 問い（案）

- **「この家で、あなたの場所は？」**（第一案）。コメントは「ベランダ」「窓辺の机」のように場所で返せる。夜の窓の「○番」と同じ形
- 予備：「この家で、いちばん長くいる場所は？」
- どちらも pair の `l2-alone`（一人の時間）・`l4-home`（住まいの形）と地続き。答えを先に渡さない

### ChatGPT プロンプト（新しいチャットで・添付なし・2:3）

```
One handmade miniature clay model of a two-bedroom apartment, seen from above at a gentle isometric angle, like a dollhouse with no roof and no front walls, so every room inside is visible. The model fills most of the image, on a plain warm beige background (#F5EEE6).

The apartment is long and narrow, with its long side running from the bottom of the image to the top, like a typical Japanese apartment floor plan. Make the floor plan clear, realistic and livable, the kind people enjoy studying in detail.

Bottom: the front door is in the bottom wall. It opens into a small entrance area with a low shoe cabinet, a small step up and one pair of slippers.
Middle: a straight corridor runs from the entrance up toward the living room. On the left side of the corridor: a small toilet room with its own door, then a washroom with a sink, a mirror and a washing machine, and behind the washroom a bathroom with a small bathtub. On the right side of the corridor: a small bedroom with a desk by its window, a desk lamp, a bookshelf and a single bed. Every one of these doors opens into the corridor, inside the apartment, never to the outside.
Top: the corridor opens into a wide living-dining-kitchen. A kitchen counter with a sink and a small stove faces the dining area, with a kettle on the stove and a few jars on a shelf. A small wooden dining table with mismatched chairs. A sofa with a low table and a soft rug. The larger bedroom sits beside the living room, with a bed, a bedside lamp and a walk-in closet with clothes on a rail. Along the top wall, a big window opens onto a narrow balcony with potted plants, a small folding chair and a laundry rack with a few clothes.

Nobody is in the apartment, but it looks lived in, as if someone just stepped out: a cardigan over a chair, an open book face down on the sofa, a mug on the desk, a watering can beside the plants. Tidy but not staged. Nothing shows how many people live here.

Soft daylight coming in from the balcony window, gentle matte shadows, warm and quiet. Muted colours only: beige, cream, oatmeal, sage, dusty rose #D4A090, faded terracotta, light wood. Miniature clay and felt handcraft look with faint fingerprints, not glossy, not a 3D render, not a realistic photo.

The top 20 percent of the image is plain empty beige background. Leave a plain margin on the left and right: the model comes no closer than one twelfth of the image width to either side edge.

No people, no figures, no pets. No text, no letters, no numbers, no labels, no room names, no measurements, no logos, nothing written on any object, no book titles. No floor plan drawing lines. No gold, no brass, no metallic parts.
Portrait 2:3 (1024x1536).
```

### 崩れやすいところ（出たら作り直す）

- [ ] **外からしか入れない部屋**（トイレ・浴室のドアが外壁側）。v1 と同じ事故。いちばん先に見る
- [ ] 廊下や部屋が行き止まりで、**玄関から LDK まで歩けない**
- [ ] 「2LDK」「6畳」などの**文字・寸法・部屋名**、本の背表紙の文字
- [ ] **人形やペットが出る**
- [ ] 椅子2脚・スリッパ2足・歯ブラシ2本など、**ふたり暮らしに読める数の揃い**
- [ ] 家具がキッチン・ドアの前をふさぐ（v2 の本棚と同じ。住めないところはコメントがそっちに流れる）
- [ ] 家が横長に出て、9:16 で小さくなる
- [ ] 1024×1536 の原寸で受け取る

### 版面・投稿

- 版面は §7 と同じ流れ（`prep-fill.py` → `render-kotosan.js omote` → `build_reel.py one7`）。模型の外周は生成後に測る
- **v3 と同じ週に出さない**（近似重複）。10/1 に夜の窓の数字を見るとき、v3 とこの案のどちらを先に出すかも一緒に決める。
  夜の窓で「○番」のコメントが多ければ、同じ「場所で答える」形のこの案とも相性がいい
