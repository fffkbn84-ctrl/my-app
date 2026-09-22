# IGリール制作キット 2026-09-22（火）20:00｜連載第2週・`l2-alone`

> 型の正は `docs/sns/series/kinda-pair-28.md`（「形式：2026-09-20 に カルーセル → リール へ変更」の表）。
> 版面とスクリプトの正は `docs/sns/series/nyuguchi-reel.md` §2-§4（技術仕様として生きている）。

- **枠**：火 20:00 ／ リール ／ 5カット ／ 1080×1920 ／ 16.5秒前後
- **話題**：`src/lib/pair/topics.ts` の `l2-alone`（層＝**知る**）
- **合否指標**：保存数（補助：3秒視聴継続率）

---

## 0. なぜ第2週を `l2-contact` から差し替えたか（2026-09-22 決定）

連載の並び順（`kinda-pair-28.md`）では第2週は `l2-contact`（連絡の頻度とテンポ）だった。
**だが 9/19（土）の入口リールが、すでに `l2-contact` で出ている。**

| カット | 9/19（投稿済み・リーチ125） | 9/22 の旧案（`packs/2026-09-10-...w01-w02.md`） |
|---|---|---|
| 1 | 連絡って、こまめな方が安心ですか？ | 連絡って、こまめな方が安心ですか？それとも気にしない方ですか？ |
| 2 | 交際中、いちばん行き違いが起きるところです | 交際のはじめに、いちばん行き違いが起きるところです |
| 3 | 相手のやり方を直す話にすると、角が立ちます | 相手のやり方を直す話にすると角が立ちます（以下同旨） |
| 5 | 保存して、会う前に見返してください | 保存して、交際に入ったら見返してください |

文が4/5一致、絵は同じ3枚の使い回し、版面もスタイルも同じ。
**2026-04-30 の IG オリジナリティ規定**（70%以上一致で近似重複・24時間〜30日リーチ低下）に当たる。
9/19 は W27 から4本連続0だったプロフィール遷移が初めて2に動いた回なので、ここで落とすのは惜しい。

旧設計（土曜の入口リールが火曜の連載と同じ話題を開く）は 9/20 に解消したが、
**9/19 と 9/22 のペアだけ旧設計のまま残っていた。** その積み残しの処理。

**対応**：第2週を同じ「知る」層の `l2-alone` に差し替え、`l2-contact` は**第6週（10/20）**へ。
層のローテーション（ふれる→知る→重なる→描く）は崩れない。`kinda-pair-28.md` の表に反映済み。

---

## 1. カット構成（5カット・文字は後載せ）

| # | 秒 | 画面の文字 | 絵 | 版面 |
|---|---|---|---|---|
| 1 | 0〜3.5 | 一人の時間って、／どのくらいあると／落ち着きますか？ | **A**：椅子1脚 | `hook` 58px・ズームなし |
| 2 | 3.5〜7 | 会う頻度の希望が／ずれるときは、／たいていここが理由です | A（ゆっくり寄る） | `body` 48px |
| 3 | 7〜10.5 | 多いほうが良い、／少ないほうが良い、／という話ではありません。／必要な量は、人によって違います | **B**：椅子2脚 | `body` 48px |
| 4 | 10.5〜13.5 | 話題は4つの層に分かれています。／ふれる、知る、重なる、描く。／これは「知る」の層です。／考え方や、人との付き合い方。 | **なし**（文字のみ） | `body` 48px |
| 5 | 13.5〜16.5 | 話題は全部で28あります。／聞き方の例文も公開しています。／保存して、会う前に／見返してください。 | **固定**：カードの束（28週使い回し） | `body` 48px |

- 1カット目は `topics.ts` の `ask` を**そのまま**（新しく考えない）。これが連載の中核
- 4カット目は毎週この4行（`kinda-pair-28.md`「4枚目の書き方」）。**4つの層名を必ずそろえて並べる**
- 1行の上限：1カット目 **12字**、2カット目以降 **16字**

### JSON（そのままコマンドに渡す）

```bash
python3 prep.py <A.png> reel-A.png 340 680 1080 1920
python3 prep.py <B.png> reel-B.png 340 680 1080 1920
python3 prep.py <カードの束.png> reel-C.png 340 680 1080 1920

NODE_PATH=$(npm root -g) node render-reel.js hook reel-A.png f1.png '["一人の時間って、","どのくらいあると","落ち着きますか？"]'
NODE_PATH=$(npm root -g) node render-reel.js body reel-A.png f2.png '["会う頻度の希望が","ずれるときは、","たいていここが理由です"]'
NODE_PATH=$(npm root -g) node render-reel.js body reel-B.png f3.png '["多いほうが良い、","少ないほうが良い、","という話ではありません。","必要な量は、人によって違います"]'
NODE_PATH=$(npm root -g) node render-reel.js body none      f4.png '["話題は4つの層に分かれています。","ふれる、知る、重なる、描く。","これは「知る」の層です。","考え方や、人との付き合い方。"]'
NODE_PATH=$(npm root -g) node render-reel.js body reel-C.png f5.png '["話題は全部で28あります。","聞き方の例文も公開しています。","保存して、会う前に","見返してください。"]'

python3 build_reel.py pair kinda-ig-reel-2026-09-22.mp4   # 5カット・16.5秒・クロスディゾルブ0.4
```

- **カバーは `f1.png` を手動指定**（IG に選ばせると中間フレームが選ばれ、グリッドに質問が出ない）
- **無音で投稿しない。** 音楽は IG 側で足す（ピアノかアコースティック・音量控えめ・歌詞なし）

