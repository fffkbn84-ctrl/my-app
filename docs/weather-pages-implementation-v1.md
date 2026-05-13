# Kinda 天気解説ページ 実装指示書 v1

> 作成日：2026-05-13
> 対象：Claude Code（fffkbn84-ctrl/my-app）
> 作業ブランチ：既存の `implement~` 系を使用（新規ブランチは作らない）

---

## 0. このドキュメントの目的

`/note/weather/[slug]` という天気解説ページを20ページ分実装する。
今フェーズで実装するのは **先行5ページ**：雨雲・霧・違和感の風・冷たい風・朝もや。

残り15ページは別途データのみ追加する形で、テンプレートは共通化する。

---

## 1. URL構造

```
/note/weather                                  天気タイプ一覧ページ
/note/weather/[slug]                           各天気解説ページ

slug一覧（20種、本実装では先行5ページ分のみ本文データあり）:

preルート（3）:
  /note/weather/morning-mist                   朝もや ★先行
  /note/weather/pre-dawn                       夜明け前
  /note/weather/flower-overcast                花曇り

waitingルート（4）:
  /note/weather/light-rain-start               降り始め
  /note/weather/light-rain                     小雨
  /note/weather/rain-cloud                     雨雲 ★先行
  /note/weather/thunderstorm                   雷雨

omiaiルート（3）:
  /note/weather/sun-break                      晴れ間
  /note/weather/angels-ladder                  天使のはしご
  /note/weather/windy-day                      風の日

date1ルート（3）:
  /note/weather/light-sunrise                  淡い朝焼け
  /note/weather/wandering-clouds               迷い雲
  /note/weather/cold-wind                      冷たい風 ★先行

multipleルート（3）:
  /note/weather/windy-sunshine                 風の強い晴れ
  /note/weather/faint-sunlight                 薄日
  /note/weather/twilight                       夕暮れ

kousaiルート（4）:
  /note/weather/sunrise                        朝焼け
  /note/weather/dissonance-wind                違和感の風 ★先行
  /note/weather/quiet-overcast                 静かな曇り
  /note/weather/mist                           霧 ★先行
```

**ルーティング:** Next.js の動的ルート機能を使用。`app/note/weather/[slug]/page.tsx` で実装。
**一覧ページ:** `app/note/weather/page.tsx`

---

## 2. データ構造の拡張

### 2.1 既存ファイル `app/kinda-note/data/weatherDescriptions.ts` の型定義を以下のように拡張

```typescript
export type WeatherKey =
  // pre
  | "morning_mist"
  | "pre_dawn"
  | "flower_overcast"
  // waiting
  | "light_rain_start"
  | "light_rain"
  | "rain_cloud"
  | "thunderstorm"
  // omiai
  | "sun_break"
  | "angels_ladder"
  | "windy_day"
  // date1
  | "light_sunrise"
  | "wandering_clouds"
  | "cold_wind"
  // multiple
  | "windy_sunshine"
  | "faint_sunlight"
  | "twilight"
  // kousai
  | "sunrise"
  | "dissonance_wind"
  | "quiet_overcast"
  | "mist";

export type RouteKey =
  | "pre"
  | "waiting"
  | "omiai"
  | "date1"
  | "multiple"
  | "kousai";

export type Scene = {
  title: string;        // 場面のタイトル（"会いに行く前の朝"等、20-30字）
  body: string;         // 本文 100-150字
};

export type Action = {
  title: string;        // アクションタイトル（"今日の気持ちを3行で書く"等、15-25字）
  body: string;         // 本文 80-100字
};

export type WeatherDescription = {
  // 既存フィールド
  key: WeatherKey;
  name_ja: string;
  name_en: string;
  route: RouteKey;
  type_name: string;
  description: string;          // 既存（詩的解説、40-60字、\n区切り2文）

  // 新規追加：URL・SEO用
  slug: string;                  // URL用（"rain-cloud"等、ハイフン区切り英小文字）
  sub_title: string;             // titleタグ用サブ説明（25-35字程度）
  meta_description: string;      // 検索結果用、120-140字

  // 新規追加：本文セクション（先行5ページのみ埋まる、他は未定義でOK）
  body_essence?: string;         // ④この天気の正体 約400字
  body_scenes?: Scene[];         // ⑤こんな時にこの天気になる 3-4場面
  body_science?: string;         // ⑥気持ちを言葉にすると 約300字
  body_actions?: Action[];       // ⑦できる小さなこと 3つ

  // 新規追加：内部リンク
  related_weather_keys: WeatherKey[];   // ⑧近い気持ち、2-3個
  related_columns?: string[];           // ⑨関連コラム slug、0-2個
};
```

