import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/shell/Sidebar'
import MobileTopBar from '@/components/shell/MobileTopBar'
import MobileBottomNav from '@/components/shell/MobileBottomNav'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 所属相談所名（オーナーなら自分の相談所、そうでなければ counselor.agency_id から解決）
  let agencyName: string | undefined
  const { data: ownedAgencies } = await supabase.from('agencies').select('name').eq('owner_user_id', user.id).limit(1)
  if (ownedAgencies && ownedAgencies.length > 0) {
    agencyName = ownedAgencies[0].name
  } else {
    const { data: c } = await supabase.from('counselors').select('agency_id').eq('owner_user_id', user.id).maybeSingle()
    if (c?.agency_id) {
      const { data: ag } = await supabase.from('agencies').select('name').eq('id', c.agency_id).maybeSingle()
      if (ag?.name) agencyName = ag.name
    }
  }

  return (
    <div>
      {/* デスクトップ：サイドバー (>=860px) */}
      <div className="hidden-mobile">
        <Sidebar />
      </div>

      {/* モバイル：トップバー (<860px) */}
      <div className="hidden-desktop">
        <MobileTopBar accountName={user.email?.charAt(0).toUpperCase()} agencyName={agencyName} />
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
