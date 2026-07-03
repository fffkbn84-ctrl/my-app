# ミニチュア世界観の画像生成ガイド（2026-07-02 初版）

> ふうかの本来やりたい世界観＝「ミニチュア」「リアルな偽物感」「子供の頃に遊んだ風景」「食品サンプル」
> （クレイの"かわいいキャラ"ではなく、"作り物の小さな世界"が主役）。
> 既存画像は置き換えず、**新規生成分からこのガイドを適用**する。Notion「ミニチュア世界観の画像生成ガイド」と同内容。

## 演出の9ルール

1. **主役は人形ではなく情景**（人のいない、または人がごく小さい小世界）
2. **「作り物の証拠」を1つ入れる**：展示台座／粘土の継ぎ目／手書きの値札／アクリルケースの縁
3. **食品サンプルのツヤ**：クリームソーダ・プリン等をラッカーの光沢で
4. **tilt-shift（ミニチュア写真）風**・浅い被写界深度
5. パレット固定：ウォームベージュ `#F5EEE6` ＋ ダスティローズ/テラコッタ `#D4A090`
6. 光は**上からやわらかく**（午後の日差し）
7. **文字・ロゴを画像内に入れない**（生成文字は崩れる。ラベルは「読めない手書き風」と指定）
8. 人を入れる場合は**小さく・後ろ姿・顔なし**
9. 生成後は **WebP変換**、ファーストビュー画像は `next/image` の `priority`

## 第1弾：/kinda-act ヒーロー差し替え用プロンプト（ChatGPT にそのまま貼る）

```
A photorealistic miniature diorama of a tiny Japanese retro cafe interior made
for two people, crafted like a handmade food-sample (sampuru) display. Two small
empty chairs face each other at a little wooden table by a window. On the table,
a glossy fake cream soda and a pudding a la mode with the shiny lacquered look of
Japanese food samples, and a tiny illegible handwritten price tag. The whole scene
sits on a visible wooden display base like a museum diorama, with subtle clay seams
and small imperfections that quietly reveal it is handmade. Warm beige palette
(#F5EEE6) with dusty rose and terracotta accents (#D4A090). Soft warm afternoon
light falling from above. Shallow depth of field, tilt-shift miniature photography
look. Nostalgic atmosphere of a toy town you played with as a child. No people,
no readable text, no logos. Landscape 16:9.
```

- 日本語での意図（ChatGPTに補足してよい）：「デートやお見合いで使う喫茶店を、食品サンプルのある懐かしいミニチュア模型として。かわいいキャラクターは出さず、"よくできた作り物の小さな世界"に」
- バリエーション：人の気配が欲しければ末尾の *No people* を
  `Two tiny clay figures seen from behind, very small in the frame, no faces visible.` に差し替え

## 生成後の手順

1. ChatGPT で 16:9 生成 → 気に入るまで再生成（ルール1〜8で自己チェック）
2. PNG を保存し、Claude Code に「kinda-act のヒーローに差し替えて」と渡す
   （WebP変換・`public/images/kinda-act-hero.webp` 配置・ビルド確認・PR まで Claude 側で実施）
3. プレビューURLで実機確認 → main マージ

## 画像の使い分けルール（2026-07-03 ふうか方針・確定次第 CLAUDE.md §4 へ）

- **人形（人物）を出すのは「気持ちを売る場所」だけ**：トップのヒーロー、サービス紹介、`/about` 系。SNS は別ルール（従来どおり）。
- **機能を表す場所は「人のいない空の部屋（ミニチュアハウス）」**：トップの4サービスカード（type/talk/act/glow）、天気カード等。「何をする場所か」を一発で伝えるため、視線を人物に取られない空室にする。
- 狙い：クレイ人形は情報量が多く「ごちゃつく」。機能カードは空室にして用途を明快に、かつ戸棚で覗く一体感を出す。

## 第2弾：4サービスカードを「空の部屋」セットで統一（戸棚B用）

戸棚（升目を覗くUI）に収める4枚。**バラバラに見せない＝カメラ・スケール・光・土台を全部そろえる**のが最重要。
下の共通テンプレートの `【SCENE】` だけ差し替えて4枚生成する。

### 共通テンプレート（ChatGPT にそのまま）

```
A photorealistic miniature dollhouse room diorama, cutaway front view at eye level,
of 【SCENE】. Same doll-house scale, same eye-level camera, same soft warm light from
above, sitting on a small wooden display base. Warm beige palette (#F5EEE6) with dusty
rose and terracotta accents (#D4A090). Cozy, handmade, tilt-shift miniature look with
subtle clay seams that reveal it is a made object. NO people, no figures, no dolls.
No readable text, no logos. Square 1:1 composition, the room centered and fully visible.
```

### 各カードの 【SCENE】（4枚を同じ日・同じ設定で連続生成する）

| カード | 色 | 【SCENE】に入れる英語 |
|---|---|---|
| **type**（診断） | 青 | `a tiny cozy consultation nook: a small wooden desk with a questionnaire card and a pastel signpost, and a wall chart showing four simple personality icons — a room that says "find the type that fits you"` |
| **talk**（相談） | 黄 | `an empty counseling room: two soft armchairs facing each other across a low table with two teacups, a warm floor lamp and a small bookshelf` |
| **act**（お見合い・デート） | 桃 | `a retro Japanese cafe interior for two: a little table by a lace-curtain window with a cream soda and a pudding, two empty chairs, a warm hanging lamp`（※すでに生成済みの kinda-act ジオラマを流用可） |
| **glow**（自分を整える） | 紫 | `a small dressing room: a lit vanity mirror, a single chair, a cosmetics cart, soft towels` |

- 生成後、Claude Code に「4枚を section カードに差し込んで」と渡す（各 `public/images/section-<key>.webp` に WebP 化・配置・ビルド・PR まで実施）。
- act は既存の `kinda-act-hero.webp` の正方形クロップでも可（新規生成の手間を省ける）。

## 展開順（確定後）

戸棚B（升目UI）を先に確定 → 4部屋画像を空室セットに差し替え → 装飾（角飾り・小さなラベル）を最後に微調整。
天気カード・トップヒーローは**人物ありのまま維持**（ふうか方針）。