### 2.2 関連カラム slug の定義（将来のコラム実装に備えて先に定義）

`app/data/columnSlugs.ts` を新規作成：

```typescript
export const COLUMN_SLUGS = {
  KONKATSU_TSUKARETA: "konkatsu-tsukareta",
  KIMOCHI_SEIRI: "kimochi-seiri",
  DATE_FUAN: "date-fuan",
} as const;

export type ColumnSlug = typeof COLUMN_SLUGS[keyof typeof COLUMN_SLUGS];

// 将来のコラム記事メタデータ（記事本体は未実装、ここでは内部リンク用に存在だけ定義）
export const COLUMN_META: Record<ColumnSlug, { title: string; description: string; published: boolean }> = {
  "konkatsu-tsukareta": {
    title: "「婚活、疲れた」と感じたら。続けるかやめるかの前に、整理してみる",
    description: "婚活で疲れを感じている時。続けるかやめるかを決める前に、まず気持ちを整理することから。",
    published: false,  // 実装後にtrueへ
  },
  "kimochi-seiri": {
    title: "気持ちを整理する方法。モヤモヤを言葉にする60秒",
    description: "感情ラベリングの科学的根拠と、婚活の場面で使える整理の実践。",
    published: false,
  },
  "date-fuan": {
    title: "デートの後、不安になるあなたへ。不安を消すのではなく、言葉にする",
    description: "デートの不安は消すものではなく、言葉にすることで扱える大きさに変わる。",
    published: false,
  },
};
```

**重要:** weather解説ページから `published: false` のコラムへのリンクは、**リンクとして表示はするが、クリックすると404 or「公開準備中」ページにする**。これは後で実装するコラム本体と整合させる。または、現時点では `published: false` のものはリンクを非表示にする方式でも可。**Claude Codeに判断を任せるが、推奨は「published: false ならリンクは非表示」の方式**。

---

## 3. 先行5ページのデータ（コピペ用）

以下のデータを `weatherDescriptions.ts` の `WEATHER_DESCRIPTIONS` オブジェクトに反映する。既存の5つ（morning_mist, rain_cloud, dissonance_wind, cold_wind, mist）のエントリを **上書き** すること。他の15エントリは既存のまま、`slug`, `sub_title`, `meta_description`, `related_weather_keys` だけ追加する（本文セクションは未定義のまま）。

### 3.1 雨雲（rain_cloud）

