# IGリール制作キット 2026-10-06（火）20:00｜連載第4週・`l4-children`（A vs B 比較 5選）

> 2026-10-06 ふうか決裁で、予定していた保存版カード回（`2026-10-06-ig-reel-l4-children.md`）から切り替えた。
> 参考は @koarasan_genkai の「A vs B 比較 N選」（左右分割・①項目・下に「A：…／B：…」の2行）。概念だけ取る。実写・動画化はしない。

- **題の帯**：子どものこと　聞く側 vs 聞かれる側 5選
- **左右の札**：左「聞く側」／右「聞かれる側」（性別を決めない・上下のつかない軸）
- **画像**：5枚（1項目1枚・左右2場面のクレイ）
- **見る数字**：保存・送信・平均再生（比べる相手：第2週・第3週はいずれも平均再生1秒・保存0・送信0）
- **カット割り・プロンプト**：ふうかさんが参考リールの流れを送ってから決める

## 5項目（文案・トーン確認待ち）

| # | 項目 | 聞く側 | 聞かれる側 |
|---|---|---|---|
| ① | 切り出すタイミング | いつ聞けばいいか、ずっと探している | いつ聞かれるか、少し身構えている |
| ② | 最初のひとこと | 「欲しい？」は重い気がして言えない | 「どう考えてる？」なら答えやすい |
| ③ | 自分の考え | 先に自分の考えを置くと、聞きやすい | 先に言ってもらえると、話しやすい |
| ④ | 「まだ決めていない」 | 答えがないのも、答えのひとつ | 決めていないと言えて、ほっとする |
| ⑤ | 話したあと | 一回で全部聞かなくていい | また話せると思えると、楽になる |

- 「欲しい派 vs 欲しくない派」にはしない（判定になる・pair の不変則）
- 子どもを持つ前提にしない（④で「決めていない」を答えとして置く）

## 参考リールの分解（@koarasan_genkai「20代で出産vs30代で出産 8選」・2026-10-06）

- 全カット同じ版面：上に**題の帯**（灰色半透明・明朝）／左右上に**札**（太字・色の光彩）／**縦の白線**で左右に分割
- 中央に**白い箱**（手書き風・統計3行）→ 大きな **「①項目」**（白・太・影）→ **濃い灰の角丸に2行**「20代：…／30代：…」
- **同じ人物が全カットに出る**（20代＝金髪ポニーテール、30代＝ショートボブ）
- 感情はステッカー（汗・きらきら・HAHA・いいね）で足す
- 導入カットなしで**いきなり①**。カットはパッと切り替え

## うちでの置き換え

| 向こう | うち | 理由 |
|---|---|---|
| ピンク／青の札 | **ダスティローズ／セージ** | ピンクと青は性別に読める |
| 統計の箱 | **「言ってみるなら」の箱**（そのまま口に出せる1文） | 保存の理由になる。統計は軸に合わない |
| 絵文字ステッカー | **クレイで作った汗・きらきら**を画像に描かせる | 絵文字なし |
| 実写の人 | **同じクレイの2体**を全カットに出す（2枚目以降は1枚目を添付して生成） | 実写にしない |
| 太いゴシック | Shippori Mincho（項目だけ太い字） | ブランドの書体 |
| 最後の自社宣伝 | **置かない**（⑤で終わる） | ふうか判断 |

## カット割り（1080×1920・5カット・各3.0秒・計15秒・切り替えはカット・ズームなし）

| # | 項目 | 言ってみるなら |
|---|---|---|
| ① | 切り出すタイミング | 「今度、先のことも少し話せたらうれしい」 |
| ② | 最初のひとこと | 「子どものことは、どんなふうに考えていますか？」 |
| ③ | 自分の考え | 「わたしはまだ迷ってる。あなたは？」 |
| ④ | 「まだ決めていない」 | 「決めていないのも、ちゃんと答えだと思う」 |
| ⑤ | 話したあと | 「また、話そうね」 |

②は `topics.ts` の `ask` そのまま。カバーは①。

## 画像プロンプト（ChatGPT・2:3 縦・5枚）

共通テンプレート＋【SCENE】。2枚目以降は**1枚目を添付**して「Use the attached image as the character reference」を先頭に足す。

```
A handmade miniature clay diorama, vertical 2:3. Split-screen diptych: the left half
and the right half are two separate small scenes placed side by side, divided
exactly at the vertical center. Each half shows ONE clay figure, large, from the
waist up, facing slightly toward the center, so the two figures seem to face
each other across the split.

Characters (keep identical in every image):
- LEFT figure: soft round clay person, short wavy light-brown hair, dusty rose /
  terracotta (#D4A090) knit sweater, cream trousers.
- RIGHT figure: soft round clay person, short straight dark-brown hair, muted
  sage green cardigan over a cream shirt.
Both are gender-neutral adults, simple dot eyes, small expressive mouths.

【SCENE】

Faces between 20% and 50% from the top. Keep the top 12% and the bottom 30% calm
(plain background or tabletop) because text will be placed there later.
Small emotion marks (sweat drops, sparkles) are sculpted from clay, not drawn.
Matte air-dry clay with fingerprints, soft rounded forms, soft light from the
upper left, warm beige (#F5EEE6) base palette. No text, no letters, no numbers,
no logos, no gold, no metallic parts, no children, no babies.
```

