import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Use placeholder values when env vars are absent (preview / local without .env.local)
// so the module loads without throwing. Queries will fail and getCounselors() /
// getAgencies() in data.ts fall back to mock data automatically.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
