# 季節ビジュアル運用（サイトヒーロー / X ヘッダー）

> トップのヒーローと X のヘッダーを、季節に合わせて差し替えるための正。
> 「今季のに替えたい」と言われたら、まずこのファイルを読む。毎回ゼロから考えない。

---

## 1. コード側の正

季節の切り替えは **`src/lib/season.ts` の `CURRENT_SEASON` を 1 行変えるだけ**。
トップのヒーロー（`src/app/page.tsx`）と LCP preload（`src/app/layout.tsx`）が同時に追従する。

```ts
export const CURRENT_SEASON: SeasonKey = "summer"; // ← ここだけ変える
```

**画像を `public/images/` に置いてから切り替えること。**
存在しないパスを指すと、ヒーロー本体と preload の両方が 404 になる。

| season | モバイル（2:3） | PC（16:9） |
|---|---|---|
| `summer` | `hero-couple-2026ss.webp` | `hero-couple-2026ss-pc.webp` |
| `autumn` | `hero-couple-2026aw.webp` | `hero-couple-2026aw-pc.webp` |
| `halloween` | `hero-couple-2026hw.webp` | `hero-couple-2026hw-pc.webp` |

命名規則：`hero-couple-<season>{,-pc}.webp`

---

## 2. サイズ規格

| 用途 | 最終サイズ | 生成サイズ（ChatGPT）| 後処理 |
|---|---|---|---|
| ヒーロー モバイル | 1024×1536（2:3 縦長）| 1024×1536 でそのまま | WebP 変換のみ |
| ヒーロー PC | 1672×941（16:9 横長）| 1536×1024（3:2 横長）| **上を足して** 16:9 にする → WebP（下記 §4-2）|
| X ヘッダー | 1500×500（3:1）| 1536×1024（3:2 横長）| 中央帯を 3:1 に切り出し → PNG/JPG |

- **WebP 変換は必須**（CLAUDE.md §4）。ファーストビュー画像なので `priority` / preload 済み。
- トリムと WebP 変換は Claude Code 側でやる。**生成した PNG をそのままチャットに貼ればよい。**

---

## 3. 年間の切り替え予定

| 時期 | `CURRENT_SEASON` |
|---|---|
| 〜9月中旬 | `summer` |
| 9月下旬〜9月末 | `autumn` |
| 10月（頭〜10/31）| `halloween` |
| 11月〜 | `autumn` に戻す |
| 12月〜 | 冬を別途用意（`winter` を `season.ts` に追加）|

ハロウィーンは 10 月に入ってから。9 月下旬に出すと早すぎて「急かしている」印象になる。

---

## 4. 画像の不変則（全季節共通）

CLAUDE.md §3・§4 の適用。生成プロンプトを書き換えるときも、ここは外さない。

- **ミニチュアクレイ（粘土）風**。柔らかいマット質感、丸み、やわらかい影。光は上から柔らかく差す
- 余白・空・地面のベースは **ウォームベージュ `#F5EEE6`** に寄せる。アクセントは `#D4A090`（ダスティローズ／テラコッタ系）
- **旧ゴールド `#C8A97A` の「スタイリッシュ／高級感」路線は使わない**
- **ふたりの性別を指定しない。** 「異性」「男女」を前提にしない（§3 LGBTQ+ 包摂）。プロンプトでは "two small clay figures" とだけ書く
- 画像内の文字は**左上のシールの 2 行だけ**。それ以外に文字・ロゴを入れない
  - 1 行目：季節の英字（`Summer` / `Autumn` / `Halloween`）
  - 2 行目：`季節とともに、気持ちは変わる。`
- **絵文字を使わない**
- こわい・騒がしいハロウィーン表現（おばけ、コウモリ、毒々しい紫、ホラー調）は使わない。**かぼちゃの灯りと落ち葉まで**

### 構図上の制約（重要）

#### 4-2. 表示枠で切られる量（2026-09-22 に実際に踏んだ落とし穴）

**生成された 3:2 をそのまま PC に置くと、シールの「Autumn」の行とふたりの下半身が切れる。**

PC のヒーローは `min-height: 86vh` + `object-fit: cover`。1440×800 の画面だと枠は 1440×688（約 2.09:1）で、
- **16:9（1.78）の画像** … 上下 **7.5% ずつ** 切られる
- **3:2（1.50）の画像** … 上下 **14% ずつ** 切られる ← これで欠けた

モバイルも `aspect-ratio: 1024/1536` に `max-height: 64svh` が効くので、上 2%・下 5% ほど切られる。
さらに `::after` で**下端 14% にベージュのフェード**が乗るため、ふたりをそこに置くと下半身が白く飛ぶ。

**安全域（最終画像の中での位置）：**

