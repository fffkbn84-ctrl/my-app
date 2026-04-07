/* ────────────────────────────────────────────────────────────
   ふたりへ — 婚活タイプ診断ロジック（4タイプ版）
   将来の設問変更・タイプ追加はこのファイルのみ編集すれば対応可能。
   TODO: Supabase連携後に診断結果をDBに保存
         answers, result_type, timestamp を diagnosis_results テーブルに保存する
──────────────────────────────────────────────────────────── */

export type DiagnosisTypeId = "A" | "B" | "C" | "D";

export type DiagnosisOption = {
  label: string;
  type: DiagnosisTypeId;
};

export type DiagnosisQuestion = {
  id: number;
  text: string;
  options: DiagnosisOption[];
};

export type DiagnosisType = {
  id: DiagnosisTypeId;
  name: string;
  label: string;
  description: string[];
  color: string;
  gradient: string;
  counselorType: string;
  counselorDesc: string;
  subRoute: "cafe" | "beauty" | "counselor";
  tags: string[];
};

/* ────────────────────────────────────────────────────────────
   診断タイプ定義（4種）
──────────────────────────────────────────────────────────── */
export const DIAGNOSIS_TYPES: Record<DiagnosisTypeId, DiagnosisType> = {
  A: {
    id: "A",
    name: "慎重分析タイプ",
    label: "情報が多いほど迷いやすい状態です",
    description: [
      "正しく選ぼうとしすぎている",
      "判断基準が増えすぎている",
    ],
    color: "#B8912A",
    gradient: "linear-gradient(135deg,#EDE4D4,#D4C4A0)",
    counselorType: "ロジカル系カウンセラー",
    counselorDesc: "根拠を示しながら一緒に整理してくれる担当者",
    subRoute: "counselor",
    tags: ["分析型", "論理重視", "じっくり選びたい"],
  },
  B: {
    id: "B",
    name: "自信低下タイプ",
    label: "本来の魅力が伝わりにくい状態です",
    description: [
      "自分を抑えすぎている",
      "相手に合わせすぎている",
    ],
    color: "#8B6240",
    gradient: "linear-gradient(135deg,#E8D8C8,#D4B89A)",
    counselorType: "寄り添い型カウンセラー",
    counselorDesc: "否定せずじっくり話を聞いてくれる担当者",
    subRoute: "beauty",
    tags: ["自己不安", "安心重視", "寄り添い希望"],
  },
  C: {
    id: "C",
    name: "環境影響タイプ",
    label: "人より環境の影響を受けやすい状態です",
    description: [
      "空気や場所で印象が変わりやすい",
      "無意識に疲れている可能性もあります",
    ],
    color: "#2D5A3D",
    gradient: "linear-gradient(135deg,#D4E4D8,#B0C8B4)",
    counselorType: "共感型カウンセラー",
    counselorDesc: "感情を受け止めながら進めてくれる担当者",
    subRoute: "cafe",
    tags: ["環境重視", "空気感", "ゆっくりペース"],
  },
  D: {
    id: "D",
    name: "直感型",
    label: "感覚で選びやすく、ズレが起きやすい状態です",
    description: [
      "フィーリング重視で動いている",
      "再現性が低くなりやすい",
    ],
    color: "#3D2D5A",
    gradient: "linear-gradient(135deg,#D8D4E8,#BEB4D4)",
    counselorType: "バランス型カウンセラー",
    counselorDesc: "直感を活かしながら軸を作ってくれる担当者",
    subRoute: "cafe",
    tags: ["直感型", "フィーリング重視", "自由なペース"],
  },
};

/* ────────────────────────────────────────────────────────────
   質問データ（8問）
──────────────────────────────────────────────────────────── */
export const QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 1,
    text: "デート後、頭に残るのは？",
    options: [
      { label: "相手の話し方や価値観", type: "A" },
      { label: "自分がどう見られたか", type: "B" },
      { label: "お店や空気の心地よさ", type: "C" },
      { label: "なんとなくの違和感", type: "D" },
    ],
  },
  {
    id: 2,
    text: "初対面で一番気になるのは？",
    options: [
      { label: "会話の内容", type: "A" },
      { label: "自分の振る舞い", type: "B" },
      { label: "空気が合うか", type: "C" },
      { label: "緊張してよく覚えてない", type: "D" },
    ],
  },
  {
    id: 3,
    text: "うまくいかなかったとき、最初に思うのは？",
    options: [
      { label: "相手の価値観や条件が合わなかった", type: "A" },
      { label: "自分の振る舞いが良くなかったかも", type: "B" },
      { label: "場の雰囲気やタイミングが悪かった", type: "C" },
      { label: "正直、理由がよくわからない", type: "D" },
    ],
  },
  {
    id: 4,
    text: "会う前に考えることは？",
    options: [
      { label: "どんな人か（プロフィール）", type: "A" },
      { label: "失敗しないか不安", type: "B" },
      { label: "どこで会うか（場所）", type: "C" },
      { label: "行ってみないとわからない", type: "D" },
    ],
  },
  {
    id: 5,
    text: "会話が続かないときは？",
    options: [
      { label: "相手との相性の問題", type: "A" },
      { label: "自分の話し方が悪い", type: "B" },
      { label: "場の空気が合ってない", type: "C" },
      { label: "なんか違うと感じる", type: "D" },
    ],
  },
  {
    id: 6,
    text: "理想のデートは？",
    options: [
      { label: "話が盛り上がる", type: "A" },
      { label: "安心していられる", type: "B" },
      { label: "自然体でいられる空間", type: "C" },
      { label: "フィーリングが合う", type: "D" },
    ],
  },
  {
    id: 7,
    text: "誰かに相談するとしたら？",
    options: [
      { label: "的確なアドバイスがほしい", type: "A" },
      { label: "優しく話を聞いてほしい", type: "B" },
      { label: "一緒に整理してほしい", type: "C" },
      { label: "直感で背中を押してほしい", type: "D" },
    ],
  },
  {
    id: 8,
    text: "今の自分に近いのは？",
    options: [
      { label: "ちゃんと選びたい", type: "A" },
      { label: "失敗したくない", type: "B" },
      { label: "疲れている", type: "C" },
      { label: "深く考えたくない", type: "D" },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   スコア計算ロジック
   answers: questionId -> type letter のマップ
   同点の場合は C > B > A > D の優先順位で決定
──────────────────────────────────────────────────────────── */
export function calculateResult(
  answers: Record<number, string>
): DiagnosisTypeId {
  const scores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((type) => {
    if (type in scores) scores[type]++;
  });
  const priority: DiagnosisTypeId[] = ["C", "B", "A", "D"];
  const max = Math.max(...Object.values(scores));
  return priority.find((t) => scores[t] === max) ?? "C";
}
