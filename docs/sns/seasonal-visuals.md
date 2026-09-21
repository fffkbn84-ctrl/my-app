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
| ヒーロー PC | 1672×941（16:9 横長）| 1536×1024（3:2 横長）| 上下をトリムして 16:9 → WebP |
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
3. Claude Code 側でトリム・WebP 変換・`public/images/` と `docs/sns/assets/` に配置
4. `src/lib/season.ts` の `CURRENT_SEASON` を切り替え
5. コミット。**tip コミットに `src/` の変更を含める**（docs だけが tip だと Vercel 本番ビルドがスキップされる。CLAUDE.md §10）
6. 本番デプロイ後、実機でファーストビューを確認
7. X ヘッダーは X の設定画面から手動アップロード
