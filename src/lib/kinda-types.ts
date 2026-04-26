/* ────────────────────────────────────────────────────────────
   Kinda type — 6つの婚活タイプ定義
   /kinda-talk のリール一覧、診断結果、カウンセラーカードで使用。
   既存の diagnosis.ts (A/B/C/D の4タイプ) とは別系統。
──────────────────────────────────────────────────────────── */

export type KindaTypeKey =
  | "anshin"
  | "jibunjiku"
  | "zenryoku"
  | "senryaku"
  | "lifestyle"
  | "restart";

export type KindaType = {
  key: KindaTypeKey;
  name: string;
  shortName: string;
  description: string;
  color: string;
  bg: string;
};

export const KINDA_TYPES: Record<KindaTypeKey, KindaType> = {
  anshin: {
    key: "anshin",
    name: "安心伴走型",
    shortName: "安心",
    description: "焦らず寄り添ってほしい人へ。",
    color: "#A8C4A0",
    bg: "#E8F4E4",
  },
  jibunjiku: {
    key: "jibunjiku",
    name: "自分軸探索型",
    shortName: "自分軸",
    description: "価値観を整理しながら進めたい人へ。",
    color: "#D4A090",
    bg: "#FAEAE5",
  },
  zenryoku: {
    key: "zenryoku",
    name: "全力サポート型",
    shortName: "全力",
    description: "二人三脚で走り抜けたい人へ。",
    color: "#C89090",
    bg: "#F5E5E1",
  },
  senryaku: {
    key: "senryaku",
    name: "戦略行動型",
    shortName: "戦略",
    description: "計画的に短期で結果を出したい人へ。",
    color: "#A0B8D4",
    bg: "#E0ECF8",
  },
  lifestyle: {
    key: "lifestyle",
    name: "ライフスタイル両立型",
    shortName: "両立",
    description: "仕事と婚活を無理なく両立したい人へ。",
    color: "#B0A090",
    bg: "#F0E5D6",
  },
  restart: {
    key: "restart",
    name: "再スタート応援型",
    shortName: "再出発",
    description: "もう一度やり直したい人へ。",
    color: "#A8C4A0",
    bg: "#E8F4E4",
  },
};

export const KINDA_TYPE_KEYS: KindaTypeKey[] = [
  "anshin",
  "jibunjiku",
  "zenryoku",
  "senryaku",
  "lifestyle",
  "restart",
];
