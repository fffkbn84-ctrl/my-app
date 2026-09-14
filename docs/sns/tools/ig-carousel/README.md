# ig-carousel — 単色背景カルーセルの画像処理＋文字入れ

IG 連載「言いにくい気持ち」用。仕様と運用の正は `docs/sns/series/iinikui-kimochi.md`。

ChatGPT が出したクレイのモチーフ画像を、**6枚とも同じ地色・同じ位置・同じ大きさ**に揃えて、
Shippori Mincho で文字を焼き込む。グリッドに並んだとき1枚の作品に見せることが目的。

## 準備（セッションごとに1回）

```bash
python3 -m pip install --break-system-packages Pillow numpy
npm pack @fontsource/shippori-mincho
tar xzf fontsource-shippori-mincho-*.tgz
cp package/files/shippori-mincho-japanese-400-normal.woff2 ./shippori400.woff2
```

`fonts.google.com` はセッションの egress で塞がっているので、必ず npm レジストリから取る
（`registry.npmjs.org` は noProxy に入っていて直通で届く）。

## 実行

```bash
python3 prep.py <生成画像.png> bg-01.png
NODE_PATH=$(npm root -g) node render.js bg-01.png out-01.png "1行目" "2行目" "3行目"
```

`render.js` は同じディレクトリの `shippori400.woff2` と `bg-*.png` を相対参照する。

## prep.py が何をしているか

1. **ホワイトバランス** — 外周の中央値を `#F5EEE6` に合わせる。生成画像の地色は毎回微妙に違う
2. **地の平坦化** — `#F5EEE6` に近い画素を厳密に `#F5EEE6` へ寄せる。ビネットとノイズが消える。影は残る
3. **モチーフ検出** — **エッジ基準**。柔らかい落ち影にはエッジが立たないので拾わない。
   輝度差で取ると影を物体と誤検出して**中心が横にズレる**（実際にやらかした）
4. **配置** — bbox の**相乗平均を 340px に正規化**して、中心を (540, 500) に置く。
   幅で正規化すると縦長のモチーフ（窓・封筒）が巨大に見えるため

## 調整したいとき

`prep.py` の定数（全枚に効く。1枚だけ変えない）：

| 定数 | 既定 | 意味 |
|---|---|---|
| `MOTIF_SIZE` | 340 | モチーフの視覚的な大きさ |
| `MOTIF_CY` | 500 | モチーフの中心 y |
| `MAX_W` / `MAX_H` | 640 / 380 | 極端な縦横比のときの上限 |

文字は `render.js` の `.t`（`top:800px` / `font-size:54px` / `line-height:1.95` / `letter-spacing:.08em`）。
1行は13字まで。文節で折る。
