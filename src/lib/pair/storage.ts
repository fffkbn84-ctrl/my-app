/**
 * src/lib/pair/storage.ts
 *
 * Kinda pair ひとりモードの状態保存。
 *
 * 注意：v1.0 の設計方針：**サーバに一切送らない。**
 *    このファイルにも呼び出し元にも fetch / Supabase を書かないこと。
 *    保存先は localStorage のみ。ブラウザの保存データを消せば記録も消える。
 */

import type { PairState } from "./topics";

const STORAGE_KEY = "kinda_pair_solo_v1";

export type PairSoloStore = {
  states: Record<string, PairState>;
  /** ISO 8601 */
  updatedAt: string;
};

const EMPTY: PairSoloStore = { states: {}, updatedAt: "" };

export function loadPairSolo(): PairSoloStore {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as PairSoloStore).states !== "object" ||
      (parsed as PairSoloStore).states === null
    ) {
      return EMPTY;
    }
    return {
      states: (parsed as PairSoloStore).states ?? {},
      updatedAt: (parsed as PairSoloStore).updatedAt ?? "",
    };
  } catch {
    return EMPTY;
  }
}

export function savePairSolo(states: Record<string, PairState>): void {
  if (typeof window === "undefined") return;
  try {
    const payload: PairSoloStore = {
      states,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 容量超過 / プライベートモード等は握りつぶす（機能は継続する）
  }
}

export function clearPairSolo(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
