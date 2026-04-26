"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

export type FavoriteType = "counselor" | "agency" | "place";

const STORAGE_KEY = "kinda-favorites-v2";

type LocalFavorites = Record<string, true>;

function localKey(type: FavoriteType, id: string | number): string {
  return `${type}:${String(id)}`;
}

function readLocal(): LocalFavorites {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocal(map: LocalFavorites) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota exceeded など */
  }
}

/**
 * 「気になる」状態を Supabase（ログイン時）/ localStorage（未ログイン時）で管理。
 *
 * - ログイン時：favorites テーブルから読み書き
 * - 未ログイン時：localStorage に保存
 * - ログイン直後：localStorage の保存を Supabase へマージ（重複は ON CONFLICT 相当）
 *
 * SQL 未実行 / env 未設定でも localStorage で完全動作する。
 */
export function useFavorites(type: FavoriteType, id: string | number) {
  const { user, supabase } = useAuth();
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const targetId = String(id);

  /* 初期化：current state を判定 */
  useEffect(() => {
    let active = true;
    async function init() {
      if (user && supabase) {
        const res = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("target_type", type)
          .eq("target_id", targetId)
          .maybeSingle();
        if (!active) return;
        setSaved(!!res.data);
        setReady(true);
      } else {
        const map = readLocal();
        setSaved(!!map[localKey(type, targetId)]);
        setReady(true);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [user, supabase, type, targetId]);

  const toggle = useCallback(async () => {
    const next = !saved;
    setSaved(next);

    if (user && supabase) {
      try {
        if (next) {
          await supabase.from("favorites").insert({
            user_id: user.id,
            target_type: type,
            target_id: targetId,
          });
        } else {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("target_type", type)
            .eq("target_id", targetId);
        }
      } catch {
        // RLS エラー等。state は楽観的に変更済み。
      }
    } else {
      const map = readLocal();
      const k = localKey(type, targetId);
      if (next) {
        map[k] = true;
      } else {
        delete map[k];
      }
      writeLocal(map);
    }
  }, [saved, user, supabase, type, targetId]);

  return { saved, toggle, ready };
}

/**
 * ログインユーザーの全 favorites をまとめて取得（マイページ等で使用）。
 */
export function useFavoritesList() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [list, setList] = useState<
    { target_type: FavoriteType; target_id: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !supabase) {
      // ログインしていない時は localStorage から復元
      const map = readLocal();
      const restored = Object.keys(map).map((k) => {
        const [target_type, target_id] = k.split(":");
        return {
          target_type: target_type as FavoriteType,
          target_id,
          created_at: "",
        };
      });
      setList(restored);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const res = await supabase
        .from("favorites")
        .select("target_type, target_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!active) return;
      const data = (res.data ?? []) as Array<{
        target_type: FavoriteType;
        target_id: string;
        created_at: string;
      }>;
      setList(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user, supabase, authLoading]);

  return { favorites: list, loading };
}

/**
 * ログイン直後に localStorage の保存を Supabase へマージする。
 * - すでに DB にある行は ON CONFLICT 相当（unique 制約により）でスキップ
 * - マージ後、localStorage は維持（キャッシュとして）
 */
export async function mergeLocalFavoritesToSupabase(
  supabase: NonNullable<ReturnType<typeof useAuth>["supabase"]>,
  userId: string,
) {
  const map = readLocal();
  const rows = Object.keys(map).map((k) => {
    const [target_type, target_id] = k.split(":");
    return {
      user_id: userId,
      target_type: target_type as FavoriteType,
      target_id,
    };
  });
  if (rows.length === 0) return;
  // unique 制約で重複行は失敗する → 1件ずつ insert して個別エラーを握りつぶす
  await Promise.all(
    rows.map(async (r) => {
      try {
        await supabase.from("favorites").insert(r);
      } catch {
        /* 既に存在する等のエラーは無視 */
      }
    }),
  );
}