---

## 2. 画像プロンプト（新規生成は2枚）

共通テンプレートは `docs/sns/series/iinikui-kimochi.md` §1 のもの。**テンプレートは変えない。**

```
A single small handmade clay object, photographed completely alone on a flat,
seamless warm beige background (#F5EEE6) — no room, no walls, no floor line,
no display base, no table, no background scenery, no extra props.
【SCENE】
Matte air-dry clay texture with visible fingerprints and subtle seams, rounded
soft forms, small gentle imperfections. Soft warm diffused light from the upper
left, one soft shadow falling to the lower right. Slightly elevated
three-quarter camera angle, shallow depth of field, miniature photography look.
Muted palette: warm beige and soft off-white, with dusty rose / terracotta
(#D4A090) as the only accent color. No people, no faces, no hands, no figures.
No text, no letters, no numbers, no logos. No gold, no brass, no metallic parts.
The object is SMALL and sits in the middle of the frame — leave generous empty
beige space on all four sides. Square 1:1 composition.
```

### A（カット1・2）— `【SCENE】`

```
One tiny clay armchair with a softly rounded back and a small cushion, standing
by itself and turned slightly toward the viewer, quiet and comfortable, with
nobody in it.
```

### B（カット3）— `【SCENE】`

**A と同じスレッドで続けて生成し、下の1行を必ず足す。**

```
Two tiny clay armchairs of exactly the same shape and the same size, placed side
by side at the same angle with an equal gap between them, both turned toward the
viewer, neither one placed in front of the other — the two are given exactly the
same weight.
```

```
Keep exactly the same clay texture, the same object scale, the same camera angle, the same light direction and the same background as the previous image. Only the object itself changes.
```

- 「1脚 → 同じ椅子2脚」で、**同じ物の数の変化**にしてある（絵が散らないため・`nyuguchi-reel.md` §3）
- **2脚は対等に。** 片方が手前・大きいと、3カット目の「良し悪しはありません」と絵が矛盾する
- **砂時計・時計の類は使わない。** 時間の量を表せるが、婚活の文脈では「残り時間」に読め、
  CLAUDE.md §3 の「焦らせない」に触れる

### 再生成の基準

文字・数字・ロゴが入った／人・顔・手が入った／星・チェック・グラフなど評価を連想させる小物が入った／
モチーフが大きすぎる／台座・床・壁・情景が写った／金属色が出た

### 5カット目

**28週使い回しの固定画像（伏せ札と表札が混ざったカードの束）。生成不要。**
ふうかさんの手元にある PNG をそのまま貼る。

---

## 3. キャプション（IG）

```
会いたい回数が合わないと、気持ちの差だと思ってしまうことがあります。
たいていは、一人の時間がどれだけ必要かの違いです。

話題は全部で28あります。聞き方の例文もそのまま公開しています。
kinda.jp/kinda-pair/topics
```

ハッシュタグ：`#結婚相談所 #婚活 #仮交際 #婚活中の人と繋がりたい #結婚相談所選び`

---

## 4. X（同日 21:30・同じ話題）

```
結婚相談所の交際で、会う頻度の希望がずれることがある。
たいていは気持ちの差ではなく、一人の時間がどれだけ必要かの違いで、
そこを先に聞いておくと、回数の話が責める話にならずに済むと思う。

一人の時間って、どのくらいあると落ち着きますか？
```

### セルフリプ（本編の直後にぶら下げる・2本とも文を書く）

**リンクだけ貼らない。** 何のページか分からないものは開かれない。1〜2行添えて、
**リンクは最終行に単独で置く**（本文と同じ行に混ぜない）。

セルフリプ1
```
この話題を含めて、28個ぜんぶ公開しています。そのまま口に出せる聞き方の例文つきです。

https://kinda.jp/kinda-pair/topics
```

セルフリプ2
```
会う相手が複数いる時期は、一人の時間から先に削れていく。
その疲れの正体を、カレンダーの側から書いたものです。

https://kinda.jp/columns/weather-windy-sunshine-fukusu-kosai
```

> セルフリプ2は当初 `columns/omiai-kaiwa-wadai`（お見合いの会話）を充てていたが、
> 今週の話題は交際中の「一人の時間の量」なので、複数交際の消耗を扱う
> `weather-windy-sunshine-fukusu-kosai` に変えた。相談所の交際は並行が標準（CLAUDE.md §5）で、
> 一人の時間が削れる場面として直結する。
>
> ⚠️ それでも **「会う頻度・一人の時間」に正面から当たるコラムは38本の中に無い。**
> 9/29 の「住む場所」と同じく、コラムの空きとして記録済み（`sns-operations-2026-09.md` §10）

---

## 5. セルフQA（出す前に読む）

- [ ] 1カット目が `topics.ts` の `ask` と1文字も違わない
- [ ] 層の4行が `PAIR_LAYERS` の文言と一致（知る＝考え方や、人との付き合い方。）
- [ ] 「ふれる」など層名を単独で大きく置いていない（4語そろえて並べている）
- [ ] 点数・％・ランキング・相性スコアが無い／「診断」「相性」「運命」「絆」「特別」を使っていない
- [ ] 「進んでいる／遅れている」と読める語が無い（層は進捗ではなく深さ）
- [ ] 絵文字なし／煽りなし／比較なし
- [ ] 9/19・9/20 のリールと**絵も文も重なっていない**（近似重複の回避がこの回の主目的）
- [ ] カバーに `f1.png` を指定した／音楽を足した
