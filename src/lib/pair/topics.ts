/**
 * src/lib/pair/topics.ts
 *
 * Kinda pair の話題定義。**単一の source of truth**。
 *
 * - DB には持たない（v1.0 はサーバに何も保存しない設計）。
 * - `/kinda-pair/topics`（公開ページ）も `/kinda-pair/solo`（ひとりモード）も
 *   このファイルから生成する。ページ側に文言をハードコードしないこと。
 *
 * 注意：文言の正は `kinda-pair-spec-v1.md` §5 の表。
 *    現時点で仕様書が未取得のため、指示書で確定している以下4件以外は起案文言。
 *    仕様書入手後はこのファイルの PAIR_TOPICS を一字一句そのまま差し替える
 *    （key を変えなければ他ファイルの修正は不要）。
 *      確定済み: l1-holiday / l1-food-dislike / l2-contact / l3-parents-care
 */

export type PairLayer = "l1" | "l2" | "l3" | "l4";
export type PairState = "talked" | "want" | "hold";

export type PairTopic = {
  /** 例: "l1-holiday" */
  key: string;
  layer: PairLayer;
  /** 例: "休みの日の過ごし方" */
  title: string;
  /** そのまま口に出せる聞き方 */
  ask: string;
  /** 補足（重い話題への注記など） */
  note?: string;
};

export const PAIR_LAYERS: {
  key: PairLayer;
  label: string;
  lead: string;
}[] = [
  { key: "l1", label: "ふれる", lead: "好みや、日々のこと。" },
  { key: "l2", label: "知る", lead: "考え方や、人との付き合い方。" },
  { key: "l3", label: "重なる", lead: "暮らしが重なっていく部分。" },
  { key: "l4", label: "描く", lead: "この先のこと。" },
];

export const PAIR_TOPICS: PairTopic[] = [
  // ── l1 ふれる ─────────────────────────────────────────────
  {
    key: "l1-holiday",
    layer: "l1",
    title: "休みの日の過ごし方",
    ask: "休みの日って、外に出る方ですか？家にいる方ですか？",
  },
  {
    key: "l1-food-dislike",
    layer: "l1",
    title: "苦手な食べ物",
    ask: "苦手な食べ物ってありますか？お店を選ぶときに知っておきたくて",
  },
  {
    key: "l1-work",
    layer: "l1",
    title: "普段の仕事のこと",
    ask: "お仕事って、普段はどんなことをされているんですか？",
  },
  {
    key: "l1-hometown",
    layer: "l1",
    title: "育った場所",
    ask: "どのあたりで育ったんですか？",
  },
  {
    key: "l1-recent",
    layer: "l1",
    title: "最近たのしかったこと",
    ask: "最近、たのしかったことってありますか？",
  },
  {
    key: "l1-rhythm",
    layer: "l1",
    title: "一日のリズム",
    ask: "朝と夜、どちらの方が調子がいいですか？",
  },
  {
    key: "l1-media",
    layer: "l1",
    title: "よく見るもの・読むもの",
    ask: "最近見たり読んだりして、面白かったものってありますか？",
  },

  // ── l2 知る ───────────────────────────────────────────────
  {
    key: "l2-contact",
    layer: "l2",
    title: "連絡の頻度と取り方",
    ask: "連絡って、どのくらいの間隔が心地いいですか？",
    note: "交際のはじめに、いちばん行き違いが起きやすいところです。",
  },
  {
    key: "l2-friends",
    layer: "l2",
    title: "友人との付き合い方",
    ask: "友だちとは、どのくらいの頻度で会いますか？",
  },
  {
    key: "l2-alone",
    layer: "l2",
    title: "ひとりの時間の必要さ",
    ask: "ひとりの時間って、どのくらい欲しい方ですか？",
  },
  {
    key: "l2-conflict",
    layer: "l2",
    title: "意見が違ったときの伝え方",
    ask: "意見が合わないとき、その場で話す方ですか？少し置く方ですか？",
  },
  {
    key: "l2-family-distance",
    layer: "l2",
    title: "家族との距離感",
    ask: "ご家族とは、よく連絡を取る方ですか？",
  },
  {
    key: "l2-money-habit",
    layer: "l2",
    title: "お金の使い方の癖",
    ask: "お金は、貯めておきたい方ですか？使いたい方ですか？",
  },
  {
    key: "l2-rest",
    layer: "l2",
    title: "疲れたときの休み方",
    ask: "疲れたとき、どうやって休みますか？",
  },

  // ── l3 重なる ─────────────────────────────────────────────
  {
    key: "l3-living-area",
    layer: "l3",
    title: "住む場所",
    ask: "もし一緒に暮らすなら、どのあたりがいいと思いますか？",
  },
  {
    key: "l3-work-style",
    layer: "l3",
    title: "これからの働き方",
    ask: "この先も、いまの働き方を続けたいと思っていますか？",
  },
  {
    key: "l3-housework",
    layer: "l3",
    title: "家事の分け方",
    ask: "家事って、得意なものと苦手なものはありますか？",
  },
  {
    key: "l3-household-money",
    layer: "l3",
    title: "家計の持ち方",
    ask: "家計は、分けておく方がいいですか？まとめる方がいいですか？",
  },
  {
    key: "l3-parents-care",
    layer: "l3",
    title: "親のこれから",
    ask: "ご両親のこれからについて、考えていることはありますか？",
    note: "重い話題です。まだのときは「いまは置いておく」で構いません。",
  },
  {
    key: "l3-time-together",
    layer: "l3",
    title: "ふたりの休みの過ごし方",
    ask: "休みは一緒に過ごしたいですか？それぞれの時間もほしいですか？",
  },
  {
    key: "l3-pet",
    layer: "l3",
    title: "動物と暮らすこと",
    ask: "動物と暮らしたいと思ったことはありますか？",
  },

  // ── l4 描く ───────────────────────────────────────────────
  {
    key: "l4-pace",
    layer: "l4",
    title: "これからの時間の見通し",
    ask: "この先のこと、どのくらいの時間で考えていますか？",
  },
  {
    key: "l4-children",
    layer: "l4",
    title: "子どものこと",
    ask: "子どものことって、考えたことはありますか？",
  },
  {
    key: "l4-place",
    layer: "l4",
    title: "いつか暮らしてみたい場所",
    ask: "いつか住んでみたい場所ってありますか？",
  },
  {
    key: "l4-work-change",
    layer: "l4",
    title: "働き方が変わること",
    ask: "働き方を変えたいと思うことはありますか？",
  },
  {
    key: "l4-home",
    layer: "l4",
    title: "ふたりの家のかたち",
    ask: "ふたりで過ごす家って、どんな感じがいいですか？",
  },
  {
    key: "l4-meet-family",
    layer: "l4",
    title: "家族に会うタイミング",
    ask: "ご家族に会うのは、どのくらいの時期がいいと思いますか？",
  },
  {
    key: "l4-someday",
    layer: "l4",
    title: "いつかやってみたいこと",
    ask: "いつかやってみたいことって、ありますか？",
  },
];

/** 層ごとの話題（定義順を保つ） */
export function topicsByLayer(layer: PairLayer): PairTopic[] {
  return PAIR_TOPICS.filter((t) => t.layer === layer);
}

/** key 引き（結果画面の復元用） */
export function findTopic(key: string): PairTopic | undefined {
  return PAIR_TOPICS.find((t) => t.key === key);
}

/** 状態ラベル（UI 文言の一元管理） */
export const PAIR_STATE_LABEL: Record<PairState, string> = {
  talked: "もう話した",
  want: "まだ／話してみたい",
  hold: "いまは置いておく",
};
