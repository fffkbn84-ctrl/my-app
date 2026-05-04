/**
 * エリア <select> の共通 option 群。
 * 結婚相談所 / カウンセラー / デートの場所 / 美容店 すべてで同じ階層構造を使う：
 *   広域・オンライン（全国・オンライン）→ エリア（広域）→ 47 都道府県
 * futarive-counselor のプロフィール「活動エリア」と完全一致。
 *
 * SearchModal、/agencies AgenciesClient、その他のエリア絞り込み <select> から
 * 共通利用する。
 */

import {
  PREFECTURE_GROUPS,
  BROAD_REGIONS,
  NATIONAL_OPTION,
  ONLINE_OPTION,
  extractAreaKey,
  prefecturesInBroadRegion,
} from "@/lib/areas";

/**
 * 任意の {area?: string} 配列からキー単位のカウントマップを作成。
 * "東京"・"東京都"・"東京・銀座" 等は extractAreaKey で正規化される。
 */
export function buildAreaCountMap<T extends { area?: string | null; areaLabel?: string | null }>(
  items: T[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const it of items) {
    const raw = it.area ?? it.areaLabel ?? "";
    const k = extractAreaKey(raw);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

/**
 * countMap: 都道府県名 / 広域エリア名 / オンライン → 件数 のマップ。
 * 件数 0 の選択肢は disabled でグレーアウト。
 */
export default function AreaOptions({ countMap }: { countMap: Map<string, number> }) {
  // 全件数（「全国」用）
  const total = Array.from(countMap.values()).reduce((s, n) => s + n, 0);

  // 広域エリアの件数（含まれる都道府県の合計 + 直接登録）
  const broadCount = (name: string): number => {
    const direct = countMap.get(name) ?? 0;
    const sum = prefecturesInBroadRegion(name).reduce(
      (s, p) => s + (countMap.get(p) ?? 0),
      0,
    );
    return direct + sum;
  };

  const renderOption = (value: string, label: string, count: number) => {
    const disabled = count === 0;
    return (
      <option key={value} value={value} disabled={disabled}>
        {label}
        {disabled ? "（0件）" : ""}
      </option>
    );
  };

  return (
    <>
      <option value="">すべて</option>
      <optgroup label="広域・オンライン">
        {renderOption(NATIONAL_OPTION, NATIONAL_OPTION, total)}
        {renderOption(ONLINE_OPTION, ONLINE_OPTION, countMap.get(ONLINE_OPTION) ?? 0)}
      </optgroup>
      <optgroup label="エリア（広域）">
        {BROAD_REGIONS.map((r) => renderOption(r.name, r.name, broadCount(r.name)))}
      </optgroup>
      {PREFECTURE_GROUPS.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.prefectures.map((p) => renderOption(p, p, countMap.get(p) ?? 0))}
        </optgroup>
      ))}
    </>
  );
}
