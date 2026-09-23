# ことさん ポーズ生成プロンプト集（2026-09-21 初版）

> **この1ファイルが「ことさんの画像を生成するとき」の正。**
> 枠の運用（曜日・カット割り・版面）は `kotosan-reel.md`、キャラの設定は
> 設定書 v1.3（https://claude.ai/artifact/LSsYJbyHHNSi57S2kEpfyh）が正。ここは重複させない。
>
> 目的は **4ポーズだけで回さないこと**。`kotosan-reel.md` §4・ふうか合意 2026-09-20。
> IG のオリジナリティ規定（70%以上一致で近似重複・非フォロワーへのリーチが 24時間〜30日落ちる）に、
> 毎回同じ4フレームは正面から当たる。

---

## 0. 使い方

1. **ChatGPT の新しいメッセージ**を立てる（会話を重ねるとブレが溜まる。設定書§8）
2. **基準画像を添付する。** デスクの回は**2枚**（`kotosan-reference-v1` ＝ 4面キャラシート、
   `kotosan-scene-desk-v1` ＝ 基準オフィス）。無地の回はキャラシートだけ。
   どちらも `docs/sns/assets/kotosan/` にある。喉袋型（案B）は絶対に添付しない
3. 下の **§1 共通ロック** をそのまま貼る
4. その下に **§3〜§6 から1つ**選んで貼る
5. 最後に **§2 共通フッタ** を貼る
6. 出てきたら §7 のチェックに通す。通ったら **`docs/sns/assets/kotosan/<ファイル名>.webp` に入れて commit する**
   （作業ディレクトリは毎回リセットされる。リポジトリに置けば次のセッションが自分で取れて、
   ふうかさんが貼り直さなくて済む）。あわせて**設定書§9 の画像ファイル一覧に追記する**

> `public/` には置かない。kinda.jp から配信されてしまうため。SNS の作業素材は `docs/sns/assets/` に置く。
> 保存は WebP・quality 95（2MB の PNG が 180KB 程度になる。リールに焼くぶんには劣化は見えない）。

### 1本のリールの中では、セットをそろえる（2026-09-22 に実際にズレた）

カット2〜4 は**同じ机・同じ椅子・同じ色**でなければいけない。12秒でクロスディゾルブしながら
切り替わるので、**机の色が変わると視聴者に気づかれる**。

最初の場面セットには机の色を書いていなかったため、同じプロンプトからテラコッタの机と
クリームの机が出た。いまは §3-A で**基準オフィス画像（`kotosan-scene-desk-v1`）に合わせて固定**してある。
古いプロンプトで作った画像を混ぜない。

> **壁の斜めの光は基準にある。** 2026-09-22 に一度「壁に影を落とさない」と書いたが、
> 基準オフィス画像には左上からの光の帯が入っている。消さない。

生成は1日8枚まで。**節約しすぎない**（ポーズを増やすことが目的なので、1日で1枠ぶん作り切ってよい）。

### 比率は 2:3（2026-09-21 ふうか決裁・確定）

**ChatGPT では 2:3（1024×1536）で生成する。** 左右を切って 864×1536 を取り、1080×1920 に伸ばす（拡大 25%）。
4:5（1080×1350）だと 9:16 が 759×1350 しか残らず、拡大が 42% になって絵が眠くなるため変更した。
設定書§9 の「Vertical 4:5」より**このファイルと `kotosan-reel.md` §4 が優先**する。

**他の枠の「生成は必ず 1:1」（`ig-week-2026-09.md` §7・TODO.md）はことさんには当てない。**
あれは `prep.py` でモチーフだけ切り出す型のためのルール。
ことさんは背景ごと写っているので `prep.py` を通さない。

---

## 1. 共通ロック（毎回そのまま貼る）

```
Use the attached image as the exact character reference. Keep everything about the character identical: dusty blue drawstring pouch plush with a gathered top, terracotta drawstring cord with two wooden beads, no mouth, vertical oval matte black embroidered eyes that are slightly uneven, thin round gold wire glasses resting on the face, a cream felt staff ID badge with a small dusty blue square patch in its centre (exactly as in the reference: no text, no letters, no logo on it) hanging slightly off-center on a thin terracotta cord, short round fabric arms, flat base. Looped fluffy fabric texture exactly like the reference, soft and fuzzy, not carved, with visible hand-stitched seams. Do not turn the character into clay. No cheek blush, no glossy eyes, no perfect left-right symmetry.
```

