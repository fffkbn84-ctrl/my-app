/**
 * src/lib/pair/topics.ts
 *
 * Kinda pair の話題定義。**単一の source of truth**。
 *
 * - DB には持たない（v1.0 はサーバに何も保存しない設計）。
 *   将来 DB を持つ段階でも topic_key だけを保存し、文言はここに置き続ける
 *   （文言改訂で既存データが壊れないようにするため。仕様書 §7）。
 * - `/kinda-pair/topics`（公開ページ）も `/kinda-pair/solo`（ひとりモード）も
 *   このファイルから生成する。ページ側に文言をハードコードしないこと。
 *
 * 文言は `kinda-pair-spec-v1.md` §5「トピックカード全28（v1 確定）」の表を
 * そのまま写している。key・タイトル・聞き方の例を勝手に変えないこと。
 *
 * 語彙について（仕様書 §5 の判断）：
 * 第4層のみ「結婚」の語を使う（`l4-work-after`）。ブランドルールの禁止対象は
 * ヒーロー／CTA／ビジュアルコピーであり、機能テキストは対象外。
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
  // ── 第1層：ふれる（7）─────────────────────────────────────
  {
    key: "l1-holiday",
    layer: "l1",
    title: "休みの日の過ごし方",
    ask: "休みの日って、外に出る方ですか？家にいる方ですか？",
  },
  {
    key: "l1-food",
    layer: "l1",
    title: "食べ物の好き・苦手",
    ask: "苦手な食べ物ってありますか？お店を選ぶときに知っておきたくて",
  },
  {
    key: "l1-place",
    layer: "l1",
    title: "落ち着く場所",
    ask: "静かな場所と、賑やかな場所だと、どちらが落ち着きますか？",
  },
  {
    key: "l1-culture",
    layer: "l1",
    title: "音楽・映画・本の好み",
    ask: "最近、何か観たり読んだりしましたか？",
  },
  {
    key: "l1-rhythm",
    layer: "l1",
    title: "朝型か夜型か",
    ask: "朝は強い方ですか？",
  },
  {
    key: "l1-drink",
    layer: "l1",
    title: "お酒との付き合い方",
    ask: "お酒は飲まれますか？わたしは◯◯くらいです",
  },
  {
    key: "l1-work",
    layer: "l1",
    title: "どんな仕事をしているか",
    ask: "一日の流れって、だいたいどんな感じなんですか？",
  },

  // ── 第2層：知る（7）───────────────────────────────────────
  {
    key: "l2-work-view",
    layer: "l2",
    title: "仕事への考え方",
    ask: "いまのお仕事は、この先も続けていきたい感じですか？",
  },
  {
    key: "l2-alone",
    layer: "l2",
    title: "一人の時間がどれくらい必要か",
    ask: "一人の時間って、どのくらいあると落ち着きますか？",
  },
  {
    key: "l2-contact",
    layer: "l2",
    title: "連絡の頻度とテンポ",
    ask: "連絡って、こまめな方が安心ですか？それとも気にしない方ですか？",
    note: "交際のはじめに、いちばん行き違いが起きやすいところです。",
  },
  {
    key: "l2-mood",
    layer: "l2",
    title: "機嫌が悪いときどうなるか",
    ask: "疲れているときって、話したくなる方ですか、静かにしたい方ですか？",
  },
  {
    key: "l2-friends",
    layer: "l2",
    title: "友人との付き合い方",
    ask: "休みの日に友人と会うことは多いですか？",
  },
  {
    key: "l2-money-style",
    layer: "l2",
    title: "お金の使い方の癖",
    ask: "使うところと、抑えるところって決めていますか？",
  },
  {
    key: "l2-health",
    layer: "l2",
    title: "体のこと・無理をするタイプか",
    ask: "体調が悪いとき、無理してしまう方ですか？",
  },

  // ── 第3層：重なる（7）─────────────────────────────────────
  {
    key: "l3-area",
    layer: "l3",
    title: "住む場所の希望",
    ask: "この先も、いまの辺りに住み続けたい感じですか？",
  },
  {
    key: "l3-family-distance",
    layer: "l3",
    title: "家族との距離感",
    ask: "ご実家とは、よく連絡を取られますか？",
  },
  {
    key: "l3-housework",
    layer: "l3",
    title: "家事の分担のイメージ",
    ask: "料理って、される方ですか？",
  },
  {
    key: "l3-worklife",
    layer: "l3",
    title: "転勤・転職の可能性",
    ask: "お仕事、転勤の可能性ってあるんですか？",
  },
  {
    key: "l3-pet",
    layer: "l3",
    title: "ペット",
    ask: "動物は好きですか？飼っていたことは？",
  },
  {
    key: "l3-household",
    layer: "l3",
    title: "家計の考え方",
    ask: "一緒に暮らすとしたら、家計って合わせる方が楽だと思いますか？",
  },
  {
    key: "l3-parents-care",
    layer: "l3",
    title: "親のこれからのこと",
    ask: "ご家族のこと、この先で考えていることはありますか？",
    note: "重い話題です。まだのときは「いまは置いておく」で構いません。",
  },

  // ── 第4層：描く（7）───────────────────────────────────────
  {
    key: "l4-children",
    layer: "l4",
    title: "子どものこと",
    ask: "お子さんについては、どんなふうに考えていますか？",
  },
  {
    key: "l4-work-after",
    layer: "l4",
    title: "結婚後の働き方",
    ask: "一緒に暮らし始めたら、働き方は変えたいですか？",
  },
  {
    key: "l4-home",
    layer: "l4",
    title: "住まいの形",
    ask: "賃貸と持ち家、こだわりはありますか？",
  },
  {
    key: "l4-pace",
    layer: "l4",
    title: "進め方のペース",
    ask: "この先、どのくらいのペースで進められたらいいと思っていますか？",
  },
  {
    key: "l4-inlaws",
    layer: "l4",
    title: "お互いの親との関わり方",
    ask: "ご家族とは、どのくらいの距離感がちょうどいいですか？",
  },
  {
    key: "l4-nonnegotiable",
    layer: "l4",
    title: "譲れないこと",
    ask: "これだけは譲れない、ということってありますか？",
  },
  {
    key: "l4-timeline",
    layer: "l4",
    title: "何年後にどうなっていたいか",
    ask: "3年後、どんな暮らしをしていたいですか？",
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
