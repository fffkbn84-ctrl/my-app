// futarive-counselor/lib/disclosure.ts
// 予約者の連絡先（本名・メール・電話）の開示判定。
// Stripe の送客料決済が確定（webhook で user_info_visible=true）したら開示。
// Stripe 導入(2026-06-14)前の旧予約は従来どおり開示（grandfather）。

const STRIPE_LAUNCH_AT = Date.parse('2026-06-14T00:00:00Z')

export function isContactDisclosed(r: {
  user_info_visible?: boolean | null
  created_at?: string | null
}): boolean {
  if (r.user_info_visible) return true
  if (!r.created_at) return true
  return Date.parse(r.created_at) < STRIPE_LAUNCH_AT
}

/**
 * 一覧表示用の名前。開示済みなら本名、未開示ならニックネーム（無ければ「お客様（決済前）」）。
 */
export function reservationListName(
  r: { user_info_visible?: boolean | null; created_at?: string | null; user_name?: string | null },
  nickname?: string | null,
): string {
  if (isContactDisclosed(r)) return r.user_name || '（氏名未登録）'
  return nickname && nickname.trim() ? nickname.trim() : 'お客様（決済前）'
}
