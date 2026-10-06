import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouteKey } from "../data/weatherDescriptions";
import type { CardWeatherKey } from "../data/daily";

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
  /** "daily" は毎日モード「今日の天気」（2026-10） */
  route: RouteKey | "daily";
  /** 例: "Kinda 朝もや" */
  result_type: string;
  /** 例: "morning_mist" */
  weather: CardWeatherKey;
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
  /**
   * 毎日モードの分をマイページ（Supabase の diagnosis_results）へ送った日時。
   * ログイン前につけた分も、ログイン後に syncDailyToSupabase で送る（2026-10-04）
   */
  synced_at?: string;
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
  route: RouteKey | "daily";
  result_type: string;
  weather: CardWeatherKey;
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

function writeKindaNoteHistory(history: KindaNoteHistory) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_ITEMS)));
  } catch {
    /* quota など無視 */
  }
}

/**
 * 毎日モード「今日の天気」のうち、まだマイページに送っていない分を Supabase へ送る。
 * 天気・日付・選んだ答え・一言を保存する（2026-10-04 ふうか決定：振り返るために登録する人へ、できるだけ残す）。
 * 二重送信を避けるため、送る前に synced_at を付けてから送り、失敗した分だけ外す。
 */
export async function syncDailyToSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  if (typeof window === "undefined") return;
  const history = loadKindaNoteHistory();
  const pending = history.filter((it) => it.route === "daily" && !it.synced_at);
  if (pending.length === 0) return;

  const now = new Date().toISOString();
  const ids = new Set(pending.map((it) => it.id));
  writeKindaNoteHistory(history.map((it) => (ids.has(it.id) ? { ...it, synced_at: now } : it)));

  const { error } = await supabase.from("diagnosis_results").insert(
    pending.map((it) => ({
      user_id: userId,
      kind: "note",
      result_key: it.weather,
      answers: { route: "daily", ...it.answers },
      created_at: it.created_at,
    })),
  );
  if (error) {
    // 送れなかったので、次の機会にもう一度送る
    writeKindaNoteHistory(
      loadKindaNoteHistory().map((it) => (ids.has(it.id) ? { ...it, synced_at: undefined } : it)),
    );
  }
}

/**
 * 「これまでの天気」（丸窓）に、マイページ（Supabase）の記録も合わせて並べる（2026-10-04）。
 * 機種変更・ブラウザのデータ削除のあとも、ログインしていれば前の天気が丸窓に出る。
 *
 * - before より前の記録だけを読む（今回の分を含めないため。before は保存の前に取る）
 * - 端末の記録と同じものは、天気が同じで時刻の差が60秒以内なら1つとみなす
 * - 新しい順に limit 件
 */
export async function mergeRemoteRecent(
  local: KindaNoteHistoryItem[],
  supabase: SupabaseClient,
  userId: string,
  before: string,
  limit = 6,
): Promise<KindaNoteHistoryItem[]> {
  const { data, error } = await supabase
    .from("diagnosis_results")
    .select("id, result_key, answers, created_at")
    .eq("user_id", userId)
    .eq("kind", "note")
    .lt("created_at", before)
    .order("created_at", { ascending: false })
    .limit(limit * 2);
  if (error || !data) return local;

  const sameAsLocal = (weather: string, at: string) =>
    local.some(
      (it) =>
        it.weather === weather &&
        Math.abs(new Date(it.created_at).getTime() - new Date(at).getTime()) <= 60_000,
    );
  const remote: KindaNoteHistoryItem[] = data
    .filter((r) => !sameAsLocal(r.result_key, r.created_at))
    .map((r) => ({
      id: `remote-${r.id}`,
      route: ((r.answers as { route?: string } | null)?.route ?? "omiai") as RouteKey | "daily",
      result_type: "",
      weather: r.result_key as CardWeatherKey,
      answers: {},
      created_at: r.created_at,
    }));

  return [...local, ...remote]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, limit);
}
