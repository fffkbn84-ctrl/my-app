/* ────────────────────────────────────────────────────────────
   Kinda story（ふたりの物語）モックデータ
   将来 Supabase の stories テーブルから取得する想定
──────────────────────────────────────────────────────────── */

export type StoryStage = "成婚" | "交際中" | "活動中";

export type StoryAgeBand = "20代" | "30代前半" | "30代後半" | "40代" | "50代" | "60代";

export interface Story {
  id: string;
  /** トップ・一覧で見せる短い引用 */
  quote: string;
  /** 詳細ページのタイトル（鍵かっこ付き） */
  title: string;
  /** 投稿者の表記（例: "A.M さん"） */
  author: string;
  /** 表示用の年齢（例: "32歳"） */
  age: string;
  /** フィルタ用の年代帯 */
  ageBand: StoryAgeBand;
  /** 例: "6ヶ月で成婚" */
  status: string;
  /** 現在のステージ（フィルタ用） */
  stage: StoryStage;
  /** 投稿月 */
  date: string;
  /** 例: "出会いから6ヶ月"。フィルタ用に月数も持つ */
  periodLabel: string;
  periodMonths: number;
  /** 担当カウンセラー・所属相談所（既存 data.ts と紐づく） */
  counselorId: number;
  counselorName: string;
  agencyId: number;
  agencyName: string;
  /** 詳細ページ本文（段落配列） */
  body: string[];
  /** 中間の引用（任意） */
  pullQuote?: string;
  /** タグ */
  tags: string[];
  /** 共感カウント（モック） */
  sympathyCount: number;
  /** カードのアクセントカラー（淡いグリーン系） */
  accentColor: string;
  accentSoft: string;
  /** カードのサムネ画像（任意・未指定なら stage 別フォールバック）。
   *  同一 stage の物語が並ぶと絵が重複するため、物語ごとに上書きできる。 */
  thumbnail?: string;
}

