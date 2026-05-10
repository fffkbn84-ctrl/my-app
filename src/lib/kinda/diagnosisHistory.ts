"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Kinda type / Kinda note の診断履歴を Supabase（ログイン時）/
 * localStorage（ゲスト時）の両方で扱うためのヘルパー。
 *
 * - ログイン時：diagnosis_results テーブルへ INSERT / SELECT
 * - ゲスト時：localStorage("kinda_diagnosis_history") に保存
 * - ログイン直後：localStorage の保存を Supabase へマージ
 *
 * SQL 未実行 / env 未設定でも localStorage で完全動作する。
 */

export type DiagnosisKind = "type" | "note";

export type DiagnosisHistoryItem = {
  id: string;
  kind: DiagnosisKind;
  /** type: 'A' | 'B' | 'C' | 'D' / note: weatherKey */
  result_key: string;
  answers: Record<string, unknown>;
  /** ISO 8601 */
  created_at: string;
};

const STORAGE_KEY = "kinda_diagnosis_history";
const MAX_ITEMS = 50;

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readLocal(): DiagnosisHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items: DiagnosisHistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-MAX_ITEMS)));
  } catch {
    /* quota exceeded などは握りつぶす */
  }
}

/**
 * 診断結果を保存する。
 * - ログイン時：Supabase の diagnosis_results へ INSERT
 * - ゲスト時：localStorage に追加（最大 50 件）
 */
export async function saveDiagnosisResult(args: {
  kind: DiagnosisKind;
  result_key: string;
  answers: Record<string, unknown>;
  supabase: SupabaseClient | null;
  userId: string | null;
}): Promise<void> {
  const { kind, result_key, answers, supabase, userId } = args;

  if (supabase && userId) {
    try {
      await supabase.from("diagnosis_results").insert({
        user_id: userId,
        kind,
        result_key,
        answers,
      });
      return;
    } catch {
      // ネットワーク・RLS 等のエラー時は localStorage にフォールバック
    }
  }

  const item: DiagnosisHistoryItem = {
    id: generateId(),
    kind,
    result_key,
    answers,
    created_at: new Date().toISOString(),
  };
  const list = readLocal();
  list.push(item);
  writeLocal(list);
}

/**
 * 診断履歴を取得する。
 * - ログイン時：Supabase から取得（created_at 降順）
 * - ゲスト時：localStorage から復元
 */
export async function fetchDiagnosisHistory(args: {
  supabase: SupabaseClient | null;
  userId: string | null;
  kind?: DiagnosisKind;
  limit?: number;
}): Promise<DiagnosisHistoryItem[]> {
  const { supabase, userId, kind, limit = 20 } = args;

  if (supabase && userId) {
    let query = supabase
      .from("diagnosis_results")
      .select("id, kind, result_key, answers, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (kind) query = query.eq("kind", kind);
    const res = await query;
    return (res.data ?? []) as DiagnosisHistoryItem[];
  }

  const sorted = readLocal()
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const filtered = kind ? sorted.filter((i) => i.kind === kind) : sorted;
  return filtered.slice(0, limit);
}

/**
 * ログイン直後に localStorage の履歴を Supabase へマージする。
 * 失敗（重複・RLS 等）は個別に握りつぶす。マージ完了後 localStorage は空にする。
 */
export async function mergeLocalDiagnosisToSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const local = readLocal();
  if (local.length === 0) return;
  const rows = local.map((item) => ({
    user_id: userId,
    kind: item.kind,
    result_key: item.result_key,
    answers: item.answers,
    created_at: item.created_at,
  }));
  await Promise.all(
    rows.map(async (r) => {
      try {
        await supabase.from("diagnosis_results").insert(r);
      } catch {
        /* 既に存在する等のエラーは無視 */
      }
    }),
  );
  writeLocal([]);
}
