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
