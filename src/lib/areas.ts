/**
 * エリア定義（共通モジュール）
 *
 * Kinda talk のエリアフィルター・futarive-counselor のプロフィール「活動エリア」入力と
 * 連動させるための単一データソース。
 *
 * - REGIONS: 8 つの地域 + 47 都道府県を一覧化
 * - REGION_OPTIONS: 「関東」などの地域カテゴリ（広域オプション）
 * - PREFECTURES: 47 都道府県のフラットな配列
 * - ALL_AREAS: 地域 + 都道府県 + 「オンライン」+「その他」 ＝ 全選択肢
 * - regionOf(prefecture): 都道府県名から所属地域を逆引き
 * - prefecturesInRegion(region): 地域名 → その地域に属する都道府県の配列
 */

export type AreaRegion = {
  region: string;
  prefectures: string[];
};

export const REGIONS: readonly AreaRegion[] = [
  { region: "北海道・東北", prefectures: ["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島"] },
  { region: "関東",        prefectures: ["東京", "神奈川", "埼玉", "千葉", "茨城", "栃木", "群馬"] },
  { region: "甲信越・北陸", prefectures: ["新潟", "富山", "石川", "福井", "山梨", "長野"] },
  { region: "東海",        prefectures: ["岐阜", "静岡", "愛知", "三重"] },
  { region: "関西",        prefectures: ["大阪", "京都", "兵庫", "滋賀", "奈良", "和歌山"] },
  { region: "中国",        prefectures: ["鳥取", "島根", "岡山", "広島", "山口"] },
  { region: "四国",        prefectures: ["徳島", "香川", "愛媛", "高知"] },
  { region: "九州・沖縄",   prefectures: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"] },
] as const;

/** 8 地域名のみ（広域カテゴリとして「関東」「関西」などを選びたいときに使う） */
export const REGION_OPTIONS: readonly string[] = REGIONS.map((r) => r.region);

/** 47 都道府県のフラット配列 */
export const PREFECTURES: readonly string[] = REGIONS.flatMap((r) => r.prefectures);

export const ONLINE_OPTION = "オンライン";
export const OTHER_OPTION = "その他";

/**
 * 全選択肢（カウンセラー管理画面の <select> に並べる順番）
 * 地域カテゴリ → 都道府県 → オンライン → その他
 */
export const ALL_AREAS: readonly string[] = [
  ...REGION_OPTIONS,
  ...PREFECTURES,
  ONLINE_OPTION,
  OTHER_OPTION,
];

/** 都道府県 → 所属地域（例: "東京" → "関東"） */
export function regionOf(prefecture: string): string | null {
  for (const r of REGIONS) {
    if (r.prefectures.includes(prefecture)) return r.region;
  }
  return null;
}

/** 地域名 → 所属都道府県の配列 */
export function prefecturesInRegion(region: string): readonly string[] {
  return REGIONS.find((r) => r.region === region)?.prefectures ?? [];
}

/**
 * 入力文字列が地域名かどうか
 * （カウンセラーが「関東」と設定している場合の絞り込み判定で使う）
 */
export function isRegion(value: string): boolean {
  return REGION_OPTIONS.includes(value);
}

/**
 * カウンセラーの area 文字列から先頭の都道府県/地域名を抽出
 * 例: "東京・銀座" → "東京"、"関東" → "関東"、"オンライン" → "オンライン"
 */
export function extractAreaKey(area: string | null | undefined): string {
  if (!area) return "";
  return area.split(/[・\s]/)[0] ?? area;
}

/**
 * フィルター比較ロジック
 * filterValue が地域名なら、area がその地域に属する都道府県かどうかで判定。
 * filterValue が都道府県/オンライン/その他/地域名 のときの一致判定。
 */
export function matchesAreaFilter(area: string | null | undefined, filterValue: string): boolean {
  if (!filterValue || filterValue === "すべて") return true;
  const key = extractAreaKey(area);
  if (!key) return false;

  // 完全一致（都道府県・オンライン・その他・地域名）
  if (key === filterValue) return true;

  // フィルターが地域名 → 該当地域の都道府県をすべて含める
  if (isRegion(filterValue)) {
    return prefecturesInRegion(filterValue).includes(key);
  }

  return false;
}