## 2. 共通フッタ（毎回そのまま貼る）

```
Lighting: soft diffused daylight from the upper left, falling equally on the plush and the clay, with matching soft shadows. No orange sunset light.

Camera: miniature photography at desk eye level. Vertical 2:3. Keep the upper third empty for text.

No text, no letters, no numbers, no logos anywhere, including on the ID badge. No shiny metallic props in the scene (the gold glasses are the only metal). No photorealism: the clay keeps fingerprints, tool marks and slightly uneven handmade shapes, soft matte finish.
```

## 3. 場面セット（2種・下のポーズ文に挟んで使う）

**A. デスク（仕事・Kinda社内の回）**

```
Scene: match the attached office reference exactly. A simple handmade polymer clay miniature office set: the desk, the office chair, the laptop and the mug are all muted terracotta clay (#D4A090), standing on a floor of the same warm terracotta clay; the one small potted plant sits in a cream clay pot with pale sage leaves. The wall behind is plain warm beige (#F5EEE6) with nothing on it, crossed by one soft diagonal band of light from the upper left. On the desk: only the laptop, the mug and the plant. No foreground objects, no shelves, no window, no picture frames. The character is sized like a coworker: its head rises well above the desk.
```

**B. 無地（日常・人間関係・恋愛の回）**

```
Scene: nothing but a plain warm beige seamless background (#F5EEE6). The character stands on a soft matte beige surface with only its own soft shadow. No props unless stated below.
```

---

## 4. カット2（表の言葉）— glare のバリエーション

眼鏡がきらっと光って目が見えない。「いつも建前の顔」を作るコマ。

| ファイル名 | 使いどころ | 差分プロンプト |
|---|---|---|
| `kotosan-pose-glare-v1` | 既存・基本 | （手元のものを使う） |
| `kotosan-pose-glare-v2` | 机ごしの正面。カット2の標準 | **生成済**（2026-09-23・机テラコッタ・基準どおり） |
| `kotosan-pose-glare-desk-v1` | 同上の旧版 | **使わない**（机がクリームで他カットと揃わない） |
| `kotosan-pose-glare-turn-v1` | 背後から声をかけられた回（金曜の「ちょっといい？」） | 下 ①（**未生成**。①で出したら正面になった） |
| `kotosan-pose-glare-lean-v1` | 「承知しました〜」と受ける回 | 下 ② |
| `kotosan-plain-glare-v1` | 既存・無地 | （手元のものを使う） |
| `kotosan-plain-glare-bow-v1` | 無地・会釈する回 | 下 ③ |

**① 椅子ごと半身で振り返る**
```
Pose: the character is seated on the clay office chair and has turned its upper body halfway toward the camera, as if answering someone who called from behind. Both round wire lenses catch the light in a flat bright glare, so the eyes are not visible. One short arm still rests on the desk, the other hangs at its side. The ID badge has swung slightly with the turn.
```

**② 膝に腕を揃えて少し前のめり**
```
Pose: the character is seated on the clay office chair, facing the camera, leaning very slightly forward with both short round arms placed neatly together in front of its body. Both round wire lenses catch the light in a flat bright glare, so the eyes are not visible. The drawstring at the top is pulled snug and the two wooden beads hang straight down.
```

**③ 無地・小さく会釈**
```
Pose: the character stands facing the camera and tips its whole body forward in a small polite bow, one short round arm lifted slightly. Both round wire lenses catch the light in a flat bright glare, so the eyes are not visible. The ID badge swings forward a little away from the body.
```

---

## 5. カット3（飲み込んだ本音）— lookdown のバリエーション

うつむく・体を傾ける。目は見える（飲み込む側の顔）。