export const STORIES: Story[] = [
  {
    id: "1",
    quote:
      "最初はなんとなく始めたんです。決めなきゃって焦ってた時に、カウンセラーさんが『急がなくていい』って言ってくれて、肩の力が抜けました",
    title: "「急がなくていい」と言われて、初めて自分のペースで進めた",
    author: "A.M さん",
    age: "32歳",
    ageBand: "30代前半",
    status: "6ヶ月で成婚",
    stage: "成婚",
    date: "2025年2月",
    periodLabel: "出会いから6ヶ月で成婚",
    periodMonths: 6,
    counselorId: 1,
    counselorName: "田中 美紀",
    agencyId: 1,
    agencyName: "Atelier Mariage 銀座",
    thumbnail: "/images/story-seikon.webp",
    body: [
      "32歳になって、周りが結婚していくのを見るたびに『私だけ取り残されてる』と感じていました。婚活アプリを見ても比較ばかりが目について、SNSはむしろ疲れる。婚活パーティーは何度か行きましたが、誰と話したかも覚えていない夜が増えました。",
      "結婚相談所は『高そう』『押しつけられそう』というイメージで、ずっと選択肢に入れていなかったんです。でも、ふたりへで田中さんのリールを見たとき、『この人なら、ちゃんと話を聞いてくれそう』と思えた。最初の面談で『焦らなくていいよ』と言われて、自分でも驚くくらい涙が出ました。",
      "出会ったのは活動を始めて3ヶ月後。お見合いで会ったTさんは、初めから自然に話せる人でした。デートを重ねるうちに、『この人と一緒にいる時の自分が好きだな』と思えるようになって。半年で成婚退会することができました。",
    ],
    pullQuote:
      "焦らないと決めた瞬間から、不思議と『この人かも』が見えてきた気がします。",
    tags: ["30代女性", "仕事しながら活動", "初めての相談所", "東京"],
    sympathyCount: 47,
    accentColor: "#5A8050",
    accentSoft: "#E8F4E4",
  },
  {
    id: "4",
    quote:
      "仕事が忙しすぎて無理だと思っていたけど、ペースを合わせてくれた。『忙しいから婚活できない』は言い訳だったかも",
    title: "通勤時間ゼロでも、ちゃんと婚活はできた",
    author: "Y.S さん",
    age: "29歳",
    ageBand: "20代",
    status: "10ヶ月で成婚",
    stage: "成婚",
    date: "2024年12月",
    periodLabel: "出会いから10ヶ月で成婚",
    periodMonths: 10,
    counselorId: 6,
    counselorName: "林 俊介",
    agencyId: 5,
    agencyName: "Marry Hub 新宿",
    thumbnail: "/images/story-kosai.webp",
    body: [
      "エンジニアをしていて、リリース前は終電も普通でした。婚活なんて自分には無理、とずっと思っていたんです。でも30歳が見えてきたとき、『何もしないまま後悔するのは嫌だ』と気づいて。",
      "林さんはオンライン専門で、夜10時からの面談にも対応してくれました。最初は『そんなに遅くまで働かせて申し訳ないな』と思いましたが、『繁忙期はペースを落としていいから、辞めないで続けようね』と言ってくれて。",
      "10ヶ月後、お相手のRさんと成婚退会しました。彼女も同じくエンジニアで、お互いの忙しさを理解できる相手と出会えたのは、林さんがじっくり時間をかけて『どんな人と合うか』を一緒に考えてくれたからだと思います。",
    ],
    tags: ["20代男性", "IT・エンジニア", "オンライン婚活", "10ヶ月で成婚"],
    sympathyCount: 29,
    accentColor: "#5A8050",
    accentSoft: "#E8F4E4",
  },
  {
    id: "5",
    quote:
      "始めて2ヶ月、まだお相手は決まっていません。でも、自分の気持ちを話せる場所があるだけで、毎週少し前向きになれています",
    title: "まだ途中。それでも、続けられている",
    author: "H.N さん",
    age: "34歳",
    ageBand: "30代前半",
    status: "活動2ヶ月",
    stage: "活動中",
    date: "2025年4月",
    periodLabel: "活動2ヶ月目",
    periodMonths: 2,
    counselorId: 3,
    counselorName: "佐藤 綾乃",
    agencyId: 2,
    agencyName: "Wedding Note 渋谷",
    thumbnail: "/images/story-katsudo.webp",
    body: [
      "婚活を始めるのに、ものすごく勇気がいりました。何度も入会ボタンの前で止まって、結局SNSを閉じて寝る、を繰り返していて。",
      "ふたりへで佐藤さんのリールを見たのは、たまたま夜中にスクロールしていた時でした。『ゆっくり、急がず、でも確実に』というキャッチコピーに、なぜか涙が出ました。",
      "活動を始めてまだ2ヶ月。お見合いは3回しただけで、まだお相手は決まっていません。でも、毎週佐藤さんと話して『今はここまで進んだね』と振り返るだけで、少しずつ前を向けている気がします。誰かに進捗を共有できる場所があるって、こんなに支えになるんですね。",
    ],
    pullQuote:
      "ゴールはまだ先。でも、続けられている自分をはじめて誇れています。",
    tags: ["30代女性", "婚活初心者", "東京", "活動中"],
    sympathyCount: 24,
    accentColor: "#5A8050",
    accentSoft: "#E8F4E4",
  },
  {
    id: "6",
    quote:
      "40代になってからの婚活は、自分のことを丁寧に聞いてくれる人とでないと続かない。山田さんは何時間でも聞いてくれた",
    title: "40代の婚活は、聞いてくれる人と組むことから始まった",
    author: "J.W さん",
    age: "42歳",
    ageBand: "40代",
    status: "12ヶ月で成婚",
    stage: "成婚",
    date: "2024年11月",
    periodLabel: "出会いから1年で成婚",
    periodMonths: 12,
    counselorId: 2,
    counselorName: "山田 健太郎",
    agencyId: 1,
    agencyName: "Atelier Mariage 銀座",
    body: [
      "40代に入ってから、婚活は『若い人のもの』という空気を強く感じるようになりました。アプリを使えば年齢で弾かれ、パーティーに行けば浮いている気がして。",
      "山田さんは、初回面談で2時間以上、私の話を聞いてくれました。仕事のこと、これまでの恋愛、家族のこと。『年齢の話は後でいい。まずあなた自身を知りたい』と言われて、はじめて『この人と組めば動けるかも』と思いました。",
      "Yさんと出会ったのは活動開始から半年。お互い40代で、価値観が落ち着いていて、無理に若作りしなくていいことが居心地よかったです。1年後に成婚退会。山田さんがいなければ、最初の3ヶ月で諦めていたと思います。",
    ],
    pullQuote:
      "40代の婚活には、年齢で諦めない伴走者が必要です。山田さんはそういう人でした。",
    tags: ["40代男性", "聞いてくれる人", "東京", "1年で成婚"],
    sympathyCount: 33,
    accentColor: "#5A8050",
    accentSoft: "#E8F4E4",
  },
];

export function getStoryById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