```typescript
rain_cloud: {
  key: "rain_cloud",
  name_ja: "雨雲",
  name_en: "Rain Cloud",
  slug: "rain-cloud",
  route: "waiting",
  type_name: "雨雲",
  description:
    "空が低く、重たい色を抱えている時間。\nまだ降り出さない雲の下、その息をひそめた静けさにあなたはいます。",
  sub_title: "「重さ」を抱えたまま、続けているあなたへ",
  meta_description:
    "婚活や交際で、何かが重く感じる時。降り出す前の雨雲のような気持ちは、言葉にすると不思議と軽くなる。Kinda noteの60秒で、いまの天気を確かめる。",
  body_essence:
    "雨雲は、まだ降り出してはいない天気です。\n\n晴れているわけでも、嵐の中にいるわけでもない。ただ空が低く、何かを抱えている。動こうとすると体が重く、立ち止まると今度は時間が重くなる。そんな状態を、雨雲は表しています。\n\n婚活や交際の中で、この天気はよく現れます。やめたいわけではない。続けたいのかもよく分からない。やる気が出ないと言ってしまうと違う気がするけれど、進んでいる実感もない。\n\nそれは、サボっているのでも、向いていないのでもありません。雲が空を覆っているのは、いつか降るためです。あなたの中の重さも、いつか言葉になるための準備をしている時間かもしれません。",
  body_scenes: [
    {
      title: "お見合いやデートが続いた頃",
      body: "最初の数回は新鮮だったのに、いつのまにか「また会わなきゃ」が増えている。会うこと自体は嫌じゃないのに、準備の段階で気持ちが重くなる。",
    },
    {
      title: "期待されていると感じる時",
      body: "家族や友人、カウンセラーが応援してくれている。期待されているのは分かる。でも、その期待に応えなきゃと思うほど、自分の気持ちが見えなくなっていく。",
    },
    {
      title: "「うまくいっている」ように見える時",
      body: "周りからは順調に見える。でも自分の中で何かが詰まっている。何が詰まっているのかも分からないまま、ただ日が過ぎていく。",
    },
    {
      title: "結果が出始めた時こそ",
      body: "仮交際に進んだ、お見合いが組まれた、いい人かもしれない人に出会えた。良いはずなのに、なぜか心が動かない。期待していたものと違うのかもしれないけれど、それも分からない。",
    },
  ],
  body_science:
    "雨雲の重さは、見えないものを抱えているから重いのです。\n\n心理学の研究では、自分が感じているものに名前をつけるだけで、不安や戸惑いが扱える大きさに戻ることが分かっています。「重い」だけでは何も動かないけれど、「期待に応えなきゃと思って重い」と書き出した瞬間、それは雲の輪郭を持ちます。\n\n輪郭があるものは、降らせることも、待つことも、誰かに見せることもできる。雨雲のまま抱え続けるより、一度言葉という器に移してみる。それだけで、空気が少し変わります。",
  body_actions: [
    {
      title: "何が重いのかを、3つだけ書いてみる",
      body: "全部を整理しようとしないで大丈夫です。今日、何が重かったかを、3つだけ。書けなかったら2つでも、1つでも。",
    },
    {
      title: "「やめたい」と「続けたい」を別の紙に書く",
      body: "両方あっていい。雨雲の中にいる人は、たいてい両方持っています。どちらかを選ぶ必要はなくて、両方あることを認めるだけで、少し軽くなります。",
    },
    {
      title: "今日は何もしないことを、自分に許す",
      body: "雨雲が空を覆う日は、無理に晴れさせる必要はありません。雲がそこにあると認めて、お茶を飲んで、いつもより早く眠る。それで十分な日があります。",
    },
  ],
  related_weather_keys: ["thunderstorm", "light_rain", "mist"],
  related_columns: ["konkatsu-tsukareta"],
},
```

### 3.2 霧（mist）

```typescript
mist: {
  key: "mist",
  name_ja: "霧",
  name_en: "Mist",
  slug: "mist",
  route: "kousai",
  type_name: "霧",
  description:
    "近くのものすら輪郭がぼやけて見える朝。\n先が見えないのではなく、いま見えるものを大切にする、その霧の中にあなたはいます。",
  sub_title: "先が見えない、けれど止まれないあなたへ",
  meta_description:
    "婚活や交際で「この先どうなるか分からない」と感じる時。霧の中にいる気持ちを言葉にすると、いま見えているものが少しずつ輪郭を持ちはじめる。Kinda noteの60秒で確かめる。",
  body_essence:
    "霧は、雨でも晴れでもない不思議な天気です。\n\n降ってもいないし、晴れているわけでもない。ただ世界の輪郭がぼやけて、何メートル先が見えているのか自分でも分からない。動けないわけじゃないけれど、進むスピードが分からない。それが霧の中です。\n\n婚活や交際の途中で、この天気はゆっくり立ち上がってきます。相手のことは嫌いじゃない。むしろ大切に思っている。でも、この先一緒にいる未来が見えているかと聞かれると、はっきり「見える」とは言えない。\n\nそれは、気持ちが冷めているわけでも、相手に問題があるわけでもありません。霧は、視界を奪うけれど、その場所自体は変わっていない。あなたが立っている地面は、いつも通りそこにあります。",
  body_scenes: [
    {
      title: "真剣交際に入った頃",
      body: "お付き合いから一歩進んで、結婚を意識した話が出はじめる。具体的になればなるほど、本当にこの人でいいのか分からなくなる時間が増える。",
    },
    {
      title: "周りが先に進んだ時",
      body: "友人が結婚した、同年代の同僚が産休に入った。自分のペースは間違っていないと頭では分かっていても、霧の濃さが急に増す日がある。",
    },
    {
      title: "親や家族から話題が出る時",
      body: "「あの人とはどうなの」「いつごろ決めるの」と聞かれる。答えなきゃいけないのに、自分の中に答えが見つからない。問われる度に、霧が深くなる。",
    },
    {
      title: "好きかどうかが分からない時",
      body: "嫌いではない。一緒にいて穏やか。でも、これが好きということなのか、ただ慣れているだけなのか、自分で見分けがつかない。",
    },
  ],
  body_science:
    "霧の中で困るのは、見えないことそのものより、「見えていないのに進まなきゃいけない」気がしてしまうことです。\n\nある実験では、不安を感じている人に「いま自分が何を感じているか」を言葉にしてもらうと、不安そのものが小さくなることが分かっています。霧は晴れさせなくていい。ただ「いま私は霧の中にいる」と言葉にした瞬間、それは状況になります。\n\n状況になれば、無理に進まなくてもいい理由ができる。少しずつ霧が薄れるのを待つ、という選択肢が手に入る。気持ちは、形にすると扱えるようになります。",
  body_actions: [
    {
      title: "「見えている近いもの」を書き出す",
      body: "未来全部を考えなくて大丈夫です。今日、相手と話して心地よかったこと、ひっかかったこと。手の届く範囲のことだけを書いてみる。",
    },
    {
      title: "「決めなくていい時間」を自分に許す",
      body: "霧の中で焦って決めた答えは、晴れたあとに違って見えることがあります。今週は決めない、と先に決めておくだけで、呼吸が変わります。",
    },
    {
      title: "カウンセラーに「霧の中にいる」と伝える",
      body: "うまく言葉にできないままでも、「いま霧みたいな状態です」と伝えるだけで、相手は無理に晴らそうとしなくなります。霧にいることを、まず誰かに知っておいてもらう。",
    },
  ],
  related_weather_keys: ["dissonance_wind", "quiet_overcast", "rain_cloud"],
  related_columns: ["konkatsu-tsukareta", "kimochi-seiri"],
},
```