| ファイル名 | 使いどころ | 差分プロンプト |
|---|---|---|
| `kotosan-pose-lookdown-v1` | 既存・基本 | （手元のものを使う） |
| `kotosan-pose-lookdown-tilt-v1` | 角度違い・同じ回を続けて出す週に | **生成済**（2026-09-22・机はテラコッタ） |
| `kotosan-pose-back-window-v1` | 理不尽を受け流す回（設定書§9） | 下 ⑤ |
| `kotosan-plain-lookdown-v1` | 既存・無地 | （手元のものを使う） |
| `kotosan-plain-lookdown-badge-v1` | 人間関係・恋愛の回 | 下 ⑥ |

**④ 机の一点を見て、体を右に傾ける**
```
Pose: the character is seated on the clay office chair, head lowered, its whole body tilted to its right, looking down at one spot on the desk. The matte black embroidered eyes are clearly visible below the wire glasses, no glare on the lenses. Both short round arms hang loose. The drawstring is pulled tight and the two wooden beads have swung to one side.
```

**⑤ 窓の外を見る後ろ姿**
```
Pose: the character is seen from behind, standing and facing a small clay window set into the plain beige wall, looking outside. Only the back of the pouch body, the gathered top, the terracotta drawstring and the two wooden beads are visible; the face is not. The thin terracotta badge cord is visible around the back of its neck. The window is a plain clay frame with soft pale daylight beyond it, no view details, no scenery.
```
> ⑤ だけは §3 の場面セットを使わず、この文が背景も兼ねる。

**⑥ 無地・社員証のひもを指先で触ってうつむく**
```
Pose: the character stands facing the camera, head lowered, and one short round arm is raised just enough to touch the thin terracotta cord of its ID badge. The matte black embroidered eyes are clearly visible below the wire glasses, no glare on the lenses. The body leans very slightly to its left. The other arm hangs still.
```

---

## 6. カット4・5（ごくん／救い）

### puff — 「（ごくん）」の瞬間

体がまんまるにふくらみ、ひもがぎゅっと締まる。**シリーズの目印なので、ここだけは崩さない**。

| ファイル名 | 使いどころ | 差分プロンプト |
|---|---|---|
| `kotosan-pose-puff-eyes-v1` | 既存・基本（目が見える） | （手元のものを使う） |
| `kotosan-pose-puff-side-v1` | 真横から。ふくらみが一番分かる | **要再生成**（眼鏡が銀色。机はテラコッタ） |
| `kotosan-plain-puff-low-v1` | 無地・下から見上げる | 下 ⑧ |
| `kotosan-pose-puff-badge-v1` | ふくらみで社員証が押し出される | 下 ⑨ |

**⑦ 真横からのふくらみ**
```
Pose: the character is seen from its side, seated on the clay office chair. Its pouch body has swollen into a round ball, clearly wider than in the reference, and the gathered top is cinched shut hard so the terracotta drawstring bites into the fabric and the two wooden beads stick out sideways. The short round arms are pushed away from the body by the swelling. One matte black embroidered eye is visible in profile behind the wire glasses, no glare.
```

**⑧ 無地・見上げる角度**
```
Pose: the character stands alone and its pouch body has swollen into a round ball, clearly wider than in the reference, with the gathered top cinched shut hard and the terracotta drawstring biting into the fabric. Both matte black embroidered eyes are visible behind the wire glasses, no glare. Camera is slightly below the character, looking up, so the round body fills the lower two thirds of the frame.
```
> ⑧ はフッタの `at desk eye level` を `from slightly below the character` に差し替える。

**⑨ 社員証が押し出される**
```
Pose: the character faces the camera, seated, and its pouch body has swollen into a round ball, clearly wider than in the reference. The swelling pushes the cream felt ID badge outward and tilts it further off-center, and its thin terracotta cord is pulled taut. The gathered top is cinched shut hard, the two wooden beads pressed against the fabric. Both matte black embroidered eyes are visible behind the wire glasses, no glare.
```

### mug — 救いのコマ（重さのある回のみ）

ひもが少しゆるむ。**軽い回に足さない**（笑いが死ぬ。設定書§6）。

| ファイル名 | 使いどころ | 差分プロンプト |
|---|---|---|
| `kotosan-pose-mug-v1` | 既存・基本 | （手元のものを使う） |
| `kotosan-plain-mug-loose-v1` | 金曜の夜・休日前。ひもが一番ゆるむ回 | 下 ⑩ |
| `kotosan-plain-cushion-v1` | 恋愛・家族の回の救い | 下 ⑪ |

