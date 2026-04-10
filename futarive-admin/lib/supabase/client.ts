import { createBrowserClient } from '@supabase/ssr'

// Return type is `any` to avoid Supabase SDK v2 inference issues where
// .update()/.insert() arguments become `never` without a Database generic.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