### 3.3 違和感の風（dissonance_wind）

```typescript
dissonance_wind: {
  key: "dissonance_wind",
  name_ja: "違和感の風",
  name_en: "Dissonance Wind",
  slug: "dissonance-wind",
  route: "kousai",
  type_name: "違和感の風",
  description:
    "草が思いがけない方向に揺れる、そんな風の日。\n理由はまだ言葉にならない、その小さなざわめきの中にあなたはいます。",
  sub_title: "「なんとなく」のざわめきを抱えるあなたへ",
  meta_description:
    "婚活や交際で、説明できない違和感を抱えている時。風のような小さなざわめきは、言葉にすると正体が見えはじめる。Kinda noteの60秒で、その風の名前を確かめる。",
  body_essence:
    "違和感の風は、嵐ではない天気です。\n\n雨が降っているわけでも、雲が重いわけでもない。ただ、いつもと違う方向から風が吹いていて、草が思いがけない揺れ方をする。それを見ているあなたも、「あれ?」と少しだけ立ち止まる。それが違和感の風です。\n\n婚活や交際の中で、この天気は予感のような形で訪れます。何が嫌だったかと聞かれても答えられない。でも、何かがいつもと違った気がする。それは気のせいかもしれないし、見落としてはいけない合図かもしれない。\n\n違和感は、言葉にされないままだと「気のせい」として処理されがちです。でも、風がそこに吹いていたことだけは確かです。理由が分からなくても、感じたことは、なかったことにはなりません。",
  body_scenes: [
    {
      title: "会った後に、なぜか気持ちが落ち着かない",
      body: "楽しい時間だったはず。会話も弾んだ。なのに帰り道、何かが胸に残っていて、お風呂に入っても消えない。",
    },
    {
      title: "相手の言葉のひとつが、後から思い出される",
      body: "その場では気にならなかった一言。でも夜になって、ふと蘇る。怒っているわけではないけれど、ひっかかっている。",
    },
    {
      title: "価値観の違いに、ふっと気づく",
      body: "お金の話、家族の話、休日の過ごし方。大きな対立じゃない。でも「あ、ここは違うんだ」と一瞬風が吹く。",
    },
    {
      title: "自分の選択を、後から疑いたくなる",
      body: "「いい人だ」「ちゃんとしている」と自分に言い聞かせている。言い聞かせなきゃいけないこと自体が、風の音かもしれない。",
    },
  ],
  body_science:
    "違和感は、言葉にされる前は「気のせい」と見分けがつきません。\n\n心理学では、自分の気持ちに名前をつけると、その瞬間、人はそれを「持っている自分」から「眺めている自分」に変わると言われています。研究者たちはこれを認知的距離と呼びます。\n\n違和感の風が吹いた時、その風を「お金の話で吹いた」「沈黙が長かった時に吹いた」と書き出してみる。気のせいかもしれないし、確かな合図かもしれない。どちらでも構いません。書いた時点で、それは扱えるものになります。",
  body_actions: [
    {
      title: "風が吹いた瞬間を、メモに残す",
      body: "判断しなくていい。「今日、相手の〇〇という言葉で風が吹いた」とだけ書いておく。後で見返した時に、同じ風が何度も吹いていたら、それは合図です。",
    },
    {
      title: "「気のせいかもしれない」を否定しない",
      body: "気のせいかどうかは、まだ分からなくていい。気のせいでも、そう感じたという事実は残ります。",
    },
    {
      title: "カウンセラーに、違和感のまま渡す",
      body: "言葉にならないまま伝えていいのです。「うまく言えないけど、最近こういうことで違和感がある」とだけ。整理されていなくても、相手はそれを受け取れます。",
    },
  ],
  related_weather_keys: ["mist", "rain_cloud", "quiet_overcast"],
  related_columns: ["kimochi-seiri"],
},
```

