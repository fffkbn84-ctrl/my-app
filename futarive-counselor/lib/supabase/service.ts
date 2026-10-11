import { createClient } from '@supabase/supabase-js'

/**
 * service role の Supabase クライアント（サーバー専用・RLS とガードを通らない）。
 *
 * agencies.stripe_customer_id / card_registered_at は、本人のセッションからは
 * 書き換えられない（DB のガードトリガーで拒否）。カード登録の API ルートでだけ、
 * 本人確認を済ませたうえでこのクライアントから書き込む。
 * 環境変数が無いときは null を返す。
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
