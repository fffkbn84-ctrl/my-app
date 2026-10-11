# `/for-counselors` 組み直し・引き継ぎ（2026-10-10〜10-11）

> ブランチ `claude/kind-galileo-7b4lem`（PR 未作成・main 未マージ）。
> 営業の連絡で相手が開くページなので、営業開始前に main へ出す。

## 1. 決まったこと（ふうかさん決裁）

| 項目 | 決定 |
|---|---|
| ページの主役 | 「カウンセラー個人を選べるサイト＋30分お話を」。取材は「カウンセラーページとあわせて記事も作らせてください」 |
| 冒頭の説明 | 「どこ／誰で選ぶ」は分かりにくいので使わない →「担当になるカウンセラーを見て、結婚相談所を選べるサイトです。」 |
| 時間 | サービスの説明 **30分前後**／取材 **60分** |
| 名前 | ページ上は「**ふうか**」のまま（メール署名は小山楓華）。話し手・聞き手は「運営のふうかです。」だけ |
| 言い回し | **やってもらう前提**で書く。「お断りいただいて構いません」「ご返答は不要」「取りやめもできます」はページ本文に置かない（FAQ の「記事をあとから削除できますか」だけは聞かれたときの答えとして残す） |
| 取材と掲載 | **取材するなら掲載もしてもらう**。「掲載は取材の条件ではない」系の文と FAQ を削除 |
| 取材記事の公開場所 | **Kinda voices** と書く |
| 取材している理由 | 「考えや想いをもっと伝えられる場所を作りたい」＋メリット3つ（会う前に人柄が伝わる／検索で見つかる／ご自身の発信に使える）。「お渡しできる実績はまだ少ない」は使わない |
| 「早い時期に掲載いただいた相談所ほど口コミが先に」 | **残す** |
| 掲載の呼び方 | 「**カウンセラーページへの掲載**」 |
| 掲載までの流れ | 「まず、30分ほどお話を」の下へ移した（ご相談 → ご説明30分 → 専用 URL のお渡し → 公開） |
| フォームの用件 | 先頭・初期値を「**サービスの説明を受けたい（オンライン30分）**」（値は `listing` のまま） |
| 運営者の欄 | 「代表のふうかは、結婚相談所『Emma』のカウンセラーでもあります。いまは Kinda の運営を中心にしています。Emma も他の相談所と同じ扱いで掲載しており、検索結果やおすすめで優遇することはありません。」 |
| 掲載イメージ | 口コミ0件のデモカードは**撤去済み**。スマホ枠のリール画面＋詳細ページを HTML で作り込む（画像待ち）。評価・口コミ数は見本でも出さない（2026-08 の決定どおり） |

### 訂正の経緯
- 10/10 の初版で「その場で返答は要らない」「話し手：同じく結婚相談所のカウンセラーです」を足したが、ふうかさんの方針（やってもらう前提）と合わず 10/11 に外した。
- Claude は「本番の小山楓華の掲載は実稼働」と見ていたが、ふうかさんの意図は「**依頼が来ない初期のつなぎ＝サンプル的な掲載**」。ただし予約枠は開いていて実際に予約できるので、ページ上の文は事実（カウンセラーでもある／運営が中心）だけで書いた。

## 2. Kinda voices の記事サンプル（判断）

**ふうかさんの意図**：取材記事の見本を、`/for-counselors` の中だけに出す。

