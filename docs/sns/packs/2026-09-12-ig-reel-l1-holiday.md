# IGリール制作キット 2026-09-12（土）｜入口層・`l1-holiday`

- **枠**: `docs/sns/ig-strategy-2026-09.md` §3 の土曜枠＝**入口層**（非フォロワーに届く役割）
- **投稿**: 12:00 / リール / 15〜20秒 / 9:16
- **題材**: `src/lib/pair/topics.ts` の `l1-holiday`（層＝ふれる）
- **役割**: 火曜 9/15 の連載第1週を開く。1投稿に2つ以上の役割を持たせない
- **画像ルールの正**: `docs/guides/miniature-image-guide.md`（9ルール）

---

## いちばん大事な制約

**画像の中に文字を入れない。**（画像ガイド ルール7）
生成AIは日本語を崩すため、文字はすべて**編集ソフト側で載せる**。生成するのは情景だけ。

---

## カット構成（5枚・文字は後載せ）

| # | 秒 | 画面に載せる文字（編集ソフトで） | 絵の役割 |
|---|---|---|---|
| 1 | 0.0〜1.5 | **休みの日って、外に出る方ですか** | 二択が一目で分かる玄関 |
| 2 | 1.5〜5 | お見合いの1時間で、最初に置きやすい話題です | 向かい合う席 |
| 3 | 5〜10 | 事実で答えられるから、相手が考え込まずに済む | 家にいる側 |
| 4 | 10〜15 | どちらが良いという話ではありません | 外に出る側 |
| 5 | 15〜20 | 保存して、会う前に見返してください | 両方を並べた俯瞰 |

1枚目に世界観・ブランド名・詩的な導入を置かない。スキップ率92%だった雨リールがそれをやっていた。
1枚目の文は `topics.ts` の `ask` をそのまま使っている（新しく考えない）。

---

## 画像プロンプト（ChatGPT にそのまま）

### カット1 — 玄関（フック）

```
A photorealistic miniature diorama of a tiny Japanese entryway (genkan), crafted
like a handmade food-sample display. On one side, a small pair of walking shoes
neatly pointed toward the door. On the other side, a pair of soft house slippers
left facing inward. The two choices sit side by side at equal size. The scene rests
on a visible wooden display base like a museum diorama, with subtle clay seams and
small imperfections that quietly reveal it is handmade. Warm beige palette (#F5EEE6)
with dusty rose and terracotta accents (#D4A090). Soft warm afternoon light falling
from above. Shallow depth of field, tilt-shift miniature photography look. Nostalgic
atmosphere of a toy town you played with as a child. No people, no readable text,
no logos. Vertical 9:16.
```

### カット2 — 向かい合う席

```
A photorealistic miniature diorama of a tiny Japanese retro cafe interior made for
two people, crafted like a handmade food-sample (sampuru) display. Two small empty
chairs face each other at a little wooden table by a lace-curtain window. On the
table, a glossy fake cream soda with the shiny lacquered look of Japanese food
samples, and a tiny illegible handwritten price tag. Visible wooden display base,
subtle clay seams. Warm beige palette (#F5EEE6) with dusty rose and terracotta
accents (#D4A090). Soft warm afternoon light from above. Shallow depth of field,
tilt-shift miniature photography look. No people, no readable text, no logos.
Vertical 9:16.
```

### カット3 — 家にいる側

```
A photorealistic miniature dollhouse room interior: a small window nook on a quiet
afternoon. A tiny mug with a glossy food-sample shine, an open paperback face down,
a folded blanket on a low chair. Handmade miniature craft, subtle clay seams and a
visible wooden display base that reveal it is a made object. Warm beige palette
(#F5EEE6) with dusty rose and terracotta accents (#D4A090). Soft warm light falling
from above through the window. Shallow depth of field, tilt-shift miniature
photography look. No people, no readable text, no logos. Vertical 9:16.
```

### カット4 — 外に出る側

```
A photorealistic miniature diorama of a tiny neighborhood walking path on a clear
afternoon. A small backpack and a folded paper map rest on a low stone step beside
the path, with little trees and a distant miniature rooftop. Handmade miniature
craft on a visible wooden display base, subtle clay seams and small imperfections.
Warm beige palette (#F5EEE6) with dusty rose and terracotta accents (#D4A090).
Soft warm afternoon light from above. Shallow depth of field, tilt-shift miniature
photography look. No people, no readable text, no logos. Vertical 9:16.
```

