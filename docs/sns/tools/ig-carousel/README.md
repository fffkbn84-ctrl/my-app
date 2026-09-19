# ig-carousel — 単色背景の IG 投稿を作る（画像処理＋文字入れ＋リール書き出し）

IG の4つの型で共用する。仕様と運用の正はそれぞれ：

| 型 | 曜日 | 書き出し | 正 |
|---|---|---|---|
| ふたりの話題、ひとつずつ（連載28週） | 毎週火 20:00 | `render-series.js`（`hook`/`body`/`close`） | `docs/sns/series/kinda-pair-28.md` |
| つくる日記 | 毎週木 20:00 | `render-series.js`（`note`/`body`） | `docs/sns/series/tsukuru-nikki.md` |
| 入口リール | 毎週土 12:00 | `render-reel.js` ＋ `build_reel.py` | `docs/sns/series/nyuguchi-reel.md` |
| 言いにくい気持ち（1枚1文） | 不定（外枠） | `render.js` | `docs/sns/series/iinikui-kimochi.md` |

ChatGPT が出したクレイのモチーフ画像を、**全枚とも同じ地色・同じ位置・同じ大きさ**に揃えて、
Shippori Mincho で文字を焼き込む。グリッドに並んだとき1枚の作品に見せることが目的。

## 準備（セッションごとに1回）

```bash
python3 -m pip install --break-system-packages Pillow numpy
python3 -m pip install --break-system-packages imageio-ffmpeg   # リールを書き出す回だけ
npm pack @fontsource/shippori-mincho
tar xzf fontsource-shippori-mincho-*.tgz
cp package/files/shippori-mincho-japanese-400-normal.woff2 ./shippori400.woff2
```

`fonts.google.com` はセッションの egress で塞がっているので、必ず npm レジストリから取る
（`registry.npmjs.org` は noProxy に入っていて直通で届く）。

**ffmpeg も同様**。Playwright 同梱の ffmpeg は VP8/WebM だけの縮小ビルドで H.264 を吐けない。
`imageio-ffmpeg`（PyPI）が libx264・aac・xfade・zoompan 入りのバイナリを持っているので、そちらを使う。

## 実行

```bash
# 「言いにくい気持ち」：モチーフ中心 y=500・サイズ340（既定）、文字 54px
python3 prep.py <生成画像.png> bg-01.png
NODE_PATH=$(npm root -g) node render.js bg-01.png out-01.png "1行目" "2行目" "3行目"

# 連載・つくる日記：モチーフのサイズと中心 y を引数で渡す
python3 prep.py <生成画像.png> pair-bg-01.png 300 420
NODE_PATH=$(npm root -g) node render-series.js hook  pair-bg-01.png out-01.png '["行1","行2","行3"]'
NODE_PATH=$(npm root -g) node render-series.js note  pair-bg-01.png out-01.png '["行1","行2"]'
NODE_PATH=$(npm root -g) node render-series.js body  none           out-02.png '["行1","行2"]'
NODE_PATH=$(npm root -g) node render-series.js close pair-bg-05.png out-05.png '["行1",{"gap":true},"CTA"]'
```

- `prep.py` の引数は `<入力> <出力> [モチーフサイズ] [モチーフ中心y] [カンバス幅] [カンバス高]`
  （省略すると 340 / 500 / 1080×1350）。**同じ生成画像から 4:5 と 9:16 の両方を作れる**ので、
  土曜リールの絵を火曜カルーセルに使い回せる
- `render-series.js` の第1引数は版面の種類：
  `hook`（モチーフ＋質問を**62px**。連載の1枚目）／`note`（モチーフ＋見出しを**54px**。つくる日記の1枚目）／
  `body`（文字のみ・天地中央・44px）／`close`（モチーフ＋本文44px＋CTA。連載の5枚目）。
  プレートが要らない枚は `none` を渡す。`{"gap":true}` を挟むと .7em の余白が入る
- **1枚目の級数で火曜と木曜を見分けさせている**（連載62px＝疑問形／つくる日記54px＝断言形）。
  そろえてはいけない
- `render-reel.js` は 1080×1920。第1引数は `hook`（1秒目・58px）／`body`（48px）
- `build_reel.py` は `SEGS`（フレーム・尺・ズーム）を書き換えて実行すると
  H.264 / yuv420p / 30fps / 無音AAC入りの MP4 を書き出す。**音楽は IG 側で足す**
- いずれも同じディレクトリの `shippori400.woff2` と `*-bg-*.png` / `f*.png` を相対参照する

## 過去に踏んだバグ

**`letter-spacing` と同じ値を `margin-right` に流用するとき、文字列を切り出さないこと。**
`'.08em'.slice(1)` は `'08em'` になり、Chromium はこれを **-8em** として解釈する。
文字ブロック全体が約170px 右へずれて、右端の文字が切れる（2026-09-15 に実際に発生）。
`margin-right:-${ls}` のように、値をそのまま符号付きで使う。

## prep.py が何をしているか

1. **ホワイトバランス** — 外周の中央値を `#F5EEE6` に合わせる。生成画像の地色は毎回微妙に違う
2. **地の平坦化** — `#F5EEE6` に近い画素を厳密に `#F5EEE6` へ寄せる。ビネットとノイズが消える。影は残る
3. **モチーフ検出** — **エッジ基準**。柔らかい落ち影にはエッジが立たないので拾わない。
   輝度差で取ると影を物体と誤検出して**中心が横にズレる**（実際にやらかした）
4. **配置** — bbox の**相乗平均を指定サイズに正規化**して、中心を (540, 指定y) に置く。
   幅で正規化すると縦長のモチーフ（窓・封筒）が巨大に見えるため

## 調整したいとき

`prep.py` の定数（全枚に効く。1枚だけ変えない）：

| 定数 | 既定 | 意味 |
|---|---|---|
| `MOTIF_SIZE` | 340 | モチーフの視覚的な大きさ（第3引数で上書き可） |
| `MOTIF_CY` | 500 | モチーフの中心 y（第4引数で上書き可） |
| `MAX_W` / `MAX_H` | 640 / 380 | 極端な縦横比のときの上限 |

文字は `render.js` の `.t`（`top:800px` / `font-size:54px` / `line-height:1.95` / `letter-spacing:.08em`）、
連載は `render-series.js` の `L` テーブル。どちらも**1行の上限は文字サイズで決まる**：
54px なら13字、44px なら16字、62px なら10字（グリッドの 3:4 クロップ幅 1012px に収まる範囲）。
文節で折る。助詞の途中では折らない。
