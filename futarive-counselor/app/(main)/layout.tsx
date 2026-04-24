import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/shell/Sidebar'
import MobileTopBar from '@/components/shell/MobileTopBar'
import MobileBottomNav from '@/components/shell/MobileBottomNav'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      {/* デスクトップ：サイドバー (>=860px) */}
      <div className="hidden-mobile">
        <Sidebar />
      </div>

      {/* モバイル：トップバー (<860px) */}
      <div className="hidden-desktop">
        <MobileTopBar accountName={user.email?.charAt(0).toUpperCase()} />
      </div>

      {/* メインコンテンツ */}
      <main className="kc-main">
        {children}
      </main>

      {/* モバイル：ボトムナビ (<860px) */}
      <div className="hidden-desktop">
        <MobileBottomNav />
      </div>

      <style>{`
        @media (min-width: 860px) { .hidden-desktop { display: none !important; } }
        @media (max-width: 859px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}
