# IG 連載「言いにくい気持ち」— 画像プロンプトと版面の正（2026-09-14 初版・第1回で確定）

> **このファイルが「言いにくい気持ち」シリーズの唯一の正。**
> 第2回以降を作るときは、Claude が **まずこのファイルを読み込み、ここのプロンプト一式を提示したうえで、
> その回に必要な `【SCENE】`（モチーフのプロンプト）を新しく考える**こと。ふうかさんに考えさせない。
>
> 実作業の手順は §6。画像処理と文字入れのスクリプトは `docs/sns/tools/ig-carousel/`。

---

## 0. この型は何か

**1枚1文。それ以上書かない。** 説明せず、まだ言葉になっていない気持ちに名前をつける。
Kinda note の天気の言葉と構造が同じなので、**既存資産の見せ方を変える型**であって、新しい何かではない。

- **形式**：カルーセル6枚（増減可・ただし1枚1文は動かさない）
- **枠**：週3本（火＝連載カルーセル／木＝つくる日記／土＝入口リール）の**外枠**として追加する型
- **見る数字**：**保存数とシェア数**。土曜リールの3秒視聴継続率とは別指標で見る
  （「人に送りたくなるか」がこの型の合否。DM で送られるかどうか）

### 書くときの線（第1回で確定）

- **ネガティブで閉じない。** 最終枚だけ「名前をつけている」という**事実**を置く。説教にしない
- 「可哀想な◯◯」で笑う型は**採らない**（婚活中の当事者を笑う形になるため。`ig-strategy-2026-09.md` §5）
- 空虚な共感を書かない（CLAUDE.md §3）。絵文字を使わない（同 §3）
- 1枚目は**相手の状況の言葉**を置く（世界観を置かない。`ig-strategy-2026-09.md` §4）

---

## 1. 画像プロンプト（共通テンプレート）

`【SCENE】` だけ差し替えて使う。**このテンプレート自体は変えない。**

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
No text, no letters, no numbers, no logos. The object is SMALL and sits in the
middle of the frame — leave generous empty beige space on all four sides.
Square 1:1 composition.
```

### 2枚目以降に必ず足す1行

```
Keep exactly the same clay texture, the same object scale, the same camera angle, the same light direction and the same background as the previous image. Only the object itself changes.
```

### 生成のしかた（第1回で効果を確認済み）

- **6枚を同じ ChatGPT スレッドで連続生成する。** 別スレッドにすると質感が揃わない
- 出力は **1:1（正方形）**。モチーフは小さく、周りは余白だらけでよい（配置はこちらでやる）
- **スクショではなく PNG をダウンロードして**渡す（色が変わるため）

### 採否の基準（これに引っかかったら再生成）

- 文字・数字・ロゴが写り込んだ（`miniature-image-guide.md` ルール7）
- 人・顔・手が写り込んだ（この型は「気持ち」が主役で、当事者を描かない）
- チェックマーク・グラフ・星・ハートなど**評価を連想させる**小物が入った（Kinda は判定しない）
- モチーフが大きすぎる／画面いっぱい（**小さいほど良い**。文字の居場所が要る）
- 台座・床・壁・背景の情景が写り込んだ（単色背景が崩れる）

---

## 2. 第1回「言いにくい気持ち １」で使った `【SCENE】`（実績・再利用可）

投稿日 2026-09-14（土）20:00-21:00。Notion IG投稿カレンダー：`【型検証】言いにくい気持ち １（単色背景・1枚1文）`

| # | 本文 | `【SCENE】` | モチーフの意図 |
|---|---|---|---|
| 1 | うまくいった日のほうが、なぜか落ち着かない。 | `Two tiny clay teacups standing neatly side by side; one cup is empty and clean, the other is still completely full and untouched.` | 何も失敗していないのに、片方だけ手つかず |
| 2 | 断られたショックより、理由が分からないほうがしんどい。 | `One tiny clay envelope, its flap opened, completely empty inside — nothing was in it.` | 開けたのに、中に何もない |
| 3 | 会う前に疲れて、会ってから元気になることがある。 | `One tiny pair of clay shoes placed neatly side by side as if by a doorway, toes pointing outward, nobody wearing them.` | まだ出かける前の時間 |
| 4 | 「いい人でした」としか言えない日が、いちばん困る。 | `A tiny clay set of a small round table with two chairs facing each other and two identical empty cups on it, perfectly tidy and perfectly symmetrical.` | 整いすぎて、言うことがない |
| 5 | 次に進みたいのか、休みたいのか、自分でも分からない。 | `One tiny clay bench with a small bag left sitting on it, nobody there.` | 進むでも休むでもない状態 |
| 6 | こういう気持ちに、天気の名前をつけています。 | `One tiny clay window frame standing by itself, with a few small raindrops on the glass and pale soft light coming through from behind it.` | ここだけ Kinda の天気に接続する |

**最終枚だけが Kinda に接続する。** 1〜5枚は Kinda の名前を出さない。
この配分を第2回以降も守る（先に名乗ると、この型は効かない）。

### `【SCENE】` を新しく考えるときの作法

- **状態を描く。感情を描かない。** 「悲しい人形」ではなく「片方だけ手つかずのカップ」
- **説明的にしない。** 分かれ道・時計・ハテナマークのような記号は使わない
- **人の不在を使う。** 置かれたまま・揃えられたまま・誰もいない。それが気持ちの居場所になる
- **1文につきモチーフ1つ。** 複数置くと、どちらを読めばいいか分からなくなる
- 6枚のモチーフが**似すぎない**ように散らす（器・紙・履物・家具・屋外・窓、のように種類を変える）

---

## 3. 版面（全枚共通・動かさない）

| 項目 | 値 |
|---|---|
| 画像サイズ | **1080×1350（4:5）** |
| 背景 | **`#F5EEE6` 厳密単色**（ビネット・ノイズを潰す） |
| モチーフ中心 | **y = 500** |
| モチーフの大きさ | **bbox の相乗平均 = 340px** に正規化（幅ではなく面積基準） |
| 文字ブロック上端 | **y = 800** |
| 書体 | **Shippori Mincho 400** |
| 文字色 | **`#2E2620`** |
| 級数 | **54px** / 行間 **1.95** / 字間 **.08em** / 中央揃え |
| 1行の上限 | **13字**（グリッドの 3:4 クロップ幅 1012px に収めるため） |
| 帯 | **張らない**（背景が明るいので不要） |

