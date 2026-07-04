// futarive-counselor/app/api/login/route.ts
//
// counselorログインをサーバー側で仲介し、ブルートフォース対策（10回失敗で30分ロック）を行う。
// login_lockouts テーブル（email をキーに failed_attempts/locked_until を持つ。
// futarive-admin と共用）を service_role で読み書きする。
// 実際のサインインは cookie 連携のため lib/supabase/server.ts の anon キークライアントで行う。
//
// 必要な環境変数:
//   - NEXT_PUBLIC_SUPABASE_URL
//   - NEXT_PUBLIC_SUPABASE_ANON_KEY（既存）
//   - SUPABASE_SERVICE_ROLE_KEY（新規に追加が必要）

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

const MAX_ATTEMPTS = 10
const LOCK_MINUTES = 30

type LockoutRow = {
  failed_attempts: number
  locked_until: string | null
}

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'リクエストが不正です' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password
  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[api/login] Supabase env missing')
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 })
  }
  const serviceClient = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // 1. ロック状態を確認
  const { data: lockoutRow } = await serviceClient
    .from('login_lockouts')
    .select('failed_attempts, locked_until')
    .eq('email', email)
    .maybeSingle()
  const lockout = lockoutRow as LockoutRow | null

  if (lockout?.locked_until && new Date(lockout.locked_until) > new Date()) {
    const minutesLeft = Math.max(
      1,
      Math.ceil((new Date(lockout.locked_until).getTime() - Date.now()) / 60_000)
    )
    return NextResponse.json(
      { error: `ログイン試行が多すぎるため一時的にロックされています。約${minutesLeft}分後に再度お試しください。` },
      { status: 423 }
    )
  }

  // 2. サインイン試行（cookie連携のため lib/supabase/server.ts のクライアントを使う）
  const supabase = await createServerSupabaseClient()
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData.user) {
    const nextAttempts = (lockout?.failed_attempts ?? 0) + 1
    const shouldLock = nextAttempts >= MAX_ATTEMPTS
    await serviceClient.from('login_lockouts').upsert({
      email,
      failed_attempts: shouldLock ? 0 : nextAttempts,
      locked_until: shouldLock
        ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    return NextResponse.json({ error: 'おっと、メールアドレスかパスワードが違うようです' }, { status: 401 })
  }

  // 3. 成功 → 失敗カウントをリセット
  await serviceClient.from('login_lockouts').delete().eq('email', email)

  return NextResponse.json({ ok: true })
}
