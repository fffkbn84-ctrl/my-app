"use client";

import { useFavorites } from "./useFavorites";

/**
 * @deprecated useFavorites を直接使ってください。
 *
 * 後方互換のために残したエイリアス。
 * 既存の SaveButton / counselor-detail 等が type と id を受け取って
 * { saved, toggle } を返す API に依存しているため、シグネチャを維持。
 */
export function useSaved(type: "counselor" | "agency", id: string | number) {
  const { saved, toggle } = useFavorites(type, id);
  return { saved, toggle };
}