**⑩ ひもがゆるんで、両腕でマグを抱える**
```
Pose: the character stands holding a small clay mug against its body with both short round arms. The gathered top is noticeably looser than in the reference: the terracotta drawstring is slack, the gather has opened a little, and the two wooden beads hang low and apart. The body is slightly softer and less round. Both matte black embroidered eyes are visible behind the wire glasses, no glare. Faint steam is not needed.
```

**⑪ 小さな座布団に座って、ひもの端を持つ**
```
Pose: the character sits on a small square clay floor cushion, its flat base settled into it, one short round arm resting on the cushion and the other holding the loose end of its own terracotta drawstring. The gathered top is slack and the two wooden beads hang low. Both matte black embroidered eyes are visible behind the wire glasses, no glare. A small clay mug sits on the floor beside the cushion.
```

---

## 7. 出てきた画像のチェック（全ポーズ共通）

通らなかったら**採用しない**。修正を重ねるより、新しいメッセージで作り直すほうが速い。

- [ ] **口が無い**（生成AIは口を足したがる。最頻出の事故）
- [ ] 目が**縦長の楕円・マットな黒・少し左右不揃い**。ツヤ目・丸目になっていない
- [ ] 眼鏡が**細い丸眼鏡でゴールド**（基準絵どおり・2026-09-22 ふうか決裁。銀色で出たら作り直す）
- [ ] 社員証が**クリーム色のフェルト＋中央に小さなくすみブルーの四角**（基準絵どおり）。文字・ロゴは無い
- [ ] ことさんだけ**ふわふわのループ生地**。粘土になっていない
- [ ] 背景・小物は**全部クレイ**。指紋・ヘラ跡が見える。写実になっていない
- [ ] 壁が無地の `#F5EEE6`。棚・窓・額縁・手前のぼかしが湧いていない（⑤ の窓を除く）
- [ ] 光が**左上から**。夕焼けのオレンジが入っていない
- [ ] **上3分の1が空いている**（文字を置く）
- [ ] 画面内に文字・数字が無い
- [ ] **同じ回で使う他のカットと、机・椅子の色がそろっている**（基準オフィス画像どおりのテラコッタ）

## 8. 足したら書くところ

1. 設定書§9「画像ファイル一覧」に**ファイル名を追記**（Artifact v1.4 として更新）
2. このファイルの表の「使いどころ」を、実際に使った回で埋める
3. `kotosan-reel.md` §4 の候補リストから、作り終えたものを消す

## 9. 回し方の目安

同じ回で **glare / lookdown / puff を全部そろえて同じセットにしない**。
フレーム単位の一致率を下げるのが目的なので、たとえばこう混ぜる。

| 回 | カット2 | カット3 | カット4 | カット5 |
|---|---|---|---|---|
| #1（社内） | glare-v1 | lookdown-v1 | puff-eyes-v1 | — |
| #2（仕事・金曜） | glare-v2 | lookdown-tilt-v1 | puff-side-v1（要再生成） | — |
| #3（日常） | plain-glare-bow-v1 | plain-lookdown-badge-v1 | plain-puff-low-v1 | — |
| #4（仕事） | glare-lean-v1 | back-window-v1 | puff-badge-v1 | — |
| #5（人間関係） | plain-glare-v1 | plain-lookdown-v1 | plain-puff-low-v1 | — |
| #6（恋愛・救いあり） | glare-v1 | lookdown-tilt-v1 | puff-eyes-v1 | plain-mug-loose-v1 |

**カット1（場面画像）は毎回生成するので、ここは自動的に毎回違う。**

### 場面画像の解像度（2026-09-23 に踏んだ）

**場面画像も 1024×1536 で受け取ること。** 9/23 に 360×540 で渡されたものは
9:16 にすると **356% の拡大**になり、ループ生地のふわふわが潰れて明らかに眠い絵になった
（ポーズ画像は 125〜177% で保っている）。**1カット目は3秒の勝負どころ**なので、
ここが一番ボケてはいけない。プレビューではなく生成物の原寸を貼ってもらう。

生成済みの場面：`kotosan-scene-meeting-v1`（会議・同僚は顔のないクレイ人形）
