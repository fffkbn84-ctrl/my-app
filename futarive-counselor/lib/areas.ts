/**
 * エリア定義（共通モジュール）
 *
 * Kinda talk のエリアフィルター・futarive-counselor のプロフィール「活動エリア」入力で
 * 共有する単一データソース。
 *
 * 構造（4 階層）:
 *   1. NATIONAL_OPTION       … 全国（すべての都道府県にマッチ）
 *   2. ONLINE_OPTION         … オンライン
 *   3. BROAD_REGIONS         … 首都圏 / 関東 / 関西（近畿）/ 東海 / 北陸 / 甲信越 /
 *                              東北 / 北海道 / 中国 / 四国 / 九州・沖縄
 *      （複数県をまたいで活動するカウンセラー向けの広域選択肢）
 *   4. PREFECTURE_GROUPS     … 47 都道府県を地理的にグルーピング
 *      （UI 上での見出しは: 北海道・東北 / 関東 / 中部 / 近畿 / 中国・四国 / 九州・沖縄）
 *
 * 都道府県表記には「県/都/府/道」の suffix を含む（例: "東京都", "京都府", "北海道"）。
 * counselor.area に保存される値もこの表記に揃える前提。
 */

export type PrefectureGroup = {
  /** UI 上の見出しラベル */
  label: string;
  /** この見出しの下に並ぶ都道府県（suffix 込み） */
  prefectures: string[];
};

export type BroadRegion = {
  /** ユーザーが選ぶ表示名（例: "首都圏（東京・神奈川・千葉・埼玉）"） */
  name: string;
  /** この広域に含まれる都道府県（matchesAreaFilter で使用） */
  prefectures: string[];
};

/* ────────────────────────────────────────────────────────────
   1. 47 都道府県のグルーピング表示
──────────────────────────────────────────────────────────── */
export const PREFECTURE_GROUPS: readonly PrefectureGroup[] = [
  {
    label: "北海道・東北",
    prefectures: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  },
  {
    label: "関東",
    prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  },
  {
    label: "中部",
    prefectures: [
      "新潟県", "富山県", "石川県", "福井県",
      "山梨県", "長野県",
      "岐阜県", "静岡県", "愛知県",
    ],
  },
  {
    label: "近畿",
    prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  },
  {
    label: "中国・四国",
    prefectures: [
      "鳥取県", "島根県", "岡山県", "広島県", "山口県",
      "徳島県", "香川県", "愛媛県", "高知県",
    ],
  },
  {
    label: "九州・沖縄",
    prefectures: [
      "福岡県", "佐賀県", "長崎県", "熊本県",
      "大分県", "宮崎県", "鹿児島県", "沖縄県",
    ],
  },
] as const;

export const ALL_PREFECTURES: readonly string[] = PREFECTURE_GROUPS.flatMap(
  (g) => g.prefectures
);

/* ────────────────────────────────────────────────────────────
   2. 広域エリア（複数県をまたぐ選択肢）
──────────────────────────────────────────────────────────── */
export const BROAD_REGIONS: readonly BroadRegion[] = [
  {
    name: "首都圏（東京・神奈川・千葉・埼玉）",
    prefectures: ["東京都", "神奈川県", "千葉県", "埼玉県"],
  },
  {
    name: "関東",
    prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  },
  {
    name: "関西（近畿）",
    prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  },
  {
    name: "東海",
    prefectures: ["岐阜県", "静岡県", "愛知県", "三重県"],
  },
  {
    name: "北陸",
    prefectures: ["富山県", "石川県", "福井県"],
  },
  {
    name: "甲信越",
    prefectures: ["新潟県", "山梨県", "長野県"],
  },
  {
    name: "東北",
    prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  },
  {
    name: "北海道",
    prefectures: ["北海道"],
  },
  {
    name: "中国",
    prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  },
  {
    name: "四国",
    prefectures: ["徳島県", "香川県", "愛媛県", "高知県"],
  },
  {
    name: "九州・沖縄",
    prefectures: [
      "福岡県", "佐賀県", "長崎県", "熊本県",
      "大分県", "宮崎県", "鹿児島県", "沖縄県",
    ],
  },
] as const;

export const BROAD_REGION_NAMES: readonly string[] = BROAD_REGIONS.map((r) => r.name);

/* ────────────────────────────────────────────────────────────
   3. 全国・オンライン
──────────────────────────────────────────────────────────── */
export const NATIONAL_OPTION = "全国";
export const ONLINE_OPTION = "オンライン";

/**
 * すべての選択肢のフラット配列（順番は futarive-counselor のドロップダウンと同じ）
 *   全国 → オンライン → 11 広域エリア → 47 都道府県
 */
export const ALL_AREA_OPTIONS: readonly string[] = [
  NATIONAL_OPTION,
  ONLINE_OPTION,
  ...BROAD_REGION_NAMES,
  ...ALL_PREFECTURES,
];

/* ────────────────────────────────────────────────────────────
   4. ヘルパー関数
──────────────────────────────────────────────────────────── */

/** 広域エリア名かどうか */
export function isBroadRegion(value: string): boolean {
  return BROAD_REGION_NAMES.includes(value);
}

/** 都道府県名（"東京都" / "北海道" / etc.）かどうか */
export function isPrefecture(value: string): boolean {
  return ALL_PREFECTURES.includes(value);
}

/** 広域エリア名 → 含まれる都道府県の配列 */
export function prefecturesInBroadRegion(name: string): readonly string[] {
  return BROAD_REGIONS.find((r) => r.name === name)?.prefectures ?? [];
}

/**
 * counselor.area 文字列から先頭の有効な「キー」を抽出
 * 例: "東京都・銀座"   → "東京都"
 *     "首都圏（...）"   → "首都圏（東京・神奈川・千葉・埼玉）"（完全一致時のみ）
 *     "オンライン"      → "オンライン"
 *
 * 区切り（・/ スペース）で分けた最初のセグメントを返す。
 * ただし広域エリア名は括弧を含むので、完全一致を優先的にチェックする。
 */
export function extractAreaKey(area: string | null | undefined): string {
  if (!area) return "";
  // 全国・オンライン・広域エリア名の完全一致
  if (area === NATIONAL_OPTION) return NATIONAL_OPTION;
  if (area === ONLINE_OPTION) return ONLINE_OPTION;
  if (isBroadRegion(area)) return area;
  // 都道府県の完全一致
  if (isPrefecture(area)) return area;
  // "東京都・銀座" のように区切り付き → 最初のセグメントが都道府県/広域なら採用
  const head = area.split(/[・\s]/)[0] ?? area;
  if (isPrefecture(head) || isBroadRegion(head)) return head;
  return head;
}

/**
 * counselor.area がフィルター値に一致するか判定
 *  - filter = "全国"           → 必ずマッチ（カウンセラー全員が対象）
 *  - filter = 広域エリア名     → 含まれる都道府県（または広域名そのもの）にマッチ
 *  - filter = 都道府県         → 完全一致
 *  - filter = "オンライン"     → 完全一致
 */
export function matchesAreaFilter(
  area: string | null | undefined,
  filter: string
): boolean {
  if (!filter || filter === "すべて") return true;
  if (filter === NATIONAL_OPTION) return true;

  const key = extractAreaKey(area);
  if (!key) return false;
  if (key === filter) return true;

  // 広域フィルター → 含まれる都道府県のいずれか、または広域名と一致
  if (isBroadRegion(filter)) {
    return prefecturesInBroadRegion(filter).includes(key);
  }

  return false;
}