- モチーフは**幅ではなく面積で正規化する**。幅で揃えると、縦長のモチーフ（窓・封筒）が巨大に見える
- **モチーフの検出はエッジ基準**。輝度差で取ると**柔らかい落ち影を物体と誤検出して中心がズレる**
  （第1回で実際に左へ40pxズレた。エッジ基準に変えて解決）
- 行数は枚ごとに変わってよい（2行でも3行でも）。**上端 y=800 を固定する**ほうが、
  スワイプしたときにモチーフと文字の間隔が動かず、1枚の作品として読める

---

## 4. スクリプト

`docs/sns/tools/ig-carousel/`

| ファイル | 役割 |
|---|---|
| `prep.py` | 生成画像 → ホワイトバランス補正・地の平坦化・エッジ基準でモチーフ検出・1080×1350 に配置 |
| `render.js` | 上の出力に Shippori Mincho で文字を焼き込み（headless Chromium） |

### 準備（セッションごとに1回）

```bash
python3 -m pip install --break-system-packages Pillow numpy
npm pack @fontsource/shippori-mincho          # registry.npmjs.org は直通で届く
tar xzf fontsource-shippori-mincho-*.tgz
cp package/files/shippori-mincho-japanese-400-normal.woff2 ./shippori400.woff2
```

> サイト本体は Google Fonts の CDN から読んでいるだけで、リポジトリにフォント実体は無い。
> かつ **`fonts.google.com` はセッションの egress で塞がっている**ので、必ず npm 経由で取る。

### 実行

```bash
python3 prep.py <生成画像.png> bg-01.png
NODE_PATH=$(npm root -g) node render.js bg-01.png out-01.png "1行目" "2行目" "3行目"
```

---

## 5. 本文の改行のしかた

1行13字まで。**文節で折る**。助詞の途中（「と／しか」など）で折らない。

第1回の実績：

```
1  うまくいった日のほうが、／ なぜか落ち着かない。
2  断られたショックより、／ 理由が分からない／ ほうがしんどい。
3  会う前に疲れて、／ 会ってから元気になる／ ことがある。
4  「いい人でした」としか／ 言えない日が、／ いちばん困る。
5  次に進みたいのか、／ 休みたいのか、／ 自分でも分からない。
6  こういう気持ちに、／ 天気の名前をつけています。
```

5枚目のように**対句は改行で揃える**と、読む速度が落ちて効く。

---

## 6. 第2回以降の手順（Claude の担当）

1. このファイルと `docs/sns/ig-strategy-2026-09.md` を読む
2. Notion「IG投稿カレンダー」から該当回の**本文（1枚1文）**を取る
   （データソース `collection://547cadc2-95cb-4839-a559-7bd64c371d83`・`メモ` 欄に枚ごとの文が入っている）
3. **§1 の共通テンプレートをそのまま提示し、その回の `【SCENE】` を §2 の作法に従って新しく考えて出す**
4. ふうかさんが ChatGPT で生成 → チャットに貼る
5. §4 のスクリプトで処理・文字入れ → 6枚返す
6. Notion の該当ページの `状態` を更新する（画像ができたら `制作中` → 投稿後に `投稿済`）
7. 投稿後、`計測日` に**保存数・シェア数**を入れる（この型の合否指標）

### やらないこと

- CTA 枚（7枚目）を足さない。**1枚1文・それ以上書かない**が型の定義
- 1枚目だけ級数を上げない。**6枚とも同じ文字位置**が型の定義
- サイト側のビジュアル定義（`docs/guides/miniature-image-guide.md`）を書き換えない。
  あれはサイトのミニチュア＝台座つきジオラマの規定で、**この型は SNS 側の別ルール**
  （CLAUDE.md §4 の注記・画像ガイド「SNS は別ルール」に依拠）