| 要素 | 収める範囲 |
|---|---|
| シールの上端 | 上から **12% より下** |
| シールの左端 | 左から **15% より右** ← 2026-09-22 に追記（下記）|
| ふたりの下端 | 上から **88% より上**（モバイルは下端フェードがあるので **85% より上**が安全）|
| ふたり・シールの右端 | PC は **左 38% 以内**（右 62% はオーバーレイ）|

#### 横も切られる（2026-09-22 に踏んだ2つめの落とし穴）

上下だけ見ていて**横を見落とし、本番でシールの「Autumn」が左に切れた。**

PC の枠は `幅 / (0.86 × 画面高)`。これが画像の比率 1.778 を**下回ると、左右が切られる**
（上回るときは上下が切られる。どちらか一方しか起きない）。

| 枠の比率 | 切られる量 |
|---|---|
| 2.07（1920×1080）| 上下 7.7% ずつ |
| 1.86（1440×900）| 上下 2.2% ずつ |
| 1.60 | **左右 5.0% ずつ** |
| 1.50（縦に長いウィンドウ）| **左右 7.8% ずつ** |
| 1.40 | **左右 10.6% ずつ** |

**右パディングを足すと絵全体が左に寄る。** 前回 480px 足して絵の占有率が 76% になり、
「中央が空いて左に寄っている」状態になっていた。

**そこで上パディングをやめ、シールを下に移して縦の安全域を確保する。**
上パディングが 0 なら右パディングは 284px で済み、占有率が 84% に上がって全体が中央寄りになる
（`H×16/9 − W` が必要な右パディング。上を足すほど右も増える）。

シールは画像の中で**自由に動かせる**（背後が平坦なベージュ空なので、消して貼り直せる）。
縦位置はパディングで稼がず、シールを動かして合わせるほうが構図を壊さない。

**3:2 で生成されてしまったら、上下を切らずに「右に余白」を足して 16:9 にする。**
右に足した分はオーバーレイの下に隠れるので見えない。切ると主役が消える。
ただし足しすぎると絵が左に寄るので、**上パディングは使わず、シールを動かして縦位置を合わせる。**


- **モバイル（2:3）**：シールは**左上**。ふたりは**下 1/3**。上半分は空／抜けで、ロゴとヘッダーに干渉させない
- **PC（16:9）**：右 62% にベージュのグラデーションオーバーレイがコードで乗る。
  **シールとふたりは左 38% に収める**。右側は抜けにしておく（テキストが乗る）

---

## 5. 生成プロンプト

### 5-1. ヒーロー モバイル（秋 / 2:3 縦長 1024×1536）

```
A miniature clay (polymer clay / claymation) diorama, soft matte texture, rounded
shapes, gentle soft shadows, warm light falling softly from above.

Scene: an autumn tree-lined path in a tiny clay village. Warm ochre, terracotta and
dusty rose foliage. Fallen leaves scattered on a pale sand-beige path. A few tiny
acorns and a small clay bench at the edge. Soft pale warm-beige (#F5EEE6) sky filling
the upper half, hazy and empty.

Two small clay figures sit side by side on the path in the lower third of the frame,
seen from a little distance, calm and quiet, looking at the leaves. Do not make their
genders explicit. No other people.

Top-left corner: a soft translucent muted-terracotta circular sticker with thin
handwritten white text, two lines:
"Autumn"
"季節とともに、気持ちは変わる。"

Portrait 2:3 composition. Keep the entire upper half open and empty. No other text,
no logos, no emoji, no watermark. Soft, warm, healing atmosphere.
```

### 5-2. ヒーロー PC（秋 / 横長 → 16:9 に切り出し）

```
A miniature clay (polymer clay / claymation) diorama, soft matte texture, rounded
shapes, gentle soft shadows, warm light falling softly from above.

Scene: a wide autumn tree-lined path in a tiny clay village. Warm ochre, terracotta
and dusty rose foliage on the LEFT side of the frame. Fallen leaves on a pale
sand-beige path. Soft pale warm-beige (#F5EEE6) sky.

Two small clay figures sit side by side in the LEFT THIRD of the frame, calm and
quiet. Do not make their genders explicit. No other people.

The RIGHT 60% of the frame must stay almost empty: just soft hazy warm-beige sky and
ground, no objects, no detail — it will be covered by a text overlay.

Top-left corner: a soft translucent muted-terracotta circular sticker with thin
handwritten white text, two lines:
"Autumn"
"季節とともに、気持ちは変わる。"

Wide landscape composition. No other text, no logos, no emoji, no watermark.
Soft, warm, healing atmosphere.
```

### 5-3. ハロウィーン差分（10 月・上記 5-1 / 5-2 の Scene 段落を差し替え）

