"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthState = {
  user: User | null;
  loading: boolean;
  /** 同一インスタンスを使い回したいので Provider 内で生成して context で渡す */
  supabase: SupabaseClient | null;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  supabase: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // env vars が無い環境（プレビュー / build 時）でも壊れないように
  // try-catch で createBrowserClient を初期化
  const supabase = useMemo<SupabaseClient | null>(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    try {
      // CLAUDE.md: createBrowserClient<Database>() の Database generic は
      //            .update() の型推論を壊すため使用しない
      return createBrowserClient(url, key);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => ({ user, loading, supabase }), [user, loading, supabase]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
