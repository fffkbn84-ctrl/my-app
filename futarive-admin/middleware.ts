import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // /api/webhooks/* は外部システム（Supabase Database Webhook 等）からの POST を受け取るため、
  // 認証ガードの対象外にする。Route Handler 内で別途シークレット検証を行う。
  if (request.nextUrl.pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 未ログインは /login 以外へ入れない
  if (!user && pathname !== '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ログイン済みでも「futarive 運営（admin_users.role='admin'）」以外は管理画面に入れない。
  // カウンセラー/相談所オーナーの Supabase アカウントでこの管理画面に到達できる
  // 多層防御の穴を塞ぐ（RLS は別途効いているが、UI への到達自体を止める）。
  // admin_users は self-select ポリシー（id = auth.uid()）で自分の行のみ読める。
  let isAdmin = false
  if (user) {
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    isAdmin = (adminRow as { role?: string } | null)?.role === 'admin'
  }

  // 非 admin のログインユーザーは /login のみ許可（無限リダイレクト防止のため、
  // /login からの自動遷移は admin のときだけ行う）。
  if (user && !isAdmin && pathname !== '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAdmin && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
