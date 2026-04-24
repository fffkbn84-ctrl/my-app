'use client'

import { createClient } from './client'

export async function logAuthEvent(
  eventType: 'login_success' | 'login_failure' | 'logout' | 'password_reset_requested',
  result: 'success' | 'failure' = 'success',
  metadata: Record<string, unknown> = {}
) {
  try {
    const supabase = createClient()
    await supabase.rpc('log_audit_event', {
      p_event_category: 'auth',
      p_event_type: eventType,
      p_event_result: result,
      p_metadata: metadata,
      p_actor_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    })
  } catch {
    // 監査ログ失敗は無視（アプリの動作を妨げない）
  }
}

export async function logPersonalDataAccess(
  table: 'reservations' | 'reviews',
  targetId: string,
  ownerId: string | null = null
) {
  try {
    const supabase = createClient()
    await supabase.rpc('log_audit_event', {
      p_event_category: 'data_access',
      p_event_type: `${table}_view`,
      p_target_table: table,
      p_target_id: targetId,
      p_target_owner_user_id: ownerId,
    })
  } catch {
    // 監査ログ失敗は無視
  }
}