- **これは問題ない。** 掲載案内に「掲載イメージ」を付けるのは媒体の一般的なやり方
  （例：[FPCJ の取材案内見本](https://fpcj.jp/common/pdf/distribute/release/release_sample.pdf)・[和歌山県の掲載案内](https://www.pref.wakayama.lg.jp/prefg/130100/sangyou/_baks/d00210941_d/fil/shinki_pdf.pdf)は、掲載イメージを並べて見せている）。
  条件：
  1. **架空の人物**と明記（「記事イメージ・架空のカウンセラーです」）
  2. **ページ内の抜粋として出し、単独 URL を作らない**（検索に出ない・`/columns` 一覧に出ない）
  3. 実在の相談所名を使わない。評価・口コミ数は出さない
- 10/10 に Claude が反対したのは「架空の記事を本物の記事として公開する」場合の話で、この形なら当てはまらない。

**ふうかさん自身の取材記事を本番に出すか**：**いまは出さないのがよい**（心配しすぎではない）。
- 法律面は、関係を明示すれば問題ない。ステマ規制は「事業者の表示であることが分からない」ことが対象で、
  関係が分かれば規制の対象外という考え方（[ビジネスロイヤーズの解説](https://www.businesslawyers.jp/articles/1310)・[netshop の解説](https://netshop.impress.co.jp/node/10817)）。
  比較サイトで措置命令が出たのは、運営者と提供者が同一で**優良誤認の表示**をした事案
  （[消費者委員会資料](https://www.cao.go.jp/consumer/history/05/kabusoshiki/kokyoryokin/doc/050_180723_shiryou3_2.pdf)）で、記事があること自体ではない。
- 問題は**営業相手からの見え方**。実在の掲載が1名だけの今、その1名が運営者で取材記事まで先にある、という並びは「身内を先に載せている」と読まれやすい。営業ページで「優遇しない」と言っている直後なので、わざわざ疑われる材料を作らない。
- 出すなら：**他のカウンセラーの取材記事が数本並んだ後**に、冒頭へ「Kinda の運営者本人の記事です」と関係を明示して出す。

## 3. 画像のプロンプト（ChatGPT に貼る）

生成した画像はチャットに貼る → Claude が WebP 変換・切り出しをする。

### 共通テンプレート（縦長 9:16・リール用）

```
A photorealistic miniature dollhouse scene, flat front view at eye level,
of 【SCENE】. Soft warm light from above.
Warm beige palette (#F5EEE6) with dusty rose and terracotta accents (#D4A090).
Cozy, handmade, tilt-shift miniature look with subtle clay seams that reveal it is a made object.
No readable text, no logos.
The scene FILLS THE ENTIRE FRAME — do NOT show the outer box, the display base, or any background outside it.
Keep the main subject inside the middle 60% of the frame (the top and bottom may be cropped).
Vertical 9:16 composition.
```

> リールカードは `object-fit: cover` で上下が切れることがある。主役は中央に置く。

### A. 掲載イメージ用・架空のカウンセラー（2枚）
ふうかさんと見分けがつくよう、服はセージグリーンにする。

- **A-1 リール1枚目（人物）**
  `a small consultation room with a clay counselor doll seated at a round wooden table, facing the viewer, hands resting on an open notebook, a cup of tea beside it. The doll has a simple rounded face with no detailed features, short dark hair, and wears a soft sage-green cardigan`
- **A-2 詳細ページ用（部屋）**
  `the same consultation room with no one in it: two cushioned chairs facing each other across a round wooden table, a small vase with a single flower, a low bookshelf behind. NO people, no figures, no dolls`

### B. ふうかさんのリール最新版（3枚）
B-1 は、選んである**クレイのふうか像の画像を一緒に添付**して「この人物を参考に」と伝える（顔出しはしない方針のまま、クレイ像で出す）。

- **B-1（人物）**
  `the clay figure from the attached reference image, seated at a writing desk by a window, seen from a slight side angle, looking down at an open notebook with a pen in hand, a cup of tea on the desk. Keep the same hairstyle, clothing colors and proportions as the reference`
- **B-2（面談の場所）**
  `a calm counseling corner: two cushioned chairs angled toward each other, a small side table with two cups of tea, sheer curtains and soft window light. NO people, no figures, no dolls`
- **B-3（お金の話も一緒に＝FP の持ち味）**
  `a desk still life: an open planner, a fountain pen, a small calculator, a tiny clay house model and a cup of coffee, arranged neatly. NO people, no figures, no dolls`

### C. Emma の画像（1枚・正方形）
相談所ページでは **88px の正方形**で出るので、モチーフ1つだけにする（「そろそろ」の一歩を扉で表す）。

```
A single small miniature clay door, slightly ajar, with warm light spilling out from inside,
standing on a plain warm beige background (#F5EEE6) with a soft shadow.
Dusty rose and terracotta accents (#D4A090). Handmade, soft matte clay texture, tilt-shift look.
Only one object, centered, large in the frame. No text, no logos, no people.
Square 1:1 composition.
```

## 4. 次にやること
1. ふうかさん：A〜C の画像を生成してチャットに貼る
2. Claude：A で掲載イメージ（スマホ枠のリール＋詳細）を作る。B・C は WebP にして渡す → ふうかさんが counselor 管理画面で差し替え
3. Claude：Kinda voices の記事イメージ（架空・ページ内抜粋）を `/for-counselors` に足す
4. ふうかさん：プレビューで確認 → PR → main へマージ
