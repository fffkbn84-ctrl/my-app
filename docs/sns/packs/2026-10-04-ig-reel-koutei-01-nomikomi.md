# 【ストック】肯定の型・ことさん版「飲み込みがちな人は」制作キット（2026-10-04 作成・未投稿）

> **10/4 はこれを出さなかった。** ふうかさんのイメージは「案5 の甘やかすお姉さんキャラが、肯定の言葉を言う」だった（ideas.md 案4 と案5 の合わせ技）。
> こちらはことさん版としてストック。出すときは日付・Notion を入れ直す。

> 型は `docs/sns/ideas.md` 案4。版面は並べる型 #1（`packs/ig-reel-narabe-01-mada-ienai.md`）と同じ。
> キャラはことさん（`series/kotosan-poses.md` が生成の正）。**1体だけ・無地の背景**で出す。

## 0. なぜ今日この回か（10/4 の選定）

- **並べる型 #1（10/3）が効いた**：3秒残存 **36%**・スキップ 69.2%・リーチ156・プロフ遷移2（翌日計測）。
  ことさん#1（38%）に次ぐ2番目で、ことさん以外では最高。TODO で「よければ肯定の型へ」と決めていた条件を満たした
- **日曜の夜に合う**（ふうか案）。明日からまた飲み込む人に向けた「救いの回」になる。
  ことさん#1〜#4 で飲み込む姿を笑ってきたあとに、裏返して肯定する（ideas.md 案4 のメモどおり）
- 昨日の並べる型は「ふたり」の彼女。今日はことさんなので、**同じ版面でもキャラと絵がまるごと違う**（近似重複に当たらない）
- 当初用意した「ふたり」#3（ゲームオーバー2）は**ストックに回した**（ふうか指示）。キット `packs/2026-10-04-ig-reel-futari-gameover-02.md`
- 送信は全回0のまま（10/3 も0）。この型は**「これ、あの人だ」と思って送る**ことを狙う

## 1. 台本（4カット・9.3秒・`build_reel.py narabe4`）

| # | 秒 | 画面（ことさん1体・無地） | 下の一言 |
|---|---|---|---|
| 帯 | 全編 | — | **飲み込みがちな人は**／ことさんは、飲み込んだ。 |
| 1 | 0〜2.4 | 少し身を乗り出して、両腕をそろえ、じっと聞いている | 「話を最後まで聞ける」 |
| 2 | 〜4.6 | 小さな丸い風船をそっと両腕で抱えている | 「場の空気を守れる」 |
| 3 | 〜6.8 | まんまるにふくらんで、ひもがぎゅっと締まっている（シリーズの「ごくん」） | 「怒る前に一度考える」 |
| 4 | 〜9.3 | ひもがゆるんで口が少し開き、片腕を少し上げている | 「たまには言っていい」 |

- 1〜3 は**短所に見えることの、いいところ**。4 だけが**具体的な一手**（空虚な共感で終わらせない。ideas.md 案4 の約束）
- 2 の風船は「空気」のしゃれ。3 はシリーズの目印の「ごくん」を、**飲み込む＝考えている**として読み替える
- 4 は口のないことさんが「ひもをゆるめる＝話す」。シリーズでいちばんゆるんだ姿で終わる
- 一言はすべて10字以内（`render-kotosan-v2.js` の label は10字まで。10/4 に版面を試し書きして確認済み）

## 2. ChatGPT プロンプト（新しいメッセージで4枚・2:3）

**`docs/sns/assets/kotosan/kotosan-reference-v1.webp`（4面キャラシート）だけを添付する。** 机の画像は添付しない（無地の回）。
4枚とも同じスレッドで、下の全文の【POSE】だけを差し替える。

```
Use the attached image as the exact character reference. Keep everything about the character identical: dusty blue drawstring pouch plush with a gathered top, terracotta drawstring cord with two wooden beads, no mouth, vertical oval matte black embroidered eyes that are slightly uneven, thin round gold wire glasses resting on the face, a cream felt staff ID badge with a small dusty blue square patch in its centre (exactly as in the reference: no text, no letters, no logo on it) hanging slightly off-center on a thin terracotta cord, short round fabric arms, flat base. Looped fluffy fabric texture exactly like the reference, soft and fuzzy, not carved, with visible hand-stitched seams. Do not turn the character into clay. No cheek blush, no glossy eyes, no perfect left-right symmetry.

Scene: nothing but a plain warm beige seamless background (#F5EEE6). The character stands alone on a soft matte beige surface with only its own soft shadow. No other characters, no furniture, no props unless stated below.

【POSE】

Framing: front view, camera at the character's eye level. The character is small and centered: the character and any prop fit inside the vertical band between 30 percent and 62 percent of the image height. The top 28 percent and the bottom 36 percent of the image are completely plain empty beige background.
Lighting: soft diffused daylight from the upper left, one soft shadow under the character. No orange sunset light.
No text, no letters, no numbers, no logos anywhere, including on the ID badge. No speech bubbles. No gold or brass props (the gold glasses are the only metal). Vertical 2:3 (1024x1536).
```

