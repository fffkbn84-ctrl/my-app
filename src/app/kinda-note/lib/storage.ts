import type { RouteKey, WeatherKey } from "../data/weatherDescriptions";

/**
 * Kinda note の履歴を localStorage に保存する。
 *
 * フェーズ1ではゲスト前提で localStorage のみ。
 * フェーズ2 以降の DB 移行（kinda_note_sessions テーブル）と
 * 同じ構造を保つこと。フェーズ4で変換ロジックを書かずに済む。
 */

const STORAGE_KEY = "kinda_note_history";
const MAX_ITEMS = 100;

export type KindaNoteHistoryItem = {
  /** uuid v4 */
  id: string;
  route: RouteKey;
  /** 例: "Kinda 朝もや" */
  result_type: string;
  /** 例: "morning_mist" */
  weather: WeatherKey;
  /** 回答全体 */
  answers: Record<string, unknown>;
  /** ISO 8601 */
  created_at: string;
  /**
   * レア傾き演出フラグ（3% 確率）。
   * フェーズ5の天気ダッシュボードで「✨」マーク表示の判定に使う。
   */
  isRareTilt?: boolean;
  /**
   * カードの傾き角度。例: "rotate(-1.2deg)"
   * フェーズ5でミニチュアカードに適用して履歴を傾けて表示できる。
   */
  tiltAngle?: string;
};

export type KindaNoteHistory = KindaNoteHistoryItem[];

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // フォールバック（非 secure context など）
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveKindaNoteHistory(item: {
  route: RouteKey;
  result_type: string;
  weather: WeatherKey;
  answers: Record<string, unknown>;
  meta?: { isRareTilt?: boolean; tiltAngle?: string };
}): KindaNoteHistoryItem | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: KindaNoteHistory = raw ? JSON.parse(raw) : [];

    const newItem: KindaNoteHistoryItem = {
      id: generateId(),
      route: item.route,
      result_type: item.result_type,
      weather: item.weather,
      answers: item.answers,
      created_at: new Date().toISOString(),
      isRareTilt: item.meta?.isRareTilt ?? false,
      tiltAngle: item.meta?.tiltAngle ?? "rotate(0deg)",
    };

    history.push(newItem);

    const trimmed = history.slice(-MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    return newItem;
  } catch {
    return null;
  }
}

export function loadKindaNoteHistory(): KindaNoteHistory {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as KindaNoteHistory) : [];
  } catch {
    return [];
  }
}
