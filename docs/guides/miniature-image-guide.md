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

## 展開順（うまくいったら）

/kinda-act ヒーロー → 天気カード・季節バッジ → Kinda glow/act のカード → 最後にトップヒーロー（ブランドの顔なので最後・要ふうか承認）