### 3.4 冷たい風（cold_wind）

```typescript
cold_wind: {
  key: "cold_wind",
  name_ja: "冷たい風",
  name_en: "Cold Wind",
  slug: "cold-wind",
  route: "date1",
  type_name: "冷たい風",
  description:
    "通り過ぎた風が、ふと冷たかった日。\nあたたかさがそこにあったことを教える、そのつめたさの中にあなたはいます。",
  sub_title: "デートの後、ひとりで冷たさを抱えるあなたへ",
  meta_description:
    "デートやお見合いの後、なぜか冷たい風が吹いた気がする時。その違和感を言葉にすると、いま起きていることが見えはじめる。Kinda noteの60秒で、今日の天気を確かめる。",
  body_essence:
    "冷たい風は、嵐ではない天気です。\n\n雨も雪も降っていない。空も明るい。ただ、ふっと吹いた風がいつもより冷たくて、首元が縮こまる。そんな天気です。冷たい風の不思議なところは、それを感じた時に「ああ、さっきはあたたかかったんだ」と気づくこと。\n\nデートやお見合いの後、この天気はよく訪れます。会っている間は楽しかった。話も弾んだ。なのに、ひとりになった瞬間、なぜか胸がすうっと冷えた。\n\nその冷たさは、相手が冷たかったわけではないかもしれません。あたたかい時間の後だから、温度差として感じているだけかもしれない。それでも、冷たさは確かにそこにあります。風が吹いたという事実は、なかったことにしなくていいのです。",
  body_scenes: [
    {
      title: "デートが終わって、ひとり家に帰る時",
      body: "楽しかった時間の余韻が、駅の改札を出た頃から少しずつ冷えていく。一人になると、急に静けさが大きく感じる。",
    },
    {
      title: "LINEの返信を待っている時間",
      body: "楽しかったね、と送った後の沈黙。すぐに返ってこないだけで、急に風の温度が下がる。本当は気にしなくていいのに、気になってしまう。",
    },
    {
      title: "相手の表情が、ふと気になった時",
      body: "笑っていたはず。話していたはず。でも、ふとした瞬間に見えた相手の顔が、自分の知らない場所を見ていた気がする。",
    },
    {
      title: "自分の話を、もっとすればよかったと思う時",
      body: "聞き役に回りすぎたのかもしれない。もっと自分を出すべきだったのかもしれない。家に帰ってから、後悔のかたちで風が吹く。",
    },
  ],
  body_science:
    "冷たい風の困るところは、温度を確かめる前に「気のせいだ」と片付けてしまえることです。\n\n言葉にできないものは、いつも実物より大きく感じます。でも一度書き出してみると「あ、これだけだったのか」と思うことがある。気持ちは形がないからこそ、輪郭をつけてあげると、ちょうどいい大きさに戻ります。\n\n「楽しかったけど、別れ際の顔が気になった」と書き出した瞬間、それは確認できることになります。次のデートで観察するか、カウンセラーに伝えるか、自分の中で待つか。選択肢が見えるようになります。",
  body_actions: [
    {
      title: "今日の冷たかった瞬間を、一行だけ書く",
      body: "何分頃、何があった時に冷たい風が吹いたか。それだけでいい。原因を分析しなくて大丈夫です。",
    },
    {
      title: "「楽しかった」と「冷たかった」を両方残す",
      body: "どちらか片方に塗り替えなくていい。両方あったまま記録しておくと、次に会った時の見え方が変わります。",
    },
    {
      title: "返信を待つ時間に、別のことをする",
      body: "冷たい風は、待っている時間ほど強く吹きます。返事を確認し続けるより、お湯を沸かしたり、別のことに手を動かしたり。風そのものに対する装備を変えてみる。",
    },
  ],
  related_weather_keys: ["wandering_clouds", "dissonance_wind", "light_sunrise"],
  related_columns: ["date-fuan"],
},
```