| # | 【SCENE】 |
|---|---|
| ① | Both halves are the same small café. LEFT: the figure holds a cup and glances sideways at the center, a clay sweat drop beside the head, waiting for the right moment. RIGHT: the figure sits upright, both hands around a cup, shoulders a little stiff, eyes slightly wide, bracing. |
| ② | Both halves are an evening street with soft lamps. LEFT: the figure has opened the mouth to speak, one hand half raised, hesitating. RIGHT: the figure has turned toward the center with a gentle curious face, eyebrows slightly raised. |
| ③ | Both halves are a park bench under a tree. LEFT: the figure speaks with one hand on the chest, calm and honest face. RIGHT: the figure listens, shoulders relaxed, small soft smile, a tiny clay sparkle near the head. |
| ④ | Both halves are a quiet dining table at night with a small lamp. LEFT: the figure nods slowly with a kind, unhurried face. RIGHT: the figure exhales in relief, hands open on the table, two tiny clay sparkles near the head. |
| ⑤ | Both halves are a station ticket gate in the evening. LEFT: the figure waves goodbye, looking back over the shoulder, relaxed smile. RIGHT: the figure waves back while walking away, light and easy, a small clay sparkle. |

再生成の基準：文字・数字が出た／2体の髪・服が前の枚と違う／子どもや赤ちゃんが出た／顔が下 30% に入った

## 決定：人形ではなく「ふたり」の2体を使う（2026-10-06）

ふうかさんが ChatGPT で人間型のクレイ（カフェ①の試作）と「ふたり」の2体を並べて比べた → **「ふたり」の2体を使う**（Claude 推奨）。
- 人間型は髪型と服で性別に読めた（左が女性・右が男性に見える）。非人間のキャラなら性別が付かない
- 連載・ふたりシリーズで同じ2体が出続ける＝参考アカウントの「毎回同じ人が出る」をそのまま取れる
- 配役：**聞く側＝A（ダスティローズのくま・手帳とスカーフ）**／**聞かれる側＝B（クリーム・緑のニット帽・眠そうな目）**
- 5枚とも、ふたりの設定画を添付して生成する。プロンプトの Characters ブロックを下に差し替える

```
Use the attached image as the character reference: the exact same two handmade
fleece plush characters (same colors, fabric, stitches, scarf, notebook, beanie, sizes).
- LEFT half: Character A, the dusty rose (#D4A090) bear-eared one with the cream
  scarf and tiny notebook.
- RIGHT half: Character B, the oatmeal cream one with the floppy sage green beanie
  and half-closed relaxed eyes.
Embroidered eyes and mouth only; emotion is shown by posture and by small
felt/fleece marks (sweat drops, sparkles), not by drawn symbols.
```

## 書き出し（2026-10-06）

- 画像：`docs/sns/assets/vs/l4c-1〜5.jpg`（①カフェ ②夜道 ③公園 ④夜のテーブル ⑤改札）。全部初回生成で採用
  - ④のランプが金色（「no gold」違反）。小さく、文字の下になるのでそのまま使った
  - 画像の中に白い縦線が描かれていたが、スクリプトの中央線（x=537・6px）で上から覆った
- `render-vs.js`（新規）＋ `build_reel.py vs5`（新規・5×3.0秒・0.05秒でつなぐ）＝ 14.8秒
- 文字の正：`tools/ig-carousel/vs-l4c.json`
- 画像は幅1080に合わせて y=155 から置いた（全面に敷くと左右が8%切れ、①のくまの腕が欠ける）
- カバーは書き出した①（f1）

## キャプション

```
子どものことを話すとき、聞く側も、聞かれる側も、少し構えています。
言ってみるなら、の一文だけでも、保存しておいてください。

連載「ふたりの話題、ひとつずつ」第4週。

#婚活 #結婚相談所 #将来の話 #カップル #恋愛
```

## 速報（投稿14時間後・10/7 ふうか共有。正式な計測は 10/9）

| 閲覧 | リーチ | 3秒残存 | スキップ | 平均再生／尺 | いいね・保存・送信 | リールタブ・発見 |
|---|---|---|---|---|---|---|
| 120 | 113 | 18% | 82.3% | 2／14秒 | 0・0・0 | 66.7%・33.3% |

年齢：18〜24 40.8%／25〜34 40.8%／35〜44 11.7%／45〜54 5%。

- 第2・3週（3秒残存 6%・平均1秒）よりは上。ただし同じ時間帯のぎっしり#1（2時間で 54%）とは比べものにならない
- 読み（仮）：1カット目が「題の帯＋左右の札＋①の項目＋2行の箱」で**読むものが多い**。ぎっしりは「絵を眺める」だけで止まる
- 10/9 の正式な数字で、連載の標準にするかを決める。いまの線では標準にしない見込み