### カット5 — 両方を並べた俯瞰（オチ）

```
A photorealistic miniature diorama seen from slightly above: two small scenes placed
side by side on the same wooden display base, at exactly the same size and the same
height. On the left, a cozy indoor window nook with a mug and a blanket. On the
right, an outdoor walking path with a backpack and little trees. Neither side is
emphasized over the other; the lighting and scale are identical on both. Handmade
miniature craft with subtle clay seams. Warm beige palette (#F5EEE6) with dusty rose
and terracotta accents (#D4A090). Soft warm afternoon light from above. Shallow
depth of field, tilt-shift miniature photography look. No people, no readable text,
no logos. Vertical 9:16.
```

> カット5は「どちらが良いという話ではありません」を**絵で言う**回。
> 左右を同じ大きさ・同じ高さ・同じ光にするのが要件。片方が大きいと優劣が出る。

---

## 動きの付け方（編集ソフト）

静止画のままでよい。動かすなら以下だけ。

- 各カット **1.05倍までのゆっくりズームイン**（Ken Burns）。速く動かすと世界観が安っぽくなる
- カット間は**クロスディゾルブ 0.3秒**。フラッシュやスライドは使わない
- カット1だけはズームなし。1秒目は文字を読ませる時間で、動きが邪魔になる

## 文字の載せ方

- 1枚目：**画面の上から1/3、大きく、1行**。読み切れる量にする
- 2枚目以降：画面下1/3。1カット1文
- 書体は明朝系。色は `#2E2620`。背景が明るいので白抜きにしない
- 絵文字を使わない（CLAUDE.md §3）
- アクセントを使うなら `#D4A090` を1箇所だけ

## 音

- **無音にしない。** リールは音ありが既定で再生される
- 曲は歌モノを避ける。歌詞があると文字と competing になる。ピアノかアコースティックの静かなもの
- 音量は控えめに。文字を読む速度が主で、音楽は下敷き
- **ふうかさんの声を入れてもよい**（CLAUDE.md §3 で音声は利用可・顔出しはしない）。フォロワー0の段階では「作っている人」の気配が最も効く。無理のない範囲で

---

## キャプション（Notion に投入済みのもの）

```
何を話すか決まらないまま、当日を迎えることがあります。
火曜から、ふたりの話題を毎週ひとつずつ置いていきます。

#結婚相談所 #婚活 #お見合い #婚活中の人と繋がりたい #真剣交際 #お見合いデート #結婚相談所選び #kinda
```

- **「プロフィールのリンクから」を書かない。** W27 でリール経由のプロフィール遷移は4本連続で0だった
- コメントを取るなら二択で。「どう思いますか」ではなく「外に出る方ですか、家にいる方ですか」

---

## 投稿後に取る数字（§7）

| 指標 | 記録先 |
|---|---|
| 3秒視聴継続率 | Notion IG投稿カレンダーの振り返りメモ（W27 は12〜20%） |
| 保存数 | 同上（主力CTAにしたので、ここが効いたか見る） |
| フォロワー増減 | 週次。主指標 |

リーチとインプレッションは追わない（既に出ていて判断材料にならない）。

---

## セルフQA

- [x] 1秒目が「相手の状況の言葉」である（世界観・ブランド名ではない）
- [x] 画像内に文字・ロゴを入れない指定が全プロンプトに入っている
- [x] 人を入れていない
- [x] 「作り物の証拠」（clay seams / display base / 手書きの値札）が各プロンプトに入っている
- [x] パレット `#F5EEE6` / `#D4A090` を全カットで指定
- [x] 絵文字なし
- [x] 焦らせ・比較表現なし
- [x] 点数・％・相性スコアなし
- [x] 「診断」「相性」「運命」「絆」「特別」を使っていない
- [x] 効かなかった CTA（プロフィールのリンクから）を書いていない

## 補足

IG に上げる画像は **WebP 変換不要**。画像ガイド ルール9 の WebP はサイト掲載用で、
Instagram はアップロード時に再圧縮されるため PNG / JPG のままでよい。