```
Scene: the same autumn clay village path at soft dusk. A few small round clay
pumpkins with a warm gentle glow inside sit along the edge of the path among fallen
leaves. Warm ochre, terracotta and dusty rose foliage. Sky in soft warm beige fading
to a gentle dusty-rose dusk.

No ghosts, no bats, no spiderwebs, no purple, nothing scary. Quiet and warm, not
festive or noisy.
```

シールの 1 行目を `Halloween` に変える。2 行目は据え置き。

### 5-4. X ヘッダー（1500×500 / 3:1）

X は横長の帯で、**上下がデバイスによって切れる**。文字は入れない（プロフィール欄と二重になる）。

```
A miniature clay (polymer clay / claymation) diorama photographed as a wide panoramic
banner. Soft matte texture, rounded shapes, gentle soft shadows, warm light falling
softly from above.

Scene: a long autumn tree-lined path stretching horizontally across a tiny clay
village. Warm ochre, terracotta and dusty rose foliage. Fallen leaves scattered on a
pale sand-beige path. Soft pale warm-beige (#F5EEE6) sky.

Two small clay figures walk side by side, small in the frame, placed slightly RIGHT
of center. Do not make their genders explicit. No other people.

Keep the far LEFT quarter simple and uncluttered — soft ground and sky only.
Keep the composition centered in a narrow horizontal band; the top and bottom edges
will be cropped.

No text, no sticker, no logos, no emoji, no watermark. Calm, warm, spacious.
```

**セーフエリア：**
- X のプロフィールアイコンが**左下に丸く重なる**（およそ左端から 200px・下端から 100px の範囲）。ここに主役を置かない
- 上下は端末によって切れる。**中央の縦 60% に収める**

**保存場所：** 生成・切り出し後の画像は `docs/sns/assets/x-header-<season>.png` に置く
（例：`docs/sns/assets/x-header-autumn.png`）。X への反映は手動アップロード。

---

## 6. 差し替え手順（まとめ）

1. 上記プロンプトで ChatGPT に 3 枚生成（ヒーロー モバイル / ヒーロー PC / X ヘッダー）
2. PNG をそのままチャットに貼る
3. Claude Code 側で §4-2 の安全域を確認し、余白足し・WebP 変換・`public/images/` と `docs/sns/assets/` に配置
   （モバイルは LCP 画像なので WebP quality 80 前後・100KB 以下を目安にする）
4. `src/lib/season.ts` の `CURRENT_SEASON` を切り替え
5. コミット。**tip コミットに `src/` の変更を含める**（docs だけが tip だと Vercel 本番ビルドがスキップされる。CLAUDE.md §10）
6. 本番デプロイ後、実機でファーストビューを確認
7. X ヘッダーは X の設定画面から手動アップロード
8. **X で告知する**（§7）。**IG には出さない**（§7）

---

## 7. SNS での扱い（2026-09-22 確定）

### X：告知する

季節を変えたら X に1本出す。画像は **PC 版（16:9）** を添付する。X のタイムラインは横長が切れずに出る。

書き方の線：

- **「なぜ絵を変えるのか」まで書く。** 「秋にしました」＋シールの言葉だけだと、読む側に「で？」が残る
- 婚活・結婚・成婚の語を入れない（ブランドコピーなので CLAUDE.md §2 の線）
- 絵文字なし。「相手」「ふたり」で書く
- URL は 23 字換算。本文＋URL で 140 字に収める

**2026-09-22 秋（実際に投稿したもの・119字）:**

```
サイトの絵を、秋にしました。

夏は海辺で本を読んでいたふたりが、いまは落ち葉の道に並んで座っています。

同じ絵をずっと置いておかないのは、季節とともに気持ちも変わるから。
変わっていいものとして、置いておきたくて。

kinda.jp
```

### IG：出さない

**季節ビジュアルの更新を IG に投稿しない。** 2026-09-22 決裁。理由は3つで、どれも実測にもとづく。

- **フィード（カルーセル）はリーチ0。** 9/14・9/15・9/17 の3本がそろって0。フォロワー0だと配信先が存在しない
  （`ig-week-2026-09.md` §0）
- **リールにしても、知らない人がこれを見る理由がない。** リールタブと発見に流れる面はあるが、
  「サイトの絵が変わった」は中の人の報告で、引きがない。3秒継続率が15%（目標30%）の改善局面で
  いちばん弱いネタに枠を使うのは逆行する
- **中の人の報告は「つくる日記」の枠だが、休止中**（CLAUDE.md §7-b）

秋を IG で見せたいときは、**別のネタとして作る**。たとえば土曜「言いにくい気持ち」で
季節そのものを扱う回にすれば、絵の更新は報告ではなく背景になる。
