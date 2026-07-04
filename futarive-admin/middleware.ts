import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// admin は運営内部のみが使う画面のため、Supabase ログインの手前に共有パスワードの壁を置く。
// ADMIN_BASIC_AUTH_USER / ADMIN_BASIC_AUTH_PASSWORD が Vercel env に未設定の間は
// 従来どおり無効（移行期間中に誤って全員ロックアウトしないためのフェイルオープン）。
function checkBasicAuth(request: NextRequest): NextResponse | null {
  const expectedUser = process.env.ADMIN_BASIC_AUTH_USER
  const expectedPassword = process.env.ADMIN_BASIC_AUTH_PASSWORD
  if (!expectedUser || !expectedPassword) {
    return null
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8')
    const separatorIndex = decoded.indexOf(':')
    const user = decoded.slice(0, separatorIndex)
    const password = decoded.slice(separatorIndex + 1)
    if (user === expectedUser && password === expectedPassword) {
      return null
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Kinda Admin"' },
  })
}

export async function middleware(request: NextRequest) {
  // /api/webhooks/* は外部システム（Supabase Database Webhook 等）からの POST を受け取るため、
  // 認証ガードの対象外にする。Route Handler 内で別途シークレット検証を行う。
  if (request.nextUrl.pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next()
  }

  const basicAuthResponse = checkBasicAuth(request)
  if (basicAuthResponse) {
    return basicAuthResponse
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
