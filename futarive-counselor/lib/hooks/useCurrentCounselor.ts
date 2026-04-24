'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Counselor } from '@/lib/types'

export function useCurrentCounselor(counselorId: string | null) {
  const [counselor, setCounselor] = useState<Counselor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!counselorId) { setLoading(false); return }
    const load = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('counselors')
        .select('*')
        .eq('id', counselorId)
        .maybeSingle()
      setCounselor(data as Counselor | null)
      setLoading(false)
    }
    load()
  }, [counselorId])

  return { counselor, loading }
}
