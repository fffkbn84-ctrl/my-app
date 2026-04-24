'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Agency, Counselor, AgencyContext } from '@/lib/types'

export function useAgencyContext(): AgencyContext & {
  loading: boolean
  setSelectedAgencyId: (id: string | null) => void
  setCurrentCounselorId: (id: string | null) => void
} {
  const [loading, setLoading] = useState(true)
  const [ownedAgencies, setOwnedAgencies] = useState<Agency[]>([])
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null)
  const [currentCounselor, setCurrentCounselor] = useState<Counselor | null>(null)
  const [currentCounselorId, setCurrentCounselorId] = useState<string | null>(null)
  const [counselorsInScope, setCounselorsInScope] = useState<Counselor[]>([])
  const [mode, setMode] = useState<'owner' | 'counselor' | 'both'>('counselor')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // 相談所オーナーチェック
      const { data: agencies } = await supabase
        .from('agencies')
        .select('*')
        .eq('owner_user_id', user.id)

      // カウンセラー本人チェック
      const { data: ownCounselor } = await supabase
        .from('counselors')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle()

      const isOwner = agencies && agencies.length > 0
      const isCounselor = !!ownCounselor

      if (isOwner && isCounselor) {
        setMode('both')
      } else if (isOwner) {
        setMode('owner')
      } else {
        setMode('counselor')
      }

      setOwnedAgencies((agencies as Agency[]) ?? [])

      const firstAgencyId = agencies?.[0]?.id ?? null
      const agencyId = selectedAgencyId ?? firstAgencyId
      setSelectedAgencyId(agencyId)

      // 編集対象カウンセラー一覧
      let counselors: Counselor[] = []
      if (isOwner && agencyId) {
        const { data: agCounselors } = await supabase
          .from('counselors')
          .select('*')
          .eq('agency_id', agencyId)
          .order('name')
        counselors = (agCounselors as Counselor[]) ?? []
      } else if (isCounselor && ownCounselor) {
        counselors = [ownCounselor as Counselor]
      }
      setCounselorsInScope(counselors)

      // 現在編集中のカウンセラー
      if (currentCounselorId) {
        const found = counselors.find(c => c.id === currentCounselorId) ?? null
        setCurrentCounselor(found)
      } else if (isCounselor && ownCounselor) {
        setCurrentCounselor(ownCounselor as Counselor)
      } else if (counselors.length > 0) {
        setCurrentCounselor(counselors[0])
      }

      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgencyId, currentCounselorId])

  return {
    loading,
    mode,
    ownedAgencies,
    selectedAgencyId,
    currentCounselor,
    counselorsInScope,
    setSelectedAgencyId,
    setCurrentCounselorId,
  }
}
