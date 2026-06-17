// src/lib/bookingDefaults.ts
// 予約フォームの氏名/フリガナを本人だけが読み書きできる専用テーブル(user_booking_defaults)に
// 保存し、次回以降の予約で自動入力するためのヘルパー。
// profiles は public read のため本名は置けない（owner 限定テーブルを使う）。

import type { SupabaseClient } from "@supabase/supabase-js";

export type BookingDefaults = { fullName: string; fullNameKana: string };

export async function loadBookingDefaults(
  supabase: SupabaseClient | null,
  userId: string | null | undefined,
): Promise<BookingDefaults | null> {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from("user_booking_defaults")
    .select("full_name, full_name_kana")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return null;
  const row = data as { full_name: string | null; full_name_kana: string | null };
  return { fullName: row.full_name ?? "", fullNameKana: row.full_name_kana ?? "" };
}

export async function saveBookingDefaults(
  supabase: SupabaseClient | null,
  userId: string | null | undefined,
  d: BookingDefaults,
): Promise<void> {
  if (!supabase || !userId) return;
  const full_name = d.fullName.trim();
  const full_name_kana = d.fullNameKana.trim();
  if (!full_name && !full_name_kana) return;
  await supabase
    .from("user_booking_defaults")
    .upsert(
      {
        user_id: userId,
        full_name: full_name || null,
        full_name_kana: full_name_kana || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
}