| # | 【POSE】 |
|---|---|
| 1 | `Pose: the character stands facing the camera and leans very slightly forward, as if listening carefully to someone just out of frame. Both short round arms are placed neatly together in front of its body. The matte black embroidered eyes are clearly visible behind the wire glasses, no glare on the lenses, calm and attentive. The drawstring is neat and the two wooden beads hang straight down.` |
| 2 | `Pose: the character stands facing the camera, gently hugging one small round pale cream balloon (matte, no shine, no string, no print) against its body with both short round arms, holding it carefully as if it might drift away. The matte black embroidered eyes are visible behind the wire glasses, no glare, calm. The drawstring is neat.` |
| 3 | `Pose: the character stands facing the camera and its pouch body has swollen into a round ball, clearly wider than in the reference, with the gathered top cinched shut hard so the terracotta drawstring bites into the fabric and the two wooden beads stick out sideways. The short round arms are pushed away from the body by the swelling. Both matte black embroidered eyes are visible behind the wire glasses, no glare, steady and thoughtful rather than upset.` |
| 4 | `Pose: the character stands facing the camera with the gathered top noticeably loosened: the terracotta drawstring is slack, the gather has opened a little like a small mouth, and the two wooden beads hang low and apart. One short round arm is lifted slightly, as if about to say something. The body is relaxed and slightly softer than in the reference. Both matte black embroidered eyes are visible behind the wire glasses, no glare, a little brighter.` |

### 出てきた画像のチェック（`kotosan-poses.md` §7 と同じ。通らなければ作り直す）

- **口が無い**（最頻出の事故。4 は「口のように開く」と書いているので特に注意。開くのは**頭の巾着の口**で、顔に口は描かない）
- 眼鏡が細い丸のゴールド／目は縦長の楕円・マットな黒／社員証に文字なし
- ことさんだけふわふわのループ生地（粘土になっていない）
- キャラが大きく写って**下 36% にはみ出していない**（下の一言と重なる）
- 2 の風船に柄・文字・ひもが出ていない
- 3 が怒って見えすぎない（「考えている」くらい）

## 3. 書き出し（Claude の担当）

```bash
cd docs/sns/tools/ig-carousel   # フォント：noto900.woff2 / noto700.woff2（README）
# 上端は画像ごとに測って足元を y≈1210 にそろえる（並べる型 #1 の実績どおり。200 固定にしない）
python3 prep-futari.py gen-1.png plate-1.png <上端>   # 2〜4 も同じ
B='["飲み込みがちな人は","ことさんは、飲み込んだ。"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-1.png f1.png "$B" label 0 '["話を最後まで聞ける"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-2.png f2.png "$B" label 0 '["場の空気を守れる"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-3.png f3.png "$B" label 0 '["怒る前に一度考える"]'
NODE_PATH=$(npm root -g) node render-kotosan-v2.js plate-4.png f4.png "$B" label 0 '["たまには言っていい"]'
python3 build_reel.py narabe4 kinda-ig-1004-koutei-01.mp4
```

効果音は入れない（並べる型と同じ）。曲は IG 側で、やわらかいローファイかピアノ。

## 4. キャプション

```
日曜の夜に、飲み込みがちな人へ。

話を最後まで聞ける。
場の空気を守れる。
怒る前に、一度考えられる。
それは、ちゃんと長所です。

ただ、飲み込んだ言葉は消えるわけではなくて、
少しずつ、たまっていきます。

だから、たまには言っていい。
全部じゃなくて、ひとつだけでも。
最初のひとことは、いちばん話しやすい人に。

思い当たる人がいたら、そっと送ってみてください。

#ことさんは飲み込んだ #人間関係 #会社員あるある #言いたいことが言えない #日曜日の夜
```

- 投稿時：**カバーは1カット目**／AI 生成の開示／無音で出さない
- ハッシュタグは5個まで（`kotosan-reel.md` の決まり）

## 5. トーンの線（セルフチェック）

- **比べない**：「〜な人ほど幸せ」「〜な人が勝ち」と言わない。「〜な人は」＋事実の言い換えだけ（ideas.md 案4 の約束）
- **空虚な共感にしない**：「えらいね」「わかるよ」で終わらず、最後に「ひとつだけでも／話しやすい人に」という**小さな一手**を置いた
- **焦らせない**：「言わないとダメ」とは書かない。「たまには」「ひとつだけでも」で、飲み込む今を否定しない
- **見下しに読まれない**：飲み込む人を弱い人として描かない。1〜3 は能力として言い切る
- 恋愛・婚活の語は入れていない（ことさんの「人間関係」回として出す）。絵文字なし

## 6. 見る数字

- **送信数**（最後の一行が効くか）と**3秒残存**（並べる型 #1 の36%と比べる）
- ことさんの判定（10/16）とは別枠。v2 の#1〜#6 とは数字を混ぜずに比べる
