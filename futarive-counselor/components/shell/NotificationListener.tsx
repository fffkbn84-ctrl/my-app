'use client'

// K-5: ブラウザ通知 グローバル listener
//
// (main)/layout.tsx で全ページにマウントされる。
//
// - reservations / reviews テーブルの INSERT を Supabase Realtime で購読
// - 自分が見えるカウンセラー（オーナーなら全カウンセラー）の行だけ通知発火
// - ユーザー設定 (isPreferenceEnabled) と permission ('granted') の AND 条件で発火
// - permission/preference が無効でも購読自体はせず、リソースを使わない
// - counselor 一覧が変わったら resubscribe

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAgencyScope } from '@/lib/hooks/useAgencyScope'
import {
  getPermissionState,
  isPreferenceEnabled,
  showNotification,
} from '@/lib/notifications'

interface ReservationRow {
  id: string
  counselor_id: string | null
  user_name: string | null
  start_at: string | null
  notes: string | null
}

interface ReviewRow {
  id: string
  counselor_id: string | null
  rating: number | null
}

function formatStartAt(iso: string | null): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const m = d.getMonth() + 1
    const day = d.getDate()
    const h = d.getHours()
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${m}/${day} ${h}:${min}`
  } catch {
    return ''
  }
}

export default function NotificationListener() {
  const { counselors, loading } = useAgencyScope()
  // counselor.name を id で逆引きするための map
  const counselorMapRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    counselorMapRef.current = new Map(counselors.map((c) => [c.id, c.name]))
  }, [counselors])

  useEffect(() => {
    if (loading) return
    if (counselors.length === 0) return

    // 設定 OFF か permission 未許可なら購読しない（無駄なコネクションを張らない）
    if (!isPreferenceEnabled()) return
    if (getPermissionState() !== 'granted') return

    const supabase = createClient()
    const allowedIds = new Set(counselors.map((c) => c.id))

    const channel = supabase
      .channel('notify-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reservations' },
        (payload: { new: ReservationRow }) => {
          const row = payload.new
          if (!row.counselor_id || !allowedIds.has(row.counselor_id)) return
          const counselorName = counselorMapRef.current.get(row.counselor_id) ?? ''
          const userName = row.user_name ?? 'お客様'
          const when = formatStartAt(row.start_at)
          const titleBase = counselorName ? `新しい予約：${counselorName}` : '新しい予約'
          showNotification({
            title: titleBase,
            body: when ? `${userName} さん（${when}）` : `${userName} さんからの予約`,
            url: '/inbox',
            tag: `reservation-${row.id}`,
          })
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reviews' },
        (payload: { new: ReviewRow }) => {
          const row = payload.new
          if (!row.counselor_id || !allowedIds.has(row.counselor_id)) return
          const counselorName = counselorMapRef.current.get(row.counselor_id) ?? ''
          const stars = row.rating ? '★'.repeat(row.rating) : ''
          const titleBase = counselorName ? `新しい口コミ：${counselorName}` : '新しい口コミ'
          showNotification({
            title: titleBase,
            body: stars ? `評価 ${stars}` : '口コミが投稿されました',
            url: '/reviews',
            tag: `review-${row.id}`,
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [counselors, loading])

  return null
}
