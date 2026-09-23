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

Top left: both figures work from home. The living room has become an office: two desks, each with a laptop and a monitor whose blank screens glow, office chairs, cables, coffee mugs, a stack of folders. One figure wears headphones and waves at the blank screen as if on a video call; the other types, leaning in. The sofa is pushed against the wall. In the bedroom, two single beds with a gap between them.
Top right: both figures are fully absorbed in their own hobbies, and the living room is split into two hobby corners. On one side, a figure paints at a wooden easel, surrounded by small canvases with simple soft colour shapes, jars of brushes and paint-stained cloths. On the other side, a figure plays an acoustic guitar on a stool beside a shelf of records and a small amplifier. The two corners look completely different from each other. In the bedroom, one large bed with two blankets in two different colours.
Bottom left: one figure alone in a reading chair by the big window. The living room is full of bookshelves and potted plants, cosy and tidy, not cluttered. In the bedroom, one small bed and a stack of books.
Bottom right: two figures sitting on floor cushions at a low wooden table, drinking tea. The rooms are almost empty and calm: bare floor, one plant, a folded futon in the bedroom.

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