### 3.5 朝もや（morning_mist）

```typescript
morning_mist: {
  key: "morning_mist",
  name_ja: "朝もや",
  name_en: "Morning Mist",
  slug: "morning-mist",
  route: "pre",
  type_name: "朝もや",
  description:
    "やわらかな霧が世界の輪郭をほどく朝。\nすべてがまだ決まっていない、その白さの中にあなたはいます。",
  sub_title: "まだ何も決めていない、入り口の前にいるあなたへ",
  meta_description:
    "結婚相談所や婚活をはじめるか迷っている時。まだ何も決まっていない朝もやのような気持ちを、急いで晴らさなくていい。Kinda noteの60秒で、いまの天気を確かめる。",
  body_essence:
    "朝もやは、一日のはじまりにそっと立ち上がる、やわらかな霧のことです。\n\n雨ではない。冷たくもない。ただ、世界の輪郭が白くほどけていて、何メートル先がどうなっているのか、まだ見えない。陽が昇るにつれて晴れていくものでもあるし、しばらく残ることもある。それが朝もやです。\n\n婚活や結婚相談所のことを「気になっているけれど、まだはじめていない」状態は、この天気にとても似ています。やりたいかと聞かれると、分からない。やめておきたいかと言われると、それも違う。検索バーに「結婚相談所」と打ち込んでみては、消す。そんな時間を過ごしている人は、たくさんいます。\n\n朝もやの中にいるのは、迷っているからではありません。まだ、決まっていないだけです。決まっていない時間そのものが悪いものではなく、これから決まっていくための準備時間でもあります。",
  body_scenes: [
    {
      title: "結婚相談所を調べはじめた頃",
      body: "ホームページを見比べてみる。資料請求のボタンに手をかけて、戻る。怖いわけじゃないけれど、押しきれない。",
    },
    {
      title: "周りの結婚や妊娠の知らせを受けた時",
      body: "おめでとうと心から思える。でも夜になって、自分はどうしようと思う。誰かに相談したいのか、ひとりで考えたいのか、それも分からない。",
    },
    {
      title: "「そろそろ」と言われた時",
      body: "家族から、友人から、自分から自分へ。「そろそろ」という言葉が増えていく。プレッシャーではないつもりでも、もやの濃さは少しずつ増す。",
    },
    {
      title: "昔の恋愛を、ふと思い返す時",
      body: "あの時こうしていたら、と考える夜がある。後悔ではなく、ただ確かめている。次に進むための、静かな振り返り。",
    },
  ],
  body_science:
    "朝もやの中で起きやすいのは、「決められない自分」を責めることです。\n\nある実験では、不安を感じている人に「いま自分が何を感じているか」を言葉にしてもらうと、不安そのものが小さくなることが分かっています。「決められない」と責める前に、「いま私は、まだ決まっていない場所にいる」と書いてみる。それだけで、自分を責める対象から、観察する対象に変わります。\n\n朝もやは、無理に晴らさなくていい天気です。陽が昇れば自然に薄れていくし、しばらく残ってもそこにいられる。決めるための時間が、いま流れている。それだけで十分なこともあります。",
  body_actions: [
    {
      title: "「結婚相談所」「婚活」と聞いて浮かぶ気持ちを、3つ書く",
      body: "ポジティブも、ネガティブも、両方ある方が自然です。怖い、興味ある、めんどう、希望、義務感。並べてみると、自分の現在地が少し見えます。",
    },
    {
      title: "今日は調べないでいい時間を作る",
      body: "朝もやの中にいる時、情報を集めすぎるとかえって視界が悪くなります。今日はスマホを置いて、好きな飲み物を淹れる。それだけの日があっていい。",
    },
    {
      title: "「まだ決めなくていい」と自分に言う",
      body: "やる/やらないの二択にしない。「まだ決まっていない」を選択肢として認める。それは保留ではなく、ひとつの状態です。",
    },
  ],
  related_weather_keys: ["pre_dawn", "flower_overcast", "wandering_clouds"],
  related_columns: ["konkatsu-tsukareta"],
},
```

### 3.6 残り15ページの最低限データ追加

