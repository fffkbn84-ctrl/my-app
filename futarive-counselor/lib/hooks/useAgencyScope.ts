// futarive-counselor/lib/hooks/useAgencyScope.ts
//
// オーナー（複数カウンセラーを抱える相談所オーナー）が "今編集 / 表示中" の
// カウンセラーを切り替えるための共通 hook。
//
// dashboard / inbox / calendar 等で個別に書かれていたロジックを共通化。
// localStorage キー 'kinda-dashboard-context' を共有する（既存と互換）。
//
// 使い方:
//   const { isOwner, counselors, scope, setScope, activeCounselor, loading } = useAgencyScope()
//
// scope の値:
//   - 'ALL': 相談所全体
//   - <counselor.id>: 個別カウンセラー
//
// activeCounselor は:
//   - scope === 'ALL' なら counselors[0]（先頭・存在しなければ null）
//   - scope が個別 id なら該当 Counselor

'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor, Agency } from '@/lib/types'

const STORAGE_KEY = 'kinda-dashboard-context'
export const SCOPE_ALL = 'ALL'

export type AgencyScope = {
  loading: boolean
  isOwner: boolean
  agencies: Agency[]
  counselors: Counselor[]
  scope: string
  setScope: (next: string) => void
  activeCounselor: Counselor | null
  reload: () => Promise<void>
}

export function useAgencyScope(): AgencyScope {
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [scope, setScopeState] = useState<string>(SCOPE_ALL)

  const setScope = useCallback((next: string) => {
    setScopeState(next)
    try {
      if (next === SCOPE_ALL) localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage 不可（SSR / Privacy mode 等）→ 無視
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: agencyRows } = await supabase
      .from('agencies').select('*').eq('owner_user_id', user.id)
    const ownerMode = !!(agencyRows && agencyRows.length > 0)
    setIsOwner(ownerMode)
    setAgencies((agencyRows as Agency[]) ?? [])

    let list: Counselor[] = []
    if (ownerMode) {
      const { data: ac } = await supabase
        .from('counselors').select('*')
        .in('agency_id', (agencyRows as Agency[]).map(a => a.id))
        .order('created_at', { ascending: true })
      list = (ac as Counselor[]) ?? []
    } else {
      const { data: own } = await supabase
        .from('counselors').select('*')
        .eq('owner_user_id', user.id).maybeSingle()
      if (own) list = [own as Counselor]
    }
    setCounselors(list)

    // localStorage 復元（存在しない id だったら ALL にリセット）
    let initial: string = SCOPE_ALL
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && list.some(c => c.id === stored)) initial = stored
    } catch {}
    setScopeState(initial)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const activeCounselor =
    scope === SCOPE_ALL
      ? counselors[0] ?? null
      : counselors.find(c => c.id === scope) ?? null

  return { loading, isOwner, agencies, counselors, scope, setScope, activeCounselor, reload: load }
}