残り15ページ（pre_dawn, flower_overcast, light_rain_start, light_rain, thunderstorm, sun_break, angels_ladder, windy_day, light_sunrise, wandering_clouds, windy_sunshine, faint_sunlight, twilight, sunrise, quiet_overcast）には、以下のフィールドだけ追加する：

- `slug`：ハイフン区切り英小文字（例：`pre_dawn` → `pre-dawn`）
- `sub_title`：仮テキスト「[天気名]の天気にいるあなたへ」
- `meta_description`：仮テキスト「[既存のdescriptionを1文に整形]Kinda noteの60秒で、今の気持ちを確かめる。」
- `related_weather_keys`：同じルート内の他の天気2-3個（仮）

これらは後のフェーズで本文と合わせて改修する。

---

## 4. ページ実装

### 4.1 ファイル構造

```
app/
├── note/
│   ├── weather/
│   │   ├── page.tsx                  ← 一覧ページ（新規）
│   │   ├── [slug]/
│   │   │   └── page.tsx              ← 個別ページ（新規、動的ルート）
│   │   └── _components/
│   │       ├── WeatherHero.tsx       ← ①ヒーロー
│   │       ├── WeatherEssence.tsx    ← ②この天気の正体
│   │       ├── WeatherScenes.tsx     ← ③こんな時に
│   │       ├── WeatherScience.tsx    ← ④気持ちを言葉に
│   │       ├── WeatherActions.tsx    ← ⑤できる小さなこと
│   │       ├── RelatedWeathers.tsx   ← ⑥近い気持ち
│   │       ├── RelatedColumns.tsx    ← ⑦関連コラム
│   │       ├── WeatherCTA.tsx        ← ⑧Kinda note CTA
│   │       └── Breadcrumb.tsx        ← パンくず（既存があれば再利用）
│   └── ...（既存ファイル）
└── kinda-note/
    └── data/
        └── weatherDescriptions.ts    ← 既存ファイル、上記の通り拡張
```

### 4.2 `[slug]/page.tsx` の実装要件

#### 4.2.1 動的ルート設定

- `generateStaticParams` で全20スラッグを静的生成（SSG）
- 存在しないslugは `notFound()` で404

#### 4.2.2 メタデータ生成（`generateMetadata`）

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const weather = findWeatherBySlug(params.slug);
  if (!weather) return {};

  const title = `Kinda ${weather.name_ja} ｜ ${weather.sub_title} - Kinda note`;
  const description = weather.meta_description;
  const url = `https://kinda.jp/note/weather/${weather.slug}`;
  const ogImage = `https://kinda.jp/og/weather/${weather.slug}.png`;  // 将来生成、現状はデフォルト画像でOK

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      siteName: "Kinda",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
```

**重要：** title は60字以内、description は120-140字。これを超えないよう、データ側で調整済み。

#### 4.2.3 構造化データ（JSON-LD）

ページ本体に2つのJSON-LDスクリプトを埋め込む：

1. **Article schema**
2. **BreadcrumbList schema**

例：

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": `Kinda ${weather.name_ja} ｜ ${weather.sub_title}`,
  "description": weather.meta_description,
  "image": `https://kinda.jp/og/weather/${weather.slug}.png`,
  "author": {
    "@type": "Organization",
    "name": "Kinda",
    "url": "https://kinda.jp"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Kinda",
    "logo": {
      "@type": "ImageObject",
      "url": "https://kinda.jp/logo.png"
    }
  },
  "datePublished": "2026-05-13",
  "dateModified": "2026-05-13",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://kinda.jp/note/weather/${weather.slug}`
  }
})}} />

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://kinda.jp/"},
    {"@type": "ListItem", "position": 2, "name": "Kinda note", "item": "https://kinda.jp/note"},
    {"@type": "ListItem", "position": 3, "name": "天気タイプ", "item": "https://kinda.jp/note/weather"},
    {"@type": "ListItem", "position": 4, "name": weather.name_ja, "item": `https://kinda.jp/note/weather/${weather.slug}`}
  ]
})}} />
```

#### 4.2.4 ページ本体のレンダリング順序

```
1. Header（既存グローバルヘッダー）
2. Breadcrumb（パンくず：ホーム > Kinda note > 天気タイプ > [天気名]）
3. WeatherHero（アイコン大 + h1: "Kinda [天気名]" + description（詩的解説））
4. WeatherEssence（h2: "この天気の正体" + body_essence）
5. WeatherScenes（h2: "こんな時にこの天気になる" + body_scenes一覧）
6. WeatherScience（h2: "気持ちを言葉にすると、なにが起きるか" + body_science）
7. WeatherActions（h2: "できる、小さなこと" + body_actions一覧）
8. RelatedWeathers（h2: "近い気持ち" + related_weather_keys のカードリンク）
9. RelatedColumns（h2: "この気持ちにいるあなたへ" + related_columns のリンク）
   ※ COLUMN_META[slug].published === false の場合はスキップ
10. WeatherCTA（CTA: "気持ちを整理する →" → /note へ）
11. Footer（既存グローバルフッター）
```

**条件付き表示：** 残り15ページは `body_essence` 等が `undefined` なので、それぞれのセクションは「データがあれば表示、なければスキップ」のロジックにする。これで先行5ページは完全表示、他15ページはタイトル＋詩的解説＋CTAだけの最小表示になる。

#### 4.2.5 スタイル

- Kindaの既存パレット（背景 `#F5EEE6`、アクセント `#D4A090`）を使用
- 詩的解説（description）は Georgia serif、line-height 1.9、center
- 見出しh1/h2は既存トップページと同じトーンマナで
- スマホファースト：iPhone 16 Pro での閲覧を最優先

### 4.3 `/note/weather/page.tsx`（一覧ページ）

20種の天気をルート別にグルーピングして一覧表示。

```
セクション順:
1. h1: "20の天気タイプ"
2. リード文: "Kinda noteの結果として現れる、20種類の天気を見ることができます。"
3. ルート別グループ表示:
   - 入会前（preルート、3種）
   - 待機中（waitingルート、4種）
   - お見合い後（omiaiルート、3種）
   - デート後（date1ルート、3種）
   - 複数交際中（multipleルート、3種）
   - 真剣交際中（kousaiルート、4種）
4. 各天気は「アイコン + 天気名 + descriptionの1行目」のカード形式
5. クリックで個別ページへ
```

**重要:** この一覧ページもSEO対象。titleは「20の天気タイプ ｜ Kinda note - 気持ちを天気で表す」、descriptionは「Kinda noteは、いまの気持ちを20種類の天気で表します。あなたの今日の天気を見つけて、整理することからはじめましょう。」

---

## 5. サイトマップ更新

`app/sitemap.ts`（または既存のサイトマップ生成箇所）に以下を追加：

```typescript
// 天気解説ページ全20件
const weatherPages = getAllWeathers().map((w) => ({
  url: `https://kinda.jp/note/weather/${w.slug}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

// 一覧ページ
const weatherListPage = {
  url: "https://kinda.jp/note/weather",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.8,
};

// これらを既存のサイトマップ配列に追加
```

---

## 6. 確認・テスト項目

実装後、Vercelデプロイして以下を確認：

- [ ] `/note/weather` 一覧ページが表示される
- [ ] 先行5ページ（rain-cloud, mist, dissonance-wind, cold-wind, morning-mist）の本文が完全表示される
- [ ] 残り15ページが最小表示（タイトル＋詩的解説＋CTA）で表示される
- [ ] 各ページのパンくずが正しく動作
- [ ] 内部リンク（近い気持ち、関連コラム）が正しく動作
- [ ] スマホ（iPhone 16 Pro）で読みやすい
- [ ] ページソースに JSON-LD（Article、BreadcrumbList）が含まれる
- [ ] meta description が60-140字の範囲内
- [ ] title が60字以内
- [ ] `prefers-reduced-motion` 対応（アニメーション要素があれば）
- [ ] `published: false` のコラムへのリンクが**非表示**または**無効**になっている

---

## 7. 通常進行ルール（前チャットから継承）

- 該当ファイルが特定できない、必要な色トークン等が見つからない、ヒーロー以外のファイルにも変更が及びそう、既存実装が指示書の前提と大幅に異なる、のいずれかが発生した場合のみ停止して質問
- 上記以外はVercelデプロイまで一気に進め、完了時にスクショと差分要点を一括報告
- ブランチは既存の `implement~` 系を使用、新規ブランチは作らない

---

## 8. 次フェーズ（このチャットの範囲外）

- 残り15ページの本文初稿（Claude作成、ふうかさん添削）
- コラム3記事（婚活疲れた・気持ち整理・デート不安）の本文制作
- OGP画像の生成（各天気ごとに1枚、20枚必要）
- カウンセラー検索（Kinda talk）への内部リンク追加

---

以上が実装指示書の全容です。
